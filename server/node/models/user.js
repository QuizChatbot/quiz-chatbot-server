const api = require('../localUserAPI')

let usersData = {}
let usersWelcome = {}

const load = async (senderId) => {
  return new User(senderId, await api.getState(senderId))
}

class User {
    constructor(senderId, initialState) {
        this.senderId = senderId
        this.state = initialState
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

    getWelcome(){
        return api.getStateWelcome(this.senderId)
    }

    setStateWelcome(stateWelcome){
        api.setStateWelcome(this.senderId, stateWelcome)
        this.stateWelcome = stateWelcome
    }

    setRound(round){
        api.setRound(this.senderId, round)
        this.state.round = round
    }

}

module.exports = {load}

