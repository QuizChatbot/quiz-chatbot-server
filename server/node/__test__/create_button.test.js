jest.mock('../firebase')
jest.mock('../utill_array')

const createButton = require('../create_button')
const firebase = require('../firebase')
const utillArray = require('../utill_array')

//createButtonNext (senderID)
describe('create button asked for next question', () => {
    beforeEach(async () => {
        jest.resetAllMocks()
    })
    it('create next question button', () => {
        let buttonMessage = createButton.createButtonNext('123')
        let messageData = {
            recipient: {
                id: '123'
            },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "button",
                        text: "Wanna play next question?",
                        buttons: [{
                            type: "postback",
                            title: "Yes",
                            payload: JSON.stringify({ "nextQuestion": true })
                        }, {
                            type: "postback",
                            title: "No",
                            payload: JSON.stringify({ "nextQuestion": false })
                        }]
                    }
                }
            }
        }
        expect(buttonMessage).toMatchObject(messageData)
    })
})

//createButtonNextRound (senderID)
describe('create Button asked for next round', () => {
    beforeEach(async () => {
        jest.resetAllMocks()
    })
    it('create next round button', () => {
        let buttonMessage = createButton.createButtonNextRound('123')
        let messageData = {
            recipient: {
                id: '123'
            },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "button",
                        text: "Do you want to play the next round?",
                        buttons: [{
                            type: "postback",
                            title: "Yes",
                            payload: JSON.stringify({ "nextRound": true })
                        }, {
                            type: "postback",
                            title: "No",
                            payload: JSON.stringify({ "nextRound": false })
                        }]
                    }
                }
            }
        }
        expect(buttonMessage).toMatchObject(messageData)
    })
})

//createButtonCategory (senderID)
describe('create Button asked for category', () => {
    beforeEach(async () => {
        jest.resetAllMocks()
    })
    it('create categories button ', () => {
        let buttonMessage = createButton.createButtonCategory('123')
        let messageData = {
            recipient: {
                id: '123'
            },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "button",
                        text: "Choose category, please.",
                        buttons: [{
                            type: "postback",
                            title: "12 Factors App",
                            payload: JSON.stringify({ "category": "12 factors app" })
                        }, {
                            type: "postback",
                            title: "Design Patterns",
                            payload: JSON.stringify({ "category": "design patterns" })
                        }, {
                            type: "postback",
                            title: "Rules of Thumb",
                            payload: JSON.stringify({ "category": "rules of thumb" })
                        }]
                    }
                }
            }
        }
        expect(buttonMessage).toMatchObject(messageData)
    })
})

//createButtonMessageWithButtons (senderID, buttons)
describe('create button message with buttons', () => {
    beforeEach(async () => {
        jest.resetAllMocks()
    })

    it('create button message', async () => {
        let buttons = {
            buttons:
            [{
                type: 'postback',
                title: 'cat',
                payload: '{"answer":"cat","question":"key","point":10}'
            },
            {
                type: 'postback',
                title: 'dog',
                payload: '{"answer":"dog","question":"key","point":10}'
            }
            ],
            subject: "subject",
            question: "question"
        }

        let messageData = {
            recipient: { id: '123' },
            message: {
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: "button",
                        text: "subject" + "\n" + "question",
                        buttons: buttons.buttons
                    }
                }
            }
        }

        let buttonMessage = await createButton.createButtonMessageWithButtons('123', buttons)
        expect(buttonMessage).toMatchObject(messageData)
    })
})

//createButtonFromQuestionId (id)
describe('create button from id', () => {
    beforeEach(async () => {
        jest.resetAllMocks()
    })

    it('create button', async () => {
        let buttons = {
            buttons:
            [{
                type: 'postback',
                title: 'dog',
                payload: '{"answer":"dog","question":"key","point":10}'
            },
            {
                type: 'postback',
                title: 'cat',
                payload: '{"answer":"cat","question":"key","point":10}'
            }
            ],
            subject: "subject",
            question: "question"
        }

        let question = {
            id: '-KoFzviFXhwyqGK2613p',
            choices: ['cat', 'dog'],
            point: 10,
            question: 'question',
            subject: 'subject'
        }

        let choices = ['dog', 'cat']

        firebase.getQuestionFromId.mockImplementation(() => Promise.resolve(question))
        utillArray.shuffleChoices.mockImplementation(() => choices)

        let buttonCreated = await createButton.createButtonFromQuestionId('key')

        expect(firebase.getQuestionFromId).toHaveBeenCalled()
        expect(utillArray.shuffleChoices).toHaveBeenCalled()
        expect(buttonCreated).toEqual(buttons)
    })
})
