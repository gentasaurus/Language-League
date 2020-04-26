var duoAuth;
var userData;

$(document).ready(function(){
  // TestBoyMan
  // Testaccount
  $.ajax({
    type: 'POST',
    url: "https://www.duolingo.com/login",
    data: {"login": "TestBoyMan", "password": "Testaccount"},
    success: function(data, textStatus, request){
        var headers = request.getAllResponseHeaders().split("\n");
        var i;
        for(i = 0; i < headers.length; i++) {
          if(headers[i].startsWith("jwt")) {
            duoAuth = headers[i].substring(5);
            requestData(data.username);
          }
        }
    }
 });

});

function requestData(username) {
  if(duoAuth != null) {
    /* TODO: figure out why we can't retrieve data */
    $.ajax({
      type: 'GET',
      crossDomain: true,
      dataType: "json",
      headers: {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, OPTIONS", "Access-Control-Allow-Headers": "*", "Authorization": "Bearer " + duoAuth},
      cookie: document.cookie,
      url: "https://www.duolingo.com/users/" + username,
      success: function(data, textStatus, request){
        var resp = JSON.parse(data);
      }
    });

  } else {
    alert("Failed to access Duolingo API");
  }
}
