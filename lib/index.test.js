const lib = require('.')

describe('lib.iter', () => {
  test('create an iterator from an iterable', () => {
    const iterator = {
      next () {
        return { done: true }
      },
    }
    const iterable = {
      [Symbol.iterator] () {
        return iterator
      },
    }

    const i = lib.iter(iterable)

    expect(i).toBe(iterator)
  })

  test('create an iterator from array', () => {
    const i = lib.iter([1, 2, 3])

    expect(i.next()).toEqual({
      done: false,
      value: 1,
    })

    expect(i.next()).toEqual({
      done: false,
      value: 2,
    })

    expect(i.next()).toEqual({
      done: false,
      value: 3,
    })

    expect(i.next()).toEqual({
      done: true,
    })
  })
})

describe('lib.range', () => {
  test('create a range up to a number', function () {
    expect(Array.from(lib.range(6))).toEqual([0, 1, 2, 3, 4, 5])
  })

  test('negative range', function () {
    expect(Array.from(lib.range(-6))).toEqual([0, -1, -2, -3, -4, -5])
  })

  test('range with start and end', function () {
    expect(Array.from(lib.range(2, 7))).toEqual([2, 3, 4, 5, 6])
  })

  test('reverse range with start and end', function () {
    expect(Array.from(lib.range(7, 2))).toEqual([7, 6, 5, 4, 3])
  })

  test('from negative to positive', function () {
    expect(Array.from(lib.range(-3, 4))).toEqual([-3, -2, -1, 0, 1, 2, 3])
  })

  test('from positive to negative', function () {
    expect(Array.from(lib.range(3, -4))).toEqual([3, 2, 1, 0, -1, -2, -3])
  })

  test('range with step', function () {
    expect(Array.from(lib.range(6, null, 2))).toEqual([0, 2, 4])
  })

  test('range with step in reverse', function () {
    expect(Array.from(lib.range(-6, null, 2))).toEqual([0, -2, -4])
  })

  test('reverse range with negative step', function () {
    expect(Array.from(lib.range(-6, null, -2))).toEqual([0, -2, -4])
  })

  test('range with start and end and step', function () {
    expect(Array.from(lib.range(2, 8, 2))).toEqual([2, 4, 6])
  })

  test('reverse range with end and step', function () {
    expect(Array.from(lib.range(8, 2, 2))).toEqual([8, 6, 4])
  })

  test('negative step with normal sequence', function () {
    expect(Array.from(lib.range(2, 6, -2))).toEqual([2, 4])
  })

  test('range with fractional step', function () {
    expect(Array.from(lib.range(6, null, 0.5))).toEqual([0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5])
  })
})

describe('lib.generate', () => {
  test('generate a simple numeric sequence', () => {
    let g = lib.generate(1, x => x + 1)

    expect(g.next()).toEqual({ value: 1, done: false })
    expect(g.next()).toEqual({ value: 2, done: false })
    expect(g.next()).toEqual({ value: 3, done: false })
  })

  test('generate with a fixed total count', () => {
    let g = lib.generate(1, x => x + 1, 5)
    expect(Array.from(g)).toEqual([1, 2, 3, 4, 5])
  })

  test('generate with non-numeric value', () => {
    let g = lib.generate({ value: 0, even: true }, ({ value, even }) => ({
      value: value + 1,
      even: !even,
    }), 5)

    expect(Array.from(g)).toEqual([
      { value: 0, even: true },
      { value: 1, even: false },
      { value: 2, even: true },
      { value: 3, even: false },
      { value: 4, even: true },
    ])
  })

  test('terminate with TERMINATE value', () => {
    let g = lib.generate(1, x => x === 4 ? lib.TERMINATE : x + 1)
    expect(Array.from(g)).toEqual([1, 2, 3, 4])
  })
})

