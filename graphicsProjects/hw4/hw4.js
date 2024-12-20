// sets up canvas and initializes values
function setup() {
    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext('2d');
    var slider1 = document.getElementById("slider1");
    slider1.value = 0;

    // draws to canvas
    function draw() {
        canvas.width = canvas.width;
        var value = parseFloat(slider1.value);

        // moves to coordinate x,y in specified coordinate system
        function moveToTx(x,y,Tx) {
            var res=vec2.create();
            vec2.transformMat3(res,[x,y],Tx);
            context.moveTo(res[0],res[1]);
        }

        // makes line from current position to x,y in specified coordinate system
        function lineToTx(x,y,Tx) {
            var res=vec2.create();
            vec2.transformMat3(res,[x,y],Tx);
            context.lineTo(res[0],res[1]);
        }

        // draws axes in specified coordinate system
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

        // draws a square with center at x,y
        function square(x, y, Tx) {
            context.strokeStyle = "green";
            context.beginPath();
            moveToTx(x+5,y+5,Tx);
            lineToTx(x+5, y-5, Tx); lineToTx(x - 5, y - 5, Tx); lineToTx(x - 5, y + 5, Tx); lineToTx(x + 5, y + 5, Tx);
            context.stroke();
        }

        // defines Hermite for input t, returns [b_0, b_1, b_2, b_3]
        function hermite(t) {
            return [(2*t*t*t) - (3*t*t) + 1, (t*t*t) - (2*t*t) + t, (-2*t*t*t) + (3*t*t), (t*t*t) - (t*t)];
        }

        function form1(t) {
            var x = Math.sin(t);
            var y = 5*Math.cos(t);
            return [x,y];
        }

        function form2(t) {
            var x = 0.8414709848 + (t*t);
            var y = (5 * 0.54030230586) + t;
            return [x,y];
        }

        // calculates curve point at t according to basis and P, returns curve point [x,y]
        function curve(basis,t,P) {
            var b = basis(t);
            var result = vec2.create();
            vec2.scale(result,P[0],b[0]);
            vec2.scaleAndAdd(result,result,P[1],b[1]);
            vec2.scaleAndAdd(result,result,P[2],b[2]);
            vec2.scaleAndAdd(result,result,P[3],b[3]);
            return result;
        }

        // draws curve from specified basis and P in coordinate system using specified number of intervals
        function drawCurve(basis, P, intervals, Tx, color) {
            var increment = 1.0 / intervals;
            context.strokeStyle = color;
            context.beginPath();
            moveToTx(P[0][0],P[0][1],Tx);
            for (let i = 0.0; i <= 1; i += increment) {
                var C_t = curve(basis, i, P);
                lineToTx(C_t[0], C_t[1], Tx);
            }
            context.stroke();
        }

        // Hermite Ps
        aP0 = [10,10]; aP1 = [20,100]; aP2 = [100,50]; aP3 = [0,50];
        aP = [aP0, aP1, aP2, aP3];
        bP0 = [100,50]; bP1 = [-10,20]; bP2 = [10,10]; bP3 = [20,100];
        bP = [bP0, bP1, bP2, bP3];

        axes("black", mat3.create());

        // transform to new coordinate system
        var start = mat3.create();
        mat3.translate(start, start, [0,400]);
        mat3.scale(start, start, [1,-1]);
        axes("red", start);

        // transform to new coordinate system
        var custom = mat3.create();
        mat3.scale(custom, start, [50, 50]);

        // draw Hermite
        drawCurve(hermite, aP, 100, start, "purple");
        drawCurve(hermite, bP, 100, start, "orange");

        // draw custom curves
        context.strokeStyle = "pink";
        context.beginPath();
        for (let i = 0.0; i <= 1; i+=0.1) {
            var xy = form1(i);
            lineToTx(xy[0], xy[1], custom);
        }
        context.stroke();

        context.strokeStyle = "green";
        context.beginPath();
        moveToTx(form2(0)[0], form2(0)[1], custom);
        for (let j = 0.0; j <= 1; j+=0.1) {
            var xy = form2(j);
            lineToTx(xy[0], xy[1], custom);
        }
        context.stroke();

        // draw square
        if (value < 1) {
            var cords = curve(hermite, value, aP);
        } else {
            var cords = curve(hermite, value - 1, bP);
        }
        square(cords[0], cords[1], start);
    }
    draw();
    slider1.addEventListener("input", draw);
}
window.onload = setup;