import { Population, Chromosome } from 'genetic-algorithm-js';
import blueprint from '~/data.json';
const _ = require('lodash');


export default ({ populationSize }) => {


    const SIZE_OF_POPULATION = 100;
    const AGE = 500;

    // Mutating everytime yields the best result
    const MUTATION_RATE = 1;

    const NUM_GENES = _.size(blueprint);

    const SORTED_BLUEPRINT_LOOKUP = _(blueprint)
        .keys()
        .sort()
        .map( keyName => _.get(blueprint, keyName) )
        .value()
    ;

    class KnapsackChromosome extends Chromosome {

        mutateGenes(genes) {
            const doMutation = Math.random() <=  MUTATION_RATE;

            if (doMutation) {
                const pivot = getRandomInt(0, genes.length);
                const mutatedValue = toNumber(!!!toNumber(genes.slice(pivot, pivot + 1)));
                return genes.slice(0, pivot) + mutatedValue + genes.slice(pivot + 1);
            }
            else {
                return genes;
            }
        }

        createGenes() {
            return _.join(
                _.map(
                    _.range( 0, _.size(blueprint) ),
                    () => Math.round(Math.random())
                ),
                ''
            );
        }

        calculateFitness() {
            const genes = this.getGenes();

            const penalty = 50;
            const maxWeight = 1000;

            const { value: reducedValue, weight: reducedWeight } = _.reduce(
                genes.split(''),
                (agg, val, idx) => {
                    if (toNumber(val)) {

                        const dataAtIndex = (
                            (SORTED_BLUEPRINT_LOOKUP || [])[idx]
                        ) || {};

                        const additionalWeight = toNumber(dataAtIndex['weight'])
                        const additionalValue = toNumber(dataAtIndex['value']);

                        agg.weight += additionalWeight;
                        agg.value += additionalValue;

                        return agg;

                    }
                    else {
                        return agg;
                    }
                },
                {
                    value: 0,
                    weight: 0
                }
            );

            const penaltyToDeduct = Math.max(reducedWeight - maxWeight, 0) * penalty;

            return reducedValue - penaltyToDeduct;
        }

        mate(partner) {
            return _.map(
                doStringMate(this.getGenes(), partner.getGenes()),
                genes => new KnapsackChromosome({genes})
            )
        }
    }

    class KnapsackPopulation extends Population {
        createChromosome() {
            return new KnapsackChromosome();
        }
    };

    _.forEach(
        _.range(0, 1),
        () => {
            console.log(
                _.last(
                    new KnapsackPopulation({
                        maximumSize: SIZE_OF_POPULATION,
                    })
                        .age(AGE)
                        .getMembers()
                )
            )
        }
    )

}

function doStringMate(str1, str2) {
    const maxPivot = Math.min(_.size(str1), _.size(str2));
    const pivot = getRandomInt(0, maxPivot);

    function joinMates(pivot, str1, str2) {
        return _.join(
            _.concat(
                str1.slice(
                    0,
                    pivot
                ),
                str2.slice(
                    pivot
                )
            ),
            ''
        )
    }

    return [
        joinMates(pivot, str1, str2),
        joinMates(pivot, str2, str1)
    ];
}

function toNumber(num) {
    return +num;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

