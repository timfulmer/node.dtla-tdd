/**
 * Test case used to illustrate TDD.  Uses basic
 * node built-ins.
 *
 * Created by tim on 8/9/14.
 */

var download2mb= require('./../../lib/2mb/download2mb');
var q= require('q');
var fs= require('fs');
var assert= require('assert');

var localFile= 'local2mb';

function assertFileExists(){
    function assertFileExistsPromise(
        resolve){
        fs.exists(localFile,
            function fsExists(exists){
                assert.ok(exists,'File "'+
                    localFile+
                    '" does not exist.');
                resolve();
            }
        );
    }
    return q.Promise(assertFileExistsPromise);
}

function assertFileSize(){
    function assertFileSizePromise(
        resolve){
        var fileStats= fs.statSync(localFile);
        assert.equal(2000000,fileStats.size,
                'File "'+ localFile+
                '" has wrong size.');
        resolve();
    }
    return q.Promise(assertFileSizePromise);
}

function logSuccess(){
    function logSuccessPromise(resolve){
        console.log('All tests passed successfully.');
        resolve();
    }
    return q.Promise(logSuccessPromise);
}

download2mb.download2mb(localFile)
    .then(assertFileExists)
    .then(assertFileSize)
    .then(logSuccess)
    .done();