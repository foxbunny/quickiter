# `Iter` constructor

The `Iter` constructor is used to create iterables that have a rich set of 
methods similar to those found on the `Array` prototype.

Every `Iter` object is both an iterable and an iterator.

The descriptions of the methods on the `Iter` object are usually a bit sparse. 
This is because these methods work mostly the same way as the 
[functions](./functions.md) in this package with the first iterable argument
being an `Iter` object. Please refer to the function documentation for more
information.

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

### `#flatten()`

Flattens the wrapped iterable of iterables by chaining all inner iterables
into a single sequence.

```javascript
const flat = Iter.from([[1, 2], [3, 4]]).flatten()

Array.from(flat)  // => [1, 2, 3, 4]
```

### `#enumerate()`

Add indices to the iterable. This results in each value in the iterable to be
converted into an array with two elements, the value and its index. Indices are 
0-based.

```javascript
const enumerated = Iter.from([1, 2, 3]).enumerate()

Array.from(zipped)  // => [[1, 0], [2, 1], [3, 2]]
```

### `#cycle()`

Converts the iterable to a version that can sustain multiple iterations.

```javascript
const i = Iter.from([1, 2, 3]).cycle()

Array.from(i)  // => [1, 2, 3]
Array.from(i)  // => [1, 2, 3]
````

This method caches the values of the first iteration. This means that if
you have iterables created using `map()` and similar functions, the callbacks
will **not** be evaluated on second and later iterations. This is effectively
a caching iterator as well.

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

### `#groupBy(pred)`

Group the items in the iterable by the label returned by the predicate. The
returned value is an array of objects, each object having two properties: 
`label`, which is a value returned by the predicate, and `values`, which is
array of values in the group.

```javascript
let people = [
  {group: 'a', name: 'John'},
  {group: 'a', name: 'Alice'},
  {group: 'a', name: 'Mike'},
  {group: 'b', name: 'Jane'},
  {group: 'b', name: 'Bob'},
  {group: 'c', name: 'Tanya'},
]
const grouped = Iter.from(people).groupBy(p => p.group)

Array.from(grouped)
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

### `#combine(iterable)`

Combines this iterable with another one to create an iterable of all possible
combinations of items in both iterables. Please keep in mind that this will 
only work if the `iterable` argument is a finite iterable.

```javascript
const itr = Iter.from([1, 2, 3]).combine([4, 5, 6])

Array.from(itr)  // => [[1, 4], [1, 5], [1, 6], [2, 4], [2, 5], ....]
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
