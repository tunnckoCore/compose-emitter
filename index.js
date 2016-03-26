/*!
 * compose-emitter <https://github.com/tunnckoCore/compose-emitter>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var extend = require('extend-shallow')
var AppBase = require('app-base').AppBase

function ComposeEmitter (options) {
  if (!(this instanceof ComposeEmitter)) {
    return new ComposeEmitter(options)
  }
  AppBase.call(this)
  this.options = options || {}
  if (!this.options.emitter) {
    throw new TypeError('ComposeEmitter: expect `options.emitter` to be passed')
  }
  this.define('emitter', this.options.emitter)
}

AppBase.extend(ComposeEmitter)
AppBase.define(ComposeEmitter.prototype, 'composeListener', function composeListener (type, options) {
  if (typeof type !== 'string') {
    throw new TypeError('.composeListener expect `type` be string')
  }
  var self = this
  self.options = options ? extend(self.options, options) : self.options

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
