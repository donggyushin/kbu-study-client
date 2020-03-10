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
}

const SimpleTable: React.FC<IProps> = ({ infos, noLabelTapped }) => {
    const classes = useStyles();

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell onClick={noLabelTapped}>no</TableCell>
                        <TableCell onClick={noLabelTapped} align="right">Access Time</TableCell>
                        <TableCell align="right">Type</TableCell>
                        <TableCell align="right">Student</TableCell>
                        <TableCell align="right">Student Num</TableCell>
                        <TableCell align="right">Major</TableCell>
                        <TableCell align="right">Admin</TableCell>
                        <TableCell align="right">Admin Depart</TableCell>
                        <TableCell align="right">ip address</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {infos.map((info, i) => (
                        <TableRow key={i}>
                            <TableCell component="th" scope="row">
                                {info.no}
                            </TableCell>
                            <TableCell align="right">{info.access_time}</TableCell>
                            <TableCell align="right">{info.access_type}</TableCell>
                            <TableCell align="right">{info.user_name}</TableCell>
                            <TableCell align="right">{info.user_univ_id}</TableCell>
                            <TableCell align="right">{info.user_major}</TableCell>
                            <TableCell align="right">{info.admin_id}</TableCell>
                            <TableCell align="right">{info.admin_department}</TableCell>
                            <TableCell align="right">{info.ip_addr}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default SimpleTable