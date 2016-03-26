/*!
 * compose-emitter <https://github.com/tunnckoCore/compose-emitter>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var extend = require('extend-shallow')
var AppBase = require('app-base').AppBase
var isObject = require('is-extendable')

/**
 * > Initialize ComposeEmitter with `options`. Pass your EventEmitter
 * instance and optionally pass `options.context` to bind to listeners.
 *
 * **Example**
 *
 * ```js
 * var ComposeEmitter = require('compose-emitter')
 * var Emitter = require('component-emitter')
 *
 * var ee = new ComposeEmitter({
 *   emitter: new Emitter()
 * })
 *
 * ee
 *   .compose('on')('foo', console.log) // => 1, 2, 3
 *   .compose('emit')('foo', 1, 2, 3)
 * ```
 *
 * @param {Object} `options` Pass event emitter instance to `options.emitter`.
 * @api public
 */

function ComposeEmitter (options) {
  if (!(this instanceof ComposeEmitter)) {
    return new ComposeEmitter(options)
  }
  AppBase.call(this)
  this.options = isObject(options) ? options : {}
  if (!isObject(this.options.emitter)) {
    throw new TypeError('ComposeEmitter: expect `options.emitter` be extendable object')
  }
  this.define('emitter', this.options.emitter)
}

/**
 * > Extend your application with ComposeEmitter static and prototype methods.
 * See [static-extend][] or [tunnckoCore/app-base](https://github.com/tunnckoCore/app-base) for more info.
 *
 * **Example**
 *
 * ```js
 * var ComposeEmitter = require('compose-emitter')
 * var Emitter = require('eventemitter3')
 *
 * function App (options) {
 *    if (!(this instanceof App(options))) {
 *      return new App(options)
 *    }
 *   ComposeEmitter.call(this, options)
 * }
 *
 * ComposeEmitter.extend(App)
 *
 * App.prototype.on = function on (name, fn, context) {
 *   return this.compose('on')(name, fn, context)
 * }
 *
 * App.prototype.once = function once (name, fn, context) {
 *   return this.compose('once')(name, fn, context)
 * }
 *
 * App.prototype.off = function off (name, fn, context) {
 *   return this.compose('off')(name, fn, context)
 * }
 *
 * App.prototype.emit = function emit () {
 *   return this.compose('emit').apply(null, arguments)
 * }
 *
 * var app = new App({
 *   context: {foo: 'bar'},
 *   emitter: new Emitter()
 * })
 *
 * app
 *   .on('foo', function (a) {
 *     console.log('foo:', a, this) // => 123, {foo: 'bar'}
 *   })
 *   .once('bar', function (b) {
 *     console.log('bar:', b) // => 456
 *   })
 *   .emit('foo', 123)
 *   .emit('bar', 456)
 *   .emit('bar', 789)
 * ```
 *
 * @name ComposeEmitter.extend
 * @api public
 */

AppBase.extend(ComposeEmitter)

/**
 * > Compose different `type` of emitter methods. You can use this to create
 * the usual `.on`, `.emit` and other methods. Pass as `type` name of the method
 * that your emitter have and optional `options` to pass context for the listeners.
 *
 * **Example**
 *
 * ```js
 * var ComposeEmitter = require('compose-emitter')
 * var Emitter = require('eventemitter3')
 *
 * var app = new ComposeEmitter({
 *   context: {a: 'b'},
 *   emitter: new Emitter()
 * })
 *
 * app
 *   .compose('on')('foo', function (a, b) {
 *     console.log('foo:', a, b, this) // => 1, 2, {a: 'b', c: 'd'}
 *   }, {c: 'd'})
 *   .compose('emit')('foo', 1, 2)
 * ```
 *
 * @name   .compose
 * @param  {String} `type` Name of the emitter method that you want to mirror.
 * @param  {Object} `options` Optionally pass `context` that will be bind to listeners.
 * @return {Function} Method that accept as many arguments as you want or emitter method need.
 * @api public
 */

AppBase.define(ComposeEmitter.prototype, 'compose', function compose (type, options) {
  if (typeof type !== 'string') {
    throw new TypeError('.compose expect `type` be string')
  }
  var self = this
  self.options = isObject(options) ? extend(self.options, options) : self.options

  return function onOffEmitOnce (name, fn, context) {
    if (type !== 'on' && type !== 'once' && type !== 'off') {
      self.emitter[type].apply(self.emitter, arguments)
      return self
    }
    context = context ? extend(self.options.context, context) : self.options.context
    self.options.context = context || self
    self.emitter[type](name, fn, self.options.context)
    return self
  }
})

module.exports = ComposeEmitter
