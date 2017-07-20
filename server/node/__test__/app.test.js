jest.mock('../messenger')
jest.mock('../firebase')
jest.mock('../utill_array')
jest.mock('../create_button')
jest.mock('../summary')

const app = require('../app')
const { load, User } = require('../models/user')
const messenger = require('../messenger')
const firebase = require('../firebase')
const utillArray = require('../utill_array')
const createButton = require('../create_button')
const summary = require('../summary')


//handleReceivedMessage(user, messageText)
describe('Handle recieved message', () => {
    let api

    beforeEach(async () => {
        jest.resetAllMocks()
        // messenger.sendTextMessage.mockClear()
        // messenger.callSendAPI.mockClear()
    })

    beforeEach(async () => {
        let keys = ['key1', 'key2']
        const getState = jest.fn()
        const setState = jest.fn()
        api = { getState, setState }
    })



    it('receive message that is not OK after receive welcome message', async () => {
        const user = new User('123', { state: 'playing', welcomed: true }, api)
        app.handleReceivedMessage(user, "Hello")
        expect(messenger.sendTextMessage).toHaveBeenCalledWith(user.senderID, "บอกให้พิมพ์ OK ไง เมี๊ยว")

    })

    it('receive message OK', async () => {
        const user = new User('123', { state: 'playing', welcomed: true }, api)
        let userDetail = {
            first_name: 'Clark',
            last_name: 'Kent'
        }
        expect.assertions(2)
        messenger.getUserDetail.mockImplementation(() => Promise.resolve(userDetail))

        await app.handleReceivedMessage(user, "OK")
        expect(messenger.getUserDetail).toHaveBeenCalledWith(user.senderID)
        expect(firebase.saveUserToFirebase).toHaveBeenCalledWith(user.senderID, userDetail)
    })

    it('send welcome to QuizBot when talk with bot 1st time', async () => {
        const user = new User('123', { state: 'initial', welcomed: false }, api)
        let userDetail = {
            first_name: 'Clark',
            last_name: 'Kent'
        }
        messenger.getUserDetail.mockImplementation(() => Promise.resolve(userDetail))
        await app.handleReceivedMessage(user, "Hello")
        // expect.assertions(4)
        expect(messenger.getUserDetail).toHaveBeenCalledWith(user.senderID)
        expect(user.welcome()).resolves.toHaveBeenCalled()
        expect(user.choosing()).resolves.toHaveBeenCalled()
        expect(user.state.state).toBe('choosing')
        expect(user.state.welcomed).toBeTruthy()
        expect(messenger.sendTextMessage).toHaveBeenCalled()
    })

    //not sure
    it('already chat with bot, then wait for question to be asked -> answers for each question is defined', async () => {
        const user = new User('123', { state: 'playing', welcomed: true, round: 2 }, api)
        let userDetail = {
            first_name: 'Clark',
            last_name: 'Kent'
        }
        let keysDone = ['k1', 'k2']
        let choices = ['c1', 'c2', 'c3']

        // expect.assertions(7)

        messenger.getUserDetail.mockImplementation(() => Promise.resolve(userDetail))
        firebase.getQuestionDone.mockImplementation((senderID, round) => Promise.resolve(keysDone))
        firebase.getAllAnswersFromQuestion.mockImplementation((id) => Promise.resolve(choices))

        await app.handleReceivedMessage(user, "OK")

        expect(messenger.getUserDetail).toHaveBeenCalledWith(user.senderID)
        expect(firebase.getQuestionDone).resolves.toHaveBeenCalledWith(user.senderID, user.state.round)
        expect(user.removeKeysDone()).resolves.toHaveBeenCalledWith(keysDone)
        expect(utillArray.shuffleKeyFromQuestions).toHaveBeenCalled()

        expect(user.startQuiz()).resolves.toHaveBeenCalled()
        expect(firebase.getAllAnswersFromQuestion).toHaveBeenCalled()

        let answersFromEachQuestion = await firebase.getAllAnswersFromQuestion('Qkey')
        // expect(user.state.answersForEachQuestion).toEqual(choices)

        if (answersFromEachQuestion) {
            expect(firebase.getAllAnswersFromQuestion).resolves.toEqual(['c1', 'c2', 'c3'])
        }

        expect(createButton.createButtonFromQuestionId).toHaveBeenCalled()
        expect(createButton.createButtonMessageWithButtons).toHaveBeenCalled()
        expect(utillArray.getMoment).toHaveBeenCalled()
        expect(messenger.callSendAPI).toHaveBeenCalled()
    })

    //not sure 
    it('already chat with bot, then wait for question to be asked -> answers for each question ERROR!', async () => {
        const user = new User('123', { state: 'playing', welcomed: true, round: 2 }, api)
        let userDetail = {
            first_name: 'Clark',
            last_name: 'Kent'
        }
        let keysDone = ['k1', 'k2']
        let choices = ['c1', 'c2', 'c3']

        expect.assertions(6)

        messenger.getUserDetail.mockImplementation(() => Promise.resolve(userDetail))
        firebase.getQuestionDone.mockImplementation((senderID, round) => Promise.resolve(keysDone))
        firebase.getAllAnswersFromQuestion.mockImplementation((id) => null)

        await app.handleReceivedMessage(user, "OK")

        expect(messenger.getUserDetail).toHaveBeenCalledWith(user.senderID)
        expect(firebase.getQuestionDone).resolves.toHaveBeenCalledWith(user.senderID, user.state.round)
        expect(user.removeKeysDone()).resolves.toHaveBeenCalledWith(keysDone)
        expect(utillArray.shuffleKeyFromQuestions).toHaveBeenCalled()

        expect(user.startQuiz()).resolves.toHaveBeenCalled()
        expect(firebase.getAllAnswersFromQuestion).toHaveBeenCalled()

        let answersFromEachQuestion = await firebase.getAllAnswersFromQuestion('Qkey')

        expect(createButton.createButtonFromQuestionId).not.toHaveBeenCalled()
        expect(createButton.createButtonMessageWithButtons).not.toHaveBeenCalled()
        expect(messenger.callSendAPI).not.toHaveBeenCalled()
    })


    it('already chat with bot, user is choosing question category', async () => {
        const user = new User('123', { state: 'choosing', welcomed: true, round: 0 }, api)
        let userDetail = {
            first_name: 'Clark',
            last_name: 'Kent'
        }
        let keysDone = ['k1', 'k2']
        let choices = ['c1', 'c2', 'c3']

        expect.assertions(4)

        messenger.getUserDetail.mockImplementation(() => Promise.resolve(userDetail))
        firebase.getQuestionDone.mockImplementation((senderID, round) => Promise.resolve(keysDone))
        firebase.getAllAnswersFromQuestion.mockImplementation((id) => Promise.resolve(choices))

        await app.handleReceivedMessage(user, "OK")

        expect(messenger.getUserDetail).toHaveBeenCalledWith(user.senderID)
        expect(firebase.saveUserToFirebase).toHaveBeenCalledWith(user.senderID, userDetail)
        await expect(createButton.createButtonCategory).toHaveBeenCalledWith(user.senderID)
        expect(messenger.callSendAPI).toHaveBeenCalled()
    })

    it('already chat with bot, user is choosing question category after finished previous round', async () => {
        const user = new User('123', { state: 'finish', welcomed: true, round: 0 }, api)
        let userDetail = {
            first_name: 'Clark',
            last_name: 'Kent'
        }
        let keysDone = ['k1', 'k2']
        let choices = ['c1', 'c2', 'c3']

        expect.assertions(4)

        messenger.getUserDetail.mockImplementation(() => Promise.resolve(userDetail))
        firebase.getQuestionDone.mockImplementation((senderID, round) => Promise.resolve(keysDone))
        firebase.getAllAnswersFromQuestion.mockImplementation((id) => Promise.resolve(choices))

        await app.handleReceivedMessage(user, "OK")

        expect(messenger.getUserDetail).toHaveBeenCalledWith(user.senderID)
        expect(firebase.saveUserToFirebase).toHaveBeenCalledWith(user.senderID, userDetail)
        await expect(createButton.createButtonCategory).toHaveBeenCalledWith(user.senderID)
        expect(messenger.callSendAPI).toHaveBeenCalled()
    })

})

