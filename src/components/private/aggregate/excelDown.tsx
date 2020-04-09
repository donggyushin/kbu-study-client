import React, { useState, useEffect } from 'react'

//@ts-ignore
import { JsonToExcel } from 'react-json-excel';
import { IAggregate, IConvertedAggregate } from '../../../constants/types';

interface IProps {
    turnOfExcelDown: () => void
    aggregates: IAggregate[]
}

function useOutsideAlerter(ref: any, turnOfExcelDown: () => void) {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
            turnOfExcelDown()
        }
    }

    React.useEffect(() => {
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    });
}

const ExcelDown: React.FC<IProps> = ({ turnOfExcelDown, aggregates }) => {

    const wrapperRef = React.useRef(null);
    useOutsideAlerter(wrapperRef, turnOfExcelDown);

    const [convertedAggregates, setConvertedAggregates] = useState<IConvertedAggregate[]>([])


    useEffect(() => {

        const test = aggregates.map((ag, i) => {
            const univ_id = ag.univ_id
            const total_seconds = ag.value.total_seconds
            const start = ag.value.detail[0] ? ag.value.detail[0].from : "데이터 없음"
            const end = ag.value.detail[aggregates.length - 1] ? ag.value.detail[aggregates.length - 1].to : "데이터 없음"
            return {
                no: i + 1,
                univ_id,
                total_seconds,
                start,
                end
            }
        })

        setConvertedAggregates(test)

    }, [])

    const filename = "aggregate-excel"
    const fields = {
        "no": "\ufeffNo",
        "univ_id": "학번",
        "total_seconds": "총 집계 시간",
        "start": "시작",
        "end": "종료"
    }



    return <div className={"excel__down"}>
        <div ref={wrapperRef} className="card">
            {convertedAggregates.length != 0 && <JsonToExcel
                data={convertedAggregates}
                filename={filename}
                fields={fields}

            />}

        </div>
    </div>
}

export default ExcelDown