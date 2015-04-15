/* global self, console */

self.addEventListener('fetch', function(event) {
    console.log(event.request.url);
});
