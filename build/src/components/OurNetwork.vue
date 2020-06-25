<template>
    <b-nav pills class="forMobileHome">
      <b-nav-item-dropdown id="my-nav-dropdown" :text="$t('OurNetwork')" toggle-class="my_style" right>
        <b-dropdown-item
          v-for="(item, i) in LINKS"
          target="_blank"
          :href="item.link"
          :key="i"
        >{{item.value}}</b-dropdown-item>
      </b-nav-item-dropdown>
    </b-nav>
</template>
<script>
import { mapGetters } from "vuex";

export default {
 
  computed: {
    ...mapGetters(["LINKS", "LANG"]),
  },
  created() {},
  methods: {},
  watch: {}
};
</script>
<style lang="scss">
  .wrapper_nav {
    display: flex;
  }
</style>