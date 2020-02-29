import React from 'react'
import './styles.scss'
import { Link } from 'react-router-dom'
import { TextField, Button } from '@material-ui/core'
const Post = () => {
    return <div className="private__main__container">
        <div className="navigation__bar">
            <Link to="/" style={{
                textDecoration: "none",
                color: "black"
            }}>
                <div className="button">
                    view
            </div>
            </Link>
            <div className="button active">
                post
            </div>
            <button onClick={logoutPressed}>로그아웃</button>
        </div>
        <div className="post__container">
            <div className="post__form">
                <TextField id="standard-basic" label="학번" />
                <TextField id="standard-basic" label="날짜" />
                <TextField id="standard-basic" label="입실시간" />
                <TextField id="standard-basic" label="퇴실시간" />
                <Button variant="contained" color="primary">
                    제출
</Button>
            </div>
        </div>
    </div>

    function logoutPressed() {
        localStorage.removeItem("token")
        localStorage.removeItem("i")
        localStorage.removeItem("p")

        window.location.href = "/"
    }
}

export default Post