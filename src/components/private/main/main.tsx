import React from 'react'
import { Link } from 'react-router-dom'
import './styles.scss'

const Main = () => {
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
        <div className="view__container">
            <div className="header">
                <span>
                    학번
              </span>
                <span>
                    날짜
              </span>
                <span>
                    입실 시간
              </span>
                <span>
                    퇴실 시간
              </span>
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

export default Main