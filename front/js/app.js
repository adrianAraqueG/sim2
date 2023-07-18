/**
 * START
 */
import DB from './clases.js';
let departamentos = [];
let ciudades = [];
let editando = false;
console.log('start');

document.addEventListener('DOMContentLoaded', async () => {
    await ActualizarDB();
    actualizarDepartamentos();
    imprimirDepartamentos();
    imprimirCiudades();

});

/**
 * MAIN
 */
const formCiudad = document.querySelector('#form-ciudad');
formCiudad.addEventListener('submit', e=>{
    e.preventDefault();
    addCiudad();
});
const formDep = document.querySelector('#form-dep');
formDep.addEventListener('submit', e=>{
    e.preventDefault();
    addDepartamento();
});


const btnCMCiudad = document.querySelector('#cerrar-modal-ciudad');
btnCMCiudad.addEventListener('click', ()=>{
    if(editando != false){
        // Revierto los cambios en los titulos
        document.querySelector('#modal-ciudad-title').textContent = 'Crear Ciudad'
        document.querySelector('#form-button-ciudad').textContent = 'Crear';

        editando = false;
    }

    formCiudad.reset();
});
const btnCMDep = document.querySelector('#cerrar-modal-dep');
btnCMDep.addEventListener('click', ()=>{
    if(editando != false){
        // Revierto los cambios en los titulos
        document.querySelector('#modal-dep-title').textContent = 'Crear Departamento'
        document.querySelector('#form-button-dep').textContent = 'Crear';

        editando = false;
    }

    formDep.reset();
});


async function addCiudad(){
    const depId = document.querySelector('#departamentos').value;
    const nombreCiudad = document.querySelector('#nombreCiudad').value;
    const imagenUrl = document.querySelector('#imagenUrl').value;
    const lat = document.querySelector('#lat').value;
    const lon = document.querySelector('#lon').value;

    let promises = [];

    let nuevaCiudad = {
        departamentoId: parseInt(depId),
        nomCiudad: nombreCiudad,
        imagen: imagenUrl,
        coordenadas: {lat: parseInt(lat), lon: parseInt(lon)}
    }

    if (editando) {
        console.log(editando);
        promises.push(DB.update('Ciudades', nuevaCiudad, editando));
        promises.push(ActualizarDB());
    } else {
        promises.push(DB.create('Ciudades', nuevaCiudad));
        promises.push(ActualizarDB());
    }

    await Promise.all(promises);

    alert(editando === false ? '¡Ciudad agregada con éxito!': '¡Cambios guardados con éxito!');
    btnCMCiudad.click();

    editando =  false;

    imprimirCiudades();
    imprimirDepartamentos();
}

async function addDepartamento(){
    const depNombre = document.querySelector('#nombreDep').value;

    let promises = [];

    if (editando) {
        console.log(editando);
        promises.push(DB.update('Departamentos', {nomDepartamento: depNombre}, editando));
        promises.push(ActualizarDB());
    } else {
        promises.push(DB.create('Departamentos', {nomDepartamento: depNombre}));
        promises.push(ActualizarDB());
    }

    await Promise.all(promises);

    alert(editando === false ? 'Departamento agregado con éxito!': '¡Cambios guardados con éxito!');
    btnCMDep.click();

    editando =  false;

    imprimirCiudades();
    imprimirDepartamentos();
    actualizarDepartamentos();
}


/**
 * FUNCIONES
 */
function cargarCiudad(id){
    editando = id;

    document.querySelector('#modal-ciudad-title').textContent = 'Editando Ciudad'
    document.querySelector('#form-button-ciudad').textContent = 'Guardar Cambios';

    actualizarDepartamentos();

    ciudades.forEach(ci => {
        if (ci.id === id) {
            document.querySelector('#departamentos').value = ci.departamentoId,
            nombreCiudad.value = ci.nomCiudad;
            imagenUrl.value = ci.imagen;
            lat.value = ci.coordenadas.lat;
            lon.value = ci.coordenadas.lon;
        }
    });

}
window.cargarCiudad = cargarCiudad;

async function eliminarCiudad(id){
    await DB.delete('Ciudades', id);
    await ActualizarDB();
    imprimirCiudades();
    imprimirDepartamentos();
    alert('Eliminado Correctamente');

}
window.eliminarCiudad = eliminarCiudad;

function cargarDep(id){
    editando = id;

    document.querySelector('#modal-dep-title').textContent = 'Editando Departamento'
    document.querySelector('#form-button-dep').textContent = 'Guardar Cambios';

    // Listar ciudades del departamento
    const listaCiudades = document.querySelector('#lista-ciudades');
    listaCiudades.innerHTML = '';

    ciudades.forEach(ci =>{
        if(ci.departamentoId === id){
            listaCiudades.innerHTML += `
            <tr>
                <td>${ci.id}</td>
                <td>${ci.nomCiudad}</td>
            </tr>
            `;
        }
    });

    departamentos.forEach(dep => {
        if (dep.id === id) {
            nombreDep.value = dep.nomDepartamento;
        }
    });
}
window.cargarDep = cargarDep;

async function eliminarDep(id){

    const promises = [];
    //Eliminar ciudades del departamento
    ciudades.forEach(ci =>{
        if(ci.departamentoId === id){
            promises.push(DB.delete('Ciudades', ci.id));
        }
    });

    //Eliminar departamento
    promises.push(DB.delete('Departamentos', id));
    promises.push(ActualizarDB());

    Promise.all(promises);
    
    imprimirCiudades();
    imprimirDepartamentos();
    actualizarDepartamentos();
    alert('Eliminado Correctamente');
}
window.eliminarDep = eliminarDep;

