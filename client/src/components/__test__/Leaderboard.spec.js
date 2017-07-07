import React from 'react';
import { shallow, mount, render } from 'enzyme';
import Leaderboard, { LeaderboardItem } from '../Leaderboard'

describe('Leaderboard component test', () => {
  const props = {
    developers: [{
      profile: {
        first_name: 'Xiao',
        last_name: 'Ying'
      },
      maxSummary: {
        grade: 'B',
        score: 75
      }
    }]
  }

  it('should render leaderbaord item message', () => {
    const Wrapper = shallow(<LeaderboardItem developer={props.developers[0]} key={0} idx={0} />)
    expect(Wrapper.contains(<h2>1. Xiao Ying B ( score: 75 )</h2>)).toEqual(true)
  })

  it('should render leaderboard component', () => {
    const Wrapper = shallow(<Leaderboard {...props} />)
    expect(Wrapper.contains(<h2>Leaderboard</h2>)).toEqual(true)
    expect(Wrapper.contains(<LeaderboardItem developer={props.developers[0]} key={0} idx={0} />)).toEqual(true)
  })

  it('should render No players message if developers length is 0', () => {
    const Wrapper = shallow(<Leaderboard developers={[]} />)
    expect(Wrapper.contains('No Players')).toEqual(true)
  })
})