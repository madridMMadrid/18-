<template>
  <div>
    <div id="block-wrapper" class="wrapper-blocks" ref="sroll">
      <div class="wrapper_tab">
        <ul class="menu_header forMobileHome">
          <router-link to="/">
            <li>
              <i class="fa fa-home"></i>
            </li>
          </router-link>
          <router-link to="/" class="mr-0">
            <li>{{ $t('AllCategories') }}</li>
          </router-link>
          <div>
            <sort-buttons
              v-on:onChangeSortValue="updateSortValue"
              :buttons="menuSortOptions"
              :defaultValue="this.filterSort"
            />
          </div>
        </ul>
        <OurNetwork></OurNetwork>
      </div>
    </div>
    <h4 class="m-1 category-page__name">{{ $t('AllVideos') }}</h4>
    <div class="wrapper_pagination">
      <div class="filter">
        <div class="wrapper_setting">
          <label class="label" for="filter">
            <i class="fa fa-sort"></i>
            {{ $t('SortBy') }}:
          </label>
          <br />
          <sort-buttons
            v-on:onChangeSortValue="updateSortValue"
            :buttons="sortOptions"
            :defaultValue="this.filterSort"
            id="filter"
          />
        </div>
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
      <b-pagination
        v-model="page"
        align="center"
        :per-page="1"
        :total-rows="totalPages"
        v-on:change="this.changePage"
        v-if="totalPages"
        class="m-0 wrapper_setting"
      ></b-pagination>
    </div>
    <div class="category-page__posts-wrapper">
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
    <div style="padding-top:0.5rem">
      <b-pagination
        v-model="page"
        align="center"
        :per-page="1"
        :total-rows="totalPages"
        v-on:change="this.changePage"
        v-if="totalPages"
      ></b-pagination>
    </div>
    <div class="wrapper_search">
      <b-navbar-nav class="ml-auto" style="max-width: 550px; margin: auto;">
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
      </b-navbar-nav>
    </div>
  </div>
</template>
<script>
import VueSlider from "vue-slider-component";
import { BPagination, ListGroupPlugin } from "bootstrap-vue";
import Post from "./Post.vue";
import Loader from "./SkeletonLoader.vue";
import SortButtons from "./SortButtons.vue";
import Constants from "../constants/constants";
import CookieService from "../services/cookie.sevice";
import BlockService from "../services/block.service";
import InquirerService from "../services/inquirer.service";
import parseObjecToString from "../helpers/toStringFromObject";
import OurNetwork from "./OurNetwork";
import myDuration from "./ManagerComponents/Duration";
import mySource from "./ManagerComponents/Source";

import "vue-slider-component/theme/antd.css";
import Sceleton from "./SkeletonLoader";

import { mixinFromPosts } from "../mixins/mixinFromPosts";

export default {
  mixins: [mixinFromPosts],

  name: "VideoPage",
  components: {
    VueSlider,
    Post,
    Loader,
    SortButtons,
    BPagination,
    OurNetwork,
    myDuration,
    mySource
  },

  data() {
    return {
      search: "",
      isPending: false,
      posts: [],
      uuid: "",
      search: "",
      filterSource: this.$route.query.source_id || Constants.defaultSource,
      filterSort: this.$route.query.sort || Constants.defaultSort,
      sourceOptions: [],
      filterDuration: [
        this.$route.query.durationFrom || Constants.minDuration,
        this.getDurationToFromQuery()
      ],
      page: this.$route.query.page || 1,
      totalPages: 0,
      name: [],
      ttt: ''
    };
  },

  created() {
    this.cookieService = new CookieService();
    this.blockService = new BlockService();
    this.inquirerService = new InquirerService();
    this.checkSortMenu();
    this.title()
  },

  watch: {},

  mounted() {},

  computed: {
    sortOptions: function() {
      return [
        {
          title: this.$t("Recommended"),
          value: Constants.defaultSort
        },
        {
          title: this.$t("Rated"),
          value: "top_rated"
        },
        {
          title: this.$t("Date"),
          value: "last_added"
        },
        {
          title: this.$t("Popularity"),
          value: "most_viewed"
        }
      ];
    },
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
      document.title = 'Video'
      var elem = document.getElementById('metadescription');
      if (elem) {
        elem.parentNode.removeChild(elem);
      }
    },
    async checkSortMenu() {
      if (this.$route.query.q == "most_recommended") {
        await this.getContent();
        return;
      }
      this.updateSortValue(this.$route.query.q);
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
          data: { blocks, total_pages: totalPages }
        } = await this.blockService.get({
          matrix: this.matrix,
          browserwidth: this.browserWidth,
          browserheight: this.browserHeight,
          uuid: this.uuid,
          utm: this.utm,
          source_id: this.filterSource,
          durationFrom: this.filterDuration[0],
          durationTo: this.filterDuration[1],
          sort: this.filterSort,
          page: this.page
        });
        this.posts = blocks;
        this.totalPages = totalPages;
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
.wrapper_search {
  padding: 10px;
  & .input-group-append {
    & .btn {
      background: #e3b536;
    }
  }
}
.wrapper_filter {
  padding: 0 5px;
  border: 0.5px solid #888;
  border-left: 0;
  border-right: 0;
  display: flex;
  margin-right: auto;

  .forMobile {
    display: none;
    @media screen and (min-width: 991px) {
      display: inline-block;
    }
  }
  .fa-home {
    color: #fff;
  }
  .allCategories {
    color: #fff;
    margin-right: 0;
  }
  & > * {
    display: inline-block;
    margin: 0 10px;
  }
}

.videos-page__filter-wrapper {
  width: 100%;
}

.videos-page__post-wrapper {
  width: 100%;
}

@media only screen and (max-width: 900px) {
  .videos-page__filter-wrapper {
    flex-direction: column-reverse;
    & .videos-page__search {
      order: -1;
    }
  }

  .videos-page__right-side-filters {
    padding: 4px;
    max-width: 100% !important;
  }
}

.videos-page__search {
  height: 38px;
}

.videos-page__right-side-filters {
  width: 100%;
  max-width: 450px;
}

.pagination {
  & .page-item {
    &.active {
      & .page-link {
        color: #000;
        background: #e3b536;
        border-color: #ccc;
      }
    }
    &.disabled {
      & .page-link {
        color: #fff;
        background: #3e3e3e;
      }
    }
    & .page-link {
      color: #fff;
      background: #3e3e3e;
      border: 1px solid #ccc;
      &:focus {
        box-shadow: none;
      }
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
