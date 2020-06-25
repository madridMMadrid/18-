<template>
  <b-navbar-nav id="sort">
    <b-nav-item-dropdown right>
      <template v-slot:button-content>
        <em>{{ $t('Duration') }}</em>
      </template>
      <b-dropdown-item href="#">
        <b-dropdown-text style="width:340px; height:40px">
          <vue-slider
            v-model="changeFilterDurationEmit"
            :adsorb="true"
            :data="durationData"
            :marks="true"
            :included="true"
          />
        </b-dropdown-text>
      </b-dropdown-item>
    </b-nav-item-dropdown>
  </b-navbar-nav>
</template>
<script>
import { mapGetters } from "vuex";
import VueSlider from "vue-slider-component";

export default {
  name: "Duration",
  props: ["filterDuration"],
  components: {
    VueSlider
  },
  data() {
    return {
      changeFilterDurationEmit: this.filterDuration
    };
  },
  created() {},
  computed: {
    ...mapGetters(["durationData"])
  },
  watch: {
    changeFilterDurationEmit(value) {
      this.$emit("changeFilterDuration", value);
    }
  },
  methods: {}
};
</script>