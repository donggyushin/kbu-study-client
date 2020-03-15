import React from 'react'
import { Info } from '../../../constants/types'
//@ts-ignore
import { JsonToExcel } from 'react-json-excel';

interface IProps {
    datas: Info[]
}

const ExcelDown: React.FC<IProps> = ({
    datas
}) => {

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
        <div className="card">
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