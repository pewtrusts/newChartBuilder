/* global gapi GOOGLE_SHEET_ID */

let resolveSaved;
export default function _init(props){
    resolveSaved = props.resolveSaved;
}
export function getSavedCharts() {
    //s.IsWorking.set(true);
    return gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: GOOGLE_SHEET_ID,
        range: 'Sheet1',
    }).then(function (response) {
        const googleSheetHeaders = response.result.values[0];
        const data = response.result.values.slice(1).map(function (d,j) {
            return d.reduce(function (acc, cur, i) {
                acc[response.result.values[0][i]] = cur;
                acc.rowIndex =  j + 1;
                return acc;
            }, {})
        });
        
        resolveSaved({data, googleSheetHeaders});
       // s.IsWorking.set(false);
        return true; // TO DO : rather than passing resolveSaved into this context could have returned the necessary data and chained onto
                     // a `then()` in the original context
    }, function (response) {
        alert('You may not have permission to edit the Google Sheet document. Error: ' + response.result.error.message);
    });
}