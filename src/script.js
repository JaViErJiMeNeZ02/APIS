const claveApiClima = '857a5077812a244c66cecb1a442eb39e';
const claveApiFotos = 'F5cq4enAjFTnWxpWM1A9Blnlq0omehBPN8S80BRimZ4';

const infoClima = document.getElementById('infoClima');
const galeriaFotos = document.getElementById('galeriaFotos');
const formularioUbicacion = document.getElementById('formularioUbicacion');
const entradaUbicacion = document.getElementById('entradaUbicacion');

async function obtenerClima(ubicacion) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ubicacion}&appid=${claveApiClima}&units=metric&lang=es`;
    const respuesta = await fetch(url);
    return await respuesta.json();
}

async function obtenerFotos(ubicacion) {
    const url = `https://api.unsplash.com/search/photos?query=${ubicacion}&client_id=${claveApiFotos}`;
    const respuesta = await fetch(url);
    return (await respuesta.json()).results;
}

function mostrarClima(clima) {
    infoClima.textContent = ''; // Limpia el contenido previo

    const titulo = document.createElement('h2');
    titulo.className = 'text-2xl font-bold';
    titulo.textContent = `Clima en ${clima.name}`;

    const temperatura = document.createElement('p');
    temperatura.textContent = `Temperatura: ${clima.main.temp}°C`;

    const descripcion = document.createElement('p');
    descripcion.textContent = `Descripción: ${clima.weather[0].description}`;

    infoClima.appendChild(titulo);
    infoClima.appendChild(temperatura);
    infoClima.appendChild(descripcion);
}

function mostrarFotos(fotos) {
    galeriaFotos.textContent = ''; 

    galeriaFotos.style.display = 'flex';
    galeriaFotos.style.flexWrap = 'wrap';
    

    fotos.forEach(foto => {
        const img = document.createElement('img');
        img.src = foto.urls.small;
        img.alt = foto.alt_description || 'Foto';
        img.className = 'rounded shadow';
        img.style.margin = '20px';
        galeriaFotos.appendChild(img);
    });
}

function limpiarDatos() {
    infoClima.textContent = ''; 

    const mensaje = document.createElement('p');
    mensaje.textContent = 'Ingresa un lugar para obtener el clima.';
    infoClima.appendChild(mensaje);

    galeriaFotos.textContent = ''; // Limpia el contenido previo

    localStorage.removeItem('datosGuardados');
}

formularioUbicacion.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const ubicacion = entradaUbicacion.value.trim();

    if (!ubicacion) return;

    limpiarDatos();

    try {
        const clima = await obtenerClima(ubicacion);
        const fotos = await obtenerFotos(ubicacion);

        localStorage.setItem('datosGuardados', JSON.stringify({ ubicacion, clima, fotos }));

        mostrarClima(clima);
        mostrarFotos(fotos);
    } catch (error) {
        infoClima.textContent = ''; // Limpia el contenido previo
        const mensajeError = document.createElement('p');
        mensajeError.textContent = error.message;
        mensajeError.style.color = 'red';
        infoClima.appendChild(mensajeError);
    }
});

limpiarDatos();
