const plotFile = () => {
    const extractParams = (param, dataArray) => {
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

    const ctx = document.querySelector('#canvas').getContext('2d');
    const inputFile = document.querySelector('#inputFile').files[0]

    const reader = new FileReader()
    reader.readAsText(inputFile)
    
    reader.addEventListener('loadend', () => {
        const inputText = reader.result
        const inputObject = JSON.parse(inputText)
        console.log('ARQUIVO LIDO COM SUCESSO')

        const result = extractParams('pt', inputObject)

        const time = result.timestamps?.map(timestamp =>
            `${
                new Date(timestamp).getHours()
             }:${
                 new Date(timestamp).getMinutes()
            }:${
                 new Date(timestamp).getSeconds()
            }`)

        const myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: time,
                datasets: [{
                    label: 'P(W)',
                    data: result.pt,
                    backgroundColor: [
                        'rgba(153, 102, 255, 0.2)',
                    ],
                    borderColor: [
                        'rgba(153, 102, 255, 1)',
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
    })
}
