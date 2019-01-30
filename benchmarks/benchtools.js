const my = module.exports

my.benchSet = (runs, warmUps, verify, ...benchmarks) => {
  const times = {}
  let runsLeft = runs + warmUps

  console.log(`
Runs: ${runs} runs (+ ${warmUps} warm-up runs)
Variations: ${benchmarks.length}
`)

  while (runsLeft--) {
    benchmarks.forEach(bench => {
      const { label, time } = bench(verify)

      if (--warmUps > 0) {
        return
      }

      if (!times[label]) {
        times[label] = []
      }

      times[label].push(time)
    })
  }

  const results = Object.entries(times).reduce(
    (results, [entry, entryTimes]) => {
      const avg = entryTimes.reduce((a, b) => a + b) / entryTimes.length
      results.push({ label: entry, time: avg })
      return results
    },
    []
  )

  results.sort((a, b) => {
    return a.time - b.time
  })

  const baseTime = results[0]
  console.log(`${baseTime.label}: ${baseTime.time.toFixed(2)}ms (fastest)`)

  results.slice(1).forEach(({ label, time }) => {
    const timeDiff = time - baseTime.time
    const timesSlower = time / baseTime.time
    console.log(`${label}: ${time.toFixed(2)}ms (+${timeDiff.toFixed(2)}ms / ${timesSlower.toFixed(1)}x slower)`)
  })
}

my.bench = (label, fn) => {
  return verify => {
    const start = Date.now()
    const ret = Array.from(fn())
    const end = Date.now()
    verify(ret)
    return { label, time: end - start }
  }
}
