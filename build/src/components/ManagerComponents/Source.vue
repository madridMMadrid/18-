<template>
    <b-navbar-nav class="source">
      <b-nav-item-dropdown left>
        <template v-slot:button-content>
          <em>{{ $t('Source') }}</em>
        </template>
        <b-dropdown-item-button>
          <b-form-group>
            <b-form-radio-group
              id="btn-radios-3"
              v-model="changeFilterSourceEmit"
              :options="sourceOptions"
              stacked
              name="radio-btn-stacked"
              style="font-size: .875rem; padding: 10px"
            />
          </b-form-group>
        </b-dropdown-item-button>
      </b-nav-item-dropdown>
    </b-navbar-nav>
</template>
<script>
export default {
  name: "Source",
  props: ["filterSource", "sourceOptions"],
  components: {},
  data() {
    return {
      changeFilterSourceEmit: this.filterSource,
      sourceOptionsContent: this.sourceOptions
    };
  },
  created() {},
  computed: {},
  watch: {
    changeFilterSourceEmit(value) {
      this.$emit("changeSourceOptions", value);
    }
  },
  methods: {}
};
</script>
<style lang="scss">
  .sort-buttons {
    &.btn-group {
      display: block;
    }
  }
  
  .navbar-nav.source  {
    & .nav-item {
      & .dropdown-menu {
        padding: 0;
        & .form-group {
          margin: 0;
          & .custom-radio .custom-control-input:checked ~ .custom-control-label::after  {
            background-image: none;
          }
          & .custom-control-input:checked~.custom-control-label::before {
            background: #e3b536;
            border-color: #e3b536;
          }
        }
      }
    }
  }
</style>