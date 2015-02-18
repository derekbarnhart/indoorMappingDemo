/*jslint browser: true*/
/*global L */

(function (window, document, L, undefined) {
    'use strict';

    window.angular.module('mapApp', [])
        .controller('mainCtrl', function($scope){
            var beacons =[
                {
                    id:1,
                    name:'Entrance',
                    vendor:'Estimote',
                    active:true,
                    x:0,
                    y:0
                },
                {
                    id:2,
                    name:'Exit',
                    vendor:'Estimote',
                    active:true,
                    x:0,
                    y:0
                },
                {
                    id:3,
                    name:'Vendor 1',
                    vendor:'Estimote',
                    active:false,
                    x:0,
                    y:0
                },
                {
                    id:4,
                    name:'Hot Dog Stand',
                    vendor:'Estimote',
                    active:true,
                    x:0,
                    y:0
                },
                {
                    id:5,
                    name:'Bathroom',
                    vendor:'Gimbal',
                    active:true,
                    x:0,
                    y:0
                },
                {
                    id:6,
                    name:'Fountain',
                    vendor:'Gimbal',
                    active:true,
                    x:0,
                    y:0
                }
            ];


            var myIcon = L.icon({
                //iconUrl: 'https://cdn1.iconfinder.com/data/icons/iphone-tab-bar-two-colors-blue-black/512/Wifi-64.png',
                iconUrl:'http://icongal.com/gallery/image/459921/free_creative_map_marker_ball_base_shimmer_icons_azure_01_freedom_left.png',
                //iconRetinaUrl: 'my-icon@2x.png',
                 iconSize: [64,64],
                // iconAnchor: [22, 94],
                // popupAnchor: [-3, -76],
                // shadowUrl: 'my-icon-shadow.png',
                // shadowRetinaUrl: 'my-icon-shadow@2x.png',
                // shadowSize: [68, 95],
                // shadowAnchor: [22, 94]
            });

            //gdal2tiles.py -p raster -z 0-6 -w none eso.jpg
                var layers = [
                    'floorplanSq',
                    'Floorplan2',
                    'floorplan3',
                    'floorplan4',
                    'realistic',
                    'blueprint'
                ];


                    var map = L.map('map').setView([0, 0], 1);

                    var floorplan = L.tileLayer( '/layers/datasnap-two/{z}/{x}/{y}.png', {

                        continuousWorld:false,
                        noWrap:true,
                        attribution: 'Datasnap.io',
                        tms: true
                    })


                    floorplan.addTo(map);


            $scope.beacons = beacons.map(function( beacon ){

                var x = Math.round(Math.random(2)*100,3),
                    y = Math.round(Math.random(2)*100,3);

                var xPos = Math.random()>.5,
                    yPos = Math.random()>.5;

                    x = xPos? x : -x;
                    y = yPos? y : -y;

                var marker = L.marker([x,y], {
                    icon:myIcon,
                    draggable: true
                });

                marker.on('dragend',function(evt){

                    var beacon = _.find(this.beacons,function(item){
                        return item._marker._leaflet_id == evt.target._leaflet_id;
                    })


                    if(beacon){
                        var latLng= beacon._marker.getLatLng()
                        beacon.x = Math.round(latLng.lat,3);
                        beacon.y = Math.round(latLng.lng,3);
                        this.$apply()
                    }
                    console.log('dragging ended',arguments)
                    console.log( marker.getLatLng())
                }.bind($scope))

                marker.bindPopup('<div><h4 style="color:#3b3b3b;">'+beacon.name+'</h4><strong>battery:<span style="color:blue">good</span> </strong></div>');


                if(beacon.active){
                    marker.addTo(map);
                }
                beacon.x = x;
                beacon.y = y;
                beacon._marker = marker;
                return beacon;

            })






        })



//  L.Icon.Default.imagePath = 'images/';

//  /* create leaflet map */
//  var map = L.map('map', {
//      center: [52.5377, 13.3958],
//      zoom: 4
//  });
// /* add default stamen tile layer */
//  var originalPath = 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png';
//  new L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
//      minZoom: 0,
//      maxZoom: 18,
//      attribution: 'Map data © <a href="http://www.openstreetmap.org">OpenStreetMap contributors</a>'
//  }).addTo(map);


//  L.marker([52.5, 13.4]).addTo(map);




}(window, document, L));