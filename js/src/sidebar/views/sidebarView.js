
define(['jquery','underscore','backbone','text!sidebar/views/sidebarTemplate.html'],function($,_,Backbone,sidebarTemplate){
    'use strict';

    var EXPAND_POSITION = 120,
        COLLAPSE_POSITION = 50,
        EXPAND_DELAY = 75,
        ARROW_BASE_POSITION =59,
        MAX_EXPAND_WIDTH = 1380;

    return Backbone.View.extend({
        className:'sidebar-inner',
        template: _.template(sidebarTemplate),
        events:{
            'click li a':'onMenuItemClicked'
        },
        initialize:function(){
            _.bindAll(this,'expandSideBar','collapseSideBar','updateSidebarState');
            this.onResize = _.debounce(this.onResize,200);
            this.collapseEnabled = true;
        },
        render:function(){
            this.$el.html(this.template({}));
            this.$sideBar = $('#sideBar');
            this.$sideBarArrow = $('#sideBarArrow');
            this.sidebarTimer;
            this.$sideBar.mouseenter(this.expandSideBar);
            this.$sideBar.mouseleave(this.collapseSideBar);

            //$(window).resize(this.updateSidebarState);
            //setTimeout(this.updateSidebarState,EXPAND_DELAY);
            return this;
        },
        expandSideBar:function(){
            this.sidebarTimer = setTimeout(function(){
                $('#main').css('left',EXPAND_POSITION);
                $('#header').css('left',EXPAND_POSITION);
                $('#mainOverlay').css('left', EXPAND_POSITION);
                $('#darkOverlay').css('left', EXPAND_POSITION);
                $('#imageBar').css('left', EXPAND_POSITION);
                $('#sideBar').css('width',EXPAND_POSITION).addClass('expanded');
                $('#sideBarArrow').css('left', EXPAND_POSITION - 10);

            },EXPAND_DELAY);
        },
        collapseSideBar:function(){
            if(!this.collapseEnabled)return;

            clearTimeout(this.sidebarTimer);
            $('#main').css('left',COLLAPSE_POSITION);
            $('#header').css('left',COLLAPSE_POSITION);
            $('#mainOverlay').css('left', COLLAPSE_POSITION);
            $('#darkOverlay').css('left', COLLAPSE_POSITION);
            $('#imageBar').css('left', COLLAPSE_POSITION);
            $('#sideBar').css('width',COLLAPSE_POSITION).removeClass('expanded');
            $('#sideBarArrow').css('left',39);
        },
        updateSidebarState:function(){
            if($(window).width() > MAX_EXPAND_WIDTH){
                this.collapseEnabled = false;
                this.expandSideBar();
            }else{
                this.collapseEnabled = true;
                this.collapseSideBar();
            }
        },
        onMenuItemClicked:function(evt){
            var $itemClicked = $(evt.target).prop('tagName').toLowerCase() === 'a' ? $(evt.target) : $(evt.target).parent();

            if(!$itemClicked.hasClass('unclickable')){
                this.unSelectedMenuItems();
                $itemClicked.addClass('selected');
                this.updateSelectedArrowPosition($itemClicked.data('position'));
            }
        },
        unSelectedMenuItems:function(){
            this.$('li a').removeClass('selected');
        },
        updateSelectedArrowPosition:function(position){
            if(position!==undefined){
                var topPosition = position === 0 ? ARROW_BASE_POSITION : ARROW_BASE_POSITION + position * 39;
                this.$sideBarArrow.css('top',topPosition);
            }
        },
        setRoute:function(routeType){
            var classToSelect;
            switch(routeType){
                case 'home':
                    classToSelect = 'home';
                    break;
                case 'search':
                case 'album':
                case 'artist':
                    classToSelect = 'discover';
                    break;
                case 'charts':
                    classToSelect = 'charts';
                    break;
            }

            if(classToSelect){
                this.unSelectedMenuItems();
                var $menuItem = this.$('.' + classToSelect);
                $menuItem.addClass('selected');
                this.updateSelectedArrowPosition($menuItem.data('position'));
            }
        }
    });

});