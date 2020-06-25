<template>
  <ContentLoader
    :height="computedHeight"
    :width="isNeedAllWidth"
    :speed="2"
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
    class="loading m-1"
  >
    <rect x="0.83" y="1.67" rx="0" ry="0" width="100%" height="140" />
    <rect x="1.83" y="155.38" rx="0" ry="0" width="100%" height="13.26"/>
    <rect x="1.83" y="174.67" rx="0" ry="0" width="100%" height="10" />
  </ContentLoader>
</template>

<script>
import { ContentLoader } from 'vue-content-loader';

export default {
  name: 'SkeletoLoader',

  props: {
    width: {
      type: [Number, String],
      default: 280,
    },

    height: {
      type: [Number, String],
      default: 195,
    },
  },

  created() {
    document.documentElement.style
      .setProperty('--loading-width', `${this.width}px`);
    document.documentElement.style
      .setProperty('--loading-height', `${this.height}px`);
  },

  computed: {
    isNeedAllWidth() {
      return this.browserWidth <= 400 ? this.browserWidth : this.computedWidth;
    },

    computedWidth() {
      const width = this.rootComputedStyle
        .getPropertyValue('--loading-width');
      return Number(width.substring(0, width.length - 2));
    },

    computedHeight() {
      const height = this.rootComputedStyle
        .getPropertyValue('--loading-height');
      return Number(height.substring(0, height.length - 2));
    },

    browserWidth() {
      return (window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth) - 22;
    },

    rootComputedStyle() {
      return getComputedStyle(document.body);
    },
  },

  components: {
    ContentLoader,
  },
};
</script>


<style lang="scss" scooped>
  :root {
    --loading-width: 180px;
    --loading-height: 195px;
  }

  .loading {
    width: 100%;
    max-width: var(--loading-width);
    height: var(--loading-height);
  }

  @media only screen and (max-width : 400px) {
    .loading {
      max-width: 100% !important;
    }
  }
</style>
