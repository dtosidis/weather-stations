// ==================== LANGUAGE SETTINGS ====================
const DEFAULT_LANG = 'el';
let currentLang = localStorage.getItem('mapLang') || DEFAULT_LANG;

const langSelector = document.getElementById('lang-selector');
const currentLangSpan = document.getElementById('current-lang');
const langOptions = document.getElementById('lang-options');

// Initialize dropdown display
currentLangSpan.textContent = currentLang === 'el' ? 'ΕΛ' : 'EN';

// Toggle dropdown
langSelector.addEventListener('click', e => {
    e.stopPropagation();
    langOptions.style.display = langOptions.style.display === 'block' ? 'none' : 'block';
});

// Close dropdown when clicking outside
document.addEventListener('click', e => {
    if (!langSelector.contains(e.target)) langOptions.style.display = 'none';
});

// Change language
langOptions.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', e => {
        currentLang = e.target.dataset.lang;
        currentLangSpan.textContent = e.target.textContent;
        localStorage.setItem('mapLang', currentLang);
        updateStaticText();
        updateMarkersLanguage();
        langOptions.style.display = 'none';
    });
});

// ==================== UPDATE STATIC TEXT ====================
function updateStaticText() {
    document.querySelectorAll('[data-lang-el]').forEach(el => {
        el.textContent = currentLang === 'el' ? el.getAttribute('data-lang-el') : el.getAttribute('data-lang-en');
    });
    currentLangSpan.textContent = currentLang === 'el' ? 'ΕΛ' : 'EN';
}
updateStaticText();

// ==================== MAP SETUP ====================
const map = L.map("map", { center: [41.13, 24.88], zoom: 9, maxZoom: 19 });

// Base layers
const osmLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors", maxZoom: 19
}).addTo(map);

const satelliteLayer = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    { attribution: "Tiles &copy; Esri", maxZoom: 19 }
);

const baseMaps = { "OpenStreetMap": osmLayer, "Satellite": satelliteLayer };
const layerControl = L.control.layers(baseMaps, null, { position: 'bottomright', collapsed: true }).addTo(map);
let currentBaseLayer = "OpenStreetMap";

// ==================== ICONS ====================
const darkIcon = L.icon({ iconUrl: '/static/Pin_Dark.svg', iconSize: [38,95], iconAnchor: [22,94], popupAnchor: [-3,-76] });
const lightIcon = L.icon({ iconUrl: '/static/Pin_Light.svg', iconSize: [38,95], iconAnchor: [22,94], popupAnchor: [-3,-76] });
const offlineIcon = L.icon({ iconUrl: '/static/Pin_Offline.svg', iconSize: [38,95], iconAnchor: [22,94], popupAnchor: [-3,-76] });

// ==================== MARKER CLUSTER ====================
const markersCluster = L.markerClusterGroup();
let stationMarkers = [];

// ==================== FETCH STATIONS ====================
async function loadStations() {
    try {
        const response = await fetch("/api/stations");
        if (!response.ok) throw new Error("Failed to fetch stations");
        const stations = await response.json();

        stations.forEach(station => {
            let icon = !station.status ? offlineIcon : (currentBaseLayer === "Satellite" ? lightIcon : darkIcon);
            const marker = L.marker([station.latitude, station.longitude], { icon });
            marker.stationData = station;

            const popupContent = getPopupContent(station);
            marker.bindPopup(popupContent, { className: "meteo-popup", maxWidth: 220 });

            markersCluster.addLayer(marker);
            stationMarkers.push(marker);
        });

        map.addLayer(markersCluster);
    } catch (err) {
        console.error("Error loading stations:", err);
    }
}

// ==================== POPUP CONTENT ====================
function getPopupContent(station) {
    const name = currentLang === 'el' ? (station.name.el || station.name.en) : station.name.en;
    const title = currentLang === 'el' ? "ΣΤΑΘΜΟΣ" : "STATION";

    return `
        <div class="weather-popup">
            <div class="station-label">${title}</div>
            <div class="location-name">${name}</div>
            <div class="popup-row">
              <span class="value">29°C</span>
              <span class="icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M14 14.76V5a2 2 0 10-4 0v9.76a4 4 0 104 0zM12 22a3 3 0 01-1-5.83V5a1 1 0 012 0v11.17A3 3 0 0112 22z"/>
                </svg>
              </span>
            </div>
            <div class="popup-row">
              <span class="value">0.1mm</span>
              <span class="icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M12 2s6 7.03 6 11a6 6 0 11-12 0c0-3.97 6-11 6-11z"/>
                </svg>
              </span>
            </div>
            <div class="popup-row">
              <span class="value">3 Bf</span>
              <span class="icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M4 8h9a3 3 0 10-3-3M2 12h13a3 3 0 113 3M3 16h7a2 2 0 110 4"/>
                </svg>
              </span>
            </div>
        </div>
    `;
}

// ==================== UPDATE MARKERS LANGUAGE ====================
function updateMarkersLanguage() {
    stationMarkers.forEach(marker => marker.setPopupContent(getPopupContent(marker.stationData)));
}

// ==================== BASE LAYER CHANGE ====================
map.on('baselayerchange', e => {
    currentBaseLayer = e.name;
    markersCluster.eachLayer(marker => {
        if (!marker.stationData.status) return;
        marker.setIcon(currentBaseLayer === "Satellite" ? lightIcon : darkIcon);
    });
});

// Load stations
loadStations();

const warning = document.getElementById("weatherWarning");
const header = warning.querySelector(".warning-header");
const dropdown = warning.querySelector(".warning-dropdown");
const closeBtn = document.getElementById("warningClose");

header.addEventListener("click", (e) => {

    if (dropdown.style.display === "block") {
        dropdown.style.display = "none";
    } else {
        dropdown.style.display = "block";
    }

});

closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.style.display = "none";
});

/* CLOSE WHEN CLICKING OUTSIDE */

document.addEventListener("click", function(event){

    if (!warning.contains(event.target)) {
        dropdown.style.display = "none";
    }

});