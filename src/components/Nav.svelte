<script context="module">
    import {ActiveSection} from './../store';
</script>
<script>
    import slugger from 'slugger';
    import Sprite from './Sprite.svelte';
    let activeSection;
    let sections = [
        {
            name: 'Data',
            icon: 'spreadsheet'
        },
        {
            name: 'Settings',
            icon: 'settings',
            style: 'bottom: 2px;'
        },
        {
            name: 'Colors',
            icon: 'droplet',

        }
    ];
    ActiveSection.subscribe(v => {
        activeSection = v;
    });
    function clickHandler(){
        ActiveSection.set(slugger(this.title));
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
        height: 40px;
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
    }
    .navigation-section {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 40px;
        background-color: var(--dark-background, #000);
        height: 100%;
        padding-top: 80px;
    }
</style>
<div class="navigation-section">
    <nav>
        <ul>
            {#each sections as section}
            <li class:isActive="{slugger(section.name) == activeSection}"><a on:click|preventDefault="{clickHandler}" title="{section.name}" href="#{slugger(section.name)}"><Sprite width="25" id="{section.icon}" gray="{true}" white="{slugger(section.name) == activeSection}" style="{section.style}" /></a></li>
            {/each}
        </ul>
    </nav>
</div>
