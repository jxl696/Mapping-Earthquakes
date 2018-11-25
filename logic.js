// Creating map object
var myMap = L.map("map", {
    center: [40.7, -73.95],
    zoom: 4
  });
  
// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
}).addTo(myMap);
  
// Link to GeoJSON
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

  // Variable for legend
var earthquake_mag;

// Grabbing our GeoJSON data..
d3.json(link, function(data){
  console.log(data);

  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr>" + new Date(feature.properties.time) +
      "<hr> Magnitude: " + feature.properties.mag);
    };

  earthquake_mag = L.geoJson(data, {
    onEachFeature: onEachFeature,

    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
          radius: feature.properties.mag * 5,
          fillColor: getColor(feature.properties.mag),
          color: "#fff",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
      });
    }
  }).addTo(myMap);
});  




// Bubble colors by earthquake magnitude
function getColor(d) {
    return d >= 5 ? 'red' :
           d >= 4 ? 'orange' :
           d >= 3 ? 'coral' :
           d >= 2 ? 'yellow' :
           d >= 1 ? 'greenyellow' :
           d >= 0 ? 'green' :
                    'white';
                      // '#FFEDA0';
  }
  var legend = L.control({position: 'bottomright'});
  
  legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];
         // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
          '<i style="background:' + getColor(grades[i]) + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

  return div;
};

legend.addTo(myMap);