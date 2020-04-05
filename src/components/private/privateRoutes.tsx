import React, { useEffect } from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import Main from './main/main'
import Post from './post/post'
import autoLogin from '../../utils/autologin';


export default function App() {

    useEffect(() => {
        autoLogin()
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

}