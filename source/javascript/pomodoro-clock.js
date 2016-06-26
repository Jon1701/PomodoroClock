function launchTimer() {

  // Check to see which timer is currently supposed to be running.
  if (currentTimerStage === "session") {

    // Check to see if the session timer has been created.
    //
    // If it has already been created, then it was paused, and will
    // continue counting down.
    //
    // If it has not been created, create it.
    timerSession = setInterval(timerSessionFunction, 1000);

  } else if (currentTimerStage === "break") {

    timerBreak = setInterval(timerBreakFunction, 1000);

  }

}


function timerSessionFunction() {

    // Decrease session duration.
    numSecondsSession = numSecondsSession - 1;

    // Format session duration from seconds to MM:SS.
    var mmss = formatMinutesCountdown(numSecondsSession);

    // Clear timer when it reaches 0.
    if (numSecondsSession <= 0) {

      // Clear timer.
      clearInterval(timerSession);
      timerSession = null;

      // Reset numSecondsSession.
      numSecondsSession = parseInt($("#controlSessionDuration > .value").text()) * 60;

      // Update label on clock.
      $("#clockLabelSession > .clockTime").text(formatMinutesCountdown(numSecondsSession));

      // Set timer stage to break.
      currentTimerStage = "break";

      // Hide session label on clock.
      $("#clockLabelSession").addClass("hidden");

      // Show break label on clock.
      $("#clockLabelBreak").removeClass("hidden");

      // Start break timer.
      // Run every 1000ms = 1s.
      timerBreak = setInterval(timerBreakFunction, 1000);

      // Return to prevent updating clock label.
      return;
    }

    // Show duration in MM:SS in the clock label.
    $("#clockLabelSession > .clockTime").text(mmss);

}

function timerBreakFunction() {

    // Decrease break duration.
    numSecondsBreak = numSecondsBreak - 1;

    // Format break duration from seconds to MM:SS.
    var mmss = formatMinutesCountdown(numSecondsBreak);

    // Clear timer when it reaches 0.
    if (numSecondsBreak <= 0) {

      // Clear timer.
      clearInterval(timerBreak);
      timerBreak = null;

      // Reset numSecondsBreak.
      numSecondsBreak = parseInt($("#controlBreakDuration > .value").text()) * 60;

      // Update label on clock.
      $("#clockLabelBreak > .clockTime").text(formatMinutesCountdown(numSecondsSession));

      // Set timer stage to session.
      currentTimerStage = "session";

      // Hide session label on clock.
      $("#clockLabelBreak").addClass("hidden");

      // Show session label on clock.
      $("#clockLabelSession").removeClass("hidden");

      // Return to prevent updating clock label.
      return launchTimer();
    }

    // Show duration in MM:SS in the clock label.
    $("#clockLabelBreak > .clockTime").text(mmss);

}

function formatMinutesCountdown(totalSeconds) {

  // Convert total number of seconds to minutes.
  var minutes = String(parseInt(totalSeconds / 60));

  // Get the number of seconds past the minute.
  var seconds = totalSeconds % 60;

  // If the number is less than 10 seconds, add a preceding 0.
  if (seconds < 10) {
    seconds = "0" + String(seconds);
  }

  // Return formatted string of the form: MM:SS.
  return minutes + ":" + seconds;

}

// Callback function for controlling the + and - buttons
// to control the break and session durations.
function plusMinusControls() {

  if (active === false) {
    // Get the class of the button which was just pressed.
    // Either .minus or .plus.
    var className = $(this).attr("class");

    // Find the parent, and access its child .value button.
    var btnValue = $(this).parent().children(".value");

    // Get the parent div node.
    //
    // The id should either be controlBreakDuration or controlSessionDuration.
    var parentId = $(this).parent("div").attr("id");

    // Get the current value;
    var currentValue = Number(btnValue.text());

    // Modify the button with class .value to increment or decrement by 1
    // depending if the button clicked was a - or +.
    if (className === "minus") {

      if (currentValue > 1) {

        // Decrement button text by 1.
        btnValue.text(currentValue-1);

        // Decrement variables by 1.
        if (parentId === "controlBreakDuration") {

          // Decrease break duration.
          numSecondsBreak = (currentValue - 1)*60;

          // Modify clock label.
          $("#clockLabelBreak > .clockTime").text(formatMinutesCountdown(numSecondsBreak));

        } else {

          // Decrease session duration.
          numSecondsSession = (currentValue - 1)*60;

          // Modify clock label.
          $("#clockLabelSession > .clockTime").text(formatMinutesCountdown(numSecondsSession));

        }

      } else {

        // Ensure the minimum value is always 1.
        btnValue.text(1);

      }

    } else if (className === "plus") {

        // Increment button text by 1.
        btnValue.text(currentValue+1);

        // Increment variables by 1.
        if (parentId === "controlBreakDuration") {

          // Increase break duration.
          numSecondsBreak = (currentValue + 1)*60;

          // Modify clock label.
          $("#clockLabelBreak > .clockTime").text(formatMinutesCountdown(numSecondsBreak));

        } else {

          //Increase session duration.
          numSecondsSession = (currentValue + 1)*60;

          // Modify clock label.
          $("#clockLabelSession > .clockTime").text(formatMinutesCountdown(numSecondsSession));

        }
    }
  }
}

$(document).ready(function() {

  // Current state of the clock.
  active = false;

  // Number of minutes for session and break
  numSecondsBreak = 60;
  numSecondsSession = 60;

  // Time stage: session, or break.
  currentTimerStage = "session";

  // Timers
  timerBreak = null;
  timerSession = null;





  // Increments/Decrements the .value button text by 1 when the
  // .minus or .plus buttons are pressed.
  $(".minus, .plus").on("click", plusMinusControls);


  $("#clock").on("click", function() {

      // Toggle active variable.
      if (active === true) {

        // If clock is active, set to inactive.
        active = false;

        // Change clock background color.
        $("#clock").css("background", "transparent");

        // Clear all timers.
        clearInterval(timerSession);
        timerSession = null;

        clearInterval(timerBreak);
        timerBreak = null;

      } else if (active === false) {

        // If clock is inactive, set to active.
        active = true;

        // Change clock background color.
        $("#clock").css("background-color", "#ED5565");

        // Activate the timer.
        launchTimer();





      }
  })
});