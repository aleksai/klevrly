
define(['jquery','underscore','backbone','moment','main/models/videoModel'],function($,_,Backbone,moment,VideoModel){

    return Backbone.Collection.extend({
        model:VideoModel,
        initialize:function(){

        },
        fetchSearch:function(query,limit,category){
            //do manual AJAX call here maybe?
            //can even override fetch
            //http://stackoverflow.com/questions/13358477/override-backbones-collection-fetch

            limit = limit || 10;
            var self = this;
            var searchUrl = 'https://gdata.youtube.com/feeds/api/videos?&v2&alt=json&max-results='+ limit +'&orderby=relevance&q=' + query;
            if(category){
                //searchUrl = 'https://gdata.youtube.com/feeds/api/videos?&v2&alt=json&max-results='+ limit +'&orderby=relevance&q=' + query + '&category=' + category;
            }
            $.ajax({
                type:'GET',
                url:searchUrl,
                dataType:'jsonp',
                success:function(data){
                    var resultsArr = data.feed.entry;
                    var vidArr = [];
                    _.each(resultsArr,function(rawObj,index){

                        var vidObj={};
                        //vidObj.id= rawObj.id["$t"];
                        var vidURl = rawObj.id["$t"];
                        vidObj.videoUrl = rawObj.id["$t"];
                        vidObj.videoId = $.trim(vidURl.substr(vidURl.lastIndexOf('/')+1,vidURl.length));
                        vidObj.title = rawObj.title["$t"];

                        if(rawObj["yt$statistics"]){
                            vidObj.viewCount = self.numberWithCommas(rawObj["yt$statistics"].viewCount);
                            vidObj.views = rawObj["yt$statistics"].viewCount
                        }else{
                            vidObj.viewCount = 0
                            vidObj.views = 0;
                        }
                        vidObj.date = moment(rawObj.published['$t']).fromNow();

                        vidObj.author = rawObj.author[0]["name"]["$t"];
                        vidObj.thumbnail = rawObj["media$group"]['media$thumbnail'][0].url;
                        vidObj.category = rawObj['media$group']['media$category'][0]['$t'];
                        vidObj.durationSeconds = rawObj['media$group']['media$content'] && rawObj['media$group']['media$content'][0].duration || '0';
                        vidObj.duration = self.formatSeconds(vidObj.durationSeconds);

                        vidArr.push(vidObj);

                    });

                    if(vidArr.length){
                        self.reset(vidArr);
                    }else{
                        self.reset();
                    }
                },
                error:function(error){
                    console.log('error getting videos');
                }
            });
        },
        numberWithCommas:function(x) {

            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        formatSeconds:function(secondsIn){
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
        }

    });




});