const summary = require('../summary')


describe('calculateTotalScore', () => {
    it('calculate total score of all questions', () => {
        expect(summary.calculateTotalScore(10)).toBe(150)
    })
}) 

describe('calculateScoreForThatQuestion', () => {
    test('calculate score for that question => Correct , duration < 1min, point 10', () => {
        expect(summary.calculateScoreForThatQuestion(10, true, 4806)).toBe(15)
    })

    test('calculate score for that question => Correct , duration > 1min, point 10', () => {
        expect(summary.calculateScoreForThatQuestion(10, true, 70000)).toBe(13)
    })

    test('calculate score for that question => Wrong , duration < 1min, point 10', () => {
        expect(summary.calculateScoreForThatQuestion(10, false, 4806)).toBe(0)
    })

    test('calculate score for that question => Wrong , duration > 1min, point 10', () => {
        expect(summary.calculateScoreForThatQuestion(10, false, 70000)).toBe(0)
    })
})