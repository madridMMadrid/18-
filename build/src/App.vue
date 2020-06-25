<template>
  <div>
    <div class="easterEgg" v-if="EggCheck"></div>
    <div
      id="box"
      class="nav-up nav-down"
      ref="box"
      v-scroll="handleScroll"
      :class="{ blockedScroll: CHECKED }"
      @click="appClick()"
    >
      <Webpush :advPopunder="ADVPOPUNDER" :advPush="ADVPUSH" />
      <Header
        class="heightHeader up"
        id="heightHeader"
        :class="{ fixedBlock: isActive}"
        ref="infoBox"
        v-if="this.$route.path != '/search/'"
      />
      <router-view />
      <go-top
        :max-width="100"
        bg-color="rgba(0, 0, 0, 0.7)"
        :radius="10"
        :size="50"
        :has-outline="false"
      ></go-top>
      <Footer />
    </div>
    <modal v-if="showModal" @close="showModal = false">
      <h3 slot="header">{{ $t('Warning') }}</h3>
      <h5 slot="body">{{ $t('WarningText') }}</h5>
    </modal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import * as moment from "moment";

import GoTop from "@inotom/vue-go-top";
import Footer from "./components/footer";
import Header from "./components/header";
import Webpush from "./components/WebPush/subscribe";
import modal from "./components/modal/modal";

