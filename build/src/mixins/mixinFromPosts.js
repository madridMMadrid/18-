import * as moment from "moment";
import Constants from "../constants/constants";

import { mapGetters } from "vuex";

import parseObjecToString from "../helpers/toStringFromObject";



export const mixinFromPosts = {
	created() {},
	computed: {
    ...mapGetters(["durationData", "matrix", "loading"]),
    lineByBrowser() {
      let w = this.browserWidth
      if (w <= 324) {
        return 1
      } else if (w >= 325 && w <= 580) {
        return 2
      } else if (w >= 581 && w <= 960) {
        return 3
      } else if (w >= 961 && w <= 1900) {
        return 5
      } else if (w > 1901) {
        return 10
      }
    },
		browserWidth() {
      return (
        window.innerWidth ||
          document.documentElement.clientWidth ||
        document.body.clientWidth
      );
    },

		browserHeight() {
			return (
				window.innerHeight ||
				document.documentElement.clientHeight ||
				document.body.clientHeight
			);
		},

		utm() {
			return this.$route.query.utm || "";
		},

		totalTube() {
      return this.countTube * this.totalPages
    },
    durationTo() {
      return this.getDurationToFromQuery();
    },

    blockWidth() {
      const matrix = this.getMatrix;
      if (this.browserWidth <= 400) {
        return this.browserWidth * matrix.line;
      }
      return 188 * matrix.line;
    }
	},
	watch: {
    async filterSource() {
      this.page = 1;
      await this.setFilters();
    },

    async filterDuration() {
      this.page = 1;
      await this.setFilters();
    },

    async filterSort() {
      this.page = 1;
      await this.setFilters();
		},
		$route(to, from) {
      if (to.query.path > 1 || from.path == "/videos") {
        window.scrollTo(0, 0);
      }
    }
	},
	methods: {
    toggleDuration(value) {
      this.filterDuration = value
    },
    toggleSource(value) {
      this.filterSource = value
    },
		async setFilters() {
      const filters = {
        source_id: this.filterSource,
        durationFrom: this.filterDuration[0],
        durationTo: this.filterDuration[1],
        sort: this.filterSort,
        page: this.page
      };

      this.$router.push({
        path: parseObjecToString(filters)
      });

      await this.getContent();
    },
		scrollTo() {
      window.scrollTo(0, 0);
    },
    searchClick() {
      if (this.search === "") {
        return;
      }
      this.$router.push(`/search/?search=${this.search}`);
    },    
		count_char(str) {
			let count = str.length;
			for (let i = 0; i < count; i++) {
				if (str.charAt(i) == "1") {
					this.countTube++
				}
			}
		},
		getSourse(value) {
      this.filterSource = value;
    },
    onPosts(data) {
      this.posts.push(data);
    },
    onSort(data) {
      this.filterSort = data;
    },
    getWindowWidth(event) {
      this.windowWidth = document.documentElement.clientWidth;
    },
    getWindowHeight(event) {
      this.windowHeight = document.documentElement.clientHeight;
    },

    updateSortValue(event) {
      this.filterSort = event;
    },

    searchClick() {
      if (this.search === "") {
        return;
      }
      this.$router.push(`/search/?search=${this.search}`);
    },
		prepareDuration(post) {
      const duration = moment.duration(post.duration, "seconds");
      let seconds = duration.seconds();
      let minutes = duration.minutes();
      let hours = duration.hours();

      if (seconds < 10) {
        seconds = `0${seconds}`;
      }
      if (minutes < 10) {
        minutes = `0${minutes}`;
      }
      if (hours < 10) {
        hours = `0${hours}`;
      }
      if (hours == 0) {
        return `${minutes}:${seconds}`;
      }
      return `${hours}:${minutes}:${seconds}`;
		},
		
		async getCategories() {
      try {
        const { data } = await this.categoryService.getCategories();
        this.categories = data;
        this.categories.map(v => {
          if (v.Slug === this.$route.params.categorySlug) {
            this.category = v;
            this.categoryName = v.Name;
          }
        });
      } catch (error) {
        console.error(error);
      }
		},
		
		async getSources() {
      this.isPending = true;

      try {
        const { data } = await this.inquirerService.getSources();
        this.name = data;
        const sourceOption = [{ text: "all", value: Constants.defaultSource }];
        data.map(source => {
          if (source.Name == "hmovs") return;
          sourceOption.push({ text: source.Name, value: source.ID });
        });
        this.sourceOptions = sourceOption;
      } catch (error) {
        console.error(error);
      }

      this.isPending = false;
    },

    async getUUID() {
      try {
        const {
          data: { UUID }
        } = await this.cookieService.get();
        this.uuid = UUID || "";
      } catch (error) {
        console.error(error);
      }
    },

    prepareBlocks() {
      this.posts.map(post => {
        this.name.map(name => {
          if (name.ID == post.source_id) {
            post.name = name.Name;
          }
        });
        post.link = this.prepareLink(post);
        post.duration = this.prepareDuration(post);

        return post;
      });
    },

    getDurationToFromQuery() {
      const duration = this.$route.query.durationTo
        ? this.$route.query.durationTo.trim()
        : Constants.maxDuration;
      if (duration === "30") {
        return "30+";
      }
      return duration;
    },

    changePage(page) {
      this.scrollTo();
      if (page !== 1 && this.filterSort === Constants.defaultSort) {
        this.filterSort = "top_rated";
      } else {
        this.page = page;
        this.setFilters();
      }
    }
	}
}