import './style.css';
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
let risultati = [];


var map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const legend = L.control({ position: 'bottomright' });

const div = L.DomUtil.create('div', 'info legend');
div.innerHTML += `
  <span style="background: #053a5fff; width: 14px; height: 14px; display:inline-block; margin-right:6px; border:1px solid #333;"></span> ≤ 0°C<br>
  <span style="background: #96ebeeff; width: 14px; height: 14px; display:inline-block; margin-right:6px; border:1px solid #333;"></span> 1-10°C<br>
  <span style="background: #f7de71ff; width: 14px; height: 14px; display:inline-block; margin-right:6px; border:1px solid #333;"></span> 11-20°C<br>
  <span style="background: #daac14ff; width: 14px; height: 14px; display:inline-block; margin-right:6px; border:1px solid #333;"></span> 21-30°C<br>
  <span style="background: #800000; width: 14px; height: 14px; display:inline-block; margin-right:6px; border:1px solid #333;"></span> > 30°C<br>
  <span style="background: #999; width: 14px; height: 14px; display:inline-block; margin-right:6px; border:1px solid #333;"></span> No data<br>
`;
div.style.background = 'white';
div.style.padding = '6px 8px';
div.style.borderRadius = '4px';
div.style.boxShadow = '0 0 15px rgba(0,0,0,0.2)';

legend.onAdd = function () {
    return div;
};

legend.addTo(map);


const caricaDati = async (items) => {

    if (items === undefined) {
        const resultList = await pb.collection('prova').getList();
        risultati = resultList.items;
        items = risultati;
    }


    map.eachLayer(layer => {
        if (layer instanceof L.CircleMarker) map.removeLayer(layer);
    });

 
    const getColor = (temp) => {
        if (temp === null || temp === undefined) return '#999'; 
        if (temp <= 0) return '#053a5fff';     
        if (temp <= 10) return '#96ebeeff';    
        if (temp <= 20) return '#f7de71ff';    
        if (temp <= 30) return '#daac14ff';    
        return '#800000';                     
    };

    const ul = document.getElementById("markerList");
    ul.innerHTML = "";
    items.forEach((d) => {
        const lat = d.field.lat;
        const lon = d.field.lon;
        const temp = d.temperature;

        L.circleMarker([lat, lon], {
            radius: 8,
            fillColor: getColor(temp),
            color: '#333',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map)
        .bindPopup(`
            Lat: ${lat}<br>
            Lon: ${lon}<br>
            Temp: ${temp}<br>
            Desc: ${d.description}
        `);
        const li = document.createElement("li");
        li.innerHTML = `<strong>${d.description}</strong><br>Temp: ${temp}°C<br>Lat: ${lat}, Lon: ${lon}`;
        ul.appendChild(li);
    });

    







let sum = 0;
let count = 0;
let maxTemp = -Infinity;
let minTemp = Infinity;


items.forEach(item => {
    const t = item.temperature;

    if (t !== null && !isNaN(t)) {
        sum += t;          
        count++;           
        if (t > maxTemp) maxTemp = t;   
        if (t < minTemp) minTemp = t;   
    }
});


let avgTemp = count > 0 ? (sum / count) : 0;
document.getElementById("totalMarkers").innerHTML = `Totale markers:<br> ${items.length}`;
document.getElementById("avgTemp").innerHTML = `Temperatura media: <br>${avgTemp.toFixed(2)}°C`;
document.getElementById("maxTemp").innerHTML = `Temperatura massima:<br> ${maxTemp}°C`;
document.getElementById("minTemp").innerHTML = `Temperatura minima:<br> ${minTemp}°C`;

};





caricaDati();



async function onMapClick(e) {
    const lat = e.latlng.lat;
    const lon = e.latlng.lng;

    const Resp= await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=18`);
    const name = await Resp.json();
    const desc = name.address?.county || name.address?.city || "Unknown";


    const Response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m`);
    const meteo= await Response.json();
    const temperature = meteo.current?.temperature_2m || null;

    const data = {
        field: { lat, lon },
        description: desc,
        temperature: temperature
    };


    await pb.collection('prova').create(data);

    caricaDati();
}
map.on('click', onMapClick);


window.search = function(){
  try{
    if (!risultati || risultati.length === 0) {
      console.warn("Dati non ancora caricati, ricarico...");
      caricaDati().then(() => window.search());
      return;
    }
    const input = document.getElementById("search").value;
    let filtered = risultati.filter(r=> r.description.toLowerCase().includes(input.toLowerCase()));
    console.log(filtered);
    caricaDati(filtered);

  }catch (errore) {
    console.log("errore:", errore);
  }
};
document.getElementById("search").addEventListener("input", window.search);
