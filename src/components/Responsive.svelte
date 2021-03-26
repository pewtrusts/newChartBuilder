<script>
    import {s} from './../store';
    import {get} from 'svelte/store';
    let value;
    s.ChartConfig.subscribe(v => {
        value = JSON.stringify(v.responsive.rules.slice(0), null, 2);
        // rules[0] governs min height which is handled by the GUI
    });
    function handler(){
        //TO DO: try/catch
        const _config = get(s.ChartConfig);
        const _rules = JSON.parse(value);
        _config.responsive.rules = _rules;
        s.ChartConfig.set(_config);
    }
    
</script>
<form on:submit|preventDefault="{handler}">
    <textarea bind:value></textarea>
    <input type="submit" class="button button--primary">
</form>