import React from 'react'
import { Info } from '../../../constants/types'

interface IProps {
    info: Info
}

const Cell: React.FC<IProps> = ({ info }) => {

    return <div className="cell__container">
        <span>
            {info.no}
        </span>
        <span>
            {info.access_time}
        </span>
        <span>
            {info.access_type}
        </span>
        <span>
            {info.user_name}
        </span>
        <span>
            {info.user_univ_id}
        </span>
        <span>
            {info.user_major}
        </span>
        <span>
            {info.admin_id}
        </span>
        <span>
            {info.admin_id}
        </span>
        <span>
            {info.ip_addr}
        </span>
    </div>
}

export default Cell