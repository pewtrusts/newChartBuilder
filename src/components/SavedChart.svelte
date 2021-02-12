<script>
    export let data;
    let date = new Date(+data.timestamp);
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
    <img src="{data.thumbnail}" alt="chart thumbnail" />
    <dl>
        <dt class="visually-hidden">Project</dt>
        <dd class="project">{data.project}</dd>
        <dt class="visually-hidden">Creator</dt>
        <dd>{data.name}</dd>
    </dl>
    <button class="button button--primary">Load</button>
</aside>