/* =====================
Leaflet Configuration
===================== */

var map = L.map('map', {
  center: [47.6130, -122.3208],
  zoom: 12
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

var download_data = $.ajax("https://gist.githubusercontent.com/leonardoharth/77f7e0a62548f0274e8668be5ffe6023/raw/26c9e1e8ce9916aedb44963c1e1c6dac423f23c9/seattle_energy_leo.json");

var get_color = function(entry) {
  if (entry['buildingtype'] === "NonResidential") {
      return "#a6bddb";
  } else if (entry['buildingtype'] === "Campus") {
      return "#000000";
  } else if (entry['buildingtype'] === "Multifamily HR (10+)") {
      return "#ff7f00";
  } else if (entry['buildingtype'] === "Multifamily LR (1-4)") {
      return "#ff7f00";
  } else if (entry['buildingtype'] === "Multifamily MR (5-9)") {
      return "#ff7f00";
  } else if (entry['buildingtype'] === "Nonresidential COS") {
      return "#6a51a3";
  } else if (entry['buildingtype'] === "Nonresidential WA") {
      return "#6a51a3";
  } else if (entry['buildingtype'] === "SPS-District K-12") {
      return "#addd8e";
  } else {
      return "#999999";
  }
};

var parsed_dataset = [];

// download_data.done(function(data) {
//   parsed_dataset = JSON.parse(data);
// });

download_data.done(function(data) {
  var first_pass = JSON.parse(data);
  var secondpass = _.filter(first_pass, function(entry) {
    return parseFloat(entry['latitude']) > 46 && parseFloat(entry['latitude']) < 48;
  });
  parsed_dataset = _.filter(secondpass, function(entry) {
    return parseFloat(entry['longitude']) > -123 && parseFloat(entry['longitude']) < -121;
  });
});

var get_size_GHG = function(value) {
    return value > 500 ? 400 :
           value > 109.7 ? 250 :
           value > 43.1  ? 150 :
           value > 14.5  ? 100 :
           value > 2.8  ? 80 :
                      40;
};

var group0 = L.featureGroup();
var plot_markers = function(data) {
  data.forEach(function(entry) {
    var lat = parseFloat(entry['latitude']);
    var lon = parseFloat(entry['longitude']);
    var color = get_color(entry);
    L.circle([lat, lon], 70, {color: color, stroke: false, fillOpacity: .6}).bindPopup("Building Name: " + entry['buildingname'] + '</br>' + "Year Built: " + entry['yearbuilt'] + '</br>' + "Number of Floors: " + entry['numberoffloors'] + '</br>' + "Total Sqft. Area: " + entry['propertygfatotal']).addTo(group0);
  });
};

var group1 = L.featureGroup();
var plot_markers_1 = function(data) {
  data.forEach(function(entry) {
    var lat = parseFloat(entry['latitude']);
    var lon = parseFloat(entry['longitude']);
    var color;
    if (entry['compliancestatus'] === "Compliant") { color = "green"} else { color = "red"};
    var opc;
    if (entry['compliancestatus'] === "Compliant") { opc = .25} else { opc = .8};
    L.circle([lat, lon], 70, {color: color, stroke: false, fillOpacity: opc}).bindPopup("Building Name: " + entry['buildingname'] + '</br>' + "Year Built: " + entry['yearbuilt'] + '</br>' + "Number of Floors: " + entry['numberoffloors'] + '</br>' + "Total Sqft. Area: " + entry['propertygfatotal'] + '</br>' + "Energy STAR Score: " + entry['energystarscore']).addTo(group1);
  });
};

var group2 = L.featureGroup();
var plot_markers_2 = function(data) {
  data.forEach(function(entry) {
    var lat = parseFloat(entry['latitude']);
    var lon = parseFloat(entry['longitude']);
    var size_circle = parseFloat(entry['siteenergyuse_kbtu']);
    var scaled_size;
    if (size_circle > 4469990) { scaled_size = 800} else { scaled_size = size_circle / 5588}
    var color = get_color(entry);
    L.circle([lat, lon], scaled_size, {color: color, stroke: false, fillOpacity: .6}).bindPopup("Building Name: " + entry['buildingname'] + '</br>' + "Year Built: " + entry['yearbuilt'] + '</br>' + "Number of Floors: " + entry['numberoffloors'] + '</br>' + "Total Sqft. Area: " + entry['propertygfatotal']).addTo(group2);
  });
};

var group3 = L.featureGroup();
var plot_markers_3 = function(data) {
  data.forEach(function(entry) {
    var lat = parseFloat(entry['latitude']);
    var lon = parseFloat(entry['longitude']);
    L.circle([lat, lon], 70, {color: "black", stroke: false, fillOpacity: .6}).bindPopup("Building Name: " + entry['buildingname'] + '</br>' + "Year Built: " + entry['yearbuilt'] + '</br>' + "Number of Floors: " + entry['numberoffloors'] + '</br>' + "Total Sqft. Area: " + entry['propertygfatotal'] + '</br>' + "Energy STAR Score: " + entry['energystarscore']).addTo(group3);
  });
};

var group4 = L.featureGroup();
var plot_markers_4 = function(data) {
  data.forEach(function(entry) {
    var lat = parseFloat(entry['latitude']);
    var lon = parseFloat(entry['longitude']);
    var size_circle = parseFloat(entry['totalghgemissions']);
    var scaled_size = get_size_GHG(size_circle);
    var color = get_color(entry);
    var opc = .6;
    L.circle([lat, lon], scaled_size, {color: color, stroke: false, fillOpacity: opc}).bindPopup("Building Name: " + entry['buildingname'] + '</br>' + "Year Built: " + entry['yearbuilt'] + '</br>' + "Number of Floors: " + entry['numberoffloors'] + '</br>' + "Total Sqft. Area: " + entry['propertygfatotal'] + '</br>' + "Energy STAR Score: " + entry['energystarscore']).addTo(group4);
  });
};

var currentSlide = 0;

var slides = [
  { description: "the first description" },
  { description: "the second description" },
  { description: "the asda description" },
  { description: "the fiasdadrst description" },
  { description: "made up description "}
]

// var loadSlide = function(slide) {
//   $('#title').text(slide.title)
//   $('#description').text(slide.description)
//   $('#sidebar').css("background-color", slide.color)
//   }

$('#nextButton').click(function() {
  currentSlide = currentSlide + 1;
  if (currentSlide === 1) {
      plot_markers(parsed_dataset);
      map.addLayer(group0);
  } else if (currentSlide === 2) {
      map.removeLayer(group0);
      map.setView([47.6130, -122.3208], 14);
      plot_markers_1(parsed_dataset);
      map.addLayer(group1);
  } else if (currentSlide === 3) {
      map.removeLayer(group1);
      map.setView([47.6130, -122.3208], 12);
      plot_markers_2(parsed_dataset);
      map.addLayer(group2);
  } else if (currentSlide === 4) {
      map.removeLayer(group2);
      plot_markers_3(parsed_dataset);
      map.addLayer(group3);
  } else if (currentSlide === 5) {
      map.removeLayer(group3);
      plot_markers_4(parsed_dataset);
      map.addLayer(group4);
  } else {};
});

//https://gis.stackexchange.com/questions/240169/leaflet-onclick-add-remove-circles
