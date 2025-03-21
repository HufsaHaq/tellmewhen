import QRCode from 'qrcode';
import crypto from 'crypto';
import { Buffer } from 'buffer';

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'base64'); // Decode Base64 key
const ENCRYPTION_IV = Buffer.from(process.env.ENCRYPTION_IV, 'base64'); // Decode Base64 IV
const QR_BASE = process.env.QR_BASE || "https://tellmewhen.co.uk/customer_view/";

const ALGO = 'aes-128-cbc';

// Validate environment variables
if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 16 || !ENCRYPTION_IV || ENCRYPTION_IV.length !== 16) {
    throw new Error('Invalid or missing ENCRYPTION_KEY or ENCRYPTION_IV in .env file. Ensure it is a 16-byte (Base64-encoded) key/iv. To generate, run: openssl rand -base64 16');
}

/**
 * Encrypt Job ID using AES-128, ENCRYPTION_KEY, and ENCRYPTION_IV.
 * @param {string} jobId - The job ID to encrypt.
 * @returns {string} - URL-safe encrypted job ID.
 */
export function encryptJobId(jobId) {
    if (typeof jobId !== 'string' || jobId.trim() === '') {
        throw new Error('Invalid jobId: must be a non-empty string');
    }
    try {
        const cipher = crypto.createCipheriv(ALGO, ENCRYPTION_KEY, ENCRYPTION_IV);
        let encrypted = cipher.update(jobId, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted; 
    } catch (err) {
        console.error('Error encrypting job ID:', err);
        throw err;
    }
}

/**
 * Generate a URL for the encrypted job ID.
 * @param {string} id - The encrypted job ID.
 * @returns {string} - The full URL.
 */
export function generate_url(id) {
    return QR_BASE + id;
}

/**
 * takes job_id, enrypts it and returns qr-code as base-64 string
 * @returns {Promise<string>}
 * @param job_id
 */
export async function generate_qr(job_id) {
    if (typeof job_id !== 'string' || job_id.trim() === '') {
        throw new Error('Invalid job_id: must be a non-empty string');
    }
    try {
        const encryptedJobId = encryptJobId(job_id);
        const url = generate_url(encryptedJobId);
        return QRCode.toDataURL(url, {
            color: {
                dark: '#000',
                light: '#fff'
            }
        });
    } catch (err) {
        console.error('Error generating QR code:', err);
        throw err;
    }
}

/**
 * Decrypt Job ID using AES-128, ENCRYPTION_KEY, and ENCRYPTION_IV.
 * @param {string} encryptedJobId - The encrypted job ID.
 * @returns {string} - The decrypted job ID.
 */
export function decryptJobId(encryptedJobId) {
    if (typeof encryptedJobId !== 'string' || encryptedJobId.trim() === '') {
        throw new Error('Invalid encryptedJobId: must be a non-empty string');
    }
    try {
        const decipher = crypto.createDecipheriv(ALGO, ENCRYPTION_KEY, ENCRYPTION_IV);
        let decrypted = decipher.update(hex, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (err) {
        console.error('Error decrypting job ID:', err);
        throw err;
    }
}