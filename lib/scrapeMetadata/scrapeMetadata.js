/**
 * Sample code using some fake dependencies to
 * illustrate mocks.
 *
 * Created by tim on 8/10/14.
 */
exports=module.exports=scrapeMetadata={};

var fs= require('fs');
var q= require('q');

var downloadFile= require('./downloadFile');
var fileMetadata= require('./fileMetadata');

function scrape(remoteFile,localFile,folderId){

    function getMetadata(){
        function resolveGetMetadata(resolve,reject){
            var fileStats= fs.statSync(localFile);
            // tf - let's introduce a code branch.
            if(fileStats.size>2000000){
                fs.unlink(localFile,function(){
                    // tf - always give a reason for rejecting a promise.
                    reject('Downloaded files bigger than 2mb are deleted.');
                });
            }
            resolve(JSON.stringify(fileStats));
        }
        return q.Promise(resolveGetMetadata);
    }

    function saveMetadata(metadata) {
        return fileMetadata.save(
            {folderId:folderId,metadata:metadata});
    }

    return downloadFile.download(remoteFile,localFile)
        .then(getMetadata)
        .then(saveMetadata);
}
scrapeMetadata.scrape=scrape;