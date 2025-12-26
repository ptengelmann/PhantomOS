import crypto from 'crypto';

// Encryption configuration
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // For AES, this is always 16
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 32;
const KEY_LENGTH = 32; // 256 bits

// Get encryption key from environment or generate a derived key
function getEncryptionKey(): Buffer {
  const secret = process.env.ENCRYPTION_KEY || process.env.NEXTAUTH_SECRET;

  if (!secret) {
    throw new Error('ENCRYPTION_KEY or NEXTAUTH_SECRET environment variable is required');
  }

  // Derive a consistent 32-byte key from the secret
  return crypto.scryptSync(secret, 'phantomos-salt', KEY_LENGTH);
}

/**
 * Encrypt sensitive data (like API tokens, credentials)
 * Returns a base64-encoded string containing: salt + iv + authTag + encrypted data
 */
export function encrypt(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const salt = crypto.randomBytes(SALT_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  // Combine all parts: salt + iv + authTag + encrypted
  const combined = Buffer.concat([
    salt,
    iv,
    authTag,
    Buffer.from(encrypted, 'hex'),
  ]);

  return combined.toString('base64');
}

/**
 * Decrypt sensitive data
 * Takes a base64-encoded string and returns the original plaintext
 */
export function decrypt(encryptedData: string): string {
  const key = getEncryptionKey();

  const combined = Buffer.from(encryptedData, 'base64');

  // Extract parts
  const salt = combined.subarray(0, SALT_LENGTH);
  const iv = combined.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const authTag = combined.subarray(
    SALT_LENGTH + IV_LENGTH,
    SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH
  );
  const encrypted = combined.subarray(SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted.toString('hex'), 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Encrypt an object (like connector credentials)
 */
export function encryptObject<T extends Record<string, unknown>>(obj: T): string {
  const json = JSON.stringify(obj);
  return encrypt(json);
}

/**
 * Decrypt an object
 */
export function decryptObject<T extends Record<string, unknown>>(encryptedData: string): T {
  const json = decrypt(encryptedData);
  return JSON.parse(json) as T;
}

/**
 * Check if a string appears to be encrypted (base64 with correct length)
 */
export function isEncrypted(data: string): boolean {
  try {
    const decoded = Buffer.from(data, 'base64');
    // Minimum length: salt + iv + authTag + at least 1 byte of data
    return decoded.length > SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH;
  } catch {
    return false;
  }
}

/**
 * Safely encrypt credentials - handles both new and already-encrypted data
 */
export function encryptCredentials(credentials: Record<string, unknown>): string {
  // Check if already encrypted (stored as string)
  if (typeof credentials === 'string') {
    if (isEncrypted(credentials)) {
      return credentials; // Already encrypted
    }
    // Plain string - encrypt it
    return encrypt(credentials);
  }

  // Object - encrypt it
  return encryptObject(credentials);
}

/**
 * Safely decrypt credentials - handles both encrypted and plain data
 */
export function decryptCredentials<T extends Record<string, unknown>>(
  credentials: unknown
): T {
  // If it's already an object, return as-is (legacy unencrypted data)
  if (typeof credentials === 'object' && credentials !== null) {
    return credentials as T;
  }

  // If it's a string, try to decrypt
  if (typeof credentials === 'string') {
    if (isEncrypted(credentials)) {
      return decryptObject<T>(credentials);
    }
    // Not encrypted - try to parse as JSON
    try {
      return JSON.parse(credentials) as T;
    } catch {
      throw new Error('Invalid credentials format');
    }
  }

  throw new Error('Invalid credentials format');
}

/**
 * Generate a secure random token
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Hash a value for comparison (one-way)
 */
export function hashValue(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}
