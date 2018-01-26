import React, { Component } from 'react';
import _ from 'lodash';
import Worker from '~/worker.js';
import LZUTF8 from 'lzutf8';
import createHistory from 'history/createBrowserHistory';
import querystring from 'querystring';

const myWorker = new Worker();


function transformEnvelopeData(envelope) {
    return _.assign(
        {},
        envelope,
        {
            data: remapData(envelope.data, envelope.compression)
        }
    )
}

function remapData(obj, mapping) {
    return _.mapKeys(
        obj,
        (value, key) => mapping[key]
    );
}

function decompressData(data) {
    const decompressedData = LZUTF8.decompress(
        data,
        { inputEncoding: 'Base64' }
    );

    const parsedData = JSON.parse(decompressedData);

    const compressionMap = _.get(parsedData, 'compressionMap');
    const rawData = _.get(parsedData, 'data');

    return _.map(
        rawData,
        data => remapData(data, compressionMap)
    );
}

function compressData(data) {
    function createCompressionMap(obj) {
        return _.reduce(
            obj,
            (agg, val, key) => {
                const abbrKey = key.slice(0, 1);
                agg[key] = abbrKey;
                agg[abbrKey] = key;
                return agg;
            },
            {}
        )
    }

    const compressionMap = createCompressionMap(_.first(data));

    const envelope = {
        data: _.map(data, point => remapData(point, compressionMap)),
        compressionMap
    };

    console.log(envelope);

    const compressedData = LZUTF8.compress(
        JSON.stringify(envelope),
        { outputEncoding: 'Base64' }
    );

    return compressedData;
}

const provideWebWorkerListener = Parent => {

    const history = createHistory();

    class WebWorkerListener extends Component {

        constructor(props) {
            super(props);

            this.state = {
                isProcessing: false,
                dataPoints: this.getDataPointsFromUrl()
            };

            this.onSubmit = this.onSubmit.bind(this);
        }

        getDataPointsFromUrl() {
            try {
                const queryParam = querystring.parse(history.location.search.substr(1));
                const rawData = _.get(queryParam, 'data');
                const decompressedData = decompressData(rawData);
                return decompressedData;
            }
            catch(e) {
                console.error(e);
                return [];
            }
        }

        addDataPoint(dataPoint) {
            this.setState(
                prevState => {

                    const newDataPoints =  _.concat(dataPoint, prevState.dataPoints);
                    const compressedData = compressData(newDataPoints);

                    history.push({
                        search: `?data=${compressedData}`
                    });

                    return {
                        dataPoints: newDataPoints
                    }
                }

            )
        }

        componentDidMount() {
            myWorker.addEventListener('message', message => {

                const command = _.get(message, ['data', 'command']);
                const options = _.get(message, ['data', 'options']);

                if (command == 'doneProcessing') {
                    const newDataPoint = _.get(options, 'result');
                    console.log(newDataPoint);
                    this.setState({
                        isProcessing: false
                    });
                    this.addDataPoint(newDataPoint);
                }

            })
        }

        onSubmit(e, formValues) {
            e.preventDefault();

            myWorker.postMessage({
                command: 'doSimulation',
                options: formValues
            });

            this.setState({isProcessing: true});
        }

        render() {
            return <Parent
                ref='parent'
                onSubmit={ this.onSubmit }
                isProcessing={this.state.isProcessing}
                dataPoints={this.state.dataPoints}
            />
        }
    }

    return WebWorkerListener;
}


export default provideWebWorkerListener;
