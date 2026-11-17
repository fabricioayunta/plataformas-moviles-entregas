let contenedor = document.querySelector("#provincias");
let cantidad = document.querySelector("#cantidad");

// Población por jurisdicción según el Censo 2022 del INDEC
let poblacion = {
    "jujuy": 811611,
    "salta": 1441351,
    "catamarca": 429562,
    "tucuman": 1731820,
    "la rioja": 383865,
    "san juan": 822853,
    "san luis": 542069,
    "mendoza": 2043540,
    "neuquen": 710814,
    "santa cruz": 337226,
    "tierra del fuego, antartida e islas del atlantico sur": 185732,
    "santiago del estero": 1060906,
    "cordoba": 3840905,
    "chaco": 1129606,
    "la pampa": 361859,
    "rio negro": 750768,
    "chubut": 592621,
    "formosa": 607419,
    "santa fe": 3544908,
    "misiones": 1278873,
    "corrientes": 1212696,
    "entre rios": 1425578,
    "ciudad autonoma de buenos aires": 3121707,
    "buenos aires": 17523996
};

// Pedir las provincias de Argentina a la API
fetch("https://apis.datos.gob.ar/georef/api/provincias")
    .then(respuesta => respuesta.json())
    .then(datos => {
        let provincias = datos.provincias;

        contenedor.innerHTML = "";
        cantidad.textContent = provincias.length + " provincias";

        // Recorrer todas las provincias
        for (let i = 0; i < provincias.length; i++) {
            let provincia = provincias[i];

            contenedor.innerHTML += `
                <div class="col">
                    <div class="card tarjeta">
                        <div class="card-body">
                            <p class="provincia-numero">PROVINCIA ${i + 1}</p>
                            <h5 class="card-title">${provincia.nombre}</h5>
                            <button class="btn btn-outline-primary ver-provincia" type="button" data-provincia="${provincia.nombre}">
                                Entrar a la provincia
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
    })
    .catch(error => {
        contenedor.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    No se pudieron cargar las provincias.
                    Revisá tu conexión a internet e intentá nuevamente.
                </div>
            </div>
        `;

        cantidad.textContent = "Error";
        console.log("Error al consultar la API:", error);
    });

// Abrir la información de la provincia seleccionada
contenedor.addEventListener("click", function (event) {
    let boton = event.target.closest(".ver-provincia");

    if (boton) {
        let nombre = boton.dataset.provincia;
        mostrarProvincia(nombre);
    }
});

// Muestra los habitantes y la ubicación de la provincia
function mostrarProvincia(nombre) {
    let nombreSinTildes = sinTildes(nombre);
    let habitantes = poblacion[nombreSinTildes];

    document.querySelector("#nombreProvincia").textContent = nombre;

    if (habitantes) {
        document.querySelector("#habitantesProvincia").textContent =
            habitantes.toLocaleString("es-AR") + " habitantes";
    } else {
        document.querySelector("#habitantesProvincia").textContent =
            "Dato de población no disponible";
    }

    document.querySelector("#mapaProvincia").href =
        "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent("Provincia de " + nombre + ", Argentina");

    document.querySelector("#detalleProvincia").showModal();
}

// Cerrar la información de la provincia
document.querySelector("#cerrarDetalle").addEventListener("click", function () {
    document.querySelector("#detalleProvincia").close();
});

// Buscador: filtra las tarjetas mientras se escribe
let buscador = document.querySelector("#buscador");

buscador.addEventListener("input", function () {
    let texto = sinTildes(buscador.value);
    let tarjetas = document.querySelectorAll("#provincias .col");
    let coincidencias = 0;

    for (let i = 0; i < tarjetas.length; i++) {
        let nombre = sinTildes(tarjetas[i].querySelector("h5").textContent);

        if (nombre.includes(texto)) {
            tarjetas[i].classList.remove("d-none");
            coincidencias++;
        } else {
            tarjetas[i].classList.add("d-none");
        }
    }

    let mensaje = document.querySelector("#sinResultados");

    if (texto !== "" && coincidencias === 0) {
        mensaje.textContent = 'No se encontraron provincias que coincidan con "' + buscador.value + '".';
        mensaje.classList.remove("d-none");
    } else {
        mensaje.classList.add("d-none");
    }
});

// Pasa a minúsculas y saca las tildes (así "cordoba" encuentra "Córdoba")
function sinTildes(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Pasa a minúsculas y saca las tildes (así "cordoba" encuentra "Córdoba")
function sinTildes(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}
