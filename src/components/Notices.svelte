<script context="module">
    import tippy from 'tippy.js';
    function initTippy(node, {content}){
        tippy(node, {content});
    }
</script>
<script>
    export let notices;
    export let position;
    
</script>
<style>
/*    .container {
        margin-top: -1em;
        margin-bottom: -1em;
    }*/
    dl {
        display: flex;
        justify-content: flex-end;
        margin: 0;
        padding: 0;
        min-height: 21px;
    }
    dl.left {
        justify-content: start;
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
    .isActive {
        cursor: pointer;
    }
</style>
<div class="container">
    <p class="visually-hidden">Notices</p>
    <dl class:left="{position == 'left'}">
        {#each [...notices] as notice}
    <dt class:isActive="{!!notice.onclick}" on:click="{!!notice.onclick ? notice.onclick : null}" use:initTippy={{content: notice.description}} class="{notice.type}">{notice.label}</dt>
        <dd class="visually-hidden">{notice.description}</dd>
        {/each}
    </dl>
</div>