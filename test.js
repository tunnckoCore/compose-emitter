/*!
 * compose-emitter <https://github.com/tunnckoCore/compose-emitter>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

var test = require('assertit')
var ComposeEmitter = require('./index').ComposeEmitter
var Emitter = require('eventemitter3')

test('foo bar', function (done) {
  var app = new ComposeEmitter({
    context: {foo: 'bar'},
    emitter: new Emitter()
  })

  app.compose('on')('foo', function (a) {
    test.strictEqual(a, 123)
    test.deepEqual(this, {foo: 'bar'})
    done()
  })
  .compose('emit')('foo', 123)
})

// function foo () {
//   console.log('foo', this)
// }
// function bar () {
//   console.log('bar', this)
// }

// var app = new ComposeEmitter({context: {a: 'b'}})
// app.once('foo', foo, {c: 'd'}).emit('foo').emit('foo') // => 'foo' once
// app.on('foo', foo).on('foo', foo).emit('foo') // => 'foo' twice
// app.on('foo', foo).off('foo', foo).emit('foo') // => nothing
// app.on('foo', foo).on('bar', bar).off().emit() // => nothing
// app.on('foo', foo).on('bar', bar).off('foo').emit() // => 'bar'
// app.on('foo', foo).on('bar', bar).off('foo').emit('foo') // => nothing
// app.on('foo', foo).on('bar', bar).off().emit('foo') // => returns this
// app.on('foo', foo).emit('abc') // returns this

  // .on('foo', function () {
  //   console.log('foo1')
  // })
  // .on('foo', function () {
  //   console.log('foo2')
  // })
  // .emit('foo')
  // .emit('foo')
