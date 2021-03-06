const utillArray = require('../utill_array')


// sumArray (array)
describe('sum all values in array', () => {
  test('sum all value', () => {
    let arr = [1,2,3]
    expect(utillArray.sumArray(arr)).toBe(6)
  })
})

// changeMillisToMoment (ms)
describe('change ms to moment', () => {
  test('change ms to minute, second', () => {
    let mm = utillArray.changeMillisToMoment(128066)
    expect(mm.minutes()).toBe(2)
    expect(mm.seconds()).toBe(8)
  })
})

// shuffleKeyFromQuestions (keys)
describe('shuffle keys and send back first element of shuffled keys', () => {
  function containsAny (source, target) {
    let result = source.filter(item => {
      return target.indexOf(item) > -1
    })
    return result.length > 0
  }

  test('shuffle keys success', () => {
    let keys = ['key1', 'key2', 'key3']
    let shuffle = utillArray.shuffleKeyFromQuestions(keys)
    expect(containsAny(keys, shuffle)).toBeTruthy()
  })

  test('shuffle keys failed', () => {
    let shuffle = utillArray.shuffleKeyFromQuestions()
    expect(shuffle).toBeNull()
  })
})

// shuffleChoices (choices)
describe('shuffle choices and return the shuffled array back', () => {
  test('shuffle choices success', () => {
    let choices = ['c1', 'c2', 'c3']
    let shuffle = utillArray.shuffleChoices(choices)
    expect(shuffle).toHaveLength(3)
  })
  test('shuffle choices failed', () => {
    let shuffle = utillArray.shuffleChoices()
    expect(shuffle).toBeNull()
  })
})

// getMoment()
describe('get moment', () => {
  test('get moment now', () => {
    expect(utillArray.getMoment()).toBeDefined()
  })
})
 
// getFormattedDate (timestamp)
describe('Formatted date', () => {
  test('calculate duration in ms', () => {
    expect(utillArray.getFormattedDate(1600531736193)).toBe(
      '2020-09-19T16:08:56.193Z'
    )
  })
})

// calculateDuration = (startedAt, timeOfPostback)
describe('calculate duration with startedAt and timePostback', () => {
  test('calculate duration in ms', () => {
    expect(
      utillArray.calculateDuration('2017-07-04T18:08:49+07:00', 1499167085389)
    ).toBeDefined()
  })
})
