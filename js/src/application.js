
define(['backbone','underscore'],function(Backbone,_){

    var modules = [];
    function Application(){

        var self = this;
        this.eventBus = _.extend({},Backbone.Events);
        this.start = function(options){
            _.each(modules,function(module){
                module.start(options);
            });

            self.eventBus.trigger('application:started');
        };

        this.stop = function(options){
        };

        this.addModule = function(module,options){
            modules.push(module);
        };
    }

    return Application;

});