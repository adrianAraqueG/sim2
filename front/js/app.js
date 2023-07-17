/**
 * START
 */
import DB from './clases.js';
let departamentos = [];
let ciudades = [];
let inmuebles = [];
console.log('start');

document.addEventListener('DOMContentLoaded', async() => {
    await ActualizarDB();

});

/**
 * MAIN
 */
const form = document.querySelector('#form');
form.addEventListener('submit', e => {
    e.preventDefault();

    anadirInmueble();
});
const nCiudad = document.querySelector('#nuevaCiudad');
const nDep = document.querySelector('#nuevoDepartamento');
nDep.addEventListener('click', () => { // Pequeña validación para los checkbox
    if (nDep.checked === true) {
        nCiudad.checked = true;
        nCiudad.setAttribute('disabled', 'disabled');
    } else if (nDep.checked === false && nCiudad.getAttribute('disabled')) {
        nCiudad.removeAttribute('disabled');
        nCiudad.checked = false;
    }
})


const btnCloseModal = document.querySelector('#cerrar-modal');
btnCloseModal.addEventListener('click', () => {
    form.reset();
});


/**
 * FUNCTIONS
 */
async function anadirInmueble() {
    const precio = document.querySelector('#precio').value;
    const habitaciones = document.querySelector('#habitaciones').value;
    const banos = document.querySelector('#banos').value;
    const metros = document.querySelector('#metros').value;
    const direccion = document.querySelector('#direccion').value;
    const ciudad = document.querySelector('#ciudad').value;
    const departamento = document.querySelector('#departamento').value;

    const promises = [];

    // Validación
    if (nCiudad.value) {
        // Buscar Departamento
        let dId = false;
        departamentos.forEach(async dep =>{
            if(departamento == dep.nombre){
                dId = dep.id
                // Crear Ciudad
                promises.push(DB.create('ciudades', { nombre: ciudad, departamentoID: dId }));
                // Actualizar DB
                promises.push(ActualizarDB()); 
            }else{
                // Manejo de errores
                alert('NO DEPARTAMENTO');
            }
        });
        
    }
    else if (nDep.value) {
        // Crear departamento
        let isDep = false; 
        departamento.forEach(dep =>{
            if(departamento === dep.nombre){
                isDep = true;
                alert("DEP YA EXISTE");
                return;
            }
        })

        if(!isDep){
            promises.push(DB.create('departamentos', {nombre: departamento}));
            promises.push(ActualizarDB());
        }

        // Buscar Departamento
        let dId = false;
        departamentos.forEach(async dep =>{
            if(departamento == dep.nombre){
                dId = dep.id
                // Crear Ciudad
                promises.push(DB.create('ciudades', { nombre: ciudad, departamentoID: dId }));
                // Actualizar DB
                promises.push(ActualizarDB()); 
            }else{
                // Manejo de errores
                console.log('NO DEPARTAMENTO');
            }
        });

    }

    // Esperar a que las acciones anteriores terminen
    await Promise.all(promises);

    console.log(ciudades)
    const nuevoInmueble = {
        precio,
        habitaciones,
        banos,
        metros,
        direccion,
        ciudad,
        departamento
    }

    // Guardar en DB
    if((ciudades.filter(ci => ci === ciudad)).length !== 0){
        await DB.create(nuevoInmueble);
    }else{
        alert('LA CIUDAD NO EXISTE');
    }
    
}

function eliminarJuego(id) {
    juegos = juegos.filter(juego => juego.id !== id);
    LS.setItem('juegos', JSON.stringify(juegos)); //Actualizar LS
    imprimirTabla(juegos);
}



function imprimirTabla(datos) {
    const table = document.querySelector('#contenido-tabla');
    table.innerHTML = '';

    datos.forEach(juego => {
        table.innerHTML += `
        <tr>
            <td>${juego.id}</td>
            <td>${juego.nombre}</td>
            <td>${juego.categoria}</td>
            <td>${juego.valorLicencia} USD</td>
            <td>${juego.puntos}</td>
            <td>
                <div class="d-flex align-items-center">
                    <button class="btn btn-danger" onclick="eliminarJuego(${juego.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
        `
    });
}

async function ActualizarDB() {
    departamentos = await DB.get("departamentos");
    ciudades = await DB.get("ciudades");
    inmuebles = await DB.get("inmuebles");

    DB.LS.getItem('departamentos') ? '' : DB.LS.setItem('departamentos', JSON.stringify(departamentos));
    DB.LS.getItem('ciudades') ? '' : DB.LS.setItem('ciudades', JSON.stringify(ciudades));
    DB.LS.getItem('inmuebles') ? '' : DB.LS.setItem('inmuebles', JSON.stringify(inmuebles));
}