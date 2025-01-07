// Claves para las APIS
const claveApiClima = '857a5077812a244c66cecb1a442eb39e';
const claveApiFotos = 'F5cq4enAjFTnWxpWM1A9Blnlq0omehBPN8S80BRimZ4';

// Elementos del DOM
const infoClima = document.getElementById('infoClima');
const galeriaFotos = document.getElementById('galeriaFotos');
const formularioUbicacion = document.getElementById('formularioUbicacion');
const entradaUbicacion = document.getElementById('entradaUbicacion');

// Función para obtener datos del clima desde la API de OpenWeatherMap
async function obtenerClima(ubicacion) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ubicacion}&appid=${claveApiClima}&units=metric&lang=es`;
    const respuesta = await fetch(url);
    return await respuesta.json();
}

// Función para obtener fotos con la ubicación desde la API de Unsplash
async function obtenerFotos(ubicacion) {
    const url = `https://api.unsplash.com/search/photos?query=${ubicacion}&client_id=${claveApiFotos}`;
    const respuesta = await fetch(url);
    return (await respuesta.json()).results;
}

// Muestra los datos del clima
function mostrarClima(clima) {
    infoClima.textContent = ''; 

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

// Muestra las fotos
function mostrarFotos(fotos) {
    galeriaFotos.textContent = '';

    galeriaFotos.style.display = 'flex';
    galeriaFotos.style.flexWrap = 'wrap';

    // Crea las imágenes y las mete en el contenedor
    fotos.forEach(foto => {
        const img = document.createElement('img');
        img.src = foto.urls.small;
        img.alt = foto.alt_description || 'Foto';
        img.className = 'rounded shadow';
        img.style.margin = '20px';
        galeriaFotos.appendChild(img);
    });
}

// Limpia los datos
function limpiarDatos() {
    infoClima.textContent = ''; 

    const mensaje = document.createElement('p');
    mensaje.textContent = 'Ingresa un lugar para obtener el clima.';
    infoClima.appendChild(mensaje);

    galeriaFotos.textContent = ''; 

    localStorage.removeItem('datosGuardados'); // Borra los datos guardados en localstorage
}

// Envia el formulario para buscar clima y fotos
formularioUbicacion.addEventListener('submit', async (evento) => {
    evento.preventDefault(); 
    const ubicacion = entradaUbicacion.value.trim();

    if (!ubicacion) return; 

    limpiarDatos(); 

    try {
        // Obtiene los datos del clima y las fotos
        const clima = await obtenerClima(ubicacion);
        const fotos = await obtenerFotos(ubicacion);

        // Guarda los datos en localStorage
        localStorage.setItem('datosGuardados', JSON.stringify({ ubicacion, clima, fotos }));

        // Muestra los datos
        mostrarClima(clima);
        mostrarFotos(fotos);
    } catch (error) {
        // Muestra el mensaje de 'No se encuentran datos' si ocurre un problema
        infoClima.textContent = '';
        const mensajeError = document.createElement('p');
        mensajeError.textContent = 'No se encuentran datos'
        mensajeError.style.color = 'red';
        infoClima.appendChild(mensajeError);
    }
});

limpiarDatos();
