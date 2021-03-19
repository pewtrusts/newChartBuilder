<script context="module">
    import Button from './Button.svelte';
    import { fade } from 'svelte/transition';
    import Sprite from './Sprite.svelte';
</script>

<script>
    export let dialog;
    export let dialogReject = function(){};
    export let showWarning = false;
    function keydownHandler(e){
        if ( e.keyCode == 27 ){ //ESC
            dialog  = null;
        }
    }
    function closeHandler(){
        dialog = null;
    }
    function init(){
        
        
        return {
            destroy(){
                dialogReject('dialog closed');
            }
        };
    }
</script>
<style>
    .button-container-outer {
        width: 100%;
        position: relative;
    }
    .button-container {
        position: absolute;
        top: -7px;
        right: -1rem;
    }
    .container {
        position: fixed;
        top: var(--banner-height, 75px);
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 4;
    }
    .inner {
        width: 100%;
        max-width: 800px;
        padding: 1rem;
        margin: auto;
        background: #fff;
        z-index: 1;
    }
    .screen {
        position: absolute;
        top: 0;
        right: 0; 
        bottom: 0;
        left: 0;
        background-color: var(--dark-background, #000);
        opacity: 0.5;
        z-index: -1;
    }
</style>
<svelte:body on:keydown="{dialog ? keydownHandler : null}" />
<div use:init transition:fade class="container">
    <div class="screen"></div>
    <div class="inner">
        <div class="button-container-outer">
            <div class="button-container">
                <Button clickHandler="{closeHandler}" iconID="circle-x" title="close" />
            </div>
        </div>
        {#if showWarning}
        <div style="width:20px">
            <Sprite id="warning" />
        </div>
        {/if}
        {#if dialog}
        <svelte:component this="{dialog.component}" destroy="{() => dialog = null}" props="{dialog.props}" />
        {/if}
    </div>
</div>
