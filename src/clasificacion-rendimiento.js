function clasificarRendimiento(retorno, cantidadVendidaMes) {
    if (cantidadVendidaMes === 0) {
        return "Aún no hay ventas registradas; todavía no se puede evaluar el rendimiento del producto";
    }
    if (retorno >= 50) {
        return "Más de un 50% de retorno. Camella bueno";
    }
    if (retorno >= 20) {
        return "El producto está raspando la olla, se puede mejorar";
    }
    if (retorno > 0) {
        return "El producto está tirando la toalla";
    }
    if (retorno === 0) {
        return "Como los perros en misa";
    }
    return "Retorno de 0%. Llevado del bulto";
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { clasificarRendimiento };
} else {
    globalThis.ClasificacionRendimiento = { clasificarRendimiento };
}
