// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API
function visualizationInit() {
    ! function() {
        var n = function(t) {
            function e(e, a, c) {
                if (y.audio = null != t ? t : new Audio, i = null != e ? e : 32, u = null != a ? a : .1, s = null != c ? c : !1, "string" == typeof y.audio) {
                  var p = y.audio;
                    y.audio = new Audio;
                    y.audio.crossOrigin = "anonymous";
                    y.audio.controls = !0;
                    y.audio.src = p;
                }
                audioCTX = new n.AudioContext;
                distortion = audioCTX.createScriptProcessor(1024, 1, 1);
                analyser = audioCTX.createAnalyser();
                analyser.smoothingTimeConstant = u;
                analyser.fftSize = 2 * i, f = !1;
                y.bands = new Uint8Array(analyser.frequencyBinCount);
                y.audio.addEventListener("play", o, !1);
            }

            function o() {
                f || (source = audioCTX.createMediaElementSource(y.audio), source.connect(analyser), analyser.connect(distortion), distortion.connect(audioCTX.destination), s || source.connect(audioCTX.destination), distortion.onaudioprocess = a, f = !0)
            }

            function a(n) {
                analyser.getByteFrequencyData(y.bands);
                for (var t = n.outputBuffer.getChannelData(0), e = n.inputBuffer.getChannelData(0), o = 0, a = 0; a < e.length; a++) t[a] = 0, o = e[a] > o ? e[a] : o;
                y.energy = o, y.decibels = 20 * Math.log(Math.max(o, Math.pow(10, -3.6))) / Math.LN10, y.audio.paused || null != y.onUpdate && "function" == typeof y.onUpdate && y.onUpdate(y.bands, y.decibels, y.energy)
            }
            var i, u, s, audioCTX, distortion, analyser, source, f, y = this;
            e()
        };
        n.prototype.start = function() {
          console.log("Starting audio from player.js");
        }
        n.prototype.stop = function() {
            return this.audio.pause()
        };
        n.AudioContext = window.AudioContext || window.webkitAudioContext;
        n.enabled = null != n.AudioContext;
        window.AudioAnalyser = n
    }(),
    function() {
        window.Analyser = function(n) {
            console.log(n);
            function t() {
                i++, Analyser.energy = Math.sin(i / u) * s;
                for (var n = 0; n < Analyser.bands.length; n++) Analyser.bands[n] = Math.sin((n + i) / u) * (255 * Math.random())
            }
            this.numOfBands = 32, this.smoothing = .3;
            var e, o, a = 16,
                i = 0,
                u = 15,
                s = .6,
                r = this;
            this.init = function(a, i) {
                var u;
                u = n ? n : `https://dhrstreasdasam.ml/playlist.ogg?_=${Math.random()}`;    // Backup if not specified by ID ---
                r.numOfBands = null != a ? a : 32;
                r.smoothing = null != i ? i : .3;
                o = new AudioAnalyser(u, r.numOfBands, r.smoothing);
                o.onUpdate = function(n, o, a) {
                    null != e && (clearInterval(e), e = null), Analyser.bands = n, Analyser.decibels = o, Analyser.energy = a, 0 == a && t(), null != r.onUpdate && "function" == typeof r.onUpdate && r.onUpdate(n, o, Analyser.energy)
                }
            }
            this.start = function() {
                o.start();
                e = setInterval(t, a)
            }
            this.stop = function() {
                o.stop()
            }
        }, Analyser.bands = [], Analyser.decibels = 0, Analyser.energy = 0
    }(),
    function() {
        var n = function() {
            this.map = function(n, t, e, o, a) {
                return o + (a - o) * (n - t) / (e - t)
            }
        };
        window.Calc = new n
    }()
};


/**
 * The sketch
 */
