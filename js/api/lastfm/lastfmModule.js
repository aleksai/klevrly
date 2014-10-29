
define(['underscore','backbone','appModule'],function(_,Backbone,AppModule){

    /*return AppModule.extend({
        name:'LastFM Module',
        start:function(){

            this.subscribe('mainEvent',function(data){
                console.log('mainEvent happened: '+ data.id);
            });

        }

    });*/

    var LastFmAPI=function(){

        this.artist ={

            search:function(artistName,callbacks){

                if(callbacks.success!=undefined){
                    callbacks.success(artistName);
                }

                if(callbacks.error!=undefined){
                    callbacks.error('Random error');
                }
            },
            getInfo:function(){

            },
            getAlbums:function(){

            }
        }

        this.album = {

            getInfo:function(){

            },
            getTracks:function(){

            },
            getSimilar:function(){

            }
        }

    }


    return LastFmAPI;
    //var myAPi = new LastFmAPI();
    //myAPi.album.getSimilar()



});