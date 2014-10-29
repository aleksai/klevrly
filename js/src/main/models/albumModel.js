
define(['jquery','underscore','backbone'],function($,_,Backbone){

    return Backbone.Model.extend({
        initialize:function(){
            this.API_KEY = '50255a0265dc1cc8d8b325c940f4ecd0';
            var artistName = this.get('artist') && this.get('artist').name || this.get('artist');
            this.set({link:artistName + '/' + this.get('name')});
            if(this.get('mbid')){
                //this.set({link: this.get('link') + '/' + this.get('mbid')})
            }

            if(this.get('image')){
                this.set({thumbnail:this.get('image')[3]['#text']});
            }
        },
        fetchAlbumInfo:function(artist,album,mbid){
            this.resetAllAttributes();
            var self = this;
            var searchUrl = 'http://ws.audioscrobbler.com/2.0/?method=album.getinfo&artist=' + artist + '&album='+ album + '&api_key='+ this.API_KEY +'&format=json';
            searchUrl = encodeURI(searchUrl);
            //if(mbid){searchUrl+='&mbid='+mbid};
            $.ajax({
                type:'GET',
                url:searchUrl,
                dataType:'jsonp',
                success:function(data){

                    if(data.album){
                        var albumOj = {};
                        albumOj.name = albumOj.title = data.album.name || '';
                        albumOj.id = data.album.id;
                        albumOj.mbid = data.album.mbid;
                        albumOj.url = data.album.url || '';
                        albumOj.listeners = data.album.listeners || '';
                        albumOj.playcount = data.album.playcount || '';
                        albumOj.artist = data.album.artist || '';
                        albumOj.summary = data.album.wiki && data.album.wiki.summary || '';
                        albumOj.thumbnail = data.album.image && data.album.image[1]['#text'] || '';
                        albumOj.cover = data.album.image && data.album.image[3]['#text'] || '';
                        albumOj.tracks = data.album.tracks && data.album.tracks.track || [];

                        if(data.album.tracks && data.album.tracks.track && !data.album.tracks.track.length){
                            albumOj.tracks = [data.album.tracks.track];
                        }
                        self.cleanTrackTitles(albumOj.tracks);
                        albumOj.releaseDate = data.album.releasedate;
                        albumOj.tags = data.album.toptags && data.album.toptags.tag || [];
                        self.set(albumOj);
                    }
                    self.trigger('fetchAlbumComplete');
                },
                error:function(error){
                    console.log('error fetching album info from lastFM');
                    self.trigger('fetchError');
                }
            });

        },
        cleanTrackTitles:function(trackList){
            _.each(trackList,function(track){
                var titleRegex = /Album Version|Explicit/gi;    //Main Version, Clean version
                track.originalName = track.name;
                track.name = track.name.replace(titleRegex,'');
                track.name = track.name.replace('( (','').replace('((','').replace('))','').replace('( )','');; //TODO - use regex clean up parentheses
                //track.name = track.name.replace('()','').replace('( )','').replace('( - )',''); //TODO - use regex clean up parentheses
            });
        },
        resetAllAttributes:function(){
            this.clear({silent:true});
        },
        getTrackTitleByPosition:function(position){
            var track = this.get('tracks') && this.get('tracks')[position];
            var trackTitle = track && track.artist.name + ' - ' + track.name;
            return trackTitle;
        }

    });


});