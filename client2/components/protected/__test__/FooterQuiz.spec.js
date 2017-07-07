import React from 'react';
import { shallow, mount, render } from 'enzyme';
import FooterQuiz, { QuizCount } from '../FooterQuiz'

describe('FooterQuiz component test', () => {

  it('should always render QuizCount component', () => {
    const Wrapper_0 = shallow(<FooterQuiz quizCount={0} />)
    const Wrapper_1 = shallow(<FooterQuiz quizCount={1} />)
    expect(Wrapper_0.contains(<QuizCount count={0} />)).toEqual(true)
    expect(Wrapper_1.contains(<QuizCount count={1} />)).toEqual(true)
  })

  it('QuizCount should render "No items" message if count is 0', () => {
    const Wrapper = shallow(<QuizCount count={0} />)
    expect(Wrapper.contains('No')).toEqual(true)
    expect(Wrapper.contains('items')).toEqual(true)
  })

  it('QuizCount should render "1 item" message if count is 1', () => {
    const count = 1
    const Wrapper = shallow(<QuizCount count={count} />)
    expect(Wrapper.contains(count)).toEqual(true)
    expect(Wrapper.contains('item')).toEqual(true)
  })

  it('QuizCount should render "2 item" message if count is 1', () => {
    const count = 2
    const Wrapper = shallow(<QuizCount count={count} />)
    expect(Wrapper.contains(count)).toEqual(true)
    expect(Wrapper.contains('items')).toEqual(true)
  })
})