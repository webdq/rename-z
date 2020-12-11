const state = {
  errorMessage: "",
  pageLoading: false,
};

const mutations = {
  UPDATE_ERROR_MESSAGE(state, msg) {
    state.errorMessage = msg;
  },
  UPDATE_PAGE_LOADING(state, status) {
    state.pageLoading = status;
  },
};

const actions = {
  updateErrorMessage({ commit }, payload) {
    commit("UPDATE_ERROR_MESSAGE", payload);
  },
  updatePageLoading({ commit }, payload) {
    commit("UPDATE_PAGE_LOADING", payload);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
