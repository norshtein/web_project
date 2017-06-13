var socket = null;
var my_id = null;
navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
var media_stream = null;
var id_poll = [];
var connection_poll = [];
var peer =  null;
var connected = false;

document.addEventListener("DOMContentLoaded", function() {
    peer = new Peer({key: 'h0o3qr6xbq1o47vi'});
    peer.on('open',function(id){
        socket.emit('new_id',id);
        console.log('My peer ID is: ' + id);
        my_id = id;
    });
    peer.on('call',function(call){
        call.on('stream',function(stream){
            play_stream(stream);
        });
        call.answer(null);
    });

    var mouse = {
        click: false,
        move: false,
        pos: {x: 0, y: 0},
        pos_prev: false
    };

    var canvas = document.getElementById('drawing');
    var context = canvas.getContext('2d');
    var width = 800;
    var height = 600;
    canvas.width = width;
    canvas.height = height;
    socket = io.connect();

    canvas.width = width;
    canvas.height = height;

    canvas.onmousedown = function (e) {
        mouse.click = true;
    };
    canvas.onmouseup = function (e) {
        mouse.click = false;
    };

    canvas.onmousemove = function (e) {
        // normalize
        var rect = canvas.getBoundingClientRect();
        mouse.pos.x = (e.clientX - rect.left)/ width;
        mouse.pos.y = (e.clientY - rect.top)/ height;
        mouse.move = true;
    };

    socket.on('draw_line', function (data) {
        var line = data.line;
        context.beginPath();
        context.moveTo(line[0].x * width, line[0].y * height);
        context.lineTo(line[1].x * width, line[1].y * height);
        context.strokeStyle = "green";
        context.stroke();
        //console.log([line[0].x * width, line[0].y * height,line[1].x * width, line[1].y * height]);
    });

    socket.on('clear', function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
    });

    socket.on('refresh_id_poll',function (poll) {
        id_poll = poll;
        console.log(id_poll);
    });

   function mainLoop() {
      if (mouse.click && mouse.move && mouse.pos_prev) {
         socket.emit('draw_line', { line: [ mouse.pos, mouse.pos_prev ] });
         mouse.move = false;
      }
      mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};
      setTimeout(mainLoop, 25);
   }
   mainLoop();
});

function click_clear() {
    socket.emit('clear');
}

function open_connection() {
    get_media_stream();
    if(media_stream == null)
        return;
    for(var i = 0;i < id_poll.length;i++)
    {
        var dest_id = id_poll[i];
        if(dest_id == my_id)
            continue;
        connection_poll.push(peer.call(dest_id,media_stream));
    }
    connected = true;
    console.log(connection_poll);
}

function get_media_stream() {
    navigator.getUserMedia (
        {video: false, audio: true},
        function success(audioStream) {
            media_stream = audioStream;
        },

        function error(err) {
            alert("Can not get your microphone!");
        }
    );
}

function play_stream(stream) {
    var audio = $('<audio autoplay />').appendTo('body');
    audio[0].src = (URL || webkitURL || mozURL).createObjectURL(stream);
}

window.onunload = function(){
    socket.emit('remove',my_id);
}

function close_connection()
{
    console.log('trying disconnect');
    if(!connected)
        return;
    for(var i = 0;i < connection_poll.length;i++)
        connection_poll[i].close();
    connection_poll = [];
    connected = false;
}

