const firebase = require('../firebase')

// describe('connect to firebase', () => {
//     test('connect to firebase', () => {
       
//     })
// }) 

describe('number of questions', () => {
    test('get number of questions', () => {
       expect.assertions(1)
       return expect(firebase.getNumberOfQuestions()).resolves.toBeDefined()
    })
})

describe('questions from firebase', () => {
    test('get all questions keys from firebase', () => {
       expect.assertions(1)
       return expect(firebase.getNumberOfQuestions()).resolves.toBeDefined()
    })
})