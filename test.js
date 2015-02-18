var _ = require('lodash')

var STATE_NOT_PROCESSING = 0,
    STATE_PROCESSING = 1,
    STATE_OVERVIEW_TILES = 2;
    STATE_PENDING = 3,
    STATE_ERROR = 4;

var PROGRESS_TICK = 'PROGRESS_TICK',
    TILE_OPERATION = 'TILE_OPERATION',
    OPERATION_FINISH = 'OPERATION_FINISH',
    UNKNOWN = 'UNKNOWN';

var genBaseTiles = /Generating Base Tiles:/;
var genOverviewTiles = /Generating Overview Tiles:/;
var tileSet = /Tiles:$/
var tick = /(^\d*$|^\d*\.$)/;
var done = /100 -\sdone\./;


module.exports = function(){


return {

    doJob:function( name, fileName, dataCb, finishedCb ){

        dataCb = dataCb || _.noop;
        finishedCb = finishedCb || _.noop;

        var tempFilePath = './public/uploads/138a65d7e65c896ae44dde11ae08d845.png';

        console.log(arguments)
        var spawn = require('child_process').spawn,
            ls    = spawn('gdal2tiles.py', [ '-p', 'raster', '-w', 'none', './public/uploads/'+fileName ,'./public/layers/'+name], { stdio:'pipe' });

        var currentState = STATE_NOT_PROCESSING,
            currentOp = '';

        var totalTicks = 0, currentTicks = 0;

        function setState(newState){
            currentState = newState;
            currentTicks = 0;
        }

        var lineTypes = [
            {  match: tick, type: PROGRESS_TICK },
            {  match: tileSet, type: TILE_OPERATION },
            {  match: done, type: OPERATION_FINISH }
        ];
        var typeUnknown = { type:UNKNOWN };

        function getLineType(token){
            for(var i=0;i<lineTypes.length;i++){
                if( lineTypes[i].match.test(token) ) return lineTypes[i];
            }
            return typeUnknown;
        }

        function finishOp(){
            //Report
            console.log('Operation Finished: ', currentOp);
            console.log('Total Ticks: ', totalTicks,' Operation Ticks: ', currentTicks )
            //Clear
            currentTicks=0;
        }
        var notProcessingHandler= function( lineType, token){

            switch( lineType.type ){
                case TILE_OPERATION:
                    currentOp = token;
                    setState( STATE_PROCESSING, token );
                break;
                case PROGRESS_TICK:
                case OPERATION_FINISH:
                    finishOp();
                    setState( STATE_PROCESSING, token);
                case UNKNOWN:
                break;
                default:
                break;
            }

        }

        var processingHandler = function( lineType, token){

                switch( lineType.type ){
                case TILE_OPERATION:
                    currentOp=token;
                    setState( STATE_PROCESSING, token );
                break;
                case PROGRESS_TICK:
                    currentTicks++;
                    totalTicks++
                break;
                case OPERATION_FINISH:
                    dataCb(totalTicks/80);
                    finishOp()
                break;
                case UNKNOWN:
                break;
                default:
                break;
            }
        }


        ls.stdout.on('data',function(data){
            var parsed = data.toString('utf8');
            parsed.split('\n')
                .forEach(function(token){
                    var lineType = getLineType(token);
                    switch( currentState ){
                        case STATE_NOT_PROCESSING:
                            notProcessingHandler( lineType, token )
                        break;
                        case STATE_PROCESSING:
                            processingHandler( lineType, token )
                        break;
                    }
                })
        })

        ls.stderr.on('data', function (data) {
          console.log('stderr: ' + data);
        });

    }

}


}
