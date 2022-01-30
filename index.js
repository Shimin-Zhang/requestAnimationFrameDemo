
const sparkF = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
</svg>`;

const spark = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
</svg>`;

// random Normal from https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
function randn_bm() {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

// get random offset on canvas in x, y with x pixel multplier
function getRandomOffset(x, y, mult) {
    const randomX = Math.round(randn_bm() * mult + x);
    const randomY = Math.round(randn_bm() * mult + y);
    return [randomX, randomY];
}

function getUpdatedPositions(dt, x, y, xp, yp, v) {
    const dxdt = Math.round(v * (xp - x) * dt);
    const dydt = Math.round(v * (yp - y) * dt);
    console.log('dxdt', dxdt)
    console.log('dydt', dydt)
    return [(x + dxdt), (y + dydt)];
}

window.onload = () => {
    const NumSparks = 5;
    const sparksCont = document.getElementById('spark-cont');

    const sparksFly = (e) => {
        for(i=0; i< NumSparks; i++) {
            createSpark(e);
        }
    }

    const createSpark = (e) => {
        // Create new spark position relative to click
        const [x, y] = [e.clientX, e.clientY];
        const [xp, yp] = getRandomOffset(x, y, 5);

        // create spark element and append to page
        const newSpark = document.createElement('div');
        newSpark.style = `position: absolute; 
            left: ${xp}px; top: ${yp}px; z-index: 100;`;
        newSpark.innerHTML = sparkF;
        sparksCont.appendChild(newSpark);

        // animate spark
        animateSpark(newSpark, x, y, xp, yp)
    }

    animateSpark = (spark, x, y, xp, yp) => {
        const velocity = 5;
        let t = 0;
        let iter = 1;
        let maxIter = 100000;
        const animate = (tp) => {
            let dt;
            // initial click we dont render, set start time instead
            if (t === 0) {
                t = tp;
                dt = 0;
            } else {
                dt = (tp - t) / 100;
            }
            const [newX, newY] = getUpdatedPositions(dt, x, y, xp, yp, velocity);
            spark.style.left= `${newX}px`;
            spark.style.top = `${newY}px`;
            iter += 1;
            if (iter < maxIter) {
                window.requestAnimationFrame(animate);
            }
        }
        window.requestAnimationFrame(animate);
    };

    const btn = document.getElementById('start');
    btn.addEventListener('click', sparksFly);
};