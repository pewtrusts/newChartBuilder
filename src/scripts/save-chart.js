/* global gapi */
import { IsWorking, SavingChartData } from './../store';
import { get } from 'svelte/store';
import s from './../secrets.json';

export function saveChart({ googleSheetHeaders, userId, userEmail, userName, project }) {
    IsWorking.set(true);
    const _savingChartData = get(SavingChartData);
    _savingChartData.timestamp = new Date().getTime();
    _savingChartData.user_email = userEmail;
    _savingChartData.user_id = userId;
    _savingChartData.name = userName;
    _savingChartData.project = project;

    return gapi.client.sheets.spreadsheets.values
        .append({
            spreadsheetId: s.GoogleSheets.sheetId,
            range: "Sheet1",
            valueInputOption: "RAW",
            resource: {
                values: [googleSheetHeaders.map(h => _savingChartData[h])]
            }
        })
        .then(
            () => {
                IsWorking.set(false);
                //getSavedCharts(true);
                return true;
            },
            function (error) {
                console.log(error);
                alert(error.result.error.message);
            }
        );
}
export function deletePrevious(loadedChart) {
    return gapi.client.sheets.spreadsheets.batchUpdate({
        spreadsheetId: s.GoogleSheets.sheetId,
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