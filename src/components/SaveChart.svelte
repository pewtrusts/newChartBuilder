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
    import Login from './Login.svelte';
    import { ActiveSection, PictureIsMissingOrOld, IsWorking, ChartHasBeenSaved, ChartProject } from './../store';
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
    export let clickSave;
    clickSave = function(){
        const click = new MouseEvent("click", {
            "view": window,
            "bubbles": true,
            "cancelable": false
        });
        saveButton.dispatchEvent(click);
    }
    let saveButton;

    import { saveChart, deletePrevious } from './../scripts/save-chart';
    let pictureIsMissingOrOld;
    PictureIsMissingOrOld.subscribe(v => {
        pictureIsMissingOrOld = v;
    });
    $: project = (function(){
        var rtn;
        if (project){
            rtn = project;
        } else {
            rtn = loadedChart ? loadedChart.project : '';
        }
        ChartProject.set(rtn);
        return rtn;
    }());
    ChartProject.subscribe(v => {
        if (!v){
            return;
        }
        console.log({v})
        project = v;
    });
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
    function reloadCharts(savedChart){
        loadedChart = savedChart;
        ChartHasBeenSaved.set(true);
        savedCharts = new Promise(function(resolve){
            resolveSaved = resolve;
        });
        initGetSavedCharts({resolveSaved});
        getSavedCharts().then(() => {
            ActiveSection.set({method: 'click', value: 'start'});
        });
    }
    function __saveChart(project){
        _saveChart({googleSheetHeaders, userId, userEmail, userName, project});
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
                        __saveChart(project);
                    });
                } else {
                    __saveChart(project);
                }
            }, () => {
                return;
            });
        } else {
            __saveChart(project);
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
    <Login reason="to save charts" />
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
            type="submit"
            class="button button--primary"
            value="Save chart"
            bind:this="{saveButton}"
        />
    </form>
{/await}

