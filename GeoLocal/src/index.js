const form = document.querySelector('.form-container');
const input_type = document.querySelector('#type');
const input_distance = document.querySelector('#distance');
const input_duration = document.querySelector('#duration');
const input_cadence = document.querySelector('#cadence');
const input_elevation = document.querySelector('#elevation');


class Workout {
    date = new Date();

    constructor (coords, distance, duration) {
        this.coords = coords;
        this.distance = distance;
        this.duration = duration;
    }
}

class App {
    #map;
    #mapEvent;

    constructor() {
        this._getPosition();
        form.addEventListener('submit', this._newWorkout.bind(this));
        input_type.addEventListener('change', this._toggleElevationField);
    }



    _getPosition() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function () {
                alert('deu ruim!');
            });
        }
    }



    _loadMap(position) {
        const { latitude } = position.coords;
        const { longitude } = position.coords;
        console.log(`https://www.google.pt/maps/@${latitude},${longitude}`);

        const coords = [latitude, longitude];

        this.#map = L.map('map').setView(coords, 13);

        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);

        this.#map.on('click', this._showForm.bind(this));
    }
        

    _showForm(mapE) {
        this.#mapEvent = mapE;
            form.classList.remove('hidden');
            input_distance.focus();
    }

    _toggleElevationField() {
        input_elevation.closest('.form-box').classList.toggle('hidden-form');
        input_cadence.closest('.form-box').classList.toggle('hidden-form');
    }

    _newWorkout(e) {
        e.preventDefault();

        input_distance.value = input_duration.value = input_cadence.value = input_elevation.value = '';

        const { lat, lng } = this.#mapEvent.latlng;
        L.marker([lat, lng])
        .addTo(this.#map)
        .bindPopup(
            L.popup({
                maxWidth: 250,
                minWidth: 100,
                autoClose: false,
                closeOnClick: false,
                className: 'running-popup',
            })
        )
        .setPopupContent('workout')
        .openPopup();
    }
}

const app = new App();


