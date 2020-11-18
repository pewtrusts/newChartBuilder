<script context="module">
    import slugger from 'slugger';
</script>
<script>
    export let text;
</script>
<style>
    .section-anchor {
        display: block;
        width: 1px;
        height: calc(100vh - var(--banner-height, 75px) - 90px);
        position: absolute;
        top: -80px;
        outline: 1px solid cyan;
        z-index: 9;
    }
</style>
<a name="{slugger(text)}" id="{slugger(text)}" class="section-anchor"><span class="visually-hidden">{text}</span></a>
<h2>{text}</h2>
