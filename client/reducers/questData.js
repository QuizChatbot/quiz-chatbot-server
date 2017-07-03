const questData = (state, action) => {
  if (!state) return { quests: [] }
  switch (action.type) {
    case 'quest/set-quest-data':
      return {
        quests: action.data
      }
    default:
      return {
        quests: state.quests ? state.quests : []
      }
  }
}

export default questData