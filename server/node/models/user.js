const api = require('../localUserAPI')

let usersData = {}
let usersWelcome = {}

const oldState = await api.getState(senderId)

const load = async (senderId, keys) => {
    if(usersData.hasOwnProperty(senderId)){
        return usersData[senderId]
    }
  else{
      return new User(senderId, oldState || {state : "initial", done : 0, round : 0, keysLeftForThatUser : keys}
  }
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

