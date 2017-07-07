import React from 'react';
import { shallow, mount, render } from 'enzyme';
import QuizItem, { Element } from '../QuizItem'

describe('QuizItem component test', () => {
  const quest = {}
  const func = () => { }

  it('should render Element component', () => {
    const Wrapper = shallow(<QuizItem quest={quest} editQuiz={func} deleteQuiz={func} />)
    expect(Wrapper.contains(<Element quest={quest} deleteQuiz={func} editQuiz={func} />)).toEqual(true)
  })

  it('Element component should render QuizInput component and button', () => {
    const Wrapper = shallow(<Element quest={quest} deleteQuiz={func} editQuiz={func} />)
    expect(Wrapper.find('QuizInput')).toHaveLength(1)
    expect(Wrapper.find('button')).toHaveLength(1)
  })
})