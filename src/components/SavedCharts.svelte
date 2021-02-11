<script context="module">
    import s from './../secrets.json';
    const CLIENT_ID = s.GoogleSheets.ID
    const API_KEY = s.GoogleSheets.key;

    // Array of API discovery doc URLs for APIs used by the quickstart
    const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    const SCOPES = "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.email"; 
    let instance;
    /**
     *  Initializes the API client library and sets up sign-in state
     *  listeners.
     */
    function initClient() {
        gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES
        }).then(function (v) {
            console.log(v);
            instance = gapi.auth2.getAuthInstance();
            instance.isSignedIn.listen(updateSigninStatus);
            instance.currentUser.listen(updateCurrentUser);
            const isSignedIn = instance.isSignedIn.get();
            console.log({isSignedIn});
            if (!isSignedIn){
                gapi.auth2.getAuthInstance().signIn();
            } else {
                getSavedCharts();
            }
        }, function(error) {
            console.log(JSON.stringify(error, null, 2));
        });
    }
    /**
     *  Called when the signed in status changes, to update the UI
     *  appropriately. After a sign-in, the API is called.
     */
    function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
            getSavedCharts();
        } else {
            
        }
    } 
    function updateCurrentUser(user){
        console.log(user.getBasicProfile());
    }
    function loadHandler(){
        gapi.load('client:auth2', initClient);
    }
    /**
     *  This fn gets data from the Google Sheets document
     * 
     */
    function getSavedCharts() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: s.GoogleSheets.sheetId,
        range: 'Sheet1',
    }).then(function(response) {
        const data = response.result.values.slice(1).map(function(d){
            return d.reduce(function(acc,cur,i){
                acc[response.result.values[0][i]] = cur;
                return acc;
            },{})
        });
        
        console.log(data);
        /*if (range.values.length > 0) {
        renderResults(range.values);
        populateProjectDatalist(range.values)
        populateCreatorOptions(range.values);
        console.log(range.values);
        /*for (let i = 0; i < range.values.length; i++) {
            var row = range.values[i];
            // Print columns A and E, which correspond to indices 0 and 4.
            appendPre(row[0] + ', ' + row[4]);
        }*/
        /*} else {
        console.log('No data found.');
        }*/
    }, function(response) {
            alert('You may not have permission to edit the Google Sheet document. Error: ' + response.result.error.message);
    });
    }
</script>
<svelte:head>
    <script async defer src="https://apis.google.com/js/api.js" on:load="{loadHandler}"></script>
</svelte:head>
<p>hello</p>