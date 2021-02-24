<script>
    /**
     * todo: ensure thumbnail is available and up to date
     * 
     */
    import brandOptions from "./../brand-options.json";
    import { loginHandler } from "./ListSavedCharts.svelte";
    import { SavingChartData } from './../store';
    import { get } from 'svelte/store';
    import s from "./../secrets.json";
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
    let project;
    $: projectFromLoadedChart = loadedChart ? loadedChart.project : "";
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
            value={projectFromLoadedChart}
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
            type="submit"
            class="button button--primary"
            value="Save chart"
        />
    </form>
{/await}

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
