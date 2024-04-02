// Improved function for collecting filter values from the UI
function collectFilters() {
    const filters = {
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

    let requirements = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value) {
            let dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
            acc.push(`${dbKey}=${value}`);
        }
        return acc;
    }, []).join(";");
    console.log(requirements);
    return requirements;
}

// Improved search function that uses the collected filters to make a server request
function search() {
    const filters = collectFilters();

    // Fetch slider values directly without intermediate variables for cleaner code
    fetch('/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            performance: document.getElementById('power').value,
            acceleration: document.getElementById('acceleration').value,
            price: document.getElementById('price').value,
            consumption: document.getElementById('consumption').value,
            length: document.getElementById('length').value,
            filters: filters
        })
    })
    .then(response => response.json())
    .then(data => {
        const resultsDiv = document.getElementById('search-results');
        resultsDiv.innerHTML = ''; // Clear previous results
        data.forEach(item => {
            const suggestionElement = document.createElement('div');
            suggestionElement.classList.add('suggestion');
            suggestionElement.innerHTML = `<h3>${item.model}</h3><p>Passt zu: ${item.similarity}%</p>`;
            resultsDiv.appendChild(suggestionElement);
        });
    })
    .catch(error => console.error('Error:', error));
}

// Function to fetch slider boundaries and set them accordingly
function fetchAndSetBorders() {
    fetch('/borders')
    .then(response => response.json())
    .then(data => {
        const sliders = [
            { id: 'power', outputId: 'power-output', decimalPlaces: 0, step: 1 },
            { id: 'acceleration', outputId: 'acceleration-output', decimalPlaces: 1, step: 0.1 },
            { id: 'price', outputId: 'price-output', decimalPlaces: 0, step: 500 },
            { id: 'consumption', outputId: 'consumption-output', decimalPlaces: 1, step: 0.1 },
            { id: 'length', outputId: 'length-output', decimalPlaces: 0, step: 50 },
        ];

        sliders.forEach(({ id, outputId, decimalPlaces, step }) => {
            setSlider(id, outputId, data[id], decimalPlaces, step);
        });
    })
    .catch(error => console.error('Error fetching borders:', error));
}

function setSlider(sliderId, outputId, data, decimalPlaces, step) {
    const min = Math.ceil(data.min / step) * step;
    const max = Math.floor(data.max / step) * step;
    const mid = Math.round(((max + min) / 2) / step) * step;

    const slider = document.getElementById(sliderId);
    const output = document.getElementById(outputId);
    slider.min = min;
    slider.max = max;
    slider.step = step;
    slider.value = mid;
    output.textContent = formatSliderDisplay(sliderId, mid, decimalPlaces);
}

function formatSliderDisplay(sliderId, value, decimalPlaces) {
    switch (sliderId) {
        case 'price': return `${value.toFixed(decimalPlaces)} €`;
        case 'acceleration': return `${value.toFixed(decimalPlaces)} s`;
        case 'consumption': return `${value.toFixed(decimalPlaces)} €/100km`;
        case 'length': return `${value.toFixed(decimalPlaces)} cm`;
        case 'power': return `${value.toFixed(decimalPlaces)} PS`;
        default: return value.toString();
    }
}

// Initialize sliders and fetch border values on DOM load
document.addEventListener('DOMContentLoaded', function () {
    fetchAndSetBorders();
});
