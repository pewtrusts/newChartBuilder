<script context="module">
    import Login from './Login.svelte'
    import { ChartProject } from './../store';
</script>
<script>
    export let savedCharts;
    let project;
    ChartProject.subscribe(v => {
        project = v;
    });
    function changeHandler(){
        ChartProject.set(this.value);
    }
</script>
<style>
    label {
        font-weight: 900;
        display: block;
    }
</style>
{#await savedCharts}
<Login reason="to load previous projects" />
{:then _}
<label for="project-list--settings">Project name (select existing or add a new one):</label>
<input
    value={project}
    class="datalist-input"
    id="project-list--settings"
    name="project"
    list="saved-projects"
    on:change="{changeHandler}"
/>
<p>
    The project name is necessary if you are designing a chart for project with custom styles. Otherwise, the project name is optional.
    Saved charts will have the project name saved with them for easier retrieval later.</p>
{/await}