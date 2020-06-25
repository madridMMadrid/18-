<template>
  <div>
    <b-navbar toggleable="lg" class="header" ref="scrollTop">
      <nav role="navigation" class="navigation">
        <div id="menuToggle">
          <input type="checkbox" id="checkbox" @click="check()" v-model="CHECKED" />
          <span></span>
          <span></span>
          <span></span>
          <ul id="menu" @click="check()">
            <router-link to="/">
              <li>
                <i class="fa fa-home"></i>
              </li>
            </router-link>
            <a :href="`#click_category_menu`" v-if="home">
              <li>{{ $t('AllCategories') }}</li>
            </a>
            <router-link :to="'/'" v-else>
              <li>{{ $t('AllCategories') }}</li>
            </router-link>
            <router-link
              v-for="(item, i) in menuSortOptions"
              :key="i"
              :to="`/videos/?q=${item.value}`"
            >
              <li>{{item.title}}</li>
            </router-link>
            <hr style="background: #fff;" />
            <a target="_blank" :href="item.link" v-for="(item, i) in LINKS" :key="item + i">
              <li>{{ item.value }}</li>
            </a>
          </ul>
          <div @click="check()" class="underBlock"></div>
        </div>
      </nav>
      <router-link :to="{ path: '/'}">
        <b-button>
          <img class="img_logo" src="~@/assets/hmw.svg" alt />
        </b-button>
      </router-link>
      <b-navbar-nav class="ml-auto wrapper_search_lang" style="max-width: 1550px; width: 550px;">
        <b-input-group class="w-100">
          <b-form-input
            @blur="searchClick"
            v-on:keyup.enter="searchClick"
            v-model="search"
            :placeholder="$t('SearchVideos')"
          ></b-form-input>
          <b-input-group-append>
            <b-button v-on:click="searchClick" variant="outline-dark">
              <i class="fa fa-search"></i>
            </b-button>
          </b-input-group-append>
        </b-input-group>
        <Lang></Lang>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>
    
<script>
import Lang from "./Lang";
import { mapGetters } from "vuex";

export default {
  name: "Header",

  data() {
    return {
      search: "",
      home: false,
      computedScroll: 0
    };
  },

  components: {
    Lang
  },

  created() {
    this.isHome();
  },

  watch: {
    $route(to, from) {
      this.isHome();
    }
  },

  mounted() {},

  computed: {
    ...mapGetters(["CHECKED", "LINKS", "LANG"]),
    menuSortOptions: function() {
      return [
        {
          title: this.$t("MostRecommended"),
          value: "most_recommended"
        },
        {
          title: this.$t("TopRated"),
          value: "top_rated"
        },
        {
          title: this.$t("LastAdded"),
          value: "last_added"
        },
        {
          title: this.$t("MostViewed"),
          value: "most_viewed"
        }
      ];
    }
  },

  methods: {
    isHome() {
      if (this.$route.path == "/") {
        this.home = true;
        return;
      }
      this.home = false;
    },
    check() {
      let item = !this.CHECKED;
      this.$store.dispatch("SAVE_CHECKED", item);
    },
    searchClick() {
      if (this.search === "") {
        return;
      }
      this.$router.push(`/search/?search=${this.search}`);
    },
    scrollTo() {
      window.scrollTo(0, 0);
    }
  }
};
</script>

<style lang="scss">
.navigation {
  display: none;
  @media screen and (max-width: 991px) {
    display: block;
  }
}
.wrapper_search_lang {
  display: flex;
  flex-direction: row !important;
}
</style>