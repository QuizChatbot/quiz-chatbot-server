const result = require('../result')

describe('prepare result to save to firebase', () => {
    test('prepare result', () => {

        expect.assertions(1)

        let payload = {
            answer: 'a1',
            question: 'question',
            point: 10 
        }

        let prepareResult = result.prepareResultForFirebase(payload, ['a1', 'a2', 'a3'], 2,
            true, '2017-07-04T18:08:49+07:00', 1499167085389, 15, '00001')

        let expected = [{
            answer: 'a1',
            point: 10,
            question: 'question',
            round: 2,
            score: 15,
            result: true,
            startedAt: '2017-07-04T18:08:49+07:00',
            doneAt: '2017-07-04T18:18:05+07:00',
            duration: 556389
        }]

        
        return expect(prepareResult).resolves.toEqual(expected)
    })
})