var socket = null;
document.addEventListener("DOMContentLoaded", function() {
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
        console.log([line[0].x * width, line[0].y * height,line[1].x * width, line[1].y * height]);
    });

    socket.on('clear', function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
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

function click_clear()
{
    socket.emit('clear');
}