import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
export default function _toDate(str) {
    
    const date = dayjs(str);
    if (date.$d == 'Invalid Date') return str;
    return date.$d;
}