let usersData = {}
let usersWelcome = {}

async function setState(senderID, state) {
    if (!usersData.hasOwnProperty(senderID)) {
        usersData[senderID] = state 
    } else {
        usersData[senderID] = state
    }
    // console.log('userData = ', usersData)
}

async function setRound(senderID, round) {
    if (usersData.hasOwnProperty(senderID) === false) {
        usersData[senderID] = { round }
    } else {
        usersData[senderID].round = round
    }
}

async function getState(senderID) {
    if (!usersData.hasOwnProperty(senderID)) {
        return null
    } else {
        return usersData[senderID]
    }
}

async function setStateWelcome(senderID, welcome) {
    // if (!usersData.hasOwnProperty(senderID)) {
    //     usersWelcome[senderID] = {welcome}
    // } else {
    //     usersWelcome[senderID] = welcome
    // }

    usersData[senderID].state.welcomed = welcome
}

async function getStateWelcome(senderID) {
    if (!usersWelcome.hasOwnProperty(senderID)) {
        return false
    } else {
        return usersWelcome[senderID]
    }
}

module.exports = {setState, getState, setRound, setStateWelcome, getStateWelcome}