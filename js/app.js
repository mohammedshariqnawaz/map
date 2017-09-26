//Location List
var myLocations = [{
    title: 'Truffles',
    lat: 12.9335,
    lng: 77.6143,
    type: 'Restaurant'
}, {
    title: 'Hari Super Sandwich',
    lat: 12.9329,
    lng: 77.5826,
    type: 'Restaurant'
}, {
    title: 'Hard Rock Cafe',
    lat: 12.9762,
    lng: 77.6016,
    type: 'Restaurant'
}, {
    title: 'S N Refreshments',
    lat: 12.9084,
    lng: 77.5871,
    type: 'Restaurant'
}, {
    title: 'Smoke House Deli',
    lat: 12.9656,
    lng: 77.6412,
    type: 'Restaurant'
}, {
    title: 'Mavalli Tiffin Room (MTR)',
    lat: 12.9552,
    lng: 77.5855,
    type: 'Restaurant'
}, {
    title: 'Chakum Chukum',
    lat: 12.9724,
    lng: 77.6393,
    type: 'Restaurant'
}, {
    title: 'Mangalore Pearl',
    lat: 12.9944,
    lng: 77.6155,
    type: 'Restaurant'
}]

// Global Variables
var map, clientID, clientSecret;

function AppViewModel() {
    var self = this;
    this.searchOption = ko.observable("");
    this.markers = [];
    // This function populates the infowindow when the marker is clicked.
    this.populateInfoWindow = function(marker, infowindow) {
        if (infowindow.marker != marker) {
            infowindow.setContent('');
            infowindow.marker = marker;
            // Foursquare API Client
            clientID = "IBQR4V5MEWG3SVBG0M3QBQIMOBHVTF2C1F0W0EJ5SQPVIJ54";
            clientSecret =
                "XWXPTSYHFTOUHS5WHH2MPGOXKL0QFUO1FYGYSKN0FHSWBDSL";
            // URL for Foursquare API
            var apiUrl = 'https://api.foursquare.com/v2/venues/search?ll=' +
                marker.lat + ',' + marker.lng + '&client_id=' + clientID +
                '&client_secret=' + clientSecret + '&query=' + marker.title +
                '&v=20170708' + '&m=foursquare';
            // Foursquare API
            $.getJSON(apiUrl).done(function(marker) {
                var response = marker.response.venues[0];
                self.street = response.location.formattedAddress[0];
                self.city = response.location.formattedAddress[1];
                self.zip = response.location.formattedAddress[3];
                self.category = response.categories[0].shortName;

                self.htmlContentFoursquare =
                    '<h5 class="subtitle">(' + self.category +
                    ')</h5>' + '<div>' +
                    '<h6 class="address_title"> Address: </h6>' +
                    '<p class="address">' + self.street + '</p>' +
                    '<p class="address">' + self.city + '</p>' +
                    '<p class="address">' + self.zip + '</p>' +
                    '</p>' + '</div>' + '</div>';
                infowindow.setContent(self.htmlContent + self.htmlContentFoursquare);
            }).fail(function() {
                // Send alert
                alert(
                    "There was an issue loading the Foursquare API. Please refresh your page to try again."
                );
            });
            this.htmlContent = '<div>' + '<h4 class="title">' + marker.title +
                '</h4>';
            infowindow.open(map, marker);
            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
            });
        }
    };
    this.populateAndBounceMarker = function() {
        self.populateInfoWindow(this, self.largeInfoWindow);
        this.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout((function() {
            this.setAnimation(null);
        }).bind(this), 1400);
    };
    this.initMap = function() {
        var mapCanvas = document.getElementById('map');
        var mapOptions = {
            center: new google.maps.LatLng(12.9716, 77.5946),
            zoom: 13,
        };
        map = new google.maps.Map(mapCanvas, mapOptions);
        this.largeInfoWindow = new google.maps.InfoWindow();
        for (var i = 0; i < myLocations.length; i++) {
            this.markerTitle = myLocations[i].title;
            this.markerLat = myLocations[i].lat;
            this.markerLng = myLocations[i].lng;
            this.marker = new google.maps.Marker({
                map: map,
                position: {
                    lat: this.markerLat,
                    lng: this.markerLng
                },
                title: this.markerTitle,
                lat: this.markerLat,
                lng: this.markerLng,
                id: i,
                animation: google.maps.Animation.DROP
            });
            this.marker.setMap(map);
            this.markers.push(this.marker);
            this.marker.addListener('click', self.populateAndBounceMarker);
        }
    };

    this.initMap();
    this.myLocationsFilter = ko.computed(function() {
        var result = [];
        for (var i = 0; i < this.markers.length; i++) {
            var markerLocation = this.markers[i];
            if (markerLocation.title.toLowerCase().includes(this.searchOption()
                    .toLowerCase())) {
                result.push(markerLocation);
                this.markers[i].setVisible(true);
            } else {
                this.markers[i].setVisible(false);
            }
        }
        return result;
    }, this);
}

function initMaps() {
    ko.applyBindings(new AppViewModel());
}

$(document).ready(function() {
    function setHeight() {
        windowHeight = $(window).innerHeight();
        $('#map').css('min-height', windowHeight);
        $('#sidebar').css('min-height', windowHeight);
    };
    setHeight();

    $(window).resize(function() {
        setHeight();
    });
});
