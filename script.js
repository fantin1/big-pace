'use strict'

const formEl = document.querySelector('.workout-form');

formEl.addEventListener('submit', function(e){
    e.preventDefault();
});


class Workout {
    constructor(distance, duration){
        this.distance = distance;
        this.duration = duration;
    }
}





