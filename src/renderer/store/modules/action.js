const state = {
  actionList: [],
};

const mutations = {
  UPDATE_ACTION(state, payload) {
    state.actionList = payload;
  },
  ADD_ACTION(state, payload) {
    state.actionList.push(payload);
  },
  EDIT_ACTION(state, payload) {
    let index = state.actionList.findIndex((item) => item.id === payload.id);
    if (index > -1) {
      state.actionList.splice(index, 1, { ...payload });
    }
  },
  REMOVE_ACTION(state, payload) {
    state.actionList = state.actionList.filter(
      (item) => item.id !== payload.id
    );
  },
  REMOVE_ALL_ACTION(state, payload) {
    state.actionList = [];
  },
};

const actions = {
  addAction({ commit }, payload) {
    commit("ADD_ACTION", payload);
  },
  editAction({ commit }, payload) {
    commit("EDIT_ACTION", payload);
  },
  removeAction({ commit }, payload) {
    commit("REMOVE_ACTION", payload);
  },
  removeAllAction({ commit }) {
    commit("REMOVE_ALL_ACTION");
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
