import 'date-fns';
import React, { useState } from 'react'
import './styles.scss'
import { Link } from 'react-router-dom'
import { TextField, Button } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import axios from 'axios'
import { ADMIN_END_POINT } from '../../../constants/endpoint';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
    }),
);


const Post = () => {

    const classes = useStyles();

    const [name, setName] = useState("")
    const [sid, setSid] = useState("")
    const [major, setMajor] = React.useState("");
    const [selectedDate, setSelectedDate] = React.useState<Date | null>(
        new Date(),
    );

    const handleMajorChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setMajor(event.target.value as string);
    };

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
    };

    return <div className="private__main__container">
        <div className="navigation__bar">
            <Link to="/" style={{
                textDecoration: "none",
                color: "black"
            }}>
                <div className="button">
                    조회
            </div>
            </Link>
            <Link to="/aggregate" style={{
                textDecoration: "none",
                color: "black"
            }}>
                <div className="button">
                    집계
            </div>
            </Link>
            <div className="button active">
                추가
            </div>
            <button onClick={logoutPressed}>로그아웃</button>
        </div>
        <div className="post__container">
            <div className="post__form">
                <TextField value={name} onChange={handleName} id="standard-basic" label="이름" />
                <TextField value={sid} onChange={handleSid} id="standard-basic" label="학번" />
                <FormControl className={classes.formControl}>
                    <InputLabel id="demo-simple-select-label">학과</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        className="select"
                        value={major}
                        onChange={handleMajorChange}
                    >
                        <MenuItem value={'컴퓨터소프트웨어학과'}>컴퓨터소프트웨어학과</MenuItem>
                        <MenuItem value={'영유아보육학과'}>영유아보육학과</MenuItem>
                        <MenuItem value={'사회복지학과'}>사회복지학과</MenuItem>
                        <MenuItem value={'신학과'}>신학과</MenuItem>
                        <MenuItem value={'간호학과'}>간호학과</MenuItem>
                    </Select>
                </FormControl>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="center">
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="날짜를 지정해주세요"
                            value={selectedDate}
                            onChange={handleDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                        <KeyboardTimePicker
                            margin="normal"
                            id="time-picker"
                            label="시각을 지정해주세요"
                            value={selectedDate}
                            onChange={handleDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change time',
                            }}
                        />
                    </Grid>
                </MuiPickersUtilsProvider>
                <Button onClick={submitButtonTapped} variant="contained" color="primary">
                    제출
                </Button>
            </div>
        </div>
    </div>

    function handleSid(e: React.ChangeEvent<HTMLInputElement>) {
        setSid(e.target.value)
    }

    function handleName(e: React.ChangeEvent<HTMLInputElement>) {
        setName(e.target.value)
    }

    function submitButtonTapped() {

        const pattern = /20[12]\d0\d{4}/i
        const sidCheck = pattern.test(sid)
        if (sidCheck === false) {
            alert("학번을 제대로 기입해주세요")
            return
        }
        if (major === "") {
            alert("학과를 제대로 기입해주세요")
            return
        }

        const token = localStorage.getItem("token")


        const access_datetime = `${selectedDate?.getFullYear()}-${selectedDate!.getMonth() + 1}-${selectedDate?.getDate()} ${selectedDate?.getHours()}:${selectedDate?.getMinutes()}:${selectedDate?.getSeconds()}`
        axios.post(`${ADMIN_END_POINT}msc/log`, {
            user_name: name,
            user_univ_id: sid,
            user_major: major,
            access_datetime: access_datetime
        }, {
            headers: {
                Authorization: token
            }
        })
            .then(res => {
                if (res.status === 200) {
                    console.log(res)
                    initData()
                    alert("데이터 입력 성공")
                } else {
                    alert("데이터 입력 실패")
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    function initData() {
        setName("")
        setSid("")
        setMajor("")

    }

    function logoutPressed() {
        localStorage.removeItem("token")
        localStorage.removeItem("i")
        localStorage.removeItem("p")

        window.location.href = "/"
    }
}

export default Post