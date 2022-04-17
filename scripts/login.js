window.addEventListener('load', function() {
    /* ---------------------- obtenemos variables globales ---------------------- */
    const form = document.querySelector('form');
    const email = document.querySelector('#inputEmail');
    const pass = document.querySelector('#inputPassword');
    const urlAPI = 'https://ctd-todo-api.herokuapp.com/v1';
    const tokenKey = 'userTokenKey';

    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        let datosUsuario = {
            email: email.value,
            password: pass.value         
        }
        realizarLogin(datosUsuario);
    });

    /* -------------------------------------------------------------------------- */
    /*                     FUNCIÓN 2: Realizar el login [POST]                    */
    /* -------------------------------------------------------------------------- */
    async function enviarDatos(datos) {
        const urlLogin = urlAPI + '/users/login';
        const json = JSON.stringify(datos)
        const settings = {
            method: 'POST',
            body: json,
            headers: {
                'Content-Type': 'application/json'
            }
        }
        return fetch(urlLogin, settings);
    };

    async function realizarLogin(datos){
        try{
            const response = await enviarDatos(datos);
            if (response.status == 400) {
                alert('Credenciales inválidas');
            } else if(response.status == 404) {
                alert('Usuario inexistente');
            } else if(response.status == 500) {
                alert('Ha ocurrido un problema. Intente más tarde');
            } else{
                const data = await response.json();
                const tokenUsuario = await data.jwt;
                console.log(data);
                // Si el registro se hizo ok, guardamos el token en 'localStorage'
                localStorage.setItem(tokenKey, tokenUsuario);
            }
        } catch (error){
            console.error(error);
        }
    }

    //Validaciones
    email.addEventListener('blur', (e) => {
        if (validarEmail(e.target.value) == false) {
            // TODO - falta quitar el mensaje cuando esta bien
            const error = mostrarMensajeEnElemento('El campo email no tiene el formato correcto.');
            e.target.parentNode.appendChild(error);
            console.log(e.target);
            e.preventDefault();
        }
    });

    pass.addEventListener('keypress', (e) => {
        validatePass(e);
    });

    pass.addEventListener('blur', (e) => {
        if (validarMinimoContraseña(pass.value) == false && compararContrasenias(pass.value) == false) {
            const error = mostrarMensajeEnElemento('La contraseñas debe tener un mínimo de 3 dígitos y deben coincidir.');
            e.target.parentNode.appendChild(error);
        }
    });

    function validatePass(e) {
        if (validarContrasenia(e.target.value) == false) {
            const error = mostrarMensajeEnElemento('La contraseña debe tener mas de 3 dígitos y no puede contener " " ni  "-".');
            e.target.parentNode.appendChild(error);
            e.preventDefault();
        }
    }

});