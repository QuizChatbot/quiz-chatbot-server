async function setState(userId, state) {
    if (!usersData.hasOwnProperty(userId)) {
        usersData[userId] = state 
    } else {
        usersData[userId] = state
    }
    console.log('userData = ', usersData)
}

async function setRound(userId, round) {
    if (usersData.hasOwnProperty(userId) === false) {
        usersData[userId] = { round }
    } else {
        usersData[userId].round = round
    }
}

async function getState(userId) {
    if (!usersData.hasOwnProperty(userId)) {
        return null
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

module.exports = {setState, getState, setRound, setStateWelcome, getStateWelcome}