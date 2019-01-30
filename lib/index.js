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

my.Iter = class {
  static from (itr) {
    return new my.Iter(itr)
  }

  constructor (itr) {
    this.iterable = my.iter(itr)
  }

  map (fn) {
    this.iterable = my.map(this.iterable, fn)
    return this
  }

  filter (fn) {
    this.iterable = my.filter(this.iterable, fn)
    return this
  }

  concat (...iterables) {
    this.iterable = my.concat(this.iterable, ...iterables)
    return this
  }

  next () {
    return this.iterable.next()
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
