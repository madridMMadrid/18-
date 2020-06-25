<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <input v-model="username" data-username />
      <input type="submit" />
    </form>

    <div class="message" v-if="submitted">Спасибо за ваше сообщение, {{ username }}.</div>
  </div>
</template>
<script>
export default {
  name: "FormSubmitter",

  data() {
    return {
      username: "",
      submitted: false
    };
  },
  created() {
      this.doSomething()
  },

  methods: {
    handleSubmit() {
      this.submitted = true;
    },
    doSomething() {
        console.log('doSomething')
    }
  }
};
</script>