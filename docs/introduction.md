# Why iterators?

Before we answer this question, it is recommended to gloss over the 
[terminology](./terminology.md) first.

## Array methods vs Quickiter methods

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
gives us a completely new array containing `[2, 3, 4]`. Then we execute
a filter, which gives us yet another array: `[3, 4]`. We then `concat()` to 
create another copy, `[3, 4, 10]`. Finally we iterate over the entire array 
and `console.log()` the members.

With `Iter`, we first start with number `1`. We call `map`, which gives us `2`, 
then we call `filter`, which eliminates `2` (it fails the condition). We then 
take the next item, which is `2`, then we `map` to get `3`. This passes the 
filter condition, so we run the next operation, which is `concat`. Concat
 passes the value through as it does not do anything until the sequence is
finished. Therefore we skip ahead and go to the final `console.log()` which 
outputs `3`. We move on the `3`, which gets mapped to `4`, passes the filter,
and then gets logged to console. Now that the initial sequence of 1, 2, and 3
is finished, concat starts iterating over the array it was given, which
contains only `10`. `10` gets logged to console, and the entire iteration is
complete.

The crucial difference is that with `Iter`, we are iterating *only once*, even 
though it may appear on the surface to have iterated 4 times. With array
operations, there are 4 real iterations involved.

Are iterators a replacement for arrays then? No. Iterator is a mechanism for 
memory-efficiently iterating over sequences, including arrays, strings, 
maps, and so on. In the above example, it's not about using arrays versus 
iterators, but the memory-efficiency of the array operations we performed.

## When not to use iterators

Generally, you don't need iterators most of the time. Where iterators shine is
memory-efficiency. Some of the operations can be *slower* than Array
operations (e.g., a simple `Array.prototype.forEach()` is typically faster
than the `Iter.prototype.forEach()`). 

There are also operations that can be implemented more efficiently using
simple procedural code. For example, let's say we have two sequences:

```javascript
let xs = [1, 2, 3, 4, 5]
let ys = 'abcde'
```

We perform an operation on these as follows:

```javascript
Iter.from(xs).zip(ys).slice(1, 3).forEach(console.log)
// [2, 'b']
// [3, 'c']
```

This can be rewritten procedurally as:

```javascript
for (let i = 1, j = 3; i < j; i++) console.log([xs[i], ys[j]])
```

The procedural version is more memory efficient and faster than the iterable
we constructed in the previous example. This is because `slice()` cannot simply
skip to the desired index since it is designed to operate on *any* iterable, not
just indexed ones like arrays and strings, and `zip()` does not produce an
indexed sequence anyway.

## Iterators are stateful

An important difference between iterators and arrays is that operations on 
iterables are stateful. Let's consider this example:

```javascript
const i = Iter.from([1, 2, 3, 4])

for (const n of i) {
  if (n === 2) {
    break;
  }
}

i.forEach(console.log)
```

In the example above, the last line will log `3` and `4` only. This is 
because `1` and `2` had already been consumed by the `for..of` loop above it.
There is no way to undo this. Iterator can only go forward.

## Iterators have no length

Talking about `length` in iterators is also pointless, because iterables can 
be infinite. For example:

```javascript
const myInfiniteIterable = range(Infinity)
forEach(i, console.log)
```

The above code will enter an infinite loop and keep logging numbers until the
program is terminated from outside.

## A note on iterator performance

Iterators are about 20~50% slower than the fastest possible solution 
imaginable (`for` loops).

They are, however, significantly faster (2.4x faster) than the equivalent 
array methods, and (more importantly) very memory efficient when it comes to 
processing large sequences, while providing a near-identical set of methods.
You should take this with a grain of salt, though, because sometimes memory
efficiency is not what your program needs, and array methods can still be 
faster than functions in this library in very simple cases.

A carefully constructed `for` or `while` loop is going to outperform 
iterators **in all respects**, but iterators nevertheless provide a nicer 
syntax with an acceptable overhead (compared to array methods and generators).
