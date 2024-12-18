'use strict';

const PRECIOS = {
    'campo': 60000,
    'platea': 80000,
    'platea-alta': 50000
};

let totalCompra = 0;

function cambiarImagenConcierto() {
    const imagen = document.getElementById('imagenConcierto');
    const opcionSeleccionada = this.value;

    switch (opcionSeleccionada) {
        case 'tarja':
            imagen.src = "../assets/img/tarja.jpeg";
            break;
        case 'stratovarius':
            imagen.src = "../assets/img/stratovarius.jpeg";
            break;
        case 'beyond':
            imagen.src = "../assets/img/beyond.jpeg";
            break;
        case 'sonata':
            imagen.src = "../assets/img/sonata.jpeg";
            break;
        default:
            break;
    }
}

function agregarAlCarrito(event) {
    event.preventDefault();

    const concierto = document.getElementById('concierto').value;
    const sector = document.getElementById('sector').value;
    const cantidad = parseInt(document.getElementById('cantidad').value);

    const precio = PRECIOS[sector];
    const subtotal = precio * cantidad;

    const carritoBody = document.getElementById('tablaCarrito');
    // Verificar si ya se compro entradas para ese evento y sector   
    let filaExistente = null;
    const filas = carritoBody.querySelectorAll('tr');
    filas.forEach(fila => {
        const conciertoFila = fila.children[1].textContent.toLowerCase();
        const sectorFila = fila.children[2].textContent.toLowerCase();
        if (conciertoFila === concierto && sectorFila === sector) {
            filaExistente = fila;
        }
    });

    if (filaExistente) {
        // Si ya existe una fila, actualizar la cantidad y los valores
        const cantidadActual = parseInt(filaExistente.children[3].textContent);
        const nuevaCantidad = cantidadActual + cantidad;
        if (nuevaCantidad > 6) {
            mostrarAlertaLimite();
        } else {
            const nuevoSubtotal = nuevaCantidad * precio;
            // Actualizar la cantidad y el subtotal en la fila existente
            filaExistente.children[3].textContent = nuevaCantidad;
            filaExistente.children[5].textContent = nuevoSubtotal;           
        }
    } else {
        const nuevaFila = document.createElement('tr');
        nuevaFila.innerHTML = `
            <td><img src="../assets/img/${concierto}.jpeg" alt="${concierto}"></td>
            <td>${concierto.charAt(0).toUpperCase() + concierto.slice(1)}</td>
            <td>${sector}</td>
            <td>${cantidad}</td>
            <td>${precio}</td>
            <td>${subtotal}</td>
            <td><button class="btn btn-danger" onclick="eliminarDelCarrito(this)">Eliminar</button></td>
        `;
        carritoBody.appendChild(nuevaFila);
    }
    actualizarTotal();
    limpiarFormulario();
    document.getElementById('carrito').scrollIntoView({ behavior: 'smooth' });
    document.getElementById('confirmarCompra').classList.remove('d-none'); // Mostrar el botón de comprar
    document.getElementById('limpiarCarrito').classList.remove('d-none'); // Mostrar el botón de limpiar
    
}

function eliminarDelCarrito(button) {
    const fila = button.parentElement.parentElement;
    fila.remove();
    actualizarTotal();
}

function actualizarTotal() {
    totalCompra = 0;
    const filas = document.querySelectorAll('#tablaCarrito tr');
    filas.forEach(fila => {
        const subtotal = parseInt(fila.children[5].textContent);
        totalCompra += subtotal;
    });

    document.getElementById('totalCompra').textContent = totalCompra;
    // Si se elimina todas las filas se ocultan los botones
    if (totalCompra === 0) {
        document.getElementById('confirmarCompra').classList.add('d-none'); // Ocultar el botón de comprar
        document.getElementById('limpiarCarrito').classList.add('d-none'); // Ocultar el botón de limpiar
    }
}


function limpiarFormulario() {
    document.getElementById('concierto').value = 'tarja';
    document.getElementById('sector').value = 'campo';
    document.getElementById('cantidad').value = '1';
    document.getElementById('imagenConcierto').src = "../assets/img/tarja.jpeg";
}

function limpiarCarrito() {
    const carritoBody = document.getElementById('tablaCarrito');
    carritoBody.innerHTML = ''; // Elimina todas las filas
    totalCompra = 0;
    document.getElementById('totalCompra').textContent = totalCompra;
    document.getElementById('confirmarCompra').classList.add('d-none'); // Ocultar el botón de comprar
    document.getElementById('limpiarCarrito').classList.add('d-none'); // Ocultar el botón de limpiar
    document.getElementById('entradas').scrollIntoView({ behavior: 'smooth' });
}

function mostrarAlerta() {
    const alerta = document.getElementById('alerta');
    const overlay = document.getElementById('overlay');
    alerta.classList.remove('d-none');
    overlay.classList.remove('d-none'); // Mostrar el overlay
}

function cerrarAlerta() {
    const alerta = document.getElementById('alerta');
    const overlay = document.getElementById('overlay');
    alerta.classList.add('d-none');
    overlay.classList.add('d-none'); // Ocultar el overlay
    limpiarCarrito();
}


function mostrarAlertaLimite() {
    const alerta = document.getElementById('alertaLimiteExcedido');
    const overlay = document.getElementById('overlay');
    alerta.classList.remove('d-none'); // Mostrar la alerta
    overlay.classList.remove('d-none'); // Mostrar el overlay
}

// Ocultar la alerta y el overlay
function cerrarAlertaLimite() {
    const alerta = document.getElementById('alertaLimiteExcedido');
    const overlay = document.getElementById('overlay');
    alerta.classList.add('d-none'); // Ocultar la alerta
    overlay.classList.add('d-none'); // Ocultar el overlay
}

// Registro de eventos
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('concierto').addEventListener('change', cambiarImagenConcierto);
    document.getElementById('agregarAlCarrito').addEventListener('click', agregarAlCarrito);
    document.getElementById('confirmarCompra').addEventListener('click', mostrarAlerta);
    document.getElementById('compraRealizada').addEventListener('click', cerrarAlerta);
    document.getElementById('limpiarCarrito').addEventListener('click', limpiarCarrito);
    document.getElementById('cerrarAlertaLimite').addEventListener('click', cerrarAlertaLimite);
});
 