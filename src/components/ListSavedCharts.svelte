<script context="module">
    export function loginHandler(){
        gapi.auth2.getAuthInstance().signIn();
    }
</script>
<script>
    import s from './../secrets.json';
    import LoadChart from './LoadChart.svelte';
    import brandOptions from './../brand-options.json';
    let isWorking = true;
    export let resolveSaved;
    export let savedCharts;
    export let loadedChart;
    export let googleSheetHeaders;
    export let userEmail;
    export let userId;
    export let userName;
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
            if (isSignedIn){
                getSavedCharts();
                updateCurrentUser();
            } else {
                isWorking = false;
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
            updateCurrentUser();
        } else {
           // logout ?
        }
    } 
    function listMounted(){
        isWorking = false;
    }
    function updateCurrentUser(){
        const user = instance.currentUser.get();
        const profile = user.getBasicProfile();
        userEmail = profile.getEmail();
        userId = profile.getId();
        userName = profile.getGivenName() + ' ' + profile.getFamilyName();
    }
    function loadHandler(){
        gapi.load('client:auth2', initClient);
    }
    
    /**
     *  This fn gets data from the Google Sheets document
     * 
     */
    function getSavedCharts() {
        isWorking = true;
        gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: s.GoogleSheets.sheetId,
            range: 'Sheet1',
        }).then(function(response) {
            googleSheetHeaders = response.result.values[0];
            const data = response.result.values.slice(1).map(function(d){
                return d.reduce(function(acc,cur,i){
                    acc[response.result.values[0][i]] = cur;
                    return acc;
                },{})
            });
            console.log(data);
            resolveSaved(data);
            //isWorking = false;
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

<style>
    .container {
        position: relative;
        display: contents;
    }
    .container::after {
        content: 'Working on it . . .';
        display: none;
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translateX(-50%);
        color: #fff;
        z-index: 1;
        font-size: 36px;

    }
    .container::before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: rgba(0,0,0,0.5);
        display: none;
        cursor: not-allowed;
    }
    .container.isWorking::before, .container.isWorking::after {
        display: block;
    }
    
    .chart-list {
        margin: 0;
        padding: 0;
        display: grid;
        grid-template-columns: repeat( auto-fit, minmax(150px, 200px) );
        grid-column-gap: 10px;
        grid-row-gap: 10px;
        grid-auto-rows: minmax(min-content, max-content);
        align-items: start;
    }
</style>
<svelte:head>
    <script async defer src="https://apis.google.com/js/api.js" on:load="{loadHandler}"></script>
</svelte:head>
<section class:isWorking class="container">
    <h2>Saved charts</h2>
    {#await savedCharts}
        <p>You need to log in to Google using your {brandOptions.emailDomain} address to load saved charts.</p>
        <button on:click="{loginHandler}" class="button button--primary">Log in</button>
    {:then charts}
    <section class="chart-list" use:listMounted>
    {#each charts as data}
        <LoadChart {data} bind:loadedChart />
    {/each}
    </section>
    {/await}
</section>