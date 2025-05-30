'use strict'

import { v4 as uuidv4 } from 'https://cdn.jsdelivr.net/npm/uuid@9.0.0/+esm';

class User {
    constructor(name, weight) {
        this.name = name;
        this.weight = weight;
    }
}

class Workout {
    id = uuidv4();
    date = new Date();
    constructor(distance, duration, coords, user) {
        this.distance = distance;
        this.duration = duration;
        this.coords = coords;
        this.user = user;
        this.#calcPace();
        this.#calcSpeed();
        this.#getDisplayDate();
        this.title = this.displayDate; //later replace with location
        this.#calcBurnedCals();
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

    #calcBurnedCals() {
        // 1 MET ~= 1Kcal / kg body weight
        // 12029 6.0 running Running, 6.44 km/h (8.06 min/km)
        // 12030 8.3 running running, 8.05 km/h (7.46 min/km)
        // 12040 9.0 running running, 8.37 km/h (7.14 min/km)
        // 12050 9.8 running running, 9.66 km/h (6.21 min/km)
        // 12060 10.5 running running, 10.78 km/h (5.59 min/km)
        // 12070 11.0 running running, 11.27 km/h (5.28 min/km)
        // 12080 11.5 running running, 12.07 km/h (4.97 min/km)
        // 12090 11.8 running running, 12.87 km/h (4.66 min/km)
        // 12100 12.3 running running, 13.84 km/h (4.35 min/km)
        // 12110 12.8 running running, 14.48 km/h (4.04 min/km)
        // 12120 14.5 running running, 16.09 km/h (3.73 min/km)
        // 12130 16.0 running running, 17.70 km/h (3.41 min/km)
        // 12132 19.0 running running, 19.31 km/h (3.11 min/km)
        // 12134 19.8 running running, 20.92 km/h (2.86 min/km)
        // 12135 23.0 running running, 22.53 km/h (2.67 min/km)
        // 17085 2.5 walking bird watching, slow walk
        // 17088 4.5 walking marching, moderate speed, military, no pack
        // 17110 6.5 walking race walking
        // https://cdn-links.lww.com/permalink/mss/a/mss_43_8_2011_06_13_ainsworth_202093_sdc1.pdf?
        // note: can consider elevation gain
        const met = 1 * this.user.weight;
        let activityMets;


        this.burnedCals = 500;
        return this;
    }

}

const form = document.querySelector('.workout-form');
const inputDistance = document.querySelector('.input-distance');
const inputDuration = document.querySelector('.input-duration');
const workoutList = document.querySelector('.workout-list');
const header = document.querySelector('header');


class App {
    #map;
    #zoomLevel = 13;
    #coords;
    #activeMarker;
    workouts = [];
    #user = new User('Pedro', 60);
    constructor() {
        this.#initMap();
        form.addEventListener('submit', this.#newWorkout.bind(this));
        workoutList.addEventListener('click', this.#jumpToWorkout.bind(this));
        header.addEventListener('click', this.#cancelWorkout.bind(this));
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
        if (this.#activeMarker) this.#activeMarker.remove();
        this.#activeMarker = L.marker(this.#coords).addTo(this.#map)
            .bindPopup(`Nova corrida`)
            .openPopup();
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
        console.log(this.workouts);
        // add to sidebar
        this.#renderWorkout(workout);

        // add marker
        this.#renderWorkoutMarker(workout);

        // save to local storage 

        //clear form
        inputDistance.value = inputDuration.value = '';
        form.classList.add('hidden');
    }

    #renderWorkout(workout) {
        const html = `
                    <li class="workout-list-item" data-id="${workout.id}">
                        <h2 class="workout-title">${workout.title}</h2>
                        <div class="workout-info">
                            <div class="info-item">
                                <span class="info-value">${workout.distance}</span>
                                <span class="info-unit">km</span>
                            </div>
                            <div class="info-item">
                                <span class="info-value">${workout.duration}</span>
                                <span class="info-unit">min</span>
                            </div>
                            <div class="info-item">
                                <span class="info-value">${workout.pace.toFixed(1)}</span>
                                <span class="info-unit">min/km</span>
                            </div>
                            <div class="info-item">
                                <span class="info-value">${workout.burnedCals.toFixed(0)}</span>
                                <span class="info-unit">Kcal</span>
                            </div>
                        </div>
                    </li>
        `;
        workoutList.insertAdjacentHTML('afterbegin', html);
    }

    #renderWorkoutMarker(workout) {
        this.#activeMarker.remove();
        L.marker(workout.coords).addTo(this.#map)
            .bindPopup(`${workout.title}`)
            .openPopup();
    }

    #jumpToWorkout(e) {
        const target = e.target.closest('.workout-list-item');
        const workout = this.workouts.find((work) => work.id === target.dataset.id);
        this.#map.setView(workout.coords);
    }

    #cancelWorkout(e) {
        if (e.target.closest('.workout-form')) return;
        inputDistance.value = inputDuration.value = '';
        form.classList.add('hidden');
        this.#activeMarker.remove();
    }

}

const app = new App();










const workout = new Workout(10, 45);
const workout2 = new Workout(10, 45);
const workout3 = new Workout(10, 45);
// console.log(workout, workout2, workout3);