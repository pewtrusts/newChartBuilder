<script>
    import { s } from './../store';
    import Notices from './Notices.svelte';
    import Button from './Button.svelte';
    import toDate from './../scripts/coerce-to-date';
    let notices = new Set();
    let xAxisCategories;
    let xAxisType;
    let plotLines;
    let spacingTop;
    s.SpacingTop.subscribe(v => {
        spacingTop = v;
    })
    s.PlotLines.subscribe(v => {
        const hasLabels = v.some(d => d.label.text !== '');
        plotLines = v || [];
        if ( spacingTop < 20 && hasLabels ){
            s.SpacingTop.set(20);
        } else if (!hasLabels) {
            s.SpacingTop.set(10);
        }
    })
    let categoricalNotice = {
        label: 'Categorical axis',
        description: `The chart has a categorical x-axis, usually used for categories with no numeric relationship to one another,
        such as apples and oranges. Sometimes an axis that appears to be linear (numeric) or date-based (such as months of the year)
        will in fact be categorical. If you'd like to place plot lines between the categories, check the
        'input by index' box and enter numbers for the 'x-value' field. Categories start at zero. X-value
        1.5 would be halfway between the second and third categories. You may enter any decimal.`,
        type: 'info'
    };
    let datetimeNotice = {
        label: 'Datetime axis',
        description: `The chart has a datetime x-axis, where the values' x-positions are valid date objects and placed appropriately along
            the x-axis. Dates are converted to the number of milliseconds since (or before) midnight on January 1, 1970. To enter plot lines,
            enter dates as you would normally (such as 'April 17, 2018'). The values will change to milliseconds after they are submitted.`,
        type: 'info'
    };
    $:inputByIndex = plotLines.map(plotLine => {
        if (xAxisCategories && (plotLine.value !== '' && plotLine.value % 1 !== 0) ){
            return true;
        }
        return false;
    }); 
    s.XAxisCategories.subscribe(v => {
        xAxisCategories = v;
        notices[v ? 'add' : 'delete'](categoricalNotice);
        notices = notices;
    });
    s.XAxisType.subscribe(v => {
        xAxisType = v;
        notices[v == 'datetime' ? 'add' : 'delete'](datetimeNotice);
    });
    function submit(){
        const plotLines = [];
        const data =  new FormData(this);
         for (let [name,value] of data ){
            let index = parseInt(name);
            let property = name.split('-')[1];
            plotLines[index] = plotLines[index] || {};
            plotLines[index][property] = property == 'label' ? {text: value, y: -5, rotation: 0} : xAxisType == 'datetime' && isNaN(+value) ? toDate(value).getTime() : isNaN(+value) ? value : +value;
        }
        console.log(plotLines);
        s.PlotLines.set(plotLines);
    }
    function inputByIndexHandler(){
        inputByIndex[this.dataset.index] = this.checked;
    }
    function checkValidity(){
        if (this.   value === '' || (isNaN(+this.value) && toDate(this.value, true).toString() != 'Invalid Date' ) || (!isNaN(this.value) && this.value % 1 === 0)){
            this.setCustomValidity('');
        } else {
            this.setCustomValidity('Invalid input. Datetime values need to be expressed in milliseconds or as human-readable dates that can be converted.');
        }
        this.reportValidity();
    }
</script>
<style>
    .wrapper {
        position: relative;
    }
    label {
        display: inline-block;
    }
</style>
<div class="wrapper">
    <Notices {notices} />
    <h4>Plot lines</h4>
    <form on:submit|preventDefault={submit}>
        {#if xAxisType == 'datetime'}
        <p>Existing date values are expressed in milliseconds since or before midnight on January 1, 1970.
            You may enter new date values that way or in human-readable forms such as "August 20, 2020" or "8/20/2020" 
            or as UTC time to include time of day (e.g. "Fri Apr 23 00:20:21 2021 UTC"). Human readable forms are converted
            to milliseconds when the form is submitted.
        </p>
        {/if}
        {#each plotLines as plotLine, i}
        <fieldset>
            <legend>Plot band {i + 1}</legend>
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label>X-Value:
                {#if xAxisCategories && !inputByIndex[i]}
                    <select required bind:value="{plotLine.value}" name="{i}-value" id="">
                        {#each xAxisCategories as category, j}
                        <option value="{j}">{category}</option>
                        {/each}
                    </select>
                {:else if xAxisType == 'datetime'}
                <input type="text" on:change="{checkValidity}" required bind:value="{plotLine.value}" name="{i}-value">
                {:else}
                <input type="number" step="0.001" required bind:value="{plotLine.value}" name="{i}-value">
                {/if}
            </label>
            <label>Label: <input value="{plotLine.label.text}" name="{i}-label" type="text"></label>
            {#if xAxisCategories }
            <label><input data-index="{i}" on:change="{inputByIndexHandler}" checked="{inputByIndex[i]}" type="checkbox"> Input by index</label>
            {/if}
            {#if i == plotLines.length - 1}
            <Button title="Remove" type="secondary" clickHandler="{() => {
                plotLines.pop();
                plotLines = plotLines;
            }}" />
            {/if}
        </fieldset>
        {/each}
        <input class="button button--primary" type="submit">
        <Button title="Add another" type="secondary" clickHandler="{e => {
            e.preventDefault();
            plotLines.push({value:'',label:{text:''}});
            plotLines = plotLines;
        }}" />
    </form>
</div>
