<script>
    import { s } from './../store';
    import Notices from './Notices.svelte';
    import Button from './Button.svelte';
    import toDate from './../scripts/coerce-to-date';
    export let type;
    let notices = new Set();
    let xAxisCategories;
    let xAxisType;
    let collection = [];
    let spacingTop;
    let inputByIndex;
    let dict = {
        PlotBands: {
            header: 'Plot bands'
        },
        PlotLines: {
            header: 'Plot lines'
        },
    }
    s.SpacingTop.subscribe(v => {
        spacingTop = v;
    });
    s.PlotMarks.subscribe(v => { // plotmarks is derived concat of PlotBands and PlotLines
        const hasLabels = v.some(d => d.label.text !== '');
        if ( spacingTop < 20 && hasLabels ){
            s.SpacingTop.set(20);
        } else if (!hasLabels) {
            s.SpacingTop.set(10);
        }
    });
    s[type].subscribe(v => {
        collection = v || [];
        checkInputByIndex();
    });
    function checkInputByIndex(){
        inputByIndex = collection.map(plotMark => {
            switch (type){
                case 'PlotBands':
                    if (xAxisCategories && ((plotMark.from !== '' && plotMark.from % 1 !== 0) || (plotMark.to !== '' && plotMark.to % 1 !== 0))){
                        return true;
                    }
                    return false;
                case 'PlotLines':
                    if (xAxisCategories && (plotMark.value !== '' && plotMark.value % 1 !== 0) ){
                        return true;
                    }
                    return false;
            }
        }); 
    }

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
    
    s.XAxisCategories.subscribe(v => {
        xAxisCategories = v;
        notices[v ? 'add' : 'delete'](categoricalNotice);
        notices = notices;
        checkInputByIndex();
    });
    s.XAxisType.subscribe(v => {
        xAxisType = v;
        notices[v == 'datetime' ? 'add' : 'delete'](datetimeNotice);
    });
    function submit(){
        const collection = [];
        const data =  new FormData(this);
        for (let [name,value] of data ){
            let index = parseInt(name);
            let property = name.split('-')[1];
            collection[index] = collection[index] || {};
            collection[index][property] = property == 'label' ? type == 'PlotBands' ? {text: value, y: -5} : {text: value, y: -5, x: 0, rotation: 0} : xAxisType == 'datetime' && isNaN(+value) ? toDate(value).getTime() : isNaN(+value) ? value : +value;
        }
        s[type].set(collection);
    }
    function inputByIndexHandler(){
        inputByIndex[this.dataset.index] = this.checked;
    }
    function checkValidity(){
        if (this.value === '' || (isNaN(+this.value) && toDate(this.value, true).toString() != 'Invalid Date' ) || (!isNaN(this.value) && this.value % 1 === 0)){
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
    fieldset {
        margin-bottom: 0.2em;
    }
</style>
<div class="wrapper">
    <Notices {notices} />
    <h3>{dict[type].header}</h3>
    <form on:submit|preventDefault={submit}>
        {#if xAxisType == 'datetime'}
        <p>Existing date values are expressed in milliseconds since or before midnight on January 1, 1970.
            You may enter new date values that way or in human-readable forms such as "August 20, 2020" or "8/20/2020" 
            or as UTC time to include time of day (e.g. "Fri Apr 23 00:20:21 2021 UTC"). Human readable forms are converted
            to milliseconds when the form is submitted.
        </p>
        {/if}
        {#each collection as item, i}
        <fieldset>
            <legend>{dict[type].header.replace(/s$/,'')} {i + 1}</legend>
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label>{type == 'PlotBands' ? 'From' : 'Value' }:
                {#if xAxisCategories && !inputByIndex[i]}
                    <select required value="{type == 'PlotBands' ? item.from : item.value}" name="{i}-{type == 'PlotBands' ? 'from': 'value'}" id="">
                        {#each xAxisCategories as category, j}
                        <option value="{j}">{category}</option>
                        {/each}
                    </select>
                {:else if xAxisType == 'datetime'}
                <input type="text" on:change="{checkValidity}" required bind:value="{item.from}" name="{i}-{type == 'PlotBands' ? 'from': 'value'}">
                {:else}
                <input type="number" step="any" required bind:value="{item.from}" name="{i}-{type == 'PlotBands' ? 'from': 'value'}">
                {/if}
            </label>
            {#if type == 'PlotBands'}
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label>To:
                {#if xAxisCategories && !inputByIndex[i]}
                    <select required bind:value="{item.to}" name="{i}-to" id="">
                        {#each xAxisCategories as category, j}
                        <option value="{j}">{category}</option>
                        {/each}
                    </select>
                {:else if xAxisType == 'datetime'}
                <input type="text" on:change="{checkValidity}" required bind:value="{item.to}" name="{i}-to">
                {:else}
                <input type="number" step="any" required bind:value="{item.to}" name="{i}-to">
                {/if}
            </label>
            {/if}
            <label>Label: <input value="{item.label.text}" name="{i}-label" type="text"></label>
            {#if xAxisCategories }
            <label><input data-index="{i}" on:change="{inputByIndexHandler}" checked="{inputByIndex[i]}" type="checkbox"> Input by index</label>
            {/if}
            {#if i == collection.length - 1}
            <Button title="Remove" type="secondary" clickHandler="{() => {
                collection.pop();
                collection = collection;
            }}" />
            {/if}
        </fieldset>
        {/each}
        {#if collection.length > 0}
        <input class="button button--primary" type="submit">
        {/if}
        <Button title="Add another" type="secondary" clickHandler="{e => {
            e.preventDefault();
            collection.push(type == 'PlotBands' ? {to:'',from:'',label:{text:''}} : {value:'',label:{text:''}});
            collection = collection;
        }}" />
    </form>
</div>
