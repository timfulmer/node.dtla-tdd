/**
 * Simple script to illustrate TDD.  Downloads a 2mb file.
 *
 * Created by tim on 8/9/14.
 */

var https= require('https');
var fs= require('fs');
var q= require('q');

function download2mbModule(fileName){
    function download2mbPromise(resolve){
        // tf - remember to end streams created in code.
        var fileOut= fs.createWriteStream(fileName);
        var fileRequest= {
            host: 'raw.githubusercontent.com',
            path: '/timfulmer/node.dtla-tdd/master/lib/2mb/2mb'
        };
        function requestCallback(response){
            // tf - end:false give us a chance to hook into
            //  the end event.
            response.pipe(fileOut,{end: false});
            response.on('end', function(){
                // tf - always call end on any streams created.
                fileOut.end();
                resolve();
            });
        }
        var request= https.request(fileRequest,requestCallback);
        request.end();
    }
    return q.Promise(download2mbPromise);
}

exports=module.exports={download2mb:download2mbModule};