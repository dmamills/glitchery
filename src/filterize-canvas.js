import Pixel from 'Pixel';
import Conversions from 'Conversions';

class Filterize {

    constructor(imgEl, preFilterFn, postFilterFn, brushSize) {
        this.imgEl = imgEl;
        this.preFilter = preFilterFn;
        this.postFilter = postFilterFn;
        this.brushSize = brushSize;
        this.mouseDown = false;
        this.undoHistory = [];

        this.canvas = document.createElement('canvas');
        this.canvas.style.cursor = 'pointer';
        this.ctx = this.canvas.getContext('2d');

        // this.imgEl.onload = (function() {
            let w = this.imgEl.width;
            let h = this.imgEl.height;
            this.canvas.width = w;
            this.canvas.height = h;

            this.ctx.drawImage(this.imgEl, 0, 0, w, h);
            let imgData = this.ctx.getImageData(0, 0, w, h);

            this.preFilter(imgData);
            
            this.canvas.onmousedown = (function(e) { 
                this.mouseDown = true; 
                this.undoHistory.push(this.takeSnapshot());
                this.applyFilter(e);
            }).bind(this);

            this.canvas.onmouseup = (function(e) { 
                this.mouseDown = false; 
            }).bind(this);

            this.canvas.onmousemove = (function(e) {
                if(!this.mouseDown) return;

                this.applyFilter(e);
            }).bind(this);
        // }).bind(this);
    }
    applyFilter(e) {
        let x = e.offsetX;
        let y = e.offsetY;
        let h = this.brushSize / 2;
        
        let sx = (e.offsetX - h >= 0) ? e.offsetX - h : 0;
        let sy = (e.offsetY - h >= 0) ? e.offsetY - h : 0;

        let tempData = this.ctx.getImageData(sx,sy, this.brushSize, this.brushSize);
        
        let drawFn = this.createDrawFn(e);
        this.postFilter(tempData, drawFn);
    }
    

    takeSnapshot() {
        let w = this.imgEl.width;
        let h = this.imgEl.height;
        return this.ctx.getImageData(0, 0, w, h);
    }

    undo() {
        if(this.undoHistory.length === 0) {
            alert('nothing to undo');
            return;
        }

        var lastSnapshot = this.undoHistory.pop();
        this.ctx.putImageData(lastSnapshot, 0, 0);
    }

    createDrawFn(e) {
        return (function(imgData) {
            let h = this.brushSize / 2;
            let sx = (e.offsetX - h >= 0) ? e.offsetX - h : 0;
            let sy = (e.offsetY - h >= 0) ? e.offsetY - h : 0;
            this.ctx.putImageData(imgData, sx,sy);

        }).bind(this)
    }

    setPostFilter(fn) {
        this.postFilter = fn;
    }

    setBrushSize(size) {
        this.brushSize = size;
    }
    loopFrames(frames, time) {
        this.lastSnapshot = this.takeSnapshot();
        var f = 0;
        this.loopInterval = setInterval((function() {
            this.ctx.putImageData(frames[f++].data, 0, 0);
            if(f > frames.length - 1) f = 0;
        }).bind(this), frames[0].duration);
    }
    stopLoop() {
        clearInterval(this.loopInterval);
        this.ctx.putImageData(this.lastSnapshot, 0, 0);
    }

    setBaseImage(imgEl) {
        this.imgEl = imgEl;
        this.canvas.width = this.imgEl.width;
        this.canvas.height = this.imgEl.height;
        this.reset();
    }

    getCanvas() {
        return this.canvas;
    }

    reset() {
        let w = this.imgEl.width;
        let h = this.imgEl.height;
        this.undoHistory = [];
        this.ctx.drawImage(this.imgEl, 0, 0, w, h);
    }

};

Filterize.Conversions = Conversions;
Filterize.Pixel = Pixel;
export default Filterize;
