/* global gapi GOOGLE_SHEET_ID tokenClient */

import { userStore } from "../store";
let resolveSaved;
let updatedToken;

userStore.subscribe(v => {
	updatedToken = v
})

export default function _init(props){
    resolveSaved = props.resolveSaved;
}

export async function getSavedCharts() {
    //s.IsWorking.set(true);

    if (gapi.client.getToken() == null) {
        console.log('gapi token is null')
          await getToken('login')
    } else {
        console.log('we have a token already')
        console.log(gapi.client.getToken())
        console.log(gapi.client.sheets)
    }

    return await gapi.client.sheets.spreadsheets.values.get({
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

export async function getToken(err) {
    console.log('gettin token')
    if (err == 'login' || err.result.error.code == 401 || (err.result.error.code == 403) &&
        (err.result.error.status == "PERMISSION_DENIED")) {
    
      // The access token is missing, invalid, or expired, prompt for user consent to obtain one.
      await new Promise((resolve, reject) => {
        try {
          // Settle this promise in the response callback for requestAccessToken()
          tokenClient.requestAccessToken({prompt: ""});
          tokenClient.callback = (resp) => {
            if (resp.error !== undefined) {
              reject(resp);
            }
            // GIS has automatically updated gapi.client with the newly issued access token.
            console.log('gapi.client access token: ' + JSON.stringify(gapi.client.getToken()));
            updatedToken.token = gapi.client.getToken();
            updatedToken.tokenSet = new Date().getTime();
            userStore.set(updatedToken)
            resolve(resp);
          };
         
        } catch (err) {
          console.log(err)
        }
      });
    } else {
      // Errors unrelated to authorization: server errors, exceeding quota, bad requests, and so on.
      throw new Error(err);
    }
    }