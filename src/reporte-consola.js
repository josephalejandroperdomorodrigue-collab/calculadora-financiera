function mostrarReporte(resultado) {
    console.log("\n================ REPORTE DE RESULTADOS ================");
    console.log(`> Costo unitario por producto: $${resultado.costoUnitario.toFixed(2)}`);
    console.log(`> Ingresos totales por ventas: $${resultado.ingresosTotales.toFixed(2)}`);
    console.log(`> Costo de las unidades vendidas: $${resultado.costoDeLoVendido.toFixed(2)}`);
    console.log(`> Unidades restantes en inventario: ${resultado.unidadesRestantes}`);
    console.log(`> Valor del inventario restante al costo: $${resultado.valorInventarioRestante.toFixed(2)}`);
    console.log(`> Ganancia bruta estimada: $${resultado.gananciaBruta.toFixed(2)}`);
    console.log(`> Retorno de inversión (ROI): ${resultado.roi.toFixed(2)}%`);
    console.log(`> Margen bruto: ${resultado.margen.toFixed(2)}%`);
    console.log(`> Diagnóstico de negocio: ${resultado.diagnostico}`);
    console.log("=======================================================");
}

module.exports = { mostrarReporte };
