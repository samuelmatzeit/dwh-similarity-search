// static/script.js



function collectFilters() {
    // Sammle alle Filterwerte

    var filters = {
        powerMin: document.getElementById('power-min').value,
        powerMax: document.getElementById('power-max').value,
        accelerationMin: document.getElementById('acceleration-min').value,
        accelerationMax: document.getElementById('acceleration-max').value,
        priceMin: document.getElementById('price-min').value,
        priceMax: document.getElementById('price-max').value,
        consumptionMin: document.getElementById('consumption-min').value,
        consumptionMax: document.getElementById('consumption-max').value,
        co2EmissionsMin: document.getElementById('co2-min').value,
        co2EmissionsMax: document.getElementById('co2-max').value,
        topSpeedMin: document.getElementById('top-speed-min').value,
        topSpeedMax: document.getElementById('top-speed-max').value,
        torqueMin: document.getElementById('torque-min').value,
        torqueMax: document.getElementById('torque-max').value,
        curbWeightMin: document.getElementById('curb-weight-min').value,
        curbWeightMax: document.getElementById('curb-weight-max').value,
        seats: document.getElementById('seats').value,
        trunkVolumeMin: document.getElementById('trunk-volume-min').value,
        trunkVolumeMax: document.getElementById('trunk-volume-max').value,
        vehicleLengthMin: document.getElementById('length-min').value,
        vehicleLengthMax: document.getElementById('length-max').value,
        vehicleClass: document.getElementById('vehicle-class').value,
        engineType: document.getElementById('engine-type').value,
    };

    // Erstelle einen Requirements-String basierend auf den Filterwerten
    let requirements = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value) { // Nur wenn der Wert nicht leer ist
            let dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase(); // Umwandeln in snake_case für die DB
            acc.push(`${dbKey}=${value}`);
        }
        return acc;
    }, []).join(";");
    console.log(requirements)
    return requirements
}
function search() {

    filters = collectFilters();

    // Hier erfassen Sie die Werte von Ihren Schiebereglern
    var performance = document.getElementById('power').value;
    var acceleration = document.getElementById('acceleration').value;
    var price = document.getElementById('price').value;
    var consumption = document.getElementById('consumption').value;
    var length = document.getElementById('length').value;

    // Diese Werte werden als JSON an Ihren Server gesendet
    fetch('/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            performance: performance,
            acceleration: acceleration,
            price: price,
            consumption: consumption,
            length: length,  // Annahme: Länge wird in Metern gesendet und sollte in Millimetern sein
            filters: filters
        })
    })
        .then(response => response.json())
        .then(data => {
            const resultsDiv = document.getElementById('search-results');
            resultsDiv.innerHTML = ''; // Vorherige Ergebnisse löschen
            data.forEach(item => {
                const suggestionElement = document.createElement('div');
                suggestionElement.classList.add('suggestion');

                const h3 = document.createElement('h3');
                h3.textContent = `${item.model}`; // Angenommen, dass 'vehicle_id' im Objekt 'item' enthalten ist

                const p = document.createElement('p');
                p.textContent = `Passt zu : ${item.similarity}%`; // Angenommen, dass 'similarity' im Objekt 'item' enthalten ist

                suggestionElement.appendChild(h3);
                suggestionElement.appendChild(p);

                resultsDiv.appendChild(suggestionElement);
            });
        })
        .catch(error => console.error('Error:', error));
}


// Ergänze diese Funktion in deiner script.js
function fetchAndSetBorders() {
    fetch('/borders')
        .then(response => response.json())
        .then(data => {
            // Allgemeine Funktion zum Setzen der Slider-Werte und deren Beschriftungen
            // Allgemeine Funktion zum Setzen der Slider-Werte und deren Beschriftungen
            const setSlider = (sliderId, outputId, data, decimalPlaces, step) => {
                const min = Math.ceil(data.min / step) * step; // Aufrunden zum nächsten Vielfachen des Schritts
                const max = Math.floor(data.max / step) * step; // Abrunden zum nächsten Vielfachen des Schritts
                const mid = Math.round(((max + min) / 2) / step) * step; // Runden zum nächsten Vielfachen des Schritts

                // mid = Number(mid);

                const slider = document.getElementById(sliderId);
                const output = document.getElementById(outputId);
                slider.min = min;
                slider.max = max;
                slider.step = step; // Stelle sicher, dass der Schritt gesetzt ist
                slider.value = mid;
                // Format den Anzeigewert basierend auf der ID des Sliders
                let displayValue;
                switch (sliderId) {
                    case 'price':
                        displayValue = mid.toFixed(decimalPlaces) + ' €';
                        break;
                    case 'acceleration':
                        displayValue = mid.toFixed(decimalPlaces) + ' s';
                        break;
                    case 'consumption':
                        displayValue = mid.toFixed(decimalPlaces) + ' €/100km';
                        break;
                    case 'length':
                        // Hier gehen wir davon aus, dass die Daten in Zentimetern vorliegen.
                        displayValue = mid.toFixed(decimalPlaces) + ' cm';
                        break;
                    case 'power':
                        displayValue = mid.toFixed(decimalPlaces) + ' PS';
                        break;
                    default:
                        displayValue = mid.toString();
                        break;
                }
                output.textContent = displayValue;

                // Stelle den formatierten Text ein basierend auf der ID des Sliders

            };


            // Setze die Werte für jeden Slider
            setSlider('power', 'power-output', data.performance, 0, 1); // Leistung hat keine Dezimalstellen
            setSlider('acceleration', 'acceleration-output', data.acceleration, 1, 0.1); // Beschleunigung mit einer Dezimalstelle
            setSlider('price', 'price-output', data.price, 0, 500); // Preis mit zwei Dezimalstellen
            setSlider('consumption', 'consumption-output', data.consumption, 1, 0.1); // Verbrauch mit zwei Dezimalstellen
            setSlider('length', 'length-output', data.length, 0, 50); // Länge ohne Dezimalstellen, in cm

            // Die Schritte für jede Slider-Berechnung, basierend auf den Daten vom Server.
        })
        .catch(error => console.error('Error fetching borders:', error));
}

// Rufe diese Funktion auf, wenn die Seite geladen wird:
document.addEventListener('DOMContentLoaded', function () {
    fetchAndSetBorders();
});

