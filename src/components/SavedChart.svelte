<script>
    import loadChart from './../scripts/load-chart';
    export let data;
    let date = new Date(+data.timestamp);
    function clickHandler(){
        loadChart(data);
    }
</script>
<style>
    aside {
        border: 1px solid var(--light-gray, #767676);
        padding: 0.5rem;
        font-size: 0.75rem;
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
<aside>
    <time datetime="{date.toISOString()}">
        {date.toLocaleDateString(undefined,
            {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }
        )}
    </time>
    <h1 class="hed">{data.hed}</h1>
    <figure>
        <img src="{data.thumbnail}" alt="chart thumbnail" />
    </figure>
    <dl>
        <dt class="visually-hidden">Project</dt>
        <dd class="project">{data.project}</dd>
        <dt class="visually-hidden">Creator</dt>
        <dd>{data.name}</dd>
    </dl>
    <button on:click="{clickHandler}" class="button button--primary">Load</button>
</aside>