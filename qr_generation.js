import QRCode from 'qrcode'
import crypto from 'crypto';
import dotenv from "dotenv";
dotenv.config();

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'base64'); // Decode Base64 key
const ENCRYPTION_IV = Buffer.from(process.env.ENCRYPTION_IV, 'base64'); // Decode Base64 IV
const ALGO = 'aes-128-cbc';

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 16 || !ENCRYPTION_IV || ENCRYPTION_IV.length !== 16) {
    throw new Error('Invalid or missing ENCRYPTION_KEY or ENCRYPTION_IV in .env file. Ensure it is a 16-byte (Base64-encoded) key/iv. To generate, run: openssl rand -base64 16');
}

/**
 * Encrypt Job ID using ALGO constant (AES-128), ENCRYPTION_KEY and ENCRYPTION_IV from .env file. 
 * @param jobId
 * @returns {string}
 */
export function encryptJobId(jobId) {
    try {
        // Create an AES cipher using the encryption key and IV
        const cipher = crypto.createCipheriv(ALGO, ENCRYPTION_KEY, ENCRYPTION_IV);

        // Encrypt the job ID
        let encrypted = cipher.update(jobId, 'utf8', 'base64');
        encrypted += cipher.final('base64');

        // Return the IV (Base64 encoded) and encrypted data combined
        return encrypted;
    } catch (err) {
        console.error('Error encrypting job ID:', err);
        throw err;
    }
}

export function generate_url(id) {
    return `https://tellmewhen.co.uk/${id}`;
}

/**
 * takes job_id, enrypts it and returns qr-code as base-64 string
 * @returns {Promise<string>}
 * @param job_id
 */
export async function generate_qr(job_id) {
    const encryptedJobId = encryptJobId(job_id);
    const url = generate_url(encryptedJobId);
    return QRCode.toDataURL(url, {
        color: {
            dark: '#00F',
            light: '#0000'
        }
    });
}


/**
 * Decrypt Job ID using ALGO constant (AES-128), ENCRYPTION_KEY and ENCRYPTION_IV from .env file.
 * @param encryptedJobId
 * @returns {string}
 */
export function decryptJobId(encryptedJobId) {
    try {
        // Create a decipher using the encryption key and IV
        const decipher = crypto.createDecipheriv(ALGO, ENCRYPTION_KEY, ENCRYPTION_IV);

        // Decrypt the data
        let decrypted = decipher.update(encryptedJobId, 'base64', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    } catch (err) {
        console.error('Error decrypting job ID:', err);
        throw err;
    }
}
