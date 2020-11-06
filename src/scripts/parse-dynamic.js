//HT taken from PapaParse internals
const MAX_FLOAT = Math.pow(2, 53);
const MIN_FLOAT = -MAX_FLOAT;
const FLOAT = /^\s*-?(\d+\.?|\.\d+|\d+\.\d+)(e[-+]?\d+)?\s*$/;
const ISO_DATE = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;
function testFloat(s) {
    if (FLOAT.test(s)) {
        var floatValue = parseFloat(s);
        if (floatValue > MIN_FLOAT && floatValue < MAX_FLOAT) {
            return true;
        }
    }
    return false;
}
export default function _parseDynamic(value) {
    if (value === 'true' || value === 'TRUE')
        return true;
    else if (value === 'false' || value === 'FALSE')
        return false;
    else if (testFloat(value))
        return parseFloat(value);
    else if (ISO_DATE.test(value))
        return new Date(value);
    else
        return (value === '' ? null : value);
}