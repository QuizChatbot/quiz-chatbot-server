const categoryData = (state, action) => {
  if (!state) return { category: '12_factors_app' }
  switch (action.type) {
    case 'category/set-category':
      return {
        category: action.data
      }
    default:
      return {
        category: state.category || '12_factors_app'
      }
  }
}

export default categoryData
