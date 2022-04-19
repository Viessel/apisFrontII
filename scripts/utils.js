const urlAPI = 'https://ctd-todo-api.herokuapp.com/v1';
const tokenKey = 'userTokenKey';
/* ---------------------------------- texto --------------------------------- */
function validarTexto(texto) {

}

function normalizarTexto(texto) {

}

/* ---------------------------------- email --------------------------------- */
function validarEmail(email) {
    let regex = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$");
    return regex.test(email);
}

function normalizarEmail(email) {

}

/* -------------------------------- password -------------------------------- */
function validarContrasenia(contrasenia) {
    let noValid = [' ', '-'];
    let i = 0;
    let passValid = true;

    // Recorre cada elemento del array 'noValid'
    while (passValid && i <= noValid.length) {
        let character = noValid[i];
        if (contrasenia.includes(character)) {
            passValid = false;
        }
        i++;
    }

    return passValid;
}

function validarMinimoContraseña(contrasenia) {
    return contrasenia.length >= 3;
}

function compararContrasenias(contrasenia_1, contrasenia_2) {
    return contrasenia_1 === contrasenia_2;
}

function validarNombre(name) {
    let noValid = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, '-'];
    let i = 0;
    let nameValid = true;

    while (nameValid && i <= noValid.length) {
        if (name.includes(noValid[i])) {
            nameValid = false;
        }
        i++;
    }

    return nameValid;
}

function mostrarMensajeEnElemento(message) {
    let div = document.createElement('div');
    div.innerHTML = `<li>${message}</li>`;
    return div;
}

function saveToken(token){
    sessionStorage.setItem(tokenKey, token);
}

function getToken(){
    return sessionStorage.getItem(tokenKey)
}