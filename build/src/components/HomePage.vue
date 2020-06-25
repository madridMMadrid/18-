<template>
  <div>
    <div>
      <h4 class="m-1 category-page__name">{{ $t('Categories') }}</h4>

      <div class="category-page__posts-wrapper">
        <div class="category-wrapper" v-for="(category, i) in topCategories" :key="i">
          <router-link
            tag="a"
            :to="{ path: `/category/${category.Slug}`, query: {categoryBlockID: `${category.BlockID}`}}"
            :title="category.Name"
            class="category-img_container"
            target="_blank"
          >
            <picture>
              <source
                height="360"
                width="200"
                class="category-img_thumb"
                type="image/webp"
                :srcset="category.Img"
                :title="category.Name"
              />
              <source
                height="360"
                width="200"
                class="category-img_thumb"
                type="image/png"
                :srcset="category.Img"
                :title="category.Name"
              />
              <img
                height="360"
                width="200"
                class="category-img_thumb"
                :src="category.Img"
                :title="category.Name"
              />
            </picture>
          </router-link>

          <div class="category-title">
            <router-link
              :to="{ path: `/category/${category.Slug}`, query: {categoryBlockID: `${category.BlockID}`}}"
              class="category-title_link"
              :title="category.Name"
              target="_blank"
            >{{ category.Name }}</router-link>
          </div>
        </div>
      </div>

      <div style="padding-top:0.5em; text-align: center;">
        <router-link to="/videos">
          <b-button variant="dark" :id="`click_category_menu`">{{ $t('AllVideos') }}</b-button>
        </router-link>
      </div>
      <hr />
      <div class="wrapper_category">
        <ul class="wrapper_category_block" v-for="(alfavit, i) in sortCategoties" :key="i">
          <li>
            <div class="wrapper_category_title">{{ i }}</div>
            <ul v-for="(name, y) in alfavit" :key="y">
              <li class="wrapper_category_description">
                <router-link :to="`/category/${name.Slug}`" target="_blank">{{ name.Name }}</router-link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import Constants from "../constants/constants";
import Post from "./Post";

export default {
  name: "HomePage",
  components: {
    Post
  },

  data() {
    return {
      currentTab: "HomePage",
      tabs: ["HomePage", "VideosPage"],
      search: this.$route.query.search || Constants.defaultSearch,
      classForCategry: true,
      ratio: (16/10)
    };
  },
  async created() {
    await this.myGetCategories();
  },

  watch: {},

  computed: {
    ...mapGetters(["topCategories", "sortCategoties"])
  },

  methods: {
    ...mapActions(["myGetCategories"]),
    getHeight(length, ratio) {
      let height = length / Math.sqrt(Math.pow(ratio, 2) + 1);
      return Math.round(height);
    },
    getWidth(length, ratio) {
      // var height = getHeight(300,ratio);
      // var width = getWidth(height,ratio);

      // console.log(height);
      // console.log(width);

      let width = length / Math.sqrt(1 / (Math.pow(ratio, 2) + 1));
      return Math.round(width);
    },
    searchClick() {
      if (this.search === "") {
        return;
      }
      this.$router.push(`/search/?search=${this.search}`);
    }
  }
};
</script>

<style lang="scss">
@import "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";
@mixin dv {
  display: inline-block;
  vertical-align: top;
}

@mixin viewportRatio($x, $y) {
  max-height: $x;
  min-height: ($x / $y) * 100;
}

.category {
  &-title {
    position: relative;
    padding: 5px;
    text-align: left;
    &_link {
      color: #fff;
      &:hover {
        color: #fff;
      }
    }
  }
  &-img {
    &_container {
      position: relative;
      display: block;
      overflow: hidden;
      @media screen and (max-width: 324px) {
        @include viewportRatio(316px, 225);
      }
      @media screen and (min-width: 325px) and (max-width: 580px) {
        @include viewportRatio(316px, 225);
      }
      & img {
        display: block;
        width: 100%;
        height: auto;
      }
    }
    &_thumb {
      right: 0;
    }
  }
  &-wrapper {
    margin: 4px;
    box-sizing: border-box;
    max-width: 360px;
    max-height: 360px;
    min-width: 144px;
    @media screen and (max-width: 324px) {
      @include dv;
      width: calc(100% - 10px);
      min-height: 125px;
    }
    @media screen and (min-width: 325px) and (max-width: 580px) {
      @include dv;
      width: calc(50% - 10px);
      min-height: 125px;
    }
    @media screen and (min-width: 581px) and (max-width: 960px) {
      @include dv;
      width: calc(33% - 10px);
    }
    @media screen and (min-width: 961px) and (max-width: 1900px) {
      @include dv;
      width: calc(20% - 10px);
    }
    @media screen and (min-width: 1901px) {
      @include dv;
      width: calc(10% - 10px);
    }
  }
}
.card {
  border: none !important;
  border-radius: none !important;
}
.wrapper_category {
  & ul,
  li {
    list-style: none;
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
}
</style>
