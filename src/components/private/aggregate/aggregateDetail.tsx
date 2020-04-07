import React, { useEffect, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { IAggregate } from '../../../constants/types';
import humanizeDuration from 'humanize-duration'

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

interface IProps {
    aggregate: IAggregate
    deselectAggregate: () => void
}

function useOutsideAlerter(ref: any, deselectAggregate: () => void) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event: any) {
            if (ref.current && !ref.current.contains(event.target)) {
                deselectAggregate()
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}

const AggregateDetail: React.FC<IProps> = ({
    aggregate,
    deselectAggregate
}) => {

    const classes = useStyles();

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, deselectAggregate);

    return <div className={"aggregate_detail_container"}>
        <div className="container" ref={wrapperRef}>
            <div className="top" >
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>

                                <TableCell>학번</TableCell>
                                <TableCell align="right">총 집계 시간</TableCell>
                                <TableCell align="right">시작</TableCell>
                                <TableCell align="right">종료</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow key={aggregate.univ_id}>
                                <TableCell component="th" scope="row">
                                    {aggregate.univ_id}
                                </TableCell>

                                <TableCell align="right">{humanizeDuration(aggregate.value.total_seconds * 1000)}</TableCell>
                                <TableCell align="right">{aggregate.value.detail[0] ? aggregate.value.detail[0].from : "데이터 없음"}</TableCell>
                                <TableCell align="right">{aggregate.value.detail[aggregate.value.detail.length - 1] ? aggregate.value.detail[aggregate.value.detail.length - 1].to : "데이터 없음"}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <div className="bottom" >
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>번호</TableCell>
                                <TableCell align="right">학번</TableCell>
                                <TableCell align="right">입실</TableCell>
                                <TableCell align="right">퇴실</TableCell>
                                <TableCell align="right">집계 시간</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {aggregate.value.detail.map((data, i) => {
                                return <TableRow key={aggregate.univ_id}>
                                    <TableCell component="th" scope="row">
                                        {i + 1}
                                    </TableCell>
                                    <TableCell align="right">
                                        {aggregate.univ_id}
                                    </TableCell>
                                    <TableCell align="right">{data.from}</TableCell>
                                    <TableCell align="right">{data.to}</TableCell>
                                    <TableCell align="right">{humanizeDuration(data.seconds)}</TableCell>
                                </TableRow>
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

        </div>

    </div>
}

export default AggregateDetail