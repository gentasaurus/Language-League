var duoAuth;
var competitors = ['OctavianDo4', 'GentSemaj', 'Konnor703548', 'blaisebot'];
var userdata = [];

$(document).ready(function(){
  // TestBoyMan
  // Testaccount
  $.ajax({
    type: 'POST',
    url: "https://young-bastion-39680.herokuapp.com/https://www.duolingo.com/login",
    data: {"login": "TestBoyMan", "password": "Testaccount"},
    success: function(data, textStatus, request){
        var headers = request.getAllResponseHeaders().split("\n");
        var i;
        for(i = 0; i < headers.length; i++) {
          if(headers[i].startsWith("jwt")) {
            duoAuth = headers[i].substring(5);
          }
        }

        if(duoAuth !=  null) {
          console.log("Got jwt");
          requestData(0);
        } else {
          alert("Failed to access Duolingo API");
        }
    }
 });
});

function requestData(index) {
  if(index < competitors.length) {
    var username = competitors[index];
    $.ajax({
      type: 'GET',
      cache: false,
      headers: {'Authorization': "Bearer " + duoAuth},
      url: "https://young-bastion-39680.herokuapp.com/https://www.duolingo.com/users/" + username,
      success: function(data, textStatus, request){
        if(request.status == 200) {
          userdata[index] = data;
          console.log("User " + index + " is loaded");
          requestData(index + 1);
          /* This is done recursively to "synchronously"
          load all user data. Using the actual async property
          causes the page to freeze. */
        }
      }
    });
  } else {
    duoInit();
  }
}

function getXP(index) {
  return Object.values(userdata[index].language_data)[0].points;
}

function getLastSunday() {
  var date = new Date(Date.now()); // get current date
  // subtract days until we hit the last sunday
  while(date.getDay() > 0) {
    date.setDate(date.getDate() - 1);
  }
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);

  return date;
}

function getWeeklyXP(index) {
  var sum = 0;
  var sunday = getLastSunday();
  var cal = userdata[index].calendar;
  for(e = 0; e < cal.length; e++) {
    if(cal[e].datetime > sunday.getTime()) {
      sum += cal[e].improvement;
    }
  }

  return sum;
}

function getAvi(index) {
  return "https://" + userdata[index].avatar.substring(2) + "/medium";
}

function getFlag(lng) {
  return "images/flags/" + lng + ".png";
}

function updateWidgets() {

  // XP bar graph
  var pMax = 0; // maximum point value
  for(var i = 0; i < userdata.length; i++) {
    var points = getWeeklyXP(i);
    if(points > pMax) {
      pMax = points;
    }
  }

  for(var j = 0; j < userdata.length; j++) {
    var pct = getWeeklyXP(j) * 0.98 / pMax;
    var barID = "bar-" + competitors[j];
    $("#xp-graph").append("<tr><td class='avi'><img src='" + getAvi(j) + "' /></td><td id='" + barID + "'class='xp-bar'>" + getWeeklyXP(j) + " XP</td></tr>");
    $("#" + barID).animate({
      width: pct*100 + "%",
      opacity: 1
    }, 2000);
  }

  // Current languages
  for(var k = 0; k < userdata.length; k++) {
    $("#languages").append("<tr><td class='avi'><img src='" + getAvi(k) + "' /></td><td><img class='flag' src='" + getFlag(userdata[k].learning_language) + "' /></td><td class='langName'>" + userdata[k].learning_language_string + "</td></tr>");
  }
}

function duoInit() {

  console.log("Initializing");

  /* Remove spinners */
  $(".spinner").animate({
    opacity: 0
  }, 500, function(){
    this.remove();
    if($(".spinner").length == 0) {
      updateWidgets();
    }
  });

}
