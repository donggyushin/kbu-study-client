import 'date-fns';
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './styles.scss'
import { Info } from '../../../constants/types'
import axios from 'axios'
import { ADMIN_END_POINT } from '../../../constants/endpoint'
import { TextField } from '@material-ui/core'
import AlertDialog from '../../global/dialog'
import SimpleTable from '../table'
import ExitTimeInput from './exitTimeInput'
import ExcelDown from './excelDown'
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

var repeat: any

const Main = () => {



    const [infos, setInfos] = useState<Info[]>([])
    const [searchedInfos, setSearchedInfos] = useState<Info[]>([])
    const [searching, setSearching] = useState(false)
    const [dialogTitle, setDialogTitle] = useState("")
    const [dialogMessage, setDialogMessage] = useState("")
    const [dialog, setDialog] = useState(false)
    const [noDesc, setNoDesc] = useState(true)
    const [exitTimeInput, setExitTimeInput] = useState(false)
    const [exitTimeString, setExitTimeString] = useState("")
    const [excelDownView, setExcelDownView] = useState(false)
    const [selectedFromDate, setSelectedFromDate] = React.useState<Date | null>(
        new Date(),
    );
    const [selectedToDate, setSelectedToDate] = useState<Date | null>(new Date())




    useEffect(() => {

        if (selectedToDate && selectedFromDate) {
            fetchInfosFunction(selectedFromDate, selectedToDate)
        }

        makeDateInputElementInvalid()



        return function cleanup() {
            clearInterval(repeat)
        }
    }, [])



    return <div className="private__main__container">
        <div className="navigation__bar">
            <div className="button active">
                view
            </div>
            <Link to="/post" style={{
                textDecoration: "none",
                color: "black"
            }}>
                <div className="button">
                    post
            </div>
            </Link>
            <button onClick={logoutPressed}>로그아웃</button>
        </div>
        <div className="search_bar__container">
            <TextField id="outlined-basic" label="검색" variant="outlined" onChange={textFieldHandler} />
        </div>
        <div className="date__picker">
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container justify="space-around">
                    <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        label="검색 시작일"
                        value={selectedFromDate}
                        onChange={handleFromDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                    <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        label="검색 마지막일"
                        value={selectedToDate}
                        onChange={handleToDateChangee}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                </Grid>
            </MuiPickersUtilsProvider>
        </div>
        <div className="view__container">

            {searching ? <SimpleTable turnOnExitTimeInput={turnOnExitTimeInput} noLabelTapped={numberLabelTapped} infos={searchedInfos} /> : <SimpleTable turnOnExitTimeInput={turnOnExitTimeInput} noLabelTapped={numberLabelTapped} infos={infos} />}


            {dialog && <AlertDialog title={dialogTitle} message={dialogMessage} callback={closeAlertAndLogout} />}
        </div>

        <button onClick={excelDownButtonTapped} className="excel_down_button">
            엑셀다운
        </button>
        {(excelDownView && searching) && <ExcelDown turnOffExcelDownView={turnOffExcelDownView} datas={searchedInfos} />}
        {(excelDownView && !searching) && <ExcelDown turnOffExcelDownView={turnOffExcelDownView} datas={infos} />}

        {exitTimeInput && <ExitTimeInput
            turnOfExitTimeInput={turnOfExitTimeInput}
            handleExitTimeString={handleExitTimeString} exitTimeString={exitTimeString} />}
    </div>

    function fetchInfosFunction(dateFrom: Date, dateTo: Date) {

        fetchInfos(dateFrom, dateTo)
        repeat = setInterval(function () { fetchInfos(dateFrom, dateTo) }, 3000);
    }

    function makeDateInputElementInvalid() {
        const input = document.getElementById("date-picker-inline") as HTMLInputElement
        input.readOnly = true;
    }

    function handleToDateChangee(date: Date | null) {
        clearInterval(repeat)
        setSelectedToDate(date)
        if (selectedFromDate && date) {
            fetchInfosFunction(selectedFromDate, date)
        }

    }

    function handleFromDateChange(date: Date | null) {
        clearInterval(repeat)
        setSelectedFromDate(date)
        if (date && selectedToDate) {
            fetchInfosFunction(date, selectedToDate)
        }

    }

    function turnOffExcelDownView() {
        setExcelDownView(false)
    }

    function excelDownButtonTapped() {
        setExcelDownView(true)
    }

    function turnOfExitTimeInput() {
        setExitTimeInput(false)
    }

    function handleExitTimeString(e: React.ChangeEvent<HTMLInputElement>) {
        setExitTimeString(e.target.value)
    }

    function turnOnExitTimeInput(text: string) {
        setExitTimeInput(true)
        setExitTimeString(text)
    }

    function compareNumber(a: Info, b: Info) {
        if (a.access_id < b.access_id) {
            return -1;
        }
        if (a.access_id > b.access_id) {
            return 1;
        }
        return 0;
    }

    function compareNumber2(a: Info, b: Info) {
        if (a.access_id < b.access_id) {
            return 1;
        }
        if (a.access_id > b.access_id) {
            return -1;
        }
        return 0;
    }

    function numberLabelTapped() {
        const sortedInfos = noDesc ? infos.sort(compareNumber2) : infos.sort(compareNumber)
        setNoDesc(!noDesc)
        setSearchedInfos(sortedInfos)
    }

    function closeAlertAndLogout() {
        setDialog(false)
        logoutPressed()
    }

    function textFieldHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value
        if (value === "") {
            setSearchedInfos([])
            setSearching(false)
            return
        }

        const searchedInfos = infos.filter((info) => {


            if (info.user_name.includes(value) || info.user_major.includes(value)
                || info.admin_id.includes(value) || info.admin_dept.includes(value)
                || info.user_univ_id.includes(value) || info.ip_addr.includes(value)
            ) {
                return true
            } else {
                return false
            }

        })

        setSearchedInfos(searchedInfos)
        setSearching(true)
    }

    function fetchInfos(dateFrom: Date, dateTo: Date) {

        const date_from = `${dateFrom.getFullYear()}-${dateFrom.getMonth() + 1}-${dateFrom.getDate()}`
        const date_to = `${dateTo.getFullYear()}-${dateTo.getMonth() + 1}-${dateTo.getDate()}`

        axios.get(`${ADMIN_END_POINT}msc/log?date_from=${date_from}&date_to=${date_to}`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(res => {
                if (res.status === 200) {
                    const infos = res.data.data.data as Info[]
                    console.log("res: ", res)
                    console.log("infos: ", infos)
                    infos.sort(compareNumber2)
                    setInfos(infos)
                } else {
                    setDialogTitle("성서봇입니다")
                    setDialogMessage("현재 다른 기기에서 접속한 유저가 있습니다...")
                    setDialog(true)
                }
            })
            .catch(err => {
                console.error(err)
                setDialogTitle("성서봇입니다")
                setDialogMessage("현재 다른 기기에서 접속한 유저가 있습니다...")
                setDialog(true)
            })
    }




    function logoutPressed() {
        localStorage.removeItem("token")
        localStorage.removeItem("i")
        localStorage.removeItem("p")

        window.location.href = "/"
    }
}

export default Main