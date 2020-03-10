import React, { useState } from 'react'
import './styles.scss'
import { TextField, Button } from '@material-ui/core'
import axios from 'axios'
import { END_POINT, ADMIN_END_POINT } from '../../../constants/endpoint'
import Cryptr from 'cryptr'
const cryptr = new Cryptr('asdasd')

const LoginPage = () => {

    const [id, setId] = useState("")
    const [password, setPassword] = useState("")

    return <div className="public__login__container">
        <div className="height__200"></div>
        <div className="login_form_container">
            <TextField onChange={idHandler} fullWidth value={id} label="아이디" />
            <TextField onChange={passwordHandler} fullWidth value={password} type="password" label="패스워드" />
            <Button onClick={loginPressed} className="button" variant="contained" color="primary">
                로그인
            </Button>
        </div>
    </div>

    function idHandler(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value
        setId(value)
    }

    function passwordHandler(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value
        setPassword(value)
    }

    function loginPressed() {

        axios.post(`${ADMIN_END_POINT}v1/auth/admin-login`, {
            id,
            pw: password
        })
            .then(res => {
                if (res.status === 200) {

                    console.log(res)

                    const encrytedId = cryptr.encrypt(id)
                    const encrytedPassword = cryptr.encrypt(password)

                    localStorage.setItem("i", encrytedId)
                    localStorage.setItem("p", encrytedPassword)

                    const token = res.headers.authorization
                    localStorage.setItem("token", token)
                    window.location.href = "/"
                }
            })
            .catch(err => {
                console.error(err)
            })
    }
}

export default LoginPage