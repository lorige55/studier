//initialize variables
let timeNumber
let counter
let timeRemainingString
let timerId
let timeRemainingHours
let timeRemainingMinutes
let timeRemainingSeconds
let xTime = [1500, 300, 900]
let currentState
let time
let visibilityState = 'hidden'

//receive messages
self.addEventListener('message', function (e) {
  let data = e.data
  if (data.timeNumber !== undefined) {
    timeNumber = data.timeNumber
    counter = data.counter
    timeRemainingString = data.timeRemainingString
    xTime[0] = data.xTime0
    xTime[1] = data.xTime1
    xTime[2] = data.xTime2
    currentState = data.currentState
    time = data.time
    timerId = setInterval(updateTime, 1000)
  } else {
    visibilityState = data
    if (visibilityState == 'visible') {
      clearInterval(timerId)
      let toSend = {
        timeNumber: timeNumber,
        counter: counter,
        timeRemainingString: timeRemainingString,
        xTime: xTime,
        currentState: currentState,
        time: time
      }
      self.postMessage(toSend)
    }
  }
})

//updateTime
function updateTime() {
  if (visibilityState == 'hidden') {
    if (timeNumber > 0) {
      //count
      timeNumber--
      timeRemainingHours = parseInt(timeNumber / 3600)
      timeRemainingMinutes = parseInt(timeNumber / 60) - timeRemainingHours * 60
      timeRemainingSeconds = timeNumber - timeRemainingMinutes * 60 - timeRemainingHours * 3600

      if (timeRemainingHours !== 0) {
        timeRemainingString =
          formatNumber(timeRemainingHours) +
          ':' +
          formatNumber(timeRemainingMinutes) +
          ':' +
          formatNumber(timeRemainingSeconds)
      } else {
        timeRemainingString =
          formatNumber(timeRemainingMinutes) + ':' + formatNumber(timeRemainingSeconds)
      }
    } else {
      clearInterval(timerId)
      // Stop the timer when remaining reaches 0
      counter++
      //start next timer
      if (counter == 1 || counter == 3 || counter == 5 || counter == 7) {
        startTimer('shortBreak')
        //sound should play here
      } else if (counter == 2 || counter == 4 || counter == 6 || counter == 8) {
        startTimer('focus')
        //sound should play here
      } else if (counter == 9) {
        startTimer('longBreak')
        //sound should play here
      } else if (counter == 10) {
        counter = 0
        startTimer('focus')
        //sound should play here
      }
    }
  }
}

function startTimer(givenState) {
  initialize()
  clearInterval(timerId) // Clear the latest Timer

  // Set Time according to givenState
  if (givenState == 'focus') {
    time = xTime[0] // 1500
    currentState = 'Focus'
  } else if (givenState == 'shortBreak') {
    time = xTime[1] // 300
    currentState = 'Take a short Break'
  } else if (givenState == 'longBreak') {
    time = xTime[2] // 900
    currentState = 'Take a long Break'
  }
  timeNumber = time // Initialize timeNumber

  // Calculate remaining Time
  timeRemainingHours = parseInt(timeNumber / 3600)
  timeRemainingMinutes = parseInt(timeNumber / 60) - timeRemainingHours * 60
  timeRemainingSeconds = timeNumber - timeRemainingMinutes * 60 - timeRemainingHours * 3600

  // Initialize time remaining string
  if (timeRemainingHours !== 0) {
    timeRemainingString =
      formatNumber(timeRemainingHours) +
      ':' +
      formatNumber(timeRemainingMinutes) +
      ':' +
      formatNumber(timeRemainingSeconds)
  } else {
    timeRemainingString =
      formatNumber(timeRemainingMinutes) + ':' + formatNumber(timeRemainingSeconds)
  }

  // Start the timer using setInterval
  timerId = setInterval(updateTime, 1000)
}

function formatNumber(number) {
  if (String(number).length == 1) {
    let result = '0' + number
    return result
  } else {
    return number
  }
}

function initialize() {
  //use saved values if they exist
  if (localStorage.getItem('xTime0') !== undefined) {
    xTime[0] = localStorage.getItem('xTime0')
    xTime[1] = localStorage.getItem('xTime1')
    xTime[2] = localStorage.getItem('xTime2')
  }
}
