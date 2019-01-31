const my = module.exports

my.iter = iterable => iterable[Symbol.iterator]()

my.map = (iterable, fn) => {
  const i = my.iter(iterable)
  return {
    next () {
      const v = i.next()
      if (!v.done) {
        v.value = fn(v.value)
      }
      return v
    },
    [Symbol.iterator] () {
      return this
    }
  }
}

my.filter = (iterable, fn) => {
  const i = my.iter(iterable)
  return {
    next () {
      let v = i.next()
      while (!v.done && !fn(v.value)) {
        v = i.next()
      }
      return v
    },
    [Symbol.iterator] () {
      return this
    }
  }
}

my.concat = (...iterables) => {
  let currentIter = my.iter(iterables.shift())

  return {
    next () {
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
    [Symbol.iterator] () {
      return this
    }
  }
}

my.zip = (iterable1, iterable2) => {
  const iter1 = my.iter(iterable1)
  const iter2 = my.iter(iterable2)

  return {
    next () {
      const v1 = iter1.next()
      const v2 = iter2.next()

      if (v1.done || v2.done) {
        return { done: true }
      }

      return { done: false, value: [v1.value, v2.value] }
    },
    [Symbol.iterator] () {
      return this
    }
  }
}

my.Iter = class {
  static from (itr) {
    return new my.Iter(itr)
  }

  constructor (itr) {
    this.iterator = my.iter(itr)
  }

  map (fn) {
    this.iterator = my.map(this.iterator, fn)
    return this
  }

  filter (fn) {
    this.iterator = my.filter(this.iterator, fn)
    return this
  }

  concat (...iterables) {
    this.iterator = my.concat(this.iterator, ...iterables)
    return this
  }

  zip (itr) {
    this.iterator = my.zip(this.iterator, itr)
    return this
  }

  next () {
    return this.iterator.next()
  }

  forEach (fn) {
    let v = this.next()
    while (!v.done) {
      fn(v.value)
      v = this.next()
    }
  }

  [Symbol.iterator] () {
    return this
  }
}
