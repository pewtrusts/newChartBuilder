<script context="module">
    import tippy from 'tippy.js';
</script>
<script>
    let notice;
</script>

<dt class:isActive="{!!notice.onclick}" on:click="{!!notice.onclick ? notice.onclick : null}" use:initTippy={{index:i}} class="{notice.type}">{notice.label}</dt>
<dd class="visually-hidden">{notice.description}</dd>