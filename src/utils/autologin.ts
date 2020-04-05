import axios from 'axios'
import { ADMIN_END_POINT } from '../constants/endpoint'

export default function autoLogin() {

    // 필요한가?
    const id = localStorage.getItem("i")
    const pw = localStorage.getItem("p")

    if (id && pw) {
        axios.post(`${ADMIN_END_POINT}auth/admin-login`, {
            id,
            pw
        })
            .then(res => {


                if (res.status === 200) {

                    localStorage.setItem("i", id)
                    localStorage.setItem("p", pw)

                    const token = res.headers.authorization

                    if (token) {
                        localStorage.setItem("token", token)
                        // window.location.href = "/"
                    } else {
                        alert("잘못된 계정 정보")
                    }


                }
            })
            .catch(err => {
                console.error(err)
                alert(err)
            })
    }

}