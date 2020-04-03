const my = module.exports

my.iter = iterable => iterable[Symbol.iterator]()

my.range = (start, end, step = 1) => {
  if (end == null) {
    end = start
    start = 0
  }

  step = Math.abs(step)
  if (end < start) step = -step

  let isDone = end < start
    ? () => start <= end
    : () => start >= end

  return {
    next() {
      if (isDone()) return { done: true }
      let v = { value: start }
      start += step
      return v
    },
    [Symbol.iterator]() {
      return this
    },
  }
}

my.map = (iterable, fn) => {
  const i = my.iter(iterable)
  return {
    next() {
      const v = i.next()
      if (!v.done) {
        v.value = fn(v.value)
      }
      return v
    },
    [Symbol.iterator]() {
      return this
    },
  }
}

my.filter = (iterable, fn) => {
  const i = my.iter(iterable)
  return {
    next() {
      let v = i.next()
      while (!v.done && !fn(v.value)) {
        v = i.next()
      }
      return v
    },
    [Symbol.iterator]() {
      return this
    },
  }
}

my.concat = (...iterables) => {
  let currentIter = my.iter(iterables.shift())

  return {
    next() {
      const v = currentIter.next()
      if (v.done) {
        const nextIterable = iterables.shift()
        if (!nextIterable) {
          return { done: true }
        }
        currentIter = my.iter(nextIterable)
        return this.next()
      } else {
        return v
      }
    },
    [Symbol.iterator]() {
      return this
    },
  }
}

my.flatten = (iterables) => {
  const i = my.map(my.iter(iterables), my.iter)
  let nextIterator //?
  let nextItem //?
  return {
    next() {
      if (nextIterator == null) nextIterator = i.next()
      if (nextIterator.done) return { done: true }
      if (nextItem == null) nextItem = nextIterator.value.next()
      if (nextItem.done) {
        nextIterator = null
        nextItem = null
        return this.next()
      }
      let returnThis = nextItem
      nextItem = nextIterator.value.next()
      return returnThis
    },
    [Symbol.iterator]() {
      return this
    },
  }
}

my.enumerate = (iterable) => {
  let index = 0
  const i = my.iter(iterable)
  return {
    next() {
      const v = i.next()
      if (!v.done) {
        v.value = [v.value, index]
      }
      index++
      return v
    },
    [Symbol.iterator]() {
      return this
    },
  }
}

my.cycle = (iterable) => {
  let i = my.iter(iterable)
  let seen = []
  return {
    next() {
      let nextVal = i.next()
      if (nextVal.done) {
        i = my.iter(seen)
        seen = []
        return { done: true }
      }
      seen.push(nextVal.value)
      return nextVal
    },
    [Symbol.iterator]() {
      return this
    },
  }
}

my.zip = (iterable1, iterable2) => {
  const iter1 = my.iter(iterable1)
  const iter2 = my.iter(iterable2)

  return {
    next() {
      const v1 = iter1.next()
      const v2 = iter2.next()

      if (v1.done || v2.done) {
        return { done: true }
      }

      return { done: false, value: [v1.value, v2.value] }
    },
    [Symbol.iterator]() {
      return this
    },
  }
}

my.combine = (iterable1, iterable2) => {
  const iter1 = my.iter(iterable1)
  const iter2 = my.cycle(iterable2)
  let nextItem = iter1.next()
  return {
    next() {
      if (nextItem.done) return { done: true }
      let v1 = nextItem
      let v2 = iter2.next()
      if (v2.done) {
        nextItem = iter1.next()
        return this.next()
      }
      return { done: false, value: [v1.value, v2.value] }
    },
    [Symbol.iterator]() {
      return this
    },
  }
}

my.groupBy = (iterable, pred) => {
  const i = my.iter(iterable)
  let nextValue = i.next()
  return {
    next() {
      let lastLabel
      let currentLabel
      let values = []
      while (true) {
        if (nextValue.done) break
        currentLabel = pred(nextValue.value)
        if (typeof lastLabel === 'undefined') lastLabel = currentLabel
        if (currentLabel !== lastLabel) break
        values.push(nextValue.value)
        nextValue = i.next()
      }
      if (values.length === 0) return { done: true }
      return {
        done: false,
        value: {
          label: lastLabel,
          values: values,
        },
      }
    },
    [Symbol.iterator]() {
      return this
    },
  }
}

my.touch = (iterable, fn) => {
  const i = my.iter(iterable)
  return {
    next() {
      const v = i.next()
      if (v.done) return v
      fn(v.value)
      return v
    },
    [Symbol.iterator]() {
      return this
    },
  }
}

my.skip = (iterable, n) => {
  const i = my.iter(iterable)
  let idx = 0
  return {
    next() {
      let v
      while (idx < n) {
        v = i.next()
        if (v.done) return v
        idx++
      }
      return i.next()
    },
    [Symbol.iterator]() {
      return this
    },
  }
}

my.take = (iterable, n) => {
  const i = my.iter(iterable)
  let count = 1
  return {
    next() {
      if (count > n) return { done: true }
      count++
      return i.next()
    },
    [Symbol.iterator]() {
      return this
    },
  }
}

my.slice = (iterable, start, end) => {
  return my.take(my.skip(iterable, start), end - start)
}

my.Iter = class {
  static from(itr) {
    return new my.Iter(itr)
  }

  constructor(itr) {
    this.iterator = my.iter(itr)
  }

  map(fn) {
    this.iterator = my.map(this.iterator, fn)
    return this
  }

  filter(fn) {
    this.iterator = my.filter(this.iterator, fn)
    return this
  }

  concat(...iterables) {
    this.iterator = my.concat(this.iterator, ...iterables)
    return this
  }

  flatten() {
    this.iterator = my.flatten(this.iterator)
    return this
  }

  enumerate() {
    this.iterator = my.enumerate(this.iterator)
    return this
  }

  cycle() {
    this.iterator = my.cycle(this.iterator)
    return this
  }

  zip(itr) {
    this.iterator = my.zip(this.iterator, itr)
    return this
  }

  combine(itr) {
    this.iterator = my.combine(this.iterator, itr)
    return this
  }

  groupBy(pred) {
    this.iterator = my.groupBy(this.iterator, pred)
    return this
  }

  touch(fn) {
    this.iterator = my.touch(this.iterator, fn)
    return this
  }

  skip(n) {
    this.iterator = my.skip(this.iterator, n)
    return this
  }

  take(n) {
    this.iterator = my.take(this.iterator, n)
    return this
  }

  slice(start, end) {
    this.iterator = my.slice(this.iterator, start, end)
    return this
  }

  next() {
    return this.iterator.next()
  }

  forEach(fn) {
    let v = this.next()
    while (!v.done) {
      fn(v.value)
      v = this.next()
    }
  }

  [Symbol.iterator]() {
    return this
  }
}
