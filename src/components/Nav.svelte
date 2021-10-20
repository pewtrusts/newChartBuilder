<script context="module">
    import {s} from './../store';
</script>
<script>
    import slugger from 'slugger';
    import Sprite from './Sprite.svelte';
    export let buildModeMultipleEnabled;
    let activeSection;
    let sections = [
        {
            name: 'Start',
            icon: 'signpost'
        },
        {
            name: 'Data',
            icon: 'spreadsheet'
        },
        {
            name: 'Text',
            icon: 'text',
            style: 'bottom: 2px;'
        },
        {
            name: 'X Axis',
            icon: 'x-axis',
            style: 'bottom: 2px;'
        },
        {
            name: 'Y Axis',
            icon: 'y-axis',
            style: 'bottom: 2px;'
        },
        {
            name: 'Legend',
            icon: 'question-mark'
        },
        {
            name: 'Colors',
            icon: 'droplet',
            style: 'bottom: 2px;'
            
        },
        {
            name: 'Mobile',
            icon: 'phone',
            style: 'bottom: 2px;'
            
        },
        {
            name: 'Other',
            icon: 'cog',
        },
        {
            name: 'Custom',
            icon: 'cogs',
        },
        {
            name: 'Code',
            icon: 'code',

        },
        {
            name: 'Save',
            icon: 'data-transfer-upload',
        },
        {
            name: 'Print',
            icon: 'document',
            style: 'left: 2px;bottom: 2px;'
        },
        {
            name: 'Multiple',
            icon: 'grid-two-up',
            style: 'bottom: 2px;'
        }
    ];
    let buildMode;
    s.ActiveSection.subscribe(({value}) => {
        activeSection = value;
    });
    s.BuildMode.subscribe(v => {
        buildMode = v;
    });
    function clickHandler(){
        if (this.getAttribute('disabled') == 'true'){
            return;
        }
        s.ActiveSection.set({method: 'click', value: slugger(this.title)});
    }
</script>
<style>
    ul {
        margin: 0;
        padding: 0;
        list-style-type: none;
    }
    li {
        border-top: 1px solid #fff; ;
        padding: 2px;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 55px;
        position: relative;

    }
    li:last-of-type {
        border-bottom: 1px solid #fff;
    }
    li.isActive::after {
        content: '';
        position: absolute;
        height: 100%;
        top: 0px;
        left: 100%;
        width: 3px;
        background-color: var(--highlight-color, red);
        z-index: 3;
        border-top-right-radius: 3px;
        border-bottom-right-radius: 3px;
    }
    a {
        line-height: 0;
        position: relative;
        right: 1px;
        display: inline-flex;
        height: 85%;
        justify-content: space-around;
        flex-direction: column;
        align-items: center;
        color: var(--medium-gray, #bbb);
        font-size: 0.75rem;
    }
    a[disabled='true']{
        cursor: not-allowed;
    }
    .navigation-section {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 55px;
        background-color: var(--dark-background, #000);
        height: 100%;
        
    }
    .disabled {
        opacity: 0.25;
    }
</style>
<div class="navigation-section">
    <nav>
        <ul>
            {#each sections as section}
            <li class:isActive="{slugger(section.name) == activeSection}" class:disabled="{!buildModeMultipleEnabled.includes(section.name) && buildMode == 'multiple'}">
                <a on:click|preventDefault="{clickHandler}" title="{section.name}" href="#{slugger(section.name)}" disabled="{!buildModeMultipleEnabled.includes(section.name) && buildMode == 'multiple'}">
                    <Sprite width="25" id="{section.icon}" gray="{true}" white="{slugger(section.name) == activeSection}" style="{section.style}" />
                    <div>{section.name}</div>
                </a>
            </li>
            {/each}
        </ul>
    </nav>
</div>
