const mitt = require('mitt')

let emitter = new mitt()

module.exports = emitter


//Singleton
//Java style

// class Emitter {
//     constructor() {
//         let emitter = mitt()
//         this.x = 3
//         emitter.on('foo', this.onFoo.bind(this))
//         this.emitter = emitter
//     }

//     onFoo(payload) {
//         console.log('foo', payload)
//     }

//     emit(func,payload){
//         this.emitter.emit(func, payload)
//     }

// }

// module.exports = new Emitter()