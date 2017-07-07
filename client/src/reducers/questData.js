const questData = (state, action) => {
  const { quests = [] } = state || {}

  switch (action.type) {
    case 'quest/set-quest-data':
      return {
        quests: action.data
      }
    default:
      return {
        quests
      }
  }
}

export default questData
