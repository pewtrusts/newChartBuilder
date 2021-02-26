/* global gapi */
import { IsWorking } from './../store';
import s from './../secrets.json';

let resolveSaved;
export default function _init(props){
    resolveSaved = props.resolveSaved;
}
export function getSavedCharts() {
    IsWorking.set(true);
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: s.GoogleSheets.sheetId,
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
        console.log(data);
        resolveSaved({data, googleSheetHeaders});
        IsWorking.set(false);
    }, function (response) {
        alert('You may not have permission to edit the Google Sheet document. Error: ' + response.result.error.message);
    });
}