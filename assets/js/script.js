

$(document).ready(function() {
  var dateFormat = "dddd, MMMM D, YYYY h:mm A";
  var dateNow = dayjs().format(dateFormat);
  $("#currentDay").text(dateNow);
});