//checkAnswer(payload, answerForEachQuestion)
//the correct answer is answerForEachQuestion
describe('check answer', () => {
    it('answer correct', () => {
        let result = app.checkAnswer({ point: 10, answer: 'answerRight' }, ['answerRight', 'wrong1', 'wrong2'])
        expect(result).toBeTruthy()
    })

    it('answer wrong', () => {
        let result = app.checkAnswer({ point: 10, answer: 'answerWrong' }, ['answerRight', 'answerWrong', 'wrong2'])
        expect(result).toBeFalsy()
    })

})


//getKeys()
describe('get keys of all questions', () => {
    beforeEach(async () => {
        jest.resetAllMocks()
    })
    it('get keys success', async () => {
        let keys = ['k1', 'k2', 'k3']
        firebase.getAllQuestionKeys.mockImplementation(() => Promise.resolve(keys))
        let test = await app.getKeys()
        expect(firebase.getAllQuestionKeys).toHaveBeenCalled()
        expect(test).toEqual(['k1', 'k2', 'k3'])
    })

    it('get keys failed', async () => {
        let err = 'failed'
        firebase.getAllQuestionKeys.mockImplementation(() => Promise.reject(err))
        await expect(app.getKeys()).rejects.toBeDefined()

    })
})


//nextRoud(user, numberOfQuestions, done)
describe('increase round and send button ask for next round', () => {

    beforeEach(async () => {
        jest.resetAllMocks()
    })

    beforeEach(async () => {
        let keys = ['key1', 'key2']
        const getState = jest.fn()
        const setState = jest.fn()
        api = { getState, setState }
    })

    it('round increase', () => {
        const user = new User('123', { state: 'finish', welcomed: true, round: 2 }, api)
        app.nextRound(user, 15, 15)
        expect(user.setRound).resolves.toHaveBeenCalledWith(3)
        console.log('______round after increase ', user.state.round)
        expect(createButton.createButtonNextRound).toHaveBeenCalledWith(user.senderID)
        expect(messenger.callSendAPI).toHaveBeenCalled()
    })

    it('round not increase', () => {
        const user = new User('123', { state: 'finish', welcomed: true, round: 2 }, api)
        app.nextRound(user, 15, 7)
        expect(user.setRound).resolves.not.toHaveBeenCalled()
        expect(createButton.createButtonNextRound).toHaveBeenCalledWith(user.senderID)
        expect(messenger.callSendAPI).toHaveBeenCalled()
    })
})

