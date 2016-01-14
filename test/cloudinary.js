'use strict';

require('should');

var path = require('path');
var storage = require('../index');

describe('Cloudinary storage', function () {
    var sourceFile = path.join(__dirname, './data/test.png');
    var createdFileInfo = null;

    before(function (done) {
        storage.init('cloudinary', {
            cloud_name: 'streamcrease-zar',
            api_key: '497618767538199',
            api_secret: 'HCBvfaNu1KutLcMs1NlWRoNo0kg'
        });

        done();
    });

    it('should upload image to cloudinary', function (done) {
        storage.upload(sourceFile, function (err, data) {
            createdFileInfo = data;

            createdFileInfo.should.have.property('id');

            done(err);
        });
    });

    it('should remove image from cloudinary', function (done) {
        storage.remove(createdFileInfo.id, function (err) {
            done(err);
        });
    });
});
