<script context="module">
    export function returnProjects(charts) {
        return Array.from(new Set(charts.map((c) => c.project)));
    }
</script>
<script>
    /**
     * todo: ensure thumbnail is available and up to date
     * update: if thumbnail is not availaboe just do it on save.
     * return image now returns promise that should be chainable
     * 
     */
    import brandOptions from "./../brand-options.json";
    import { loginHandler } from "./ListSavedCharts.svelte";
    import { ActiveSection, PictureIsMissingOrOld, IsWorking } from './../store';
    import { getSavedCharts } from './../scripts/get-saved-charts';
    import initGetSavedCharts from './../scripts/get-saved-charts';
    import getImageData from './../scripts/get-image-data';
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
    import { saveChart, deletePrevious } from './../scripts/save-chart';
    let pictureIsMissingOrOld;
    PictureIsMissingOrOld.subscribe(v => {
        pictureIsMissingOrOld = v;
    });
    $: saveIsDisabled = !project || null;
    $: project = (function(){
        if (project){
            return project;
        }
        return loadedChart ? loadedChart.project : '';
    }())
    function _saveChart(props){
        if ( pictureIsMissingOrOld ){
            IsWorking.set(true);
            requestIdleCallback(function(){
                getImageData().then(() => {
                    saveChart(props).then(reloadCharts);
                });
            }, {timeout: 2000});
        } else {
            saveChart(props).then(reloadCharts);
        }
    }
    function reloadCharts(){
        savedCharts = new Promise(function(resolve){
            resolveSaved = resolve;
        });
        initGetSavedCharts({resolveSaved});
        getSavedCharts().then(() => {
            ActiveSection.set({method: 'click', value: 'start'});
        });
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
                    IsWorking.set(true);
                    deletePrevious(loadedChart).then(() => {
                        _saveChart({googleSheetHeaders, userId, userEmail, userName, project});
                    });
                } else {
                    _saveChart({googleSheetHeaders, userId, userEmail, userName, project});
                }
            });
        } else {
            _saveChart({googleSheetHeaders, userId, userEmail, userName, project});
        }
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
{:then value}
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
            {#each returnProjects(value.data) as project}
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

