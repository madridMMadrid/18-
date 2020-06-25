<template>
  <b-button-group
    class="sort-buttons"
    :size="size"
    v-if="buttons"
  >
    <b-button
      v-for="button in buttons"
      :key="button.title"
      :variant="isCurrentValue(button.value) ? states.active : states.inactive"
      @click="currentValue = button.value"
    >
      {{ button.title }}
    </b-button>
  </b-button-group>
</template>

<script>
export default {
  name: 'SortButons',

  props: {
    defaultValue: String,

    size: {
      type: String,
    },

    buttons: {
      type: Array,
      default: () => ([]),
    },

    states: {
      type: Object,
      default: () => ({
        active: 'outline-primary active',
        inactive: 'outline-dark',
      }),
    },
  },

  watch: {
    defaultValue() {
      this.currentValue = this.defaultValue;
    },

    currentValue() {
      this.emitValue();
    },
  },

  data() {
    return {
      currentValue: this.defaultValue ? this.defaultValue : this.buttons[0].value,
    };
  },

  methods: {
    emitValue() {
      this.$emit('onChangeSortValue', this.currentValue);
    },

    isCurrentValue(value) {
      return this.currentValue === value;
    },
  },
};
</script>

<style lang="scss" scooped>

</style>
