'use strict';

var fs = require('fs');
var zlib = require('zlib');
var md5 = require('md5');
var mime = require('mime');
var AWS = require('aws-sdk');

var AmazonStorage = function (options) {
    AWS.config.update({
        accessKeyId: options.access_key,
        secretAccessKey: options.secret
    });

    this.s3 = new AWS.S3({
        params: {
            Bucket: options.bucket,
            Key: options.key
        }
    });
};

AmazonStorage.prototype.upload = function (filename, callback) {
    return callback(null, {
        id: 'test',
        url: 'test.png',
        type: 'amazon',
        mimeType: 'image/png',
        mediaType: 'image'
    });

    var mimeType = mime.lookup(filename);
    var ext = mime.extension(mimeType);
    var newFilename = md5(new Date().toString() + Math.random()) + '.' + ext;

    var params = {
        Key: newFilename,
        Body: fs.createReadStream(filename).pipe(zlib.createGzip())
    };

    this.s3.upload(params, function(err, data) {
        if (err) {
            return callback(err);
        }

        console.log(data);

        callback(null, {
            id: 'test',
            url: 'test.png',
            type: 'amazon',
            mimeType: 'image/png',
            mediaType: 'image'
        });
    });
};

AmazonStorage.prototype.remove = function (id, callback) {
    callback();
};

module.exports = AmazonStorage;
