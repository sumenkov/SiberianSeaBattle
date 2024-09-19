var  stompClient = new StompJs.Client({
            brokerURL: 'ws://localhost:8080/ws'
        });

stompClient.onConnect = (frame) => {
    setConnected(true);
    console.log('Connected: ' + frame);
    stompClient.subscribe('/see-battle/chat/response', (greeting) => {
        showGreeting(JSON.parse(greeting.body).content);
    });

    stompClient.subscribe(
          "/user/550e8400-e29b-41d4-a716-446655440000/queue/messages",
          (greeting) => {
                  showGreeting(greeting.body);
        });

    stompClient.subscribe(
              "/user/550e8400-e29b-41d4-a716-446655440099/see-battle/create-game/response",
              (greeting) => {
                      showGreeting(greeting.body);
            });
    stompClient.subscribe(
              "/user/550e8400-e29b-41d4-a716-446655440099/see-battle/create-fleet/response",
              (greeting) => {
                      showGreeting(greeting.body);
            });

    stompClient.subscribe(
              "/user/550e8400-e29b-41d4-a716-446655440099/see-battle/generate-fleet/response",
              (greeting) => {
                      showGreeting(greeting.body);
            });

    stompClient.subscribe(
               "/user/550e8400-e29b-41d4-a716-446655440099/see-battle/join-game-owner/response",
               (greeting) => {
                       showGreeting(greeting.body);
             });

    stompClient.subscribe(
           "/user/550e8400-e29b-41d4-a716-446655440099/see-battle/shot-game/response",
           (greeting) => {
                   showGreeting(greeting.body);
         });


    stompClient.subscribe(
          "/user/550e8400-e29b-41d4-a716-446655440077/see-battle/join-game/response",
          (greeting) => {
                  showGreeting(greeting.body);
        });

   stompClient.subscribe(
              "/user/550e8400-e29b-41d4-a716-446655440077/see-battle/fleet-opponent/response",
              (greeting) => {
                      showGreeting(greeting.body);
            });
   stompClient.subscribe(
             "/user/550e8400-e29b-41d4-a716-446655440077/see-battle/shot-game-owner/response",
             (greeting) => {
                     showGreeting(greeting.body);
           });
   stompClient.subscribe(
            "/user/777e8400-e29b-41d4-a716-446655440000/see-battle/matches/response",
            (greeting) => {
                    showGreeting(greeting.body);
          });
   stompClient.subscribe(
           "/user/777e8400-e29b-41d4-a716-446655440000/see-battle/match-history/request",
           (greeting) => {
                   showGreeting(greeting.body);
         });
   stompClient.subscribe(
           "/see-battle/notification-all/request",
           (greeting) => {
                   showGreeting(greeting.body);
         });

};

stompClient.onWebSocketError = (error) => {
    console.error('Error with websocket', error);
};

stompClient.onStompError = (frame) => {
    console.error('Broker reported error: ' + frame.headers['message']);
    console.error('Additional details: ' + frame.body);
};

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#game").html("");
}

function connect() {
    stompClient.brokerURL=$("#connect_name").val();
    stompClient.activate();
}

function disconnect() {
    stompClient.deactivate();
    setConnected(false);
    console.log("Disconnected");
}

function sendName() {
    var action = $("#combobox_topic").val();
    var bodyByAction = $("#name").val();
    stompClient.publish({
        destination: action,
        body: bodyByAction
    });
}

function comboboxTopicChange() {
    var action = $("#combobox_topic").val();
    var bodyByAction;
    switch (action) {
          case "/see-battle/chat/request":
            bodyByAction = JSON.stringify({'name': 'test chat', 'id':'550e8400-e29b-41d4-a716-446655440000' });
            break;
          case "/see-battle/create-game/request":
            bodyByAction = JSON.stringify({'username': 'username1', 'sizeGrid':5, 'chanelId':'550e8400-e29b-41d4-a716-446655440099' });
            break;
          case "/see-battle/create-fleet/request":
            bodyByAction = JSON.stringify({'matchId': '697b34cb-e49d-4dd2-a3cb-5c77e8886724', 'userId':'072f6c98-1f0f-453a-a08c-946b342353cd', 'grids': [[4,0,3,0,2],[4,0,3,0,0],[4,0,3,0,2],[4,0,0,0,0],[0,0,1,0,1]] });
            break;
          case "/see-battle/generate-fleet/request":
            bodyByAction = JSON.stringify({'matchId': '440e8400-e29b-41d4-a716-446655440000', 'userId':'7778400-e29b-41d4-a716-446655440000' });
            break;
          case "/see-battle/join-game/request":
            bodyByAction = JSON.stringify({'matchId':'440e8400-e29b-41d4-a716-446655440000' , 'username':'username2', 'chanelId':'550e8400-e29b-41d4-a716-446655440077' });
            break;
          case "/see-battle/shot-game/request":
            bodyByAction = JSON.stringify({'matchId': '440e8400-e29b-41d4-a716-446655440000', 'userId':'777e8400-e29b-41d4-a716-446655440000', 'x':1, 'y':2 });
            break;
          case "/see-battle/matches/request":
              bodyByAction = JSON.stringify({'matchStatus': 'WAIT', 'chanelId':'777e8400-e29b-41d4-a716-446655440000'});
              break;
          case "/see-battle/match-history/request":
              bodyByAction = JSON.stringify({'matchId': '777e8400-e29b-41d4-a716-446655440000', 'chanelId':'777e8400-e29b-41d4-a716-446655440000'});
              break;
          default:
                  alert( "Нет таких значений" );
      }
    $("#name").val(bodyByAction);

}

function showGreeting(message) {
    $("#message").append("<tr><td>" + message + "</td></tr>");
}

$(function () {
    $("form").on('submit', (e) => e.preventDefault());
    $( "#connect" ).click(() => connect());
    $( "#disconnect" ).click(() => disconnect());
    $( "#send" ).click(() => sendName());
    $('#combobox_topic').change(()=> comboboxTopicChange());
});