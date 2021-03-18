/* global gapi */
import { s } from './../store';
import { get } from 'svelte/store';
import sec from './../secrets.json';

export function saveChart({ googleSheetHeaders, userId, userEmail, userName, project }) {
    s.IsWorking.set(true);
    const _savingChartData = get(s.SavingChartData);
    _savingChartData.timestamp = new Date().getTime();
    _savingChartData.user_email = userEmail;
    _savingChartData.user_id = userId;
    _savingChartData.name = userName;
    _savingChartData.project = project;

    return gapi.client.sheets.spreadsheets.values
        .append({
            spreadsheetId: sec.GoogleSheets.sheetId,
            range: "Sheet1",
            valueInputOption: "RAW",
            resource: {
                values: [googleSheetHeaders.map(h => _savingChartData[h])]
            }
        })
        .then(
            () => {
                s.IsWorking.set(false);
                //getSavedCharts(true);
                return _savingChartData;
            },
            function (error) {
                console.log(error);
                alert(error.result.error.message);
            }
        );
}
export function deletePrevious(loadedChart) {
    return gapi.client.sheets.spreadsheets.batchUpdate({
        spreadsheetId: sec.GoogleSheets.sheetId,
        resource: {
            "requests": [{
                "deleteRange": {
                    "range": {
                        "sheetId": 0,
                        "startRowIndex": loadedChart.rowIndex,
                        "endRowIndex": loadedChart.rowIndex + 1
                    },
                    "shiftDimension": "ROWS"
                }
            }]
        }
    });
}