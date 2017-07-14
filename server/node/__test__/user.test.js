const { load, User } = require('../models/user')

const loadUser = async () => {

}

describe('User', () => {
    let api

    beforeEach(async () => {
        let keys = ['key1', 'key2']
        const getState = jest.fn()
        const setState = jest.fn()
        api = { getState, setState }
    })

    it('load default if null', async () => {
        const getState = jest.fn()
        const setState = jest.fn()
        const api = { getState, setState }
        const user = await load('id', ['k1', 'k2'], api)
        expect(getState).toBeCalledWith('id')
        expect(setState).toBeCalled()
        expect(!!user).toBe(true) //have user

    })

    it('load exists should not call setState', async () => {
        const getState = jest.fn(() => {
            return { state: 'initial' }
        })
        const setState = jest.fn()
        const api = { getState, setState }
        const user = await load('id', [], api)
        expect(getState).toBeCalledWith('id')
        expect(setState).not.toBeCalled()
        expect(!!user).toBe(true) //have user
    })

    //playing
    it('change user state from initial to playing', async () => {
        const user = new User('123', { state: 'initial' }, api)
        await user.playing()
        expect(user.state.state).toBe('playing')
        expect(api.setState).toBeCalledWith('123', { state: 'playing', welcomed: true })
    })

    //welcome
    it('change welcome state from false to true', async () => {
        const user = new User('123', { welcomed: true }, api)
        await user.welcome()
        expect(user.state.welcomed).toBeTruthy()
        expect(api.setState).toBeCalledWith('123', { welcomed: true })
    })

    //pause
    it('change user state from playing to pause', async () => {
        const user = new User('123', { state: 'playing' }, api)
        await user.pause()
        expect(user.state.state).toBe('pause')
        expect(user.state.welcomed).toBeTruthy()
        expect(api.setState).toBeCalledWith('123', { state: 'pause', welcomed: true })
    })

    //resume
    it('change user state from pause to playing (resume)', async () => {
        const user = new User('123', { state: 'pause' }, api)
        await user.resume()
        expect(user.state.state).toBe('playing')
        expect(api.setState).toBeCalledWith('123', { state: 'playing' })
    })

    //finish
    it('change user state from playing to finish', async () => {
        const user = new User('123', { state: 'playing' }, api)
        await user.finish()
        expect(user.state.state).toBe('finish')
        expect(user.state.welcomed).toBeTruthy()
        expect(user.state.done).toBe(0)
        expect(user.state.userScore).toBe(0)
        expect(api.setState).toBeCalledWith('123', { state: 'finish', welcomed: true, done: 0, userScore: 0 })
    })

    //next round
    it('change user state from finish to playing in next round', async () => {
        const user = new User('123', { state: 'finish' }, api)
        await user.nextRound(['key1', 'key2'])
        expect(user.state.state).toBe('playing')
        expect(user.state.done).toBe(0)
        expect(user.state.userScore).toBe(0)
        expect(user.state.keysLeftForThatUser).toEqual(['key1', 'key2'])
        expect(api.setState).toBeCalledWith('123', { state: "playing", done: 0, userScore: 0, keysLeftForThatUser: ['key1', 'key2'], welcomed: true })
    })

    //done one question
    it('increase number of done question', async () => {
        const user = new User('123', { state: 'playing', done: 1 }, api)
        await user.doneQuestion()
        expect(user.state.done).toBe(2)
        expect(api.setState).toBeCalledWith('123', { state: 'playing', done: 2 })
    })

    //set next round
    it('increase number of round', async () => {
        const user = new User('123', { round: 1 }, api)
        await user.setRound(3)
        expect(user.state.round).toBe(3)
        expect(api.setState).toBeCalledWith('123', { round: 3 })
    })

    //start quiz
    it('start quiz first time', async () => {
        const user = new User('123', {}, api)
        await user.startQuiz('shuffledKey')
        expect(user.state.state).toBe('playing')
        expect(user.state.currentQuestionKey).toBe('shuffledKey')
        expect(api.setState).toBeCalledWith('123', { state: 'playing', currentQuestionKey: 'shuffledKey' })
    })

    //set state
    it('set state when old state is blanked', () => {
        const user = new User('123', {}, api)
        user.setState({ state: 'newState' })
        expect(user.state.state).toBe('newState')
        expect(api.setState).toBeCalledWith('123', { state: 'newState' })
    })

    it('change old state to new state and add state that not in the old state yet', () => {
        const user = new User('123', { state: 'oldState' }, api)
        user.setState({ state: 'newState', round: 50 })
        expect(user.state.state).toBe('newState')
        expect(user.state.round).toBe(50)
        expect(api.setState).toBeCalledWith('123', { state: 'newState', round: 50 })
    })

    //remove keys of questions that already done
    it('remove keys that user already done', () => {
        const user = new User('123', { state: 'playing', keysLeftForThatUser: ['dog', 'duck', 'cat'] }, api)
        user.removeKeysDone(['cat', 'dog'])
        expect(user.state.keysLeftForThatUser).toEqual(['duck'])
    })

    //change state to choosing
    it('change state to choosing', () => {
        const user = new User('123', { state: 'playing' }, api)
        user.choosing()
        expect(user.state.state).toBe('choosing')
    })

    //choose catagory of questions
    it('choose catagory of questions', () => {
        const user = new User('123', { state: 'playing' }, api)
        user.chooseCategory("kitty")
        expect(user.state.category).toBe('kitty')
    })


    //has questons unanswered
    it('user has questons unanswered', () => {
        const user = new User('123', { state: 'playing' }, api)
        user.hasKeysLeft(['a', 'b', 'c'])
        expect(user.state.keysLeftForThatUser).toEqual(['a', 'b', 'c'])
    })

    //set answers for that question
    it('set answers for that question', () => {
        const user = new User('123', { state: 'playing' }, api)
        user.hasAnswers(['a', 'b', 'c'])
        expect(user.state.answersForEachQuestion).toEqual(['a', 'b', 'c']) 
    })

})