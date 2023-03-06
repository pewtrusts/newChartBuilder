<script context="module">
    import { getSavedCharts } from './../scripts/get-saved-charts';
    import initGetSavedCharts from './../scripts/get-saved-charts';
    import { returnProjects } from './SaveChart.svelte';
    import Login from './Login.svelte';
    import Button from './Button.svelte';
    import { s } from './../store';

    import {logOut} from './Login.svelte'
</script>
<script>
    /* global GOOGLE_SHEET_KEY, GOOGLE_ID */
    import LoadChart from './LoadChart.svelte';
    export let resolveSaved;
    export let savedCharts;
    export let loadedChart;
    export let googleSheetHeaders;
    export let userEmail;
    export let userId;
    export let userName;
    export let numberLoaded;

    s.UserName.subscribe(v => {
        userName = v
    })

    s.UserId.subscribe(v => {
        userId = v
    })

    s.UserEmail.subscribe(v => {
        userEmail = v
    })

    let currentUserCharts = [];
    let otherUserCharts = [];
    let projectFilter = 'any';
    let typeFilter = 'any';
    let creatorFilter = 'any';
    let selectMultipleEnabled = false;

    s.ActiveSection.subscribe(v => {
        selectMultipleEnabled = v.value == 'multiple';
    });
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
    function logout(){
        // instance.signOut().then(() => {
        //     location.reload();
        // });
        console.log('bluhhh')
    }

    /**
     *  Called when the signed in status changes, to update the UI
     *  appropriately. After a sign-in, the API is called.
     */
  
    function listMounted(){
        s.IsWorking.set(false)
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
    :global(.selectMultipleEnabled) header {
        background-color: var(--dark-background, #000);
        color: #fff;
    }
    .user-info {
        position: absolute;
        top: 0;
        right: 0;
        padding-top: 1em;
    }

</style>
<!-- <svelte:head>
    <script async defer src="https://apis.google.com/js/api.js" on:load="{gapiLoadOkay}"></script>
    <script async defer src="https://accounts.google.com/gsi/client" on:load="{gisLoadOkay}" ></script>
</svelte:head> -->
<section class="container"> 
    {#await savedCharts}
       
    <Login reason="to load saved charts"
    bind:userEmail
    bind:userId
    bind:userName 
    />
    {:then value}
    <div use:divideCharts="{value.data}">
        <header>
            <h2>Saved charts{selectMultipleEnabled ? '—select multiple to make a composite figure' : ''}</h2>
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
            <div class="user-info">{userName} ({userEmail}) <Button type="secondary" title="Logout" clickHandler="{logOut}" /></div>
        </header>
        {#if currentUserCharts.length > 0 }
        <h3>Your charts</h3>
        <section class="chart-list" use:listMounted>
            {#each sortCharts(currentUserCharts) as data}
            <LoadChart {data} bind:numberLoaded bind:loadedChart {projectFilter} {typeFilter} {creatorFilter} />
            {/each}
        </section>
        {/if}
        {#if otherUserCharts.length > 0 }
        <h3>Your team&rsquo;s charts</h3>
        <section class="chart-list" use:listMounted>
            {#each sortCharts(otherUserCharts) as data}
            <LoadChart {data} bind:numberLoaded bind:loadedChart {projectFilter} {typeFilter} {creatorFilter} />
            {/each}
        </section>
        {/if}
    </div>
    {/await}
</section>