<template>
  <div :class="`page page-${tag}`">
    <HeaderIndex class="header" :heading="heading" :subheading="subheading" />
    <Stats :stats="stats" :stat-data="statData" />
    <section id="deals-table">
      <div class="grid">
        <div class="col">
          <TableDatasetSingular v-if="cids" id="blur-trigger" :navs="navs" />
        </div>
      </div>
    </section>
    <div v-if="loading" id="dataset-dot-loader" class="grid">
      <div class="col">
        <div class="dataset-loading-placeholder">
          <LoaderTripleDot theme="blue" />
          <div class="loading-text">
            {{ loadingText }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from "vuex";

import HeaderIndex from "@/components/header-index";
import Stats from "@/components/stats";
import TableDatasetSingular from "@/components/table-dataset-singular";
import LoaderTripleDot from "@/components/spinners/triple-dot";
import Page from "@/content/pages/explorer.json";

// ====================================================================== Export
export default {
  name: "IndexPage",

  components: {
    HeaderIndex,
    Stats,
    TableDatasetSingular,
    LoaderTripleDot,
  },

  data() {
    return {
      tag: "explorer",
      subtag: "singular",
      loading: false,
      loadingText: "",
    };
  },

  async fetch({ store, route, $content }) {
    await store.dispatch("global/getBaseData", "general");
    await store.dispatch("global/getBaseData", { key: "explorer", data: Page });
    await store.dispatch("explorer/getExplorerData", {
      tag: "index",
      file: "dataset_list.json",
    });
  },

  computed: {
    ...mapGetters({
      siteContent: "global/siteContent",
      datasetList: "explorer/datasetList",
      cids: "explorer/datasetSingular",
      filterValue: "global/filterValue",
    }),
    dataset() {
      return this.datasetList;
    },
    pageData() {
      return this.siteContent[this.tag];
    },
    heading() {
      return this.pageData.fold.heading;
    },
    subheading() {
      return this.pageData.fold.subheading;
    },
    stats() {
      return this.pageData.stats;
    },
    navs() {
      return this.pageData.table.navs;
    },
    statData() {
      const dataset = this.datasetList.filter((obj) => {
        return obj.cid === this.$route.params.cid;
      });
      return dataset[0];
    },
    tableColumns() {
      return this.pageData.table.columns;
    },
  },

  created() {
    this.loadingText = this.pageData.table.loading_placeholder_text;
  },

  async mounted() {
    const id = this.$route.params.cid;
    this.loading = true;
    const timeout = setTimeout(() => {
      this.loadingText = this.pageData.table.loading_text_secondary;
    }, 5000);
    await this.getExplorerData({ tag: "singular", cid: `${id}` });
    clearTimeout(timeout);
    this.loading = false;
  },

  methods: {
    ...mapActions({
      getExplorerData: "explorer/getExplorerData",
      setFilterValue: "global/setFilterValue",
    }),
  },
};
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#filter-search {
  padding-top: 1.25rem;
  padding-bottom: 2.8125;
  @include small {
    padding-bottom: 1.75rem;
  }
  @include mini {
    padding-bottom: 0.75rem;
  }
}
// /////////////////////////////////////////////////////////////// [Toolbar] Top

// /////////////////////////////////////////////////////////////////////// Table
#dataset-dot-loader {
  margin-top: 1rem;
  margin-bottom: 3rem;
}
.dataset-loading-placeholder {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
  padding: 0.5rem 3rem;
  width: calc(100% - 2px);
  height: calc(100% - 2px);
  border-radius: 0.3125rem;
  background: $gradient_SilverGrey;
  z-index: 5;
  box-shadow: 0px 30px 70px rgba(169, 180, 203, 0.3), -2px -2px 0px $white,
    0px 3px 5px $mischka, inset 0px -20px 20px rgba(255, 255, 255, 0.2);
  .loading-text {
    padding-left: 2rem;
  }
}

// //////////////////////////////////////////////////////////// [Toolbar] Bottom
</style>
