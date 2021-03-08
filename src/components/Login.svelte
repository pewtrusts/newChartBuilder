<script context="module">
    import { loginHandler } from "./ListSavedCharts.svelte";
    import brandOptions from './../brand-options.json';
</script>
<script>
    export let reason;
</script>
<p>
    Please log in to Google using your {brandOptions.emailDomain} address
    {reason}.
</p>
<button on:click={loginHandler} class="button button--primary">Log in</button>