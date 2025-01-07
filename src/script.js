const claveApiClima = '857a5077812a244c66cecb1a442eb39e';
const claveApiFotos = 'F5cq4enAjFTnWxpWM1A9Blnlq0omehBPN8S80BRimZ4';

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
    const temperatura = clima.main.temp;  

    document.getElementById('infoClima').innerHTML = `
        <h2 class="text-2xl font-bold">Clima en ${clima.name}</h2>
        <p>Temperatura: ${temperatura}°C</p>
        <p>Descripción: ${clima.weather[0].description}</p>`;
}

function mostrarFotos(fotos) {
    document.getElementById('galeriaFotos').innerHTML = fotos.map(foto => `
        <img src="${foto.urls.small}" alt="${foto.alt_description || 'Foto'}" class="rounded shadow">
    `).join('');
}

function limpiarDatos() {
    document.getElementById('infoClima').innerHTML = `<p>Ingresa un lugar para obtener el clima.</p>`;
    document.getElementById('galeriaFotos').innerHTML = ''; 
    localStorage.removeItem('datosGuardados'); 
}

document.getElementById('formularioUbicacion').addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const ubicacion = document.getElementById('entradaUbicacion').value.trim();

    if (!ubicacion) return; 

    limpiarDatos();

    try {
        const clima = await obtenerClima(ubicacion);
        const fotos = await obtenerFotos(ubicacion);

        localStorage.setItem('datosGuardados', JSON.stringify({ ubicacion, clima, fotos }));

        mostrarClima(clima);
        mostrarFotos(fotos);
    } catch (error) {
        document.getElementById('infoClima').innerHTML = `<p style="color:red;">${error.message}</p>`;
    }
});

limpiarDatos();