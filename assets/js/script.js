class Workday {
  /**
   * Creates a workday calendar of events.
   * @param {dayjs} dayjsObj dayjs object for the day.
   */
  constructor(dayjsObj) {
    this.wday = dayjsObj.format("dddd");
    this.month = dayjsObj.format("MMMM");
    this.day = dayjsObj.format("D");
    this.year = dayjsObj.format("YYYY");
    this.schedule = new Schedule(dayjsObj);
  }
  /**
   * Displays the current date in the browser
   */
  showDate() {
    var todayText = `
      ${this.wday},
      ${this.month}  
      ${this.day},
      ${this.year}.
    `;
    $("#currentDay").text(todayText);
  }
};


class Schedule {
  /**
   * Creates a schedule of timeblocks for the workday
   * @param {dayjs} dayjsObj dayjs object for the day.
   */
  constructor(dayjsObj) {
    this.nineAM = new TimeBlock(dayjsObj, 9, "nine-am");    
    this.tenAM = new TimeBlock(dayjsObj, 10, "ten-am");
    this.elevenAM = new TimeBlock(dayjsObj, 11, "eleven-am");
    this.twelvePM = new TimeBlock(dayjsObj, 12, "twelve-pm");
    this.onePM = new TimeBlock(dayjsObj, 13, "one-pm");
    this.twoPM = new TimeBlock(dayjsObj, 14, "two-pm");
    this.threePM = new TimeBlock(dayjsObj, 15, "three-pm");
    this.fourPM = new TimeBlock(dayjsObj, 16, "four-pm");
    this.fivePM = new TimeBlock(dayjsObj, 17, "five-pm");
  }
  
  /**
   * Updates current status of tasks
   */
  updateStatus() {
    for (const timeblock in this) {
      this[timeblock].updateStatus();
    }
  }
  
  /**
   * Creates all time block elements
   */
  createSchedule() {
    for (const timeblock in this) {
      this[timeblock].createTimeBlockEl();
    }
  }
};


class TimeBlock {
  /**
   * Creates a 1h time block for the user to input descriptions of events.
   * @param {dayjs} dayjsObj dayjs object of the respective date.
   * @param {number} timeStart Time timeblock starts.
   * @param {string} id ID name for associated HTML element.
   */
  constructor(dayjsObj, timeStart, id) {
    this.name = `${timeStart}`;
    this.start = dayjsObj
      .hour(timeStart)
      .minute(0)
      .second(0)
      .millisecond(0);
    this.end = this.start.add(1, 'hour');
    this.id = id;
  }

  /**
   * Checks the time block's position in relation to now
   * @returns 
   */
  status() {
    var now = dayjs();
    if (now.isBefore(this.start)) {
      return "future";
    }
    else if (now.isBefore(this.end)) {
      return "present";
    }
    else {
      return "past";
    }
  }
  
  /**
   * Updates the tasks color
   */
  updateStatus() {
    $(`#${this.id} > .description`)
      .removeClass("past future present")
      .addClass(this.status());
  }
  
  /**
   * Creates the HTML element
   */
  createTimeBlockEl() {
    // creating root element
    $("<div>")
      .attr("id", this.id)
      .addClass("row time-block")
      .appendTo("#time-block-container");
    // hour element
    $("<div>")
      .addClass("col-2 col-md-1 hour")
      .text(this.name)
      .appendTo(`#${this.id}`);
    // description element
    $("<div>")
      .addClass("col-8 col-md-10 description")
      .text(this.loadDescription())
      .appendTo(`#${this.id}`);
    // button element
    $("<button>")
      .addClass("col-2 col-md-1 saveBtn bi bi-lock-fill fa-lg")
      .appendTo(`#${this.id}`);
    // update status
    this.updateStatus();
    this.makeClickable();
  }
  
  /**
   * Creates click functionality
   */
  makeClickable() {
    // user can edit text
    $(`#${this.id}`).on("click", "div.description", function() {
      var currentText = $(this)
        .text()
        .trim();
      var currentClass = $(this).attr('class');
      var textInput = $("<textarea>")
        .addClass(currentClass)
        .text(currentText);
      $(this).replaceWith(textInput);
      textInput.trigger("focus");
    });

    // convert editable area back to div
    $(`#${this.id}`).on("blur", "textarea.description", function() {
      var currentText = $(this)
        .val()
        .trim();
      var currentClass = $(this).attr('class');
      var textInput = $("<div>")
        .addClass(currentClass)
        .text(currentText);
      $(this).replaceWith(textInput);
    });

    // opens lock if description changes
    $(`#${this.id}`).bind("input propertychange", function() {
      $(`#${this.id} > button`)
        .removeClass("bi-lock-fill")
        .addClass("bi-unlock-fill");
    });
    
    // saves and closes lock icon
    $(`#${this.id}`).on("click", "button", this, function(event) {
        $(this)
          .removeClass("bi-unlock-fill")
          .addClass("bi-lock-fill");
        event.data.saveDescription();
    });
  }
  
  /**
   * Saves the description to localstorage
   */
  saveDescription() {
    var currentText = $(`#${this.id} > .description`).text()
    localStorage.setItem(this.id, JSON.stringify(currentText));
  }
  
  /**
   * Gets the description from localsorage
   * @returns {string} Time block's saved description
   */
  loadDescription() {
    return JSON.parse(localStorage.getItem(this.id));
  }
};


$(document).ready(function() {
  // creating website content
  var today = new Workday(dayjs());
  today.showDate();
  today.schedule.createSchedule();
  // updates colors each minute
  setInterval(today.schedule.updateStatus(), 60000)
});