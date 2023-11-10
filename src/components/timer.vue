<!-- eslint-disable vue/multi-word-component-names -->
<script>
export default {
  data() {
    return {
      time: null,
      timeNumber: null,
      timeRemainingSeconds: null,
      timeRemainingMinutes: null,
      timeRemainingHours: null,
      timeRemainingString: '00:00',
      timerId: null,
      currentState: null,
      counter: 0
    }
  },
  methods: {
    startTimer(givenState) {
      clearInterval(this.timerId)
      if (givenState == 'focus') {
        this.time = 1500
        this.currentState = 'Focus'
      } else if (givenState == 'shortBreak') {
        this.time = 300
        this.currentState = 'Take a short Break'
      } else if (givenState == 'longBreak') {
        this.time = 900
        this.currentState = 'Take a long Break'
      }
      this.timeNumber = this.time

      this.timeRemainingHours = parseInt(this.timeNumber / 3600)
      this.timeRemainingMinutes = parseInt(this.timeNumber / 60) - this.timeRemainingHours * 60
      this.timeRemainingSeconds =
        this.timeNumber - this.timeRemainingMinutes * 60 - this.timeRemainingHours * 3600

      if (this.timeRemainingHours !== 0) {
        this.timeRemainingString =
          this.formatNumber(this.timeRemainingHours) +
          ':' +
          this.formatNumber(this.timeRemainingMinutes) +
          ':' +
          this.formatNumber(this.timeRemainingSeconds)
      } else {
        this.timeRemainingString =
          this.formatNumber(this.timeRemainingMinutes) +
          ':' +
          this.formatNumber(this.timeRemainingSeconds)
      }

      this.timerId = setInterval(this.updateTime, 1000) // Start the timer
    },
    updateTime() {
      if (this.timeNumber > 0) {
        this.timeNumber--
        this.timeRemainingHours = parseInt(this.timeNumber / 3600)
        this.timeRemainingMinutes = parseInt(this.timeNumber / 60) - this.timeRemainingHours * 60
        this.timeRemainingSeconds =
          this.timeNumber - this.timeRemainingMinutes * 60 - this.timeRemainingHours * 3600

        if (this.timeRemainingHours !== 0) {
          this.timeRemainingString =
            this.formatNumber(this.timeRemainingHours) +
            ':' +
            this.formatNumber(this.timeRemainingMinutes) +
            ':' +
            this.formatNumber(this.timeRemainingSeconds)
        } else {
          this.timeRemainingString =
            this.formatNumber(this.timeRemainingMinutes) +
            ':' +
            this.formatNumber(this.timeRemainingSeconds)
        }
      } else {
        clearInterval(this.timerId) // Stop the timer when remaining reaches 0
        this.counter++
        if (this.counter == 1 || this.counter == 3 || this.counter == 5 || this.counter == 7) {
          this.startTimer('shortBreak')
        } else if (
          this.counter == 2 ||
          this.counter == 4 ||
          this.counter == 6 ||
          this.counter == 8
        ) {
          this.startTimer('focus')
        } else if (this.counter == 9) {
          this.startTimer('longBreak')
        } else if (this.counter == 10) {
          this.counter = 0
          this.startTimer('focus')
        }
      }
    },
    formatNumber(number) {
      if (String(number).length == 1) {
        let result = '0' + number
        return result
      } else {
        return number
      }
    }
  }
}
</script>
<template>
  <div class="text-center container">
    <h1>{{ currentState }}</h1>
    <h1>{{ timeRemainingString }}</h1>
    <div
      class="progress"
      role="progressbar"
      aria-label="Example 20px high"
      aria-valuenow="25"
      aria-valuemin="0"
      aria-valuemax="100"
      style="height: 20px; width: 200px"
    >
      <div class="progress-bar" style="width: 25%"></div>
    </div>
    <button @click="startTimer('focus')" type="button" class="btn btn-dark">Study</button>
  </div>
</template>
