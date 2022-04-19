// SEGURIDAD: Si no se encuentra en localStorage info del usuario
// no lo deja acceder a la página, redirigiendo al login inmediatamente.



/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener('load', function () {

    /* ---------------- variables globales y llamado a funciones ---------------- */



    /* -------------------------------------------------------------------------- */
    /*                          FUNCIÓN 1 - Cerrar sesión                         */
    /* -------------------------------------------------------------------------- */

    // btnCerrarSesion.addEventListener('click', function() {




    // });

    /* -------------------------------------------------------------------------- */
    /*                 FUNCIÓN 2 - Obtener nombre de usuario [GET]                */
    /* -------------------------------------------------------------------------- */

    // function obtenerNombreUsuario() {




    //};


    /* -------------------------------------------------------------------------- */
    /*                 FUNCIÓN 3 - Obtener listado de tareas [GET]                */
    /* -------------------------------------------------------------------------- */

    function consultarTareas() {
        fetch(urlAPI + '/tasks', {
            method: 'GET',
            headers: {
                'authorization': getToken(),
            },
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                renderizarTareas(data);

            })




    };
    consultarTareas();


    /* -------------------------------------------------------------------------- */
    /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
    /* -------------------------------------------------------------------------- */

    document.querySelector('form').addEventListener('submit', function (event) {
        event.preventDefault();
        const nuevaTask = document.querySelector('#nuevaTarea').value;
        fetch(urlAPI + '/tasks', {
            method: 'POST',
            headers: {
                authorization: getToken(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                description: nuevaTask,
                completed: false,
            }),
        })
            .then((r) => {
                return r.json();
            })
            .then(data => {
                console.log(data);
                consultarTareas();

            });
    });


    /* -------------------------------------------------------------------------- */
    /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
    /* -------------------------------------------------------------------------- */
    function renderizarTareas(listado) {

        // obtengo listados y limpio cualquier contenido interno
        const tareasPendientes = document.querySelector('.tareas-pendientes');
        const tareasTerminadas = document.querySelector('.tareas-terminadas');
        tareasPendientes.innerHTML = "";
        tareasTerminadas.innerHTML = "";

        // buscamos el numero de finalizadas
        const numeroFinalizadas = document.querySelector('#cantidad-finalizadas');
        let contador = 0;
        numeroFinalizadas.innerText = contador;


        listado.forEach(tarea => {
            //variable intermedia para manipular la fecha
            let fecha = new Date(tarea.createdAt);

            if (tarea.completed) {
                contador++;
                //lo mandamos al listado de tareas completas
                tareasTerminadas.innerHTML += `
              <li class="tarea">
                <div class="hecha">
                  <i class="fa-regular fa-circle-check"></i>
                </div>
                <div class="descripcion">
                  <p class="nombre">${tarea.description}</p>
                  <div class="cambios-estados">
                    <button class="change incompleta" id="${tarea.id}" ><i class="fa-solid fa-rotate-left"></i></button>
                    <button class="borrar" id="${tarea.id}"><i class="fa-regular fa-trash-can"></i></button>
                  </div>
                </div>
              </li>
                            `
                botonBorrarTarea();
            } else {
                //lo mandamos al listado de tareas sin terminar
                tareasPendientes.innerHTML += `
              <li class="tarea">
                <button class="change" id="${tarea.id}"><i class="fa-regular fa-circle"></i></button>
                <div class="descripcion">
                  <p class="nombre">${tarea.description}</p>
                  <p class="timestamp">${fecha.toLocaleDateString()}</p>
                </div>
              </li>
                            `
            }
            // actualizamos el contador en la pantalla
            numeroFinalizadas.innerText = contador;
            botonesCambioEstado();
        })
    }

    /* -------------------------------------------------------------------------- */
    /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
    /* -------------------------------------------------------------------------- */
    function botonesCambioEstado() {
        const stChange = document.querySelector('.change')
        stChange.addEventListener('click', e => {
            e.preventDefault();
            const payload = {};

            //segun el tipo de boton que fue clickeado, cambiamos el estado de la tarea
            if (e.target.classList.contains('incompleta')) {
                // si está completada, la paso a pendiente
                payload.completed = false;
            } else {
                // sino, está pendiente, la paso a completada
                payload.completed = true;
            }
            fetch(urlAPI + '/tasks/' + e.target.id, {
                method: 'PUT',
                headers: {
                    'authorization': getToken(),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })
                .then(r => {
                    return r.json();
                })

                .then(data => {
                    console.log(data);
                    consultarTareas();
                })
        })




    }


    /* -------------------------------------------------------------------------- */
    /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
    /* -------------------------------------------------------------------------- */
    function botonBorrarTarea() {
        const stChange = document.querySelector('.borrar')
        stChange.addEventListener('click', e => {
            e.preventDefault();
            fetch(urlAPI + '/tasks/' + e.target.id, {
                method: 'DELETE',
                headers: {
                    'authorization': getToken(),
                },
            })
                .then(r => {
                    return r.json();
                })

                .then(data => {
                    console.log(data);
                    consultarTareas();
                })
        });
    };

});