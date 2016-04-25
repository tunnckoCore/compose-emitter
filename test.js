/*!
 * compose-emitter <https://github.com/tunnckoCore/compose-emitter>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

var test = require('assertit')
var emitter = require('./index')
var ComposeEmitter = require('./index').ComposeEmitter
var Emitter = require('eventemitter3')

test('should throw TypeError if not options.emitter not passed', function (done) {
  function fixture () {
    emitter.create('on')
  }
  test.throws(fixture, TypeError)
  test.throws(fixture, /expect `options.emitter` be extendable object/)
  done()
})

test('should throw TypeError if .create `type` not a string', function (done) {
  function fixture () {
    emitter.create(123)
  }
  test.throws(fixture, TypeError)
  test.throws(fixture, /expect `type` be string/)
  done()
})

test('should expose instance of ComposeEmitter on main export', function (done) {
  test.strictEqual(typeof emitter.create, 'function')
  done()
})

test('should expose constructor on module.exports.ComposeEmitter', function (done) {
  test.strictEqual(typeof ComposeEmitter, 'function')
  test.strictEqual(typeof ComposeEmitter().create, 'function')
  done()
})

test('should constructor be singleton class', function (done) {
  var app = new ComposeEmitter()
  var inst = ComposeEmitter()
  test.deepEqual(typeof app, 'object')
  test.deepEqual(typeof inst, 'object')
  test.deepEqual(typeof app.create, 'function')
  test.deepEqual(typeof inst.create, 'function')
  done()
})

test('should have .define and .delegate prototype methods (be AppBase application)', function (done) {
  test.strictEqual(typeof emitter.define, 'function')
  test.strictEqual(typeof emitter.delegate, 'function')
  done()
})

test('should have .define, .delegate and .extend static methods (be AppBase application)', function (done) {
  test.strictEqual(typeof ComposeEmitter.extend, 'function')
  test.strictEqual(typeof ComposeEmitter.define, 'function')
  test.strictEqual(typeof ComposeEmitter.delegate, 'function')
  done()
})

test('should pass emitter instance through `options` and not assign it if not `.create` called', function (done) {
  var app = new ComposeEmitter({
    emitter: new Emitter()
  })
  test.strictEqual(typeof app.emitter, 'undefined')
  done()
})

test('should pass emitter and write it to `.emitter` only when composed `.once` method is called', function (done) {
  var once = emitter.create('once', {
    emitter: new Emitter()
  })
  var app = once('foo', console.log)
  test.strictEqual(typeof app.emitter, 'object')
  done()
})

test('should be able to pass `options.context` to `.create` and bind it to `.on` listeners', function (done) {
  var app = new ComposeEmitter({
    emitter: new Emitter()
  })
  var on = app.create('on', {context: {a: 'b'}})
  var emit = app.create('emit')

  on('foo', function (a, b) {
    test.strictEqual(a, 123)
    test.strictEqual(b, 456)
    test.deepEqual(this, {a: 'b'})
    done()
  })
  emit('foo', 123, 456)
})

test('should be able to pass context to constructor and extend it with that passed to .create', function (done) {
  var foo = new ComposeEmitter({
    context: {aa: 'bb'},
    emitter: new Emitter()
  })
  foo.create('on', {context: {cc: 'dd'}})('qux', function () {
    test.deepEqual(this, {aa: 'bb', cc: 'dd'})
    done()
  }).create('emit')('qux')
})

test('should merge all contexts - from Ctor, from .create and from .on', function (done) {
  var app = new ComposeEmitter({
    context: {a: 'b'}
  })
  var on = app.create('on', {
    context: {c: 'd'},
    emitter: new Emitter()
  })
  on('name', function () {
    test.deepEqual(this, {a: 'b', c: 'd', e: 'f'})
    done()
  }, {e: 'f'}).create('emit')('name')
})
