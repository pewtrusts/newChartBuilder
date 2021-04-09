<script context="module">
    import Login from './Login.svelte'
    import YAxis from './YAxis.svelte';
    import XAxis from './XAxis.svelte';
    import Legend from './Legend.svelte';
    import Notices from './Notices.svelte';
    import { s } from './../store';
    
    function stackingHandler(){
        const value = this.value == 'none' ? undefined : this.value;
        s.Stacking.set(value);
    }
</script>
<script>

    export let savedCharts;
    let project;
    let stacking;
    let reverseStacks;
    let notices = new Set();
    let spacingRight;
    let stackingNotice = {
        label: 'Reversing stacks?',
        description: 'Reversing stacks is not working as expected in Highcharts 8.2.2 when the series are stacked vertically. ' +
        'You may go to the data section and reverse the series there. You may also want to reverse the legend.',
        type: 'warning'
    };
    s.ChartProject.subscribe(v => {
        project = v;
    });
    s.Stacking.subscribe(v => {
        stacking = v;
        requestIdleCallback(checkMessage, {timeout: 500});
    });
    s.XAxisReversedStacks.subscribe(v => {
        reverseStacks = v;
        requestIdleCallback(checkMessage, {timeout: 500});
    });
    s.SpacingRight.subscribe(v => {
        spacingRight = v;
    });
    function spacingHandler(){
        s.SpacingRight.set(+this.value);
    }
    function checkMessage(){
        notices[stacking !== 'none' && reverseStacks ? 'add' : 'delete'](stackingNotice);
        notices = notices;
    }
    function changeHandler(){
        s.ChartProject.set(this.value);
    }
    function stackHandler(){
        s.XAxisReversedStacks.set(this.checked);
    }

</script>
<style>
    label {
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
    type="text"
    on:change="{changeHandler}"
/>
<p>
    The project name is necessary if you are designing a chart for project with custom styles. Otherwise, the project name is optional.
    Saved charts will have the project name saved with them for easier retrieval later.</p>
{/await}
<Notices {notices} position="left" />
<label>Spacing right: <input on:change="{spacingHandler}" type="number" bind:value="{spacingRight}"></label>
<label for="stacking-selector">Stacking:</label>
<!-- svelte-ignore a11y-no-onchange -->
<select on:change="{stackingHandler}" name="stacking" id="stacking-selector" bind:value="{stacking}">
    <option value="none">None</option>
    <option value="normal">Normal</option>
    <option value="percent">Percent</option>
</select>
<label><input on:change="{stackHandler}" checked="{reverseStacks}" type="checkbox"> Reverse stacks</label>
<Legend />
<YAxis />
<XAxis />