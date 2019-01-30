const iter = require('../lib')
const { benchSet, bench } = require('./benchtools')
const assert = require('assert')

const WARM_UP = 10
const RUNS = 50
const N = 100000
const a = []
const b = []

{
  let i = N
  while (i--) {
    a.push(N - i)
    b.push(N - i)
  }
}

const add2 = x => x + 2
const triple = x => x * 3
const isEven = x => x % 2 === 0
const str = x => x.toString()

const verify = ret =>
  assert(ret.length === N / 2, `${ret.length} should be ${N / 2}`)

function * map (fn, iterable) {
  for (const item of iterable) {
    yield fn(item)
  }
}

function * filter (fn, iterable) {
  for (const item of iterable) {
    if (fn(item)) {
      yield item
    }
  }
}

benchSet(
  RUNS,
  WARM_UP,
  verify,

  bench('map/filter chain', () =>
    a
      .map(add2)
      .map(triple)
      .filter(isEven)
      .map(str)
  ),

  bench('procedural', () => {
    const out = []
    for (let i = 0, l = a.length; i < l; i++) {
      const n = triple(add2(a[i]))
      if (isEven(n)) {
        out.push(str(n))
      }
    }
    return out
  }),

  bench('single reduce', () =>
    a.reduce(
      (out, item) => {
        const n = triple(add2(item))
        if (isEven(n)) {
          out.push(str(n))
        }
        return out
      },
      []
    )
  ),

  bench('single forEach', () => {
    const out = []
    a.forEach(item => {
      const n = triple(add2(item))
      if (isEven(n)) {
        out.push(str(n))
      }
    })
    return out
  }),

  bench('generators', () => {
    const add2iter = map(add2, a)
    const tripleIter = map(triple, add2iter)
    const evenIter = filter(isEven, tripleIter)
    return map(str, evenIter)
  }),

  bench('iter* composition', () =>
    iter.map(
      iter.filter(
        iter.map(
          iter.map(a, add2),
          triple
        ),
        isEven
      ),
      str
    )
  ),

  bench('Iter object', () =>
    iter.Iter.from(a)
      .map(add2)
      .map(triple)
      .filter(isEven)
      .map(str)
  )
)
