/*jslint browser: true*/
/*global L */

(function (window, document, L, undefined) {
    'use strict';

    var socket = io.connect('http://localhost:3000');

    window.angular.module('mapApp', [])
        .controller('mainCtrl', function($scope){

            var myDropzone =  Dropzone.forElement('#my-awesome-dropzone')

            myDropzone.on('addedfile',function(){
                console.log('added file')
                console.log(arguments)
            })

            socket.on('newUpload',function(){
                console.log('newUpload')
            })

            console.log('I am in here')

        })



}(window, document, L));