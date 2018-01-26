import React, { Component } from 'react';
import _ from 'lodash';
import Table, {
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
} from 'material-ui/Table';

class Chart extends Component {

    getHeaders() {
        return [
            {
                name: 'Fitness',
                key: 'fitness'
            },
            {
                name: 'Time',
                key: 'time'
            },
            {
                name: 'Population',
                key: 'populationSize'
            },
            {
                name: 'Age',
                key: 'age'
            },
            {
                name: 'Mutation Rate',
                key: 'mutationRate'
            }
        ];
    }

    render() {
        return (
            <Table>
                <TableHead>
                    <TableRow>
                        {
                            _.map(
                                this.getHeaders(),
                                headerConfig => (
                                    <TableCell key={_.get(headerConfig, 'key')}>
                                        { _.get(headerConfig, 'name') }
                                    </TableCell>
                                )
                            )
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        _.map(
                            this.props.rawData,
                            (row, id) => (
                                <TableRow key={id}>
                                    {
                                        _.map(
                                            this.getHeaders(),
                                            headerConfig => (
                                                <TableCell key={_.get(headerConfig, 'key')}>
                                                    { _.get(row, _.get(headerConfig, 'key')) }
                                                </TableCell>
                                            )
                                        )
                                    }
                                </TableRow>
                            )
                        )
                    }
                </TableBody>
            </Table>
        )

    }
}

export default Chart;
