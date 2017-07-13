import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ListItem } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'

export class LeaderboardItem extends Component {
  render () {
    const { idx, developer, category } = this.props
    return (
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
  }
}

LeaderboardItem.PropTypes = {
  idx: PropTypes.number.isRequired,
  developer: PropTypes.object.isRequired,
  category: PropTypes.string.isRequired
}

export default LeaderboardItem
