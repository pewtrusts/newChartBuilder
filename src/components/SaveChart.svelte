<script>
    /**
     * todo: ensure thumbnail is available and up to date
     * update: if thumbnail is not availaboe just do it on save.
     * return image now returns promise that should be chainable
     * 
     */
    //import Notices from './Notices.svelte';
    import brandOptions from "./../brand-options.json";
    import { loginHandler } from "./ListSavedCharts.svelte";
    import { SavingChartData, PictureIsMissingOrOld } from './../store';
    import { get } from 'svelte/store';
    import s from "./../secrets.json";
    import { pictureIsMissingOrOldNotice } from './../App.svelte';
    export let savedCharts;
    export let loadedChart;
    export let showVerify;
    export let verifyPromise;
    export let verifyResolve;
    export let verifyReject;
    export let resolveSaved;
    export let googleSheetHeaders;
    export let userId;
    export let userEmail;
    export let userName;

   // let notices = new Set();
   // let pictureIsMissingOrOld = true;
    $: saveIsDisabled = !project || null;
    $: project = (function(){
        if (project){
            return project;
        }
        return loadedChart ? loadedChart.project : '';
    }())
  /*  PictureIsMissingOrOld.subscribe(v => {
        pictureIsMissingOrOld = v;
        notices[v ? 'add' : 'delete'](pictureIsMissingOrOldNotice);
        notices = notices;
    });*/
    function returnProjects(charts) {
        return Array.from(new Set(charts.map((c) => c.project)));
    }
    function saveChart() {
        const _savingChartData = get(SavingChartData);
        _savingChartData.timestamp = new Date().getTime();
        _savingChartData.user_email = userEmail;
        _savingChartData.user_id = userId;
        _savingChartData.name = userName;
        _savingChartData.project = project;

        gapi.client.sheets.spreadsheets.values
            .append({
                spreadsheetId: s.GoogleSheets.sheetId,
                range: "Sheet1",
                valueInputOption: "RAW",
                resource: {
                    values: [googleSheetHeaders.map(h => _savingChartData[h])]
                }
            })
            .then(
                (response) => {
                    var result = response.result;
                    console.log(
                        `${result.updates.updatedCells} cells appended.`
                    );
                    //listSavedCharts();
                },
                function (error) {
                    console.log(error);
                    alert(error.result.error.message);
                }
            );
    }
    function submitHandler() {
        const formData = new FormData(this);
        project = formData.get('project');
        console.log({ loadedChart });
        if (loadedChart) {
            showVerify = true;
            verifyPromise = new Promise(function (resolve, reject) {
                verifyResolve = resolve;
                verifyReject = reject;
            });
            verifyPromise.then((v) => {
                if (v == "replace") {
                    // delete then saveChart();
                } else {
                    saveChart();
                }
            });
        }
        saveChart();
    }
    console.log(resolveSaved);
</script>
<style>
    label {
        font-weight: 900;
    }
    .datalist-input {
        display: block;
        border: 1px solid #ccc;
        border-radius: 0;
        line-height: 1.5;
        color: var(--text-color, #000);
        font-size: 0.85rem;
        margin-bottom: 0.5rem;
    }
</style>
<!--<Notices {notices} />-->
{#await savedCharts}
    <p>
        You need to log in to Google using your {brandOptions.emailDomain} address
        to save charts.
    </p>
    <button on:click={loginHandler} class="button button--primary"
        >Log in</button
    >
{:then charts}
    <form on:submit|preventDefault={submitHandler}>
        <label for="project-list">Project name (select existing or add a new one):</label>
        <input
            bind:value={project}
            class="datalist-input"
            required
            id="project-list"
            name="project"
            list="saved-projects"
        />
        <datalist id="saved-projects">
            {#each returnProjects(charts) as project}
                <option value={project} />
            {/each}
        </datalist>
        <input
            disabled="{saveIsDisabled}"
            type="submit"
            class="button button--primary"
            value="Save chart"
        />
    </form>
{/await}