describe('lib.map', () => {
  test('map over iterator', () => {
    const i = lib.map([1, 2, 3], x => x + 10)

    expect(i.next()).toEqual({
      done: false,
      value: 11,
    })

    expect(i.next()).toEqual({
      done: false,
      value: 12,
    })

    expect(i.next()).toEqual({
      done: false,
      value: 13,
    })

    expect(i.next()).toEqual({
      done: true,
    })
  })

  test('create an mapped iterator', () => {
    const im = lib.map([1, 2, 3], x => x + 10)
    const i = lib.iter(im)
    expect(i).toBe(im)
  })
})

describe('lib.filter', () => {
  test('filter over iterator', () => {
    const i = lib.filter([1, 2, 3], x => x > 2)

    expect(i.next()).toEqual({
      done: false,
      value: 3,
    })

    expect(i.next()).toEqual({
      done: true,
    })
  })

  test('empty sequence', () => {
    const i = lib.filter([1, 2, 3], () => false)

    expect(i.next()).toEqual({
      done: true,
    })

    expect(i.next()).toEqual({
      done: true,
    })
  })
})

describe('lib.concat', () => {
  test('concatenate multiple iterables', () => {
    const i = lib.concat([1, 2], [3, 4])

    expect(i.next()).toEqual({
      done: false,
      value: 1,
    })

    expect(i.next()).toEqual({
      done: false,
      value: 2,
    })

    expect(i.next()).toEqual({
      done: false,
      value: 3,
    })

    expect(i.next()).toEqual({
      done: false,
      value: 4,
    })

    expect(i.next()).toEqual({
      done: true,
    })
  })

  test('with empty sequences', () => {
    const i = lib.concat([1, 2], [], [3, 4])

    expect(i.next()).toEqual({
      done: false,
      value: 1,
    })

    expect(i.next()).toEqual({
      done: false,
      value: 2,
    })

    expect(i.next()).toEqual({
      done: false,
      value: 3,
    })

    expect(i.next()).toEqual({
      done: false,
      value: 4,
    })

    expect(i.next()).toEqual({
      done: true,
    })
  })

  test('with empty sequence first', () => {
    const i = lib.concat([], [1, 2])

    expect(i.next()).toEqual({
      done: false,
      value: 1,
    })

    expect(i.next()).toEqual({
      done: false,
      value: 2,
    })

    expect(i.next()).toEqual({
      done: true,
    })
  })

  test('with empty sequence last', () => {
    const i = lib.concat([1, 2], [])

    expect(i.next()).toEqual({
      done: false,
      value: 1,
    })

    expect(i.next()).toEqual({
      done: false,
      value: 2,
    })

    expect(i.next()).toEqual({
      done: true,
    })
  })

  test('interrupt with non-iterable', () => {
    const i = lib.concat([1, 2], null, [3, 4])

    expect(i.next()).toEqual({
      done: false,
      value: 1,
    })

    expect(i.next()).toEqual({
      done: false,
      value: 2,
    })

    expect(i.next()).toEqual({
      done: true,
    })
  })
})

describe('lib.flatten', () => {
  test('flatten an iterable of iterables by one level', () => {
    const i = lib.flatten([[1, 2], [3, 4]])

    expect(i.next()).toEqual({
      done: false,
      value: 1,
    })

    expect(i.next()).toEqual({
      done: false,
      value: 2,
    })

    expect(i.next()).toEqual({
      done: false,
      value: 3,
    })

    expect(i.next()).toEqual({
      done: false,
      value: 4,
    })

    expect(i.next()).toEqual({
      done: true,
    })
  })

  test('mixed iterables', () => {
    const i = lib.flatten([[1, 2], 'ab'])

    expect(i.next()).toEqual({
      done: false,
      value: 1,
    })

    expect(i.next()).toEqual({
      done: false,
      value: 2,
    })

    expect(i.next()).toEqual({
      done: false,
      value: 'a',
    })

    expect(i.next()).toEqual({
      done: false,
      value: 'b',
    })

    expect(i.next()).toEqual({
      done: true,
    })
  })
})

describe('lib.enumerate', () => {
  test('add indices to an iterable', () => {
    const i = lib.enumerate(['foo', 'bar'])

    expect(i.next()).toEqual({
      done: false,
      value: ['foo', 0],
    })

    expect(i.next()).toEqual({
      done: false,
      value: ['bar', 1],
    })

    expect(i.next()).toEqual({
      done: true,
    })
  })

  test('with empty sequence', () => {
    const i = lib.enumerate([])

    expect(i.next()).toEqual({
      done: true,
    })
  })
})

