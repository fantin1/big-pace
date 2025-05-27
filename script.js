'use strict'

import { v4 as uuidv4 } from 'https://cdn.jsdelivr.net/npm/uuid@9.0.0/+esm';


class Workout {
    id = uuidv4();
    date = new Date();
    constructor(distance, duration, coords) {
        this.distance = distance;
        this.duration = duration;
        this.coords = coords;
        this.#calcPace();
        this.#calcSpeed();
    }

    #calcSpeed() {
        this.pace = this.distance / (this.duration / 60);
        return this;
    }

    #calcPace() {
        this.speed = this.duration / this.distance;
        return this;
    }
}

const form = document.querySelector('.workout-form');
const inputDistance = document.querySelector('.input-distance');
const inputDuration = document.querySelector('.input-duration');


class App {
    #map;
    #zoomLevel = 13;
    #coords;
    workouts = [];
    constructor() {
        this.#initMap();
        form.addEventListener('submit', this.#newWorkout.bind(this));
    }

    #initMap() {
        navigator.geolocation.getCurrentPosition((pos) => {
            const { latitude, longitude } = pos.coords;
            const coords = [latitude, longitude];
            this.#map = L.map('map').setView(coords, this.#zoomLevel);
            L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.#map);

            this.#map.on('click', this.#newForm.bind(this))

            //L.marker(coords).addTo(this.#map)
            //    .bindPopup('A pretty CSS popup.<br> Easily customizable.')
            //    .openPopup();
        }, () => alert(`Couldn't get geolocation`));
    }

    #newForm(e){
        form.classList.remove('hidden');
        inputDistance.value = inputDuration.value = '';
        inputDistance.select();
        this.#coords = e.latlng;
    }

    #newWorkout(e){
        const validInputs = (...inputs) => inputs.every((input) => (isFinite(input) && input > 0 && input < 1000));
        e.preventDefault();

        // get input
        const distance = inputDistance.value;
        const duration = inputDuration.value;
        // validate input
        if(!validInputs(distance, duration)) return;

        // create workout
        const workout = new Workout(distance, duration, this.#coords);
        console.log(workout);
        // add to sidebar

        // add marker

        // save to local storage 
    }

}

const app = new App();










const workout = new Workout(10, 45);
const workout2 = new Workout(10, 45);
const workout3 = new Workout(10, 45);
// console.log(workout, workout2, workout3);