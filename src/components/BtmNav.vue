<template>
    <div class="bottomNav">
        <div class="btmnavPc">
            <a>Buy OPC</a>
            <a>Buy OPS</a>
            <a>Medium</a>
            <a>Telegram</a>
            <a>Twitter</a>
            <a>GitHub</a>
        </div>
    </div>
</template>
<script>
export default {
    
}
</script>
<style lang="less" scoped>
.bottomNav{
    position:absolute;
    bottom:32px;
    text-align:center;
    width:100%;
    .btmnavPc{
        a{
            font-size:16px;
            color:#A9ADBA;
            line-height:100%;
            padding:0 25px;
        }
    }
}
@media screen and (max-width: 750px) {
    .bottomNav{
        display:none;
    }
}
</style>