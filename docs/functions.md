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

## `flatten(iterables)`

Given an iterable of iterables, this function flattens them by one level in
to a single iterable for iterating over the items of all inner iterables as a 
single sequence.

```javascript
const { flatten } = require('quickiter')

const itr = flatten([[1, 2, 3], [4, 5, 6]])
Array.from(itr)  // => [1, 2, 3, 4, 5, 6]
```

This is similar to `concat()`, but it is implemented differently (more 
efficiently) internally. If you are string from an array of arrays, for example,
it is more efficient to use `flatten()`, than to apply `concat()` to the array.

## `enumerate(iterable)`

All of the functions for working with iterables will not return an index of
each item within the sequence. This function wraps an iterable to return the
index of each item in the sequence while iterating. Indices are 0-based.

```javascript
const { enumerate } = require('quickiter')

const itr = enumerate('123')
Array.from(itr)  // => [['1', 0], ['2', 1], ['3', 2]]
```

## `cycle(iterable)`

Normally, iterators will finish when they are exhausted, and cannot be
iterated again. This function returns an iterator that allows multiple
iterations over the original one.

```javascript
const { cycle } = require('quickiter')

const itr = cycle('123')
Array.from(itr)  // => ['1', '2', '3']
Array.from(itr)  // => ['1', '2', '3']
```

This function caches the values of the first iteration. This means that if
you have iterables created using `map()` and similar functions, the callbacks
will **not** be evaluated on second and later iterations. This is effectively
a caching iterator as well.

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

## `combine(iterable1, iterable2)`

This function creates app possible combinations of the items in two iterables.
Unlike other functions, it is very important that the second iterable is finite.

```javascript
const { combine } = require('quickiter')

const itr = combine([1, 2, 3], [4, 5, 6])
Array.from(itr)  // => [[1, 4], [1, 5], [1, 6], [2, 4], [2, 5], ....]
```

## `groupBy(iterable, pred)`

This function groups items of an iterable by a value returned by the
predicate function `pred()`. The predicate is invoked with with each item and
is expected to return a value that will serve as a label. The returned iterable 
will contain arrays of objects, each having `label` and `values` properties. 
The `label` property is the value returned by `pred()` for a given group, and 
the group values are contained in the `values` array.

```javascript
const { groupBy } = require('quickiter')

let people = [
  {group: 'a', name: 'John'},
  {group: 'a', name: 'Alice'},
  {group: 'a', name: 'Mike'},
  {group: 'b', name: 'Jane'},
  {group: 'b', name: 'Bob'},
  {group: 'c', name: 'Tanya'},
]

Array.from(groupBy(people, p => p.group))
/* =>
  
  [
    { 
      label: 'a', 
      values: [
        {group: 'a', name: 'John'},
        {group: 'a', name: 'Alice'},
        {group: 'a', name: 'Mike'},
      ],
    },
    {
      label: 'b',
      values: [
        {group: 'b', name: 'Jane'},
        {group: 'b', name: 'Bob'},
      ],
    },
    ....
  ]
*/
```

Note that the groups are only formed by adjacent objects for which the
predicate returns a value. If predicate returns the same values for two 
non-consecutive objects, those object end up in two different groups.
