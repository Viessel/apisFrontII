// SEGURIDAD: Si no se encuentra en localStorage info del usuario
// no lo deja acceder a la página, redirigiendo al login inmediatamente.
if (getToken() == null) {
    location.replace('index.html');
}

/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener('load', function() {

    /* ---------------- variables globales y llamado a funciones ---------------- */
    const formCrearTarea = document.querySelector('form');
    consultarTareas();
    obtenerNombreUsuario();
    /* -------------------------------------------------------------------------- */
    /*                          FUNCIÓN 1 - Cerrar sesión                         */
    /* -------------------------------------------------------------------------- */

    // btnCerrarSesion.addEventListener('click', function() {




    // });

    /* -------------------------------------------------------------------------- */
    /*                 FUNCIÓN 2 - Obtener nombre de usuario [GET]                */
    /* -------------------------------------------------------------------------- */
    function obtenerNombreUsuario() {
        const urlUser = urlAPI + '/users/getMe';
        const settings = {
            method: 'GET',
            headers: {
                'Authorization': getToken()
            }
        };
        fetch(urlUser, settings)
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log(data);
                const userName = document.querySelector('.user-info p');
                userName.innerText = `${data.firstName} ${data.lastName}`
            });
    };


    /* -------------------------------------------------------------------------- */
    /*                 FUNCIÓN 3 - Obtener listado de tareas [GET]                */
    /* -------------------------------------------------------------------------- */
    function consultarTareas() {
        const urlTasks = urlAPI + '/tasks';
        const settings = {
            method: 'GET',
            headers: {
                'Authorization': getToken()
            }
        };
        fetch(urlTasks, settings)
            .then(response => {
                return response.json();
            })
            .then(data => {
                renderizarTareas(data);
            });
    };
    /* -------------------------------------------------------------------------- */
    /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
    /* -------------------------------------------------------------------------- */
    formCrearTarea.addEventListener('submit', function(e) {
        e.preventDefault();

        const description = document.querySelector('#nuevaTarea').value;
        const task = {
            description: description,
            completed: false
        }

        const urlTasks = urlAPI + '/tasks';
        const settings = {
            method: 'POST',
            body: JSON.stringify(task),
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json'
            }
        };

        fetch(urlTasks, settings)
            .then(response => {
                return response.json();
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
              </li>`
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
                <button class="borrar" id="${tarea.id}"><i class="fa-regular fa-trash-can"></i></button>
              </li>`
              botonBorrarTarea();
            }
            // actualizamos el contador en la pantalla
            numeroFinalizadas.innerText = contador;
        })
    }

    /* -------------------------------------------------------------------------- */
    /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
    /* -------------------------------------------------------------------------- */
    // function botonesCambioEstado() {





    // }


    /* -------------------------------------------------------------------------- */
    /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
    /* -------------------------------------------------------------------------- */
    function botonBorrarTarea() {
        const botonBorrar = document.querySelector(".borrar");

        botonBorrar.addEventListener("click", function (e) {
          const idTarea = e.target.getAttribute("id");
          const urlTasks = urlAPI + "/tasks/" + idTarea;
          const settings = {
            method: "DELETE",
            headers: {
              'Authorization': getToken(),
            },
          };

          fetch(urlTasks, settings)
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              console.log(data);
              consultarTareas();
            });
        });
    };
});