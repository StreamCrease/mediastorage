'use strict';

var async = require('async');
var path = require('path');
var md5 = require('md5');
var mime = require('mime');
var fs = require('fs.extra');
var sharp = require('sharp');

var LocalStorage = function (options) {
    if (!options || !options.destDir) {
        throw(new Error('"destDir" option must be defined'));
    }

    this.destDir = options.destDir;
    this.urlPrefix = options.urlPrefix || '';
    this.resolutions = options.resolutions || [];
};

LocalStorage.prototype.upload = function (filename, callback) {
    var destDir = this.destDir;
    var urlPrefix = this.urlPrefix;
    var resolutions = this.resolutions;
    var mimeType = mime.lookup(filename);
    var ext = mime.extension(mimeType);
    var newFilename = md5(new Date().toString() + Math.random()) + '.' + ext;

    async.series([
        // Check if we have source file
        function (callback) {
            fs.exists(filename, function (isExists) {
                if (!isExists) {
                    return callback(new Error('File not exists'));
                }

                callback();
            });
        },
        // Check if we have destination directory. If no have - create it
        function (callback) {
            fs.exists(destDir, function (isExists) {
                if (!isExists) {
                    fs.mkdir(destDir, callback);
                    return;
                }

                callback();
            });
        },
        // Copy source file to destination directory (save original image)
        function (callback) {
            fs.copy(filename, path.join(destDir, newFilename), {replace: true}, function (err) {
                callback(err);
            });
        },
        // Resize and save images for each resolution
        function (callback) {
            async.times(resolutions.length, function (n, next) {
                var newName = newFilename.replace('.' + ext, '') + '_' + resolutions[n] + '.' + ext;
                sharp(filename)
                    .resize(resolutions[n], resolutions[n])
                    .max()
                    .toFile(path.join(destDir, newName), next);
            }, callback);
        }
    ], function () {
        callback(null, {
            id: newFilename,
            url: urlPrefix + '/' + newFilename,
            type: 'local', // local, cloudinary, amazon
            mimeType: mimeType,
            mediaType: mimeType.split('/')[0] // image, video
        });
    });
};

LocalStorage.prototype.remove = function (id, callback) {
    fs.unlink(path.join(this.destDir, id), callback);
};

module.exports = LocalStorage;
