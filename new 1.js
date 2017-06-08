// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
 // 'uniform float pointSize; \n' + 
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = 10.0;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  // uniform
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';
  
 
 var mousePressed = false;      // Hold to value of mouse down
 var leftClick = false;         // Holds the value of left click
 var rightClick = false;        // Holds the value of right click


function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get storage location of pointSize
  var pointSize =gl.getUniformLocation(gl.program, 'pointSize');
  
  // Get the storage location of a_Position
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
  
  //Clears canvas if left mouse button is pressed twice
  canvas.ondblclick = function(ev)
  {
	 // Specify the color for clearing <canvas>
    gl.clearColor(0.5, 0.5, 0.5, 1.0);
    console.log('clearColor call');

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
    console.log('clear call'); 
	
	g_points = [];
	
	//redraw
	var len = g_points.length;
        for(var i = 0; i < len; i += 2) 
        {
			
            // Pass the position of a point to a_Position variable
            gl.uniform4fv(u_FragColor, g_colors[i/2]);
            gl.vertexAttrib3f(a_Position, g_points[i], g_points[i+1], 0.0);

            // Draw
            gl.drawArrays(gl.POINTS, 0, 1);
        }
  }
  
  //Changes canvas color to grey when the mouse is in the element
  canvas.onmouseover = function(ev)
  {
	// Specify the color for clearing <canvas>
    gl.clearColor(0.5, 0.5, 0.5, 1.0);
    console.log('clearColor call');

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
    console.log('clear call');  
	
	//redraw
	var len = g_points.length;
        for(var i = 0; i < len; i += 2) 
        {
            // Pass the position of a point to a_Position variable
            gl.uniform4fv(u_FragColor, g_colors[i/2]);
            gl.vertexAttrib3f(a_Position, g_points[i], g_points[i+1], 0.0);

            // Draw
            gl.drawArrays(gl.POINTS, 0, 1);
        }
  }

  //Changes canvas color back to black when the mouse is out of the element
  canvas.onmouseout = function(ev)
  {
	// Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    console.log('clearColor call');

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
    console.log('clear call'); 

	//redraw
	var len = g_points.length;
        for(var i = 0; i < len; i += 2) 
        {
            // Pass the position of a point to a_Position variable
            gl.uniform4fv(u_FragColor, g_colors[i/2]);
            gl.vertexAttrib3f(a_Position, g_points[i], g_points[i+1], 0.0);

            // Draw
            gl.drawArrays(gl.POINTS, 0, 1);
        }
  }
  
  
  // Calls if mouse is clicked
    canvas.onmousedown = function(ev)
    { 
    console.log('f1 called');
        // Figures out which click is being press down
        switch (ev.which)
        {
            case 1:         // left click
            leftClick = true;
            break;
            case 3:         // right click
            rightClick = true;
            break;
        }

        // Mouse is held down
        mousePressed = true;
    };

	// Tests if mousePressed == true while moving
    canvas.onmousemove = function(ev)
    {
        console.log('f2 called');
        if (mousePressed)
        {
            console.log('calling click');
           click(ev, gl, canvas, a_Position, u_FragColor, true); 
        }
    };

	//Calls when mouse is released and resets values
    canvas.onmouseup = function(ev)
    {
        console.log('f3 called');
        mousePressed = false;
        leftClick = false;
        rightClick = false;
    };

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    console.log('clearColor call');

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
    console.log('clear call');
}

var g_points = []; // The array for the position of a mouse
var g_colors = []; // Array for colors


function click(ev, gl, canvas, a_Position, u_FragColor, down) 
{
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

 // left click
    if (down == true && leftClick == true)
    {
        console.log('called left');
        // Store the coordinates to g_points array
        g_points.push(x); 
		g_points.push(y);

        // Store the color
        g_colors.push([1.0, 0.0, 0.0, 1.0]);

        // Clear <canvas>
        gl.clear(gl.COLOR_BUFFER_BIT);

        var len = g_points.length;

        for(var i = 0; i < len; i += 2) 
        {
            // Pass the position of a point to a_Position variable
            gl.uniform4fv(u_FragColor, g_colors[i/2]);
            gl.vertexAttrib3f(a_Position, g_points[i], g_points[i+1], 0.0);

            // Draw
            gl.drawArrays(gl.POINTS, 0, 1);
        }
    }
// right click
    else if (down == true && rightClick == true)
    {
        console.log('called right');
        // Store the coordinates to g_points array
        g_points.push(x); g_points.push(y);

        // Store the color
        g_colors.push([0.0, 0.0, 1.0, 1.0]);
		
		//gl.vertexAttrib3f(pointSize, 100.0);

        // Clear <canvas>
        gl.clear(gl.COLOR_BUFFER_BIT);

        var len = g_points.length;
        for(var i = 0; i < len; i += 2) 
        {
            // Pass the position of a point to a_Position variable
            gl.uniform4fv(u_FragColor, g_colors[i/2]);
            gl.vertexAttrib3f(a_Position, g_points[i], g_points[i+1], 0.0);

            // Draw
            gl.drawArrays(gl.POINTS, 0, 1);
        }
    }
}