export default {
  name: "app",
  props: {
    msg: String
  },
  data() {
    return {
      isVisible: false,
      search: "",
      matrix: "",
      scrollTopFixed: 0,
      infoBoxHeight: 0,
      infoBoxWidth: 0,
      isActive: false,
      referrer_url: null,
      showModal: false,
      count: 0,
      EggCheck: false,
      time: 2000
    };
  },
  components: {
    Footer,
    GoTop,
    Header,
    Webpush,
    modal
  },
  async created() {
    this.browser();
    await this.getContent();
    await this.searchSource();
    this.getLocal();
  },
  computed: {
    ...mapGetters(["CHECKED", "SOURCE", "ADVNATIVE", "ADVPUSH", "ADVPOPUNDER"]),
    lineByBrowser() {
      let w = this.browserWidth;
      if (w <= 324) {
        return 1;
      } else if (w >= 325 && w <= 580) {
        return 2;
      } else if (w >= 581 && w <= 960) {
        return 3;
      } else if (w >= 961 && w <= 1900) {
        return 5;
      } else if (w > 1901) {
        return 10;
      }
    },

    browserWidth() {
      return (
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth
      );
    },
    getMatrix() {
      switch (this.lineByBrowser) {
        case 1:
          return {
            line: 1,
            levels: 12
          };
        case 2:
          return {
            line: 2,
            levels: 12
          };
        case 3:
          return {
            line: 3,
            levels: 6
          };
        case 5:
          return {
            line: 5,
            levels: 6
          };
        default:
          return {
            line: 10,
            levels: 8
          };
      }
    }
  },

  methods: {
    appClick() {
      document.onclick = e => {
        let value = Object.values(e.target.classList);
        if (value.indexOf("navbar") != -1) {
          this.count += 1;
        }
      };
    },
    timeOut() {
      setTimeout(() => {
        this.count = 0;
      }, this.time);
    },
    timeOutEgg() {
      this.EggCheck = true
      setTimeout(() => {
        this.EggCheck = false
      }, this.time);
    },
    handleScroll: function(evt, el) {
      let st = window.scrollY;
      if (
        window.scrollY > this.infoBoxHeight &&
        this.infoBoxWidth < 991 &&
        this.$route.path != "/search/"
      ) {
        this.isActive = true;
        el.setAttribute("style", `padding-top: ${this.infoBoxHeight}px`);
        if (st > this.scrollTopFixed) {
          document.getElementById("heightHeader").classList.remove("up");
          document.getElementById("heightHeader").classList.add("down");
        } else {
          document.getElementById("heightHeader").classList.add("up");
          document.getElementById("heightHeader").classList.remove("down");
        }
      } else {
        this.isActive = false;
        el.setAttribute("style", "padding-top: 0px;");
      }
      this.scrollTopFixed = st;
    },

    matchHeight() {
      if (document.getElementsByClassName("heightHeader")[0] !== undefined) {
        this.infoBoxHeight =
          document.getElementsByClassName("heightHeader")[0].clientHeight + 15;
      }
    },
    matchWidth() {
      if (document.getElementsByClassName("heightHeader")[0] !== undefined) {
        this.infoBoxWidth = document.getElementsByClassName(
          "heightHeader"
        )[0].clientWidth;
      }
    },
    loadingCount() {
      return this.getMatrix.line * this.getMatrix.levels;
    },
    searchSource() {
      this.referrer_url = document.referrer;
      if (localStorage.getItem("source") == null) localStorage.setItem("source", "")
      if (localStorage.getItem("subid") == null) localStorage.setItem("subid", "")
      let search = new URLSearchParams(window.location.search);
      for (var pair of search.entries()) {
        if (pair[0] == "source") {
          localStorage.setItem("source", JSON.stringify(+pair[1]));
        } else if (pair[0] == "subid") { 
          localStorage.setItem("subid", JSON.stringify(+pair[1]));
        } else if (pair[0] == "adv") {
          let current_time_local = localStorage.getItem("Time");
          if (current_time_local === null) {
            localStorage.setItem("Time", +new Date() + 3600 * 1000);
            localStorage.setItem("ADV", pair[1]);
            this.$store.dispatch("SAVE_ADVMATRIX", pair[1]);
          } else if (+current_time_local < +new Date()) {
            localStorage.removeItem("Time");
            localStorage.removeItem("ADV");
            this.$store.dispatch("SAVE_ADVMATRIX", 0);
          }
        }
      }
    },
    getLocal() {
      let block = localStorage.getItem("ADV");
      if (block !== null) {
        let p = block.split("");
        if (p[0] == 1) this.$store.dispatch("SAVE_ADVNATIVE", true);
        if (p[1] == 1) this.$store.dispatch("SAVE_ADVPUSH", true);
        if (p[2] == 1) this.$store.dispatch("SAVE_ADVPOPUNDER", true);
      }
    },

    browser() {
      switch (this.$browserDetect.meta.name) {
        case "Chrome":
          break;
        case "Firefox":
          break;
        case "Edge":
          this.showModal = true;
          console.log("edge");
          break;
        case "Safari":
          break;
        case "IE":
          this.showModal = true;
          console.log("IE");
          break;
        default:
          console.log("not supported");
      }
    },
    getMatrixLine() {
      const matrix = this.getMatrix;

      let matrixLine = "";
      let matrixString = "";

      for (let i = 0; i < matrix.line; i++) {
        if (i === 0) {
          matrixLine += "[1";
        } else {
          matrixLine += ",1";
        }
      }
      matrixLine += "]";

      for (let i = 0; i < matrix.levels; i++) {
        matrixString += matrixLine;
      }

      this.matrix = `[${matrixString}]`;
    },
    async getContent() {
      await this.getMatrixLine();
    }
  },

  mounted() {
    this.matchHeight();
    this.matchWidth();
    this.$nextTick(function() {
      this.$store.dispatch("writeMatrix", this.matrix);
      this.$store.dispatch("loadingCount", this.loadingCount());
    });
  },

  watch: {
    count(value) {
      if (value == 1) {
        this.timeOut();
      } else if (value > 10) {
        this.timeOutEgg()
      }
    },
    CHECKED(value) {
      if (value) {
        document.getElementById("id").classList.add("blockedScroll");
        return;
      }
      document.getElementById("id").classList.remove("blockedScroll");
    }
  }
};
</script>

<style lang="scss">
.easterEgg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999999;
  background: url('~@/assets/error.jpg') left 0 top 0 no-repeat;
  background-size: cover;
}
.fixedScrollSumm {
  position: fixed;
  top: 0;
  left: 0;
  color: #fff;
  background: #000;
  padding: 10px;
  z-index: 100;
}

@media screen and (max-width: 991px) {
  .heightHeader {
    &.up {
      transition: transform 0.5s ease-out;
    }
    &.fixedBlock {
      color: red;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 9;
      &.down {
        transition: transform 0.3s ease-out;
        transform: translateY(-100%);
      }
    }
  }
}

