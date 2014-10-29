define(function(require){
    'use strict';

    var util = {};
    util.formatSeconds = function(secondsIn){
        var minStr = "0";
        var secStr = "0";

        if(secondsIn!==undefined && secondsIn!== 0)
        {
            var secInt = parseInt(secondsIn);
            var minStr = "";
            var secStr = "";

            var min = Math.floor(secInt/60);
            var secs = secInt % 60;

            if(min==0){
                minStr = "0";
            }else if(min<10){
                minStr = "" + min;
            }else{
                minStr = min;
            }

            if(secs == 0){
                secStr = "0";
            }else if(secs<10){
                secStr = "0" + secs;
            }else{
                secStr = secs;
            }
        }
        return minStr + ":" + secStr;
    };

    return util;
});