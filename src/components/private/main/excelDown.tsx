import React, { useRef, useEffect } from 'react'
import { Info } from '../../../constants/types'
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

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, turnOffExcelDownView);

    const className = 'class-name-for-style',
        filename = 'Excel-file',
        fields = {
            "no": "No",
            "user_name": "이름",
            "user_univ_id": "학번",
            "user_major": "전공",
            "access_time": "접근시간",
            "admin_id": "관리자",
            "admin_department": "관리자 부서",
            "ip_addr": "아이피",
            "access_type": "접근 유형"
        },
        style = {
            padding: "5px"
        }

    return <div className="excel_down_container">
        <div ref={wrapperRef} className="card">
            <JsonToExcel
                data={datas}
                className={className}
                filename={filename}
                fields={fields}
                style={style}
            />
        </div>

    </div>
}

export default ExcelDown