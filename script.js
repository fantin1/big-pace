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
        this.#getDisplayDate();
        this.title = this.displayDate; //later replace with location
    }

    #calcSpeed() {
        this.pace = this.distance / (this.duration / 60);
        return this;
    }

    #calcPace() {
        this.speed = this.duration / this.distance;
        return this;
    }

    #getDisplayDate() {
        const day = this.date.getDate();
        const month = this.date.getMonth();
        const hours = this.date.getHours();
        this.displayDate = `${(day + '').padStart(2, '0')}/${(month + '').padStart(2, '0')} as ${hours} horas`;
        return this;
    }
}

const form = document.querySelector('.workout-form');
const inputDistance = document.querySelector('.input-distance');
const inputDuration = document.querySelector('.input-duration');
const workoutList = document.querySelector('.workout-list');


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

            
        }, () => alert(`Couldn't get geolocation`));
    }

    #newForm(e) {
        form.classList.remove('hidden');
        inputDistance.value = inputDuration.value = '';
        inputDistance.select();
        this.#coords = e.latlng;
    }

    #newWorkout(e) {
        const validInputs = (...inputs) => inputs.every((input) => (isFinite(input) && input > 0 && input < 1000));
        e.preventDefault();

        // get input
        const distance = inputDistance.value;
        const duration = inputDuration.value;
        // validate input
        if (!validInputs(distance, duration)) return;

        // create workout
        const workout = new Workout(distance, duration, this.#coords);
        this.workouts.push(workout);

        // add to sidebar
        this.#renderWorkout(workout);

        // add marker
        this.#renderWorkoutMarker(workout);
        // save to local storage 
    }

    #renderWorkout(workout) {
        const html = `
                <li class="workout-list-item" data-id="${workout.id}">
                    <h2 class="workout-title">${workout.title}</h2>
                    <div class="workout-info">
                        <div class="info-item">
                            <span class="info-icon">🏃</span><span class="info-name"> Distância</span><span class="info-value"> ${workout.distance} </span><span class="info-unit"> Km </span>
                        </div>
                        <div class="info-item">
                            <span class="info-icon">🕒</span><span class="info-name"> Duração</span><span class="info-value"> ${workout.duration} </span> <span class="info-unit"> min</span>
                        </div>
                        <div class="info-item">
                            <span class="info-icon">👟</span><span class="info-name"> Ritmo</span><span class="info-value"> ${workout.pace.toFixed(1)} </span><span class="info-unit"> min/km</span>
                        </div>
                        <div class="info-item">
                            <span class="info-icon">⚡</span><span class="info-name"> Velocidade</span><span class="info-value"> ${workout.speed.toFixed(1)} </span><span class="info-unit"> Km/h</span>
                        </div>
                    </div>
                </li>
        `;
        workoutList.insertAdjacentHTML('afterbegin', html);
    }

    #renderWorkoutMarker(workout){
        L.marker(workout.coords).addTo(this.#map)
               .bindPopup(`${workout.title}`)
               .openPopup();
    }


}

const app = new App();










const workout = new Workout(10, 45);
const workout2 = new Workout(10, 45);
const workout3 = new Workout(10, 45);
// console.log(workout, workout2, workout3);