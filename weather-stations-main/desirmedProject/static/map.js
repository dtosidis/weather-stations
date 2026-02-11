const map = L.map("map").setView([20, 0], 2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

let markers = [];

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