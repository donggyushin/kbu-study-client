import React, { useRef, useEffect, useState } from 'react'
import { Info, IConvertedInfo } from '../../../constants/types'
//@ts-ignore
import { JsonToExcel } from 'react-json-excel';

interface IProps {
    datas: Info[]
    turnOffExcelDownView: () => void
}

function useOutsideAlerter(ref: any, turnOffExcelDownView: () => void) {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
            turnOffExcelDownView()
        }
    }

    useEffect(() => {
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    });
}


const ExcelDown: React.FC<IProps> = ({
    datas,
    turnOffExcelDownView
}) => {

    const [convertedData, setConvertedData] = useState<IConvertedInfo[]>([])

    useEffect(() => {
        let convertedData: IConvertedInfo[] = datas.map((data) => {
            return {
                access_id: `\ufeff${data.access_id}`,
                access_datetime: `\ufeff${data.access_datetime}`,
                created_datetime: `\ufeff${data.created_datetime}`,
                updated_datetime: `\ufeff${data.updated_datetime}`,
                disabled_aggregate: `${data.disabled_aggregate ? "\ufeff집계제외" : "\ufeff집계포함"}`,
                user_name: `\ufeff${data.user_name}`,
                user_major: `\ufeff${data.user_major}`,
                user_univ_id: `\ufeff${data.user_univ_id}`,
                admin_id: `\ufeff${data.admin_id}`,
                admin_dept: `\ufeff${data.admin_dept}`,
                is_manual: `${data.is_manual ? "\ufeff수동" : "\ufeff자동"}`,
                ip_addr: `\ufeff${data.ip_addr}`
            }
        })
        setConvertedData(convertedData)
    }, [])

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, turnOffExcelDownView);

    const className = 'class-name-for-style',
        filename = 'Excel-file',
        fields = {
            "access_id": "\ufeffNo",
            "access_datetime": "\ufeff접근 시각",
            "created_datetime": "\ufeff데이터 생성시각",
            "updated_datetime": "\ufeff데이터 업데이트시각",
            "disabled_aggregate": "\ufeff집계 제외",
            "user_name": "\ufeff이름",
            "user_major": "\ufeff학부",
            "user_univ_id": "\ufeff학번",
            "admin_id": "\ufeff인증 관리자",
            "admin_dept": "\ufeff관리자 부서",
            "is_manual": "\ufeff자동/수동",
            "ip_addr": "\ufeff인증 ip"
        },
        style = {
            padding: "5px"
        }

    return <div className="excel_down_container">
        <div ref={wrapperRef} className="card">
            {convertedData.length !== 0 && <JsonToExcel
                data={convertedData}
                className={className}
                filename={filename}
                fields={fields}
                style={style}
            />}
        </div>

    </div>
}

export default ExcelDown