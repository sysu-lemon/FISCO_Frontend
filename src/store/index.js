import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    'auth': '' || localStorage.getItem('auth'),
    'useraddr': '' || localStorage.getItem('useraddr'),
    'username': '' || localStorage.getItem('username'),
    'usergroup': '' || localStorage.getItem('usergroup')

  },
  mutations: {
    setAuth: (state, auth) => {
      state.auth = auth
      localStorage.setItem('auth', auth)
    },
    setUseraddr: (state, useraddr) => {
      state.useraddr = useraddr
      localStorage.setItem('useraddr', useraddr)
    },
    setUsername: (state, username) => {
      state.username = username
      localStorage.setItem('username', username)
    },
    setUsergroup: (state, usergroup) => {
      state.usergroup = usergroup
      localStorage.setItem('usergroup', usergroup)
    }
  },
  actions: {
    signIn: ({ commit }, data) => {
      commit('setAuth', data.auth)
      commit('setUseraddr', data.useraddr)
      commit('setUsername', data.username)
      commit('setUsergroup', data.usergroup)

    },
    signOut: ({ commit }) => {
      commit('setAuth', '')
      commit('setUseraddr', '')
      commit('setUsername', '')
      commit('setUsergroup', '')
    }
  },
  modules: {
  }
})
