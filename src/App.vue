<template>
    <section class="home">
        {{showText}}
    </section>
</template>
<script>
export default {
    name: 'App',
    data () {
        return {
            showText: 'vue实例启动成功'
        }
    }
}
</script>
<style lang="less" scoped>
.home {
    position: relative;
    width: 100%;
    height: 100%;
}
</style>