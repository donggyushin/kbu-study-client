import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { IAggregate } from '../../../constants/types';
import milisecondsConverter from '../../../utils/milisecondsConverter';
const humanizeDuration = require('humanize-duration')

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});


interface IProps {
    aggregates: IAggregate[]
    selectAggregate: (aggregate: IAggregate) => void
}

const AggregateTable: React.FC<IProps> = ({
    aggregates,
    selectAggregate
}) => {
    const classes = useStyles();

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>번호</TableCell>
                        <TableCell align="right">학번</TableCell>
                        <TableCell align="right">총 집계 시간</TableCell>
                        <TableCell align="right">시작</TableCell>
                        <TableCell align="right">종료</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {aggregates.map((row, i) => {
                        console.log("row: ", row)
                        return (

                            <TableRow onClick={() => {
                                selectAggregate(aggregates[i])
                            }} key={i}>
                                <TableCell component="th" scope="row">
                                    {i + 1}
                                </TableCell>

                                <TableCell align="right">{row.univ_id}</TableCell>
                                <TableCell align="right">{milisecondsConverter(row.value.total_seconds * 1000)}</TableCell>
                                <TableCell align="right">{row.value.detail[0] ? row.value.detail[0].from : "데이터 없음"}</TableCell>
                                <TableCell align="right">{row.value.detail[row.value.detail.length - 1] ? row.value.detail[row.value.detail.length - 1].to : "데이터 없음"}</TableCell>
                            </TableRow>

                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default AggregateTable