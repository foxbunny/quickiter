# Iteration function

The Quickiter library consists of stand-alone iteration functions and an 
[`Iter` constructor](./iter.md). This document discusses the functions.

## `iter(iterable)`

The `iter()` function is used to convert an iterable into an iterator.

```javascript
const { iter } = require('quickiter')

const itr = iter([1, 2, 3])
itr.next()  // => { done: false, value: 1 }

const itr = iter('123')
itr.next()  // => { done: false, value: '1' }
```

## `range(n, [m], [step])`

This function creates an iterable that represents a range of numbers. It can
be called using several forms:

- `range(end)`
- `range(start, end)`
- `range(end, null, step)`
- `range(start, end, step)`

The sequence created by this function starts with 0 if only the end of the
range is specified. For instance:

```javascript
Array.from(range(3))
// => [0, 1, 2]
```

The final value, `end`, is never included in the range. If a negative value is
specified as the end, then the sequence will be in reverse order:

```javascript
Array.from(range(-3))
// => [0, -1, -2]
```

If both start and end are specified, the sequence will start from the `start`, 
and count until (but not including) `end`.

```javascript
Array.from(range(2, 6))
// => [2, 3, 4, 5]
```

If the `end` value is smaller than `start`, the sequence is reversed.

```javascript
Array.from(range(6, 2))
// => [6, 5, 4, 3]
```

The `step` value can be used to specify the distance between adjacent numbers
in the sequence. For example:

```javascript
Array.from(range(6, null, 2))
// => [0, 2, 4]
```

`step` is always treated as an absolute distance, so passing a negative value 
is the same as passing a positive one. The direction in which the sequence is
formed is determined solely using the `start` and `end` values.

```javascript
Array.from(range(6, null, -2))
// => [0, 2, 4]
```

The `step` argument can be combined with `end`.

```javascript
Array.from(range(6, -2, 2))
// => [6, 4, 2, 0]
```

The `range()` function is not limited to integers. By using floats for `step`, 
we can create a sequence of floats.

```javascript
Array.from(range(3, null, 0.5))
// => [0, 0.5, 1, 1.5, 2, 2.5]
```

Because range creates an iterable, rather than an array, it is possible to
create an infinite sequence:

```javascript
const positiveEvenNums = range(2, Infinity, 2)
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

## `touch(iterable, fn)`

This function returns an iterable that will not transform the items in the
original iterable, but will invoke the provided callback for each one. This
is useful for writing code that has side effects but no direct effect on the
iterable.

```javascript
const { touch } = require('quickiter')

const i = touch([1, 2, 3], x => console.log('seen ' + x))
const a = Array.from(i)
// => seen 1
// => seen 2
// => seen 3
console.log(a)
// => [1, 2, 3]
```

## `skip(iterable, n)`

Returns an iterable that will omit the first `n` items. Note that `n` is an 
item count, not an index.

```javascript
const { skip } = require('quickiter')

const i = skip('abcdef', 2)
const a = Array.from(i)
// ['c', 'd', 'e', 'f']
```

## `take(iterable, n)`

Returns an iterable that stops iteration after the `n`-th item. Note that `n` 
is an item count, not an index.

```javascript
const { take } = require('quickiter')

const i = take('abcdef', 2)
const a = Array.from(i)
// ['a', 'b']
```

## `slice(iterable, start, end)`

Returns an iterable that starts iteration at the specified `start` index, 
and ends at the `end` index (not including the item at `end` index).

```javascript
const { slice } = require('quickiter')

const i = slice('abcdef', 2, 4)
const a = Array.from(i)
// ['c', 'd']
```
