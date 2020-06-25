<template>
  <div class="lang">
    <b-nav-item-dropdown right>
      <template v-slot:button-content>
        <em>{{ selectedLang }}</em>
      </template>
      <b-dropdown-item-button>
        <b-form-group >
          <b-form-radio-group id="radio-group-2" v-model="selectedLang" name="radio-sub-component">
            <b-form-radio class="inner_radio" v-for="(value, i) in options" :key="i" :value="value.value">
                <flag :iso="value.flag" v-bind:squared=false />
              {{ value.text }}
            </b-form-radio>
          </b-form-radio-group>
        </b-form-group>
      </b-dropdown-item-button>
    </b-nav-item-dropdown>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import i18n from "@/plugins/i18n";

export default {
  name: "Lang",
  data() {
    return {
      selectedLang: "EN",
      options: [
        { flag: "us", text: "EN", value: "EN" },
        { flag: "ru", text: "RU", value: "RU" },
        { flag: "nl", text: "NL", value: "NL" },
        { flag: "pl", text: "PL", value: "PL" },
        { flag: "fr", text: "FR", value: "FR" },
        { flag: "it", text: "IT", value: "IT" },
        { flag: "pt", text: "PT", value: "PT" },
        { flag: "es", text: "ES", value: "ES" },
        { flag: "de", text: "DE", value: "DE" }
      ]
    };
  },
  computed: {
    ...mapGetters(["LANG"])
  },
  created() {
    this.firstLoadingPage()
    this.checkedLang();
    this.changeLocale();
  },
  methods: {
    changeLocale() {
      i18n.locale = this.LANG;
    },
    checkedLang() {
      this.selectedLang = this.LANG;
    },
    firstLoadingPage() {
      if (localStorage.getItem("LANG") == null) {
        localStorage.setItem("LANG", 'EN')
        this.$store.dispatch("CHANGE_LANG", 'EN');
      } else {
        this.$store.dispatch("CHANGE_LANG", localStorage.getItem("LANG"));
      }
    }
  },
  watch: {
    selectedLang(value) {
      localStorage.setItem("LANG", value)
      this.$store.dispatch("CHANGE_LANG", value);
      i18n.locale = value;
    }
  }
};
</script>
<style lang="scss">
#radio-group-2 {
  padding: 10px;
  & .inner_radio {
    display: block;
  }
}
.lang {
  color: #fff;
  border-radius: 3px;
  display: flex;
  margin-left: 10px;
  & .nav-link {
    background: #e3b536;
    padding: 6px 40px 6px 5px !important;
    border-radius: 3px;
    height: 100%;
    &:after {
      content: "\F078";
      font-family: FontAwesome;
      font-weight: 400;
      font-style: normal;
      text-align: center;
      padding: 5px;
      background: #e3b536;
      position: absolute;
      right: 0px;
      top: 0px;
      bottom: 0px;
      width: 33px;
      border-radius: 0px 0.25rem 0.25rem 0px;
      border: 1px solid #343a40;
      margin: -1px -1px;
    }
  }
  & .dropdown-menu {
    position: absolute !important;
    padding: 0;
    min-width: 6rem;
    & .dropdown-item {
      padding: 0;
      & .form-group {
        margin: 0;
      }
    }
  }
}
</style>