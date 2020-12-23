import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

export default createStore({
  plugins: [createPersistedState({
    storage: window.sessionStorage,
  })],
  state: {
    user: null,
    isSigned: false,
  },
  mutations: {
    updatedUser(state, user) {
      state.user = user;
      state.isSigned = true;
    },
    clearUser(state) {
      state.user = null;
      state.isSigned = false;
    }
  },
  getters: {
    user: state => state.user,
    isSigned: state => state.isSigned,
  },
  actions: {
  },
  modules: {
  }
})
