/* =====================
Leaflet Configuration
===================== */

var map = L.map('map', {
  center: [40.000, -75.1090],
  zoom: 11
});
var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);

/* =====================
Initial data import and filters
===================== */

var dataset = energy;

// APPLY FILTERS

var markers = [];

var parsedDF = function(data) {
  var allBuildings = JSON.parse(data);
  var markerCoordinates = allBuildings.map(function(building) {
  var coords = {
      lat: building.latitude,
      long: building.longitude
};
  return coords;
});
  return markerCoordinates;
};

var makeMarkers = function(data) {
  markers = data.map(function(coords){
    return L.marker([coords.lat, coords.long]);
  });
  return markers;
};

var plotMarkers = function(markers) {
  markers.forEach(function(marker){
    return marker.addTo(map);
  });
};

/*

var featureGroup;

var myStyle = function(feature) {
  return {};
};

var showResults = function() {

//  This function uses some jQuery methods that may be new. $(element).hide()
//  will add the CSS "display: none" to the element, effectively removing it
//  from the page. $(element).show() removes "display: none" from an element,
//  returning it to the page. You don't need to change this part.

  // => <div id="intro" css="display: none">
  $('#intro').hide();
  // => <div id="results">
  $('#results').show();
};

var eachFeatureFunction = function(layer) {
  layer.on('click', function (event) {

  //  The following code will run every time a layer on the map is clicked.
  //  Check out layer.feature to see some useful data about the layer that
  //  you can use in your application.

    console.log(layer.feature);
    showResults();
  });
};

var myFilter = function(feature) {
  return true;
};

$(document).ready(function() {
  $.ajax(dataset).done(function(data) {
    var parsedData = JSON.parse(data);
    featureGroup = L.geoJson(parsedData, {
      style: myStyle,
      filter: myFilter
    }).addTo(map);

    // quite similar to _.each
    featureGroup.eachLayer(eachFeatureFunction);
  });
});

*/
