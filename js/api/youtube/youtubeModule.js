
define(['underscore','backbone','appModule'],function(_,Backbone,AppModule){

    var YoutubeAPI=function(){

        this.video ={

            search:function(artistName,callbacks){

                if(callbacks.success!=undefined){
                    callbacks.success(artistName);
                }

                if(callbacks.error!=undefined){
                    callbacks.error('Random error');
                }
            }
        }

        this.playlist = {

            search:function(){

            }
        }

        this.user = {

        }

    }


    return YoutubeAPI;



});