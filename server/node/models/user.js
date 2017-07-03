const api = require('../localUserAPI')




const load = async (senderId, keys) => {
    const oldState = await api.getState(senderId)
    if (oldState === null) {
        await api.setState({ state: "initial", done: 0, round: 0, keysLeftForThatUser: keys })
    }
    let state = await api.getState(senderId)

    return new User(senderId, state)

}

class User {
    constructor(senderId, state) {
        this.senderId = senderId
        this.state = state
    }

    setState(newState) {
        api.setState(this.senderId, newState)
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

    // start(){
    //     this.setState({
    //         state: 'playing',
    //     })
    // }

    get(field) {
        return this.state[field]
    }

    getWelcome() {
        return api.getStateWelcome(this.senderId)
    }

    setStateWelcome(stateWelcome) {
        api.setStateWelcome(this.senderId, stateWelcome)
        this.stateWelcome = stateWelcome
    }

    setRound(round) {
        api.setRound(this.senderId, round)
        this.state.round = round
    }

}

module.exports = { load }

