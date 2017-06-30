let usersData = {}

const load = (userId) => {
  return new User(userId, getState(userId))
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

    startQuiz(questionKeys) {
        this.setState({
            questionKeys: questionKeys,
            currentQuestionKey: utillArray.shuffleKeyFromQuestions(this.questionKeys),
            done: 0,
            state: 'playing'
        })
    }

    get(field) {
        return this.state[field]
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
        return await "initialize"
    } else {
        return await usersData[userId]
    }
}

async function getKeysLeftForThatUser(userId) {
    if (!usersData.hasOwnProperty(userId)) {
        return "User answered all questions"
    } else {
        return usersData[userId].keysLeftForThatUser
    }
}

async function getDoneFromThatUser(userId) {
    if (!usersData.hasOwnProperty(userId)) {
        return "Initialize"
    } else {
        return usersData[userId].done
    }
}

async function getRoundFromThatUser(userId) {
    if (!usersData.hasOwnProperty(userId)) {
        return "Initialize"
    } else {
        return usersData[userId].round
    }
}

async function getReceivedWelcomeFromThatUser(userId) {
    if (!usersData.hasOwnProperty(userId).hasOwnProperty(receivedWelcome)) {
        return "Initialize"
    } else {
        return usersData[userId].receivedWelcome
    }
}

async function setReceivedWelcome(userId, receivedWelcome) {
    if (!usersData.hasOwnProperty(userId)) {
        usersData[userId] = { receivedWelcome }
    } else {
        usersData[userId].receivedWelcome = receivedWelcome
    }
}

async function setStateWelcome(userId, welcome) {
    if (!usersData.hasOwnProperty(userId)) {
        usersWelcome[userId] = { welcome }
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

