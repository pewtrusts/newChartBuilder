<script>
</script>

<style>
    .banner {
        width: 100%;
        height: var(--banner-height, 75px);
        background-color: var(--brand-primary, #000);
        position: fixed;
        top: 0;
        display: flex;

    }
    .logo {
        height: calc(var(--banner-height, 75px) - 26px)
    }
    h1 {
        color: #fff;
    }
</style>

<div class="banner">
    <div class="ctn flex">
        <div class="ctn ctn--full flex">

            <div class="ctn ctn--inner flex flex-ac flex-sb">
                <img src="./assets/logo.png" alt="The Pew Charitable Trusts" class="logo" />
                <h1>Griffin Chart Builder</h1>
                <div></div>
            </div>
        </div>
    </div>
</div>
