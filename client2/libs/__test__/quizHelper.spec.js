import React from 'react'
import { getBlankQuest, getQuestFromProps, getQuizStatefromQuest } from '../quizHelper'

describe('quizHelper', () => {

  it('getBlankQuest should return blank', () => {
    expect(getBlankQuest()).toMatchSnapshot()
  })

  it('getQuestFromProps should return blank if quest is undefined', () => {
    expect(getQuestFromProps()).toMatchSnapshot()
  })

  it('getQuestFromProps should return new object', () => {
    const quest = {
      subject: 'subject',
      question: 'question',
      choices: ['c0', 'c1', 'c2']
    }
    expect(getQuestFromProps(quest)).toMatchSnapshot()
  })

  it('getQuizStatefromQuest should return state with blank if quest is new object', () => {
    expect(getQuizStatefromQuest({})).toMatchSnapshot()
  })

  it('getQuizStatefromQuest should return state with data', () => {
    const quest = {
      subject: 'subject',
      question: 'question',
      choice_0: 'c0',
      choice_1: 'c1',
      choice_2: 'c2',
    }
    expect(getQuizStatefromQuest(quest)).toMatchSnapshot()
  })
})