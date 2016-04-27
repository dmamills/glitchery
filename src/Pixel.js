class Pixel {
    
    constructor(r,g,b,a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    toData() {
        return [
            this.r,
            this.g,
            this.b,
            this.a,
        ];
    }

    toHex() {
        let n = (this.r << 16) + (this.g << 8) + (this.b);
        return n.toString(16);
    }
}

export default Pixel;
