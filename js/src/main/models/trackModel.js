
define(['jquery','underscore','backbone'],function($,_,Backbone){

    /*var REMOVE_KEYWORDS = {
        'explicit version',
        'album version',
        'clean version',
        'dirty version',
        'clean'
    }*/
    return Backbone.Model.extend({
        initialize:function(trackData){
            this.set({name:trackData.name});
            this.set({artist:trackData.artist && trackData.artist.name || trackData.artist});
            this.set({title:trackData.artist.name + ' - ' + trackData.name});
            this.set({mbid:trackData.mbid});
            this.set({trackNumber:trackData.trackNumber});

            var artistUrl = trackData.artist.mbid ? trackData.artist.name + '/' + trackData.artist.mbid : trackData.artist.name;
            this.set({artistLink:artistUrl});

            var imageUrl = trackData.image && trackData.image.length && trackData.image[2]['#text'] || '';
            this.set({imgUrl:imageUrl});
        }
    });
});