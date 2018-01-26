import React, { Component } from 'react';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Chart from '~/react/Chart';
import { CircularProgress } from 'material-ui/Progress';


class App extends Component {

    constructor(props) {
        super(props);

        this.state = _.assign(
            {},
            _.reduce(
                this.getInputConfig(),
                (agg, config) => _.set(agg, _.get(config, 'id'), _.get(config, 'value')),
                {}
            )
        );

        this.updateInput = this.updateInput.bind(this);
    }
    getInputConfig() {
        return [
            {
                id: 'populationSize',
                label: 'Population Size',
                type: 'number',
                value: 100
            },
            {
                id: 'age',
                label: 'Age',
                type: 'number',
                value: 500
            },
            {
                id: 'mutationRate',
                label: 'Mutation Rate',
                value: .5
            }
        ];
    }

    updateInput(e) {
        const id = e.target.getAttribute('id');
        const value = e.target.value;
        this.setState({ [id]: value})
    }

    getFormValues() {
        return _.pick(
            this.state,
            _.map(
                this.getInputConfig(),
                config => _.get(config, 'id')
            )
        );
    }

    render() {

        return (
            <form
                onSubmit={ (e) => this.props.onSubmit(e, this.getFormValues()) }
            >
                <Button
                    disabled={this.props.isProcessing}
                    raised
                    color='primary'
                    type='submit'
                >
                    Redraw

                    {
                        this.props.isProcessing ? (
                            <CircularProgress
                                size={20}
                                thickness={7}
                                color='accent'
                                style={{
                                    position: 'absolute',
                                    left: 0,
                                    right: 0,
                                    top: '50%',
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                    transform: 'translateY(-50%)'
                                }}
                            />
                        ) : (
                            null
                        )
                    }
                </Button>

                {
                    _.map(
                        this.getInputConfig(),
                        config => (
                            <TextField
                                key={ _.get(config, 'id') }
                                onChange={ this.updateInput }
                                { ...config }
                                value={this.state[_.get(config, 'id')]}
                            />
                        )
                    )
                }

                <Chart
                    rawData={this.props.dataPoints}
                />

            </form>
        );
    }
}

export default App;
