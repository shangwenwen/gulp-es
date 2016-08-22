"use strict";

var $ = require("jquery");

require("jquery.icheck");
require("jquery.bootstrap");
require("jquery.bootstrap-select");

//Make sure jQuery has been loaded before app.js
if (typeof jQuery === "undefined") {
    throw new Error("not requires jQuery");
}


/**
 * [App layout]
 */
var App = function() {

    // iCheck
    function iCheck() {
        $('input').iCheck({
            checkboxClass: 'icheckbox_flat-blue',
            radioClass: 'iradio_flat-blue'
        });
    }

    // Sidebar Toggler
    function sidebarToggler() {
        $(".es-sidebar-toggler > button").click(function() {
            $("body").toggleClass("sidebar-mini");
            if ($(this).children().hasClass('fa-angle-left')) {
                $(this).children().removeClass('fa-angle-left').addClass('fa-angle-right');
            } else {
                $(this).children().removeClass('fa-angle-right').addClass('fa-angle-left');
            }
        });
    }

    // 设置内容高度
    function getContenHeight(contentElement) {
        function setHeight() {
            var headerHeight = $('.es-header').height();
            var winHeight = $(window).height();
            $(contentElement).css('height', winHeight - headerHeight);
        }

        if ($(contentElement)) {
            setHeight();
            $(window).resize(function() {
                setHeight();
            })

        }
    }


    // sidebarMenu
    function sidebarMenu(menu) {
        var animationSpeed = 150;

        $(document).off('click', menu + ' li a').on('click', menu + ' li a', function(e) {

            var $this = $(this);
            var treeviewMenu = $this.next();

            if ((treeviewMenu.is('.treeview-menu')) && (treeviewMenu.is('.menu-open'))) {
                treeviewMenu.slideUp(animationSpeed, function() {
                    treeviewMenu.removeClass('menu-open');
                });
                treeviewMenu.parent("li").removeClass("active");
            } else if ((treeviewMenu.is('.treeview-menu')) && (!treeviewMenu.is('.menu-open'))) {
                var parent = $this.parents('ul').first();
                var ul = parent.find('ul:visible').slideUp(animationSpeed);
                ul.removeClass('menu-open');
                var parent_li = $this.parent("li");
                treeviewMenu.slideDown(animationSpeed, function() {
                    treeviewMenu.addClass('menu-open');
                    parent.find('li.active').removeClass('active');
                    parent_li.addClass('active');
                });
            }

            if (treeviewMenu.is('.treeview-menu')) {
                e.preventDefault();
            }

        });
    }


    return {
        init: function() {
            iCheck();
            sidebarToggler();
            getContenHeight('.es-content-wrapper');
            sidebarMenu('.es-sidebar-menu');
        }
    }

}();


// 实例化页面调用
$(function() {
    App.init();
    console.log('tttttttt')
})