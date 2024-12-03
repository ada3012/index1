document.addEventListener('DOMContentLoaded', cargarEncuestas);

function cargarEncuestas() {
    const encuestasGuardadas = JSON.parse(localStorage.getItem('encuestas')) || [];
    const encuestasContainer = document.querySelector('.encuestas-container');
    if (encuestasGuardadas.length === 0) {
        encuestasContainer.innerHTML = '<p>No hay encuestas disponibles.</p>';
        return;
    }
    encuestasGuardadas.forEach(encuesta => {
        const encuestaDiv = document.createElement('div');
        encuestaDiv.className = 'encuesta';
        encuestaDiv.innerHTML = `
            <h2>${encuesta.nombre}</h2>
            <button class="contestar">Contestar</button>
        `;
        encuestaDiv.querySelector('.contestar').addEventListener('click', () => {
            mostrarFormulario(encuesta);
        });
        encuestasContainer.appendChild(encuestaDiv);
    });
}

function mostrarFormulario(encuesta) {
    const formularioDiv = document.createElement('div');
    formularioDiv.className = 'formulario-encuesta';
    formularioDiv.innerHTML = `<h2>${encuesta.nombre}</h2>`;
    
    encuesta.preguntas.forEach((pregunta, i) => {
        const preguntaDiv = document.createElement('div');
        preguntaDiv.className = 'pregunta';
        preguntaDiv.innerHTML = `<h3>${pregunta.texto}</h3>`;
        
        pregunta.respuestas.forEach((respuesta, j) => {
            const opcionDiv = document.createElement('div');
            opcionDiv.className = 'opcion';
            opcionDiv.innerHTML = `
                <input type="radio" name="pregunta-${i}" id="respuesta-${i}-${j}" value="${respuesta}">
                <label for="respuesta-${i}-${j}">${respuesta}</label>
            `;
            preguntaDiv.appendChild(opcionDiv);
        });

        formularioDiv.appendChild(preguntaDiv);
    });

    formularioDiv.innerHTML += `
        <link rel="stylesheet" href="qwer.css">
        <input type="text" placeholder="Nombre" id="nombre" maxlength="50" required>
        <form id="form-email">
            <label for="user-email">Email: </label>
            <input type="email" id="user-email" name="userEmail" required>
        </form>
        <input type="tel" placeholder="Teléfono" id="telefono" maxlength="10" required>
        <button id="enviarRespuestas">
            <a href="encuestacon.html">Enviar Respuestas</a>
        </button>
    `;

    document.body.innerHTML = '';  
    document.body.appendChild(formularioDiv);

    document.getElementById('form-email').addEventListener('submit', (e) => {
        e.preventDefault();
        validateEmail();
    });

    document.getElementById('enviarRespuestas').addEventListener('click', (e) => {
        if (validateEmail()) {
            capturarRespuestas(encuesta);
        } else {
            e.preventDefault();
            alert('Por favor, corrige el correo antes de enviar.');
        }
    });

    const telefonoInput = document.getElementById('telefono');
    telefonoInput.addEventListener('input', () => {
        telefonoInput.value = telefonoInput.value.replace(/\D/g, '').slice(0, 10);
    });
}

function validateEmail() {
    const emailField = document.getElementById('user-email');
    const validEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;

    if (validEmail.test(emailField.value)) {
        return true;
    } else {
        alert('Email inválido. Corrige antes de enviar.');
        return false;
    }
}

function capturarRespuestas(encuesta) {
    const respuestasUsuario = encuesta.preguntas.map((pregunta, i) => {
        const respuestaSeleccionada = document.querySelector(`input[name="pregunta-${i}"]:checked`);
        return {
            pregunta: pregunta.texto,
            respuesta: respuestaSeleccionada ? respuestaSeleccionada.value : 'Sin respuesta',
        };
    });

    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('user-email').value;
    const telefono = document.getElementById('telefono').value;

    if (!nombre || !correo) {
        alert('Por favor, ingresa tu nombre y correo.');
        return;
    }

    const respuestaCompleta = {
        nombre,
        correo,
        telefono,
        respuestas: respuestasUsuario,
    };

    guardarRespuestas(encuesta.nombre, respuestaCompleta);
    alert('Respuestas guardadas exitosamente.');
}

function guardarRespuestas(nombreEncuesta, respuesta) {
    const respuestasGuardadas = JSON.parse(localStorage.getItem('respuestas')) || {};
    if (!respuestasGuardadas[nombreEncuesta]) {
        respuestasGuardadas[nombreEncuesta] = [];
    }
    respuestasGuardadas[nombreEncuesta].push(respuesta);
    localStorage.setItem('respuestas', JSON.stringify(respuestasGuardadas));
}
