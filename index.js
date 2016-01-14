'use strict';

var LocalStorage = require('./lib/local');
var CloudinaryStorage = require('./lib/cloudinary');

var MediaStorage = function () {
    this.storage = null;
};

MediaStorage.prototype.upload = function (filename, callback) {
    this.storage.upload(filename, callback);
};

MediaStorage.prototype.remove = function (id, callback) {
    this.storage.remove(id, callback);
};

MediaStorage.prototype.init = function (type, options) {
    switch (type) {
        case 'local':
            this.storage = new LocalStorage(options);
            break;

        case 'cloudinary':
            this.storage = new CloudinaryStorage(options);
            break;

        default:
            throw(new Error('Unknown type "' + type + '"'));
    }
};

module.exports = new MediaStorage();
