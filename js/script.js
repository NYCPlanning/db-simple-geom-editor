var map = L.map('map').setView([40.706213526877455, -74.0044641494751], 15);
      
L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
}).addTo(map);

var editableLayers = new L.FeatureGroup();

map.addLayer(editableLayers);

var MyCustomMarker = L.Icon.extend({
  options: {
    iconAnchor: new L.Point(12, 41),
    iconSize: new L.Point(25, 41),
    iconUrl: 'images/marker-icon.png'
  }
});

var options = {
  position: 'topright',
  draw: {
    polyline: false,
    polygon: {
      allowIntersection: false, // Restricts shapes to simple polygons
      drawError: {
        color: '#e1e100', // Color the shape will turn when intersects
        message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
      },
      shapeOptions: {
        color: '#bada55'
      }
    },
    circle: false, // Turns off this drawing tool
    rectangle: {
      shapeOptions: {
        clickable: false
      }
    },
    marker: {
      icon: new MyCustomMarker()
    }
  },
  edit: {
    featureGroup: editableLayers, //REQUIRED!!
    remove: true,
  }
};

var drawControl = new L.Control.Draw(options);
map.addControl(drawControl);

map.on(L.Draw.Event.CREATED, function (e) {
  var type = e.layerType,
    layer = e.layer;

  processLayer(layer);
  editableLayers.addLayer(layer);
});

function processLayer(layer) {
  var geojson = layer.toGeoJSON();
  var geometryString = JSON.stringify(geojson.geometry);
  console.log(geometryString)

  var id = $('#idinput').val()

  var command = 'echo \'' + geometryString + '\' >> ' + id + '.json'

  $('#textarea').val(command);
}
