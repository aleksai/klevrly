
define(['jquery','underscore','backbone','appModule','header/views/headerView'],function($,_,Backbone,AppModule,HeaderView){

    return AppModule.extend({
        name:'Header Module',
        start:function(options){

            var self = this;
            if(options && options.router){
                this.router = options.router;
            }
            this.headerView = new HeaderView();
            this.headerView.on('search:submit',function(query){
                self.router.navigate('search/' + query,{trigger:true});
            });

            $(this.region).html(this.headerView.render().el);

        }

    });


});