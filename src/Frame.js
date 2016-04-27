
class Frame {
    constructor(data, duration) {
        this.data = data;
        this.duration = duration
    }

    toJson() {
        let c = document.createElement('canvas');
        c.width = this.data.width;
        c.height = this.data.height;
        let ctx = c.getContext('2d');
        ctx.putImageData(this.data, 0, 0);
        ctx.drawImage(ctx.canvas, 0, 0, c.width, c.height);

        return {
            data: c.toDataURL(),
            duration: this.duration
        };
    }
}

export default Frame;
