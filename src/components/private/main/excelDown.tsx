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
            "access_id": "No",
            "access_datetime": "접근 시각",
            "created_datetime": "데이터 생성시각",
            "updated_datetime": "데이터 업데이트시각",
            "disabled_aggregate": "집계 제외",
            "user_name": "이름",
            "user_univ_id": "학번",
            "admin_id": "인증 관리자",
            "admin_dept": "관리자 부서",
            "is_manual": "자동/수동",
            "ip_addr": "인증 ip"
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