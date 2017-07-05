const { load } = require('../models/user')

describe('User', () => {
    it('load default if null', async () => {
        const getState = jest.fn()
        const setState = jest.fn()
        const api = { getState, setState }
        const user = await load('unknow', [], api)
        expect(getState).toBeCalledWith('unknow')
        expect(setState).toBeCalled()
        expect(!!user).toBe(true)
    })

    it('load exists shuold not call setState', async () => {
        const getState = jest.fn(() => {
            return { state: 'initial' }
        })
        const setState = jest.fn()
        const api = { getState, setState }
        const user = await load('unknow', [], api)
        expect(getState).toBeCalledWith('unknow')
        expect(setState).not.toBeCalled()
        expect(!!user).toBe(true)
    })
})