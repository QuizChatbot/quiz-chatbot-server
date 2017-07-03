let usersData = {}
let usersWelcome = {}

const load = async (userId) => {
  return new User(userId, await getState(userId))
}

class User {
    constructor(userId, initialState) {
        this.userId = userId
        this.state = initialState
    }

    setState(newState) {
        setState(this.userId, newState)
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

    start(){
        this.setState({
            state: 'playing',
        })
    }

    get(field) {
        return this.state[field]
    }

    getWelcome(){
        return getStateWelcome(this.userId)
    }

    setStateWelcome(stateWelcome){
        setStateWelcome(this.userId, stateWelcome)
        this.stateWelcome = stateWelcome
    }

    setRound(round){
        setRound(this.userId, round)
        this.state.round = round
    }

}


async function setState(userId, state) {
    if (!usersData.hasOwnProperty(userId)) {
        usersData[userId] = state 
    } else {
        usersData[userId] = state
    }
    console.log('userData = ', usersData)
}

async function setRound(userId, round) {
    if (!usersData.hasOwnProperty(userId)) {
        usersData[userId] = { round }
    } else {
        usersData[userId].round = round
    }
}

async function getState(userId) {
    if (!usersData.hasOwnProperty(userId)) {
        return "initialize"
    } else {
        return usersData[userId]
    }
}

async function setStateWelcome(userId, welcome) {
    if (!usersData.hasOwnProperty(userId)) {
        usersWelcome[userId] = {welcome}
    } else {
        usersWelcome[userId] = welcome
    }
    console.log('setStateWelcome = ', usersWelcome)
}

async function getStateWelcome(userId) {
    if (!usersWelcome.hasOwnProperty(userId)) {
        return false
    } else {
        return usersWelcome[userId]
    }
}

module.exports = {load}

