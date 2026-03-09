const map = L.map("map").setView([20, 0], 2);

// Base OpenStreetMap layer
const osmLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

// Satellite layer (Esri World Imagery)
const satelliteLayer = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
        attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
    }
);

// Optional: add layer control to switch between them
L.control.layers({
    "OpenStreetMap": osmLayer,
    "Satellite": satelliteLayer
}).addTo(map);

// map.invalidateSize();
// setTimeout(() => {
//   map.invalidateSize();
// }, 100);

//let marker = L.marker([50.4501, 30.5234],
//  {alt: 'Kyiv'}).addTo(map) // "Kyiv" is the accessible name of this marker
//  .bindPopup('Kyiv is a nice city!');//[]

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

var darkIcon = L.icon({
    iconUrl: 'static\\Pin_Dark.svg',
//    shadowUrl:'',

    iconSize:     [38, 95], // size of the icon
    //    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    //    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var offlineIcon = L.icon({
    iconUrl: 'static\\Pin_Offline.svg',
    iconSize:     [38, 95], // size of the icon
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var lightIcon = L.icon({
    iconUrl: 'static/Pin_Light.svg',
    iconSize: [38, 95],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76]
});

var currentBaseLayer = "Default";
L.marker([51.5, -0.09], {icon: offlineIcon}).addTo(map).bindPopup(`
    <div class="weather-popup">
        <div class="station-label">STATION</div>
        <div class="location-name">London, The Borough</div>
        <div class="temp right-align">29°C</div>
        <div class="weather-row right-align">0.1mm</div>
        <div class="weather-row right-align">3 Bf</div>
    </div>
  `, {
      className: "meteo-popup",
      maxWidth: 220
  });


//console.log('a');
//let icon = (currentBaseLayer === "Satellite") ? lightIcon : offlineIcon;


var marker =  L.marker([50.4501, 30.5234], { icon: darkIcon })
  .addTo(map)
  .bindPopup(`
    <div class="weather-popup">
        <div class="station-label">STATION</div>
        <div class="location-name">Kyiv</div>
        <div class="temp right-align">29°C</div>
        <div class="weather-row right-align">0.1mm</div>
        <div class="weather-row right-align">3 Bf</div>
    </div>
  `, {
      className: "meteo-popup",
      maxWidth: 220
  });

map.on('baselayerchange', function (e) {
    currentBaseLayer = e.name;
    if (e.name === "Satellite") {
        console.log('a');
        marker.setIcon(lightIcon);
    } else {
        marker.setIcon(darkIcon);
    }
});

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