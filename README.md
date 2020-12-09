# meme-displayer

[![NPM version](https://img.shields.io/npm/v/meme-displayer.svg?style=flat)](https://www.npmjs.com/package/meme-displayer) [![NPM downloads](https://img.shields.io/npm/dm/meme-displayer.svg?style=flat)](https://npmjs.org/package/meme-displayer)

Node module that allows you to generate a meme by specifying the text and image address

## Installation

```
$ npm install meme-displayer
```

## Requirements

Make sure that you have the following installed on your machine:

```
brew install pkg-config cairo pango libpng jpeg giflib
```

## Example

```js
const memeDisplayer = require('meme-displayer');

const memeGenerator = new memeDisplayer({
    canvasOptions: {
        canvasWidth: 500,
        canvasHeight: 500
    },
    fontOptions: {
        fontSize: 35
        fontFamily: 'impact'
        lineHeight: 2
    }
});

...
memeGenerator.generateMeme({
    topText: 'Ohhh',
    bottomText: 'Shit',
    url: 'https://i.pinimg.com/564x/af/3e/ed/af3eeda017287cbe230ed00c4c76afbd.jpg'
}).then(function(data) {
    res.set('Content-Type', 'image/png');
    res.send(data);
})
...
```