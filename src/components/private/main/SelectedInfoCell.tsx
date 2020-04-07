import React, { useRef, useEffect, useState } from "react";
import './SelectedInfoCellStyles.scss'
import { Info } from '../../../constants/types'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import axios from 'axios'
import { ADMIN_END_POINT } from "../../../constants/endpoint";

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});


interface IProps {
    info: Info
    unSelectInfoCell: () => void
    changeAggregateOfInfo: (access_id: number) => void
}

function useOutsideAlerter(ref: any, unSelectInfoCell: () => void) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event: any) {
            if (ref.current && !ref.current.contains(event.target)) {
                unSelectInfoCell()
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


const SelectedInfoCell: React.FC<IProps> = ({ info, unSelectInfoCell, changeAggregateOfInfo }) => {
    const classes = useStyles();
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, unSelectInfoCell);


    const [selectedInfo, setSelectedInfo] = useState(info)

    return <div className={"SelectedInfoCell"}>
        <div ref={wrapperRef} className="container">
            <div className="top_table">
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>이름</TableCell>
                                <TableCell align="right">학번</TableCell>
                                <TableCell align="right">전공</TableCell>
                                <TableCell align="right">자동/수동</TableCell>
                                <TableCell align="right">접근 시각</TableCell>
                                <TableCell align="right">인증 관리자</TableCell>
                                <TableCell align="right">관리자 부서</TableCell>
                                <TableCell align="right">데이터 생성시각</TableCell>
                                <TableCell align="right">데이터 업데이트시각</TableCell>
                                <TableCell align="right">인증 IP</TableCell>
                                <TableCell align="right">집계제외</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow key={selectedInfo.access_id}>
                                <TableCell component="th" scope="row">
                                    {selectedInfo.user_name}
                                </TableCell>
                                <TableCell align="right">{selectedInfo.user_univ_id}</TableCell>
                                <TableCell align="right">{selectedInfo.user_major}</TableCell>
                                <TableCell align="right">{selectedInfo.is_manual ? <span className="table__red_text">수동</span> : <span>자동</span>}</TableCell>
                                <TableCell align="right">{selectedInfo.access_datetime}</TableCell>
                                <TableCell align="right">{selectedInfo.admin_id}</TableCell>
                                <TableCell align="right">{selectedInfo.admin_dept}</TableCell>
                                <TableCell align="right">{selectedInfo.created_datetime}</TableCell>
                                <TableCell align="right">{selectedInfo.updated_datetime}</TableCell>
                                <TableCell align="right">{selectedInfo.ip_addr}</TableCell>
                                <TableCell align="right">{selectedInfo.disabled_aggregate ? <img className="checked_mark" src="/checked.png" /> : ""}</TableCell>
                            </TableRow>

                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <div className="aggregate__toggle__button__container">
                {selectedInfo.disabled_aggregate ? <button onClick={aggregateCancleButtonTapped}>
                    집계제외해제
            </button> : <button onClick={aggregateButtonTapped}>
                        집계제외
            </button>}
            </div>
        </div>
    </div>

    function aggregateCancleButtonTapped() {
        const result = window.confirm("정말 해당 데이터를 집계데이터에 추가시키겠습니까?")
        if (result) {

            axios.patch(`${ADMIN_END_POINT}msc/log`, {
                access_id: info.access_id,
                disabled_aggregate: false
            }, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
                .then(res => {
                    if (res.status === 204) {
                        changeAggregateOfInfo(info.access_id)
                        let updatedInfo = selectedInfo
                        updatedInfo.disabled_aggregate = false
                        setSelectedInfo(updatedInfo)
                    }
                })
                .catch(err => {
                    console.log(err)
                    alert("에러발생")
                })
        }
    }

    function aggregateButtonTapped() {
        const result = window.confirm("정말 해당 데이터를 집계데이터에서 제외하시겠습니까?")
        if (result) {
            console.log("집계데이터 제외")
            axios.patch(`${ADMIN_END_POINT}msc/log`, {
                access_id: info.access_id,
                disabled_aggregate: true
            }, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
                .then(res => {

                    if (res.status === 204) {
                        changeAggregateOfInfo(info.access_id)
                        let updatedInfo = selectedInfo
                        updatedInfo.disabled_aggregate = true
                        setSelectedInfo(updatedInfo)

                    }
                })
                .catch(err => {
                    console.log(err)
                    alert("에러발생")
                })
        }
    }
}

export default SelectedInfoCell