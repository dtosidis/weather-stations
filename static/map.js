const map = L.map("map").setView([41.1, 25.4], 7);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

// map.invalidateSize();
// setTimeout(() => {
//   map.invalidateSize();
// }, 100);

let marker = L.marker([50.4501, 30.5234],
  {alt: 'Kyiv'}).addTo(map) // "Kyiv" is the accessible name of this marker
  .bindPopup('Kyiv, Ukraine is the birthplace of Leaflet!');//[]

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

var greenIcon = L.icon({
    iconUrl: 'Pin_Dark.svg',

    iconSize:     [38, 95], // size of the icon
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

L.marker([51.5, -0.09], {icon: greenIcon}).addTo(map);

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