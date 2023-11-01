<script>
function timer(time) {
  if (timer.counter == undefined) {
    timer.difference = +new Date() + time - +new Date()
    timer.counter = 0
  }
  timer.counter++
  let remaining = "Time's up!"
  if (timer.difference > 0) {
    const parts = {
      days: Math.floor(timer.difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((timer.difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((timer.difference / (1000 * 60)) % 60),
      seconds: Math.floor((timer.difference / 1000) % 60)
    }

    remaining = Object.keys(parts)
      .map((part) => {
        return `${parts[part]} ${part}`
      })
      .join(' ')
  }
  return remaining
}

export default {
  computed: {
    remaining() {
      return timer(60000)
    }
  }
}
</script>
<template>
  <h1>{{ remaining }}</h1>
</template>
