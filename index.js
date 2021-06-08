const extractParam = (param, dataArray) => {
    const extractedParams = dataArray.map(data =>
        data[param]
    )

    const extractedTimestamps = dataArray.map(data =>
        data['timestamp']
    )

    let result = {}
    result[param] = extractedParams
    result['timestamps'] = extractedTimestamps

    return result
}

const plotFile = data => {
    const ctx = document.querySelector('#canvas').getContext('2d')
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.time,
            datasets: [{
                label: 'P(W)',
                data: data.pt,
                backgroundColor: [
                    'var(--primary-color)',
                ],
                borderColor: [
                    'var(--primary-color)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            aspectRatio: 1.8,
            maintainAspectRatio: true,
            reponse: true
        }
    })
}

const handleFile = () => {
    try {
        const inputFile = document.querySelector('#inputFile').files[0]
        const fileName = inputFile.name.split('.')[0]

        const reader = new FileReader()
        reader.readAsText(inputFile)

        reader.addEventListener('loadend', () => {
            try {
                const inputObject = processString({
                    fileName,
                    dataString: reader.result
                })

                const data = extractParam('pt', inputObject)

                const time = data?.timestamps?.map(timestamp =>
                    `${
                        new Date(timestamp).getHours()
                    }:${
                        new Date(timestamp).getMinutes()
                    }:${
                        new Date(timestamp).getSeconds()
                    }`
                )

                data.time = time

                plotFile(data)
                const totalEnergy = document.querySelector('.totalEnergy')
                totalEnergy.innerHTML = `Total de Energia: ${getEnergy(data)} KWh`
                totalEnergy.style.opacity = 1
                document.querySelector('.inputContainer').style.display = 'none'
                document.querySelector('#reset').style.display = 'block'
            } catch (err) {
                console.log(`Erro: ${err.message}`)
            }
        })
    } catch (err) {
        console.log(`Erro: ${err.message}`)
    }
}

const reset = () => {
    window.location.reload(false)
}