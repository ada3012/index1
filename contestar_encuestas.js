const modal = document.getElementById('modal');
const agregar = document.getElementById('agregar');
const btnCerrarModal = document.getElementById('btnCerrarModal');
const btnAgregarPregunta = document.getElementById('agregarPregunta');
const btnGuardarEncuesta = document.getElementById('guardarEncuesta');
const preguntasContainer = document.getElementById('preguntasContainer');
const encuestasContainer = document.querySelector('.encuestas');
let encuestaEditando = null;

document.addEventListener('DOMContentLoaded', () => {
    cargarEncuestas();
    crearBotonHome(); 
});

agregar.addEventListener('click', () => {
    modal.style.display = 'flex';
});

btnCerrarModal.addEventListener('click', () => {
    modal.style.display = 'none';
    limpiarModal();
    encuestaEditando = null;
});
btnAgregarPregunta.addEventListener('click', () => {
    agregarNuevaPregunta();
});
btnGuardarEncuesta.addEventListener('click', () => {
    guardarEncuestaModal();
});
function agregarNuevaPregunta() {
    const preguntaDiv = document.createElement('div');
    preguntaDiv.className = 'pregunta';
    preguntaDiv.innerHTML = `
        <input type="text" placeholder="Pregunta" required>
        <button class="borrarPregunta">-</button>
        <div class="respuestas"></div>
        <button class="agregarRespuesta">Agregar Respuesta</button>
    `;
    
    const respuestasDiv = preguntaDiv.querySelector('.respuestas');
    const btnAgregarRespuesta = preguntaDiv.querySelector('.agregarRespuesta');
    const borrarPregunta = preguntaDiv.querySelector('.borrarPregunta');
    
    borrarPregunta.addEventListener('click', () => preguntaDiv.remove());
    btnAgregarRespuesta.addEventListener('click', () => agregarRespuesta(respuestasDiv));

    preguntasContainer.appendChild(preguntaDiv);
}

function guardarEncuestaModal() {
    const nombreEncuesta = document.getElementById('nombreEncuesta').value.trim();
    if (nombreEncuesta === '') {
        alert('Por favor, ingresa un nombre para la encuesta.');
        return;
    }

    const preguntas = Array.from(preguntasContainer.querySelectorAll('.pregunta'));
    if (preguntas.length === 0) {
        alert('La encuesta debe tener al menos una pregunta.');
        return;
    }

    const nuevaEncuesta = { nombre: nombreEncuesta, preguntas: [] };

    let encuestaValida = true;

    preguntas.forEach((pregunta) => {
        const textoPregunta = pregunta.querySelector('input[type="text"]').value.trim();
        const respuestas = Array.from(pregunta.querySelectorAll('.respuestas input'))
            .map(input => input.value.trim())
            .filter(res => res !== '');

        if (!textoPregunta || respuestas.length < 2) {
            alert('Cada pregunta debe tener al menos dos respuestas.');
            encuestaValida = false;
            return;
        }

        nuevaEncuesta.preguntas.push({ texto: textoPregunta, respuestas });
    });

    if (!encuestaValida) return;

    if (encuestaEditando) {
        actualizarEncuesta(nuevaEncuesta);
    } else {
        guardarEncuesta(nuevaEncuesta);
        mostrarEncuesta(nuevaEncuesta);
    }

    limpiarModal();
    modal.style.display = 'none';
}

function agregarRespuesta(container) {
    const respuestaDiv = document.createElement('div');
    respuestaDiv.className = 'respuesta-item';
    respuestaDiv.innerHTML = `
        <input type="text" placeholder="Respuesta" required>
        <button class="borrarRespuesta">-</button>
    `;

    respuestaDiv.querySelector('.borrarRespuesta').addEventListener('click', () => {
        respuestaDiv.remove();
    });

    container.appendChild(respuestaDiv);
}

function guardarEncuesta(encuesta) {
    let encuestasGuardadas = JSON.parse(localStorage.getItem('encuestas')) || [];
    encuestasGuardadas.push(encuesta);
    localStorage.setItem('encuestas', JSON.stringify(encuestasGuardadas));
}

function cargarEncuestas() {
    const encuestasGuardadas = JSON.parse(localStorage.getItem('encuestas')) || [];
    encuestasGuardadas.forEach(encuesta => mostrarEncuesta(encuesta));
}

