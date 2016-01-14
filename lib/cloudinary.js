'use strict';

var cloudinary = require('cloudinary');

var CloudinaryStorage = function (options) {
    cloudinary.config(options);
};

CloudinaryStorage.prototype.upload = function (filename, callback) {
    cloudinary.uploader.upload(filename, function (result) {
        if (result.error) {
            return callback(result.error, null);
        }

        callback(null, {
            id: result.public_id,
            url: result.url,
            type: 'cloudinary',
            mimeType: result.resource_type + '/' + result.format,
            mediaType: result.resource_type
        });
    });
};

CloudinaryStorage.prototype.remove = function (id, callback) {
    cloudinary.uploader.destroy(id, function (result) {
        if (result.result === 'ok') {
            return callback();
        }

        callback(new Error(result.result));
    });
};

module.exports = CloudinaryStorage;
