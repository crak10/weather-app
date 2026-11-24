/* =========================================================
   WEATHER APP - LÓGICA PRINCIPAL (JavaScript Vanilla)
   API: OpenWeatherMap - Current Weather Data (v2.5)
   ========================================================= */

/* ---------------------------------------------------------
   1. CONFIGURACIÓN DE LA API
   --------------------------------------------------------- */

// ⚠️ IMPORTANTE: La API_KEY se carga de forma segura desde el archivo config.js
// No la declares aquí o dará error de "Identifier has already been declared".

// URL base exacta del endpoint de clima actual
// units=metric → temperatura en °C y viento en m/s
// lang=es      → descripciones del clima en español
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

/* ---------------------------------------------------------
   2. REFERENCIAS A ELEMENTOS DEL DOM
   --------------------------------------------------------- */

const formulario = document.getElementById('search-form');
const inputCiudad = document.getElementById('city-input');

const loader = document.getElementById('loader');
const tarjetaClima = document.getElementById('weather-card');
const mensajeError = document.getElementById('error-message');
const textoError = document.getElementById('error-text');

const nombreCiudad = document.getElementById('city-name');
const nombrePais = document.getElementById('country-name');
const iconoClima = document.getElementById('weather-icon');
const temperatura = document.getElementById('temperature');
const descripcionClima = document.getElementById('weather-description');
const humedad = document.getElementById('humidity');
const velocidadViento = document.getElementById('wind-speed');

/* ---------------------------------------------------------
   3. FUNCIONES AUXILIARES DE UI
   --------------------------------------------------------- */

/**
 * Muestra el loader y oculta la tarjeta y el error.
 */
function mostrarLoader() {
  loader.classList.remove('d-none');
  tarjetaClima.classList.add('d-none');
  mensajeError.classList.add('d-none');
}

/**
 * Oculta el loader.
 */
function ocultarLoader() {
  loader.classList.add('d-none');
}

/**
 * Muestra un mensaje de error amigable.
 * @param {string} mensaje - Texto que se mostrará al usuario.
 */
function mostrarError(mensaje) {
  textoError.textContent = mensaje;
  mensajeError.classList.remove('d-none');
  tarjetaClima.classList.add('d-none');
}

/**
 * Rellena la tarjeta con los datos devueltos por la API y la muestra.
 * @param {Object} datos - Objeto JSON de respuesta de OpenWeatherMap.
 */
function mostrarClima(datos) {
  nombreCiudad.textContent = datos.name;
  nombrePais.textContent = datos.sys.country;
  temperatura.textContent = Math.round(datos.main.temp);
  descripcionClima.textContent = datos.weather[0].description;

  const codigoIcono = datos.weather[0].icon;
  iconoClima.src = `https://openweathermap.org/img/wn/${codigoIcono}@2x.png`;
  iconoClima.alt = datos.weather[0].description;

  humedad.textContent = `${datos.main.humidity}%`;

  // Convertimos m/s a km/h multiplicando por 3.6
  const vientoKmH = (datos.wind.speed * 3.6).toFixed(1);
  velocidadViento.textContent = `${vientoKmH} km/h`;

  tarjetaClima.classList.remove('d-none');
}

/* ---------------------------------------------------------
   4. FUNCIÓN PRINCIPAL: OBTENER EL CLIMA
   --------------------------------------------------------- */

/**
 * Consulta la API de OpenWeatherMap para la ciudad indicada.
 * @param {string} ciudad - Nombre de la ciudad a buscar.
 */
async function obtenerClima(ciudad) {
  mostrarLoader();

  try {
    // Usamos la variable API_KEY que viene desde config.js
    const url = `${BASE_URL}?q=${encodeURIComponent(ciudad)}&appid=${API_KEY}&units=metric&lang=es`;
    const respuesta = await fetch(url);

    if (!respuesta.ok) {
      if (respuesta.status === 404) {
        throw new Error('404');
      } else if (respuesta.status === 401) {
        throw new Error('401');
      } else {
        throw new Error('otro');
      }
    }

    const datos = await respuesta.json();
    mostrarClima(datos);

  } catch (error) {
    if (error.message === '404') {
      mostrarError('Ciudad no encontrada, intenta de nuevo.');
    } else if (error.message === '401') {
      mostrarError('Error de API Key. Verifica que tu clave sea correcta.');
    } else {
      mostrarError('No se pudo obtener el clima. Revisa tu conexión o intenta más tarde.');
    }
    console.error('Error al obtener el clima:', error);
  } finally {
    ocultarLoader();
  }
}

/* ---------------------------------------------------------
   5. EVENTO DEL FORMULARIO (BÚSQUEDA)
   --------------------------------------------------------- */

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();

  const ciudad = inputCiudad.value.trim();

  if (ciudad === '') {
    mostrarError('Por favor, escribe el nombre de una ciudad.');
    return;
  }

  obtenerClima(ciudad);
});