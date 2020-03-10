import React, { useEffect } from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import Main from './main/main'
import axios from 'axios'
import { END_POINT } from '../../constants/endpoint';
import Post from './post/post'
import Cryptr from 'cryptr'
const cryptr = new Cryptr('asdasd')


export default function App() {

    useEffect(() => {
        // autoLogin()
    }, [])

    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    <Main />
                </Route>
                <Route path="/post" >
                    <Post />
                </Route>
                <Route>
                    <Main />
                </Route>
            </Switch>

        </Router>
    );

    function autoLogin() {

        if (localStorage.getItem("i") && localStorage.getItem("p")) {
            const encryptedId = localStorage.getItem("i") as string
            const encryptedPassword = localStorage.getItem("p") as string
            const decryptedId = cryptr.decrypt(encryptedId)
            const decryptedPassword = cryptr.decrypt(encryptedPassword)

            axios.post(`${END_POINT}auth/login`, {
                id: decryptedId,
                pw: decryptedPassword
            })
                .then(res => {
                    const token = res.headers.authorization
                    localStorage.setItem("token", token)
                })
        }

    }
}