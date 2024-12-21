import QRCode from 'qrcode'

async function generate_qr_data_url (url, job_id){
   return await QRCode.toDataURL(`${url}`, {
        color: {
            dark: '#00F',  // Blue dots
            light: '#0000' // Transparent background
        }
    })
}

export default generate_qr_data_url;