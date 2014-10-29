define(['underscore','backbone','player/models/playerItemModel'],function(_,Backbone,PlayerItemModel){
    return Backbone.Collection.extend({
        model:PlayerItemModel
    });
});