import firedux, { firebaseApp as firebase } from '../store/firedux'
import { firebaseToArray } from '../utils'

export function addQuiz(quiz) {
  return () => {
    firedux.push('Quests', {
      subject: quiz.subject,
      question: quiz.question,
      choices: [quiz.choice_0, quiz.choice_1, quiz.choice_2],
      owner: "5LrhuhQtqDfempxq8B9zGpqiiK42",
      skills: "es6",
      point: 15,
      createdAt: Date(),
      updatedAt: Date(),
    })
  }
}

export function deleteQuiz(id) {
  return () => { firedux.remove(`Quests/${id}`) }
}

export function editQuiz(id, quiz, isChoice) {
  return () => {
    isChoice ?
      firedux.update(`Quests/${id}/choices`, quiz)
      : firedux.update(`Quests/${id}`, quiz)
    firedux.update(`Quests/${id}`, {
      updatedAt: Date()
    })
  }
}

export function login() {
  return (dispatch) => {
    firedux.login().then(() => {
      dispatch({ type: 'auth/complete' })
      firedux.watch('Quests').then(() => getQuest())
    })
  }
}

export function logout() {
  return (dispatch) => {
    firedux.logout().then(() => {
      dispatch({ type: 'auth/fail' })
    })
  }
}

export function init() {
  return (dispatch) => {
    firedux.init().then(res => {
      if (res) {
        dispatch({ type: 'auth/complete' })
        firedux.watch('Quests').then(() => getQuest())
      }
    })
  }
}

export function getQuest() {
  return (dispatch, getState) => {
    const state = getState()
    let quests = []
    getQuests(state.firedux.data).then(questData => {
      quests = questData
    }).then(() => {
      dispatch({ type: 'quest/set-quest-data', data: quests })
    })
  }
}

function getQuests(data) {
  return new Promise((resolve, reject) => {
    const { Quests } = data
    const quests = firebaseToArray(Quests)
    if (quests.length) resolve(quests)
    else resolve([])
  })
}

export function getDeveloper() {
  return (dispatch, getState) => {
    const state = getState()
    let developers = []
    getDevelopers(state.firedux.data).then(devs => {
      developers = []
      devs.map(developer => {
        setDeveloperData(developers, developer)
      })
    }).then(() => {
      developers.sort((a, b) => { return b.maxSummary.score - a.maxSummary.score });
    }).then(() => {
      dispatch({ type: 'developer/set-developer-data', data: developers })
    })
  }
}

function getDevelopers(data) {
  return new Promise((resolve, reject) => {
    const { Developer } = data
    const developers = firebaseToArray(Developer)
    if (developers.length) resolve(developers)
  })
}

function setDeveloperData(developers, developer) {
  if (developer.summary) {
    let arraySummary = developer.summary;
    if (!(arraySummary[arraySummary.length - 1].isDone)) {
      arraySummary.splice(arraySummary.length - 1, 1)
    }
    if (arraySummary.length) {
      let maxScore = Math.max.apply(Math, arraySummary.map(summary => { return summary.score }))
      let maxSummary = arraySummary.find(summary => { return summary.score == maxScore; })
      developers.push({
        id: developer.id,
        profile: developer.profile,
        maxSummary: maxSummary
      })
    }
  }
}
