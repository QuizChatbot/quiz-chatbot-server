const result = require('../result')

describe.skip('prepare result to save to firebase', () => {
    test('prepare result', () => {

        expect.assertions(1)

        let payload = {
            answer: 'a1',
            question: 'question',
            point: 10 
        }

        let prepareResult = result.prepareResultForFirebase(payload, 5, true, '2017-07-04T18:08:49+07:00',
        '2017-07-04T18:18:05+07:00', 15, 1499167085389, '12facts')

        let expected = [{ 
            answer: 'a1',
            point: 10,
            question: 'question',
            round: 5,
            score: 15,
            result: true,
            startedAt: '2017-07-04T18:08:49+07:00',
            doneAt: '2017-07-04T11:18:05+00:00',
            duration: 556000,
            category: '12facts'
        }]

        
        return expect(prepareResult).resolves.toEqual(expected)
    })
})