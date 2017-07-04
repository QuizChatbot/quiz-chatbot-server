const api = require('../localUserAPI')

const load = async (senderID, keys) => {
    const oldState = await api.getState(senderID)
    //contact that user for the first time
    if (oldState === null) {
        await api.setState(senderID, { state: "initial", done: 0, round: 0, keysLeftForThatUser: keys, welcomed: false })
    }
    let state = await api.getState(senderID)

    return new User(senderID, state)
}

class User {
    constructor(senderID, state) {
        this.senderID = senderID
        this.state = state
    }

    setState(newState) {
        api.setState(this.senderID, newState)
        this.state = newState
    }

    startQuiz(questionKey) {
        this.setState({
            keysLeftForThatUser: this.state.keysLeftForThatUser,
            currentQuestionKey: questionKey,
            done: this.state.done,
            round: this.state.round,
            state: 'playing'
        })
    }

    get(field) {
        return this.state[field]
    }

    getWelcome() {
        return api.getStateWelcome(this.senderID)
    }

    setStateWelcome(stateWelcome) {
        api.setStateWelcome(this.senderID, stateWelcome)
        this.stateWelcome = stateWelcome
    }

    setRound(round) {
        api.setRound(this.senderID, round)
        this.state.round = round
    }

    welcome() {
        api.setStateWelcome(this.senderID, true)
        this.state.welcomed = true
    }

    playing() {
        api.setState(this.senderID,
            { state: 'playing', done: this.state.done, round: this.state.round, keysLeftForThatUser: this.state.keysLeftForThatUser, welcomed: this.state.welcomed }
        )
        this.state.state = 'playing'
    }

    pause() {
        api.setState(this.senderID,
            { state: 'pause', done: this.state.done, round: this.state.round, keysLeftForThatUser: this.state.keysLeftForThatUser, welcomed: this.state.welcomed }
        )
        this.state.state = 'pause'
    }

    resume() {

    }

    finish(){
        api.setState(this.senderID,
            { state: 'finish', done: this.state.done, round: this.state.round, keysLeftForThatUser: this.state.keysLeftForThatUser, welcomed: this.state.welcomed }
        )
        this.state.state = 'finish'
    }

}

module.exports = { load }

