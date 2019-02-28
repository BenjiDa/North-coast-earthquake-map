mapboxgl.accessToken = 'pk.eyJ1IjoiYm1lbG9zaCIsImEiOiJjamw0N2lnenYwNTd1M2tubHNneG0ydHFpIn0.MxTNGVxi4sJytIpjajrHCg';

var createArray = function count(){
  var arr = [];
  for(var count=0;count<707672;count++){
    arr.push(count);
  }
  return arr
}

var dates = createArray;



var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/bmelosh/cjlcsa3ct41wl2slu5mnwgo8m',//mapbox://styles/mapbox/dark-v9',
    zoom: 8.6,
    center: [-122.5, 38.5],
    minZoom:6,
    maxZoom:15
});


map.on('style.load', function() {
    map.addLayer({
      'id': 'test',
      'type': 'circle',
      'source': {
          type: 'vector',
          url: 'mapbox://bmelosh.60wrl5js'
      },
      'source-layer': 'test', 
      'paint':{
        'circle-radius': ['*', ['to-number', ['get', 'MAG']], 3], 
        'circle-opacity':1, 
        'circle-color':[
          "step", ["number", ["get", "DEP"]], 
          "#000000",
          0, '#66ffff',
          1, "#61f2ff",
          2, "#5ce6ff",
          3, "#57d9ff",
          4, "#52ccff",
          5, "#4cbfff",
          6, "#47b2ff",
          7, "#42a6ff",
          8, "#3d99ff",
          9, "#388cff",
          10, "#3380ff",
          11, "#2e73ff",
          12, "#2966ff",
          13, "#2459ff",
          14, "#1f4dff",
          15, "#1a40ff",
          16, "#1433ff",
          17, "#0f26ff",
          18, "#0a19ff",
          19, "#050dff",
          20, "#0000cc"
        ],
        'circle-stroke-color': 'rgba(0, 0, 0, 0.71)',
        'circle-stroke-width': 0.5,
      }
    });

    map.addLayer({
      'id':'qfaults-306owm',
      'type':'line',
      'source':{
        type: 'vector',
        url:'mapbox://bmelosh.ai2sxfnc'
      },
      'source-layer': 'qfaults-306owm',
      'paint':{
        'line-color':[
          "match",
          ["get", "age"],
          "latest Quaternary",
          "hsl(338, 95%, 52%)",
          "late Quaternary",
          "hsla(338, 95%, 52%, 0.68)",
          "undifferentiated Quaternary",
          "hsla(338, 95%, 52%, 0.42)",
          "historic",
          "hsla(338, 95%, 52%, 1)",
          "middle and late Quaternary",
          "hsla(338, 95%, 52%, 0.57)",
          "Class B",
          "hsla(338, 95%, 52%, 0.27)",
          "hsl(44, 0%, 2%)"
        ], 
        //'line-opacity':1,
        'line-width':[
          "match", ["get", "age"],
          "historic",
          2,
          "latest Quaternary",
          1.8,
          "late Quaternary",
          1.4,
          "undifferentiated Quaternary",
          1.2,
          "middle and late Quaternary",
          1,
          "Class B",
          0.6,
          1
        ]
      }
    });

    // Create a popup, but don't add it to the map yet.
    var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    map.on('mouseenter', 'test', function() {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseenter', 'qfaults-306owm', function() {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('click', 'test', function(e) {

        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';

        var coordinates = e.features[0].geometry.coordinates.slice();
        var description = e.features[0].properties.description;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(e.features[0].geometry.coordinates)
            .setHTML('<h4>' + 'Magnitude: ' + e.features[0].properties.MAG + ' Mw' + '</h4><h4>' + 'Depth: ' + e.features[0].properties.DEP + ' km' + '</h4><h4>' + 'Date: ' + e.features[0].properties.MONTH + '/' + e.features[0].properties.DAY + '/' + e.features[0].properties.YEAR + '</h4>' )
            .setLngLat(e.features[0].geometry.coordinates)
            .addTo(map);
    });

    map.on('click', 'qfaults-306owm', function(e) {

        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';

        // new mapboxgl.Popup()
        popup.setLngLat(e.lngLat)
            .setHTML('<h4>' + e.features[0].properties.faultname + '</h4>' + '<h4>' + 'Age: ' + e.features[0].properties.age + '</h4>' + '<h4>' + 'Slip rate: ' + e.features[0].properties.sliprate + '</h4>' + '<h4>' + 'Slip sense: ' + e.features[0].properties.slipsense + '</h4>')
            .addTo(map);

        console.log(e.features[0])


    });

    map.on('mouseleave', 'qfaults-306owm', function() {
          map.getCanvas().style.cursor = '';
          popup.remove();
        });


    // Set filter to first date value 
function filterBy(startDate, endDate) {
    stringifiedendDate = endDate.toString();
    var endYear = stringifiedendDate.substr(0,4);
    var endMonth = stringifiedendDate.substr(5,2);
    var endDay = stringifiedendDate.substr(8,2);

    stringifiedstartDate = startDate.toString();
    var startYear = stringifiedstartDate.substr(0,4);
    var startMonth = stringifiedstartDate.substr(5,2);
    var startDay = stringifiedstartDate.substr(8,2);

    const startNum = parseInt(startYear + startMonth+startDay);
    const endNum = parseInt(endYear+endMonth+endDay);

    var filterStart = ['>', 'DATE', startNum];
    var filterEnd = ['<', 'DATE', endNum];
    
    map.setFilter('test', ['all', filterStart, filterEnd]);

}
var dt_from = "1984-01-01";
var dt_to = "2018-10-24";

$('.slider-time').html(dt_from);
$('.slider-time2').html(dt_to);
var min_val = Date.parse(dt_from)/1000;
var max_val = Date.parse(dt_to)/1000;

function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}

function formatDT(__dt) {
    var year = __dt.getFullYear();
    var month = zeroPad(__dt.getMonth()+1, 2);
    var date = zeroPad(__dt.getDate(), 2);
    var hours = zeroPad(__dt.getHours(), 2);
    var minutes = zeroPad(__dt.getMinutes(), 2);
    var seconds = zeroPad(__dt.getSeconds(), 2);
    return year + '-' + month + '-' + date;
};


  $("#eqSlider").slider({
    range: true,
    min: min_val,
    max: max_val,
    step: 1000,
    values: [min_val, max_val],
    slide: function (e, ui) {
        var dt_cur_from = new Date(ui.values[0]*1000); //.format("yyyy-mm-dd hh:ii:ss");
        $('.slider-time').html(formatDT(dt_cur_from));

        var dt_cur_to = new Date(ui.values[1]*1000); //.format("yyyy-mm-dd hh:ii:ss");    

        filterBy(formatDT(dt_cur_from), formatDT(dt_cur_to));

        $('.slider-time2').html(formatDT(dt_cur_to));
    }
  });

  $('#model-check').click(function() {
    if ($(this).is(":checked")){
      console.log('the box is checked')
      $('span#misCount').html('');
      var magFilter = ['>', 'MAG', 3];
      map.setFilter('test', ['all', magFilter]);
    } else {
      console.log('the box is not checked')
      $('span#misCount').html("testing");
      map.setFilter('test',['all'])
    }
  })

  // map.on("mousemove", function(event) {
  //   // var pageCoords = "(" + event.pageX + ", " + event.pageY + " )";
  //   // $('#mouseCoord').text(pageCoords);

  //   document.getElementById('info').innerHTML = 
  //     console.log(JSON.stringify(event.lngLat))
  //     $('#mouseCoord').text(event.lngLat)
  //     // JSON.stringify(event.lngLat);

  //   // $('#mouseCoord').text(JSON.stringify(event.lngLat));
  // })


});

// Create a popup, but don't add it to the map yet.
var popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
});

var layerList = document.getElementById('menu');
var inputs = layerList.getElementsByTagName('input');

function switchLayer(layer) {
  var layerId = layer.target.id;
  map.setStyle('mapbox://styles/mapbox/' + layerId + '-v9');
  if (layerId == 'hillshade') {
    map.setStyle('mapbox://styles/bmelosh/cjlcsa3ct41wl2slu5mnwgo8m')
  };
}

for (var i = 0; i < inputs.length; i++) {
    inputs[i].onclick = switchLayer;
}