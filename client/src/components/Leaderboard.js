import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { ListItem } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'

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
    const { developers, category } = this.props
    console.log(developers)
    return (
      <div style={{ textAlign: 'center', margin: 'auto' }}>
        <h2>Leaderboard</h2>
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
  category: PropTypes.string.isRequired
}

export default Leaderboard
