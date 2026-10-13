const form = document.querySelector('#analysis-form');
const investmentInput = document.querySelector('#investment');
const purchasedInput = document.querySelector('#purchased');
const soldInput = document.querySelector('#sold');
const productNameInput = document.querySelector('#product-name');
const formError = document.querySelector('#form-error');
const results = document.querySelector('#results');
const emptyState = document.querySelector('#empty-state');
const resultStatus = document.querySelector('#result-status');

const amount = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});
const formatCurrency = (value) => `$${amount.format(value)}`;

purchasedInput.addEventListener('input', () => {
    soldInput.max = purchasedInput.value;
});

form.addEventListener('submit', (event) => {
    event.preventDefault();
    formError.hidden = true;

    const datos = {
        nombreProducto: productNameInput.value.trim(),
        costoInversion: Number(investmentInput.value),
        cantidadComprada: Number(purchasedInput.value),
        precioVentaUnitario: Number(document.querySelector('#price').value),
        cantidadVendidaMes: Number(soldInput.value)
    };

    if (!form.reportValidity()) {
        return;
    }

    try {
        const calculo = globalThis.CalculoRendimiento.calcularRendimiento(datos);
        const diagnostico = globalThis.ClasificacionRendimiento.clasificarRendimiento(
            calculo.retorno,
            datos.cantidadVendidaMes
        );

        mostrarResultados({ ...calculo, ...datos, diagnostico }, datos.cantidadVendidaMes);
    } catch (error) {
        formError.textContent = error.message;
        formError.hidden = false;
    }
});

function mostrarResultados(resultado, unidadesVendidas) {
    document.querySelector('#product-name-value').textContent = resultado.nombreProducto;
    document.querySelector('#revenue-value').textContent = formatCurrency(resultado.ingresosTotales);
    document.querySelector('#profit-value').textContent = formatCurrency(resultado.gananciaBruta);
    document.querySelector('#return-value').textContent = `${resultado.retorno.toFixed(2)}%`;
    document.querySelector('#performance-value').textContent = `${resultado.margen.toFixed(2)}%`;
    actualizarTacometro({
        selector: '.product-performance-gauge',
        aguja: '#gauge-needle',
        valor: '#performance-value',
        minimoLabel: '#performance-gauge-min',
        maximoLabel: '#performance-gauge-max',
        valorActual: resultado.margen,
        minimo: 0,
        maximo: 100,
        titulo: 'Rendimiento del producto'
    });

    const retornoMinimo = resultado.retorno < 0 ? Math.floor(resultado.retorno / 50) * 50 : 0;
    const retornoMaximo = Math.max(100, Math.ceil(resultado.retorno / 100) * 100);
    actualizarTacometro({
        selector: '.return-gauge',
        aguja: '#return-gauge-needle',
        valor: '#return-value',
        minimoLabel: '#return-gauge-min',
        maximoLabel: '#return-gauge-max',
        valorActual: resultado.retorno,
        minimo: retornoMinimo,
        maximo: retornoMaximo,
        titulo: 'Retorno sobre la inversión inicial'
    });

    document.querySelector('#remaining-value').textContent = resultado.unidadesRestantes;
    document.querySelector('#stock-value').textContent = formatCurrency(resultado.valorInventarioRestante);
    document.querySelector('#diagnosis-text').textContent = resultado.diagnostico;

    const diagnosisCard = document.querySelector('#diagnosis-card');
    const diagnosisIcon = document.querySelector('#diagnosis-icon');
    const diagnosisTitle = document.querySelector('#diagnosis-title');
    diagnosisCard.className = 'diagnosis-card';

    if (unidadesVendidas === 0) {
        diagnosisCard.classList.add('diagnosis-info');
        diagnosisIcon.textContent = 'i';
        diagnosisTitle.textContent = 'Aún no hay ventas';
    } else if (resultado.retorno > 0) {
        diagnosisCard.classList.add('diagnosis-positive');
        diagnosisIcon.textContent = '✓';
        diagnosisTitle.textContent = 'Producto con retorno positivo';
    } else {
        diagnosisCard.classList.add('diagnosis-warning');
        diagnosisIcon.textContent = '!';
        diagnosisTitle.textContent = resultado.retorno === 0 ? 'Punto de equilibrio' : 'Revisa este producto';
    }

    emptyState.hidden = true;
    results.hidden = false;
    resultStatus.textContent = 'Análisis listo';
    resultStatus.classList.add('status-ready');
}

function actualizarTacometro({ selector, aguja, valor, minimoLabel, maximoLabel, valorActual, minimo, maximo, titulo }) {
    const gauge = document.querySelector(selector);
    const valorLimitado = Math.min(maximo, Math.max(minimo, valorActual));
    const proporcion = (valorLimitado - minimo) / (maximo - minimo);
    const porcentajeColor = Math.min(100, Math.max(0, proporcion * 100));
    const color = `rgb(${Math.round(255 - (199 * porcentajeColor) / 100)}, ${Math.round(56 + (114 * porcentajeColor) / 100)}, ${Math.round(100 + (155 * porcentajeColor) / 100)})`;
    const angulo = proporcion * 180 - 90;

    gauge.style.setProperty('--gauge-color', color);
    gauge.setAttribute('aria-label', `${titulo}: ${valorActual.toFixed(2)}%; escala de ${minimo}% a ${maximo}%`);
    document.querySelector(valor).style.color = color;
    document.querySelector(aguja).setAttribute('transform', `rotate(${angulo} 110 110)`);
    document.querySelector(minimoLabel).textContent = `${minimo}%`;
    document.querySelector(maximoLabel).textContent = `${maximo}%`;
}
