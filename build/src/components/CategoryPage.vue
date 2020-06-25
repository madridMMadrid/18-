<template>
  <div>
    <div>
      <div class="wrapper_tab" ref="scrollTop">
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

    <div class="category-page__posts-wrapper">
      <h4 class="category-page__name m-1">
        {{ $t('Сategory') }}: {{ this.categoryName }}
        ({{ this.totalTube }})
      </h4>
      <div class="wrapper_pagination">
        <div class="filter">
          <div>
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
      <template v-if="!isPending">
        <Post
          :key="i"
          :filterSource="filterSource"
          v-for="(post, i) in posts"
          :post="post"
          @soursePost="getSourse"
        />
      </template>
      <div class="wrapper_banners" :class="{ hiddenBlockADV: !ADVNATIVE }">
        <div :id="'myList' + i" :key="i + 'lineByBrowser'" v-for="i in this.lineByBrowser"></div>
      </div>
    </div>
    <div class>{{ this.advertising }}</div>

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
import { mapGetters } from "vuex";

import axios from "axios";

import VueSlider from "vue-slider-component";
import Post from "./Post.vue";
import Loader from "./SkeletonLoader.vue";
import SortButtons from "./SortButtons.vue";
import CookieService from "../services/cookie.sevice";
import BlockService from "../services/block.service";
import InquirerService from "../services/inquirer.service";
import Constants from "../constants/constants";
import CategoryService from "../services/category.service";
import OurNetwork from "./OurNetwork";
import postscribe from "postscribe";
import myDuration from "./ManagerComponents/Duration";
import mySource from "./ManagerComponents/Source";

import { mixinFromPosts } from "../mixins/mixinFromPosts";

import "vue-slider-component/theme/antd.css";

