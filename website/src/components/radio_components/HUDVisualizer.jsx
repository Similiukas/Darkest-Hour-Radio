import { useRef, useEffect } from 'react';

const HUDVisualizer = ({ audioPlayer }) => {
    const canvasRef = useRef(null);

    // Calling visualHUD only once
    useEffect(() => {
        // Bottle radio visualizer
        // https://codepen.io/nfj525/pen/rVBaab
        var audio = audioPlayer;
        var context = new (window.AudioContext || window.webkitAudioContext)();
        var src = context.createMediaElementSource(audio);
        var analyser = context.createAnalyser();
    
        src.connect(analyser);
        analyser.connect(context.destination);
    
        analyser.fftSize = 128;
    
        var bufferLength = analyser.frequencyBinCount;
    
        var dataArray = new Uint8Array(bufferLength);

        var waveArray = new Array(64);
        // Triangle
        // for (var i = 0; i < 64; ++i){
        //     emptyArray[i] = i < 32 ? i * 8 : 256 - (i - 32) * 8;
        // }
        for (var i = 0; i < 64; ++i){
            waveArray[i] = 300 * Math.sin(i * Math.PI / 64);
        }
        var canvas = canvasRef.current;
        
        canvas.width = 700;   // Playing around with values this gives the best
        canvas.height = 350;
    
        var ctx = canvas.getContext("2d");
    
        var WIDTH = canvas.width;
        var HEIGHT = canvas.height;
        var barWidth = (WIDTH / bufferLength) * 2.5;
        var barHeight;
        var x = 0;
        
        var frameCounter = 1;

        function renderFrame() {
            requestAnimationFrame(renderFrame);
            if (!audioPlayer.paused){   // Only doing all the audio analization if audio is playing (performance boost?)
                x = 0;
            
                analyser.getByteFrequencyData(dataArray);
            
                ctx.fillStyle = "#1f1f1f";   // Background -> transparent makes background transparent
                ctx.fillRect(0, 0, WIDTH, HEIGHT);
                // dataArray[0] = 0;
                // dataArray[48] = 255;
                dataArray[0] = dataArray[5];
                dataArray[2] = dataArray[7];
                dataArray[4] = dataArray[9];
                dataArray[46] = dataArray[43];
                // bufferLength= 64 imax = 50
                for (var i = 0; i < bufferLength; i+=2) {
                    barHeight = dataArray[i];
                    if (i < 12) barHeight -= 50 - 2 * i;   // Reducing first couple bars height (reducing by less and less)
                    else if (bufferLength - i < 26) barHeight = barHeight * (i / 35);
                    barHeight *= 1.5;
                    
                    var r = barHeight + 2 * (i/bufferLength);
                    var g = 600 * (i/bufferLength);
                    var b = 100 + i * 2.5;   
            
                    // var r = barHeight + (50 * (i/bufferLength));
                    // var g = 800 * (i/bufferLength);
                    // var b = 1000; 
            
                    ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                    ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
            
                    x += barWidth + 2;
                }
            }
            else if (frameCounter % 2 === 0){
                frameCounter = 1;   // Skipping every other frame
                x = 0;
            
                ctx.fillStyle = "#1f1f1f";   // Background -> transparent makes background transparent
                ctx.fillRect(0, 0, WIDTH, HEIGHT);
                for (var i = 0; i < 64; i++) {
                    barHeight = waveArray[i];
                    waveArray[i] = waveArray[(i + 1) % 64];   // Animation part
                    
                    // var r = barHeight + (50 * (i/bufferLength));
                    // var g = 800 * (i/bufferLength);
                    // var b = 256;
            
                    var r = barHeight + (30 * (i/64));
                    var g = 500 * (i/32);
                    var b = 256 - new Date().getSeconds();  // This might be a heavy task so maybe just 256 - i
            
                    ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                    ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
            
                    x += barWidth + 4;
                }
            }
            else frameCounter++;
        }
        renderFrame();
    }, [audioPlayer]);  // When switching between recording full and short

    return (
        <canvas ref={canvasRef} id="visualize" />
    )
}

export default HUDVisualizer