describe('lib.cycle', () => {
  test('iterate once normally', () => {
    const i = lib.cycle([1, 2, 3])

    expect(i.next()).toEqual({
      done: false,
      value: 1,
    })

    expect(i.next()).toEqual({
      done: false,
      value: 2,
    })

    expect(i.next()).toEqual({
      done: false,
      value: 3,
    })

    expect(i.next()).toEqual({
      done: true,
    })
  })

  test('iterate multiple times', () => {
    const i = lib.cycle([1, 2, 3])

    const a1 = Array.from(i)
    const a2 = Array.from(i)

    expect(a1).toEqual([1, 2, 3])
    expect(a2).toEqual([1, 2, 3])
  })
})

describe('lib.zip', () => {
  test('zip two iterables together', () => {
    const i = lib.zip([1, 2, 3], ['a', 'b', 'c'])

    expect(i.next()).toEqual({
      done: false,
      value: [1, 'a'],
    })

    expect(i.next()).toEqual({
      done: false,
      value: [2, 'b'],
    })

    expect(i.next()).toEqual({
      done: false,
      value: [3, 'c'],
    })

    expect(i.next()).toEqual({
      done: true,
    })
  })

  test('stop on shorter iterable', () => {
    const i = lib.zip([1, 2, 3], ['a', 'b'])

    expect(i.next()).toEqual({
      done: false,
      value: [1, 'a'],
    })

    expect(i.next()).toEqual({
      done: false,
      value: [2, 'b'],
    })

    expect(i.next()).toEqual({
      done: true,
    })
  })

  test('empty sequence', () => {
    const i = lib.zip([], ['a', 'b'])

    expect(i.next()).toEqual({
      done: true,
    })
  })
})

describe('lib.combine', () => {
  test('create a combination of two iterables', () => {
    const i = lib.combine([1, 2], 'abc')

    expect(i.next()).toEqual({ done: false, value: [1, 'a'] })
    expect(i.next()).toEqual({ done: false, value: [1, 'b'] })
    expect(i.next()).toEqual({ done: false, value: [1, 'c'] })
    expect(i.next()).toEqual({ done: false, value: [2, 'a'] })
    expect(i.next()).toEqual({ done: false, value: [2, 'b'] })
    expect(i.next()).toEqual({ done: false, value: [2, 'c'] })
    expect(i.next()).toEqual({ done: true })
  })

  test('combine with empty sequence first', () => {
    const i = lib.combine([], 'abc')
    expect(Array.from(i)).toEqual([])
  })

  test('combine with empty sequence second', () => {
    const i = lib.combine([1, 2], '')
    expect(Array.from(i)).toEqual([])
  })
})

describe('lib.groupBy', () => {
  test('group iterable by condition', () => {
    const i = lib.groupBy([
      { group: 'a', item: 1 },
      { group: 'a', item: 2 },
      { group: 'b', item: 3 },
      { group: 'b', item: 4 },
    ], x => x.group)

    expect(i.next()).toEqual({
      done: false,
      value: {
        label: 'a',
        values: [
          { group: 'a', item: 1 },
          { group: 'a', item: 2 },
        ],
      },
    })

    expect(i.next()).toEqual({
      done: false,
      value: {
        label: 'b',
        values: [
          { group: 'b', item: 3 },
          { group: 'b', item: 4 },
        ],
      },
    })

    expect(i.next()).toEqual({
      done: true,
    })
  })

  test('non-contiguous groups results in multiple groups', () => {
    const i = lib.groupBy([
      { group: 'a', item: 1 },
      { group: 'a', item: 2 },
      { group: 'b', item: 3 },
      { group: 'b', item: 4 },
      { group: 'a', item: 5 },
    ], x => x.group)

    expect(Array.from(i)).toEqual([
      {
        label: 'a', values: [
          { group: 'a', item: 1 },
          { group: 'a', item: 2 },
        ],
      },
      {
        label: 'b', values: [
          { group: 'b', item: 3 },
          { group: 'b', item: 4 },
        ],
      },
      {
        label: 'a', values: [
          { group: 'a', item: 5 },
        ],
      },
    ])
  })
})

