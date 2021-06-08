const getFrames = (stringArray, params) => {
    let dataObjectArray = []

    stringArray.forEach(dataString => {
        if (dataString.length) {
            let dataObject = {}
            const values = dataString.split(':')

            for (let i = 0; i < params.length; i++) {
                dataObject[params[i]] = values[i]
            }

            dataObjectArray.push(dataObject)
        }
    })

    return dataObjectArray
}

const insertTimestamp = (frames, dateString) =>
    frames.map(frame => {
        const { Hora, Minuto, Segundo } = frame
        const splitDate = dateString.split('')
        const date = new Date()
        date.setHours(Hora)
        date.setMinutes(Minuto)
        date.setSeconds(Segundo)
        date.setDate(`${splitDate[0]}${splitDate[1]}`)
        date.setMonth(`${splitDate[2]}${splitDate[3]}`)
        date.setMonth(date.getMonth() - 1)
        date.setFullYear(
            `${
                splitDate[4]
            }${
                splitDate[5]
            }${
                splitDate[6]
            }${
                splitDate[7]
            }`
        )
        
        const timestamp = date.toISOString()

        delete frame.Hora
        delete frame.Minuto
        delete frame.Segundo

        frame.timestamp = timestamp
        return frame
    })

const processString = ({ fileName, dataString, pattern }) => {
    try {
        if (!pattern) {
            pattern = 'Hora:Minuto:Segundo:pa:pb:pc:pt:qa:qb:qc:qt:sa:sb:sc:st:uarms:ubrms:ucrms:iarms:ibrms:icrms:itrms:pfa:pfb:pfc:pft:pga:pgb:pgc:freq:epa:epb:epc:ept:eqa:eqb:eqc:eqt:yuaub:yuauc:yubuc:tpsd'
        }

        const dataArray = dataString.split('\r\n')
        const frames = getFrames(dataArray, pattern.split(':'))

        if (fileName) {
            const date = fileName.split('.')[0]
            return insertTimestamp(frames, date)
        } else {
            return frames
        }
    } catch (err) {
        console.log(`Erro: ${err.message}`)
    }
}

const getEnergy = data => {
    let sum = 0

    for (let i = 0; i < data.pt.length; i++) {
        const t0 = new Date(data.timestamps[i]).getTime()
        const t = new Date(data.timestamps[i + 1]).getTime()

        const passedTimeInHours = Math.abs(t - t0)/1000 * 1/3600
        const prod = Number(data.pt[i]) * passedTimeInHours

        if (!isNaN(prod)) {
            sum = prod + sum
        }
    }

    return (sum/1000).toFixed(3).replace('.',',')
}