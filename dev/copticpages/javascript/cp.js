$(function () {
    CP = {}
    CP.Location = {};
    CP.Location.getCurrentPosition = function () {
        var dfd = $.Deferred();

        var position = localStorage['position'];
                
        if (position) {
            dfd.resolve(JSON.parse(position));
        } else {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var position = {
                        coords: {
                            latitude: position.coords.latitude, 
                            longitude: position.coords.longitude
                        }
                    }
                    localStorage['position'] = JSON.stringify(position);
                    dfd.resolve(position);
                }, function () {
                    handleNoGeolocation(browserSupportFlag);
                });
            }    
        }

        return dfd.promise();
    }
});