function imprimirDepartamentos(){
    const divDepartamentos = document.querySelector('#show-dep');

    divDepartamentos.innerHTML = '';

    departamentos.forEach(dep =>{

        divDepartamentos.innerHTML += `
        <div class="col">
            <div class="d-flex justify-content-between bgc-lapiz text-light p-3 rounded">
                <h6 class="fs-3">${dep.nomDepartamento}<br><span class="--tiny-text text-light">Ciudades: ${ciudades.filter(ci => ci.departamentoId === dep.id).length}</span></h6>
                <div class="align-self-end me-2">
                    <a href="#" onclick="cargarDep(${dep.id})" data-bs-toggle="modal" data-bs-target="#abrir-modal-dep"><i
                            class="bi bi-pencil-square fs-4 text-light me-1"></i></a>
                    <a href="#" onclick="eliminarDep(${dep.id})"><i class="bi bi-trash-fill fs-4 text-light"></i></a>
                </div>
            </div>
        </div>
        `;
    });

    // Botón añadir
    divDepartamentos.innerHTML += `
    <div class="col d-flex justify-content-center align-items-center">
        <a class="m-auto d-flex justify-content-center align-items-center" href="" data-bs-toggle="modal"
            data-bs-target="#abrir-modal-dep">
            <div class="add-dep">
                <i class="bi bi-plus-circle-fill"></i>
            </div>
        </a>
    </div>
    `;

}

async function imprimirCiudades(){
    const divCiudades = document.querySelector('#show-ciudades');

    console.log('Imprimiendo');

    divCiudades.innerHTML = '';

    ciudades.forEach(ci =>{
        DB.getWeather(ci.nomCiudad)
        .then(res => {
            if(res.cod == 404){
                divCiudades.innerHTML += `
                <div class="col">
                    <div class="card m-auto mb-3 shadow" style="width: 18rem;">
                        <div class="--c-header" style="background-image: url('${ci.imagen}');">
                            
                        </div>
                        <hr class="m-0">
                        <div class="card-body">
                            <div class="d-flex flex-wrap justify-content-between p-0 m-0">
                                <div class="">
                                    <h5 class="fs-5 mb-0">${ci.nomCiudad},</h5>
                                    <p class="fs-6 mb-3">${departamentos.filter(dep => ci.departamentoId === dep.id)[0].nomDepartamento}</p>
                                </div>
                                <img src="./assets/img/Clear.png" alt="" width="50px" height="50px"><span class="--tiny-text">20° C</span>
                            </div>
                            <div class="align-self-end me-2">
                                <a href="#" onclick="cargarCiudad(${ci.id})" data-bs-toggle="modal" data-bs-target="#abrir-modal-ciudad">
                                    <i class="bi bi-building-fill-gear fs-4 text-secondary me-1"></i>
                                </a>
                                <a href="#" onclick="eliminarCiudad(${ci.id})" ><i class="bi bi-building-fill-dash fs-4 text-danger"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
                `;
            }else{
                divCiudades.innerHTML += `
                <div class="col">
                    <div class="card m-auto mb-3 shadow" style="width: 18rem;">
                        <div class="--c-header" style="background-image: url('${ci.imagen}');">
                            
                        </div>
                        <hr class="m-0">
                        <div class="card-body">
                            <div class="d-flex flex-wrap justify-content-between p-0 m-0">
                                <div class="">
                                    <h5 class="fs-5 mb-0">${ci.nomCiudad},</h5>
                                    <p class="fs-6 mb-3">${departamentos.filter(dep => ci.departamentoId === dep.id)[0].nomDepartamento}</p>
                                </div>
                                <img src="./assets/img/${res.weather[0].main}.png" alt="" width="50px" height="50px"><span class="--tiny-text">${res.main.temp}° C</span>
                            </div>
                            <div class="align-self-end me-2">
                                <a href="#" onclick="cargarCiudad(${ci.id})" data-bs-toggle="modal" data-bs-target="#abrir-modal-ciudad">
                                    <i class="bi bi-building-fill-gear fs-4 text-secondary me-1"></i>
                                </a>
                                <a href="#" onclick="eliminarCiudad(${ci.id})" ><i class="bi bi-building-fill-dash fs-4 text-danger"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
                `;
            }
            
            });
    });

    divCiudades.innerHTML = `
    <div class="col d-flex justify-content-center align-items-center">
        <a class="m-auto d-flex justify-content-center align-items-center" href="" data-bs-toggle="modal"
            data-bs-target="#abrir-modal-ciudad">
            <div class="add-city">
                <i class="bi bi-building-fill-add"></i>
            </div>
        </a>
    </div>
    `;

        

}

function actualizarDepartamentos(){
    const departamentoOption = document.querySelector('#departamentos');
    departamentoOption.innerHTML = `<option value="" selected disabled>Seleccione un departamento</option>`;
    departamentos.forEach(dep =>{
        departamentoOption.innerHTML += `
            <option value="${dep.id}">${dep.nomDepartamento}</option>
        `
    });
}

async function ActualizarDB() {
    departamentos = await DB.get("departamentos");
    ciudades = await DB.get("ciudades");

    DB.LS.getItem('departamentos') ? '' : DB.LS.setItem('departamentos', JSON.stringify(departamentos));
    DB.LS.getItem('ciudades') ? '' : DB.LS.setItem('ciudades', JSON.stringify(ciudades));
}


export {
    cargarCiudad
}