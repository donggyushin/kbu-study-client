const humanizeDuration = require('humanize-duration')
export default function milisecondsConverter(miliseconds: number) {
    let result = humanizeDuration(miliseconds) as String

    result = result.replace('minute', '분')
    result = result.replace('minutes', '분')

    result = result.replace('seconds', '초')
    result = result.replace('second', '초')

    result = result.replace('hour', '시')
    result = result.replace('hours', '시')

    result = result.replace('day', '일')
    result = result.replace('days', '일')

    result = result.replace('week', '주')
    result = result.replace('weeks', '주')

    result = result.replace('month', '달')
    result = result.replace('months', '달')

    result = result.replace('year', '년')
    result = result.replace('years', '년')

    result = result.replace('s', '')

    return result
}