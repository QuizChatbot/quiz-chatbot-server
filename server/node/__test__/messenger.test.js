const messenger = require('../messenger')

//calculateDuration = (startedAt, timeOfPostback)
describe('send text message via facebook', () => {
    test('send text message success', () => {
        messenger.sendTextMessage('123', 'Hello')
    })
})