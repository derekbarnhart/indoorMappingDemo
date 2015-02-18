var express = require('express');
var router = express.Router();
var util = require('util');
var fs = require('fs');
var tileBuilder = require('../test')();



var kue = require('kue'),
    jobs = kue.createQueue();

jobs.process('build_tiles',function(job,done){

    console.log('job')
    console.log(arguments)
     tileBuilder.doJob( job.data.name, job.data.fileName,
        function(d){
            console.log('completed ',5 )
        },
        function(d){
            console.log('finished');
        }
    )

    done();
})

kue.app.listen(3333);

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
router.post("/", function(req, res, next){
    if (req.files) {
        console.log(util.inspect(req.files));
        if (req.files.file.size === 0) {
                    return next(new Error("Hey, first would you select a file?"));
        }
        fs.exists(req.files.file.path, function(exists) {

            if(exists) {
                var jobConfig = {
                    fileName: req.files.file.name,
                    name: req.files.file.originalname.split('.')[0]
                }
                console.log(jobConfig)
                var newJob = jobs.create('build_tiles', jobConfig)
                .save(function(err){
                    if(!err) {
                        console.log( newJob.id);

                        if(serverConnected){
                            socket.emit('newUpload',{ jobId: newJob.id })
                        }
                    }
                });
                res.end("Got your file!");
            } else {
                res.end("Well, there is no magic for those who don’t believe in it!");
            }
        });
    }
});
module.exports = router;
