<script>
    import { s } from './../store';
    import Notices from './Notices.svelte';
    import Button from './Button.svelte';
    import toDate from './../scripts/coerce-to-date';
    let notices = new Set();
    let xAxisCategories;
    let xAxisType;
    let plotBands;
    s.PlotBands.subscribe(v => {
        plotBands = v || [];
    })
    let categoricalNotice = {
        label: 'Categorical axis',
        description: `The chart has a categorical x-axis, usually used for categories with no numeric relationship to one another,
        such as apples and oranges. Sometimes an axis that appears to be linear (numeric) or date-based (such as months of the year)
        will in fact be categorical. If you'd like to place plotbands that start or stop in between the categories, check the
        'input by index' box and enter numbers for the 'to' and 'from' fields. Categories start at zero. From
        1.5 to 2.5 would start halfway between the second and third categories and stop between the third and fourth. You may enter any decimal.`,
        type: 'info'
    };
    let datetimeNotice = {
        label: 'Datetime axis',
        description: `The chart has a datetime x-axis, where the values' x-positions are valid date objects and placed appropriately along
            the x-axis. Dates are converted to the number of milliseconds since (or before) midnight on January 1, 1970. To enter plotbands,
            enter dates as you would normally (such as 'April 17, 2018'). The values will change to milliseconds after they are submitted.`,
        type: 'info'
    };
    $:inputByIndex = plotBands.map(plotBand => {
        if (xAxisCategories && ((plotBand.from !== '' && plotBand.from % 1 !== 0) || (plotBand.to !== '' && plotBand.to % 1 !== 0))){
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
        const plotBands = [];
        const data =  new FormData(this);
         for (let [name,value] of data ){
            let index = parseInt(name);
            let property = name.split('-')[1];
            plotBands[index] = plotBands[index] || {};
            plotBands[index][property] = property == 'label' ? {text: value} : xAxisType == 'datetime' && isNaN(+value) ? toDate(value).getTime() : isNaN(+value) ? value : +value;
        }
        console.log(plotBands);
        s.PlotBands.set(plotBands);
    }
    function inputByIndexHandler(){
        inputByIndex[this.dataset.index] = this.checked;
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
    <h4>Plot bands</h4>
    <form on:submit|preventDefault={submit}>
        {#if xAxisType == 'datetime'}
        <p>Existing date values are expressed in milliseconds since or before midnight on January 1, 1970.
            You may enter new date values that way or in human-readable forms such as "August 20, 2020" or "8/20/2020" 
            or as UTC time to include time of day (e.g. "Fri Apr 23 00:20:21 2021 UTC"). Human readable forms are converted
            to milliseconds when the form is submitted.
        </p>
        {/if}
        {#each plotBands as plotBand, i}
        <fieldset>
            <legend>Plot band {i + 1}</legend>
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label>From:
                {#if xAxisCategories && !inputByIndex[i]}
                    <select bind:value="{plotBand.from}" name="{i}-from" id="">
                        {#each xAxisCategories as category, j}
                        <option value="{j}">{category}</option>
                        {/each}
                    </select>
                {:else}
                <input bind:value="{plotBand.from}" name="{i}-from" type="text">
                {/if}
            </label>
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label>To:
                {#if xAxisCategories && !inputByIndex[i]}
                    <select bind:value="{plotBand.to}" name="{i}-to" id="">
                        {#each xAxisCategories as category, j}
                        <option value="{j}">{category}</option>
                        {/each}
                    </select>
                {:else}
                <input bind:value="{plotBand.to}" name="{i}-to" type="text">
                {/if}
            </label>
            <label>Label: <input value="{plotBand.label.text}" name="{i}-label" type="text"></label>
            {#if xAxisCategories }
            <label><input data-index="{i}" on:change="{inputByIndexHandler}" checked="{inputByIndex[i]}" type="checkbox"> Input by index</label>
            {/if}
            {#if i == plotBands.length - 1}
            <Button title="Remove" type="secondary" clickHandler="{() => {
                plotBands.pop();
                plotBands = plotBands;
            }}" />
            {/if}
        </fieldset>
        {/each}
        <input class="button button--primary" type="submit">
        <Button title="Add another" type="secondary" clickHandler="{e => {
            e.preventDefault();
            plotBands.push({to:'',from:'',label:{text:''}});
            plotBands = plotBands;
        }}" />
    </form>
</div>
