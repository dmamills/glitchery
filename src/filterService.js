import Filter from 'Filter';

let filterService = () => {

    let sharpen = (data) => {
        let weights = [  0, -1,  0,
                        -1,  5, -1,
                         0, -1,  0 ];

        let result = convolute(data, weights);
        return result;
    };

    let blur = (data) => {
        let weights = [ 1/9, 1/9, 1/9,
                        1/9, 1/9, 1/9,
                        1/9, 1/9, 1/9 ];

        return convolute(data, weights);
    }

    let danielSpecial = (data) => {
        let weights = [ 1, 1, 1,
                        -1, 0.7, 1,
                        -1, -1, -1 ];

        return convolute(data, weights);
    }

    let convolute = (pixels, weights, opaque) => {

        var side = Math.round(Math.sqrt(weights.length));
        var halfSide = Math.floor(side/2);
        var src = pixels.data;
        var sw = pixels.width;
        var sh = pixels.height;

        // pad output by the convolution matrix
        var w = sw;
        var h = sh;
        var output = document.createElement('canvas').getContext('2d').createImageData(w,h);
        var dst = output.data;
        // go through the destination image pixels
        var alphaFac = opaque ? 1 : 0;
        for (var y=0; y<h; y++) {
          for (var x=0; x<w; x++) {
            var sy = y;
            var sx = x;
            var dstOff = (y*w+x)*4;
            // calculate the weighed sum of the source image pixels that
            // fall under the convolution matrix
            var r=0, g=0, b=0, a=0;
            for (var cy=0; cy<side; cy++) {
              for (var cx=0; cx<side; cx++) {
                var scy = sy + cy - halfSide;
                var scx = sx + cx - halfSide;
                if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                  var srcOff = (scy*sw+scx)*4;
                  var wt = weights[cy*side+cx];
                  r += src[srcOff] * wt;
                  g += src[srcOff+1] * wt;
                  b += src[srcOff+2] * wt;
                  a += src[srcOff+3] * wt;
                }
              }
            }
            dst[dstOff] = r;
            dst[dstOff+1] = g;
            dst[dstOff+2] = b;
            dst[dstOff+3] = a + alphaFac*(255-a);
          }
        }
        return output;

    };

    let grayscaleFilter = new Filter('grayscale',(data) => {
        data = data.data;
        for (var i = 0; i < data.length; i += 4) {
           var avg = (data[i] + data[i +1] + data[i +2]) / 3;
           data[i] = avg;
           data[i + 1] = avg;
           data[i + 2] = avg;
        }

        return data;
    });

    let createAlterFilter = (threshold) => {
        return (data) => {
            data = data.data;
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

    let createColorFilter = (n) => {
        return (data) => {
            data = data.data;
            for (var i = 0; i < data.length; i += 4) {
                data[i+n] = (data[i+n] << 2 <= 255) ? (data[i + n] << 2) : 255;
            }
            return data;
        };
    }

    let redFilter = new Filter('red', createColorFilter(0));
    let greenFilter = new Filter('green', createColorFilter(1));
    let blueFilter = new Filter('blue', createColorFilter(2));

    let brightenFilter = new Filter('brighten', createAlterFilter(0.1));
    let darkenFilter = new Filter('darken', createAlterFilter(-0.05));
    let sharpenFilter = new Filter('shapen', sharpen);
    let blurFilter = new Filter('blur', blur);
    let danielFilter = new Filter('danielSpecial', danielSpecial);


    return [
        grayscaleFilter,
        redFilter,
        greenFilter,
        blueFilter,
        brightenFilter,
        darkenFilter,
        sharpenFilter,
        blurFilter,
        danielFilter,
    ];

}

export default filterService;
