const readline = require('readline');
const { calcularRendimiento } = require('./calculo-rendimiento');
const { clasificarRendimiento } = require('./clasificacion-rendimiento');
const { mostrarReporte } = require('./reporte-consola');

async function preguntarNumero(rl, pregunta, { entero = false, minimo = 0, maximo = Infinity } = {}) {
    while (true) {
        const respuesta = await new Promise((resolve) => rl.question(pregunta, resolve));
        const valor = Number(respuesta.trim());

        if (
            respuesta.trim() !== "" &&
            Number.isFinite(valor) &&
            (!entero || Number.isInteger(valor)) &&
            valor >= minimo &&
            valor <= maximo
        ) {
            return valor;
        }

        const tipo = entero ? "un número entero" : "un número";
        const rango = maximo === Infinity
            ? `igual o mayor que ${minimo}`
            : `entre ${minimo} y ${maximo}`;
        console.log(`Entrada inválida. Escribe ${tipo} ${rango}.`);
    }
}

async function iniciarDiagnostico() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    try {
        console.log("=== 📊 BIENVENIDO A PROFITRADAR - DIAGNÓSTICO DE PRODUCTO ===");

        const costoInversion = await preguntarNumero(
            rl,
            "¿Cuánto fue el costo total de la inversión del lote o producto? ($): ",
            { minimo: Number.EPSILON }
        );
        const cantidadComprada = await preguntarNumero(
            rl,
            "¿Cuál fue la cantidad total comprada de unidades?: ",
            { entero: true, minimo: 1 }
        );
        const precioVentaUnitario = await preguntarNumero(
            rl,
            "¿A qué precio se vende cada unidad? ($): "
        );
        const cantidadVendidaMes = await preguntarNumero(
            rl,
            "¿Cuántas unidades se vendieron realmente en el mes?: ",
            { entero: true, maximo: cantidadComprada }
        );

        const calculo = calcularRendimiento({
            costoInversion,
            cantidadComprada,
            precioVentaUnitario,
            cantidadVendidaMes
        });

        const resultado = {
            ...calculo,
            diagnostico: clasificarRendimiento(calculo.roi, cantidadVendidaMes)
        };
        mostrarReporte(resultado);
    } finally {
        rl.close();
    }
}

if (require.main === module) {
    iniciarDiagnostico().catch((error) => {
        console.error("No se pudo completar el diagnóstico:", error);
        process.exitCode = 1;
    });
}

module.exports = { iniciarDiagnostico };