//startNextRound(user)
describe('start next round and start ask questions', () => {

    beforeEach(async () => {
        jest.resetAllMocks()
    })

    beforeEach(async () => {
        let keys = ['key1', 'key2']
        const getState = jest.fn()
        const setState = jest.fn()
        api = { getState, setState }
    })

    it('start next round, answerForEachQuestion not null ', async () => {
        const user = new User('123', { state: 'finish', welcomed: true, round: 2 }, api)
        let answers = ['a1', 'a2', 'a3']
        firebase.getAllQuestionKeys.mockImplementation(() => Promise.resolve(['k1', 'k2', 'k3']))
        firebase.getAllAnswersFromQuestion.mockImplementation((id) => Promise.resolve(['a1', 'a2', 'a3']))
        utillArray.shuffleKeyFromQuestions.mockImplementation((keys) => keys[0])

        await app.startNextRound(user)
        let keys = await app.getKeys()


        expect(app.getKeys()).resolves.toHaveBeenCalled()
        expect(user.nextRound()).resolves.toHaveBeenCalled()
        expect(utillArray.shuffleKeyFromQuestions).toHaveBeenCalledWith(keys)

        let shuffled = utillArray.shuffleKeyFromQuestions(keys)

        let answersTest = await expect(firebase.getAllAnswersFromQuestion).toHaveBeenCalledWith(shuffled)
        console.log("_____", answersTest)
        await expect(createButton.createButtonFromQuestionId).toHaveBeenCalledWith(shuffled)
        await expect(createButton.createButtonMessageWithButtons).toHaveBeenCalled()
        expect(messenger.callSendAPI).toHaveBeenCalled()
    })

    it('start next round, answerForEachQuestion not null ', async () => {
        const user = new User('123', { state: 'finish', welcomed: true, round: 2 }, api)
        let answers = ['a1', 'a2', 'a3']
        firebase.getAllQuestionKeys.mockImplementation(() => Promise.resolve(['k1', 'k2', 'k3']))
        firebase.getAllAnswersFromQuestion.mockImplementation((id) => null)
        utillArray.shuffleKeyFromQuestions.mockImplementation((keys) => keys[0])

        await app.startNextRound(user)
        let keys = await app.getKeys()


        expect(app.getKeys()).resolves.toHaveBeenCalled()
        expect(user.nextRound()).resolves.toHaveBeenCalled()
        expect(utillArray.shuffleKeyFromQuestions).toHaveBeenCalledWith(keys)

        let shuffled = utillArray.shuffleKeyFromQuestions(keys)

        await expect(firebase.getAllAnswersFromQuestion).toHaveBeenCalledWith(shuffled)

        await expect(createButton.createButtonFromQuestionId).not.toHaveBeenCalledWith(shuffled)
        await expect(createButton.createButtonMessageWithButtons).not.toHaveBeenCalled()
        expect(utillArray.getMoment).not.toHaveBeenCalled()
        expect(messenger.callSendAPI).not.toHaveBeenCalled()
    })
})


