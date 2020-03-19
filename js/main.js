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




var dataset = "https://raw.githubusercontent.com/leonardoharth/MUSA611-CPLN692-week7/master/assignment/data/Litter_Index_Blocks.geojson";






var featureGroup;

var myStyle = function(feature) {
};

var showResults = function() {
  $('#intro').hide();
  $('#results').show();
};


var eachFeatureFunction = function(layer) {
  layer.on('click', function (event) {
    console.log(layer.feature);
    if (layer.feature.properties.COLLDAY === "MON") {
      $('.day-of-week').text('Monday');
    } else if (layer.feature.properties.COLLDAY === "TUE") {
      $('.day-of-week').text('Tuesday');
    } else if (layer.feature.properties.COLLDAY === "WED") {
      $('.day-of-week').text('Wednesday');
    } else if (layer.feature.properties.COLLDAY === "THU") {
      $('.day-of-week').text('Thursday');
    } else if (layer.feature.properties.COLLDAY === "FRI") {
      $('.day-of-week').text('Friday');}
    showResults();
  });
};

var myFilter = function(feature) {
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
