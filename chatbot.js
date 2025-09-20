// CHATBOT HOTEL 

// Variables 
let mensaje_entrada = 'Somos 20 personas del 15/03/2026 al 19/03/2026, seria para alojarse en media pension';

let detect_personas = mensaje_entrada.match(/\d+/);
let num_personas;
let fecha_entrada;
let fecha_salida;
let detect_fechas = mensaje_entrada.match(/\d{1,2}\/\d{1,2}\/\d{4}/g);
let detect_dias = mensaje_entrada.match(/\d{1,2}/g);

// let detect_mes = mensaje_entrada.match(/enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre/i);
let re = /del\s+(\d{1,2})\s*(?:al|-)\s*(\d{1,2})\s*(?:de\s+)?(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i;
let m = mensaje_entrada.match(re);

let meses = {enero: "01", febrero: "02", marzo: "03", abril: "04", mayo: "05", junio: "06", julio: "07", agosto: "08", septiembre: "09", octubre: "10", noviembre: "11", diciembre: "12"};
let regimen = '';
let texto = mensaje_entrada.toUpperCase();
let temporadas = [
{
    inicio: '01/10/2025',
    fin: '15/10/2025',
    MP: 34.30, 
    PC: 39.30
},
{
    inicio: '01/03/2026',
    fin: '14/03/2026',
    MP: 34.30, 
    PC: 39.30
},
{ // Fallas
    inicio: '15/03/2026',
    fin: '19/03/2026',
    MP: 46.10, 
    PC: 51.10
},
{
    inicio: '20/03/2026',
    fin: '30/04/2026',
    MP: 34.30, 
    PC: 39.30
},
{
    inicio: '01/05/2026',
    fin: '31/05/2026',
    MP: 34.90, 
    PC: 39.90
},
{
    inicio: '01/06/2026',
    fin: '14/06/2026',
    MP: 41.20, 
    PC: 46.20
},
{
    inicio: '15/06/2026',
    fin: '30/06/2026',
    MP: 46.10, 
    PC: 51.10
},
{
    inicio: '13/09/2026',
    fin: '19/09/2026',
    MP: 36.60, 
    PC: 41.60
}
];

// Deteccion Nº personas
if (detect_personas) {
    num_personas = parseInt(detect_personas[0]);
    console.log('He detectado:', num_personas, 'personas');
} else {
    console.log('No he detectado numero de personas');
}

// Deteccion Fechas 
if (detect_fechas && detect_fechas.length >= 2) {
    fecha_entrada = detect_fechas[0];
    fecha_salida = detect_fechas[1];
    console.log('Entrada:', fecha_entrada, 'Salida:', fecha_salida);
} else {
    if (m) {
        let dia_inicio = m[1].padStart(2, '0');
        let dia_fin = m[2].padStart(2, '0');
        let mes_num = meses[m[3].toLocaleLowerCase()];
        let año = new Date().getFullYear();

        fecha_entrada = `${dia_inicio}/${mes_num}/${año}`;
        fecha_salida = `${dia_fin}/${mes_num}/${año}`;
        
        console.log("Entrada:", fecha_entrada, "Salida:", fecha_salida);
    } else {
        console.log("No ha detectado fechas.")
    }
}

// Deteccion Regimen 
if (texto.includes('SA') || texto.includes('SOLO ALOJAMIENTO')) {
    regimen = 'SA';
} else if (texto.includes('AD') || texto.includes('ALOJAMIENTO Y DESAYUNO')) {
    regimen = 'AD';
} else if (texto.includes('PC') || texto.includes('PENSION COMPLETA')) {
    regimen = 'PC';
} else if (texto.includes('MP') || texto.includes('MEDIA PENSION')) {
    regimen = 'MP';
} else {
    console.log('No se ha detectado ningun regimen especifico.')
}
console.log('Regimen detectado:', regimen); 

// Calcular Precios 

let entradaDate = parseFechas(fecha_entrada);
let salidaDate = parseFechas(fecha_salida);

let noches = (salidaDate - entradaDate) / (1000 * 60 * 60 * 24)
console.log('Noches detectadas', noches);

// Convertir fechas a DATE
function parseFechas(fechaStr) {
    let partes = fechaStr.split('/');
    return new Date(partes[2], partes[1]-1, partes[0]);
}

// Obtener tarifa
function obtenerTarifa(fecha, regimen) {
    let date = parseFechas(fecha);
    for (let temp of temporadas) {
        let inicio = parseFechas(temp.inicio);
        let fin = parseFechas(temp.fin);
        if (date >= inicio && date <= fin) {
            return temp[regimen];
        }
    }
    return null;
}

// Calculo de precios 
function calcularPrecioTotal(fecha_entrada, fecha_salida, regimen) {
    let entrada = parseFechas(fecha_entrada);
    let salida = parseFechas(fecha_salida);
    let total = 0;

    for (let d = new Date(entrada); d < salida; d.setDate(d.getDate() + 1)) {
        let fechaStr = `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
        let tarifa = obtenerTarifa(fechaStr, regimen);
        if (tarifa === null) {
            console.log("No hay tarifa para el día", fechaStr);
        } else {
            total += tarifa;
        }
    }
    return total;
}

let precio_persona = calcularPrecioTotal(fecha_entrada, fecha_salida, regimen);
console.log('Precio por persona:', precio_persona.toFixed(2));




