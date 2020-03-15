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



    useEffect(() => {
        setInterval(function () { fetchInfos() }, 333000);

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
            <TextField id="outlined-basic" label="Search" variant="outlined" onChange={textFieldHandler} />
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
        if (a.no < b.no) {
            return -1;
        }
        if (a.no > b.no) {
            return 1;
        }
        return 0;
    }

    function compareNumber2(a: Info, b: Info) {
        if (a.no < b.no) {
            return 1;
        }
        if (a.no > b.no) {
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
            if (info.user_name.includes(value) || info.user_major.includes(value) ||
                info.admin_id.includes(value) || info.admin_department.includes(value) ||
                info.user_univ_id.includes(value) || info.ip_addr.includes(value)
            ) {
                return true
            } else {
                return false
            }
        })

        setSearchedInfos(searchedInfos)
        setSearching(true)
    }

    function fetchInfos() {

        axios.get(`${ADMIN_END_POINT}v1/msc/testfetch`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(res => {

                if (res.status === 200) {
                    const infos = res.data.data as Info[]
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