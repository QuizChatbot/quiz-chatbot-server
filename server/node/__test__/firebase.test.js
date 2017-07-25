const firebase = require('../firebase')

describe('connect to firebase', () => {
  test('connect to firebase', () => { })
})

describe('number of questions', () => {
  test('category is null', () => {
    let number = firebase.getNumberOfQuestions()
    return expect(number).toBe(0)
  })
  test('category not null', () => {
    let number = firebase.getNumberOfQuestions("category")
    return expect(number).toBe(10)
  })
})

describe('questions from firebase', () => {
  test('get all questions keys from firebase', () => {
    expect.assertions(1)
    return expect(firebase.getQuestionsFromFirebase()).resolves.not.toBeNull()
  })
})
