<template>
  <div>
    <div>
      <div id="dynamic-component">
        <div class="wrapper_tab">
          <ul class="menu_header forMobileHome">
            <router-link to="/">
              <li>
                <i class="fa fa-home"></i>
              </li>
            </router-link>
            <a :href="`#click_category_menu`">
              <li>{{ $t('AllCategories') }}</li>
            </a>
            <router-link
              v-for="(item, i) in menuSortOptions"
              :key="i"
              :to="`/videos/?q=${item.value}`"
            >
              <li >{{item.title}}</li>
            </router-link>
          </ul>

          <OurNetwork></OurNetwork>
          <!-- <button
            v-for="tab in tabs"
            v-bind:key="tab"
            v-bind:class="['tab-button', { active: currentTab === tab }]"
            v-on:click="currentTab = tab"
          >{{ tab }}</button>-->
        </div>
        <component :is="currentTabComponent"></component>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

import CategoryService from "../services/category.service";
import Constants from "../constants/constants";
import Categories from "./HomePage";
import OurNetwork from "./OurNetwork";

export default {
  name: "Home",
  components: {
    Categories,
    OurNetwork
  },
  data() {
    return {
      currentTab: "Categories",
      tabs: ["Categories"],
      search: this.$route.query.search || Constants.defaultSearch,
      matrix: "",
      category_id: 0,
    };
  },
  async mounted() {},
  async created() {
    this.title()
  },

  watch: {},

  computed: {
    ...mapGetters(["LANG"]),
    currentTabComponent: function() {
      return this.currentTab;
    },
    menuSortOptions: function () {
      return [
        {
          title: this.$t('MostRecommended'),
          value: "most_recommended"
        },
        {
          title: this.$t('TopRated'),
          value: "top_rated"
        },
        {
          title: this.$t('LastAdded'),
          value: "last_added"
        },
        {
          title: this.$t('MostViewed'),
          value: "most_viewed"
        }
      ]
    }
  },

  methods: {
    title() {
      document.title = 'Interesting videos TOP 2019!'
      var elem = document.getElementById('metadescription');
      if (elem) {
        elem.parentNode.removeChild(elem);
      }
    },
    searchClick() {
      this.$router.push(`/search/?search=${this.search}`);
    }
  }
};
</script>

<style lang="scss">
.nav-pills {
  align-self: center;
  margin: 0 20px;
  .nav-link.dropdown-toggle.my_style {
    color: #fff;
  }
  .dropdown-item {
    text-align: left;
  }
  .show {
    .nav-link.dropdown-toggle.my_style {
      background: none;
    }
  }
  .nav-link {
    padding: 0;
  }
}
.card {
  border: none !important;
  border-radius: none !important;
}
.tab-button {
  &:active,
  &:focus {
    outline: none;
  }
  &:before {
    content: "";
    display: block;
    height: 0.5px;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    background: #888;
  }
  padding: 6px 10px;
  border: none;
  cursor: pointer;
  background: #222;
  color: #fff;
  margin-bottom: -1px;
  margin-right: -1px;
  position: relative;
  overflow: hidden;
}
.tab-button:hover {
  background: #707070;
}
.tab-button.active {
  position: relative;
  overflow: hidden;
  &:before {
    content: "";
    display: block;
    height: 2px;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    background: #e3b536;
  }
}
.tab {
  border: 1px solid #ccc;
  padding: 10px;
}

.wrapper_category {
  & ul,
  li {
    list-style: none;
    & a {
      color: #fff;
      font-size: 13px;
    }
  }
  column-count: 5;
  columns: 130px 10;
  &_link {
    display: inline-block;
    margin: 0 10px;
  }
  &_block {
    padding-left: 10px;
    & ul {
      padding: 0;
    }
  }
  &_title {
    color: #e3b536;
    font-weight: bold;
  }
}

.home-page__filter-wrapper {
  width: 100%;
}

.home-page__post-wrapper {
  width: 100%;
}

.home-page__search {
  height: 38px;
}

.home-page__right-side-filters {
  width: 100%;
  max-width: 450px;
}

.post__image {
  height: 134px;
}
.category-page__posts-wrapper {
  text-align: center;
  padding: 10px;
  min-height: calc(100vh - 225px);
}
</style>
