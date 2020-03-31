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

var parsed_dataset = [];

download_data.done(function(data) {
  var first_pass = JSON.parse(data);
  var secondpass = _.filter(first_pass, function(entry) {
    return parseFloat(entry['latitude']) > 46 && parseFloat(entry['latitude']) < 48;
  });
  parsed_dataset = _.filter(secondpass, function(entry) {
    return parseFloat(entry['longitude']) > -123 && parseFloat(entry['longitude']) < -121;
  });
});

/* =====================
Create style functions
===================== */

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

var get_size_GHG = function(value) {
    return value > 3000 ? 900 :
           value > 500 ? 400 :
           value > 109.7 ? 250 :
           value > 43.1  ? 150 :
           value > 14.5  ? 100 :
           value > 2.8  ? 80 :
                      40;
};

var get_size_total_energy = function(value) {
    return value > 100000000 ? 600 :
           value > 10000000 ? 250 :
           value > 4500000  ? 150 :
           value > 2000000  ? 100 :
           value > 1000000  ? 80 :
                      40;
};

/* =====================
Create empty featureGroups and funcions to apply different styles
===================== */

var group0 = L.featureGroup();
var plot_markers = function(data) {
  data.forEach(function(entry) {
    var lat = parseFloat(entry['latitude']);
    var lon = parseFloat(entry['longitude']);
    var size_circle = parseFloat(entry['numberoffloors']);
    var scaled_size = size_circle*15
    var color = get_color(entry);
    L.circle([lat, lon], scaled_size, {color: color, stroke: false, fillOpacity: .6}).bindPopup("Building Name: " + entry['buildingname'] + '</br>' + "Year Built: " + entry['yearbuilt'] + '</br>' + "Number of Floors: " + entry['numberoffloors'] + '</br>' + "Total Sqft. Area: " + entry['propertygfatotal']).addTo(group0);
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
    var scaled_size = get_size_total_energy(size_circle);
    var color = get_color(entry);
    L.circle([lat, lon], scaled_size, {color: color, stroke: false, fillOpacity: .6}).bindPopup("Building Name: " + entry['buildingname'] + '</br>' + "Year Built: " + entry['yearbuilt'] + '</br>' + "Number of Floors: " + entry['numberoffloors'] + '</br>' + "Total Sqft. Area: " + entry['propertygfatotal']).addTo(group2);
  });
};

var group3 = L.featureGroup();
var plot_markers_3 = function(data) {
  data.forEach(function(entry) {
    var lat = parseFloat(entry['latitude']);
    var lon = parseFloat(entry['longitude']);
    var size_circle = parseFloat(entry['siteenergyuse_kbtu']);
    var scaled_size = get_size_total_energy(size_circle);
    var color;
    if (entry['compliancestatus'] === "Compliant") { color = "green"} else { color = "red"};
    var opc;
    if (entry['compliancestatus'] === "Compliant") { opc = .25} else { opc = .8};
    L.circle([lat, lon], scaled_size, {color: color, stroke: false, fillOpacity: opc}).bindPopup("Building Name: " + entry['buildingname'] + '</br>' + "Year Built: " + entry['yearbuilt'] + '</br>' + "Number of Floors: " + entry['numberoffloors'] + '</br>' + "Total Sqft. Area: " + entry['propertygfatotal']).addTo(group3);
  });
};

var group4 = L.featureGroup();
var plot_markers_4 = function(data) {
  data.forEach(function(entry) {
    var lat = parseFloat(entry['latitude']);
    var lon = parseFloat(entry['longitude']);
    var size_circle = parseFloat(entry['totalghgemissions']);
    var scaled_size = get_size_GHG(size_circle);
    var color;
    if (entry['compliancestatus'] === "Compliant") { color = "green"} else { color = "red"};
    var opc;
    if (entry['compliancestatus'] === "Compliant") { opc = .25} else { opc = .8};
    L.circle([lat, lon], scaled_size, {color: color, stroke: false, fillOpacity: opc}).bindPopup("Building Name: " + entry['buildingname'] + '</br>' + "Year Built: " + entry['yearbuilt'] + '</br>' + "Number of Floors: " + entry['numberoffloors'] + '</br>' + "Total Sqft. Area: " + entry['propertygfatotal'] + '</br>' + "Energy STAR Score: " + entry['energystarscore']).addTo(group4);
  });
};

/* =====================
Create slides with the proper text for each slides
===================== */

var currentSlide = 0;

var slides = [
  { title: "This city of Seattle collects information about its buildings energy consumption, for different sources of energy.", description: "This application shows some of those measurements and benchmarks, according to the building type. Click the next button to start the slide presentation." },
  { title: "Types of buildings and density.", description: "The first slide shows the categories of buildings in the dataset. The size of the markers is scaled according to the number of floors. We can see that the downtown area has the tallest buildings in the city. Most of them are classified as non-residential. There are also some residential high-rises. As in most cities, the density seems to fade, as the distance to the CBD increases." },
  { title: "Compliance Status.", description: "The building benchmarking program classifies the buildings according to their compliance to the regulation. Most noncompliant buildings are located in the downtown are. At any time, click on the markers to get some basic information about each building." },
  { title: "Total Yearly Energy Consumption per building type.", description: "This page shows that residential buildings consume less energy on average than the nonresidential ones. It is noticeable how five buildings classified as “campus” have a very high energy consumption. However, if you click on their markers to double-check, you will notice that four of them are hospitals and one of them is the Boeing Plant." },
  { title: "Total Yearly Energy Consumption per compliance status.", description: "However, if we visualize the compliance status and the yearly energy consumption, we see that the buildings with the highest consumption are mostly compliant with the regulation. Most of the noncompliant buildings have an average or small energy consumption." },
  { title: "Total Yearly Green House Gas emission per compliance status.", description: "The compliance status does not penalize either the largest emissions of green house gas. In this page, you can see that the buildings with the largest emission are compliant with the regulation. I hope you have enjoyed this slideshow. If you want to restart it, please press F5." }
]

/* =====================
Create a function to load the slides and a function to control the behavior of the different slides
===================== */

var loadSlide = function(slide) {
  $('#part01').text(slide.title);
  $('#part02').text(slide.description);
  // $('#sidebar').css("background-color", slide.color)
  }

var next = function() {
  if (currentSlide == slides.length - 1) {
  } else {
    $('#nextButton').show()
    currentSlide = currentSlide + 1
    loadSlide(slides[currentSlide])
  }

  if (currentSlide == slides.length - 1) {
    $('#nextButton').hide()
  }
}

$('#nextButton').click(function() {
  next();
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