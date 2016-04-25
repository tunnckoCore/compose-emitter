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
 * var ComposeEmitter = require('compose-emitter').ComposeEmitter
 * var Emitter = require('component-emitter')
 *
 * var ee = new ComposeEmitter({
 *   emitter: new Emitter()
 * })
 *
 * ee
 *   .create('on')('foo', console.log) // => 1, 2, 3
 *   .create('emit')('foo', 1, 2, 3)
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
  this.options = isObject(options)
    ? options
    : isObject(this.options) ? this.options : {}
}

/**
 * > Extend your application with ComposeEmitter static and prototype methods.
 * See [static-extend][] or [tunnckoCore/app-base](https://github.com/tunnckoCore/app-base)
 * for more info and what's static and prototype methods are added.
 *
 * **Example**
 *
 * ```js
 * var ComposeEmitter = require('compose-emitter').ComposeEmitter
 * var Emitter = require('eventemitter3')
 *
 * function App (options) {
 *    if (!(this instanceof App)) {
 *      return new App(options)
 *    }
 *   ComposeEmitter.call(this, options)
 * }
 *
 * ComposeEmitter.extend(App)
 *
 * App.prototype.on = function on (name, fn, context) {
 *   return this.create('on')(name, fn, context)
 * }
 *
 * App.prototype.once = function once (name, fn, context) {
 *   return this.create('once')(name, fn, context)
 * }
 *
 * App.prototype.off = function off (name, fn, context) {
 *   return this.create('off')(name, fn, context)
 * }
 *
 * App.prototype.emit = function emit () {
 *   return this.create('emit').apply(null, arguments)
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
 * @param {Function} `Parent` The constructor to extend, using [static-extend][].
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
 * var emitter = require('compose-emitter')
 * var Emitter = require('eventemitter3')
 *
 * var on = emitter.create('on', {
 *   context: {a: 'b'},
 *   emitter: new Emitter()
 * })
 * var emit = emitter.create('emit')
 *
 * on('foo', function (a, b) {
 *   console.log('foo:', a, b, this) // => 1, 2, {a: 'b', c: 'd'}
 * }, {c: 'd'})
 *
 * emit('foo', 1, 2)
 * ```
 *
 * @name   .create
 * @param  {String} `type` Name of the emitter method that you want to mirror.
 * @param  {Object} `options` Optionally pass `context` that will be bind to listeners.
 * @return {Function} Method that accept as many arguments as you want or emitter method need.
 * @api public
 */

AppBase.define(ComposeEmitter.prototype, 'create', function create (type, options) {
  if (typeof type !== 'string') {
    throw new TypeError('.create: expect `type` be string')
  }
  // @todo
  var opts = this.options
  var ctx = options ? extend({}, opts.context, options.context) : opts.context
  this.options = options ? extend({}, opts, options) : opts
  this.options.context = ctx

  if (!isObject(this.options.emitter)) {
    throw new TypeError('.create: expect `options.emitter` be extendable object')
  }
  this.define('emitter', this.options.emitter)

  var self = this
  return function onOffEmitOnce (name, fn, context) {
    if (type !== 'on' && type !== 'once' && type !== 'off') {
      self.emitter[type].apply(self.emitter, arguments)
      return self
    }
    self.options.context = context ? extend({}, self.options.context, context) : self.options.context
    self.options.context = isObject(self.options.context) ? self.options.context : self
    self.emitter[type](name, fn, self.options.context)
    return self
  }
})

/**
 * Expose `ComposeEmitter` instance
 * @type {ComposeEmitter}
 * @private
 */

module.exports = new ComposeEmitter()

/**
 * Expose `ComposeEmitter` constructor
 * @type {ComposeEmitter}
 * @private
 */

module.exports.ComposeEmitter = ComposeEmitter
