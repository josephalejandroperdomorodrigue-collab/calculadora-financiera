const readline = require('readline');

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

function calcularRendimiento({ costoInversion, cantidadComprada, precioVentaUnitario, cantidadVendidaMes }) {
    if (!Number.isFinite(costoInversion) || costoInversion <= 0) {
        throw new RangeError("El costo de inversión debe ser mayor que cero.");
    }
    if (!Number.isInteger(cantidadComprada) || cantidadComprada < 1) {
        throw new RangeError("La cantidad comprada debe ser un entero mayor que cero.");
    }
    if (!Number.isFinite(precioVentaUnitario) || precioVentaUnitario < 0) {
        throw new RangeError("El precio de venta debe ser un número igual o mayor que cero.");
    }
    if (
        !Number.isInteger(cantidadVendidaMes) ||
        cantidadVendidaMes < 0 ||
        cantidadVendidaMes > cantidadComprada
    ) {
        throw new RangeError("La cantidad vendida debe ser un entero entre cero y la cantidad comprada.");
    }

    const costoUnitario = costoInversion / cantidadComprada;
    const ingresosTotales = cantidadVendidaMes * precioVentaUnitario;
    const costoDeLoVendido = cantidadVendidaMes * costoUnitario;
    const gananciaBruta = ingresosTotales - costoDeLoVendido;
    const roi = (gananciaBruta / costoInversion) * 100;
    const margen = ingresosTotales > 0 ? (gananciaBruta / ingresosTotales) * 100 : 0;

    let diagnostico = "";
    if (cantidadVendidaMes === 0) {
        diagnostico = "ℹ️ Aún no hay ventas registradas; todavía no se puede evaluar el rendimiento del producto.";
    } else if (roi >= 50) {
        diagnostico = "🚀 ¡Excelente! Producto Estrella: está generando un retorno del 50% o más.";
    } else if (roi >= 20) {
        diagnostico = "👍 Rendimiento Moderado: va bien, deja ganancias estables, pero vigila la rotación.";
    } else if (roi > 0) {
        diagnostico = "⚠️ Alerta: el retorno es bajo. Considera revisar el precio y los costos.";
    } else if (roi === 0) {
        diagnostico = "⚖️ Punto de equilibrio: recuperaste el costo de las unidades vendidas.";
    } else {
        diagnostico = "❌ ¡Peligro! Estás perdiendo dinero o vendiendo por debajo de los costos.";
    }

    return { costoUnitario, ingresosTotales, costoDeLoVendido, gananciaBruta, roi, margen, diagnostico };
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

        const resultado = calcularRendimiento({
            costoInversion,
            cantidadComprada,
            precioVentaUnitario,
            cantidadVendidaMes
        });

        console.log("\n================ REPORTE DE RESULTADOS ================");
        console.log(`> Costo unitario por producto: $${resultado.costoUnitario.toFixed(2)}`);
        console.log(`> Ingresos totales por ventas: $${resultado.ingresosTotales.toFixed(2)}`);
        console.log(`> Costo de las unidades vendidas: $${resultado.costoDeLoVendido.toFixed(2)}`);
        console.log(`> Ganancia bruta estimada: $${resultado.gananciaBruta.toFixed(2)}`);
        console.log(`> Retorno de inversión (ROI): ${resultado.roi.toFixed(2)}%`);
        console.log(`> Margen bruto: ${resultado.margen.toFixed(2)}%`);
        console.log(`> Diagnóstico de negocio: ${resultado.diagnostico}`);
        console.log("=======================================================");
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

module.exports = { calcularRendimiento, iniciarDiagnostico };