export default {
  mixins: [mixinFromPosts],
  name: "CategoryPage",
  components: {
    VueSlider,
    Post,
    Loader,
    SortButtons,
    OurNetwork,
    postscribe,
    myDuration,
    mySource
  },

  data() {
    return {
      windowWidth: 0,
      windowHeight: 0,
      search: "",
      isPending: false,
      posts: [],
      uuid: "",
      category: null,
      categoryName: null,
      categoryBlockID: 0,
      categories: [],
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
      advertising: null,
      name: [],
      countTube: 0,
      countBanners: 6
    };
  },

  async created() {
    this.cookieService = new CookieService();
    this.blockService = new BlockService();
    this.inquirerService = new InquirerService();
    this.categoryService = new CategoryService();
    this.searchID()
    await this.getContent();
    this.count_char(this.matrix);
    this.runScript();
    this.title();
  },

  watch: {},

  mounted() {
    this.$nextTick(function() {
      window.addEventListener("resize", this.getWindowWidth);
      window.addEventListener("resize", this.getWindowHeight);

      this.getWindowWidth();
      this.getWindowHeight();
    });
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.getWindowWidth);
    window.removeEventListener("resize", this.getWindowHeight);
  },

  computed: {
    ...mapGetters(["ADVNATIVE"]),
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
      document.title = this.categoryName;
      var meta = document.createElement("meta");
      meta.id = "metadescription"
      meta.name = "description";
      meta.content = `free porn for сategory ${this.categoryName}`;
      document.getElementsByTagName("head")[0].appendChild(meta);
    },
    runScript() {
      let source = localStorage.getItem("source");
      if (!source) {
        source = this.$route.query.source;
      }
      for (let i = 1; i <= this.lineByBrowser; i++) {
        postscribe(
          "#myList" + i,
          `<script>
          (function(n,a,t,i,v,e,p,u,b){b=function(a,b){return(Object.assign||(function(c,d){Object.keys(d).forEach(function(k){c[k]=d[k]});return c}))(a,b)},e=['__',btoa('_n'+n.location.host).replace(/=/ig,'')].join(''),p=['__',btoa('_ni'+n.location.host).replace(/=/ig,'')].join(''),v=btoa([Math.random().toString(32)].join('')).replace(/=/ig,''),document.write(b(document.createElement('div'),{id:v}).outerHTML),v='#'+v,u=function(){n[p](b(t,{div:(i=document.createElement('div')),styleCSSSelector:v,onSuccess:function(log){(i=document.querySelector(v))&& log && log.box && i.appendChild(log.box)},}))};if(n[e]){(n[e].s && u())||n[e].st.push(u)}else{n[e]={s:0,st:[u]};document.body.appendChild(b(document.createElement('script'),{async:1,src:a,onload:function(){(n[e].s=1)&& n[e].st.forEach(function(f){f()})}}))}}) 
          (window, 
          "https:\\/\\/cst.wpu.sh\\/static\\/native-core.js", 
          {"site_id":106,"sub_id":${source},"spot_id":107,"size":1,"style":".__nat_box {\\n    width: 100%;\\n    display: inline-flex\\n}\\n.__nat_item {\\n    max-width: 200px;\\n    width: 100%;\\n    height: 200px;\\n    box-sizing: border-box;\\n    position: relative;\\n    margin: 2px;\\n    \\n    \\n    font-family: Arial, Helvetica, Verdana, sans-serif;\\n    overflow: hidden;\\n}\\na.__nat_link {\\n    cursor: pointer;\\n    display: block;\\n    height: 100%;\\n    width: 100%;\\n    font: inherit;\\n    position: relative;\\n}\\n.__nat_img {\\n    width: 100%;\\n    position: absolute;\\n    height: 100%;\\n    top: 0;\\n    background-repeat: no-repeat;\\n    background-position: center;\\n    background-size: cover;\\n    z-index: 1;\\n}\\n.__nat_title {\\n    position: absolute;\\n    bottom: 0;\\n    z-index: 1;\\n    line-height: 28px;\\n    width: 100%;\\n    font-size: 14px;\\n    color: #EEEEEE;\\n    font-weight: 400;\\n    text-decoration: unset;\\n    overflow: hidden;\\n    text-align: left;\\n    background: rgba(2, 2, 2, .7);\\n    padding: 0 8px;\\n    box-sizing: border-box;\\n    text-overflow: ellipsis;\\n    white-space: nowrap;\\n}\\na.__nat_link:hover .__nat_title {\\n    color: #FFFFFF;\\n    font-weight: 400;\\n    text-decoration: unset;\\n}\\n.__nat_ad {\\n    position: absolute;\\n    z-index: 3;\\n    color: #fff;\\n    right: 5px;\\n    line-height: 28px;\\n    text-shadow: 1px 1px 1px #000;\\n    top: 0;\\n}\\n"})
            <\/script>`
        );
      }
    },
    async getContent() {
      await this.getCategories();
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
          category_id: this.category.ID,
          sort: this.filterSort,
          page: this.page,
          cat_block_id: this.filterSort == 'most_recommended' ? this.categoryBlockID : '',
        });
        this.posts = blocks;
        this.totalPages = totalPages;
      } catch (error) {
        console.error(error);
      }
    },
    prepareLink(post) {
      var source = localStorage.getItem("source");
      var subid = localStorage.getItem("subid");
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
        category_id: this.category.ID,
        source: source,
        subid: subid
      });
    },
    searchID() {
      let search = new URLSearchParams(window.location.search);
      for (var pair of search.entries()) {
        if (pair[0] == "categoryBlockID") {
          this.categoryBlockID = pair[1]
        } 
      }
    }
  }
};
</script>

<style lang="scss">
@import "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";
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
  .allCategories {
    color: #fff;
    margin-right: 0;
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

.category {
  &-page {
    &__name {
      text-align: left;
    }
    &__filter {
      &-wrapper {
        width: 100%;
      }
    }
    &__post {
      &-wrapper {
        width: 100%;
      }
    }
  }
}
.wrapper_banners {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  & > div {
    margin: 5px;
    width: calc(20% - 10px);
    @media screen and (max-width: 580px) {
      width: calc(50% - 10px);
    }
    @media screen and (min-width: 581px) and (max-width: 960px) {
      width: calc(33% - 10px);
    }
    @media screen and (min-width: 1901px) {
      width: calc(10% - 10px);
    }
    & .__nat_item {
      margin: auto !important;
      max-width: none !important;
    }
  }
}
.hiddenBlockADV {
  display: none;
}
</style>
