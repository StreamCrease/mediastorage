'use strict';

require('should');

var path = require('path');
var storage = require('../index');

describe.skip('Amazon storage', function () {
    var sourceFile = path.join(__dirname, './data/test.png');
    var createdFileInfo = null;

    before(function (done) {
        storage.init('amazon', {
            access_key: '',
            secret: '',
            bucket: '',
            key: ''
        });

        done();
    });

    it('should upload image to amazon', function (done) {
        storage.upload(sourceFile, function (err, data) {
            createdFileInfo = data;

            createdFileInfo.should.have.property('id');

            done(err);
        });
    });

    it('should remove image from amazon', function (done) {
        storage.remove(createdFileInfo.id, function (err) {
            done(err);
        });
    });
});
