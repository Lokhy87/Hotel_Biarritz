// Temporadas
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


// Parsear fecha DD/MM/YYYY a Date
function parseFechas(fechaStr) {
    let partes = fechaStr.split('/');
    return new Date(partes[2], partes[1]-1, partes[0]);
}

// Detectar fechas
function detectarFechas(mensaje) {
    let re = /del\s+(\d{1,2})\s*(?:al|-)\s*(\d{1,2})\s*(?:de\s+)?(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i;
    let m = mensaje.match(re);
    let meses = {enero:"01", febrero:"02", marzo:"03", abril:"04", mayo:"05", junio:"06", julio:"07", agosto:"08", septiembre:"09", octubre:"10", noviembre:"11", diciembre:"12"};
    let fecha_entrada = '', fecha_salida = '';
    if (m) {
        let año_actual = new Date().getFullYear();
        let mes_num = parseInt(meses[m[3].toLowerCase()]);
        
        // Si el mes ya pasó este año, asumimos que es del año siguiente
        let año = (mes_num < (new Date().getMonth()+1)) ? año_actual+1 : año_actual;

        fecha_entrada = `${m[1].padStart(2,'0')}/${String(mes_num).padStart(2,'0')}/${año}`;
        fecha_salida = `${m[2].padStart(2,'0')}/${String(mes_num).padStart(2,'0')}/${año}`;
    }
    return {fecha_entrada, fecha_salida};
}

// Detectar régimen
function detectarRegimen(mensaje) {
    let texto = mensaje.toUpperCase();
    if (texto.includes('SA') || texto.includes('SOLO ALOJAMIENTO')) return 'SA';
    if (texto.includes('AD') || texto.includes('ALOJAMIENTO Y DESAYUNO')) return 'AD';
    if (texto.includes('PC') || texto.includes('PENSION COMPLETA')) return 'PC';
    if (texto.includes('MP') || texto.includes('MEDIA PENSION')) return 'MP';
    return '';
}

// Obtener tarifa diaria
function obtenerTarifa(fecha, regimen) {
    if (!regimen) return 0; // evita quedarse en 0 si no detecta el régimen
    let date = parseFechas(fecha);
    for (let temp of temporadas) {
        let inicio = parseFechas(temp.inicio);
        let fin = parseFechas(temp.fin);
        if (date >= inicio && date <= fin) return temp[regimen] || 0;
    }
    return 0;
}

// Calcular precio total
function calcularPrecioTotal(fecha_entrada, fecha_salida, regimen) {
    let entrada = parseFechas(fecha_entrada);
    let salida = parseFechas(fecha_salida);
    let total = 0;
    for (let d = new Date(entrada); d < salida; d.setDate(d.getDate() + 1)) {
        let fechaStr = `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
        let tarifa = obtenerTarifa(fechaStr, regimen);
        console.log(fechaStr, regimen, tarifa);
        total += tarifa;
    }
    return total;
}

// Función principal
function procesarMensaje() {
    let mensaje_entrada = document.getElementById('mensajeEntrada').value;
    if (!mensaje_entrada) {
        document.getElementById('resultado').textContent = 'Introduce un mensaje primero';
        return;
    }

    let textoResultado = '';

    // Detectar personas
    let detect_personas = mensaje_entrada.match(/\d+/);
    let num_personas = detect_personas ? parseInt(detect_personas[0]) : 0;
    textoResultado += `Número de personas: ${num_personas}\n`;

    // Detectar fechas y régimen
    let { fecha_entrada, fecha_salida } = detectarFechas(mensaje_entrada);
    let regimen = detectarRegimen(mensaje_entrada);

    textoResultado += `Fecha entrada: ${fecha_entrada}\nFecha salida: ${fecha_salida}\n`;
    textoResultado += `Régimen: ${regimen}\n`;

    // Calcular precio
    let precio_persona = calcularPrecioTotal(fecha_entrada, fecha_salida, regimen);
    textoResultado += `Precio por persona: ${precio_persona.toFixed(2)}\n`;
    textoResultado += `Precio total grupo: ${(precio_persona*num_personas).toFixed(2)}\n`;

    document.getElementById('resultado').textContent = textoResultado;
}

// Asociar botón al evento click
document.getElementById('botonCalcular').addEventListener('click', procesarMensaje);
