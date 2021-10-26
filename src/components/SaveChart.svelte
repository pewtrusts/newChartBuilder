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
    import { s } from './../store';
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
    let buildMode;
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
    s.PictureIsMissingOrOld.subscribe(v => {
        pictureIsMissingOrOld = v;
    });
    $: project = (function(){
        var rtn;
        if (project){
            rtn = project;
        } else {
            rtn = loadedChart ? loadedChart.project : '';
        }
        s.ChartProject.set(rtn);
        return rtn;
    }());
    s.ChartProject.subscribe(v => {
        if (!v){
            return;
        }
        
        project = v;
    });
    s.BuildMode.subscribe(v => {
        buildMode = v;
    })
    async function _saveChart(props){
        if ( pictureIsMissingOrOld ){
            s.IsWorking.set(true);
            let promiseResolve;
            let promise = new Promise(function(resolve){
                promiseResolve = resolve;
            });
            requestIdleCallback(function(){
                getImageData().then(() => {
                    saveChart(props).then(v => {
                        promiseResolve(v);
                    });
                });
            }, {timeout: 2000});
            return await promise;
        } else {
            return saveChart(props).then(reloadCharts);
        }
    }
    function reloadCharts(savedChart){
        loadedChart = savedChart;
        s.ChartHasBeenSaved.set(true);
        savedCharts = new Promise(function(resolve){
            resolveSaved = resolve;
        });
        initGetSavedCharts({resolveSaved});
        getSavedCharts().then(() => {
            s.ActiveSection.set({method: 'click', value: 'start'});
        });
    }
    function __saveChart(project){
        return _saveChart({googleSheetHeaders, userId, userEmail, userName, project});
    }
    function submitHandler() {
        const formData = new FormData(this);
        project = formData.get('project');
        
        if (loadedChart && loadedChart.buildMode == buildMode) {
            showVerify = true;
            verifyPromise = new Promise(function (resolve, reject) {
                verifyResolve = resolve;
                verifyReject = reject;
            });
            verifyPromise.then((v) => {
                if (v == "replace") {
                    s.IsWorking.set(true);
                    __saveChart(project).then(() => {
                        deletePrevious(loadedChart).then(reloadCharts);
                    });
                } else {
                    __saveChart(project).then(reloadCharts);
                }
            }, () => {
                return;
            });
        } else {
            __saveChart(project);
        }
    }
    
</script>
<style>
   label {
       display: block;
   }
   .submit {
    display: block;
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
            required    
            id="project-list"
            name="project"
            list="saved-projects"
            type="text"
        />
        <datalist id="saved-projects">
            {#each returnProjects(value.data) as project}
                <option value={project} />
            {/each}
        </datalist>
        <input
            type="submit"
            class="button button--primary submit"
            value="Save chart"
            bind:this="{saveButton}"
        />
    </form>
{/await}

