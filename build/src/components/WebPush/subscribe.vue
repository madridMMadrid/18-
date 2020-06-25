<template>
  <div>
    <div id="one"></div>
  </div>
</template>
<script>
import exportconst from "./exportconst";
import stoneheart from "./stoneheart";

export default {
  name: "webpush",
  props: ["advPopunder", "advPush"],
  data() {
    return {};
  },
  components: {
    stoneheart
  },
  computed: {},
  created() {},
  methods: {
    popunder() {
      adver("popunder", {
        pjs: {
          tricksChrome: false
        },
        pop: {},
        disableAdditional: true,
        exitPop: false
      });
    },
    popup() {
      (function(p, u, s, h, x) {
        h = u.getElementsByTagName("head")[0];
        x = u.createElement("script");
        x.async = 1;
        x.src = s;
        x.onload = function() {
          p.tcpusher("init", {
            serviceWorkerPath: import('./XZgtxP4p.js'),
            tube: "tcpublisher",
            sub: 412729654,
            tcid: 3078
          });
        };
        h.appendChild(x);
      })(
        window,
        document,
        "https://sw.wpu.sh/script/main.js?promo=23677&tcid=3078&src=412729654"
      );
    }
  },
  watch: {
    advPopunder() {
      if (this.advPopunder) {
        this.popunder();
      }
    },
    advPush() {
      if (this.advPush) {
        this.popup();
      }
    }
  }
};
</script>