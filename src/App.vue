<script>
export default {
  data() {
    return {
      time: null,
      timeNumber: 0,
      timeRemainingSeconds: null,
      timeRemainingMinutes: null,
      timeRemainingHours: null,
      timeRemainingString: '00:00',
      timerId: null,
      currentState: 'Ready!',
      counter: 0,
      active: false,
      xTime: [1500, 300, 900],
      errorMessage: 'There has been an unexpected error!',
      todoList: [],
      timerWorker: null,
      shouldContinue: true,
      modalSettings: null,
      modalError: null,
      progressbarValue: '0%',
      taskInputKey: 0
    }
  },
  mounted() {
    if (
      localStorage.getItem('psg_auth_token') !== null &&
      localStorage.getItem('psg_last_login') !== null
    ) {
      this.loggedIn = true
    }

    this.timerWorker = new Worker('./src/timerworker.js')

    document.title = 'Studier'

    this.modalSettings = new bootstrap.Modal(document.getElementById('settings'))
    this.modalError = new bootstrap.Modal(document.getElementById('error'))

    if (localStorage.getItem('todoList') !== null) {
      this.todoList = JSON.parse(localStorage.getItem('todoList'))
    }
    // Set up an event listener to handle messages from the worker
    this.timerWorker.addEventListener('message', (e) => {
      if (e.data.timeNumber >= 0) {
        this.timeNumber = e.data.timeNumber
        this.counter = e.data.counter
        this.timeRemainingString = e.data.timeRemainingString
        this.shouldContinue = true
        if (e.data.currentState !== undefined) {
          this.currentState = e.data.currentState
        }
        this.timerId = setInterval(this.updateTime, 1000)
      } else {
        this.timeRemainingString = e.data
      }
    })

    //send new visibilty state to worker when change
    document.addEventListener('visibilitychange', () => {
      if (this.timeNumber !== 0) {
        let toSend = document.visibilityState
        this.timerWorker.postMessage(toSend)
      }
    })
  },
  watch: {
    timeRemainingString(newVal) {
      document.title = this.currentState + ' - ' + newVal
    }
  },
  methods: {
    startTimer(givenState) {
      this.initialize()
      clearInterval(this.timerId) // Clear the latest Timer
      this.active = true // deactivate Study! button

      // Set Time according to givenState
      if (givenState == 'focus') {
        this.time = this.xTime[0] // 1500
        this.currentState = 'Focus'
      } else if (givenState == 'shortBreak') {
        this.time = this.xTime[1] // 300
        this.currentState = 'Take a short Break'
      } else if (givenState == 'longBreak') {
        this.time = this.xTime[2] // 900
        this.currentState = 'Take a long Break'
      }
      this.timeNumber = this.time // Initialize timeNumber

      // Calculate remaining Time
      this.timeRemainingHours = parseInt(this.timeNumber / 3600)
      this.timeRemainingMinutes = parseInt(this.timeNumber / 60) - this.timeRemainingHours * 60
      this.timeRemainingSeconds =
        this.timeNumber - this.timeRemainingMinutes * 60 - this.timeRemainingHours * 3600

      // Initialize time remaining string
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
      this.progressbarValue = ((this.time - this.timeNumber) / this.time) * 100 + '%'
      // Start the timer using setInterval
      this.timerId = setInterval(this.updateTime, 1000)
    },
    updateTime() {
      if (document.visibilityState == 'visible') {
        if (this.timeNumber > 0) {
          //count
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
          clearInterval(this.timerId)
          // Stop the timer when remaining reaches 0
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
        this.progressbarValue = ((this.time - this.timeNumber) / this.time) * 100 + '%'
      } else if (this.shouldContinue == true && this.timeNumber !== 0) {
        clearInterval(this.timerId)
        let toSend = {
          timeNumber: this.timeNumber,
          counter: this.counter,
          xTime0: this.xTime[0],
          xTime1: this.xTime[1],
          xTime2: this.xTime[2]
        }
        this.timerWorker.postMessage(toSend)
        this.shouldContinue = false
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
    saveSettings() {
      let newTime = [
        document.getElementById('inputFocusTime').value,
        document.getElementById('inputShortBreakTime').value,
        document.getElementById('inputLongBreakTime').value
      ]

      if (newTime[0] >= 1 && newTime[1] >= 1 && newTime[2] >= 1) {
        this.xTime = [newTime[0] * 60, newTime[1] * 60, newTime[2] * 60]
        localStorage.setItem('xTime0', this.xTime[0])
        localStorage.setItem('xTime1', this.xTime[1])
        localStorage.setItem('xTime2', this.xTime[2])
        this.modalSettings.hide()
      } else {
        this.errorMessage = 'Really? You think you can trick my Software that easy? Try harder!'
        this.modalSettings.hide()
        this.modalError.show()
      }
    },
    initialize() {
      //use saved values if they exist and are allowed
      if (localStorage.getItem('xTime0') !== undefined) {
        if (localStorage.getItem('xTime0') > 0) {
          this.xTime[0] = localStorage.getItem('xTime0')
        } else {
          localStorage.setItem('xTime0', 1500)
          this.xTime[0] = 1500
          this.errorMessage = 'The value saved for Focus Time was invalid! It has been reset!'
          this.modalError.show()
        }
        if (localStorage.getItem('xTime1') > 0) {
          this.xTime[1] = localStorage.getItem('xTime1')
        } else {
          localStorage.setItem('xTime1', 300)
          this.xTime[1] = 300
          this.errorMessage = 'The value saved for Short Break Time was invalid! It has been reset!'
          this.modalError.show()
        }
        if (localStorage.getItem('xTime2') > 0) {
          this.xTime[2] = localStorage.getItem('xTime2')
        } else {
          localStorage.setItem('xTime2', 900)
          this.xTime[2] = 900
          this.errorMessage = 'The value saved for Long Break Time was invalid! It has been reset!'
          this.modalError.show()
        }
      }
    },
    reset() {
      clearInterval(this.timerId) // Clear the latest Timer
      this.time = 0
      this.timeNumber = 0
      this.timeRemainingSeconds = 0
      this.timeRemainingMinutes = 0
      this.timeRemainingHours = 0
      this.timeRemainingString = '00:00'
      this.timerId = null
      this.currentState = 'Ready!'
      this.counter = 0
      this.active = false
      this.progressbarValue = '0%'
      document.title = 'Studier'
    },
    pushNewTask() {
      let newTask = document.getElementById('taskInput').value
      if (Array.from(newTask).length > 0 && Array.from(newTask).length <= 28) {
        this.todoList.push(newTask)
        this.taskInputKey += 1
        localStorage.setItem('todoList', JSON.stringify(this.todoList))
      } else if (Array.from(newTask).length >= 28) {
        this.errorMessage = 'You exceeded the character limit of 28! Please shorten it!'
        this.modalError.show()
      } else if (Array.from(newTask).length == 0) {
        this.errorMessage = 'You cannot add an empty task!'
        this.modalError.show()
      }
    },
    startOrStopTimer() {
      if (this.active) {
        this.reset()
      } else {
        this.startTimer('focus')
      }
    },
    checkToDoItem(item) {
      const index = this.todoList.indexOf(item)
      this.todoList.splice(index, 1)
      localStorage.setItem('todoList', JSON.stringify(this.todoList))
    }
  }
}
</script>
<template>
  <div class="position-absolute top-50 start-50 translate-middle">
    <!-- Pomodoro -->
    <div class="text-center container" style="z-index: 1">
      <h4>{{ currentState }}</h4>
      <h1>{{ timeRemainingString }}</h1>
      <div>
        <div
          class="progress mx-auto"
          role="progressbar"
          aria-label="Timer Progress"
          aria-valuemin="0"
          :aria-valuemax="time"
          style="height: 20px; width: 200px"
        >
          <div
            class="progress-bar"
            :style="{ width: progressbarValue }"
            style="background-color: black"
          ></div>
        </div>
      </div>
      <button
        id="startTimer"
        @click="startOrStopTimer()"
        type="button"
        class="btn"
        :class="{ 'btn-dark': !active, 'btn-outline-dark': active }"
      >
        {{ active ? 'Stop Study' : 'Start Study' }}
      </button>
    </div>
    <!-- ToDo List -->
    <div class="hide">
      <div
        class="input-group w-25 position-absolute start-50 translate-middle-x"
        :key="taskInputKey"
        style="z-index: 3"
      >
        <input
          type="text"
          class="form-control"
          placeholder="Enter a Task (Press Enter)"
          aria-label="Task input"
          aria-describedby="taskInput"
          id="taskInput"
          @keyup.enter="pushNewTask()"
        />
      </div>

      <div class="card w-25" v-for="item in todoList" style="margin-top: 20px">
        <div
          class="card-body p-0 d-flex justify-content-between align-items-center"
          style="margin-left: 15px"
        >
          {{ item }}
          <button class="btn btn-outline-success" @click="checkToDoItem(item)">
            <i class="bi bi-check2"></i>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Error Popup -->
  <div class="modal fade" id="error" tabindex="-1" aria-labelledby="errorLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="errorLabel">Error</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>{{ errorMessage }}</p>
        </div>
        <div class="modal-footer">
          <button type="button" data-bs-dismiss="modal" class="btn btn-danger">Dismiss</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Settings Button-->
  <button
    @click="reset()"
    type="button"
    class="btn btn-dark position-absolute top-0 end-0 uiButton"
    data-bs-toggle="modal"
    data-bs-target="#settings"
  >
    <i class="bi bi-gear-fill"></i>
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
          <p class="">Account</p>
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
          <button type="button" @click="saveSettings()" class="btn btn-dark">Save changes</button>
        </div>
      </div>
    </div>
  </div>

  <!--Audio Player-->
  <audio ref="transitionSound" style="display: none" controls>
    <source src="/src/assets/transition.mp3" type="audio/mpeg" />
  </audio>

  <!--Footer bzw. GitHub Button-->
  <a
    href="https://github.com/lorige55/studier"
    target="_blank"
    class="position-absolute bottom-0 end-0 icon-link"
    style="margin: 10px; color: black"
  >
    <i class="bi bi-github"></i>
  </a>
</template>
