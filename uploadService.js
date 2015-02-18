var express = require('express');
var router = express.Router();
var util = require('util');
var fs = require('fs');

var kue = require('kue'),
    jobs = kue.createQueue();

jobs.process('build_tiles',function(job,done){
    console.log('Building tiles')
    done();
})

kue.app.listen(3333);

module.exports = function UploadService( app ){
    var serverConnected = true;
    var socket = require('socket.io-client')('http://localhost:3000');

    socket.on('connect', function(){
        console.log('server connected')
        serverConnected = true
    });

    socket.on('disconnect', function(){
        serverConnected = false;
    });



    /* GET home page. */
    router.post("/upload", function(req, res, next){
        if (req.files) {
            console.log(util.inspect(req.files));
            if (req.files.file.size === 0) {
                return next(new Error("Hey, first would you select a file?"));
            }
            fs.exists(req.files.file.path, function(exists) {

                if(exists) {
                    res.end("Got your file!");

                    //Kick off the job
                    var newJob = jobs.create('build_tiles',{
                        config:'will go here'
                    }).save(function(err){
                        if(!err) {
                            console.log( newJob.id);
                            if(serverConnected){
                                socket.emit('newUpload',{ jobId: newJob.id })
                            }
                        }
                    });

                } else {
                    res.end("Well, there is no magic for those who don’t believe in it!");
                }
            });
        }
    });

    app.use(router)
}