describe('lib.touch', () => {
  test('invoke a callback', () => {
    const fn = jest.fn()
    const i = lib.touch([1, 2, 3], fn)

    expect(fn).not.toHaveBeenCalled()
    let result = Array.from(i)
    expect(result).toEqual([1, 2, 3])
    expect(fn.mock.calls).toEqual([[1], [2], [3]])
  })
})

describe('lib.skip', () => {
  test('skip n elements', () => {
    let a = [1, 2, 3, 4, 5]
    expect(Array.from(lib.skip(a, 3))).toEqual([4, 5])
  })

  test('skip entire iterable', () => {
    let a = [1, 2, 3, 4, 5]
    expect(Array.from(lib.skip(a, 5))).toEqual([])
  })

  test('skip too many', () => {
    let a = [1, 2, 3, 4, 5]
    expect(Array.from(lib.skip(a, 10))).toEqual([])
  })
})

describe('lib.take', () => {
  test('take n elements', () => {
    let a = [1, 2, 3, 4, 5]
    expect(Array.from(lib.take(a, 2))).toEqual([1, 2])
    expect(Array.from(lib.take(a, 4))).toEqual([1, 2, 3, 4])
  })

  test('take no elements', () => {
    let a = [1, 2, 3, 4, 5]
    expect(Array.from(lib.take(a, 0))).toEqual([])
  })

  test('take more elements than exists', () => {
    let a = [1, 2, 3, 4, 5]
    expect(Array.from(lib.take(a, 9))).toEqual([1, 2, 3, 4, 5])
  })
})

describe.only('lib.takeFrom', () => {
  test('start from first occurrence of 3', () => {
    let a = [1, 2, 3, 4, 3, 2, 1]
    expect(Array.from(lib.takeFrom(a, x => x >= 3))).toEqual([3, 4, 3, 2, 1])
  })

  test('match from the very first object', () => {
    let a = [1, 2, 3, 4, 3, 2, 1]
    expect(Array.from(lib.takeFrom(a, x => x !== 0))).toEqual(a)
  })

  test('never match', () => {
    let a = [1, 2, 3, 4, 3, 2, 1]
    let f = jest.fn(x => x < 0)
    expect(Array.from(lib.takeFrom(a, f))).toEqual([])
    expect(f.mock.calls).toEqual([
      [1],
      [2],
      [3],
      [4],
      [3],
      [2],
      [1],
    ])
  })
})

describe('lib.takeUntil', () => {
  test('go until the first occurrence of 3', () => {
    let a = [1, 2, 3, 4, 3, 2, 1]
    expect(Array.from(lib.takeUntil(a, x => x >= 3))).toEqual([1, 2, 3])
  })

  test('first value matches', () => {
    let a = [1, 2, 3, 4, 3, 2, 1]
    expect(Array.from(lib.takeUntil(a, x => x > 0))).toEqual([1])
  })

  test('no matching values', () => {
    let a = [1, 2, 3, 4, 3, 2, 1]
    expect(Array.from(lib.takeUntil(a, x => x < 0))).toEqual([1, 2, 3, 4, 3, 2, 1])
  })
})

describe('lib.takeWhile', () => {
  test('go while numbers are less than 3', () => {
    let a = [1, 2, 3, 4, 3, 2, 1]
    expect(Array.from(lib.takeWhile(a, x => x < 3))).toEqual([1, 2])
  })

  test('first value matches', () => {
    let a = [1, 2, 3, 4, 3, 2, 1]
    expect(Array.from(lib.takeWhile(a, x => x < 0))).toEqual([])
  })

  test('all values match', () => {
    let a = [1, 2, 3, 4, 3, 2, 1]
    expect(Array.from(lib.takeWhile(a, x => x > 0))).toEqual([1, 2, 3, 4, 3, 2, 1])
  })
})

