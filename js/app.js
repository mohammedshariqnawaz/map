var myLocations = [
    {
        title: 'Discovery Docks Apartments',
        lat: 51.501409,
        lng:  -0.018823,
        type: 'Living Quarters'
    },
    {
        title: 'Nandos Restaurant',
        lat: 51.5023146,
        lng: -0.0187593,
        type: 'Restaurant'
    },
    {
        title: 'Canary Wharf Tube Station',
        lat: 51.5034898,
        lng: -0.0185944,
        type:  'Transit'
    },
    {
        title: 'One Canada Square',
        lat: 51.5049494,
        lng: -0.0194997,
        type:  'Shopping'
    },
    {
        title: 'The O2',
        lat: 51.503039,
        lng: 0.003154,
        type: 'Entertainment'
    },
    {
        title: 'Tesco Express',
        lat: 51.500575,
        lng: -0.017354,
        type: 'Shopping'
    },
    {
        title: 'Firezza Pizza',
        lat: 51.496268,
        lng: -0.015511,
        type: 'Restaurant'
    },
    {
        title: 'The Breakfast Club',
        lat: 51.506066,
        lng: -0.017345,
        type: 'Restaurant'
    },
    {
        title: 'Shake Shack',
        lat: 51.504905,
        lng: -0.018967,
        type: 'Restaurant'
    },
    {
        title: 'Asda Superstore',
        lat: 51.494206,
        lng: -0.012714,
        type: 'Shopping'
    },
    {
        title: 'Pizza Express',
        lat: 51.505233,
        lng: -0.021716,
        type: 'Restaurant'
    }
]



var styles = [
    {
        "featureType": "water",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#b5cbe4"
            }
        ]
    },
    {
        "featureType": "landscape",
        "stylers": [
            {
                "color": "#efefef"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#83a5b0"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#bdcdd3"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e3eed3"
            }
        ]
    },
    {
        "featureType": "administrative",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "lightness": 33
            }
        ]
    },
    {
        "featureType": "road"
    },
    {
        "featureType": "poi.park",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "road",
        "stylers": [
            {
                "lightness": 20
            }
        ]
    }
];


// Global Variables
var map, clientID, clientSecret;

function AppViewModel() {
    var self = this;
    this.searchOption = ko.observable("");
    this.markers = [];
    // This function populates the infowindow when the marker is clicked. We'll only allow
    // one infowindow which will open at the marker that is clicked, and populate based
    // on that markers position.
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
                self.country = response.location.formattedAddress[4];
                self.category = response.categories[0].shortName;

                self.htmlContentFoursquare =
                    '<h5 class="iw_subtitle">(' + self.category +
                    ')</h5>' + '<div>' +
                    '<h6 class="iw_address_title"> Address: </h6>' +
                    '<p class="iw_address">' + self.street + '</p>' +
                    '<p class="iw_address">' + self.city + '</p>' +
                    '<p class="iw_address">' + self.zip + '</p>' +
                    '<p class="iw_address">' + self.country +
                    '</p>' + '</div>' + '</div>';
                infowindow.setContent(self.htmlContent + self.htmlContentFoursquare);
            }).fail(function() {
                // Send alert
                alert(
                    "There was an issue loading the Foursquare API. Please refresh your page to try again."
                );
            });
            this.htmlContent = '<div>' + '<h4 class="iw_title">' + marker.title +
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
            center: new google.maps.LatLng(51.4980479, -0.0105351),
            zoom: 13,
            styles: styles
        };
        // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map(mapCanvas, mapOptions);
        // Set InfoWindow
        this.largeInfoWindow = new google.maps.InfoWindow();
        for (var i = 0; i < myLocations.length; i++) {
            this.markerTitle = myLocations[i].title;
            this.markerLat = myLocations[i].lat;
            this.markerLng = myLocations[i].lng;
            // Google Maps marker setup
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

    // This block appends our locations to a list using data-bind
    // It also serves to make the filter work
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

googleError = function googleError() {
    alert(
        'Oops. Google Maps did not load. Please refresh the page and try again!'
    );
};

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
