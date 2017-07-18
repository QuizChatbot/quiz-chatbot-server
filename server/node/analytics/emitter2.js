//Singleton
//JS style
const mitt = require('mitt')

const emitter = new mitt()

function onFoo(payload) {
    console.log('foo', payload)
}

function emit(func, payload) {
    emitter.emit(func, payload)
}

emitter.on('foo', onFoo)

module.exports = { emit }
