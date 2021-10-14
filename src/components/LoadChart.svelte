<script context="module">
    import loadChart from '../scripts/load-chart';
    import { s } from './../store';
    import { get } from 'svelte/store';
</script>
<script>
    export let data;
    export let loadedChart;
    export let disabled = false;
    export let projectFilter;
    export let typeFilter;
    export let creatorFilter;
    let date = new Date(+data.timestamp);
    let enableMultiple;
    export let numberLoaded = 0;
    $: buttonText = enableMultiple ? `Load as chart ${numberLoaded + 1}` : 'Load';
    s.ActiveSection.subscribe(v => {
        enableMultiple = (v.value == 'multiple');
    });
    s.LoadedMultipleCharts.subscribe(v => {
        console.log(v);
    });
    function clickHandler(){
        if (!enableMultiple){
            loadedChart = data;
            loadChart(data);
            s.ActiveSection.set({method: 'click', value: 'data'});
        } else {
            numberLoaded++;
            let existing = get(s.LoadedMultipleCharts);
            if (existing.length == 0){
                loadedChart = data;
                loadChart(data);
            }
            existing.push(data);
            s.LoadedMultipleCharts.set(existing);
            requestIdleCallback(() => {
                s.ActiveSection.set({method: 'click', value: 'multiple'});
            }, {timeout: 200});
        }

    }
</script>
<style>
    aside {
        color: var(--text-color, #000);
        background-color: #fff;
        border: 1px solid var(--light-gray, #767676);
        padding: 0.5rem;
        font-size: 0.75rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    h1 {
        font: inherit
    }
    img {
        width: 100%;
    }
    .hed {
        margin: 0;
        font-weight: bold;
    }
    dl {
        margin-bottom: 0;
    }
    dd {
        margin: 0;
        padding: 0;
        color: #767676;
    }
    .project {
        font-weight: bold;
    }
    figure {
        position: relative;
        width: 100%;
        height: 0;
        padding-bottom: 65%;
    }
    img {
        position: absolute;
        object-fit: contain;
        height: 100%;
    }
    
</style>
{#if disabled || 
     ((projectFilter == 'any' || projectFilter == data.project) &&
     (typeFilter == 'any' || typeFilter == data.type) &&
     (creatorFilter == 'any' || creatorFilter == data.name)) } 
<aside>
    <div>
        <time datetime="{date.toISOString()}">
            {date.toLocaleDateString(undefined,
                {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }
            )}
        </time>
        <h1 class="hed">{@html data.hed}</h1>
    </div>
    <figure>
        <img src="{data.thumbnail}" alt="chart thumbnail" />
    </figure>
    <div>
        <dl>
            <dt class="visually-hidden">Project</dt>
            <dd class="project">{data.project}</dd>
            <dt class="visually-hidden">Creator</dt>
            <dd>{data.name}</dd>
        </dl>
        {#if !disabled }
        <div style="margin-top: 0.5em">
            <button 
                on:click="{clickHandler}"
                class="button" 
                class:button--secondary="{!enableMultiple}" 
                class:button--primary="{enableMultiple}"
            >
                {buttonText}
            </button>
        </div>
        {/if}
    </div>
</aside>
{/if}