import React, { useState } from 'react'
import './styles.scss'

interface studentInfo {
    name: string
    sid: string
    major: string
    access_datetime: string
}

interface IProps {
    student: studentInfo
}

const PostCell: React.FC<IProps> = ({
    student
}) => {
    return <div className="cell">
        <div className="span">
            {student.name}
        </div>
        <div className="span">
            {student.sid}
        </div>
        <div className="span">
            {student.major}
        </div>
        <div className="span">
            {student.access_datetime}
        </div>
    </div>
}

export default PostCell