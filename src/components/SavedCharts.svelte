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
            console.log(instance);
            // TO DO: continue. init is working. need to work out the rest.
            /*// Listen for sign-in state changes.
            instance.isSignedIn.listen(updateSigninStatus);
            instance.currentUser.listen(updateCurrentUser);

            // Handle the initial sign-in state.
            updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
            authorizeButton.onclick = handleAuthClick;
            signoutButton.onclick = handleSignoutClick;
            saveButton.onclick = handleSaveClick;

            refreshValues();
            */
        }, function(error) {
            console.log(JSON.stringify(error, null, 2));
        });
    }
        
    function loadHandler(){
        gapi.load('client:auth2', initClient);
    }
</script>
<svelte:head>
    <script async defer src="https://apis.google.com/js/api.js" on:load="{loadHandler}"></script>
</svelte:head>
<p>hello</p>