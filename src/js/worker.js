import { get } from 'lodash';
import simulator from '~/simulator';

self.addEventListener('message', message => {
    const command = _.get(message, ['data', 'command']);
    const options = _.get(message, ['data', 'options']);

    if (command == 'doSimulation') {

        const t0 = performance.now();
        const result = simulator(options);
        const t1 = performance.now();

        const dataPoint = _.assign(
            {},
            { fitness: result.getFitness() },
            { time: Math.round(t1 - t0) },
            options
        );

        self.postMessage({
            command: 'doneProcessing',
            options: { result: dataPoint }
        });
    }

})

export default self;
/*G

    redrawGraph(e) {
        e.preventDefault();
        this.props.onRedrawGraph);

        const paramsFromState = _.pick(
            this.state,
            _.map(
                this.getInputConfig(),
                config => _.get(config, 'id')
            )
        );

        const t0 = performance.now();
        const result = simulator(paramsFromState);
        const t1 = performance.now();

        const dataPoint = _.assign(
            {},
            { fitness: result.getFitness() },
            { time: Math.round(t1 - t0) },
            paramsFromState
        );

        this.setState(
            prevState => ({
                dataPoints: _.concat(dataPoint, prevState.dataPoints)
            })
        )

    }
    */
