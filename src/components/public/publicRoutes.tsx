import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import Login from './login/login'


export default function App() {
    return (
        <Router>
            <Switch>
                <Route path="/">
                    <Login />
                </Route>
                <Route>
                    <Login />
                </Route>
            </Switch>

        </Router>
    );
}