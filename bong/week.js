/**
 * @file week
 */

var moment = require('moment');

function fixNum(num) {
  return +(num.toFixed(2));
}

function getCalories(day) {

  var dayData = initDayData();

  // endTime: "2014-05-26 09:50:00"
  // calories: 123
  // startTime: "2014-05-26 09:26:00"
  
  day.forEach(function (chunk) {

    var start = moment(chunk.startTime).startOf('hour');
    var end = moment(chunk.endTime).endOf('hour');
    var diff = end.diff(start, 'hour');
    var hour = (+start.format('H'));
    var calories = chunk.calories || 0;

    if (diff > 0) {   
      for (var i = 0; i < diff; i++) {
        dayData[hour + i] += fixNum(+calories / (diff + 1));
      }
    } 
    else {

      dayData[hour] += fixNum(calories);
    }

  });
  
  return dayData;

}

function initDayData() {
  var data = [];
  for (var i = 0; i < 24; i++) {
    data.push(0);
  }
  return data;
}


function initWeekData() {
  var data = [];
  for (var i = 0; i < 7 * 24; i++) {
    data.push(0);
  }
  return data;
}

function weekCalories (day) {

  var weekData = initWeekData();

  for (var d = 0; d < day.length; d++) {

    var dayData = getCalories(day[d]);
    for (var h = 0; h < dayData.length; h++) {
      weekData[(d * 24 + h)] += dayData[h] ? fixNum(dayData[h]) : 0;
    }

  }

  return weekData;
}

module.exports.calories = weekCalories;