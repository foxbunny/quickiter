const iter = require('../lib')
const { bench, benchSet } = require('./benchtools')

const assert = require('assert')

const WARM_UP = 10
const RUNS = 50
const N = 100000
const a = []

{
  let i = N
  while (i--) {
    a.push(N - i)
  }
}

const b = a.slice(0, N / 2)

benchSet(
  RUNS,
  WARM_UP,
  res => assert(res.length === N / 2),

  bench('procedural', () => {
    const out = []
    for (let i = 0, l = Math.min(a.length, b.length); i < l; i++) {
      out.push(a[i] * b[i])
    }
    return out
  }),

  bench('iter*', () =>
    iter.map(
      iter.zip(a, b),
      ([x, y]) => x * y
    )
  ),

  bench('Iter', () =>
    iter.Iter.from(a)
      .zip(b)
      .map(([x, y]) => x * y)
  )
)
