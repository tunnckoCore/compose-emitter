# [compose-emitter][author-www-url] [![npmjs.com][npmjs-img]][npmjs-url] [![The MIT License][license-img]][license-url] 

> Fast, lightweight and powerful composition of an EventEmitter with context binding in mind. Pass your emitter instance and context through options and compose on/off/once/emit methods using `.compose` method.

[![code climate][codeclimate-img]][codeclimate-url] [![standard code style][standard-img]][standard-url] [![travis build status][travis-img]][travis-url] [![coverage status][coveralls-img]][coveralls-url] [![dependency status][david-img]][david-url]

This package gives you interface with only single method exposed - `.create`. You should implement the expected methods using flexible `.create` method and passing whatever emitter you want. It's up to you to create your emitter of choice with methods of choice. This just gives you the flexibility and context binding.

## Install
```
npm i compose-emitter --save
```

## Usage
> For more use-cases see the [tests](./test.js)

```js
const emitter = require('compose-emitter')
// or get constructor
const ComposeEmitter = require('compose-emitter').ComposeEmitter
```

### [ComposeEmitter](index.js#L37)
> Initialize ComposeEmitter with `options`. Pass your EventEmitter instance and optionally pass `options.context` to bind to listeners.

**Params**

* `options` **{Object}**: Pass event emitter instance to `options.emitter`.    

**Example**

```js
var ComposeEmitter = require('compose-emitter').ComposeEmitter
var Emitter = require('component-emitter')

var ee = new ComposeEmitter({
  emitter: new Emitter()
})

ee
  .create('on')('foo', console.log) // => 1, 2, 3
  .create('emit')('foo', 1, 2, 3)
```

