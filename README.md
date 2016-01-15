# Media storage wrapper

Project description must be here.


## Requirements

* [![Node.js](https://nodejs.org/static/images/logos/nodejs.png)](http://nodejs.org/)


## Installation

Just run command: `npm i` from **project root** folder


## Quality control

1. You can check source code using `npm run jshint`
2. You can run tests using `npm test`

## Using

##### Init

```
storage.init('local', {
    destDir: path.join(__dirname, 'tmp'),
    urlPrefix: '/images'
});
```

or

```
storage.init('cloudinary', {
    cloud_name: 'cloudinary-name',
    api_key: 'cloudinary-api-key',
    api_secret: 'cloudinary-api-secret'
});
```

##### Upload image

```
storage.upload('/path/to/source/image.png', function (err, data) {
    data.id; // Image id - can be used for image removing
});
```

##### Remove image

```
storage.remove('image.id', function (err) {
});
```
