const api = require('../localUserAPI')
const utillArray = require('../utill_array')

/**
 * Load existing user of create new one
 * @param {String} senderID 
 * @param {[String]} keys 
 * @param {module} api 
 */
const load = async (senderID, keys, api) => {
    const oldState = await api.getState(senderID)
    //contact that user for the first time. Dont have oldState of that user
    if (!oldState) {
        await api.setState(senderID, { state: "initial", done: 0, round: 0, keysLeftForThatUser: keys, welcomed: false, userScore: 0 })
    }
    let state = await api.getState(senderID)

    return new User(senderID, state, api)
}

/**
 * @class user - handle states of user
 */
class User {
    /**
     * @constructor
     * @param {String} senderID 
     * @param {object} state - state of user
     * @param {Module} api - localUserAPI
     */
    constructor(senderID, state, api) {
        this.senderID = senderID
        this.state = state
        this.api = api
    }
    /**
     * Set state of user
     * @param {object} updateState 
     */
    setState(updateState) {
        const newState = Object.assign({}, this.state, updateState)
        this.api.setState(this.senderID, newState)
        this.state = newState
    }
    
    startQuiz(questionKey) {
        this.setState({
            keysLeftForThatUser: this.state.keysLeftForThatUser,
            currentQuestionKey: questionKey,
            done: this.state.done,
            round: this.state.round,
            state: 'playing',
            userScore: this.state.userScore
        })
    }

    setRound(round) {
        this.setState({ round: round })
    }

    welcome() {
        this.setState({ welcomed: true })
    }

    playing() {
        this.setState(
            { state: 'playing', welcomed: true }
        )
    }

    pause() {
        this.setState(
            { state: 'pause', welcomed: true }
        )
    }

    resume() {
        this.setState({ state: 'playing' })

    }

    //when user answer one question
    doneQuestion() {
        let done = this.state.done + 1
        this.setState({ done: done })
    }

    finish() {
        this.setState({ state: 'finish', welcomed: true, done: 0, userScore: 0 })
    }

    nextRound(keysLeftForThatUser) {
        this.setState({ state: "playing", done: 0, userScore: 0, keysLeftForThatUser: keysLeftForThatUser, welcomed: true })
    }

    removeKeysDone(keysDone) {
        let keysLeftForThatUser = utillArray._.pullAll(this.state.keysLeftForThatUser, keysDone)
        this.setState({ keysLeftForThatUser: keysLeftForThatUser })
    }

    chooseCategory(category) {
        this.setState({ state: 'playing', category: category })
    }

    choosing() {
        this.setState({ state: 'choosing' })
    }

    hasKeysLeft(keysLeftForThatUser) {
        this.setState({ keysLeftForThatUser: keysLeftForThatUser })
    }

}

module.exports = { load, User }

