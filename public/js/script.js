(function(window) {

    var pre = function(imgData) {};

    var post = function(imgData, drawFn) {
        imgData.data = selectedFilter(imgData.data);
        drawFn(imgData);
    };

    function convertToGray(data) {
        for (var i = 0; i < data.length; i += 4) {
           var avg = (data[i] + data[i +1] + data[i +2]) / 3;
           data[i] = avg;
           data[i + 1] = avg;
           data[i + 2] = avg;
        }

        return data;
    }


    function createAlterFilter(threshold) {
        return function(data) {
            for(var i =0; i < data.length;i += 4) {
                data[i] = data[i] + (data[i] * threshold);
                data[i+1] = data[i+1] + (data[i+1] * threshold);
                data[i+2] = data[i+2] + (data[i+2] * threshold);

                if(data[i] > 255) data[i] = 255;
                if(data[i+1] > 255) data[i+1] = 255;
                if(data[i+2] > 255) data[i+2] = 255;
            }
            return data;

        }
    }

    function createColorFilter(n) {
         return function(data) {
            for (var i = 0; i < data.length; i += 4) {
                data[i+n] = (data[i+n] << 2 <= 255) ? (data[i + n] << 2) : 255;
            }
            return data;
        };
    }

    function createEventListener(fn) {
        return function() {
            selectedFilter = fn;
            document.getElementsByClassName('button-primary')[0].classList.remove('button-primary');
            this.classList.add('button-primary');
        }
    }
    
    var brushEl = document.getElementById('brush');
    var brushSizeEl = document.getElementById('brushSize');
    var frameCountEl = document.getElementById('framesCount');

    convertToRed = createColorFilter(0);
    convertToGreen = createColorFilter(1);
    convertToBlue = createColorFilter(2);

    var selectedFilter = convertToRed;

    document.getElementById('red').addEventListener('click',createEventListener(convertToRed) )
    document.getElementById('green').addEventListener('click',createEventListener(convertToGreen) )
    document.getElementById('blue').addEventListener('click',createEventListener(convertToBlue) )
    document.getElementById('gray').addEventListener('click',createEventListener(convertToGray) )
    document.getElementById('brighten').addEventListener('click',createEventListener(createAlterFilter(0.1)));
    document.getElementById('darken').addEventListener('click',createEventListener(createAlterFilter(-0.05)));


    // var f = new filterize(img, pre, post, 20);

    debugger;
    document.getElementById('putCanvasHere').appendChild(f.getCanvas());
    document.getElementById('reset').addEventListener('click', function() { f.reset(); });
    document.getElementById('undo').addEventListener('click', function() { f.undo(); });
    document.getElementById('addFrame').addEventListener('click', function(e) {
        frames.push(f.takeSnapshot());
        frameCountEl.innerText = frames.length
    });
    
    var frames = [];

    function updateBrush() {
        brushSizeEl.innerHTML = brushEl.value;
        f.setBrushSize(brushEl.value);
    }
    document.getElementById('brush').addEventListener('mousemove', updateBrush);

    var isLooping = false;
    var loopBtn = document.getElementById('loop')
    loopBtn.addEventListener('click',function(e) {
        if(isLooping) {
            loopBtn.innerText = 'start loop';
            f.stopLoop();
            isLooping = false;
        } else {
            loopBtn.innerText = 'stop loop';
            f.loopFrames(frames,100);
            isLooping = true;
        }
    });

    document.getElementById('save').addEventListener('click', function() {

        var data = f.getCanvas().toDataURL();
        var formData = new FormData();
        formData.append('data', data);
        fetch('/save', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: data
            })
          }).then(function(res) { return res.json();})
          .then(function(data) {
            var tempEl = document.createElement('a');
            tempEl.href = 'http://localhost:8000/download/' + data.id;
            tempEl.click();
          }, function(err) {

          });
    });

    document.getElementById('uploadForm').onsubmit = function(e) {
        e.preventDefault();
        fetch('/upload', {
            method: 'post',
            body: new FormData(this)
        }).then(function(res) {
            return res.json();
        }).then(function(data) { 
            console.log(data) 
            img.src = '/' + data.filepath;
            f = new filterize(img, pre, post, 20);
            var canvasHolder = document.getElementById('putCanvasHere');
            canvasHolder.innerHTML = '';
            canvasHolder.appendChild(f.getCanvas());

        });
    };

}).call(window);