function startVisualization() {
  "use strict";

  visualizationInit();  // Initializing audio detection

  var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    w = canvas.width = window.innerWidth,
    h = canvas.height = window.innerHeight,
    points = [],
    drawCount = 0,
    rotationRadius = 0,
    rotationRadiusUp = true,
    center = {
      x: w / 2,
      y: h / 2
    },
    settings = {
      speed: 0.5,
      rotationSpeed: 1,
      rotationRadiusFrom: 40,
      rotationRadiusTo: 280,
      rotationRadiusSpeed: 1.5,
      connectionDistance: 30,
      connectionDistanceFract: 17.5,
      lineWidth: 0.1,
      size: 1.1,
      killAfter: 150,
      hue: 187,
      saturation: 100,
      brightness: 30,
      backgroundSaturation: 17,
      backgroundBrightness: 15,
      backgroundAlpha: 0.1,  // 0.04
      randomSize: 0,
      pushEvery: 1,
      scaleFrom: 680,
      scaleTo: 760,
      scaleMin: -0.4,
      scaleMax: 0.6
    },
    analyser;


    // Changing some setting for phone
    if (window.innerWidth < 1025){
      settings.scaleMax = 0.2;
      settings.rotationRadiusTo = 100;
      settings.killAfter = 70;
    }
  
  function setup() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;

    // Allocate a new analyser
    analyser = new Analyser(document.getElementById('player-test'));
    analyser.init();
    analyser.start();

    ctx.fillStyle = 'hsl(' + settings.hue + ',40%,50%)';
    ctx.fillRect(0, 0, w, h);

    rotationRadius = settings.rotationRadiusFrom;
    draw();
  }

  function draw() {
		ctx.globalCompositeOperation = "source-over";
    
    settings.hue = settings.hue < 359.95 ? (settings.hue + 0.05) : 0;   // Gradually changing hue

    ctx.fillStyle = 'hsla(' + settings.hue + ',' + settings.backgroundSaturation + '%,' + settings.backgroundBrightness + '%, ' + settings.backgroundAlpha + ')';
    ctx.fillRect(-(w / 2), -(h / 2), w * 2, h * 2);

    ctx.save();

    if (Analyser.bands != null && Analyser.bands.length > 0) {
      var lowEnd = Analyser.bands[0] + Analyser.bands[1] + Analyser.bands[2] + Analyser.bands[3] + Analyser.bands[4];
      var scale = mapValue(lowEnd, settings.scaleFrom, settings.scaleTo, settings.scaleMin, settings.scaleMax);

      ctx.translate((w - (w * scale)) / 2, (h - (h * scale)) / 2);
      ctx.scale(scale, scale);
    }

    ctx.fillStyle = 'hsl(' + settings.hue + ',' + settings.saturation + '%,' + settings.brightness + '%)';
    ctx.strokeStyle = 'hsl(' + settings.hue + ',' + settings.saturation + '%,' + settings.brightness + '%)';
    ctx.lineWidth = settings.lineWidth;

    var distanceAdd = Calc.map(rotationRadius, settings.rotationRadiusFrom, settings.rotationRadiusTo, 1.0, settings.connectionDistanceFract);

    var connDistance = settings.connectionDistance;
    connDistance += distanceAdd;

		ctx.globalCompositeOperation = "lighter";
    
    points.each(function(point){
			point.draw();
			
      points.each(function(connection){
        var distanceX = Math.pow((connection.x - point.x), 2);
        var distanceY = Math.pow((connection.y - point.y), 2);
        var distance = Math.sqrt(distanceX + distanceY);

        if (distance <= connDistance) {
          ctx.strokeStyle = 'hsla(' + settings.hue + ',' + settings.saturation + '%,' + settings.brightness + '%, ' + connection.opacity + ')';

          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(connection.x, connection.y);
          ctx.stroke();
          ctx.closePath();
        }

      });
    });

    drawCount++;

    pushPoints();

    ctx.restore();

    if (rotationRadiusUp) {
      rotationRadius += settings.rotationRadiusSpeed;
    } else {
      rotationRadius -= settings.rotationRadiusSpeed;
    }

    if (rotationRadius > settings.rotationRadiusTo) {
      rotationRadiusUp = false;
    } else if (rotationRadius < settings.rotationRadiusFrom) {
      rotationRadiusUp = true;
    }
		
    window.requestAnimationFrame(draw);
  }
  function pushPoints() {
    if (drawCount % settings.pushEvery == 0) {
      var centerX = Math.sin(drawCount / settings.rotationSpeed) * rotationRadius;
      var centerY = Math.cos(drawCount / settings.rotationSpeed) * rotationRadius;

			points.push(new Point(center.x + centerX, center.y + centerY, settings.killAfter));
    }
  }

  var Point = function(_x, _y, _killAfter) {
    this.x = _x;
    this.y = _y;
    this.killAfter = _killAfter != null ? _killAfter : 400;
    this.lifetime = 0;
    this.opacity = 1.0;

    var _this = this;

    this.draw = function() {
      if (_this.lifetime > _this.killAfter) {
        _this.dealloc();

        return;
      }

      _this.opacity = 1.0 - (_this.lifetime / _this.killAfter);

      ctx.fillStyle = 'hsla(' + settings.hue + ',' + settings.saturation + '%,' + settings.brightness + '%,' + _this.opacity + ')';

      ctx.beginPath();
      ctx.arc(_this.x, _this.y, settings.size, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();

      _this.lifetime++;
    };

    this.dealloc = function() {
      var index = points.indexOf(_this);

      if (index > -1) {
        points.splice(index, 1);
      }

      _this = null; // remove strong reference to 'this'
    };
  };

  function mapValue(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  }

  window.addEventListener('resize', function() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;

    center = {
      x: w / 2,
      y: h / 2
    };

    ctx.fillStyle = 'hsl(' + settings.hue + ',40%,50%)';
    ctx.fillRect(0, 0, w, h);
  }, false);

	// Faster than .forEach
	Array.prototype.each = function(a) {
  	var l = this.length;
  	for(var i = 0; i < l; i++) {
			var e = this[i];
			
			if (e) {
				a(e,i);
			}
		}
	};
	
  setup();
}

