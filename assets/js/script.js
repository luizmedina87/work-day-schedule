class Workday {
  /**
   * Creates a workday calendar of events.
   * @param {object} dayjsObj dayjs object for the day.
   */
  constructor(dayjsObj) {
    this.wday = dayjsObj.format("dddd");
    this.month = dayjsObj.format("MMMM");
    this.day = dayjsObj.format("D");
    this.year = dayjsObj.format("YYYY");
    this.nineAM = new Timeblock(9, "");    
    this.tenAM = new Timeblock(10, "");
    this.elevenAM = new Timeblock(11, "");
    this.twelvePM = new Timeblock(12, "");
    this.onePM = new Timeblock(13, "");
    this.twoPM = new Timeblock(14, "");
    this.threePM = new Timeblock(15, "");
    this.fourPM = new Timeblock(16, "");
    this.fivePM = new Timeblock(17, "");    
  }
};

class Timeblock {
  /**
   * Creates a 1h timeblock for the user to input tasks and events.
   * @param {number} timeStart Time timeblock starts.
   * @param {string} task Task or event that will take place.
   */
  constructor(timeStart, task) {
    this.timeStart = dayjs()
      .hour(timeStart)
      .minute(0)
      .second(0)
      .millisecond(0);
    this.timeEnd = this.timeStart
      .add(1, 'hour')
      .subtract(1, 'millisecond');
    this.task = task;
  }
};

/**
 * Displays the current date in the browser
 */
function showDate(currentDate) {
  todayText = `
    ${currentDate.wday},
    ${currentDate.month}  
    ${currentDate.day},
    ${currentDate.year}.
  `;
  $("#currentDay").text(todayText);
}

// functions to execute after page loading
$(document).ready(function() {
  var today = new Workday(dayjs());
  showDate(today);
});
