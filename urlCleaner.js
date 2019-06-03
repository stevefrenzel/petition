(function() {
    'use strict';

    exports.urlCleaner = function urlCleaner(url) {
        if (url === '') {
            return;
        } else if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        } else {
            return (url = 'http://' + url);
        }
    };
})();
