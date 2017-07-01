const app = (state, action) => {
  if (!state) return { authed: false }
  switch (action.type) {
    case 'auth/complete':
      return {
        authed: true
      }
    case 'auth/fail':
      return {
        authed: false
      }
    default:
      return Object.assign({}, state)
  }
}

export default app