import 'date-fns';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './styles.scss'
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import axios from 'axios'
import { ADMIN_END_POINT } from '../../../constants/endpoint';
import { Info } from '../../../constants/types';
import { IAggregate } from '../../../constants/types'
import AggregateTable from './aggregateTable';
import AggregateDetail from './aggregateDetail';
import ExcelDown from './excelDown';
import { TextField } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

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

const Aggregate: React.FC = () => {

    const [fromDate, setFromDate] = React.useState<Date | null>(
        new Date(),
    );

    const [toDate, setToDate] = React.useState<Date | null>(new Date())
    const [aggregates, setAggregates] = useState<IAggregate[]>([])
    const [searchedAggregates, setSearchedAggregates] = useState<IAggregate[]>([])
    const [searching, setSearching] = useState(false)
    const [selectedAggregate, setSelectedAggregate] = useState<IAggregate>()
    const [excelDownView, setExcelDownView] = useState(false)
    const [searchCategory, setSearchCategory] = React.useState("user_univ_id");
    const [searchText, setSearchText] = React.useState<String>("")

    const classes = useStyles();

    const handleDateChange = (date: Date | null) => {
        setFromDate(date);
        if (date && toDate) {
            fetchAggregate(date, toDate)
        }
    };

    const handleToDateChange = (date: Date | null) => {
        setToDate(date);
        if (date && fromDate) {
            fetchAggregate(fromDate, date)
        }
    };

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSearchCategory(event.target.value as string);
    };

    const handleTextSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value)
        const searchText = event.target.value

        if (searchText === "") {
            setSearching(false)
            return
        }

        if (searchCategory === "user_univ_id") {
            const searchedData: IAggregate[] = aggregates.filter((aggregate) => {
                if (aggregate.univ_id.includes(searchText)) {
                    return true
                } else {
                    return false
                }
            })
            setSearchedAggregates(searchedData)
            setSearching(true)
        }
    }

    useEffect(() => {
        if (fromDate && toDate) {
            fetchAggregate(fromDate, toDate)
        }
    }, [])

    return <div className="aggregate__container">
        <div className="navigation__bar">
            <Link to="/" style={{
                textDecoration: "none",
                color: "black"
            }}>
                <div className="button">
                    조회
            </div>
            </Link>
            <div className="button active">
                집계
            </div>

            <Link to="/post" style={{
                textDecoration: "none",
                color: "black"
            }}>
                <div className="button">
                    추가
            </div>
            </Link>
            <button onClick={logoutPressed}>로그아웃</button>
        </div>
        <div className="date_picker_view__aggregate_table_container__container">
            <div className="date_picker_Container">
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid alignItems="flex-end" container justify="space-around">
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="검색 시작일"
                            value={fromDate}
                            onChange={handleDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="검색 마지막일"
                            value={toDate}
                            onChange={handleToDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                        <div className="padding"></div>
                        <TextField id="standard-basic" className="standard-basic" label="검색" value={searchText} onChange={handleTextSearch} variant="standard" />
                        <FormControl className={classes.formControl}>
                            <InputLabel id="demo-simple-select-label">검색조건</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={searchCategory}
                                onChange={handleChange}
                            >
                                <MenuItem value={"user_univ_id"}>학번</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </MuiPickersUtilsProvider>
            </div>
            <div className="aggregate_table_container">
                {searching ? <AggregateTable selectAggregate={selectAggregate} aggregates={searchedAggregates} /> : <AggregateTable selectAggregate={selectAggregate} aggregates={aggregates} />}

            </div>
        </div>
        <button onClick={excelDownButtonTapped} className="excel_down_button">
            엑셀 다운로드
        </button>
        {selectedAggregate && <AggregateDetail deselectAggregate={deselectAggregate} aggregate={selectedAggregate} />}
        {excelDownView && <ExcelDown aggregates={aggregates} turnOfExcelDown={turnOfExcelDown} />}

    </div>

    function turnOfExcelDown() {
        setExcelDownView(false)
    }

    function excelDownButtonTapped() {
        setExcelDownView(true)
    }

    function deselectAggregate() {
        setSelectedAggregate(undefined)
    }

    function selectAggregate(aggregate: IAggregate) {
        setSelectedAggregate(aggregate)
    }

    function fetchAggregate(fromDate: Date, toDate: Date) {

        console.log("fetch aggregate")

        const date_from = `${fromDate.getFullYear()}-${fromDate.getMonth() + 1}-${fromDate.getDate()}`
        const date_to = `${toDate.getFullYear()}-${toDate.getMonth() + 1}-${toDate.getDate()}`

        axios.get(`${ADMIN_END_POINT}msc/log?date_from=${date_from}&date_to=${date_to}`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(res => {
                if (res.status === 200) {
                    const infos = res.data.data.data as Info[]
                    axios.post(`${ADMIN_END_POINT}msc/aggregate`, {
                        data: infos
                    })
                        .then(res => {
                            const data = res.data.data
                            let aggregates: IAggregate[] = []
                            for (var n in data) {

                                const aggregate: IAggregate = {
                                    univ_id: n,
                                    value: data[n]
                                }

                                aggregates.push(aggregate)

                            }
                            setAggregates(aggregates)
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }
            })
            .catch(err => {
                console.log(err)
            })

    }

    function logoutPressed() {
        localStorage.removeItem("token")
        localStorage.removeItem("i")
        localStorage.removeItem("p")

        window.location.href = "/"
    }
}

export default Aggregate