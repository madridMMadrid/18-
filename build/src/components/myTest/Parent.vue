<template>
    <div>
        <div>Дочерний компонент</div>
        <child :test="test" :msg="msg" :isAdmin="isAdmin" />
        <number-renderer :even="even"/>
    </div>
</template>
<script>
import Child from './Child.vue'
import NumberRenderer from './NumberRenderer.vue'

export default {
    name: 'Parent',
    components: {
        Child,
        NumberRenderer
    },
    data() {
        return {
            test: 'Какой то текст',
            msg: 'Войти',
            isAdmin: true,
            even: false
        }
    },
}
</script>