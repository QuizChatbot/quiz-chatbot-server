import React from 'react'
import { shallow, mount, render } from 'enzyme'
import QuizCount, { QuizWord } from '../QuizCount'

describe('QuizCount component test', () => {
  it('should always render QuizWord component', () => {
    const Wrapper_0 = shallow(<QuizCount quizCount={0} />)
    const Wrapper_1 = shallow(<QuizCount quizCount={1} />)
    expect(Wrapper_0.contains(<QuizWord count={0} />)).toEqual(true)
    expect(Wrapper_1.contains(<QuizWord count={1} />)).toEqual(true)
  })

  it('QuizWord should render "No items" message if count is 0', () => {
    const Wrapper = shallow(<QuizWord count={0} />)
    expect(Wrapper.contains('No')).toEqual(true)
    expect(Wrapper.contains('items')).toEqual(true)
  })

  it('QuizWord should render "1 item" message if count is 1', () => {
    const count = 1
    const Wrapper = shallow(<QuizWord count={count} />)
    expect(Wrapper.contains(count)).toEqual(true)
    expect(Wrapper.contains('item')).toEqual(true)
  })

  it('QuizWord should render "2 item" message if count is 1', () => {
    const count = 2
    const Wrapper = shallow(<QuizWord count={count} />)
    expect(Wrapper.contains(count)).toEqual(true)
    expect(Wrapper.contains('items')).toEqual(true)
  })
})
