# `Iter` constructor

The `Iter` constructor is used to create iterables that have a rich set of 
methods similar to those found on the `Array` prototype.

Every `Iter` object is both an iterable and an iterator.

## Creating an instance

An `Iter` instance is created from an iterable. This can be either one of the
JavaScript's built-in iterables (e.g., array, string, map, etc.) or a custom 
object that conforms to the iterable protocol.

```javascript
const { Iter } = require('quickiter')

const itr = new Iter([1, 2, 3])
```

## Static methods

### `#from(iterable)`

Similar to `Array` constructor, the `Iter` constructor also has a `from()` 
static method:

```javascript
const itr2 = Iter.from('abc')
```

## Instance properties

### `#iterator`

The `iterator` property can be used to directly access the iterator that an 
`Iter` object wraps. This is rarely useful, but it's there in case you need it.

## Instance methods

### `#next()`

Returns the next value from the iterator.

```javascript
Iter.from([1, 2, 3]).next()
// => { done: false, value: 1 }
```

You rarely need to call this method directly. It's there to satisfy the 
iterator protocol and make `Iter` objects work with `Array.from()` and 
`for..of` loops.

### `#map(fn)`

Updates the iterator such that each value is a return value of calling the 
`fn` function with current values as the only argument.

```javascript
const mapped = Iter.from([1, 2, 3]).map(x => x + 1)

Array.from(mapped)  // => [2, 3, 4]
```

### `#filter(fn)`

Filters the iterator using the `fn` function. Iterator will only iterate over
values for which `fn` returns a truthy value.

```javascript
const filtered = Iter.from(
  ['banana', 'pineapple', 'orange', 'tangerine', 'mango']
).filter(x => x.includes('g'))

Array.from(filtered)  // => ['orange', 'tangerine', 'mango']
```

### `#concat(...iterables)`

Concatenates the iterable with one or more iterables. The iterable is updated
to iterate over values from the current iterable, followed by values from the 
iterables passed to this method, as a single sequence.

```javascript
const concatenated = Iter.from('quick').concat('iter')

Array.from(concatenated)  // => ['q', 'u', 'i', 'c', 'k', 'i', 't', 'e', 'r']
```

### `#enumerate()`

Add indices to the iterable. This results in each value in the iterable to be
converted into an array with two elements, the value and its index. Indices are 
0-based.

```javascript
const enumerated = Iter.from([1, 2, 3]).enumerate()

Array.from(zipped)  // => [[1, 0], [2, 1], [3, 2]]
```

### `#zip(iterable)`

Zips the iterable with another `iterable`. Iterating over this iterable will 
result in simultaneous iteration over both the current and the supplied 
iterable where each value is an array containing values from both iterables.

```javascript
const zipped = Iter.from([1, 2, 3]).zip('abc')

Array.from(zipped)  // => [[1, 'a'], [2, 'b'], [3, 'c']]
```

If one of the iterables finishes earlier, that is where the combined sequence
ends.

```javascript
const zipped2 = Iter.from([1, 2, 3]).zip('a')

Array.from(zipped)  // => [[1, 'a']]
``` 

## `#forEach(fn)`

Invokes the `fn` function for each value until the iterable is exhausted (if 
ever).

```javascript
Iter.from([1, 2, 3]).zip('abc').forEach(console.log)

// [1, 'a'] 
// [2, 'b'] 
// [3, 'c'] 
```
