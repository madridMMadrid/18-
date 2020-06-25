<template>
  <div class="post-wrapper">
    <a :href="post.link" target="_blank" :title="post.title" class="post-img_container">
      <picture>
        <source
          class="post-img_thumb"
          type="image/webp"
          height="360"
          width="200"
          :srcset="post.previewImgLink"
          :alt="post.title"
          :title="post.title"
        />
        <source
          class="post-img_thumb"
          type="image/png"
          height="360"
          width="200"
          :srcset="post.previewImgLink"
          :alt="post.title"
          :title="post.title"
        />
        <img
          id="img"
          height="360"
          width="200"
          class="post-img_thumb"
          :src="post.previewImgLink"
          :alt="post.title"
          :title="post.title"
        />
      </picture>
      <span class="post-img_duration">{{ post.duration }}</span>
    </a>
    <div class="post-title">
      <a :href="post.link" class="post-title_link" :title="post.title">{{ post.title }}</a>
    </div>
    <span class="post-name" @click="sourseId">{{ post.name }}</span>
  </div>
</template>
<script>
import InquirerService from "../services/inquirer.service"; 

export default {
  name: "Post",

  props: {
    post: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      fullLoad: false
    };
  },
  watch: {
    post() {
      this.getSources();
    }
  },
  async created() {
    this.inquirerService = new InquirerService();
    await this.getContent();
  },
  methods: {
    sourseId() {
      this.$emit("soursePost", this.post.source_id);
    },
    async getContent() {
      await this.getSources();
    },
    async getSources() {
      this.isPending = false;
    }
  },
  mounted() {}
};
</script>

<style lang="scss">
@mixin dv {
  display: inline-block;
  vertical-align: top;
}
.post {
  &-title {
    position: relative;
    padding: 5px;
    text-align: left;
    line-height: 1;
    &_link {
      display: block;
      color: #fff;
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      &:hover {
        color: #fff;
      }
    }
  }
  &-name {
    color: #e3b536;
    display: block;
    text-align: left;
    padding: 5px;
    line-height: 1;
    &:hover {
      cursor: pointer;
    }
  }
  &-img {
    &_container {
      position: relative;
      display: block;
      overflow: hidden;
      @media screen and (max-width: 324px) {
        min-height: 125px;
      }
      @media screen and (min-width: 325px) and (max-width: 580px) {
        min-height: 125px;
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
    &_duration {
      position: absolute;
      left: 2px;
      top: 2px;
      background: #000;
      padding: 0px 5px;
      font-size: 12px;
      color: #e3b536;
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
</style>

<style lang="scss">
.post__link {
  &:link {
    text-decoration: none;
    color: black;
  }

  &:visited {
    text-decoration: none;
    color: black;
  }

  &:hover {
    text-decoration: none;
    color: black;
  }

  &:active {
    text-decoration: none;
    color: black;
  }
}
</style>
