<script context="module">
    import tippy from 'tippy.js';
    function initTippy(node, content){
        tippy(node, {content});
    }
</script>
<script>
    export let notices;
</script>
<style>
    .container {
        margin-top: -1em;
        margin-bottom: -1em;
    }
    dl {
        display: flex;
        justify-content: flex-end;
        margin: 0;
        padding: 0;
        min-height: 21px;
    }
    dt {
        font-size: 0.75rem;
        padding: 0.07em 0.25em 0.1em;
        border-radius: 0.25em;
        display: inline-block;
        border: 1px solid gray;
        margin-right: 2px;
        margin-bottom: 2px;
    }
    .info {
        color: var(--info, #767676);
        border-color: var(--info, #767676);
    }
    .warning {
        color: var(--warning, orange);
        border-color: var(--warning, orange);
    }
    .error {
        color: #fff;
        background-color: var(--error, red);
        border-color: var(--error, red);
    }
</style>
<div class="container">
    <p class="visually-hidden">Notices</p>
    <dl>
        {#each [...notices] as notice}
    <dt use:initTippy={notice.description} class="{notice.type}">{notice.label}</dt>
        <dd class="visually-hidden">{notice.description}</dd>
        {/each}
    </dl>
</div>