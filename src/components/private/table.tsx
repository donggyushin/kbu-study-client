import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Info } from '../../constants/types';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});



interface IProps {
    infos: Info[]
    noLabelTapped: () => void
    turnOnExitTimeInput: (text: string) => void
}

const SimpleTable: React.FC<IProps> = ({ infos, noLabelTapped, turnOnExitTimeInput }) => {
    const classes = useStyles();

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell onClick={noLabelTapped}>no</TableCell>
                        <TableCell onClick={noLabelTapped} align="right">이름</TableCell>
                        <TableCell align="right">학번</TableCell>
                        <TableCell align="right">전공</TableCell>
                        <TableCell align="right">입실</TableCell>
                        <TableCell align="right">퇴실</TableCell>
                        <TableCell align="right">분환산</TableCell>
                        <TableCell align="right">분환산</TableCell>
                        <TableCell align="right">ip address</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {infos.map((info, i) => (
                        <TableRow key={i}>
                            <TableCell component="th" scope="row">
                                {info.access_id}
                            </TableCell>
                            <TableCell align="right">{info.user_name}</TableCell>
                            <TableCell align="right">{info.user_univ_id}</TableCell>
                            <TableCell align="right">{info.user_major}</TableCell>
                            <TableCell align="right">{info.access_datetime}</TableCell>
                            <TableCell onClick={() => {
                                turnOnExitTimeInput("준비중")
                            }} align="right">{"준비중"}</TableCell>
                            <TableCell align="right">{new Date(info.access_datetime).getHours() + ":" + new Date(info.access_datetime).getMinutes()}</TableCell>
                            <TableCell align="right">{"준비중"}</TableCell>
                            <TableCell align="right">{info.ip_addr}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default SimpleTable