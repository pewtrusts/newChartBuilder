<script>
    import slugger from 'slugger';
    import Sprite from './Sprite.svelte';
    let sections = [
        {
            name: 'Data',
            icon: 'spreadsheet'
        },
        {
            name: 'Settings',
            icon: 'project',
            style: 'transform: rotate(90deg);'
        }
    ];
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

    }
    li:last-of-type {
        border-bottom: 1px solid #fff;
    }
    a {
        line-height: 0;
        position: relative;
        top: 1px;
    }
    .navigation-section {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 40px;
        background-color: var(--dark-background, #000);
        height: 100%;
        padding-top: 85px;
    }
</style>
<div class="navigation-section">
    <nav>
        <ul>
            {#each sections as section}
            <li><a title="{section.name}" href="#{slugger(section.name)}"><Sprite width="28" id="{section.icon}" gray="{true}" style="{section.style}" /></a></li>
            {/each}
        </ul>
    </nav>
</div>
