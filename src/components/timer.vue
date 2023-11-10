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
      currentState: 'Ready!',
      counter: 0,
      active: true,
      focusTime: 1500,
      shortBreakTime: 300,
      longBreakTime: 900
    }
  },
  methods: {
    startTimer(givenState) {
      clearInterval(this.timerId)
      this.active = false
      if (givenState == 'focus') {
        this.time = this.focusTime //1500
        this.currentState = 'Focus'
      } else if (givenState == 'shortBreak') {
        this.time = this.shortBreakTime //300
        this.currentState = 'Take a short Break'
      } else if (givenState == 'longBreak') {
        this.time = this.longBreakTime //900
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
          this.$refs.transitionSound.play()
        } else if (
          this.counter == 2 ||
          this.counter == 4 ||
          this.counter == 6 ||
          this.counter == 8
        ) {
          this.startTimer('focus')
          this.$refs.transitionSound.play()
        } else if (this.counter == 9) {
          this.startTimer('longBreak')
          this.$refs.transitionSound.play()
        } else if (this.counter == 10) {
          this.counter = 0
          this.startTimer('focus')
          this.$refs.transitionSound.play()
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
  <!--Main UI-->
  <div class="text-center container">
    <h4>{{ currentState }}</h4>
    <h1>{{ timeRemainingString }}</h1>
    <div
      class="progress mx-auto"
      role="progressbar"
      aria-label="Timer Progress"
      :aria-valuenow="time - timeNumber"
      aria-valuemin="0"
      :aria-valuemax="time"
      style="height: 20px; width: 25%"
    >
      <div
        class="progress-bar"
        :style="{ width: ((time - timeNumber) / time) * 100 + '%' }"
        style="background-color: black"
      ></div>
    </div>
    <button
      id="startTi"
      @click="startTimer('focus')"
      type="button"
      class="btn btn-dark"
      :class="{ disabled: !active }"
    >
      Study!
    </button>
  </div>
  <!--Audio Player-->
  <audio ref="transitionSound" style="display: none" controls>
    <source src="../assets/transition.mp3" type="audio/mpeg" />
  </audio>

  <!-- Settings-->
  <button type="button" class="btn btn-dark" data-bs-toggle="modal" data-bs-target="#settings">
    Settings
  </button>

  <!-- Popup -->
  <div
    class="modal fade"
    id="settings"
    tabindex="-1"
    aria-labelledby="settingsLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="settingsLabel">Settings</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form>
            <div class="input-group mb-3">
              <label for="inputFocusTime" class="form-label">Focus Time</label>
              <input
                type="number"
                class="form-control"
                id="inputFocusTime"
                aria-describedby="focusTime"
              />
              <span class="input-group-text" id="basic-addon2">Minutes</span>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Dismiss</button>
          <button type="button" class="btn btn-dark">Save changes</button>
        </div>
      </div>
    </div>
  </div>
</template>
