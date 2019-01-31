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

Are iterators a replacement for arrays then? No. Iterator is a mechanism for 
memory-efficiently iterating over sequences, including arrays, strings, 
maps, and so on. In the above example, it's not about using arrays versus 
iterators, but about all the methods that we called. That's where the main 
difference lies.

## Iterators are stateful

A major difference between iterators and arrays is that operations on 
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
const myInfiniteIterable = {
  [Symbol.iterator] () {
    return {
      next () {
        return { done: false, value: true }
      }
    }
  }
}

const i = Iter.from(myInfiniteIterable)

i.forEach(console.log)
```

The above code will enter an infinite loop because the `done` flag never 
becomes `true`.

## A note on iterator performance

Iterators are about 20~50% slower than the fastest possible solution 
imaginable (`for` loops).

They are, however, significantly faster (2.4x faster) than the equivalent 
array methods, and (more importantly) very memory efficient when it comes to 
processing large sequences, while providing a near-identical set of methods.

A carefully constructed `for` or `while` loop is going to outperform 
iterators **in all respects**, but iterators nevertheless provide a nicer 
syntax with an acceptable overhead (compared to array methods and generators).
