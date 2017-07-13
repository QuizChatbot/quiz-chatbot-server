import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CategoryButton from './CategoryButton'
import styled from 'styled-components'
import { ListItem } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import _ from 'lodash'

const ListContainer = styled.div`
text-align: left;
width: 100%;
max-width: 480px;
margin: auto;
`

export const LeaderboardItem = ({ idx, developer, category }) => (
  <ListItem
    key={idx}
    leftAvatar={<Avatar src={developer.profile.profile_pic} />}
    primaryText={
      idx +
        1 +
        ' ' +
        developer.profile.first_name +
        ' ' +
        developer.profile.last_name
    }
    secondaryText={
      <p>
        <span>Grade: {developer[category].grade}</span><br />
        Score: {developer[category].score}
      </p>
    }
    secondaryTextLines={2}
  />
)

class Leaderboard extends Component {
  render () {
    const { developers, currentCategory, setCategory } = this.props
    const categories = ['12 Factors App', 'Design Patterns']
    return (
      <div style={{ textAlign: 'center', margin: 'auto' }}>
        <h2>Leaderboard</h2>
        {categories.map((category, idx) => (
          <CategoryButton
            key={idx}
            category={category}
            categoryLabel={_.snakeCase(category)}
            labelColor={
              currentCategory === _.snakeCase(category) ? 'orange' : 'black'
            }
            setCategory={setCategory}
          />
        ))}

        <ListContainer>
          {!developers.length
            ? <div style={{ textAlign: 'center' }}>No Players</div>
            : developers.map((developer, idx) => (
              <LeaderboardItem
                key={idx}
                idx={idx}
                developer={developer}
                category={currentCategory}
                />
              ))}
        </ListContainer>
      </div>
    )
  }
}

Leaderboard.PropTypes = {
  developers: PropTypes.object.isRequired,
  currentCategory: PropTypes.string.isRequired,
  setCategory: PropTypes.func.isRequired
}

export default Leaderboard
