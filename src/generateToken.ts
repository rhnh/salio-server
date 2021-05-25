/**
 * This module will generate a public and private keypair and save to current directory
 *
 * Make sure to save the private key elsewhere after generated!
 */
import  crypto from  'crypto';
import fs  from 'fs';

export function genKeyPair() {
  // Generates an object where the keys are stored in properties `privateKey` and `publicKey`
  const keyPair = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096, // bits - standard for RSA keys
    publicKeyEncoding: {
      type: 'pkcs1', // "Public Key Cryptography Standards 1"
      format: 'pem', // Most common formatting choice
    },
    privateKeyEncoding: {
      type: 'pkcs1', // "Public Key Cryptography Standards 1"
      format: 'pem', // Most common formatting choice
    },
  })

  console.log(__dirname,'lol ahahahahah')
  fs.writeFileSync(__dirname + '/id_rsa_pub.pem', keyPair.publicKey)

  // Create the private key file
  fs.writeFileSync(__dirname + '/id_rsa_priv.pem', keyPair.privateKey)
}

// Generate the keypair
genKeyPair()
