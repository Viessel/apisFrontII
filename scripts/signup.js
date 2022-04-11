window.addEventListener('load', function() {
    /* ---------------------- obtenemos variables globales ---------------------- */


    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    const form = document.querySelector('form');
    form.addEventListener('submit', function(event) {
        // Capturamos los datos del formulario
        let datosUsuario = {
            firstName: document.querySelector('#inputNombre'),
            lastName: document.querySelector('#inputApellido'),
            email: document.querySelector('#inputEmail'),
            password: document.querySelector('#inputPassword')         
        }
        // Llamamos a la API en realizarRegister
        realizarRegister(datosUsuario);
        // Si el registro se hizo ok, guardamos el token en 'localStorage'
        event.preventDefault;
    });

    /* -------------------------------------------------------------------------- */
    /*                    FUNCIÓN 2: Realizar el signup [POST]                    */
    /* -------------------------------------------------------------------------- */
    function realizarRegister(settings) {
        const urlAPI = 'https://ctd-todo-api.herokuapp.com/v1';

        async function sendMessageAsync() {
            const json = JSON.stringify(settings);
            return fetch(urlAPI, {
                method: 'POST',
                body: json,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        async function testAsync() {
            const response = await sendMessageAsync();
            const data = await response.json();
            console.log(data);
        }
        
    };

    document.querySelector('#inputNombre').addEventListener('keypress', (e) => {
        if (validarNombre(e.key) == false) {
            const error = mostrarMensajeEnElemento('El campo nombre no se admiten números.');
            e.target.parentNode.appendChild(error);
            e.preventDefault();
        }
    });

    document.querySelector('#inputApellido').addEventListener('keypress', (e) => {
        if (validarNombre(e.key) == false) {
            const error = mostrarMensajeEnElemento('El campo apellido no se admiten números.');
            e.target.parentNode.appendChild(error);
            e.preventDefault();
        }
    });

    document.querySelector('#inputEmail').addEventListener('blur', (e) => {
        if (validarEmail(e.target.value) == false) {
            // TODO - falta quitar el mensaje cuando esta bien
            const error = mostrarMensajeEnElemento('El campo email no tiene el formato correcto.');
            e.target.parentNode.appendChild(error);
            e.preventDefault();
        }
    });

    function validatePass(e) {
        if (validarContrasenia(e.target.value) == false) {
            const error =
                mostrarMensajeEnElemento('La contraseña debe tener mas de 3 dígitos y no puede contener " " ni  "-".');

            e.target.parentNode.appendChild(error);
            e.preventDefault();
        }
    }

    const pass1 = document.querySelector('#inputPassword');
    const pass2 = document.querySelector('#inputPasswordRepetida');

    pass1.addEventListener('keypress', (e) => {
        validatePass(e);
    });

    pass2.addEventListener('keypress', (e) => {
        validatePass(e);
    });

    pass1.addEventListener('blur', (e) => {
        if (validarMinimoContraseña(pass1.value) == false && compararContrasenias(pass1.value, pass2.value) == false) {
            const error = mostrarMensajeEnElemento('La contraseñas debe tener un mínimo de 3 dígitos y deben coincidir.');
            e.target.parentNode.appendChild(error);
        }
    });

    pass2.addEventListener('blur', (e) => {
        if (validarMinimoContraseña(pass2.value) == false && compararContrasenias(pass1.value, pass2.value) == false) {
            const error = mostrarMensajeEnElemento('La contraseñas debe tener un mínimo de 3 dígitos y deben coincidir.');
            e.target.parentNode.appendChild(error);
        }
    });

});