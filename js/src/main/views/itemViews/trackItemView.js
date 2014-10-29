
define(function(require){

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        $htmlTemplate = require('text!main/views/itemViews/trackItemTemplate.html');

    return Backbone.View.extend({
        tagName:'div',
        className:'trackItem',
        template: _.template($htmlTemplate),
        events:{
            'click':'playTrack'
        },
        initialize:function(){
            this.artistMode = false;
            this.albumMode = false;
            _.bindAll(this,'playTrack');
        },
        render:function(){
            this.$el.html(this.template(this.model));
            if(this.artistMode){this.$('.artist').hide();}
            return this;
        },
        playTrack:function(evt){
            var itemClicked = $(evt.target);
            var className = itemClicked.attr('class');
            if(className !=='add' && className!=='artist' && className!=='artist-link'){
                var options = {
                    type: this.albumMode ? 'album' : 'track',
                    trackModel:this.model,
                    trackNumber:this.model.get('trackNumber')-1,
                    albumModel:this.albumMode ? this.album : undefined
                };
                this.bubble('playItem',options);
            }
        }
    });


});