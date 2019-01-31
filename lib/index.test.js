const lib = require('.')

describe('lib.iter', () => {
  test('create an iterator from an iterable', () => {
    const iterator = {
      next () {
        return { done: true }
      }
    }
    const iterable = {
      [Symbol.iterator] () {
        return iterator
      }
    }

    const i = lib.iter(iterable)

    expect(i).toBe(iterator)
  })

  test('create an iterator from array', () => {
    const i = lib.iter([1, 2, 3])

    expect(i.next()).toEqual({
      done: false,
      value: 1
    })

    expect(i.next()).toEqual({
      done: false,
      value: 2
    })

    expect(i.next()).toEqual({
      done: false,
      value: 3
    })

    expect(i.next()).toEqual({
      done: true
    })
  })
})

describe('lib.map', () => {
  test('map over iterator', () => {
    const i = lib.map([1, 2, 3], x => x + 10)

    expect(i.next()).toEqual({
      done: false,
      value: 11
    })

    expect(i.next()).toEqual({
      done: false,
      value: 12
    })

    expect(i.next()).toEqual({
      done: false,
      value: 13
    })

    expect(i.next()).toEqual({
      done: true
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
      value: 3
    })

    expect(i.next()).toEqual({
      done: true
    })
  })

  test('empty sequence', () => {
    const i = lib.filter([1, 2, 3], () => false)

    expect(i.next()).toEqual({
      done: true
    })

    expect(i.next()).toEqual({
      done: true
    })
  })
})

describe('lib.concat', () => {
  test('concatenate multiple iterables', () => {
    const i = lib.concat([1, 2], [3, 4])

    expect(i.next()).toEqual({
      done: false,
      value: 1
    })

    expect(i.next()).toEqual({
      done: false,
      value: 2
    })

    expect(i.next()).toEqual({
      done: false,
      value: 3
    })

    expect(i.next()).toEqual({
      done: false,
      value: 4
    })

    expect(i.next()).toEqual({
      done: true
    })
  })

  test('with empty sequences', () => {
    const i = lib.concat([1, 2], [], [3, 4])

    expect(i.next()).toEqual({
      done: false,
      value: 1
    })

    expect(i.next()).toEqual({
      done: false,
      value: 2
    })

    expect(i.next()).toEqual({
      done: false,
      value: 3
    })

    expect(i.next()).toEqual({
      done: false,
      value: 4
    })

    expect(i.next()).toEqual({
      done: true
    })
  })

  test('with empty sequence first', () => {
    const i = lib.concat([], [1, 2])

    expect(i.next()).toEqual({
      done: false,
      value: 1
    })

    expect(i.next()).toEqual({
      done: false,
      value: 2
    })

    expect(i.next()).toEqual({
      done: true
    })
  })

  test('with empty sequence last', () => {
    const i = lib.concat([1, 2], [])

    expect(i.next()).toEqual({
      done: false,
      value: 1
    })

    expect(i.next()).toEqual({
      done: false,
      value: 2
    })

    expect(i.next()).toEqual({
      done: true
    })
  })

  test('interrupt with non-iterable', () => {
    const i = lib.concat([1, 2], null, [3, 4])

    expect(i.next()).toEqual({
      done: false,
      value: 1
    })

    expect(i.next()).toEqual({
      done: false,
      value: 2
    })

    expect(i.next()).toEqual({
      done: true
    })
  })
})

describe('lib.zip', () => {
  test('zip two iterables together', () => {
    const i = lib.zip([1, 2, 3], ['a', 'b', 'c'])

    expect(i.next()).toEqual({
      done: false,
      value: [1, 'a']
    })

    expect(i.next()).toEqual({
      done: false,
      value: [2, 'b']
    })

    expect(i.next()).toEqual({
      done: false,
      value: [3, 'c']
    })

    expect(i.next()).toEqual({
      done: true
    })
  })

  test('stop on shorter iterable', () => {
    const i = lib.zip([1, 2, 3], ['a', 'b'])

    expect(i.next()).toEqual({
      done: false,
      value: [1, 'a']
    })

    expect(i.next()).toEqual({
      done: false,
      value: [2, 'b']
    })

    expect(i.next()).toEqual({
      done: true
    })
  })

  test('empty sequence', () => {
    const i = lib.zip([], ['a', 'b'])

    expect(i.next()).toEqual({
      done: true
    })
  })
})

describe('lib.Iter', () => {
  test('wrap iterable', () => {
    const i = lib.Iter.from([1, 2, 3])

    expect(i.next()).toEqual({
      done: false,
      value: 1
    })

    expect(i.next()).toEqual({
      done: false,
      value: 2
    })

    expect(i.next()).toEqual({
      done: false,
      value: 3
    })

    expect(i.next()).toEqual({
      done: true
    })
  })

  test('map over self', () => {
    const i = lib.Iter.from([1, 2, 3])
      .map(x => x + 10)

    expect(i.next()).toEqual({
      done: false,
      value: 11
    })

    expect(i.next()).toEqual({
      done: false,
      value: 12
    })

    expect(i.next()).toEqual({
      done: false,
      value: 13
    })

    expect(i.next()).toEqual({
      done: true
    })
  })

  test('filter over self', () => {
    const i = lib.Iter.from([1, 2, 3])
      .filter(x => x > 2)

    expect(i.next()).toEqual({
      done: false,
      value: 3
    })

    expect(i.next()).toEqual({
      done: true
    })
  })

  test('concat with other iterables', () => {
    const i = lib.Iter.from([1, 2])
      .concat([3], [4])

    expect(i.next()).toEqual({
      done: false,
      value: 1
    })

    expect(i.next()).toEqual({
      done: false,
      value: 2
    })

    expect(i.next()).toEqual({
      done: false,
      value: 3
    })

    expect(i.next()).toEqual({
      done: false,
      value: 4
    })

    expect(i.next()).toEqual({
      done: true
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
      value: 12
    })

    expect(i.next()).toEqual({
      done: true
    })
  })

  test('iterate with forEach', () => {
    const i = lib.Iter.from([1, 2, 3])
    const f = jest.fn()

    i.forEach(f)

    expect(f.mock.calls).toEqual([
      [1],
      [2],
      [3]
    ])
  })

  test('zip with another iterable', () => {
    const i = lib.Iter.from([1, 2, 3])
      .zip(['a', 'b', 'c'])

    expect(i.next()).toEqual({
      done: false,
      value: [1, 'a']
    })

    expect(i.next()).toEqual({
      done: false,
      value: [2, 'b']
    })

    expect(i.next()).toEqual({
      done: false,
      value: [3, 'c']
    })

    expect(i.next()).toEqual({
      done: true
    })
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
