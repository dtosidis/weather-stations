const map = L.map("map",{layers: [lyr_satellite, lyr_streets]}).setView([41.1, 25.4], 7);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

var lyr_satellite = L.tileLayer(esri_url, {id: 'MapID', maxZoom: 20, tileSize: 512, zoomOffset: -1, attribution: esri_attribution});
var lyr_streets   = L.tileLayer(mapbox_url, {id: 'mapbox/streets-v11', maxZoom: 28, tileSize: 512, zoomOffset: -1, attribution: mapbox_attribution});
// var map = L.map('map', {
//             center: [54.17747885048963, -6.337641477584839],
//             zoom: 18,
//             layers: [lyr_satellite, lyr_streets, lg_markers]
//           });

var baseMaps = {
              "Streets": lyr_streets,
              "Satellite": lyr_satellite
          };
// var overlayMaps = {
//               "Markers": lg_markers,
//           };

L.control.layers(baseMaps).addTo(map);
    // , overlayMaps).addTo(map);

// map.invalidateSize();
// setTimeout(() => {
//   map.invalidateSize();
// }, 100);

let marker = L.marker([50.4501, 30.5234],
  {alt: 'Kyiv'}).addTo(map) // "Kyiv" is the accessible name of this marker
  .bindPopup('Kyiv is a nice city!');//[]

// var popup = L.popup();
//
// function onMapClick(e) {
//     popup
//         .setLatLng(e.latlng)
//         .setContent("You clicked the map at " + e.latlng.toString())
//         .openOn(map);
// }
//
// map.on('click', onMapClick);

var cloudIcon = L.icon({
    iconUrl: 'static\\Pin_Dark.svg',
//    shadowUrl:'',

    iconSize:     [38, 95], // size of the icon
    //    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    //    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

L.marker([51.5, -0.09], {icon: cloudIcon}).addTo(map);

function clearMarkers() {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
}

async function search() {
    const query = document.getElementById("search").value;
    if (!query) return;

    clearMarkers();

    const response = await fetch(`/api/locations?q=${encodeURIComponent(query)}`);
    const locations = await response.json();

    locations.forEach(loc => {
        const marker = L.marker([loc.lat, loc.lng])
            .addTo(map)
            .bindPopup(loc.name);

        markers.push(marker);
    });

    if (locations.length > 0) {
        map.setView([locations[0].lat, locations[0].lng], 12);
    }
}