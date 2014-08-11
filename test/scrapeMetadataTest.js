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

    var proxyquire= require('proxyquire').noCallThru();
    var sinon= require('sinon');
    var q= require('q');
    var chai= require('chai');
    chai.use(require('chai-as-promised'));

    var remoteFile= '//some/remote/file',
        localFile= '/some/local/file',
        folderId= 'abc123',
        fileMetadata= {status:'ok'},
        identityPromise= q.Promise(function(resolve){resolve()}),
        downloadFileMock= {download: function(){
            return identityPromise;
        }},
        fsMock= {statSync:function(localFile){
            return fileMetadata;
        }},
        fileMetadataMock= {save: function(){
            return identityPromise;
        }},
        scrapePromise,
        expectations= [];

    var scrapeMetadata= proxyquire('../scrapeMetadata/scrapeMetadata',{
        './downloadFile': downloadFileMock,
        'fs': fsMock,
        './fileMetadata': fileMetadataMock
    });

    describe('#scrape',function(){
        beforeEach(function(){
            expectations= [];
        });
        afterEach(function (done) {
            expectations.forEach(function(expectation){
                expectation.verify();
            });
            done();
        });
        it('should download remote file to local file', function(){

            // tf - all expectations must be set for the function under test.
            //  otherwise, Sinon.JS throws unexpected errors.

            expectations.push(sinon.mock(downloadFileMock).expects('download')
                .withExactArgs(remoteFile,localFile)
                .once()
                .returns(identityPromise));
            expectations.push(sinon.mock(fsMock).expects('statSync')
                .withExactArgs(localFile)
                .returns(fileMetadata)
                .once());
            expectations.push(sinon.mock(fileMetadataMock).expects('save')
                .withExactArgs({folderId:folderId,metadata:JSON.stringify(fileMetadata)})
                .once());

            // tf - expectations must be setup before creating the promise.
            scrapePromise= scrapeMetadata.scrape(
                remoteFile,localFile,folderId);

            return chai.assert.isFulfilled(scrapePromise,'Scrape promise unfulfilled.');
        });
    });
});
