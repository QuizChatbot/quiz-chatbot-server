import React from 'react'
import { shallow, mount, render } from 'enzyme'
import MainSectionQuiz, { Footer } from '../MainSectionQuiz'

describe('MainSectionQuiz component test', () => {
  const actions = {}

  it('should render No Quizzes message if no quiz', () => {
    const quests = []
    const Wrapper = shallow(
      <MainSectionQuiz quests={quests} actions={actions} />
    )
    expect(Wrapper.contains(<div>No Quizzes</div>)).toEqual(true)
  })

  it('should render QuizItem component if have quiz', () => {
    const quests = [{ id: 1 }, { id: 2 }]
    const Wrapper = shallow(
      <MainSectionQuiz quests={quests} actions={actions} />
    )
    expect(Wrapper.find('QuizItem')).toHaveLength(2)
    expect(Wrapper.find(Footer)).toHaveLength(1)
  })

  it('Footer should render QuizCount component', () => {
    const quizCount = 1
    const Wrapper = shallow(<Footer quizCount={quizCount} />)
    expect(Wrapper.find('QuizCount')).toHaveLength(1)
  })
})
