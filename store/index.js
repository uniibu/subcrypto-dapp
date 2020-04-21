export const state = () => ({
  domain: '',
  subDomain: ''
})

export const mutations = {
  SET_DOMAIN (state, domain) {
    state.domain = domain
  },
  SET_SUBDOMAIN (state, sub) {
    state.subDomain = sub
  }
}

export const getters = {
  Domain (state) {
    return state.domain
  },
  SubDomain (state) {
    return state.subDomain + '.' + state.domain
  }
}

export const actions = {
  setDomain ({ commit }, domain) {
    commit('SET_DOMAIN', domain)
  },
  setSubDomain ({ commit }, sub) {
    commit('SET_SUBDOMAIN', sub)
  }
}
