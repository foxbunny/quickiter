# Quickiter

Fast iterator library.

## Overview and motivation

This library provides functions and objects for iterating over sequences 
using the [iteration protocol](https://mzl.la/2HACVDf).

Its functionality similar to several packages on NPM. Unlike most of those 
packages, this library does *not* use the new ES6 generators. Instead it uses
only the iterator protocol. This yields (pun intended) a significant 
performance improvement while more or less completely retaining the 
functionality of generator based iterators.

## Is this a replacement for generators?

No. Generator functions can do a lot more than create iterators. For example,
they can be used to write coroutines. The scope of this library is strictly 
to work with iterable sequences.

## Quick example

```javascript
const { Iter } = require('quickiter')

Iter.from([1, 2, 3])
  .map(x => x + 1)
  .filter(x => x > 2)
  .concat([10])
  .forEach(console.log)

// logs 3 4 10
```

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
