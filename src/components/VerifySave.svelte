<script context="module">
    import Button from './Button.svelte';
    import { fade } from 'svelte/transition';
    import Sprite from './Sprite.svelte';
    import LoadChart from './LoadChart.svelte';
</script>

<script>
    export let showVerify = false;
    export let loadedChart;
    export let verifyResolve;
    export let verifyReject;
    function keydownHandler(e){
        if ( e.keyCode == 27 ){ //ESC
            showVerify  = false;
        }
    }
    function submitHandler(){
        console.log(this);
        verifyResolve(this.value);
        showVerify = false;
    }
    function closeHandler(){
        showVerify = false;
    }
    function init(){
        console.log('init verify');
        
        return {
            destroy(){
                verifyReject();
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
<svelte:body on:keydown="{showVerify ? keydownHandler : null}" />
<div use:init transition:fade class="container">
    <div class="screen"></div>
    <div class="inner">
        <div class="button-container-outer">
            <div class="button-container">
                <Button clickHandler="{closeHandler}" iconID="circle-x" title="close" />
            </div>
        </div>
        <div style="width:20px">
            <Sprite id="warning" />
        </div>
        {#if loadedChart}
            <div style="max-width: 200px;">
                <LoadChart disabled="{true}" data="{loadedChart}" />
            </div>
        {/if}
        <p>You have edited an existing chart. Do you want to replace it with the new one or keep it?</p>
        <Button clickHandler="{submitHandler}" title="Replace it" type="primary" value="replace" />
        <Button clickHandler="{submitHandler}" title="Keep it" type="primary"  value="keep"/>
    </div>
</div>
