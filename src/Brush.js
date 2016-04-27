class Brush {
    constructor(fn) {
        this.fn = fn;
    }

    exec(imgData) {
        return this.fn(imgData);
    }
}

export default Brush;
