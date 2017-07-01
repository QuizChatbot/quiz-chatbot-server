const localTunnel = require('localtunnel')


let tunnel = localTunnel(4000, (err, tunnel) => {
    if (err)
        console.log('tunnel err', err)

    const fs = require('fs');
    fs.writeFileSync('tunnel.json', JSON.stringify({ serverURL: tunnel.url }), {flag : 'w'})
    tunnel.on('close', () => { console.log('tunnel closed') })
    tunnel.on('error', (err) => { console.log('tunnel error = ', err) })
    console.log('tunnel run success')
}) 