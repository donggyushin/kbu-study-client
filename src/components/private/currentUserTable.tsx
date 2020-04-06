import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import './tableStyle.scss'
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

const CurrentUserTable: React.FC<IProps> = ({ infos, noLabelTapped, turnOnExitTimeInput }) => {
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
                        <TableCell align="right">자동/수동</TableCell>
                        <TableCell align="right">접근 시각</TableCell>
                        <TableCell align="right">인증 관리자</TableCell>
                        <TableCell align="right">인증 경과시간</TableCell>
                        <TableCell align="right">관리자 부서</TableCell>
                        {/* <TableCell align="right">데이터 생성시각</TableCell>
                        <TableCell align="right">데이터 업데이트시각</TableCell> */}
                        <TableCell align="right">인증 ip</TableCell>
                        <TableCell align="right">집계 제외</TableCell>
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
                            <TableCell align="right">{info.is_manual ? <span className="table__red_text">수동</span> : <span>자동</span>}</TableCell>
                            <TableCell align="right">{info.access_datetime}</TableCell>
                            <TableCell align="right">{info.admin_id}</TableCell>
                            <TableCell align="right">{
                                getTime(info.access_datetime)

                            }</TableCell>
                            <TableCell align="right">{info.admin_dept}</TableCell>
                            {/* <TableCell align="right">{info.created_datetime}</TableCell>
                            <TableCell align="right">{info.updated_datetime}</TableCell> */}
                            <TableCell align="right">{info.ip_addr}</TableCell>
                            <TableCell align="right">{info.disabled_aggregate ? <img className="checked_mark" src="/checked.png" /> : ""}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );


    function getTime(accessTime: string) {
        const now = new Date()
        const date = new Date(accessTime)
        const diffTime = Math.abs(now.getTime() - date.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60))

        return `${diffDays}분`
    }
}

export default CurrentUserTable