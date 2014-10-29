
define(['jquery','underscore','backbone','shared/views/sortButtonBarTemplate'],function($,_,Backbone,sortButtonBarTemplate){

    return Backbone.View.extend({
        template: _.template(sortButtonBarTemplate),
        initialize:function(){
            //TODO - Design
            //Passed an object of options
            //Triggers events when an option is selected
            //Updates UI state of selected option

        },
        render:function(){

        }


    });


});