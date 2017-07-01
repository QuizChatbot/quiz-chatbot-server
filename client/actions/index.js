import firedux, { firebaseApp } from '../store/firedux'
import * as types from '../constants/ActionTypes'
import { firebaseToArray } from '../utils'

export function addQuiz(quiz) {
  return () => {
    firedux.push('Quests', {
      subject: quiz.subject,
      question: quiz.question,
      choices: [quiz.choice_0, quiz.choice_1, quiz.choice_2],
      owner: "5LrhuhQtqDfempxq8B9zGpqiiK42",
      skills: "es6",
      point: 10,
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
    isChoice ? firedux.update(`Quests/${id}/choices`, quiz) : firedux.update(`Quests/${id}`, quiz)
    firedux.update(`Quests/${id}`, { updatedAt: Date() })
  }
}

export function login() {
  return (dispatch) => {
    firedux.login().then(res => {
      dispatch({ type: 'auth/complete' })
    })
  }
}

export function logout() {
  return (dispatch) => {
    firedux.logout().then(res => {
      dispatch({ type: 'auth/fail' })
    })
  }
}

export function init() {
  return (dispatch) => {
    firedux.init().then(res => {
      if (res) {
        dispatch({ type: 'auth/complete' })
      }
    })
  }
}

export function getDeveloper() {
  return (dispatch, getState) => {
    const state = getState()
    let developers = []
    getDevelopers(state.firedux.data).then(devs => {
      developers = []
      devs.map(developer => { setDeveloperData(developers, developer) })
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



export function addTodo(text) {
  return () => {
    firedux.push('todos', {
      completed: false,
      text
    })
  }
}

export function deleteTodo(id) {
  return () => {
    firedux.remove(`todos/${id}`)
  }
}

export function editTodo(id, text) {
  return () => {
    firedux.update(`todos/${id}`, {
      text
    })
  }
}

export function completeTodo(id) {
  return (dispatch, getState) => {
    const state = getState()
    const completed = state.firedux.data.todos[id].completed

    firedux.set(`todos/${id}/completed`, !completed)
  }
}

export function completeAll() {
  return (dispatch, getState) => {
    const state = getState()
    const todos = state.firedux.data.todos

    const areAllMarked = _.values(todos).every(todo => todo.completed)

    _.each(todos, (todo, id) => {
      firedux.set(`todos/${id}/completed`, !areAllMarked)
    })
  }
}

export function clearCompleted() {
  return (dispatch, getState) => {
    const state = getState()
    const todos = state.firedux.data.todos

    _.each(todos, (todo, id) => {
      if (todo.completed) {
        firedux.remove(`todos/${id}`)
      }
    })
  }
}







// export function login(email, password) {
//   return () => {
//     console.log("login start")
//     let credentials = {
//       email: email,
//       password: password,
//       token: "tttttttooooookkkkkkkeeeeeeeennnnnnnn"
//     }
//     console.log("credentials=", credentials)
//     firedux.login(credentials)
//       .then((authData) => {
//         console.log("authData: ", authData)
//       })
//       .catch((error) => {
//         console.log("error: ", error)
//       })
//     console.log("success ")
//   }
// }

// export function login(prov) {
//   return (dispatch, getState) => {
//     console.log("firedux = ", firedux)
//     let provider
//     switch (prov) {
//       case 'facebook':
//         provider = new firedux.auth.FacebookAuthProvider();
//         break;
//       default:
//         provider = null;
//         break;
//     }
//     firedux.auth().signInWithPopup(provider).then(function (authData) {
//       // localStorage.setItem('FIREBASE_TOKEN', (authData.credential.accessToken || authData.user.refreshToken))
//       // that.authData = authData
//       // dispatch({ type: 'FIREBASE_LOGIN', error: null, authData: authData.user })
//       // resolve(authData)
//       let uid = authData.user.uid
//       firedux.push(`users`, {
//         uid: uid
//       })

//       console.log("authData = ", authData)
//     })
//   }
// }