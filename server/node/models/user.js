const api = require('../localUserAPI')

const load = async (senderID, keys, api) => {
    const oldState = await api.getState(senderID)
    //contact that user for the first time. Dont have oldState of that user
    if (!oldState) {
        await api.setState(senderID, { state: "initial", done: 0, round: 0, keysLeftForThatUser: keys, welcomed: false, userScore: 0 })
    }
    let state = await api.getState(senderID)

    return new User(senderID, state, api)
}

class User {
    constructor(senderID, state, api) {
        this.senderID = senderID
        this.state = state
        this.api = api
    }

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

    // setStateWelcome(stateWelcome) {
    //     this.api.setStateWelcome(this.senderID, stateWelcome)
    //     this.stateWelcome = stateWelcome
    // }

    setRound(round) {
        // this.api.setRound(this.senderID, round)
        this.setState({ round: round })
    }

    welcome() {
        this.api.setStateWelcome(this.senderID, true)
        this.setState({ welcomed: true })
    }

    playing() {
        this.setState(
            {
                state: 'playing',
                welcomed: true
            }
        )
        // this.state.state = 'playing'
        // this.state.welcomed = true
        // this.state.keysLeftForThatUser = keysLeftForThatUser
    }

    startAgain(keysLeftForThatUser) {
        this.setState(
            {
                state: 'playing', keysLeftForThatUser: keysLeftForThatUser,
                welcomed: true
            }
        )
        // this.state.state = 'playing'
        // this.state.welcomed = true
        // this.state.keysLeftForThatUser = keysLeftForThatUser
    }

    pause() {
        this.setState(
            { state: 'pause', welcomed: true }
        )
        // this.state.state = 'pause'
        // this.state.welcomed = true
    }

    resume() {
        this.setState({ state: 'playing' })
        // api.setState(this.senderID,
        //     { state: 'playing', done: this.state.done, round: this.state.round, keysLeftForThatUser: this.state.keysLeftForThatUser, 
        //     welcomed: this.state.welcomed, userScore: this.state.userScore }
        // )
        // this.state.state = 'playing'
    }

    done() {
        this.setState({ done: this.state.done++})
    }

    finish() {
        this.setState({ state: 'finish', welcomed: true, done: 0, userScore: 0 })
        // api.setState(this.senderID,
        //     { state: 'finish', done: 0, round: this.state.round, keysLeftForThatUser: this.state.keysLeftForThatUser, 
        //     welcomed: this.state.welcomed, userScore: 0 }
        // )
        // this.state.state = 'finish'
        // this.state.welcomed = true
    }

    nextRound(keysLeftForThatUser) {
        this.setState({ state: "playing", done: 0, userScore: 0, keysLeftForThatUser: keysLeftForThatUser, welcomed: true })
        // api.setState(this.senderID,
        //     { state: 'playing', done: 0, round: this.state.round, keysLeftForThatUser: keysLeftForThatUser, 
        //     welcomed: this.state.welcomed, userScore: 0 }
        // )
        // this.state.keysLeftForThatUser = keysLeftForThatUser
        // this.state.state = 'playing'
        // this.state.welcomed = true
    }

}

module.exports = { load, User }

