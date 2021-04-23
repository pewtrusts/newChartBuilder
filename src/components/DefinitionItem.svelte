<script context="module">
    import tippy from 'tippy.js';
    import { afterUpdate } from 'svelte';
</script>
<script>
    export let notice;
    let dt;
    let _tippy;
    /*function initTippy(node){
        var _tippy = tippy(node, {content: notice.description});
        return {
            update(){
                _tippy.destroy();
                //content is not updating
                setTimeout(() => {
                 //   _tippy = tippy(node, {content: returnContent()});
                }, 5000);
            },
            destroy(){
                _tippy.destroy();
            }
        };
    }*/
    afterUpdate(() => {
        if ( _tippy ) _tippy.destroy();
        _tippy = tippy(dt, {content: notice.description});

    });
</script>
<style>
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
<dt bind:this="{dt}" class:isActive="{!!notice.onclick}" on:click="{!!notice.onclick ? notice.onclick : null}" class="{notice.type}">{notice.label}</dt>
<dd class="visually-hidden">{notice.description}</dd>