@font-face {
  font-family: "Montserrat";
  src: url("https://fonts.googleapis.com/css?family=Lato|Montserrat:200,500|Open+Sans:300|Oswald|Raleway|Roboto&display=swap");
}
#box,
html,
body {
  font-family: "Montserrat", sans-serif !important;
  background: #000;
  &.blockedScroll {
    overflow: hidden;
  }
}
.goTop {
  border-radius: 5px;
  background-color: rgb(1, 14, 27);
  background-color: rgba(1, 14, 27, 0.7);
  position: fixed;
  width: 45px;
  height: 45px;
  display: block;
  right: 15px;
  bottom: 80px;
  border: none;
  opacity: 1;
  z-index: 100;
  .fa {
    color: white;
    font-size: 22px;
  }
  &:hover {
    opacity: 1;
    background-color: rgb(1, 14, 27);
    background-color: rgba(1, 14, 27, 0.9);
  }
}

.isVisible {
  opacity: 0.8;
  z-index: 4;
  transition: all 0.4s ease-in;
}
.navbar {
  &.header {
    background: #000;
  }
  & .router-link-active {
    & .btn-secondary {
      background: none;
      border: none;
      & .img_logo {
        max-height: 50px;
      }
      &:focus {
        box-shadow: none;
      }
    }
  }
  & .navbar-nav {
    & .btn {
      color: #fff;
      box-shadow: none;
      &.btn-outline-primary {
        border-radius: 0;
        &.active {
          background: #343a40;
          outline: none;
          &:focus {
            outline: none;
            box-shadow: none;
          }
        }
      }
    }
    & .input-group-append {
      & .btn {
        background: #e3b536;
        border: none;
        border-left: 1px solid #000;
        & .fa-search {
          color: #000;
        }
      }
    }
    & .dropdown-menu {
      background: #222;
      color: #fff;
      &:hover {
        background: #222;
      }
    }
    & .dropdown-item {
      background: #222;
      color: #fff;
      &:hover {
        background: #222;
      }
    }
  }
  & .nav-item {
    & .nav-link {
      color: #fff !important;
    }
  }
}
.category-page__name {
  color: #e3b536;
  padding: 0 17px;
}
li.page-item.disabled.bv-d-xs-down-none {
  display: none;
}

.sort-buttons {
  margin-bottom: 5px;
  margin-right: 10px;
  .btn {
    padding: 5px 10px;
    color: #fff;
    &.active {
      background: #e3b536 !important;
      color: #000 !important;
      border-color: transparent !important;
      &:hover {
        background: #4a4a4a;
      }
      &:focus {
        box-shadow: none !important;
      }
    }
    &:hover {
      text-decoration: underline;
      background: none;
    }
  }
}

.forMobileHome {
  display: none !important;
  @media screen and (min-width: 991px) {
    display: inline-block !important;
  }
}
.wrapper_tab {
  border: 0.5px solid #888;
  border-left: 0;
  border-right: 0;

  .menu_header {
    margin: 0;
    color: #fff;
    display: flex;
    margin-right: auto;
    padding-left: 5px;
    & .sort-buttons {
      margin: 0;
      border: none;
      & .btn {
        border: 0;
        border-radius: 0;
      }
    }
    @media screen and (max-width: 500px) {
      justify-content: center;
    }
    & > * {
      display: inline-block;
      margin: auto 10px;
      color: #fff;
    }
    li {
      list-style-type: none;
      text-align: center;
      padding: 5px 0;
    }
  }
  @media screen and (min-width: 991px) {
    display: flex;
  }
}
.wrapper_setting {
  text-align: left;
  padding: 5px 0;
  & .nav-link {
    color: #e3b536;
  }
  & .dropdown-menu {
    background: #000;
    color: #fff;
    padding: 0 0 20px;
    & .dropdown-item {
      padding: 10px;
      color: #fff;
      &:hover {
        background: #000;
      }
      & .b-dropdown-text {
        & .vue-slider.vue-slider-ltr {
          height: 10px !important;
          & .vue-slider-rail {
            & .vue-slider-process {
              background: #e3b536;
            }
            & .vue-slider-marks {
              background: #ccc;
              & .vue-slider-mark {
                width: 0 !important;
                height: 0 !important;
                &.vue-slider-mark-active {
                  & .vue-slider-mark-step {
                    box-shadow: none;
                  }
                  & .vue-slider-mark-label {
                    margin-top: 25px;
                  }
                }
                & .vue-slider-mark-label {
                  margin-top: 25px;
                }
              }
              & .vue-slider-mark-step {
                width: 0;
                height: 0;
                box-shadow: none;
              }
            }
            & .vue-slider-dot {
              width: 26px !important;
              height: 25px !important;
              & .vue-slider-dot-handle {
                border-radius: 3px;
                border: none;
                background: #555;
                position: relative;
                &:before {
                  content: "";
                  height: 70%;
                  width: 5px;
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  -webkit-transform: translate(-50%, -50%);
                  transform: translate(-50%, -50%);
                  border: 0.5px solid #fff;
                  border-top: 0;
                  border-bottom: 0;
                }
              }
            }
          }
        }
      }
    }
  }
}
.wrapper_pagination {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  @media screen and (max-width: 740px) {
    display: block;
  }
  & .filter {
    color: #fff;
    display: inline;
    margin-bottom: 10px;
    text-align: left;
    @media screen and (max-width: 600px) {
      display: block;
    }
    & .label {
      color: #e3b536;
    }
  }
}

