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
      timerId: null
    }
  },
  methods: {
    startTimer(setTime) {
      clearInterval(this.timerId)
      this.time = setTime
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
  <div class="text-center">
    <h1>{{ timeRemainingString }}</h1>

    <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
      <input
        @click="startTimer(900)"
        type="radio"
        class="btn-check"
        name="btnradio"
        id="Long Break"
        autocomplete="off"
      />
      <label class="btn btn-outline-dark" for="Long Break">Long Break</label>

      <input
        @click="startTimer(1500)"
        type="radio"
        class="btn-check"
        name="btnradio"
        id="Focus"
        autocomplete="off"
      />
      <label class="btn btn-outline-dark" for="Focus">Focus</label>

      <input
        @click="startTimer(300)"
        type="radio"
        class="btn-check"
        name="btnradio"
        id="Short Break"
        autocomplete="off"
      />
      <label class="btn btn-outline-dark" for="Short Break">Short Break</label>
    </div>
  </div>
</template>
