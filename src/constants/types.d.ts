interface detail {
    from: string
    to: string
    seconds: number
}

interface Value {
    total_seconds: number
    detail: detail[]
}

export interface IAggregate {
    univ_id: string
    value: Value
}

export interface IConvertedAggregate {
    no: number
    univ_id: string
    total_seconds: number
    start: string
    end: string
}

export interface Info {
    access_id: number
    access_datetime: string
    created_datetime: string
    updated_datetime: string
    disabled_aggregate: boolean
    user_name: string
    user_univ_id: string
    user_major: string
    admin_id: string
    admin_dept: string
    is_manual: boolean
    ip_addr: string
}