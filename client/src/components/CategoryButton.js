import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FlatButton from 'material-ui/FlatButton'

export class CategoryButton extends Component {
  render () {
    const { category, categoryLabel, labelColor, setCategory } = this.props
    return (
      <FlatButton
        label={category}
        labelStyle={{ color: labelColor }}
        onTouchTap={() => setCategory(categoryLabel)}
      />
    )
  }
}

CategoryButton.PropTypes = {
  category: PropTypes.string.isRequired,
  categoryLabel: PropTypes.string.isRequired,
  labelColor: PropTypes.string.isRequired,
  setCategory: PropTypes.func.isRequired
}

export default CategoryButton
