function setup() {
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');
    var slider1 = document.getElementById("slider1");
    var slider2 = document.getElementById("slider2");
    var slider3 = document.getElementById("slider3");

    slider1.value = 375;
    slider2.value = 175;
    slider3.value = 1.2;

    var value_1;
    var length;
    var theta;

    var triangles;
    var game_active = false;

    var endLeft;
    var endRight;


    function draw() {
        canvas.width = canvas.width;
        value_1 = slider1.value;
        length = slider2.value;
        theta = slider3.value;
        
        function axes(color,Tx) {
            context.strokeStyle=color;
            context.beginPath();
            // Axes
            moveToTx(120,0,Tx);lineToTx(0,0,Tx);lineToTx(0,120,Tx);
            // Arrowheads
            moveToTx(110,5,Tx);lineToTx(120,0,Tx);lineToTx(110,-5,Tx);
            moveToTx(5,110,Tx);lineToTx(0,120,Tx);lineToTx(-5,110,Tx);
            // X-label
            moveToTx(130,-5,Tx);lineToTx(140,5,Tx);
            moveToTx(130,5,Tx);lineToTx(140,-5,Tx);
            // Y-label
            moveToTx(-5,130,Tx);lineToTx(0,135,Tx);lineToTx(5,130,Tx);
            moveToTx(0,135,Tx);lineToTx(0,142,Tx);
            context.stroke();
        }

        function moveToTx(x,y,Tx) {
            var res=vec2.create();
            vec2.transformMat3(res,[x,y],Tx);
            context.moveTo(res[0],res[1]);
        }

        function lineToTx(x,y,Tx) {
            var res=vec2.create();
            vec2.transformMat3(res,[x,y],Tx);
            context.lineTo(res[0],res[1]);
        }

        function distance(x,y) {
            var pass = false;

            var endRight_2d = [100,25];
            var endLeft_2d = [100,-25];

            endRight = vec2.create();
            endLeft = vec2.create();

            vec2.transformMat3(endRight, endRight_2d, canvas_to_orange);
            vec2.transformMat3(endLeft, endLeft_2d, canvas_to_yellow);

            var x_avg = (endRight[0] + endLeft[0]) / 2;
            var base = (endRight[0] - endLeft[0]) / 2;
            var height = Math.sqrt((50 ** 2) - (base ** 2));

            if ((Math.abs(x_avg - x) < 10) && (y > 50 + parseFloat(length)) && (y < parseFloat(length) + 50 + height)) {
                pass = true;
            }
            return pass;
        }

        function drawRectangle(x,y,Tx) {
            context.fillStyle="blue";
            context.beginPath();
            moveToTx(0,-25,Tx); lineToTx(100,-25,Tx); lineToTx(100,25,Tx); lineToTx(0,25,Tx); lineToTx(0,-25,Tx);
            context.fill();
        }

        function drawTriangle(x, y, Tx) {
            context.fillStyle = "red";
            context.beginPath();
            moveToTx(x - 10,y + 10,Tx); lineToTx(x + 10,y + 10,Tx); lineToTx(x,y - 10,Tx); lineToTx(x - 10,y + 10,Tx);
            context.fill();
        }

        function generateTriangles (){
            triangles = [];

            for (let i = 0; i < 5; i++) {
                var x_cor = (Math.random() * (750 - 50)) + 50;
                var y_cor = (Math.random() * (390 - 100)) + 100;
                const triangle = {
                    x: x_cor,
                    y: y_cor,
                    grabbed: false
                }

                drawTriangle(triangle.x, triangle.y, mat3.create());
                triangles.push(triangle);
            }
        }

        var canvas_to_blue = mat3.create();
        mat3.fromTranslation(canvas_to_blue, [value_1,25]);
        drawRectangle(0,0,canvas_to_blue);
        //axes("blue", canvas_to_blue);

        var canvas_to_red = mat3.create();
        mat3.translate(canvas_to_red, canvas_to_blue, [50, 25]);
        mat3.rotate(canvas_to_red, canvas_to_red, Math.PI / 2);
        //axes("red", canvas_to_red);

        context.beginPath();
        moveToTx(0,0,canvas_to_red);
        lineToTx(length,0,canvas_to_red);
        context.stroke();

        var red_to_green = mat3.create();
        mat3.translate(red_to_green, red_to_green, [length,0]);

        var canvas_to_green = mat3.create();
        mat3.multiply(canvas_to_green, canvas_to_red, red_to_green);
        //axes("green", canvas_to_green);

        var green_to_purple = mat3.create();
        mat3.rotate(green_to_purple, green_to_purple, -(theta * Math.PI) / 4);

        var green_to_pink = mat3.create();
        mat3.rotate(green_to_pink, green_to_pink, (theta * Math.PI) / 4);

        var canvas_to_purple = mat3.create();
        mat3.multiply(canvas_to_purple, canvas_to_red, red_to_green);
        mat3.multiply(canvas_to_purple, canvas_to_purple, green_to_purple);
        //axes("purple", canvas_to_purple);

        var canvas_to_pink = mat3.create();
        mat3.multiply(canvas_to_pink, canvas_to_red, red_to_green);
        mat3.multiply(canvas_to_pink, canvas_to_pink, green_to_pink);
        //axes("pink", canvas_to_pink);

        var canvas_to_orange = mat3.create();
        mat3.scale(canvas_to_orange, canvas_to_purple, [0.5,0.05]);
        //axes("orange", canvas_to_orange);
        drawRectangle(0,0,canvas_to_orange);

        var canvas_to_yellow = mat3.create();
        mat3.scale(canvas_to_yellow, canvas_to_pink, [0.5,0.05]);
        //axes("yellow", canvas_to_yellow);
        drawRectangle(0,0,canvas_to_yellow);


        if (!game_active) {
            generateTriangles();
            game_active = true;
        } else {
            for (let triangle of triangles) {
                if (!triangle.grabbed) {
                    drawTriangle(triangle.x, triangle.y, mat3.create());
                    if (distance(triangle.x, triangle.y)) {
                        triangle.grabbed = true;
                    }
                }
            }
        }

        

        axes("black", mat3.create());
    }

    draw();

    slider1.addEventListener("input", draw);
    slider2.addEventListener("input", draw);
    slider3.addEventListener("input", draw);

    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight") {
            slider1.value = parseInt(slider1.value) + 5;
            draw();
        }
        else if (event.key === "ArrowLeft") {
            slider1.value = parseInt(slider1.value) - 5;
            draw();
        }

        if (event.key === "ArrowUp") {
            slider2.value = parseInt(slider2.value) - 5;
            draw();
        }
        else if (event.key === "ArrowDown") {
            slider2.value = parseInt(slider2.value) + 5;
            draw();
        }

        if (event.key === "s") {
            slider3.value = parseFloat(slider3.value) + 0.1;
            draw();
        }
        else if (event.key === "a") {
            slider3.value = parseFloat(slider3.value) - 0.1;
            draw();
        }
    });
}
window.onload = setup;