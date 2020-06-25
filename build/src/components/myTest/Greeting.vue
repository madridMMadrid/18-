<template>
  <div>
    <span v-if="isAdmin">Привилегии администратора</span>
    <span v-else>Не авторизован</span>
    <button>
      {{ msg }}
    </button>
    {{ greeting }}
  </div>
</template>

<script>
export default {
  name: "Greeting",
  props: ['bar'],
  data() {
    return {
      greeting: "Vue и TDD"
    }
  }
}
</script>