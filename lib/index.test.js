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

describe('flatten', () => {
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
    let i = lib.enumerate(['foo', 'bar'])

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
    let i = lib.enumerate([])

    expect(i.next()).toEqual({
      done: true,
    })
  })
})

describe('cycle', () => {
  test('iterate once normally', () => {
    let i = lib.cycle([1, 2, 3])

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

  test('iterate multiple times', function () {
    const i = lib.cycle([1, 2, 3])

    let a1 = Array.from(i)
    let a2 = Array.from(i)

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
    let i = lib.combine([1, 2], 'abc')

    expect(i.next()).toEqual({ done: false, value: [1, 'a'] })
    expect(i.next()).toEqual({ done: false, value: [1, 'b'] })
    expect(i.next()).toEqual({ done: false, value: [1, 'c'] })
    expect(i.next()).toEqual({ done: false, value: [2, 'a'] })
    expect(i.next()).toEqual({ done: false, value: [2, 'b'] })
    expect(i.next()).toEqual({ done: false, value: [2, 'c'] })
    expect(i.next()).toEqual({ done: true })
  })

  test('combine with empty sequence first', () => {
    let i = lib.combine([], 'abc')
    expect(Array.from(i)).toEqual([])
  })

  test('combine with empty sequence second', () => {
    let i = lib.combine([1, 2], '')
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

  test('enumerate self', function () {
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

  test('flatten self', function () {
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
    let i = lib.Iter.from([1, 2, 3]).cycle()
    let a1 = Array.from(i)
    let a2 = Array.from(i)

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
    const i = lib.Iter.from([1, 2, 3, 4, 5,]).groupBy(x => x < 3)

    expect(Array.from(i)).toEqual([
      {
        label: true,
        values: [1, 2],
      },
      {
        label: false,
        values: [3, 4, 5]
      }
    ])
  })

  test('use with for of', () => {
    const i = lib.Iter.from([1, 2, 3])
    const a = []

    for (const item of i) {
      a.push(item)
    }

    expect(a).toEqual([1, 2, 3])
  })

  test('use with Array.from', () => {
    const i = lib.Iter.from([1, 2, 3])
    expect(Array.from(i)).toEqual([1, 2, 3])
  })
})
