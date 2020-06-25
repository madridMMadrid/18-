<template>
  <div>
    <b-navbar toggleable="lg" class="header">
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
            <router-link to="/" v-else>
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
      <router-link to="/">
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

    <div>
      <div class="wrapper_tab">
        <ul class="menu_header forMobileHome">
          <router-link to="/">
            <li>
              <i class="fa fa-home"></i>
            </li>
          </router-link>
          <router-link to="/">
            <li>{{ $t('AllCategories') }}</li>
          </router-link>
          <router-link
            v-for="(item, i) in menuSortOptions"
            :key="i"
            :to="`/videos/?q=${item.value}`"
          >
            <li>{{item.title}}</li>
          </router-link>
        </ul>
        <OurNetwork></OurNetwork>
      </div>
    </div>

    <div class="search" v-if="this.searchResult">{{ $t('ResultSearch') }}: {{ this.search }}</div>
    <div class="search" v-else>{{ $t('NotFoundSearch') }}: {{ this.search }}</div>

    <div class="wrapper_pagination">
      <div class="filter">
        <div class="wrapper_setting">
          <label class="label" for="sort">
            <i class="fa fa-filter"></i>
            {{ $t('FilterBy') }}:
          </label>
          <br />
          <myDuration
            :filterDuration="filterDuration"
            @changeFilterDuration="toggleDuration($event)"
          ></myDuration>
          <mySource
            :filterSource="filterSource"
            :sourceOptions="sourceOptions"
            @changeSourceOptions="toggleSource($event)"
          ></mySource>
        </div>
      </div>
    </div>

    <div class="search-page__posts-wrapper">
      <template v-if="!isPending">
        <Post
          :key="i"
          :filterSource="filterSource"
          :post="post"
          v-for="(post, i) in posts"
          @soursePost="getSourse"
        />
      </template>
    </div>
  </div>
</template>
<script>
import Lang from "./Lang";
import { mapGetters } from "vuex";

import * as moment from "moment";
import VueSlider from "vue-slider-component";
import Post from "./Post.vue";
import Loader from "./SkeletonLoader.vue";
import parseObjecToString from "../helpers/toStringFromObject";
import SortButtons from "./SortButtons.vue";
import CookieService from "../services/cookie.sevice";
import BlockService from "../services/block.service";
import InquirerService from "../services/inquirer.service";
import OurNetwork from "./OurNetwork";
import Constants from "../constants/constants";
import myDuration from "./ManagerComponents/Duration";
import mySource from "./ManagerComponents/Source";

import "vue-slider-component/theme/antd.css";
import { mixinFromPosts } from "../mixins/mixinFromPosts";

export default {
  mixins: [mixinFromPosts],
  name: "SearchPage",

  components: {
    VueSlider,
    Post,
    Loader,
    OurNetwork,
    SortButtons,
    Lang,
    myDuration,
    mySource
  },

  data() {
    const search = this.$route.query.search || "";
    return {
      searchResult: true,
      isPending: false,
      posts: [],
      uuid: "",
      filterSource: this.$route.query.source_id || Constants.defaultSource,
      filterSort: this.$route.query.sort || Constants.defaultSort,
      filterDuration: [
        this.$route.query.durationFrom || Constants.minDuration,
        this.getDurationToFromQuery()
      ],
      sourceOptions: [],
      search,
      filterSearch: search,
      home: false,
      name: []
    };
  },

  async created() {
    this.cookieService = new CookieService();
    this.blockService = new BlockService();
    this.inquirerService = new InquirerService();
    await this.getContent();
    this.scrollTo();
    this.title()
  },

  watch: {
    async filterSearch() {
      await this.setFilters(this.filterSearch);
    },
    $route(to, from) {
      if (this.$route.path == "/") {
        this.home = true;
        return;
      }
      this.home = false;
    },
    async posts(value) {
      value.length ? (this.searchResult = true) : (this.searchResult = false);
    }
  },

  computed: {
    ...mapGetters(["CHECKED", "LINKS", "loading"]),
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
    title() {
      document.title = `${this.$t("Films")}: ${this.search}`
      var elem = document.getElementById('metadescription');
      if (elem) {
        elem.parentNode.removeChild(elem);
      }

    },
    async setFilters(way) {
      const filters = {
        source_id: this.filterSource,
        durationFrom: this.filterDuration[0],
        durationTo: this.filterDuration[1],
        search: way || this.search
      };

      this.$router.push({
        path: parseObjecToString(filters)
      });

      await this.getContent();
    },

    check() {
      let item = !this.CHECKED;
      this.$store.dispatch("SAVE_CHECKED", item);
    },
    searchClick() {
      if (this.search === this.filterSearch) {
        return;
      }
      this.filterSearch = this.search;
    },

    async getContent() {
      await this.getSources();
      await this.getUUID();
      await this.downLoadBlocks();
      await this.prepareBlocks();
    },

    async downLoadBlocks() {
      try {
        const {
          data: { blocks }
        } = await this.blockService
          .get({
            matrix: this.matrix,
            browserwidth: this.browserWidth,
            browserheight: this.browserHeight,
            uuid: this.uuid,
            search: this.filterSearch,
            utm: this.utm,
            source_id: this.filterSource,
            durationFrom: this.filterDuration[0],
            durationTo: this.filterDuration[1]
          })
          .then();
        this.posts = blocks;
      } catch (error) {
        console.error(error);
      }
    },

    prepareLink(post) {
      var source = localStorage.getItem("source");
      return this.blockService.makeLink({
        block_id: post.blockId,
        block_matrix: this.matrix,
        matrix_hash: post.matrixHash,
        point_x: post.slotX,
        point_y: post.slotY,
        preview_image_id: 1,
        url: post.link,
        uuid: this.uuid,
        browserwidth: this.browserWidth,
        browserheight: this.browserHeight,
        utm: this.utm,
        source: source
      });
    }
  }
};
</script>


<style lang="scss">
@import "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";
.allCategories {
  color: #fff;
  margin-right: 0;
}
.wrapper_filter {
  padding: 0 5px;
  border: 0.5px solid #888;
  border-left: 0;
  border-right: 0;
  .forMobile {
    display: none;
    @media screen and (min-width: 991px) {
      display: inline-block;
    }
  }
  .fa-home {
    color: #fff;
  }
  & > * {
    display: inline-block;
    margin: 0 10px;
  }
}
.wrapper_setting {
  & > ul {
    display: inline-block;
    margin: 0 10px;
  }
  & .navbar-nav {
    & .nav-link {
      padding: 5px 0;
    }
  }
}

.search {
  &-page {
    &__filter {
      &-wrapper {
        width: 100%;
        @media only screen and (max-width: 900px) {
          flex-direction: column-reverse;
          & .search-page__search {
            order: -1;
          }
        }
      }
    }
    &__posts {
      &-wrapper {
        min-height: 100vh;
        width: 100%;
      }
    }
    &__left-side-filters {
      width: 100%;
      max-width: 450px;
    }
    &__right-side-filters {
      width: 100%;
      max-width: 450px;
    }
  }
  &__search {
    height: 38px;
  }
}
.navigation {
  display: none;
  @media screen and (max-width: 991px) {
    display: block;
  }
}

.underBlock {
  display: block;
  z-index: -1;
  height: 100vh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.68);
  position: fixed;
  top: 0;
  left: 0;
  transform: translate(-100%, 0);
}

#menuToggle input:checked ~ ul,
#menuToggle input:checked ~ .underBlock {
  transform: none;
}
.search {
  color: #e3b536;
  padding: 10px;
  font-weight: bold;
  font-size: 25px;
}
</style>
