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
        function resolveGetMetadata(resolve){
            var fileStats= fs.statSync(localFile);
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