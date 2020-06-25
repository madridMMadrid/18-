<template>
  <div class="wrapper admin">
    <div class="left">
      <div class="left-header">
        <ul>
          <li>
            <label class="label" for="Level">Level</label>
            <br />
            <select v-model="left_content_level" id="Level">
              <option v-for="i in 5" :key="i" :value="i">{{ i }}</option>
            </select>
          </li>
          <li>
            <label class="label" for="quantity">quantity</label>
            <br />
            <select class="left-count" v-model="left_count" id="quantity">
              <option v-for="(value, i) in fid_filter" :key="i" :value="value">{{ value }}</option>
            </select>
          </li>
          <li>
            <label class="label" for="categories">categories</label>
            <br />
            <select class="left-count" v-model="left_category" id="categories">
              <option v-for="(value, i) in categories" :key="i" :value="value.ID">{{ value.Name }}</option>
            </select>
          </li>
          <li>
            <label class="label" for="status">status</label>
            <br />
            <select class="left-count" v-model="statusLeft" id="status">
              <option
                v-for="(value, i) in statusValue"
                :key="i"
                v-bind:value="value.value"
              >{{ value.title }}</option>
            </select>
          </li>
          <li>
            <label class="label" for="sort">sort</label>
            <br />
            <select class="left-count" v-model="left_sort" id="sort">
              <option
                v-for="(option, i) in sortOptions"
                v-bind:value="option.value"
                :key="i"
              >{{ option.title }}</option>
            </select>
          </li>
          <li>
            <button @click="getContent('left')" class="left-count">Получить</button>
          </li>
        </ul>
      </div>

      <div class="content-wrapper">
        <div class="block-wrapper" v-for="block in left_blocks" :key="block.title">
          <img @click="redirect(block.link)" :src="block.preview" :alt="block.title" />
          <p class="title">{{ block.title }}</p>
          <p>Shows: {{ block.shows }}</p>
          <p>Clicks: {{ block.clicks }}</p>
          <p>ctr: {{ (block.ctr * 100).toFixed(2) }} %</p>
          <p>Level: {{ block.level }}</p>
          <p>Categories: {{ viewCategory(block.categories).join(', ') }}</p>
          <p>status: {{ status(block.status) }}</p>
        </div>
      </div>
    </div>

    <div class="right">
      <div class="right-header">
        <ul>
          <li>
            <label class="label" for="LevelR">Level</label>
            <br />
            <select v-model="right_content_level" id="LevelR">
              <option v-for=" i in 5" :key="i" :value="i">{{ i }}</option>
            </select>
          </li>
          <li>
            <label class="label" for="quantityR">quantity</label>
            <br />
            <select class="right-count" v-model="right_count" id="quantityR">
              <option v-for="(value, i) in fid_filter" :key="i" :value="value">{{ value }}</option>
            </select>
          </li>
          <li>
            <label class="label" for="forCategory">categories</label>
            <br />
            <select class="left-count" v-model="right_category" id="forCategory">
              <option v-for="(value, i) in categories" :key="i" :value="value.ID">{{ value.Name }}</option>
            </select>
          </li>
          <li>
            <label class="label" for="statusR">status</label>
            <br />
            <select class="left-count" v-model="statusRight" id="statusR">
              <option
                v-for="(value, i) in statusValue"
                v-bind:value="value.value"
                :key="i"
              >{{ value.title }}</option>
            </select>
          </li>
          <li>
            <label class="label" for="sortR">sort</label>
            <br />
            <select class="right-count" v-model="right_sort" id="sortR">
              <option
                v-for="(option, i) in sortOptions"
                v-bind:value="option.value"
                :key="i"
              >{{ option.value }}</option>
            </select>
          </li>
          <li>
            <button @click="getContent('right')" class="right-count">Получить</button>
          </li>
        </ul>
      </div>
      <div class="content-wrapper">
        <div class="block-wrapper" v-for="block in right_blocks" :key="block.title">
          <img @click="redirect(block.link)" :src="block.preview" :alt="block.title" />
          <p class="title">{{ block.title }}</p>
          <p>Shows: {{ block.shows }}</p>
          <p>Clicks: {{ block.clicks }}</p>
          <p>ctr: {{ (block.ctr * 100).toFixed(2) }} %</p>
          <p>Level: {{ block.level }}</p>
          <p>Categories: {{ viewCategory(block.categories).join(', ') }}</p>
          <p>status: {{ status(block.status) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters, mapActions } from "vuex";
import { ListGroupPlugin } from "bootstrap-vue";

export default {
  name: "Admin",
  data() {
    return {
      left_content_level: 1,
      right_content_level: 1,

      left_count: "20",
      right_count: "20",

      left_category: 1,
      right_category: 1,

      sortOptions: [
        {
          title: "Least Viewed",
          value: "least_viewed"
        },
        {
          title: "Top Rated",
          value: "top_rated"
        },
        {
          title: "Last Added",
          value: "last_added"
        },
        {
          title: "Most Viewed",
          value: "most_viewed"
        },
        {
          title: "Most Visited",
          value: "most_visited"
        },
        {
          title: "Least Visited",
          value: "least_visited"
        },
        {
          title: "Highest ctr",
          value: "highest_ctr"
        },
        {
          title: "Lowest ctr",
          value: "lowest_ctr"
        }
      ],

      statusLeft: 0,
      statusRight: 0,

      statusValue: [
        {
          title: "All",
          value: 0
        },
        {
          title: "в бакете",
          value: 1
        },
        {
          title: "оставлен",
          value: 2
        },
        {
          title: "удален",
          value: 3
        },
        {
          title: "только что поднят на уровень",
          value: 4
        }
      ],

      fid_filter: [5, 10, 20, 50],

      left_sort: "top_rated",
      right_sort: "top_rated",

      left_blocks: [],
      right_blocks: [],
      ct: "",
      test: "",
      link: [],
      leftLink: "",
      rightLink: ""
    };
  },
  async created() {
    await this.myGetCategories();
    this.ct = this.categories;
    this.pushAll(this.ct);
    this.winLoc();
  },

  computed: {
    ...mapGetters(["categories"])
  },
  mounted() {},
  beforeCreate() {},
  methods: {
    ...mapActions(["myGetCategories"]),
    winLoc() {
      let obj = this.$route.query
      if (this.$route.path == "/admin/" && Object.keys(obj).length !== 0 && obj.constructor === Object) {
        let search = new URLSearchParams(window.location.search);
        for (var pair of search.entries()) {
          if (pair[0].charAt(0) == "L") {
            this.leftLink += "&" + pair[0].substr(1) + "=" + pair[1];
          } else if (pair[0].charAt(0) == "R") {
            this.rightLink += "&" + pair[0].substr(1) + "=" + pair[1];
          }
        }
        this.linkFunction();
        this.rightFunction();
      } else {
        console.log("/some");
      }
    },
    async linkFunction() {
      const { data } = await axios.get(
        `http://admin-api-0.pcj.infrapu.sh/content?${this.leftLink}`
      );
      this.left_blocks = data.blocks;
    },
    async rightFunction() {
      const { data } = await axios.get(
        `http://admin-api-0.pcj.infrapu.sh/content?${this.rightLink}`
      );
      this.right_blocks = data.blocks;
    },
    getLocation(href) {
      //  href = window.location.href
      // метод для не далекого будующего
      var match = href.match(
        /^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/
      );
      return (
        match && {
          protocol: match[1],
          host: match[2],
          hostname: match[3],
          port: match[4],
          pathname: match[5],
          search: match[6],
          hash: match[7]
        }
      );
    },
    pushAll(value) {
      let b = { ID: 0, Name: "All" };
      value.unshift(b);
    },
    status(sum) {
      switch (sum) {
        case 1:
          return "В бакуте";
        case 2:
          return "Оставлен";
        case 3:
          return "Удален";
        case 4:
          return "Только что поднят на уровень";
      }
    },
    viewCategory(name) {
      let nameCategory = this.categories;
      let massName = [];
      for (var key in nameCategory) {
        name.map(id => {
          if (nameCategory[key].ID == id) {
            massName.push(nameCategory[key].Name);
          }
        });
      }
      return massName;
    },
    async getContent(side) {
      let left = `?Lcategory=${this.left_category}&LsortBy=${this.left_sort}&Llimit=${this.left_count}&Llevel=${this.left_content_level}&Lstatus=${this.statusLeft}`;
      let right = `&Rcategory=${this.right_category}&RsortBy=${this.right_sort}&Rlimit=${this.right_count}&Rlevel=${this.right_content_level}&Rstatus=${this.statusRight}`;

      if (side === "left") {
        const { data } = await axios.get(
          `http://admin-api-0.pcj.infrapu.sh/content?category=${this.left_category}&sortBy=${this.left_sort}&limit=${this.left_count}&level=${this.left_content_level}&status=${this.statusLeft}`
        );
        window.history.pushState(
          "http://traffstore.com/",
          "title",
          `${left}${right}`
        );
        this.left_blocks = data.blocks;
        return;
      }
      const { data } = await axios.get(
        `http://admin-api-0.pcj.infrapu.sh/content?category=${this.right_category}&sortBy=${this.right_sort}&limit=${this.right_count}&level=${this.right_content_level}&status=${this.statusRight}`
      );
      window.history.pushState(
        "http://traffstore.com/",
        "title",
        `${left}${right}`
      );
      this.right_blocks = data.blocks;
    },

    redirect(link) {
      window.open(link, "_blank");
    }
  }
};
</script>

<style scoped lang="scss">
ul {
  li {
    display: inline-block;
    padding: 0 10px;
  }
}
.wrapper {
  display: flex;
  min-height: 100vh;
  &.admin {
    & select {
      background: #fff
    }
  }
}

.left {
  display: flex;
  flex-direction: column;
  width: 50%;
  border-right: 1px solid;
}

.right {
  display: flex;
  width: 50%;
  flex-direction: column;
}

.left-header {
  padding: 10px;
  border-bottom: 1px solid;
  height: 80px;
}

.right-header {
  padding: 10px;
  border-bottom: 1px solid;
  height: 80px;
}

.label {
  color: #fff;
}

.right-count {
  max-width: 120px;
}

.left-count {
  max-width: 120px;
}

.content-wrapper {
  display: flex;
  flex-wrap: wrap;
}

.block-wrapper {
  width: 100%;
  max-width: 290px;
  margin: 5px;
  padding: 5px;
  border: 1px solid;
  cursor: pointer;
  color: #fff;
  font-size: 15px;
  & p {
    margin-bottom: 3px;
    &.title {
      color: #e3b536;
    }
  }
}

.block-wrapper:hover {
  border-color: red;
}

.block-wrapper img {
  width: 100%;
  height: 225px;
}
</style>
