import { squre } from '../withFiredux'
describe('Firedux helper test', () => {

  it('SplitUrl function should split url correctly', () => {

    const result = squre(2)
    expect(result).toEqual(4)
    expect(squre(5)).toEqual(25)
    expect(squre(10)).toEqual(100)
  })

})