import React from 'react'
import { Info } from '../../../constants/types'

interface IProps {
    info: Info
}

const Cell: React.FC<IProps> = ({ info }) => {

    return <div className="cell__container">
        <span>
            {info.access_id}
        </span>
        <span>
            {info.access_datetime}
        </span>
        <span>
            {info.is_manual}
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