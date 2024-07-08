const cantidad = document.querySelector('.cantidad')
const monedaIngresada = document.querySelector('.moneda')
const boton = document.querySelector('#convertir')
const valorConvertido = document.querySelector('.nuevo-valor')
const divGrafico = document.querySelector('#grafico')

const getTipoCambio = async(moneda) => {
    try {
        const res = await fetch(`https://mindicador.cl/api/${moneda}`)
        json = await res.json()
        return json
    } catch (error) {
        console.log(error)
        return 'error'
    }
}

const rendertipoCambio = async(moneda,cantidad) => {
    const data = await getTipoCambio(moneda)
    if (data=='error') {
        valorConvertido.innerHTML = 'Ocurrió un error'
    } else if (moneda == '') {
        valorConvertido.innerHTML = 'Selecciona una moneda'
    } else {
        valorConvertido.innerHTML = '$'+ Math.round(data.serie[0].valor * cantidad)
        renderGrafico(data.serie.splice(0,10))
    }
}

let chart
const renderGrafico = (data) => {
    console.log(data)
    const dataLabel = data.map(item => item.fecha.split('T')[0]).reverse()
    const dataValues = data.map(item => item.valor).reverse()
    if (chart) {
        chart.destroy();
    }
    chart = new Chart(divGrafico, {
        type: 'line',
        data: {
          labels: dataLabel,
          datasets: [{
            label: 'Valor últimos 10 días',
            data: dataValues,
            borderWidth: 2
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: false
            }
          }
        }
      })
} 

boton.addEventListener('submit',(e)=>{
    e.preventDefault()
    console.log(cantidad.value)
    rendertipoCambio(monedaIngresada.value,cantidad.value)
})