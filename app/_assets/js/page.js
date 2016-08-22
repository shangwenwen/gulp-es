"use strict";

var $ = require("jquery");

// require("jquery.icheck");
// require("jquery.bootstrap");
// require("jquery.bootstrap-select");


// Page
var Page = function() {

    // Sidebar Toggler
    function DemoHandle() {
        $('.page').css('color', 'red');
    }

    // return
    return {
        init: function() {
            DemoHandle();
        }
    }

}();


// 实例化页面调用
$(function() {
    Page.init();
    console.log('eee');
})