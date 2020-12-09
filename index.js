const request = require('request').defaults({encoding: null});
const Canvas = require('canvas');




function CustomMemeGenerator (userConfig = {}) {
	const {canvasOptions, fontOptions} = userConfig;
	const config = Object.assign({
		canvasOptions: {
			canvasWidth: 500,
			canvasHeight: 500
		},
		fontOptions: {
			fontFamily: 'Bitstream Vera Sans Bold',
			fontSize: 40,
			lineHeight: 2
		}
	}, canvasOptions ? {canvasOptions: canvasOptions} : null, fontOptions ? {fontOptions: fontOptions} : null);

	this.setCanvas(config.canvasOptions);
	this.setFontOptions(config.fontOptions);
}

CustomMemeGenerator.prototype.createCanvas = function (options) {
    const {canvasWidth, canvasHeight} = options;
    const canvas = new Canvas(canvasWidth, canvasHeight);
    const Image = Canvas.Image;

    this.canvas = canvas;
    this.canvasImage = new Image();
    this.context = canvas.getContext('2d');

    this.context.lineWidth = 2;
    this.context.strokeStyle = 'black';
	this.context.mutterLine = 2;
	this.context.fillStyle = 'white';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'top';
}

CustomMemeGenerator.prototype.setFontOptions = function (options) {
    const {fontFamily, fontSize, lineHeight} = options;

    this.fontFamily = fontFamily;
    this.fontSize = fontSize;
	this.lineHeight = lineHeight;
}

CustomMemeGenerator.prototype.setImageOptions = function (options) {
    const {textTop, textBottom, url} = options;

    this.url = url;
    this.textTop = textTop;
    this.textBottom = textBottom;
}

CustomMemeGenerator.prototype.generateMeme = function (imgOptions) {
    this.setImageOptions(imgOptions);

    return new Promise((resolve, reject) => {
        request.get(this.url, (res, body, err) => {
            if (!error && res.statusCode === 200) {
                this.canvasImage.src = new Buffer(body);
                this.calcCanvasSize();
                this.createMeme();

                resolve(this.canvas.toBuffer());
            } else {
                reject(new Error('The image you provided could not be loaded:('));
            }
        });
    });
}

CustomMemeGenerator.prototype.calcCanvasSize = function () {
    const {canvas, canvasImage} = this;
    canvas.height = canvasImage.height / canvasImage.width * canvas.width;

    this.memeWidth = canvas.width;
	this.memeHeight = canvas.height;
}

CustomMemeGenerator.prototype.createMeme = function () {
    const {
        canvas,
        canvasImage,
        memeHeight,
        memeWidth,
        textBottom,
        textTop,
        fontSize,
        fontFamily,
        context,
        wrapText
    } = this;

    context.clearRect(0, 0, canvas.width, canvas.height);

    let x = memeWidth / 2;
    let y;
    if (textTop) {
        y = 0;
        this.context.textBaseline = 'top';
        genText(x, y, context, textTop, memeWidth, false, lineHeight, fontSize, fontFamily);
    }
    if (textBottom) {
        y = memeHeight;
        this.context.textBaseline = 'bottom';
        genText(x, y, context, textBottom, memeWidth, true, lineHeight, fontSize, fontFamily);
    }
}

CustomMemeGenerator.prototype.genText = function (x, y, context, text, maxWidth, fromBottom, lineHeightRatio, fontSize, fontFamily) {
    
}

module.exports = {
    CustomMemeGenerator
}