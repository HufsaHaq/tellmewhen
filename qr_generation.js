import QRCode from 'qrcode'
import crypto from 'crypto';

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'base64'); // Decode Base64 key
const ENCRYPTION_IV = Buffer.from(process.env.ENCRYPTION_IV, 'base64'); // Decode Base64 IV

const ALGO = 'aes-128-cbc';

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 16 || !ENCRYPTION_IV || ENCRYPTION_IV.length !== 16) {
    throw new Error('Invalid or missing ENCRYPTION_KEY or ENCRYPTION_IV in .env file. Ensure it is a 16-byte (Base64-encoded) key/iv. To generate, run: openssl rand -base64 16');
}

/**
 * Converts standard base64 to a URL-safe variant:
 * - '+' -> '-'
 * - '/' -> '_'
 * - removes trailing '='
 */
function toUrlSafeBase64(base64String) {
    return base64String
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, ''); // remove any trailing '='
}

// ADDED: Reverse of `toUrlSafeBase64`, converting URL-safe back to normal base64
function fromUrlSafeBase64(urlSafeString) {
    let base64 = urlSafeString
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    // Add back any necessary padding
    while (base64.length % 4 !== 0) {
        base64 += '=';
    }
    return base64;
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

        // ADDED: Convert the result into a URL-safe form
        const urlSafeEncrypted = toUrlSafeBase64(encrypted);

        // Return the URL-safe encrypted data
        return urlSafeEncrypted;
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
            dark: '#000',
            light: '#fff'
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
        // ADDED: Convert from URL-safe base64 back to normal base64
        const normalBase64 = fromUrlSafeBase64(encryptedJobId);

        // Create a decipher using the encryption key and IV
        const decipher = crypto.createDecipheriv(ALGO, ENCRYPTION_KEY, ENCRYPTION_IV);

        // Decrypt the data
        let decrypted = decipher.update(normalBase64, 'base64', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    } catch (err) {
        console.error('Error decrypting job ID:', err);
        throw err;
    }
}
