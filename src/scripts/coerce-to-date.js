import dayjs from 'dayjs';
export default function _toDate(str) {
    const date = dayjs(str);
    if (date.$d == 'Invalid Date') return str;
    return date.$d;
}