//nextQuestion(user)
describe('check next question', () => {

    beforeEach(async () => {
        jest.resetAllMocks()
    })

    beforeEach(async () => {
        let keys = ['key1', 'key2']
        const getState = jest.fn()
        const setState = jest.fn()
        api = { getState, setState }
    })

    it('still have questions not answered => answersForEachQuestion is not null', async () => {
        const user = new User('123', { state: 'playing', welcomed: true, round: 2, done: 4, keysLeftForThatUser: ['kq1', 'kq2'] }, api)

        firebase.getNumberOfQuestions.mockImplementation(() => Promise.resolve(10))
        firebase.getAllAnswersFromQuestion.mockImplementation((id) => Promise.resolve(['a1', 'a2', 'a3']))
        utillArray.shuffleKeyFromQuestions.mockImplementation((keys) => keys[0])

        await app.nextQuestion(user)

        expect(firebase.getNumberOfQuestions).toHaveBeenCalled()
        expect(utillArray.shuffleKeyFromQuestions).toHaveBeenCalledWith(user.state.keysLeftForThatUser)
        let shuffled = utillArray.shuffleKeyFromQuestions(user.state.keysLeftForThatUser)

        expect(firebase.getAllAnswersFromQuestion).toHaveBeenCalled()

        let answersTest = await firebase.getAllAnswersFromQuestion(10)

        expect(createButton.createButtonFromQuestionId).toHaveBeenCalled()
        expect(createButton.createButtonMessageWithButtons).toHaveBeenCalled()
        expect(messenger.callSendAPI).toHaveBeenCalled()
    })

    it('still have questions not answered => answersForEachQuestion is null', async () => {
        const user = new User('123', { state: 'playing', welcomed: true, round: 2, done: 4, keysLeftForThatUser: ['kq1', 'kq2'] }, api)

        firebase.getNumberOfQuestions.mockImplementation(() => Promise.resolve(10))
        firebase.getAllAnswersFromQuestion.mockImplementation((id) => null)
        utillArray.shuffleKeyFromQuestions.mockImplementation((keys) => keys[0])

        await app.nextQuestion(user)

        expect(firebase.getNumberOfQuestions).toHaveBeenCalled()
        expect(utillArray.shuffleKeyFromQuestions).toHaveBeenCalledWith(user.state.keysLeftForThatUser)
        let shuffled = utillArray.shuffleKeyFromQuestions(user.state.keysLeftForThatUser)

        expect(firebase.getAllAnswersFromQuestion).toHaveBeenCalled()

        let answersTest = await firebase.getAllAnswersFromQuestion(10)

        expect(createButton.createButtonFromQuestionId).not.toHaveBeenCalled()
        expect(createButton.createButtonMessageWithButtons).not.toHaveBeenCalled()
        expect(utillArray.getMoment).not.toHaveBeenCalled()
        expect(messenger.callSendAPI).not.toHaveBeenCalled()
    })

    it('no question left', async () => {
        const user = new User('123', { state: 'playing', welcomed: true, round: 2, done: 4, keysLeftForThatUser: ['kq1', 'kq2'] }, api)

        firebase.getNumberOfQuestions.mockImplementation(() => Promise.resolve(10))
        firebase.getAllAnswersFromQuestion.mockImplementation((id) => null)
        firebase.getGrade.mockImplementation((id, round) => Promise.resolve('A+'))
        utillArray.shuffleKeyFromQuestions.mockImplementation(() => null)

        await app.nextQuestion(user)

        expect(firebase.getNumberOfQuestions).toHaveBeenCalled()
        expect(utillArray.shuffleKeyFromQuestions).toHaveBeenCalledWith(user.state.keysLeftForThatUser)
        let shuffled = utillArray.shuffleKeyFromQuestions(user.state.keysLeftForThatUser)
        expect(firebase.getGrade).toHaveBeenCalledWith(user.senderID, user.state.round)
        expect(messenger.sendTextMessage).toHaveBeenCalledTimes(2)
        expect(messenger.sendTextMessage).toHaveBeenCalledWith(user.senderID, "Finish!")
        expect(user.finish()).resolves.toHaveBeenCalled()


        expect(createButton.createButtonFromQuestionId).not.toHaveBeenCalled()
        expect(createButton.createButtonMessageWithButtons).not.toHaveBeenCalled()
        expect(utillArray.getMoment).not.toHaveBeenCalled()

    })

})

