window.addEventListener('load', function() {
    /* ---------------------- obtenemos variables globales ---------------------- */
    const form = document.querySelector('form');
    const nombre = document.querySelector('#inputNombre');
    const apellido = document.querySelector('#inputApellido');
    const email = document.querySelector('#inputEmail');
    const pass1 = document.querySelector('#inputPassword');
    const pass2 = document.querySelector('#inputPasswordRepetida');
    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        //Capturamos los datos del formulario
        let datosUsuario = {
            firstName: nombre.value,
            lastName: apellido.value,
            email: email.value,
            password: pass1.value         
        }
        // Llamamos a la API
        realizarRegister(datosUsuario);
    });

    /* -------------------------------------------------------------------------- */
    /*                    FUNCIÓN 2: Realizar el signup [POST]                    */
    /* -------------------------------------------------------------------------- */
    async function enviarDatos(datos) {
        const urlRegistro = urlAPI + '/users';
        const json = JSON.stringify(datos)
        const settings = {
            method: 'POST',
            body: json,
            headers: {
                'Content-Type': 'application/json'
            }
        }
        return fetch(urlRegistro, settings);
    };

    async function realizarRegister(datos){
        try{
            const response = await enviarDatos(datos);
            const data = await response.json();
            const tokenUsuario = await data.jwt;
            console.log(data);
            // Si el registro se hizo ok, guardamos el token en 'localStorage'
            localStorage.setItem(tokenKey, tokenUsuario);
        } catch (error){
            console.error(error);
        }
    }

    nombre.addEventListener('keypress', (e) => {
        if (validarNombre(e.key) == false) {
            const error = mostrarMensajeEnElemento('El campo nombre no se admiten números.');
            e.target.parentNode.appendChild(error);
            e.preventDefault();
        }
    });

    apellido.addEventListener('keypress', (e) => {
        if (validarNombre(e.key) == false) {
            const error = mostrarMensajeEnElemento('El campo apellido no se admiten números.');
            e.target.parentNode.appendChild(error);
            e.preventDefault();
        }
    });

    email.addEventListener('blur', (e) => {
        if (validarEmail(e.target.value) == false) {
            // TODO - falta quitar el mensaje cuando esta bien
            const error = mostrarMensajeEnElemento('El campo email no tiene el formato correcto.');
            error.classList.add('errorMail');
            const div = document.querySelector('errorMail')
            if (div === null) {
                e.target.parentNode.appendChild(error);
            }
            e.preventDefault();
        }
    });

    function validatePass(e) {
        if (validarContrasenia(e.target.value) == false) {
            const error = mostrarMensajeEnElemento('La contraseña debe tener mas de 3 dígitos y no puede contener " " ni  "-".');
            e.target.parentNode.appendChild(error);
            e.preventDefault();
        }
    }

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