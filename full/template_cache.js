angular.module("EH").run(["$templateCache", function($templateCache) {$templateCache.put("app/authentication/register.html","<div class=\"row\"><div class=\"registration-profile-image-holder\"><div gravatar-image=\"\" gravatar-email=\"vm.emailadress\" gravatar-css-class=\"profile-image\"></div><div testoskar=\"\" gravatar-email=\"vm.emailadress\"></div></div><form class=\"col s12\"><div class=\"row\"><div class=\"input-field col s12\"><input id=\"email\" type=\"email\" class=\"validate\" ng-model=\"vm.emailadress\"> <label for=\"email\">Email</label></div></div><div class=\"row\"><div class=\"input-field col s12\"><input id=\"username\" type=\"text\" class=\"validate\" ng-model=\"vm.username\"> <label for=\"username\">Username</label></div></div><div class=\"row\"><div class=\"input-field col s12\"><input id=\"password\" type=\"password\" class=\"validate\" ng-model=\"vm.password\"> <label for=\"password\">Password</label></div></div></form></div>");
$templateCache.put("app/upcoming/upcoming.html","<h4>Upcoming</h4><div class=\"divider\"></div><div ng-repeat=\"group in vm.shows\" class=\"section\"><h5>{{group.headline}}</h5><div ng-repeat=\"episode in group.episodes\" class=\"card small no-content\"><div class=\"card-image\"><img style=\"background-image: url(\'{{episode.show.fanart}}\')\"> <span class=\"card-title\">{{episode.show.title}}</span></div></div></div>");}]);