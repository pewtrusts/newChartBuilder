import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
export default function _toDate(str, test) {
    
    const date = dayjs(str);
    if (test) return date.$d;
    if (date.$d == 'Invalid Date') return str;
    return date.$d;
}