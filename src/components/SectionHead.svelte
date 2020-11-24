<script context="module">
    import slugger from 'slugger';
</script>
<script>
    export let text;
</script>
<style>
    .section-anchor {
        position: absolute;
        top: -80px;
    }
    .observer {
        display: block;
        width: 1px;
        height: calc(25vh);
        position: absolute;
        top: calc(25vh - var(--banner-height, 75px));
    }
</style>
<a name="{slugger(text)}" id="{slugger(text)}" class="section-anchor"><span class="visually-hidden">{text}</span></a>
<div class="observer" data-section="{slugger(text)}"></div>
<h2>{text}</h2>