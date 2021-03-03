<script>
import { ActiveSection } from './../store';
import Button from "./Button.svelte";
export let destroy;
export let props;
function clickHandler(){
    if (this.value == 'yes'){
        ActiveSection.set({method: 'click', value: 'save'});
        props.clickSave();
    }
    destroy();
}

</script>
<p>Your chart has unsaved changes. Would you like to save it now?</p>
<Button type="primary" title="Yes" value="yes" {clickHandler} />
<Button type="primary" title="No" value="no" {clickHandler} />  