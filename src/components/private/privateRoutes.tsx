import React, { useEffect } from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import Main from './main/main'
import Post from './post/post'
import autoLogin from '../../utils/autologin';
import Aggregate from './aggregate/aggregate';

var repeat: any

export default function App() {

    useEffect(() => {
        autoLogin()
        repeat = setInterval(() => {
            autoLogin()
        }, 1000 * 60 * 5)

        return function cleanup() {

            clearInterval(repeat)
        }
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
                <Route path="/aggregate">
                    <Aggregate />
                </Route>
                <Route>
                    <Main />
                </Route>
            </Switch>

        </Router>
    );

}