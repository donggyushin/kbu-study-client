import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './styles.scss'
import { Info } from '../../../constants/types'
import axios from 'axios'
import { ADMIN_END_POINT } from '../../../constants/endpoint'
import { TextField } from '@material-ui/core'
import AlertDialog from '../../global/dialog'
import SimpleTable from '../table'

const Main = () => {

    const [infos, setInfos] = useState<Info[]>([])
    const [searchedInfos, setSearchedInfos] = useState<Info[]>([])
    const [searching, setSearching] = useState(false)
    const [dialogTitle, setDialogTitle] = useState("")
    const [dialogMessage, setDialogMessage] = useState("")
    const [dialog, setDialog] = useState(false)
    const [noDesc, setNoDesc] = useState(true)

    useEffect(() => {
        setInterval(function () { fetchInfos() }, 3000);

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
            {/* <div className="header">
                <span onClick={numberLabelTapped}>
                    번호
              </span>
                <span onClick={numberLabelTapped}>
                    접근 시간
              </span>
                <span>
                    유형
              </span>
                <span>
                    학생
              </span>
                <span>
                    학번
              </span>
                <span>
                    학과
              </span>
                <span>
                    관리자
              </span>
                <span>
                    관리부서
              </span>
                <span>
                    ip 주소
              </span>
            </div> */}
            {/* {searching ?
                searchedInfos.map((info, index) => {
                    return <Cell key={index} info={info} />
                }) : infos.map((info, index) => {
                    return <Cell key={index} info={info} />
                })

            } */}

            {searching ? <SimpleTable noLabelTapped={numberLabelTapped} infos={searchedInfos} /> : <SimpleTable noLabelTapped={numberLabelTapped} infos={infos} />}


            {dialog && <AlertDialog title={dialogTitle} message={dialogMessage} callback={closeAlertAndLogout} />}
        </div>
    </div>

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
        console.log("number label tapped")
        const sortedInfos = noDesc ? infos.sort(compareNumber2) : infos.sort(compareNumber)
        console.log(sortedInfos)
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
        console.log(localStorage.getItem("token"))
        axios.get(`${ADMIN_END_POINT}v1/msc/testfetch`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(res => {

                if (res.status === 200) {
                    console.log(res.data.data)
                    setInfos(res.data.data)
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