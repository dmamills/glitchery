let Conversions = {
    toRGB(imgData) {
        let rgb = [];
        let data = imgData.data;
        for(var i=0; i < data.length; i +=4) {
            let pixel = new Pixel(data[i], data[i+1], data[i+2], data[i+3]);
            rgb.push(pixel);
        }
        return rgb;
    },
    toImgData(rgb, w, h) {
        
    }
}

export default Conversions;