function mostrarEncuesta(encuesta) {
    const nuevaEncuestaDiv = document.createElement('div');
    nuevaEncuestaDiv.className = 'encuesta';
    nuevaEncuestaDiv.innerHTML = `
        <h3>${encuesta.nombre}</h3>
        <button class="editar">Editar</button>
        <button class="eliminar">X</button>
        <button class="estadisticas">Estadísticas</button>
    `;

    nuevaEncuestaDiv.querySelector('.editar').addEventListener('click', () => {
        abrirParaEditar(encuesta);
    });

    nuevaEncuestaDiv.querySelector('.eliminar').addEventListener('click', () => {
        eliminarEncuesta(encuesta, nuevaEncuestaDiv);
    });

    nuevaEncuestaDiv.querySelector('.estadisticas').addEventListener('click', () => {
        mostrarEstadisticas(encuesta);
    });

    encuestasContainer.appendChild(nuevaEncuestaDiv);
}

function crearBotonHome() {
    const btnHome = document.createElement('button');
    btnHome.innerHTML = '🏠';
    btnHome.style.backgroundColor = 'transparent';
    btnHome.style.border = 'none';
    btnHome.style.fontSize = '24px';
    btnHome.style.cursor = 'pointer';
    btnHome.style.margin = '10px';

    btnHome.addEventListener('click', () => {
        window.location.href = 'inicio.html';
    });

    document.body.prepend(btnHome);
}

function mostrarEstadisticas(encuesta) {
    const respuestasGuardadas = JSON.parse(localStorage.getItem('respuestas')) || {};
    const respuestasEncuesta = respuestasGuardadas[encuesta.nombre] || [];

    if (respuestasEncuesta.length === 0) {
        alert('No hay respuestas para esta encuesta.');
        return;
    }

    let mensaje = `Respuestas de "${encuesta.nombre}":\n\n`;
    respuestasEncuesta.forEach((respuesta, index) => {
        mensaje += `Participante ${index + 1}:\n`;
        mensaje += `- Nombre: ${respuesta.nombre}\n`;
        mensaje += `- Correo: ${respuesta.correo}\n`;
        mensaje += `- Teléfono: ${respuesta.telefono}\n`;
        respuesta.respuestas.forEach(resp => {
            mensaje += `  * ${resp.pregunta}: ${resp.respuesta}\n`;
        });
        mensaje += '\n';
    });

    alert(mensaje);
}

function abrirParaEditar(encuesta) {
    encuestaEditando = encuesta;
    document.getElementById('nombreEncuesta').value = encuesta.nombre;
    preguntasContainer.innerHTML = '';

    encuesta.preguntas.forEach(pregunta => {
        const preguntaDiv = document.createElement('div');
        preguntaDiv.className = 'pregunta';
        preguntaDiv.innerHTML = `
            <input type="text" value="${pregunta.texto}" required>
            <button class="borrarPregunta">-</button>
            <div class="respuestas"></div>
            <button class="agregarRespuesta">Agregar Respuesta</button>
        `;

        const respuestasDiv = preguntaDiv.querySelector('.respuestas');
        pregunta.respuestas.forEach((respuesta) => {
            agregarRespuesta(respuestasDiv);
            const inputRespuesta = respuestasDiv.lastElementChild.querySelector('input');
            inputRespuesta.value = respuesta; 
        });

        preguntaDiv.querySelector('.agregarRespuesta').addEventListener('click', () => {
            agregarRespuesta(respuestasDiv);
        });

        preguntasContainer.appendChild(preguntaDiv);
    });

    modal.style.display = 'flex';
}

function actualizarEncuesta(nuevaEncuesta) {
    let encuestasGuardadas = JSON.parse(localStorage.getItem('encuestas')) || [];
    const index = encuestasGuardadas.findIndex(e => e.nombre === encuestaEditando.nombre);

    if (index !== -1) {
        encuestasGuardadas[index] = nuevaEncuesta;
        localStorage.setItem('encuestas', JSON.stringify(encuestasGuardadas));

        const encuestaDiv = Array.from(encuestasContainer.children).find(div =>
            div.querySelector('h3').textContent === encuestaEditando.nombre
        );
        if (encuestaDiv) {
            encuestaDiv.querySelector('h3').textContent = nuevaEncuesta.nombre;
        }

        setTimeout(() => {
            location.reload();
        }, 100);
    }

    encuestaEditando = null;
}

function eliminarEncuesta(encuesta, div) {
    if (confirm(`¿Seguro que deseas eliminar la encuesta "${encuesta.nombre}"?`)) {
        let encuestasGuardadas = JSON.parse(localStorage.getItem('encuestas')) || [];
        encuestasGuardadas = encuestasGuardadas.filter(e => e.nombre !== encuesta.nombre);
        localStorage.setItem('encuestas', JSON.stringify(encuestasGuardadas));
        div.remove();
    }
}

function limpiarModal() {
    document.getElementById('nombreEncuesta').value = '';
    preguntasContainer.innerHTML = '';
}

let refresh = document.getElementById('refresh');
refresh.addEventListener('click', _ => {
            location.reload();
})
