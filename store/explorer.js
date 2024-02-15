// /////////////////////////////////////////////////////////////////////// State
// -----------------------------------------------------------------------------
const state = () => ({
  datasetList: false,
  datasetSingular: false,
});

// ///////////////////////////////////////////////////////////////////// Getters
// -----------------------------------------------------------------------------
const getters = {
  datasetList: (state) => state.datasetList,
  datasetSingular: (state) => state.datasetSingular,
};

// ///////////////////////////////////////////////////////////////////// Actions
// -----------------------------------------------------------------------------
const actions = {
  clearStore({ commit }) {
    commit("CLEAR_STORE");
  },
  // /////////////////////////////////////////////////////////// getExplorerData
  async getExplorerData({ commit }, payload) {
    try {
      if (payload.tag === "index") {
        const response = await this.$axios.get(
          `${this.$config.dataUrl}/get-all-datasets`
        );
        console.log(response.data.data[0].deal_providers);
        const file = response.data.data;
        commit("SET_DATASET_LIST", file);
      } else if (payload.tag === "singular") {
        const response = await this.$axios.get(
          `${this.$config.dataUrl}/get-deal/${payload.cid}`
        );
        console.log("singular");
        const file = response.data.data;
        console.log(file);
        commit("SET_DATASET_SINGULAR", file);
      }
    } catch (e) {
      console.log(
        "============ [Store Action: explorer/getExplorerData] ERROR"
      );
      console.log(e);
      return false;
    }
  },
};

// /////////////////////////////////////////////////////////////////// Mutations
// -----------------------------------------------------------------------------
const mutations = {
  CLEAR_STORE(state) {
    state.datasetList = false;
    state.datasetSingular = false;
  },
  SET_DATASET_LIST(state, list) {
    state.datasetList = list;
  },
  SET_DATASET_SINGULAR(state, singular) {
    state.datasetSingular = singular;
  },
};

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default {
  state,
  getters,
  actions,
  mutations,
};
