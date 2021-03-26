<script>
    import {s} from './../store';
    let value;
    s.OtherResponsive.subscribe(v => {
        value = JSON.stringify(v, null, 2);
        // rules[0] governs min height which is handled by the GUI
    });
    function handler(){
        //TO DO: try/catch
        const rules = JSON.parse(value);
        s.OtherResponsive.set(rules);
    }
    
</script>
<form on:submit|preventDefault="{handler}">
    <textarea bind:value></textarea>
    <input type="submit" class="button button--primary">
</form>