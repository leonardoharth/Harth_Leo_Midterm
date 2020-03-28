/* =====================
Leaflet Configuration
===================== */

var map = L.map('map', {
  center: [47.6130, -122.3208],
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

// $.ajax("https://gist.githubusercontent.com/leonardoharth/77f7e0a62548f0274e8668be5ffe6023/raw/26c9e1e8ce9916aedb44963c1e1c6dac423f23c9/seattle_energy_leo.json").done(function(resp){console.log(JSON.parse(resp))});

var download_data = $.ajax("https://gist.githubusercontent.com/leonardoharth/77f7e0a62548f0274e8668be5ffe6023/raw/26c9e1e8ce9916aedb44963c1e1c6dac423f23c9/seattle_energy_leo.json");

var get_color = function(entry) {
  if (entry['buildingtype'] === "NonResidential") {
      return "#a6bddb";
  } else if (entry['buildingtype'] === "Campus") {
      return "#238443";
  } else if (entry['buildingtype'] === "Multifamily HR (10+)") {
      return "#fc4e2a";
  } else if (entry['buildingtype'] === "Multifamily LR (1-4)") {
      return "#ffeda0";
  } else if (entry['buildingtype'] === "Multifamily MR (5-9)") {
      return "#feb24c";
  } else if (entry['buildingtype'] === "Nonresidential COS") {
      return "#6a51a3";
  } else if (entry['buildingtype'] === "Nonresidential WA") {
      return "#6a51a3";
  } else if (entry['buildingtype'] === "SPS-District K-12") {
      return "#78c679";
  } else {
      return "#000000";
  }
}

// var plot_markers = function(data) {
//   data.forEach(function(entry) {
//     var lat = parseFloat(entry['latitude']);
//     var lon = parseFloat(entry['longitude']);
//     var size_circle = parseFloat(entry['siteenergyuse_kbtu']);
//     var scaled_size;
//     if (size_circle > 4469990) { scaled_size = 800} else { scaled_size = size_circle / 5588}
//     var color = get_color(entry);
//     L.circle([lat, lon], scaled_size, {color: color, stroke: false, fillOpacity: .6}).addTo(map).bindPopup(entry['buildingname']);
//   });
// };

// var plot_markers = function(data) {
//   data.forEach(function(entry) {
//     var lat = parseFloat(entry['latitude']);
//     var lon = parseFloat(entry['longitude']);
//     var size_circle = parseFloat(entry['siteenergyuse_kbtu']);
//     var scaled_size;
//     if (size_circle > 4469990) { scaled_size = 800} else { scaled_size = size_circle / 5588}
//     var color = get_color(entry);
//     L.circle([lat, lon], scaled_size, {color: color, stroke: false, fillOpacity: .6}).addTo(map).bindPopup("Building Name: " + entry['buildingname'] + '</br>' + "Year Built: " + entry['yearbuilt'] + '</br>' + "Number of Floors: " + entry['numberoffloors'] + '</br>' + "Total Sqft. Area: " + entry['propertygfatotal']);
//   });
// };

// var plot_markers = function(data) {
//   data.forEach(function(entry) {
//     var lat = parseFloat(entry['latitude']);
//     var lon = parseFloat(entry['longitude']);
//     var size_circle = parseFloat(entry['sourceeui_kbtu_sf']);
//     var scaled_size = size_circle*2;
//     var color = get_color(entry);
//     L.circle([lat, lon], scaled_size, {color: color, stroke: false, fillOpacity: .6}).addTo(map).bindPopup("Building Name: " + entry['buildingname'] + '</br>' + "Year Built: " + entry['yearbuilt'] + '</br>' + "Number of Floors: " + entry['numberoffloors'] + '</br>' + "Total Sqft. Area: " + entry['propertygfatotal']);
//   });
// };

var plot_markers = function(data) {
  data.forEach(function(entry) {
    var lat = parseFloat(entry['latitude']);
    var lon = parseFloat(entry['longitude']);
    var size_circle = parseFloat(entry['ghgemissionsintensity']);
    var scaled_size = size_circle*30;
    var color = get_color(entry);
    L.circle([lat, lon], scaled_size, {color: color, stroke: false, fillOpacity: .6}).addTo(map).bindPopup("Building Name: " + entry['buildingname'] + '</br>' + "Year Built: " + entry['yearbuilt'] + '</br>' + "Number of Floors: " + entry['numberoffloors'] + '</br>' + "Total Sqft. Area: " + entry['propertygfatotal'] + '</br>' + "Energy STAR Score: " + entry['energystarscore']);
  });
};

download_data.done(function(data) {
    var parsed = JSON.parse(data);
    console.log(parsed);
    plot_markers(parsed);
  });