describe('lib.slice', () => {
  test('slice an iterable', () => {
    let a = [1, 2, 3, 4, 5]
    expect(Array.from(lib.slice(a, 1, 3))).toEqual([2, 3])
  })

  test('slice ends outside the range', () => {
    let a = [1, 2, 3, 4, 5]
    expect(Array.from(lib.slice(a, 1, 10))).toEqual([2, 3, 4, 5])
  })
})

describe('lib.partition', () => {
  test('partition an iterable', () => {
    let a = [1, 2, 3, 4, 5, 6]
    expect(Array.from(lib.partition(a, 2))).toEqual([[1, 2], [3, 4], [5, 6]])
    expect(Array.from(lib.partition(a, 3))).toEqual([[1, 2, 3], [4, 5, 6]])
    expect(Array.from(lib.partition(a, 4))).toEqual([[1, 2, 3, 4]])
  })

  test('partition with last partial item included', () => {
    let a = [1, 2, 3, 4, 5, 6]
    expect(Array.from(lib.partition(a, 2, true))).toEqual([[1, 2], [3, 4], [5, 6]])
    expect(Array.from(lib.partition(a, 3, true))).toEqual([[1, 2, 3], [4, 5, 6]])
    expect(Array.from(lib.partition(a, 4, true))).toEqual([[1, 2, 3, 4], [5, 6]])
  })
})

