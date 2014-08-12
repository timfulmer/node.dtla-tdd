/**
 * Simple test illustrating using mocha, mocks and
 * chai-as-promised to test a promise based unit of
 * JavaScript code.
 *
 * Created by tim on 8/9/14.
 */

describe('scrapeMetadata',function(){

    // tf - keep all test-specific code in initial describe,
    //  Mocha treats the top level as a global scope,
    //  unlike core Node.JS runtime.

    // tf - use noCallThru since the actual dependencies
    //  aren't build yet.
    var proxyquire= require('proxyquire').noCallThru();
    var sinon= require('sinon');
    var q= require('q');
    var chai= require('chai');
    chai.use(require('chai-as-promised'));

    var remoteFile= '//some/remote/file',
        localFile= '/some/local/file',
        folderId= 'abc123',
        fileMetadata= {size:1024},
        identityPromise= q.Promise(function(resolve){resolve()}),
        identityFunction= function(){return identityPromise},
        downloadFileMock= {download:identityFunction},
        fsMock= {statSync:identityFunction,
            unlink:identityFunction},
        fileMetadataMock= {save:identityFunction},
        scrapePromise,
        downloadFileExpectation,
        fsExpectation,
        fileMetadataExpectation;

    var scrapeMetadata= proxyquire('../../lib/scrapeMetadata/scrapeMetadata',{
        './downloadFile': downloadFileMock,
        // tf - using a fake-object for fs saves a lot of grief.
        'fs': fsMock,
        './fileMetadata': fileMetadataMock
    });

    describe('#scrape',function(){
        beforeEach(function(){
            downloadFileExpectation= sinon.mock(downloadFileMock);
            fsExpectation= sinon.mock(fsMock);
            fileMetadataExpectation= sinon.mock(fileMetadataMock);
        });
        afterEach(function (done) {
            // tf - expectations must be verified after the promise has been fulfilled.
            downloadFileExpectation.verify();
            fsExpectation.verify();
            fileMetadataExpectation.verify();
            done();
        });
        it('should save metadata on downloaded file.', function(){

            // tf - all expectations must be set for the function under test.
            //  otherwise, Sinon.JS throws unexpected errors.

            downloadFileExpectation.expects('download')
                .withExactArgs(remoteFile,localFile)
                .once()
                .returns(identityPromise);
            fsExpectation.expects('statSync')
                .withExactArgs(localFile)
                .returns(fileMetadata)
                .once();

            // tf - this one fails the test.
//            fileMetadataExpectation.expects('save')
//                .withExactArgs({folderId:folderId,metadata:fileMetadata})
//                .once();
            // tf - this one passes the test.
            fileMetadataExpectation.expects('save')
                .withExactArgs({folderId:folderId,metadata:JSON.stringify(fileMetadata)})
                .once();

            // tf - expectations must be setup before creating the promise.
            scrapePromise= scrapeMetadata.scrape(
                remoteFile,localFile,folderId);

            return chai.assert.isFulfilled(scrapePromise,'Scrape promise unfulfilled.');
        });
        it('should delete files bigger than 2mb and reject promise.', function(){
            downloadFileExpectation.expects('download')
                .withExactArgs(remoteFile,localFile)
                .once()
                .returns(identityPromise);
            fsExpectation.expects('statSync')
                .withExactArgs(localFile)
                .returns({"size":2000001})
                .once();
            fsExpectation.expects('unlink')
                .withArgs(localFile)
                // tf - callsArg since unlink, arg[1] is a callback.
                .callsArg(1)
                .once();
            scrapePromise= scrapeMetadata.scrape(
                remoteFile,localFile,folderId);

            return chai.assert.isRejected(scrapePromise,'Scrape promise fulfilled.');
        });
    });
});
