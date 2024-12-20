
function setup(){

    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');
    var bike_location = 0;
    var angle_constant = 0;

    function draw() {

        function axes(color) {
            context.strokeStyle=color;
            context.beginPath();
            // Axes
            context.moveTo(120,0);context.lineTo(0,0);context.lineTo(0,120);
            // Arrowheads
            context.moveTo(110,5);context.lineTo(120,0);context.lineTo(110,-5);
            context.moveTo(5,110);context.lineTo(0,120);context.lineTo(-5,110);
            // X-label
            context.moveTo(130,-5);context.lineTo(140,5);
            context.moveTo(130,5);context.lineTo(140,-5);
            // Y-label
            context.moveTo(-5,130);context.lineTo(0,135);context.lineTo(5,130);
            context.moveTo(0,135);context.lineTo(0,142);
            
            context.stroke();
        }

        function wheel() {
            context.save();
            context.rotate((-angle_constant * Math.PI) / 6);

            function spokes() {
                var theta = Math.PI / 3;
                context.beginPath(); context.moveTo(0,0); context.lineTo(40,0); context.stroke();

                for (var i = 0; i < 6; i++) {
                    context.rotate(theta);
                    context.beginPath(); context.moveTo(0,0); context.lineTo(40,0); context.stroke();
                }

                context.restore();
            }
            
            // circle for wheel
            context.beginPath();
            context.arc(0,0,40,0,2 * Math.PI);
            context.stroke();

            spokes();
            
        }

        function brace() {
            context.beginPath(); context.moveTo(0,0); context.lineTo(60,0); context.lineTo(60,5); context.lineTo(0,5); context.closePath; context.fill();
        }

        function bike(color) {
            context.fillStyle = color;
            context.strokeStyle = color;

            context.save();
            wheel();
            brace();

            context.rotate(Math.PI / 4);
            brace();

            context.translate(56,2);
            context.rotate(-Math.PI / 4);
            brace();

            context.rotate(-Math.PI / 3);
            brace();

            context.restore();
            context.save();

            context.translate(60,0);
            context.rotate(Math.PI / 4);
            brace();

            context.translate(56,2);
            context.rotate(-Math.PI / 2);
            brace();

            context.restore();
            context.translate(140,0);
            wheel();

        }


        function animate() {
            // "ground rectangle"
            canvas.width = canvas.width;
            context.translate(0, 200);
            context.beginPath(); context.moveTo(0,41), context.lineTo(800,41); context.lineTo(800,61), context.lineTo(0,61); context.closePath(); context.fillStyle = "green"; context.fill();
            context.translate(50,0);

            if (bike_location + 2 > 550) {
                bike_location = 0;
            } else {
                bike_location += 2;
            }

            context.scale(1,-1);
            context.translate(bike_location, 0);
            bike("blue");

            if (angle_constant >= 12) {
                angle_constant = 0;
            } else {
                angle_constant += .15;
            }

            requestAnimationFrame(animate);
        }
        animate();

    }
    draw();
}
setup();