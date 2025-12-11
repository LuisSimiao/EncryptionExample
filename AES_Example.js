/*
  Title: AES_Example.js
  Author: Luis Simiao
  Purpose: simple AES-256-CBC encrypt/decrypt helper for local testing.
*/

const crypto = require('crypto');

// Hardcoded key for local testing only.
const ENCRYPTION_KEY = Buffer.from('K5k3ki0EspEWOdGAlZ/jk3RiutjHx5zIkjTh/p1ufcU=', 'base64'); // fallback for dev

// Quick debug to ensure key is loaded properly
console.log('[encryption.js] ENCRYPTION_KEY length:', ENCRYPTION_KEY.length);

const IV_LENGTH = 16; // bytes (AES block size)

// Encrypt a string -> returns ivHex:ciphertextHex
function encrypt(text) {
  if (typeof text !== 'string') text = String(text);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

// Decrypt string produced by encrypt()
function decrypt(text) {
  // Validate input format strictly and throw on malformed values so callers/tests
  // can rely on errors instead of silently returning the original value.
  if (typeof text !== 'string' || !text.includes(':')) {
    throw new Error('Invalid encrypted input');
  }

  const parts = text.split(':');
  if (parts.length < 2 || parts[0].length !== IV_LENGTH * 2) {
    throw new Error('Invalid encrypted input');
  }

  const iv = Buffer.from(parts.shift(), 'hex');
  const encryptedText = parts.join(':');
  try {
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    // Surface a clear error for test assertions and callers.
    throw new Error('Decryption failed');
  }
}

module.exports = { encrypt, decrypt };