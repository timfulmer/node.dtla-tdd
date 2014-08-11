/**
 * Simple script to illustrate TDD.  Downloads a 2mb file.
 *
 * Created by tim on 8/9/14.
 */

var https= require('https');
var fs= require('fs');
var q= require('q');

function download2mbModule(fileName){
    return q.Promise(function download2mbPromise(resolve){
        var fileOut= fs.createWriteStream(fileName);
        var fileRequest= {
            host: 'raw.githubusercontent.com',
            path: '/timfulmer/node.dtla-tdd/master/2mb/2mb'
        };
        function requestCallback(response){
            response.pipe(fileOut,{end: false});
            response.on('end', function(){
                fileOut.end();
                resolve();
            })
        }
        var request= https.request(fileRequest,requestCallback);
        request.end();
    });
}

exports=module.exports={download2mb:download2mbModule};