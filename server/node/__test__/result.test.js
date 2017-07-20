const result = require('../result')

describe('prepare result to save to firebase', () => {
    test('prepare result', () => {

        expect.assertions(1)

        let payload = {
            answer: 'a1',
            question: 'question',
            point: 10 
        }

        let prepareResult = result.prepareResultForFirebase(payload, 5, true, 1500531736193,
        1600531736193, 15, 'id', '12facts')

        let expected = [{ 
            answer: 'a1',
            point: 10,
            question: 'question',
            round: 5,
            score: 15,
            result: true,
            startedAt: '2017-07-20T06:22:16.193Z',
            doneAt: '2020-09-19T16:08:56.193Z',
            duration: 100000000000,
            category: '12facts'
        }]

        
        return expect(prepareResult).resolves.toEqual(expected)
    })
})