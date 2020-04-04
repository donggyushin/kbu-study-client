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

        // 필요한가?

    }
}