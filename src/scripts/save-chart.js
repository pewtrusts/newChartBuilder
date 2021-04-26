/* global gapi GOOGLE_SHEET_ID */
import { s } from './../store';
import { get } from 'svelte/store';

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
            spreadsheetId: GOOGLE_SHEET_ID,
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
                
                alert(error.result.error.message);
            }
        );
}
export function deletePrevious(loadedChart) {
    return gapi.client.sheets.spreadsheets.batchUpdate({
        spreadsheetId: GOOGLE_SHEET_ID,
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