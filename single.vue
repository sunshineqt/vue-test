<template>
    <div>
        {{msg}}
    </div>
</template>

<script>
    export default {
        name:'single',
        // 组件中的data必须是函数，只有在全局的vue实例中才是对象
        data(){
            return {
                msg:'dssd'
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>