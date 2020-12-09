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

	this.createCanvas(config.canvasOptions);
	this.setFontOptions(config.fontOptions);
}

CustomMemeGenerator.prototype.createCanvas = function (options) {
    const {canvasWidth, canvasHeight} = options;
    const canvas = Canvas.createCanvas(canvasWidth, canvasHeight);
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
    const {topText, bottomText, url} = options;

    this.url = url;
    this.topText = topText;
    this.bottomText = bottomText;
}

CustomMemeGenerator.prototype.generateMeme = function (imageOptions) {
    this.setImageOptions(imageOptions);

	return new Promise((resolve, reject) => {
		request.get(this.url, (error, response, body) => {
			if (!error && response.statusCode === 200) {
				this.canvasImage.src = new Buffer(body);

				this.calcCanvasSize();
				this.createMeme();

				resolve(this.canvas.toBuffer());
			} else {
				reject(new Error('The image could not be loaded.'));
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
        bottomText,
        topText,
        fontSize,
        fontFamily,
        lineHeight,
        context,
        genText
    } = this;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(canvasImage, 0, 0, memeWidth, memeHeight);

    let x = memeWidth / 2;
    let y;
    if (topText) {
        y = 0;
        this.context.textBaseline = 'top';
        genText(x, y, context, topText, memeWidth, false, lineHeight, fontSize, fontFamily);
    }
    if (bottomText) {
        y = memeHeight;
        this.context.textBaseline = 'bottom';
        genText(x, y, context, bottomText, memeWidth, true, lineHeight, fontSize, fontFamily);
    }
}

CustomMemeGenerator.prototype.genText = function (x, y, context, text, maxWidth, fromBottom, lineHeightRatio, fontSize, fontFamily) {
    if (!text) {
        return;
    }

    context.font = `bold ${fontSize}pt ${fontFamily}`;
    const pushMethod = fromBottom ? 'unshift' :'push';
    const lineHeight = lineHeightRatio * fontSize;

    let lines = [];
    let line = '';
    let words = text.split(' ');

    for (let n = 0; n < words.length; n++) {
        const testLine = line + ' ' + words[n];
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > maxWidth) {
            lines[pushMethod];
            line = words[n] + ' ';
        } else {
            line = testLine;
        }
    }
    lines[pushMethod](line);

    if (lines.length > 2) {
		CustomMemeGenerator.prototype.genText(x, y, context, text, maxWidth, fromBottom, lineHeightRatio, fontSize - 10, fontFamily);
	} else {
		for (let i in lines) {
			if (fromBottom) {
				context.strokeText(lines[i], x, y - lineHeight * i);
				context.fillText(lines[i], x, y - lineHeight * i);
			} else {
				context.strokeText(lines[i], x, y + lineHeight * i);
				context.fillText(lines[i], x, y + lineHeight * i);
			}
		}
	}
}

module.exports = CustomMemeGenerator;