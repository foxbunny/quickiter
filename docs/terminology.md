# Iterator-related terms

## Iterators
 
Objects that conform to the ECMAScript 2015 
[iterator protocol](https://mzl.la/2HACVDf).

They have a `next()` method that returns an object of the 
`{ done: Boolean, value: Any }` shape. 

This is a simple iterator:

```javascript
const countDown = {
  count: 12,
  next () {
    if (this.count === 0) {
      return { done: true }
    } else {
      return { done: false, value: --this.count }
    }
  }
}
```

The `done` flag tells us whether iteration is finished. This is used in 
`for..of` loops to determine when to stop or when using `Array.from()` to 
convert an iterator to an array. Iterator by itself is rarely used. It's 
mostly used as a return value of an iterable's `[Symbol.iterator]` method. 

## Iterable

An object that conforms to the [iterable protocol](https://mzl.la/2HACVDf).

It has a `[Symbol.iterator]` method which returns an iterator. Examples of 
well-known iterables in JavaScript are arrays, strings and object literals. 
You can also write iterables of your own.

Here is an iterator tha always returns `true`:

```javascript
const alwaysTrue = {
  next () {
    return { done: false, value: true }
  },
  [Symbol.iterator] () {
    return this
  }
}
```

Don't use `for..of` without a `break` or `return` to iterate this, as it will
result in an infinite loop. Also don't `Array.from()` this iterable.

## Generator function

A function that can be used to create iterables (that are also iterators). 
They are written with an asterisk after the `function` keyword, and they use 
`yield` statements to return values:

```javascript
function * countDownFrom(start) {
  while (start) {
    yield --start
  }
}
```

Generators support a richer set of functionality than plain iterators, but 
are also quite a bit slower. Quickiter does not use generators. 

## Iteration protocol

A collective name for iterable and iterator protocols.

## Iterable protocol

A standard that defines iterables and standardizes their behavior.

## Iterator protocol

A standard that defines iterators and standardizes their behavior.
