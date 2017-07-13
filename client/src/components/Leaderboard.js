import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { ListItem } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import FlatButton from 'material-ui/FlatButton'

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
    const { developers, category, setCategory } = this.props
    console.log('category:', category)
    const labelColor1 = category === '12_factors_app' ? 'orange' : 'black'
    const labelColor2 = category === 'design_patterns' ? 'orange' : 'black'
    console.log(developers)
    return (
      <div style={{ textAlign: 'center', margin: 'auto' }}>
        <h2>Leaderboard</h2>
        <FlatButton
          label='12 Factors App'
          labelStyle={{ color: labelColor1 }}
          onTouchTap={() => setCategory('12_factors_app')}
        />
        <FlatButton
          label='Design Patterns'
          labelStyle={{ color: labelColor2 }}
          onTouchTap={() => setCategory('design_patterns')}
        />
        <ListContainer>
          {!developers.length
            ? <div style={{ textAlign: 'center' }}>No Players</div>
            : developers.map((developer, idx) => (
              <LeaderboardItem
                key={idx}
                idx={idx}
                developer={developer}
                category={category}
                />
              ))}
        </ListContainer>
      </div>
    )
  }
}

Leaderboard.PropTypes = {
  developers: PropTypes.object.isRequired,
  category: PropTypes.string.isRequired,
  setCategory: PropTypes.func.isRequired
}

export default Leaderboard