describe('lib.Iter', () => {
  test('wrap iterable', () => {
    const i = lib.Iter.from([1, 2, 3])

    expect(i.next()).toEqual({
      done: false,
      value: 1,
    })

    expect(i.next()).toEqual({
      done: false,
      value: 2,
    })

    expect(i.next()).toEqual({
      done: false,
      value: 3,
    })

    expect(i.next()).toEqual({
      done: true,
    })
  })

  test('map over self', () => {
    const i = lib.Iter.from([1, 2, 3])
      .map(x => x + 10)

    expect(i.next()).toEqual({
      done: false,
      value: 11,
    })

    expect(i.next()).toEqual({
      done: false,
      value: 12,
    })

    expect(i.next()).toEqual({
      done: false,
      value: 13,
    })

    expect(i.next()).toEqual({
      done: true,
    })
  })

  test('filter over self', () => {
    const i = lib.Iter.from([1, 2, 3])
      .filter(x => x > 2)

    expect(i.next()).toEqual({
      done: false,
      value: 3,
    })

    expect(i.next()).toEqual({
      done: true,
    })
  })

  test('enumerate self', () => {
    const i = lib.Iter.from([1, 2, 3]).enumerate()

    expect(i.next()).toEqual({
      done: false,
      value: [1, 0],
    })

    expect(i.next()).toEqual({
      done: false,
      value: [2, 1],
    })

    expect(i.next()).toEqual({
      done: false,
      value: [3, 2],
    })

    expect(i.next()).toEqual({
      done: true,
    })
  })

  test('flatten self', () => {
    const i = lib.Iter.from([[1, 2], [3, 4]]).flatten()

    expect(i.next()).toEqual({
      done: false,
      value: 1,
    })

    expect(i.next()).toEqual({
      done: false,
      value: 2,
    })

    expect(i.next()).toEqual({
      done: false,
      value: 3,
    })

    expect(i.next()).toEqual({
      done: false,
      value: 4,
    })

    expect(i.next()).toEqual({
      done: true,
    })
  })

  test('concat with other iterables', () => {
    const i = lib.Iter.from([1, 2])
      .concat([3], [4])

    expect(i.next()).toEqual({
      done: false,
      value: 1,
    })

    expect(i.next()).toEqual({
      done: false,
      value: 2,
    })

    expect(i.next()).toEqual({
      done: false,
      value: 3,
    })

    expect(i.next()).toEqual({
      done: false,
      value: 4,
    })

    expect(i.next()).toEqual({
      done: true,
    })
  })

  test('compose multiple methods', () => {
    const i = lib.Iter.from([1])
      .concat([2, 3])
      .map(x => x + 10)
      .filter(x => x > 11)
      .filter(x => x < 13)

    expect(i.next()).toEqual({
      done: false,
      value: 12,
    })

    expect(i.next()).toEqual({
      done: true,
    })
  })

  test('cycle', () => {
    const i = lib.Iter.from([1, 2, 3]).cycle()
    const a1 = Array.from(i)
    const a2 = Array.from(i)

    expect(a1).toEqual([1, 2, 3])
    expect(a2).toEqual([1, 2, 3])
  })

  test('iterate with forEach', () => {
    const i = lib.Iter.from([1, 2, 3])
    const f = jest.fn()

    i.forEach(f)

    expect(f.mock.calls).toEqual([
      [1],
      [2],
      [3],
    ])
  })

  test('zip with another iterable', () => {
    const i = lib.Iter.from([1, 2, 3])
      .zip(['a', 'b', 'c'])

    expect(i.next()).toEqual({
      done: false,
      value: [1, 'a'],
    })

    expect(i.next()).toEqual({
      done: false,
      value: [2, 'b'],
    })

    expect(i.next()).toEqual({
      done: false,
      value: [3, 'c'],
    })

    expect(i.next()).toEqual({
      done: true,
    })
  })

  test('combine with another iterable', () => {
    const i = lib.Iter.from([1, 2, 3])
      .combine(['a', 'b', 'c'])

    expect(Array.from(i)).toEqual([
      [1, 'a'],
      [1, 'b'],
      [1, 'c'],
      [2, 'a'],
      [2, 'b'],
      [2, 'c'],
      [3, 'a'],
      [3, 'b'],
      [3, 'c'],
    ])
  })

  test('group by', () => {
    const i = lib.Iter.from([1, 2, 3, 4, 5]).groupBy(x => x < 3)

    expect(Array.from(i)).toEqual([
      {
        label: true,
        values: [1, 2],
      },
      {
        label: false,
        values: [3, 4, 5],
      },
    ])
  })

  test('touch', () => {
    let fn = jest.fn()
    const i = lib.Iter.from([1, 2, 3])
      .touch(fn)

    expect(Array.from(i)).toEqual([1, 2, 3])
    expect(fn.mock.calls).toEqual([[1], [2], [3]])
  })

  test('use with for of', () => {
    const i = lib.Iter.from([1, 2, 3])
    const a = []

    for (const item of i) {
      a.push(item)
    }

    expect(a).toEqual([1, 2, 3])
  })

  test('skip', () => {
    const i = lib.Iter.from([1, 2, 3])
    i.skip(1)
    expect(Array.from(i)).toEqual([2, 3])
  })

  test('take', () => {
    const i = lib.Iter.from([1, 2, 3])
    i.take(2)
    expect(Array.from(i)).toEqual([1, 2])
  })

  test('takeFrom', () => {
    const i = lib.Iter.from([1, 2, 3, 4, 3, 2, 1])
    i.takeFrom(x => x === 3)
    expect(Array.from(i)).toEqual([3, 4, 3, 2, 1])
  })

  test('takeUntil', () => {
    const i = lib.Iter.from([1, 2, 3, 4, 3, 2, 1])
    i.takeUntil(x => x === 3)
    expect(Array.from(i)).toEqual([1, 2, 3])
  })

  test('takeWhile', () => {
    const i = lib.Iter.from([1, 2, 3, 4, 3, 2, 1])
    i.takeWhile(x => x <= 3)
    expect(Array.from(i)).toEqual([1, 2, 3])
  })

  test('slice', () => {
    const i = lib.Iter.from([1, 2, 3, 4, 5])
    i.slice(1, 3)
    expect(Array.from(i)).toEqual([2, 3])
  })

  test('partition', () => {
    const i = lib.Iter.from([1, 2, 3, 4, 5])
    i.partition(2)
    expect(Array.from(i)).toEqual([[1, 2], [3, 4]])
  })

  test('use with Array.from', () => {
    const i = lib.Iter.from([1, 2, 3])
    expect(Array.from(i)).toEqual([1, 2, 3])
  })
})