/**
 * Centering HUD for desktop boombox
 */
function centerHUD(){
  var boomboxCSS = getComputedStyle(document.getElementById("boombox"));
  var [boomboxHeight, boomboxWidth] = [parseFloat(boomboxCSS.height), parseFloat(boombox.width)];

  var HUD = document.getElementById("HUD");

  const MARGIN_X = 0.05;
  const MARGIN_Y = 0.2;

  HUD.style.width = (boomboxWidth *.41793 - 2 * boomboxWidth * .41793 * MARGIN_X).toString() + "px";
  HUD.style.height = (boomboxHeight * .20293 - 2 * boomboxHeight * .20293 * MARGIN_Y).toString() + "px";
  HUD.style.marginLeft = (boomboxWidth * .28035 + boomboxWidth * .41793 * MARGIN_X + (boomboxWidth * .41793 * .04)).toString() + "px";
  HUD.style.marginTop = (boomboxHeight * .22699 + boomboxHeight * .20293 * MARGIN_Y).toString() + "px";
}

/**
 * Setting sound bar heights
 * @param {float} amount Volume of audio
 */
function setSound(amount){
  for (const element of document.getElementsByClassName("sound-inner")) {
    element.style.height = ((1 - amount) * 100).toString() + "%";
  }
}

// Bottle radio visualizer
function visualHUD() {
  var audio = document.getElementById("player-test");
  var context = new (window.AudioContext || window.webkitAudioContext)();
  var src = context.createMediaElementSource(audio);
  var analyser = context.createAnalyser();

  src.connect(analyser);
  analyser.connect(context.destination);

  analyser.fftSize = 128;

  var bufferLength = analyser.frequencyBinCount;

  var dataArray = new Uint8Array(bufferLength);


  function renderFrame() {
    requestAnimationFrame(renderFrame);

    centerHUD();

    var canvas = document.getElementById("visualize");
    
    canvas.width = 700;   // Playing around with values this gives the best
    canvas.height = 350;

    var ctx = canvas.getContext("2d");

    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;
    var barWidth = (WIDTH / bufferLength) * 2.5;
    var barHeight;
    var x = 0;

    // x = 0;

    analyser.getByteFrequencyData(dataArray);

    ctx.fillStyle = "#1f1f1f";   // Background -> transparent makes background transparent
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    for (var i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i];
      if (i < 10) barHeight -= 100 - 7 * i;   // Reducing first couple bars height (reducing by less and less)
      barHeight *= 1.3;                       // Increasing every bar height
      
      var r = barHeight + (10 * (i/bufferLength));
      var g = 800 * (i/bufferLength);
      var b = 150;   

      // var r = barHeight + (50 * (i/bufferLength));
      // var g = 800 * (i/bufferLength);
      // var b = 1000; 

      ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
      ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

      x += barWidth + 1;
    }
  }
  renderFrame();
};