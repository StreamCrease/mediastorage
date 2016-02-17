'use strict';

var async = require('async');
var cloudinary = require('cloudinary');
var md5 = require('md5');

var CloudinaryStorage = function (options) {
    this.resolutions = options.resolutions || [];
    delete options.resolutions;

    cloudinary.config(options);
};

CloudinaryStorage.prototype.upload = function (filename, callback) {
    var resolutions = this.resolutions;
    resolutions.push(0);
    var pid = md5(new Date().toString() + Math.random());

    async.times(resolutions.length, function (n, next) {
        var opts = (resolutions[n])
            ? {width: resolutions[n], height: resolutions[n], crop: "fit", public_id: pid + '_' + resolutions[n]}
            : {public_id: pid};

        cloudinary.uploader.upload(filename, function (result) {
            if (result.error) {
                return next(result.error, null);
            }

            next(null, {
                id: result.public_id,
                url: result.url,
                type: 'cloudinary',
                mimeType: result.resource_type + '/' + result.format,
                mediaType: result.resource_type
            });
        }, opts);
    }, function (err, results) {
        callback(err, results[results.length - 1]);
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
