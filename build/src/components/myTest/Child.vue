<template>
  <div>
    <span v-if="isAdmin">Привилегии администратора</span>
    <span v-else>Не авторизован</span>
    <button>{{ msg }}</button>
    <p>Child {{ test }}</p>
  </div>
</template>
<script>
export default {
  props: {
    test: {
      type: String,
      required: false
    },
    msg: {
      type: String,
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  }
};
</script>