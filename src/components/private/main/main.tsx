import 'date-fns';
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './styles.scss'
import { Info } from '../../../constants/types'
import axios from 'axios'
import { ADMIN_END_POINT } from '../../../constants/endpoint'
import { TextField, Button } from '@material-ui/core'
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
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import CurrentUserTable from '../currentUserTable';
import SelectedInfoCell from './SelectedInfoCell';

var repeat: any
var repeat2: any
var etag1: string
var etag2: string
var etag3: string

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
    }),
);

const Main = () => {


    // 여기서 infos 는 사용자 데이터라고 생각하면 됨
    const [infos, setInfos] = useState<Info[]>([])
    // 사용자 데이터를 받아올때마다 현재 사용자들만 따로 분류해놓은 데이터가 필요함
    const [currentUsers, setCurrentUsers] = useState<Info[]>([])
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
    const [allDept, setAllDept] = useState(false)
    const classes = useStyles();
    const [category, setCategory] = React.useState('');
    const [selectedInfo, setSelectedInfo] = useState<Info>()


    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setCategory(event.target.value as string);
    };


    useEffect(() => {

        const id = localStorage.getItem("i")
        const pw = localStorage.getItem("p")

        if (id && pw) {
            axios.post(`${ADMIN_END_POINT}auth/admin-login`, {
                id,
                pw
            })
                .then(res => {


                    if (res.status === 200) {

                        localStorage.setItem("i", id)
                        localStorage.setItem("p", pw)

                        const token = res.headers.authorization

                        if (token) {
                            localStorage.setItem("token", token)


                            getTodaysCurrentUsers()
                            repeat2 = setInterval(() => {
                                getTodaysCurrentUsers()
                            }, 3000)

                            if (selectedToDate && selectedFromDate) {
                                fetchInfosFunction(selectedFromDate, selectedToDate)
                            }

                            makeDateInputElementInvalid()
                        } else {
                            alert("잘못된 계정 정보")
                        }


                    }
                })
                .catch(err => {
                    console.error(err)
                    alert(err)
                })
        } else {
            // 로그아웃 시켜주기?
            logoutPressed()
        }

        etag1 = ""
        etag2 = ""

        return function cleanup() {
            clearInterval(repeat)
            clearInterval(repeat2)
        }
    }, [])



    return <div className="private__main__container">
        <div className="navigation__bar">
            <div className="button active">
                조회
            </div>
            <Link to="/aggregate" style={{
                textDecoration: "none",
                color: "black"
            }}>
                <div className="button">
                    집계
            </div>
            </Link>
            <Link to="/post" style={{
                textDecoration: "none",
                color: "black"
            }}>
                <div className="button">
                    추가
            </div>
            </Link>
            <button onClick={logoutPressed}>로그아웃</button>
        </div>
        <div className="toolbar__view__container">
            <div className="toolbars_container">
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid className="grid" container justify="space-around">
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
                        <TextField id="standard-basic" className="standard-basic" label="검색" variant="standard" onChange={textFieldHandler} />
                        <FormControl className={classes.formControl}>
                            <InputLabel id="demo-simple-select-label">검색조건</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={category}
                                onChange={handleChange}
                            >
                                <MenuItem value={"user_name"}>이름</MenuItem>
                                <MenuItem value={"user_univ_id"}>학번</MenuItem>
                                <MenuItem value={"user_major"}>전공</MenuItem>
                                <MenuItem value={"admin_id"}>인증 관리자</MenuItem>
                                <MenuItem value={"admin_dept"}>관리자 부서</MenuItem>
                                <MenuItem value={"ip_addr"}>인증 ip</MenuItem>
                            </Select>
                        </FormControl>
                        {allDept ? <Button id="dept1" variant="contained" color="primary" onClick={dept1ButtonTappedAgain} className="dept1">
                            현재부서로그 보기
                    </Button> : <Button id="dept1" variant="contained" onClick={dept1ButtonTapped} className="dept1">
                                전체부서로그 보기
                    </Button>}

                    </Grid>
                </MuiPickersUtilsProvider>
            </div>
            <div className="view_container_container">
                <div className="view__container">
                    <div className="label">
                        현재 사용자
                    </div>
                    <CurrentUserTable turnOnExitTimeInput={turnOnExitTimeInput} noLabelTapped={numberLabelTapped} infos={currentUsers} />
                </div>
            </div>

            <div className="view_container_container">
                <div className="view__container">
                    <div className="label">
                        전체 사용자
                </div>
                    {searching ? <SimpleTable selectInfoCell={selectInfoCell} turnOnExitTimeInput={turnOnExitTimeInput} noLabelTapped={numberLabelTapped} infos={searchedInfos} /> : <SimpleTable selectInfoCell={selectInfoCell} turnOnExitTimeInput={turnOnExitTimeInput} noLabelTapped={numberLabelTapped} infos={infos} />}


                    {dialog && <AlertDialog title={dialogTitle} message={dialogMessage} callback={closeAlertAndLogout} />}
                </div>

            </div>
        </div>

        <button onClick={excelDownButtonTapped} className="excel_down_button">
            엑셀다운
        </button>
        {(excelDownView && searching) && <ExcelDown turnOffExcelDownView={turnOffExcelDownView} datas={searchedInfos} />}
        {(excelDownView && !searching) && <ExcelDown turnOffExcelDownView={turnOffExcelDownView} datas={infos} />}
        {selectedInfo && <SelectedInfoCell unSelectInfoCell={unSelectInfoCell} info={selectedInfo} changeAggregateOfInfo={changeAggregateOfInfo} />}

        {exitTimeInput && <ExitTimeInput
            turnOfExitTimeInput={turnOfExitTimeInput}
            handleExitTimeString={handleExitTimeString} exitTimeString={exitTimeString} />}
    </div>

    function dept1ButtonTappedAgain() {

        if (selectedFromDate && selectedToDate) {
            etag3 = ""
            etag1 = ""
            clearInterval(repeat)
            fetchInfos(selectedFromDate, selectedToDate)
            repeat = setInterval(() => {
                fetchInfos(selectedFromDate, selectedToDate)
            }, 3000)

            setAllDept(false)

        }
    }

    function dept1ButtonTapped() {

        if (selectedFromDate && selectedToDate) {
            etag3 = ""
            etag1 = ""
            clearInterval(repeat)
            fetchInfosDept1(selectedFromDate, selectedToDate)
            repeat = setInterval(() => {
                fetchInfosDept1(selectedFromDate, selectedToDate)
            }, 3000)

            setAllDept(true)

        }
    }

    function changeAggregateOfInfo(access_id: number) {
        const updatedInfos = infos.map((info) => {
            if (info.access_id === access_id) {
                info.disabled_aggregate = !info.disabled_aggregate
                return info
            } else {
                return info
            }
        })
        setInfos(updatedInfos)
    }

    function unSelectInfoCell() {
        setSelectedInfo(undefined)
    }

    function selectInfoCell(info: Info) {
        setSelectedInfo(info)
    }

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

        let searchedInfos = []



        switch (category) {
            case "user_name":

                searchedInfos = infos.filter((info) => {
                    if (info.user_name.includes(value)) {
                        return true
                    } else {
                        return false
                    }
                })
                break;
            case "user_univ_id":
                searchedInfos = infos.filter((info) => {
                    if (info.user_univ_id.includes(value)) {
                        return true
                    } else {
                        return false
                    }
                })
                break;
            case "user_major":
                searchedInfos = infos.filter((info) => {
                    if (info.user_major.includes(value)) {
                        return true
                    } else {
                        return false
                    }
                })
                break;
            case "admin_id":
                searchedInfos = infos.filter((info) => {
                    if (info.admin_id.includes(value)) {
                        return true
                    } else {
                        return false
                    }
                })
                break;
            case "admin_dept":
                searchedInfos = infos.filter((info) => {
                    if (info.admin_dept.includes(value)) {
                        return true
                    } else {
                        return false
                    }
                })
                break;
            case "ip_addr":
                searchedInfos = infos.filter((info) => {
                    if (info.ip_addr.includes(value)) {
                        return true
                    } else {
                        return false
                    }
                })
                break;
            default:
                setSearching(false)
                searchedInfos = infos
                break;
        }

        setSearchedInfos(searchedInfos)
        setSearching(true)
        return
    }

    function getTodaysCurrentUsers() {

        const date1 = new Date()
        const date2 = new Date()

        const date_from = `${date1.getFullYear()}-${date1.getMonth() + 1}-${date1.getDate()}`
        const date_to = `${date2.getFullYear()}-${date2.getMonth() + 1}-${date2.getDate()}`
        axios.get(`${ADMIN_END_POINT}msc/log?date_from=${date_from}&date_to=${date_to}`, {
            headers: {
                Authorization: localStorage.getItem("token"),
                "If-None-Match": etag2
            }
        }).then(res => {
            if (res.status === 200) {
                const etag = res.headers['etag']
                etag2 = etag
                let todayUsers = res.data.data.data as Info[]
                todayUsers = todayUsers.reverse()
                todayUsers = todayUsers.filter((user) => {
                    if (user.disabled_aggregate) {
                        return false
                    } else {
                        return true
                    }
                })
                let currentUsersIds: String[] = []
                let currentUsers: Info[] = []

                // 중복없이 유저들의 학번을 담고 있는 데이터셋을 만들자. 
                let user_univ_ids: String[] = []
                for (let i = 0; i < todayUsers.length; i++) {
                    const user = todayUsers[i];
                    if (user_univ_ids.includes(user.user_univ_id) == false) {
                        user_univ_ids.push(user.user_univ_id)
                    }
                }


                // 각각의 학번들마다 todayUsers에 면번 포함되어있는지를 카운트해준다. 
                for (let i = 0; i < user_univ_ids.length; i++) {
                    const user_univ_id = user_univ_ids[i];
                    let count = 0
                    todayUsers.map((user) => {
                        if (user.user_univ_id == user_univ_id) {
                            count++
                        }
                    })

                    // 만약에 count가 홀수개라면 현재 사용중인 유저의 id이다. 
                    if (count % 2 == 1) {
                        currentUsersIds.push(user_univ_id)
                    }
                }


                // 해당 id 값을 가진 유저들을 가장 최근 데이터만 한번씩만 골라낸다. 
                for (let i = 0; i < currentUsersIds.length; i++) {
                    const user_id = currentUsersIds[i];
                    for (let i = 0; i < todayUsers.length; i++) {
                        const todayUser = todayUsers[i];
                        if (todayUser.user_univ_id == user_id) {
                            currentUsers.push(todayUser)
                            break;
                        }
                    }
                }

                // 현재 사용중인 유저들
                setCurrentUsers(currentUsers)

            } else {
                console.log(res)
                setDialogTitle("성서봇입니다")
                setDialogMessage("에러 발생 부분 처리중")
                setDialog(true)
            }
        }).catch(err => {

        })

    }

    function fetchInfosDept1(dateFrom: Date, dateTo: Date) {
        const date_from = `${dateFrom.getFullYear()}-${dateFrom.getMonth() + 1}-${dateFrom.getDate()}`
        const date_to = `${dateTo.getFullYear()}-${dateTo.getMonth() + 1}-${dateTo.getDate()}`

        axios.get(`${ADMIN_END_POINT}msc/log?date_from=${date_from}&date_to=${date_to}`, {
            headers: {
                "Authorization": localStorage.getItem("token"),
                "If-None-Match": etag3
            }
        }).then(res => {
            const infos = res.data.data.data as Info[]
            infos.sort(compareNumber2)
            const etag = res.headers['etag']
            etag3 = etag
            setInfos(infos)
        }).catch(err => {

        })
    }

    function fetchInfos(dateFrom: Date, dateTo: Date) {

        const date_from = `${dateFrom.getFullYear()}-${dateFrom.getMonth() + 1}-${dateFrom.getDate()}`
        const date_to = `${dateTo.getFullYear()}-${dateTo.getMonth() + 1}-${dateTo.getDate()}`


        axios.get(`${ADMIN_END_POINT}msc/log?date_from=${date_from}&date_to=${date_to}`, {
            headers: {
                "Authorization": localStorage.getItem("token"),
                "If-None-Match": etag1
            }
        })
            .then(res => {
                if (res.status === 200) {
                    const infos = res.data.data.data as Info[]
                    infos.sort(compareNumber2)
                    const etag = res.headers['etag']
                    etag1 = etag
                    setInfos(infos)
                } else if (res.status === 304) {

                    return
                }
                else {
                    setDialogTitle("성서봇입니다")
                    setDialogMessage("에러 발생 부분 처리중")
                    setDialog(true)
                }
            }).catch(err => {
                console.log("캐싱")
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