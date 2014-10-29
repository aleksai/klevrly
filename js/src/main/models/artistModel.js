
define(['jquery','underscore','backbone'],function($,_,Backbone){

    var ECHONEST_API_KEY = 'KG9HI7LYUN3QW7GQS';
    return Backbone.Model.extend({
        defaults:{
            link:'',
            thumbnail:'',
            name:'no name'
        },
        lastFMAPI:'http://ws.audioscrobbler.com/2.0/',
        echonestAPI:'http://developer.echonest.com/api/v4/',
        initialize:function(){

            this.set({title:this.get('name')});
            this.set({mbid:this.get('mbid')});
            this.set({thumbnail:this.get('image') && this.get('image')[3]['#text']});       //TODO - add a default image
            this.set({link:'#artist/' + this.get('name')});
            if(this.get('mbid')){
                this.set({link:this.get('link') + '/' + this.get('mbid')});
            }

        },
        fetchArtistInfo:function(artistName,mbid){
            var self = this;
            var API_KEY = '50255a0265dc1cc8d8b325c940f4ecd0';
            var searchUrl = this.lastFMAPI + '?method=artist.getinfo&artist=' + artistName +'&api_key='+ API_KEY +'&format=json';
            if(mbid){
                searchUrl = this.lastFMAPI + '?method=artist.getinfo&mbid=' + mbid +'&api_key='+ API_KEY +'&format=json';
            }
            $.ajax({
                type:'GET',
                url:searchUrl,
                dataType:'jsonp',
                success:function(data){
                    if(data.artist){
                        var artistObj = {}
                        artistObj.name =  data.artist.name;
                        artistObj.bio = data.artist.bio && data.artist.bio.summary || '';
                        artistObj.avatar = window.retina ? data.artist.image[4]['#text'] : data.artist.image[3]['#text'];
                        artistObj['avatar-large'] = data.artist.image[4] && data.artist.image[4]['#text'];
                        artistObj.tags = data.artist.tags && data.artist.tags.tag || [];

                        self.set(artistObj);
                    }
                    self.trigger('fetchComplete');
                },
                error:function(error){
                    console.log('error fetching artist info from lastFM');
                }
            });
        },
        fetchSimilar:function(artistName,mbid){

            var self = this;
            var API_KEY = '50255a0265dc1cc8d8b325c940f4ecd0';
            var searchUrl = this.lastFMAPI + '?method=artist.getsimilar&artist=' + artistName +'&api_key='+ API_KEY +'&format=json&limit=15';
            if(mbid){
                searchUrl = this.lastFMAPI + '?method=artist.getsimilar&mbid=' + mbid +'&api_key='+ API_KEY +'&format=json&limit=15';
            }

            $.ajax({
                type:'GET',
                url:searchUrl,
                dataType:'jsonp',
                success:function(data){
                    if(data.similarartists){
                        self.set({similar:data.similarartists.artist});
                        self.trigger('fetchSimilarComplete');
                    }
                },
                error:function(error){
                    console.log('error fetching similar artist info from lastFM');
                }
            });
        },
        fetchTopAlbums:function(artistName,mbid){
            var self = this;
            var API_KEY = '50255a0265dc1cc8d8b325c940f4ecd0';
            var searchUrl = this.lastFMAPI + '?method=artist.gettopalbums&artist=' + artistName +'&api_key='+ API_KEY +'&format=json&limit=15';
            if(mbid){
                searchUrl = this.lastFMAPI + '?method=artist.gettopalbums&mbid=' + mbid +'&api_key='+ API_KEY +'&format=json&limit=15';
            }

            $.ajax({
                type:'GET',
                url:searchUrl,
                dataType:'jsonp',
                success:function(data){
                    if(data.topalbums){
                        self.set({albums:data.topalbums.album});
                        self.trigger('fetchAlbumsComplete');
                    }
                },
                error:function(error){
                    console.log('error fetching artist top albums from lastFM');
                }
            });

        },
        fetchTopTracks:function(artistName,mbid){
            var self = this;
            var API_KEY = '50255a0265dc1cc8d8b325c940f4ecd0';
            var searchUrl = this.lastFMAPI + '?method=artist.getTopTracks&artist=' + artistName +'&api_key='+ API_KEY +'&format=json&limit=40';
            if(mbid){
                searchUrl = this.lastFMAPI + '?method=artist.getTopTracks&mbid=' + mbid +'&api_key='+ API_KEY +'&format=json&limit=40';
            }

            $.ajax({
                type:'GET',
                url:searchUrl,
                dataType:'jsonp',
                success:function(data){
                    if(data.toptracks){
                        self.set({tracks:data.toptracks.track});
                        self.trigger('fetchTracksComplete');
                    }
                },
                error:function(error){
                    console.log('error fetching artist top tracks from lastFM');
                }
            });

        },
        fetchImages:function(artist,mbid){
            //TODO - use mbid when available
            var imageUrl = 'http://developer.echonest.com/api/v4/artist/images?api_key='+ ECHONEST_API_KEY +'&name='+ artist +'&format=jsonp&results=50&start=0';//&license=unknown';
            var self = this;

            if(self.imagesLoaded && self.images){
                self.trigger('fetchImagesComplete',self.images);
            }else{
                self.images=[];
                $.ajax({
                    type:'GET',
                    url:imageUrl,
                    dataType:'jsonp',
                    success:function(data){
                        self.imagesLoaded = true;
                        self.images = data.response.images && data.response.images.reverse() || [];
                        self.trigger('fetchImagesComplete',self.images);
                    },
                    error:function(error){
                        console.log('error fetching artist images from Echonest');
                    }
                });
            }


        },
        fetchHotness:function(artist,mbid){
            var iUrl = this.echonestAPI +'artist/hotttnesss?api_key='+ ECHONEST_API_KEY +'&name='+ artist +'&format=jsonp';

            var self = this;
            $.ajax({
                type:'GET',
                url:iUrl,
                dataType:'jsonp',
                success:function(data){
                    var hotness = 0;
                    if(data.response.artist && data.response.artist.hotttnesss){
                        hotness = Math.round(parseFloat(data.response.artist.hotttnesss*100));
                    }
                    self.set({hotness:hotness});
                    self.trigger('fetchHotnessComplete');
                },
                error:function(error){
                    console.log('error fetching artist hotness from Echonest');
                }
            });
        },
        fetchFamiliarity:function(artist,mbid){

            var iUrl = this.echonestAPI +'artist/familiarity?api_key='+ ECHONEST_API_KEY +'&name='+ artist +'&format=jsonp';

            var self = this;
            $.ajax({
                type:'GET',
                url:iUrl,
                dataType:'jsonp',
                success:function(data){

                    var familiarity = 0;
                    if(data.response.artist && data.response.artist.familiarity){
                        familiarity = Math.round(parseFloat(data.response.artist.familiarity*100));
                    }
                    self.set({familiarity:familiarity});
                    self.trigger('fetchFamiliarityComplete');
                },
                error:function(error){
                    console.log('error fetching artist familiarity from Echonest');
                }
            });
        }
    });
});