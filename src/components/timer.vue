<script>
export default {
  data() {
    return {
      time: 600,
      timeNumber: null,
      timeString: null,
      timerId: null
    }
  },
  methods: {
    startTimer() {
      this.timeNumber = this.time
      //this.timeString = this.timeNumber + ' Seconds'
      this.timeString = parseInt(this.timeNumber / 60) + ' Minutes'
      this.timerId = setInterval(this.updateTime, 1000) // Start the timer
    },
    updateTime() {
      if (this.timeNumber > 0) {
        this.timeNumber--
        //this.timeString.seconds = this.timeNumber + ' Seconds'
        this.timeString = parseInt(this.timeNumber / 60) + ' Minutes'
      } else {
        clearInterval(this.timerId) // Stop the timer when remaining reaches 0
      }
    }
  }
}
</script>
<template>
  <h1>{{ timeString }}</h1>
  <button @click="startTimer">Start Timer</button>
</template>
