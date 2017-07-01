const developerData = (state, action) => {
  if (!state) return { developers: [] }
  switch (action.type) {
    case 'developer/set-developer-data':
      return {
        developers: action.data
      }
    default:
      return {
        developers: state.developers ? state.developers : []
      }
  }
}

export default developerData