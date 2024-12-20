
function setup(){

    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');

    var slider1 = document.getElementById("slider1");
    var slider2 = document.getElementById("slider2");
    slider1.value = 200;
    slider2.value = 0;

    function draw() {
        canvas.width = canvas.width;

        function drawTriangle() {
            context.beginPath();
            context.fillStyle = "purple";
            context.moveTo(100,300);
            context.lineTo(300,300);
            context.lineTo(200,slider1.value);
            context.closePath();
            context.fill();
        }

        function drawRectangle() {
            var color = Number(slider2.value).toString(16).concat("A500");

            if (color.length != 6) {
                color = "0".concat(color);
            }
            context.beginPath();
            context.fillStyle = "#".concat(color);
            context.moveTo(20,20);
            context.lineTo(250,20);
            context.lineTo(250,100);
            context.lineTo(20,100);
            context.closePath();
            context.fill();
        }

        drawTriangle();
        drawRectangle();
    }

    slider1.addEventListener("input", draw);
    slider2.addEventListener("input", draw);

    draw();
}
setup();