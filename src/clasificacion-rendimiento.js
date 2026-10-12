function clasificarRendimiento(roi, cantidadVendidaMes) {
    if (cantidadVendidaMes === 0) {
        return "ℹ️ Aún no hay ventas registradas; todavía no se puede evaluar el rendimiento del producto.";
    }
    if (roi >= 50) {
        return "Más de un 50% de retorno. Camella bueno";
    }
    if (roi >= 20) {
        return "👍 Rendimiento Moderado: va bien, deja ganancias estables, pero vigila la rotación.";
    }
    if (roi > 0) {
        return "El retorno es bajo. Considera revisar el precio y los costos.";
    }
    if (roi === 0) {
        return "⚖️ Punto de equilibrio: recuperaste el costo de las unidades vendidas.";
    }
    return "Retorno de 0% Como los perros en misa";
}

module.exports = { clasificarRendimiento };
