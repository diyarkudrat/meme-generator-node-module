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

}

CustomMemeGenerator.prototype.setFontOptions = function (options) {

}

CustomMemeGenerator.prototype.setImageOptions = function (options) {

}

CustomMemeGenerator.prototype.generateMeme = function (imgOptions) {

}

module.exports = {
    CustomMemeGenerator
}