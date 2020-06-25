<template>
  <div>
    <button id="show-modal" @click="showModal = true">Show Modal</button>
    <modal v-if="showModal" @close="showModal = false">
      <h3 slot="header">Крайне рекомедуем!!!</h3>
    </modal>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import modal from "./modal/modal"

export default {
  name: "test",
  data() {
    return {
      showModal: false
    };
  },
  components: {
    modal
  },
  computed: {},
  methods: {}
};
</script>
<style lang="scss">

</style>
