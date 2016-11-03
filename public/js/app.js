var app = angular.module('dhdx',[
	 'ngRoute',
	 'ui.router',
     'angularMoment',
	 'ngCookies',
	 'ngMaterial',
     'uiGmapgoogle-maps'
])

.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyA1HQZBdsAVCBjCeSnWCDsmmGL6C8NJdgA',
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
    });
})