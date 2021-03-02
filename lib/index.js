export const TERMINATE = Object.freeze({})

export const iter = iterable => iterable[Symbol.iterator]()

export const range = (start, end, step = 1) => {
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

export const generate = (startValue, valueFactory, count) => {
  let currentValue = startValue
  let currentCount = 1
  let isDone = false

  return {
    next() {
      if (isDone) {
        return { done: true }
      }

      let ret = { value: currentValue, done: false }
      currentValue = valueFactory(currentValue)
      currentCount++
      isDone = currentValue === TERMINATE || count && currentCount > count
      return ret
    },
    [Symbol.iterator]() {
      return this
    },
  }
}

export const map = (iterable, fn) => {
  const i = iter(iterable)
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

export const filter = (iterable, fn) => {
  const i = iter(iterable)
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

export const concat = (...iterables) => {
  let currentIter = iter(iterables.shift())

  return {
    next() {
      const v = currentIter.next()
      if (v.done) {
        const nextIterable = iterables.shift()
        if (!nextIterable) {
          return { done: true }
        }
        currentIter = iter(nextIterable)
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

export const flatten = (iterables) => {
  const i = map(iter(iterables), iter)
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

export const enumerate = (iterable) => {
  let index = 0
  const i = iter(iterable)
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

export const cycle = (iterable) => {
  let i = iter(iterable)
  let seen = []
  return {
    next() {
      let nextVal = i.next()
      if (nextVal.done) {
        i = iter(seen)
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

export const zip = (iterable1, iterable2) => {
  const iter1 = iter(iterable1)
  const iter2 = iter(iterable2)

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

export const combine = (iterable1, iterable2) => {
  const iter1 = iter(iterable1)
  const iter2 = cycle(iterable2)
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

export const groupBy = (iterable, pred) => {
  const i = iter(iterable)
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

export const touch = (iterable, fn) => {
  const i = iter(iterable)
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

export const skip = (iterable, n) => {
  const i = iter(iterable)
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

export const take = (iterable, n) => {
  const i = iter(iterable)
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

export const takeFrom = (iterable, fn) => {
  let i = iter(iterable)
  let shouldReturn = false

  return {
    next() {
      let v = i.next()

      while (!v.done && !(shouldReturn = shouldReturn || fn(v.value))) {
        v = i.next()
      }

      if (v.done) {
        return { done: true }
      }

      return { value: v.value, done: false }
    },
    [Symbol.iterator]() {
      return this
    },
  }
}

export const takeUntil = (iterable, fn) => {
  let i = iter(iterable)
  let shouldReturn = true

  return {
    next() {
      if (!shouldReturn) {
        return { done: true }
      }

      let v = i.next()

      if (v.done) {
        return { done: true }
      }

      if (fn(v.value)) {
        shouldReturn = false
        return { done: false, value: v.value }
      }

      return { done: false, value: v.value }
    },

    [Symbol.iterator]() {
      return this
    },
  }
}

export const takeWhile = (iterable, fn) => {
  let i = iter(iterable)
  let shouldReturn = true

  return {
    next() {
      if (!shouldReturn) {
        return { done: true }
      }

      let v = i.next()

      if (v.done) {
        return { done: true }
      }

      if (!fn(v.value)) {
        shouldReturn = true
        return { done: true }
      }

      return { done: false, value: v.value }
    },

    [Symbol.iterator]() {
      return this
    },
  }
}

export const slice = (iterable, start, end) => {
  return take(skip(iterable, start), end - start)
}

export const partition = (iterable, count, includePartial) => {
  let i = iter(iterable)

  return {
    next() {
      let itemsToRetrieve = count
      let items = []

      while (itemsToRetrieve) {
        let v = i.next()

        if (!v.done) {
          items.push(v.value)
          itemsToRetrieve--
          continue
        }

        if (!includePartial || items.length === 0) {
          return { done: true }
        } else {
          return { done: false, value: items }
        }
      }

      return { done: false, value: items }
    },
    [Symbol.iterator]() {
      return this
    },
  }
}

export const Iter = class {
  static from(itr) {
    return new Iter(itr)
  }

  constructor(itr) {
    this.iterator = iter(itr)
  }

  map(fn) {
    this.iterator = map(this.iterator, fn)
    return this
  }

  filter(fn) {
    this.iterator = filter(this.iterator, fn)
    return this
  }

  concat(...iterables) {
    this.iterator = concat(this.iterator, ...iterables)
    return this
  }

  flatten() {
    this.iterator = flatten(this.iterator)
    return this
  }

  enumerate() {
    this.iterator = enumerate(this.iterator)
    return this
  }

  cycle() {
    this.iterator = cycle(this.iterator)
    return this
  }

  zip(itr) {
    this.iterator = zip(this.iterator, itr)
    return this
  }

  combine(itr) {
    this.iterator = combine(this.iterator, itr)
    return this
  }

  groupBy(pred) {
    this.iterator = groupBy(this.iterator, pred)
    return this
  }

  touch(fn) {
    this.iterator = touch(this.iterator, fn)
    return this
  }

  skip(n) {
    this.iterator = skip(this.iterator, n)
    return this
  }

  take(n) {
    this.iterator = take(this.iterator, n)
    return this
  }

  takeFrom(fn) {
    this.iterator = takeFrom(this.iterator, fn)
    return this
  }

  takeUntil(fn) {
    this.iterator = takeUntil(this.iterator, fn)
    return this
  }

  takeWhile(fn) {
    this.iterator = takeWhile(this.iterator, fn)
    return this
  }

  slice(start, end) {
    this.iterator = slice(this.iterator, start, end)
    return this
  }

  partition(count, includePartial) {
    this.iterator = partition(this.iterator, count, includePartial)
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
