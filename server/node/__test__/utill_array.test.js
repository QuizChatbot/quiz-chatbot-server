const utillArray = require('../utill_array')

describe('shuffle keys and send back first element of shuffled keys', () => {
    function containsAny(source, target) {
        let result = source.filter((item) => { return target.indexOf(item) > -1 });
        return (result.length > 0);
    }

    test('shuffle keys success', () => {
        let keys = ['key1', 'key2', 'key3']
        let shuffle = utillArray.shuffleKeyFromQuestions(keys)
        expect(containsAny(keys, shuffle)).toBeTruthy()
    })

    test('shuffle keys failed', () => {
        let shuffle = utillArray.shuffleKeyFromQuestions([])
        expect(shuffle).toBeFalsy()
    })
})

describe('shuffle choices and return the shuffled array back', () => {
    test('shuffle choices success', () => {
        let choices = ['c1', 'c2', 'c3']
        let shuffle = utillArray.shuffleChoices(choices)
        expect(shuffle).toHaveLength(3)
    })
    test('shuffle choices failed', () => {
        let shuffle = utillArray.shuffleChoices([])
        expect(shuffle).toBeUndefined()
    })
})

describe('get moment', () => {
    test('get moment now', () => {
        expect(utillArray.getMoment()).toBeDefined()
    })
})

describe('Formatted date', () => {
    test('calculate duration in ms', () => {
        expect(utillArray.getFormattedDate(1499167085389)).toBe('2017-07-04T18:18:05+07:00')
    })
})

describe('calculate duration with startedAt and timePostback', () => {
    test('calculate duration in ms', () => {
        expect(utillArray.calculateDuration('2017-07-04T18:08:49+07:00', 1499167085389)).toBeDefined()
    })
})