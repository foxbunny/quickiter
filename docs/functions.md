# Iteration function

The Quickiter library consists of stand-alone iteration functions and an 
[`Iter` constructor](./iter.md). This document discusses the functions.

## `iter(iterable)`

The `iter()` function is used to convert an iterable into an iterator.

```javascript
const { iter } = require('quickiter')

const itr = iter([1, 2, 3])
itr.next()  // => { done: false, value: 1 }

const sitr = iter('123')
itr.next()  // => { done: false, value: '1' }
```

## `map(iterable, fn)`

Creates an iterable where each value is obtained by calling `fn` on the 
corresponding value from the `iterable`.

```javascript
const { map } = require('quickiter')

const itr = map([1, 2, 3], x => x + 1)
Array.from(itr)  // => [2, 3, 4]
```

## `filter(iterable, fn)`

Creates an iterable of values in `iterable` for which `fn` returns a truthy 
value.

```javascript
const { filter } = require('quickiter')

const itr = filter(
  ['banana', 'pineapple', 'orange', 'tangerine', 'mango'],
  x => x.includes('g')
)
Array.from(itr)  // => ['orange', 'tangerine', 'mango']
```

## `concat(...iterables)`

Takes one or more iterables and creates an iterable that allows iteration 
over all of the supplied iterables as if they were a single sequence.

```javascript
const { concat } = require('quickiter')

const itr = concat([1, 2, 3], [4, 5, 6])
Array.from(itr)  // => [1, 2, 3, 4, 5, 6]

const itr2 = concat([1, 2, 3], 4, [5, 6, 7])
Array.from(itr2)  // => [1, 2, 3]
```

This function does not really concatenate anything, and unlike arrays, it 
does not accept non-iterables as arguments. When a non-iterable value is 
passed, the resulting sequence is terminated at that value (not including it).

This function **does not throw** when one of the arguments is a non-iterable.

## `zip(iterable1, iterable2)`

Creates an iterable that allows simultaneous iteration over two supplied 
iterables. Each value of the resulting iterable is an array of two values 
from the  inputs.

```javascript
const { zip } = require('quickiter')

const itr = zip([1, 2, 3], [4, 5, 6])
Array.from(itr)  // => [[1, 4], [2, 5], [3, 6]]

const itr2 = zip([1, 2, 3], [4])
Array.from(itr2)  // => [[1, 4]]
```

The resulting iterable will stop at the end of the shorter of the two 
iterables.