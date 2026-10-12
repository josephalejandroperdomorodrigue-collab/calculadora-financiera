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
    const unidadesRestantes = cantidadComprada - cantidadVendidaMes;
    const valorInventarioRestante = unidadesRestantes * costoUnitario;
    const gananciaBruta = ingresosTotales - costoDeLoVendido;
    const roi = (gananciaBruta / costoInversion) * 100;
    const margen = ingresosTotales > 0 ? (gananciaBruta / ingresosTotales) * 100 : 0;

    return {
        costoUnitario,
        ingresosTotales,
        costoDeLoVendido,
        unidadesRestantes,
        valorInventarioRestante,
        gananciaBruta,
        roi,
        margen
    };
}

module.exports = { calcularRendimiento };
