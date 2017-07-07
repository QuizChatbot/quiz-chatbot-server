import React from 'react';
import { shallow, mount, render } from 'enzyme';
import HeaderQuiz from '../HeaderQuiz'

describe('HeaderQuiz component test', () => {
  const func = () => { }

  it('should render QuizInput component', () => {
    const Wrapper = shallow(<HeaderQuiz addQuiz={func} />)
    expect(Wrapper.find('header')).toHaveLength(1)
    expect(Wrapper.find('QuizInput')).toHaveLength(1)
    // Wrapper.props().addQuiz
    // expect(Wrapper.prop('addQuiz')).toEqual(func);
    // footer.props.onClearCompleted()
    // expect(func).toBeCalled()
  })

  // it('should call addQuiz function when call onSave', () => {
  //   const Wrapper = shallow(<HeaderQuiz addQuiz={func} />)
  //   expect(Wrapper.instance()).toBeInstanceOf(HeaderQuiz);
  // })
})