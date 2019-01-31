# Quickiter

Fast iterator library.

## Overview

This library provides functions and objects for iterating over sequences 
using the [iteration protocol](https://mzl.la/2HACVDf).

With arrays, the entire sequence has to be in memory all the time. If we 
perform transformations like `map()`, `filter()`, `concat()` or `reduce()`, 
we furthermore create copies of the array. This can get very expensive very 
fast if arrays are thousands or tens of thousands of items. To avoid having 
to work with the entire array at a time, we use iterators which lets us apply
a sequence of operations to individual sequence members.

Here's a quick example to demonstrate the difference:

```javascript
const { Iter } = require('quickiter')

const a = [1, 2, 3]

a
  .map(x => x + 1)
  .filter(x => x > 2)
  .concat([10])
  .forEach(console.log)
  
Iter.from(a)
  .map(x => x + 1)
  .filter(x => x > 2)
  .concat([10])
  .forEach(console.log)
```

In both examples the outcome is the same. Numbers `3`, `4` and `10` get 
logged. What's different is the order in which the operations are applied. 

In the case of an array, we first execute `map()` over the entire array, which 
gives us a copy of the original array containing `[2, 3, 4]`. Then we execute
a filter, which gives us yet another copy: `[3, 4]`. When then `concat()` to 
create another copy, `[3, 4, 10]`. Finally we iterate over the entire array 
and `console.log()` the members.

With iter, we first start with number `1`. We call `map`, which gives us `2`, 
then we call `filter`, which eliminates `2` (it pass match the condition). We
then take the next item, which is `2`, then we `map` to get `3`. This passes 
the filter condition, so we run the next operation, which is `concat`. This 
is ignored for now because we are not done with the original sequence, so we 
skip and go to the final `console.log()`. Important thing to note here is 
that no copies are being made anywhere. We are always working with the 
original sequences. Even the small `[10]` array that is given to `concat` is 
not thrown away because `Iter` simply uses as a source for values instead of 
actually concatenating it with anything.

Iterators are about 20~50% slower than the fastest possible solution 
imaginable (for loops). They are, however, significantly faster (2.4x faster) 
than the equivalent array methods, and (more importantly) very memory 
efficient when it comes to processing large sequences, while providing a 
near-identical set of methods.

## Motivation

Quickiter's functionality similar to several packages on NPM. Unlike most of 
those packages, this library does *not* use the new ES6 generators. Instead 
it uses only the iterator protocol. This yields (pun intended) a significant 
performance improvement while more or less completely retaining the 
functionality of generator based iterators.

## Is this a replacement for generators?

No. Generator functions can do a lot more than create iterators. For example,
they can be used to write coroutines. The scope of this library is strictly 
to work with iterable sequences.

## Installation

TODO

## API documentation

TODO

## Benchmarks

The `benchmarks` folder contains a rudimentary benchmark that is used to 
optimize the library code. Here is a sample of the results as run on a Core 
i7 7700HQ Windows 10 PC and NodeJS 10.15.

```
procedural: 11.29ms (fastest)
single reduce: 12.51ms (+1.22ms / 1.1x slower)
single forEach: 12.92ms (+1.62ms / 1.1x slower)
Iter object: 16.31ms (+5.01ms / 1.4x slower)
iter* composition: 17.10ms (+5.81ms / 1.5x slower)
generators: 28.29ms (+17.00ms / 2.5x slower)
map/filter chain: 40.31ms (+29.02ms / 3.6x slower)
```
