/*
combined files : 

page/mods/header
page/init

*/
KISSY.add('page/mods/header',function(S) {
        return function() {
            alert('header of refund.');
        }
});

/**
 * @fileOverview 
 * @author  
 */
KISSY.add('page/init',function (S, Header) {
        return function() {
            Header();
            return 'this is demo page.';
        }
}, {
    requires: ['./mods/header']
});

