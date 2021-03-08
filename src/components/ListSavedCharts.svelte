<script context="module">
    import { getSavedCharts } from './../scripts/get-saved-charts';
    import initGetSavedCharts from './../scripts/get-saved-charts';
    import { returnProjects } from './SaveChart.svelte';
    import Login from './Login.svelte';
    export function loginHandler(){
        gapi.auth2.getAuthInstance().signIn();
    }
</script>
<script>
    import s from './../secrets.json';
    import LoadChart from './LoadChart.svelte';
    export let resolveSaved;
    export let savedCharts;
    export let loadedChart;
    export let googleSheetHeaders;
    export let userEmail;
    export let userId;
    export let userName;
    let currentUserCharts = [];
    let otherUserCharts = [];
    let projectFilter = 'any';
    let typeFilter = 'any';
    let creatorFilter = 'any';
    let isWorking = true;
    const CLIENT_ID = s.GoogleSheets.ID
    const API_KEY = s.GoogleSheets.key;

    // Array of API discovery doc URLs for APIs used by the quickstart
    const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    const SCOPES = "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.email"; 
    let instance;
    function sortCharts(charts){
        return charts.sort((a,b) => b.timestamp - a.timestamp);
    }
    /**
     *  Initializes the API client library and sets up sign-in state
     *  listeners.
     */
    async function setHeaders(){
        const sheetsData = await savedCharts;
        googleSheetHeaders = sheetsData.googleSheetHeaders;
    }
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
    function projectFilterHandler(){
        projectFilter = this.value;
    }
    function typeFilterHandler(){
        typeFilter = this.value;
    }
    function creatorFilterHandler(){
        creatorFilter = this.value;
    }
    function returnTypes(charts) {
        return Array.from(new Set(charts.map((c) => c.type)));
    }
    function returnCreators(charts) {
        return Array.from(new Set(charts.map((c) => c.name)));
    }
    function divideCharts(_, charts){
        currentUserCharts = charts.filter(d => d.user_id == userId);
        otherUserCharts = charts.filter(d => d.user_id != userId);
    }

    initGetSavedCharts({resolveSaved});
    setHeaders();
    
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
        align-items: stretch;
        min-height: auto;
    }
    select {
        margin-bottom: 0.5em;
    }
    header {
        background-color: var(--light-gray, #ccc);
        position: sticky;
        top: 0;
        padding-top: 1em;
        z-index: 1;
    }

</style>
<svelte:head>
    <script async defer src="https://apis.google.com/js/api.js" on:load="{loadHandler}"></script>
</svelte:head>
<section class:isWorking class="container">
    {#await savedCharts}
        <Login reason="to load saved charts" />
    {:then value}
    <div use:divideCharts="{value.data}">
        <header>
            <h2>Saved charts</h2>
            <label for="project-filter">Filter by project:</label>
            <!-- svelte-ignore a11y-no-onchange -->
            <select on:change="{projectFilterHandler}" name="project-filter" id="project-filter">
                <option value="any">Any</option>
                {#each returnProjects(value.data) as project}
                <option value="{project}">{project}</option>
                {/each}
            </select>
            <label for="type-filter">Filter by type:</label>
            <!-- svelte-ignore a11y-no-onchange -->
            <select on:change="{typeFilterHandler}" name="type-filter" id="type-filter">
                <option value="any">Any</option>
                {#each returnTypes(value.data) as type}
                <option value="{type}">{type}</option>
                {/each}
            </select>
            <label for="creator-filter">Filter by creator:</label>
            <!-- svelte-ignore a11y-no-onchange -->
            <select on:change="{creatorFilterHandler}" name="creator-filter" id="creator-filter">
                <option value="any">Any</option>
                {#each returnCreators(value.data) as creator}
                <option value="{creator}">{creator}</option>
                {/each}
            </select>
        </header>
        {#if currentUserCharts.length > 0 }
        <h3>Your charts</h3>
        <section class="chart-list" use:listMounted>
            {#each sortCharts(currentUserCharts) as data}
            <LoadChart {data} bind:loadedChart {projectFilter} {typeFilter} {creatorFilter} />
            {/each}
        </section>
        {/if}
        {#if otherUserCharts.length > 0 }
        <h3>Your team&rsquo;s charts</h3>
        <section class="chart-list">
            {#each sortCharts(otherUserCharts) as data}
            <LoadChart {data} bind:loadedChart {projectFilter} {typeFilter} {creatorFilter} />
            {/each}
        </section>
        {/if}
    </div>
    {/await}
</section>