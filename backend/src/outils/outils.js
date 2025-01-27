require('dotenv').config();
const crypto = require("crypto");

function base64UrlEncode(input) {
    return Buffer.from(input).toString('base64url');
};

// Fonction pour générer le header JWT
function generateHeader() {
    const header = { alg: 'HS256', typ: 'JWT' };
    return base64UrlEncode(JSON.stringify(header));
};

// Fonction pour générer le payload JWT
function generatePayload(payload) {
    return base64UrlEncode(JSON.stringify(payload));
};

// Fonction pour signer le JWT avec une clé secrète
function generateSignature(header, payload, secret) {
    const data = `${header}.${payload}`;
    return base64UrlEncode(crypto.createHmac('sha256', secret).update(data).digest('hex'));
};
// const getAll = async (req, res) =>{};
const generateToken = (payload) => {
    const header = generateHeader();
    const payloadBase64 = generatePayload(payload);
    const signature = generateSignature(header, payloadBase64, process.env.JWT_SECRET_KEY);

    return `${header}.${payloadBase64}.${signature}`;
}

const createGrainDeSel = (nombreCaractere) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < nombreCaractere; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

const createNonce = (datas) => {
    let nonce = 0; let proofOfWork;
    while (true) {
        proofOfWork = crypto.createHash('sha256').update(datas + nonce).digest('hex');
        if (proofOfWork.startsWith('000')) {
            return { nonce, proofOfWork };
        }
        nonce++;
    }
}

const verifNonce = (datas, nonce, proofOfWork) => {
    let result = crypto.createHash('sha256').update(datas + nonce).digest('hex');
    return result === proofOfWork && result.startsWith('000');
}

const createData = (req) => {
    const issuedAt = Date.now();
    const deviceFingerprint = createDeviceFingerprint(req);
    return { issuedAt, deviceFingerprint };
}

function createDeviceFingerprint(req) {
    const fuseauHoraire = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const ipAdresse = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "";
    const navigateur = req.headers['user-agent'] || '';
    const deviceFingerprint = crypto.createHash('sha256').update(ipAdresse + fuseauHoraire + navigateur).digest('hex');
    return deviceFingerprint;
}

const createExpiresIn = (changement = true) => {
    let expiresIn
    if (changement) {
        expiresIn = Date.now() + 900000;
    }
    else {
        expiresIn = Date.now() + 30 * 24 * 60 * 60 * 1000;
    }
    return expiresIn;
}

function verifyJWTToken(token = '') {

    // 1. Séparer le token JWT en 3 (tête, corps, signature)
    const [base64Header, base64Payload, signature] = token.split('.');

    // 2. Regénérer la signature pour le header et le payload
    const expectedSignature = generateSignature(base64Header, base64Payload, process.env.JWT_SECRET_KEY);

    // 3. Comparer la signature regénérer avec l'originale
    if (expectedSignature !== signature) {
        return false;
    }

    // 4. Décoder le payload et le parser en un objet JavaScript
    const payloadString = Buffer.from(base64Payload, 'base64url').toString();
    const payload = JSON.parse(payloadString);

    // 5. Vérifier l'expiration du token JWT
    if (payload.expiration && Date.now() > payload.expiration) {
        return false;
    }

    // 6. Renvoyer le corps du token JWT parsé en un objet JavaScript
    return payload;

}

function fingerprintTokenVerify(claims1, claims2) {
    return (claims1 === claims2);
}

const verifyAccessToken = (token = '', deviceFingerprint) => {
    const [status, newToken] = token.split(' ');

    if (status !== 'Bearer') {
        return false;
    }

    const accessToken = verifyJWTToken(newToken);
    if (!accessToken) {
        return false;
    }

    const fingerprintVerify = fingerprintTokenVerify(deviceFingerprint, accessToken.deviceFingerprint);
    if (!fingerprintVerify) {
        return false;
    }

    return accessToken;
}

const verifyRefreshToken = (token = '', fingerprint) => {
    const refreshToken = verifyJWTToken(token);

    if (!refreshToken) {
        return false;
    }

    const fingerprintVerify = fingerprintTokenVerify(fingerprint, refreshToken.deviceFingerprint)

    if (!fingerprintVerify) {
        return false;
    }

    return refreshToken;
}

module.exports = {
    generateToken,
    createGrainDeSel,
    createNonce,
    verifNonce,
    createData,
    createDeviceFingerprint,
    createExpiresIn,
    verifyAccessToken,
    verifyRefreshToken
}