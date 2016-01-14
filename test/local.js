'use strict';

require('should');

var path = require('path');
var checksum = require('checksum');
var storage = require('../index');

describe('Local storage', function () {
    var sourceFile = path.join(__dirname, './data/test.png');
    var sourceFileChecksum = null;
    var createdFileInfo = null;

    before(function (done) {
        storage.init('local', {
            destDir: path.join(__dirname, 'tmp'),
            urlPrefix: '/images'
        });

        checksum.file(sourceFile, function (err, sum) {
            sourceFileChecksum = sum;
            done(err);
        });
    });

    it('should upload image to local storage', function (done) {
        storage.upload(sourceFile, function (err, data) {
            if (err) {
                return done(err);
            }

            createdFileInfo = data;

            createdFileInfo.should.have.property('id');

            checksum.file(path.join(__dirname, 'tmp', data.id), function (err, sum) {
                sourceFileChecksum.should.equal(sum);
                done(err);
            });
        });
    });

    it('should remove image from local storage', function (done) {
        storage.remove(createdFileInfo.id, function (err) {
            done(err);
        });
    });
});
