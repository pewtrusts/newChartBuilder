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
        height: 1px;
        position: relative;
        bottom: var(--banner-height, 75px);
    }
</style>
<a name="{slugger(text)}" id="{slugger(text)}" class="section-anchor"><span class="visually-hidden">{text}</span></a>
<h2>{text}</h2>