//not done
//handleReceivedPostback (user, payloadObj, timeOfPostback)
describe('handle when received postback', () => {
    let api
    beforeEach(async () => {
        jest.resetAllMocks()
    })

    beforeEach(async () => {
        let keys = ['key1', 'key2']
        const getState = jest.fn()
        const setState = jest.fn()
        api = { getState, setState }
    })

    it('user play next round', async () => {
        const user = new User('123', { state: 'playing', welcomed: true, round: 2 }, api)
        const payloadObj = { nextRound: true }
        const timeOfPostback = 1499167085389

        app.handleReceivedPostback(user, payloadObj, timeOfPostback)
        await expect(firebase.getNumberOfQuestions).toHaveBeenCalled()
        expect(messenger.sendTextMessage).toHaveBeenCalledWith(user.senderID, "Next Round!")
    })

    it('user does not play next round', async () => {
        const user = new User('123', { state: 'playing', welcomed: true, round: 2 }, api)
        const payloadObj = { nextRound: false }
        const timeOfPostback = 1499167085389

        app.handleReceivedPostback(user, payloadObj, timeOfPostback)
        await expect(firebase.getNumberOfQuestions).toHaveBeenCalled()
        expect(user.finish()).resolves.toHaveBeenCalled()
        expect(user.state.state).toBe("finish")
        expect(messenger.sendTextMessage).toHaveBeenCalledTimes(2)
    })

    it('user play next question', async () => {
        const user = new User('123', { state: 'playing', welcomed: true, round: 2 }, api)
        const payloadObj = { nextQuestion: true }
        const timeOfPostback = 1499167085389

        app.handleReceivedPostback(user, payloadObj, timeOfPostback)
        await expect(firebase.getNumberOfQuestions).toHaveBeenCalled()
    })

    it('user does not play next question', async () => {
        const user = new User('123', { state: 'playing', welcomed: true, round: 2 }, api)
        const payloadObj = { nextQuestion: false }
        const timeOfPostback = 1499167085389

        app.handleReceivedPostback(user, payloadObj, timeOfPostback)
        await expect(firebase.getNumberOfQuestions).toHaveBeenCalled()
        expect(user.pause()).resolves.toHaveBeenCalled()
        expect(user.state.state).toBe("pause")
        expect(messenger.sendTextMessage).toHaveBeenCalledTimes(2)
    })

    it('user choose 12 factors app', async () => {
        const user = new User('123', { state: 'choosing', welcomed: true, round: 2 }, api)
        const payloadObj = { category: "12 factors app" }
        const timeOfPostback = 1499167085389

        await app.handleReceivedPostback(user, payloadObj, timeOfPostback)

        await expect(firebase.getNumberOfQuestions).toHaveBeenCalled()
        expect(user.playing()).resolves.toHaveBeenCalled()
        expect(user.state.state).toBe('playing')
        expect(user.chooseCategory()).resolves.toHaveBeenCalled()
        //  expect(user.state.category).toBe('12 factors app')
        expect(messenger.sendTextMessage).toHaveBeenCalledTimes(1)
    })

    it('user choose design patterns', async () => {
        const user = new User('123', { state: 'choosing', welcomed: true, round: 2 }, api)
        const payloadObj = { category: "design patterns" }
        const timeOfPostback = 1499167085389

        app.handleReceivedPostback(user, payloadObj, timeOfPostback)

        await expect(firebase.getNumberOfQuestions).toHaveBeenCalled()
        expect(user.playing()).resolves.toHaveBeenCalled()
        expect(user.state.state).toBe('playing')
        expect(user.chooseCategory()).resolves.toHaveBeenCalled()
        // expect(user.state.category).toBe('design patterns')
        expect(messenger.sendTextMessage).toHaveBeenCalledTimes(1)
    })

    it('normal postback', async () => {
        const user = new User('123', { state: 'playing', welcomed: true, round: 2 }, api)
        const payloadObj = {
            answer: 'lol',
            question: 'Hello',
            point: 10
        }
        const timeOfPostback = 1499167085389

        firebase.getNumberOfQuestions.mockImplementation(() => 10)
        utillArray.calculateDuration.mockImplementation((start, timePostback) => 5000)

        app.handleReceivedPostback(user, payloadObj, timeOfPostback)
        await expect(firebase.getNumberOfQuestions).toHaveBeenCalled()
        let num = firebase.getNumberOfQuestions()

        expect(user.doneQuestion()).resolves.toHaveBeenCalled()

        // expect(utillArray.calculateDuration).toHaveBeenCalledWith('2017-07-04T18:08:49+07:00', timeOfPostback)
        // expect(summary.calculateTotalScore).toHaveBeenCalledWith(num)
        // expect(summary.calculateScoreForThatQuestion).toHaveBeenCalled()
        // expect(summary.calculateGrade).toHaveBeenCalled()
        // await expect(firebase.getQuestionDone).toHaveBeenCalled()
        //   expect(summary.prepareSummary).toHaveBeenCalled()


    })


})




