/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S, Header) {
        return function() {
            Header();
            return 'this is demo page.';
        }
}, {
    requires: ['./mods/header']
});