### [ComposeEmitter.extend](index.js#L105)
> Extend your application with ComposeEmitter static and prototype methods. See [static-extend][] or [tunnckoCore/app-base](https://github.com/tunnckoCore/app-base) for more info and what's static and prototype methods are added.

**Params**

* `Parent` **{Function}**: The constructor to extend, using [static-extend][].    

**Example**

```js
var ComposeEmitter = require('compose-emitter').ComposeEmitter
var Emitter = require('eventemitter3')

function App (options) {
   if (!(this instanceof App)) {
     return new App(options)
   }
  ComposeEmitter.call(this, options)
}

ComposeEmitter.extend(App)

App.prototype.on = function on (name, fn, context) {
  return this.create('on')(name, fn, context)
}

App.prototype.once = function once (name, fn, context) {
  return this.create('once')(name, fn, context)
}

App.prototype.off = function off (name, fn, context) {
  return this.create('off')(name, fn, context)
}

App.prototype.emit = function emit () {
  return this.create('emit').apply(null, arguments)
}

var app = new App({
  context: {foo: 'bar'},
  emitter: new Emitter()
})

app
  .on('foo', function (a) {
    console.log('foo:', a, this) // => 123, {foo: 'bar'}
  })
  .once('bar', function (b) {
    console.log('bar:', b) // => 456
  })
  .emit('foo', 123)
  .emit('bar', 456)
  .emit('bar', 789)
```

### [.create](index.js#L138)
> Compose different `type` of emitter methods. You can use this to create the usual `.on`, `.emit` and other methods. Pass as `type` name of the method that your emitter have and optional `options` to pass context for the listeners.

**Params**

* `type` **{String}**: Name of the emitter method that you want to mirror.    
* `options` **{Object}**: Optionally pass `context` that will be bind to listeners.    
* `returns` **{Function}**: Method that accept as many arguments as you want or emitter method need.  

**Example**

```js
var emitter = require('compose-emitter')
var Emitter = require('eventemitter3')

var on = emitter.create('on', {
  context: {a: 'b'},
  emitter: new Emitter()
})
var emit = emitter.create('emit')

on('foo', function (a, b) {
  console.log('foo:', a, b, this) // => 1, 2, {a: 'b', c: 'd'}
}, {c: 'd'})

emit('foo', 1, 2)
```

## Related
* [component-emitter](https://www.npmjs.com/package/component-emitter): Event emitter | [homepage](https://github.com/component/emitter)
* [define-property](https://www.npmjs.com/package/define-property): Define a non-enumerable property on an object. | [homepage](https://github.com/jonschlinkert/define-property)
* [eventemitter3](https://www.npmjs.com/package/eventemitter3): EventEmitter3 focuses on performance while maintaining a Node.js AND browser… [more](https://www.npmjs.com/package/eventemitter3) | [homepage](https://github.com/primus/eventemitter3)
* [static-extend](https://www.npmjs.com/package/static-extend): Adds a static `extend` method to a class, to simplify… [more](https://www.npmjs.com/package/static-extend) | [homepage](https://github.com/jonschlinkert/static-extend)

## Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/tunnckoCore/compose-emitter/issues/new).  
But before doing anything, please read the [CONTRIBUTING.md](./CONTRIBUTING.md) guidelines.

## [Charlike Make Reagent](http://j.mp/1stW47C) [![new message to charlike][new-message-img]][new-message-url] [![freenode #charlike][freenode-img]][freenode-url]

[![tunnckoCore.tk][author-www-img]][author-www-url] [![keybase tunnckoCore][keybase-img]][keybase-url] [![tunnckoCore npm][author-npm-img]][author-npm-url] [![tunnckoCore twitter][author-twitter-img]][author-twitter-url] [![tunnckoCore github][author-github-img]][author-github-url]

[static-extend]: https://github.com/jonschlinkert/static-extend

[npmjs-url]: https://www.npmjs.com/package/compose-emitter
[npmjs-img]: https://img.shields.io/npm/v/compose-emitter.svg?label=compose-emitter

[license-url]: https://github.com/tunnckoCore/compose-emitter/blob/master/LICENSE
[license-img]: https://img.shields.io/badge/license-MIT-blue.svg

[codeclimate-url]: https://codeclimate.com/github/tunnckoCore/compose-emitter
[codeclimate-img]: https://img.shields.io/codeclimate/github/tunnckoCore/compose-emitter.svg

[travis-url]: https://travis-ci.org/tunnckoCore/compose-emitter
[travis-img]: https://img.shields.io/travis/tunnckoCore/compose-emitter/master.svg

[coveralls-url]: https://coveralls.io/r/tunnckoCore/compose-emitter
[coveralls-img]: https://img.shields.io/coveralls/tunnckoCore/compose-emitter.svg

[david-url]: https://david-dm.org/tunnckoCore/compose-emitter
[david-img]: https://img.shields.io/david/tunnckoCore/compose-emitter.svg

[standard-url]: https://github.com/feross/standard
[standard-img]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg

[author-www-url]: http://www.tunnckocore.tk
[author-www-img]: https://img.shields.io/badge/www-tunnckocore.tk-fe7d37.svg

[keybase-url]: https://keybase.io/tunnckocore
[keybase-img]: https://img.shields.io/badge/keybase-tunnckocore-8a7967.svg

[author-npm-url]: https://www.npmjs.com/~tunnckocore
[author-npm-img]: https://img.shields.io/badge/npm-~tunnckocore-cb3837.svg

[author-twitter-url]: https://twitter.com/tunnckoCore
[author-twitter-img]: https://img.shields.io/badge/twitter-@tunnckoCore-55acee.svg

[author-github-url]: https://github.com/tunnckoCore
[author-github-img]: https://img.shields.io/badge/github-@tunnckoCore-4183c4.svg

[freenode-url]: http://webchat.freenode.net/?channels=charlike
[freenode-img]: https://img.shields.io/badge/freenode-%23charlike-5654a4.svg

[new-message-url]: https://github.com/tunnckoCore/ama
[new-message-img]: https://img.shields.io/badge/ask%20me-anything-green.svg

