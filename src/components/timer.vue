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
      xTime: [1500, 300, 900]
    }
  },
  methods: {
    startTimer(givenState) {
      this.initialize()
      clearInterval(this.timerId) //clear latest Timer
      this.active = false //set Start Button to active
      //set Time according to givenState
      if (givenState == 'focus') {
        this.time = this.xTime[0] //1500
        this.currentState = 'Focus'
      } else if (givenState == 'shortBreak') {
        this.time = this.xTime[1] //300
        this.currentState = 'Take a short Break'
      } else if (givenState == 'longBreak') {
        this.time = this.xTime[2] //900
        this.currentState = 'Take a long Break'
      }
      this.timeNumber = this.time //inizialize timeNumber

      //calculate remaining Time
      this.timeRemainingHours = parseInt(this.timeNumber / 3600)
      this.timeRemainingMinutes = parseInt(this.timeNumber / 60) - this.timeRemainingHours * 60
      this.timeRemainingSeconds =
        this.timeNumber - this.timeRemainingMinutes * 60 - this.timeRemainingHours * 3600

      //initialized time remaining string
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
      //count
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
        //start next timer
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
    },
    setNewTimeValues() {
      this.xTime[0] = document.getElementById('inputFocusTime').value * 60
      this.xTime[1] = document.getElementById('inputShortBreakTime').value * 60
      this.xTime[2] = document.getElementById('inputLongBreakTime').value * 60
      localStorage.setItem('xTime0', this.xTime[0])
      localStorage.setItem('xTime1', this.xTime[1])
      localStorage.setItem('xTime2', this.xTime[2])
    },
    initialize() {
      //use saved values if they exist
      if (localStorage.getItem('xTime0') !== undefined) {
        this.xTime[0] = localStorage.getItem('xTime0')
        this.xTime[1] = localStorage.getItem('xTime1')
        this.xTime[2] = localStorage.getItem('xTime2')
      }
    },
    reset() {
      clearInterval(this.timerId) //clear latest Timer
      this.time = null
      this.timeNumber = null
      this.timeRemainingSeconds = null
      this.timeRemainingMinutes = null
      this.timeRemainingHours = null
      this.timeRemainingString = '00:00'
      this.timerId = null
      this.currentState = 'Ready!'
      this.counter = 0
      this.active = true
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
      id="startTimer"
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

  <!-- Settings Button-->
  <button
    @click="reset()"
    type="button"
    class="btn btn-dark"
    data-bs-toggle="modal"
    data-bs-target="#settings"
  >
    Settings
  </button>

  <!-- Settings Popup -->
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
            <div class="mb-3">
              <label for="inputFocusTime" class="form-label">Focus Time</label>
              <input
                type="number"
                class="form-control"
                id="inputFocusTime"
                aria-describedby="focusTimeHelp"
                :value="xTime[0] / 60"
              />
              <div id="focusTimeHelp" class="form-text">Recommended Time: 25 Minutes</div>
            </div>
            <div class="mb-3">
              <label for="inputShortBreakTime" class="form-label">Short Break Time</label>
              <input
                type="number"
                class="form-control"
                id="inputShortBreakTime"
                aria-describedby="shortBreakTimeHelp"
                :value="xTime[1] / 60"
              />
              <div id="shortBreakTimeHelp" class="form-text">Recommended Time: 5 Minutes</div>
            </div>
            <div class="mb-3">
              <label for="inputLongBreakTime" class="form-label">Long Break Time</label>
              <input
                type="number"
                class="form-control"
                id="inputLongBreakTime"
                aria-describedby="inputLongBreakTimeHelp"
                :value="xTime[2] / 60"
              />
              <div id="longBreakTimeHelp" class="form-text">Recommended Time: 15 Minutes</div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Dismiss</button>
          <button
            type="button"
            @click="setNewTimeValues()"
            data-bs-dismiss="modal"
            class="btn btn-dark"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
