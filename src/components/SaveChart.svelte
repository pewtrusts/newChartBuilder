<script>
    import brandOptions from './../brand-options.json';
    import { loginHandler } from './ListSavedCharts.svelte';
    export let savedCharts;
    export let loadedChart;
    export let showVerify;
    export let verifyPromise;
    export let resolveSaved;
    $:projectFromLoadedChart = loadedChart ? loadedChart.project : '';
    function returnProjects(charts){
        return Array.from(new Set(charts.map(c => c.project)));
    }
    function submitHandler(){
        console.log({loadedChart});
        if (loadedChart){
            showVerify = true;
            /**
             * verifyPromise is not set in time . need to await the mounting
             * of VerifySave before you can move forward.
            */
           /* verifyPromise.then(v => {
                console.log({v});
            });*/
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
{#await savedCharts}
    <p>You need to log in to Google using your {brandOptions.emailDomain} address to save charts.</p>
    <button on:click="{loginHandler}" class="button button--primary">Log in</button>
{:then charts}
<form>
    <label for="project-list">Project name (select existing or add a new one):</label>
    <input value="{projectFromLoadedChart}" class="datalist-input" required id="project-list" name="project-list" list="saved-projects">
    <datalist id="saved-projects">
        {#each returnProjects(charts) as project}
        <option value="{project}"></option>
        {/each}
    </datalist>
    <input type="submit" on:click|preventDefault="{submitHandler}" class="button button--primary" value="Save chart" />
</form>
{/await}