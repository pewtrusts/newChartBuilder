<script context="module">
    
    import Notices from './Notices.svelte';
    import DataLabels from './DataLabels.svelte';
    import { s } from './../store';
    
    function stackingHandler(){
        const value = this.value == 'none' ? undefined : this.value;
        s.Stacking.set(value);
    }
</script>
<script>

    let stacking;
    let reverseStacks;
    let notices = new Set();
    let spacingRight;
    let spacingTop;
    let stackingNotice = {
        label: 'Reversing stacks?',
        description: 'Reversing stacks is not working as expected in Highcharts 8.2.2 when the series are stacked vertically. ' +
        'You may go to the data section and reverse the series there. You may also want to reverse the legend.',
        type: 'warning'
    };
    
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
    s.SpacingTop.subscribe(v => {
        spacingTop = v;
    });
    function spacingRightHandler(){
        s.SpacingRight.set(+this.value);
    }
    function spacingTopHandler(){
        s.SpacingTop.set(+this.value);
    }
    function checkMessage(){
        notices[stacking !== 'none' && reverseStacks ? 'add' : 'delete'](stackingNotice);
        notices = notices;
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
<Notices {notices} position="left" />
<label>Spacing top: <input name="top" on:change="{spacingTopHandler}" type="number" bind:value="{spacingTop}"></label>
<label>Spacing right: <input name="right" on:change="{spacingRightHandler}" type="number" bind:value="{spacingRight}"></label>
<label for="stacking-selector">Stacking:</label>
<!-- svelte-ignore a11y-no-onchange -->
<select on:change="{stackingHandler}" name="stacking" id="stacking-selector" bind:value="{stacking}">
    <option value="none">None</option>
    <option value="normal">Normal</option>
    <option value="percent">Percent</option>
</select>
<label><input on:change="{stackHandler}" checked="{reverseStacks}" type="checkbox"> Reverse stacks</label>
<DataLabels />