#menuToggle {
  display: block;
  position: relative;
  padding: 10px;
  z-index: 3;
  user-select: none;
  & a {
    text-decoration: none;
    color: #fff;
    transition: color 0.3s ease;

    &:hover {
      color: tomato;
    }
  }

  input {
    display: block;
    width: 47px;
    height: 40px;
    position: absolute;
    top: 0px;
    left: 0px;
    cursor: pointer;
    opacity: 0;
    z-index: 2;
    -webkit-touch-callout: none;
  }

  span {
    display: block;
    width: 33px;
    height: 4px;
    margin-bottom: 5px;
    position: relative;
    background: #cdcdcd;
    border-radius: 3px;
    z-index: 1;
    transform-origin: 4px 0px;
    transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1),
      background 0.5s cubic-bezier(0.77, 0.2, 0.05, 1), opacity 0.55s ease;

    &:first-child {
      transform-origin: 0% 0%;
    }

    &:nth-last-child(2) {
      transform-origin: 0% 100%;
    }
  }

  input:checked ~ span {
    opacity: 1;
    transform: rotate(45deg) translate(0px, -1px);
    background: #fff;

    &:nth-last-child(4) {
      opacity: 0;
      transform: rotate(0deg) scale(0.2, 0.2);
    }

    &:nth-last-child(3) {
      transform: rotate(-45deg) translate(-1px, -1px);
    }
  }
}

#menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 300px;
  height: 100vh;
  margin: 0;
  padding: 85px 10px 10px 20px;
  background: #000;
  list-style-type: none;
  -webkit-font-smoothing: antialiased;
  transform-origin: 0% 0%;
  transform: translate(-100%, 0);
  transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1);
  overflow: scroll;

  li {
    padding: 10px 0;
    font-size: 22px;
  }
  .fa-home {
    font-size: 25px;
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

.wrapper_setting {
  & .navbar-nav {
    margin-left: 0;
    & .nav-link {
      padding: 5px 40px 5px 5px !important;
      border: 1px solid #343a40;
      border-radius: 0.25rem;
      margin-bottom: 5px;
      &:after {
        content: "\F078";
        font-family: FontAwesome;
        font-weight: 400;
        font-style: normal;
        text-align: center;
        padding: 5px;
        background: #000;
        position: absolute;
        right: 0px;
        top: 0px;
        bottom: 0px;
        width: 33px;
        border-radius: 0px 0.25rem 0.25rem 0px;
        border: 1px solid #343a40;
        margin: 0;
      }
    }
  }
}
.show-enter-active {
  animation: show 1s;
}
.show-leave-active {
  animation: show 1s ease-out;
}
@keyframes show {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.hiden-enter-active {
  animation: hiden 1s;
}
.hiden-leave-active {
  animation: hiden 1s ease-out;
}
@keyframes hiden {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>