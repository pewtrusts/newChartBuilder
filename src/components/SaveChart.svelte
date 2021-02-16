<script>
    import brandOptions from './../brand-options.json';
    import { loginHandler } from './ListSavedCharts.svelte';
    export let savedCharts;
</script>
{#await savedCharts}
    <p>You need to log in to Google using your {brandOptions.emailDomain} address to save charts.</p>
    <button on:click="{loginHandler}" class="button button--primary">Log in</button>
{:then _}
<button on:click="{() => {}}" class="button button--primary">Save chart</button>
{/await}