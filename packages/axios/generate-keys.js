#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import { createPublicKey } from "crypto";

console.log("🔐 Generating RSA key pair for Epic JWT authentication...\n");

// Generate private key
console.log("1. Generating private key...");
execSync("openssl genrsa -out private_key.pem 2048", { stdio: "inherit" });

// Generate public key
console.log("2. Generating public key...");
execSync("openssl rsa -in private_key.pem -pubout -out public_key.pem", {
  stdio: "inherit",
});

// Convert to PKCS#8 format
console.log("3. Converting to PKCS#8 format...");
execSync(
  "openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in private_key.pem -out private_key_pkcs8.pem",
  { stdio: "inherit" },
);

// Read the PKCS#8 private key
const privateKey = fs.readFileSync("private_key_pkcs8.pem", "utf8");
const publicKey = fs.readFileSync("public_key.pem", "utf8");

console.log("\n✅ Key pair generated successfully!");
console.log("\n📋 Add this to your .env file:");
console.log('EPIC_PRIVATE_KEY="' + privateKey.replace(/\n/g, "\\n") + '"');
console.log("\n📋 Public key (register this with Epic):");
console.log(publicKey);

// Generate JWKS format for hosting
const publicKeyObj = createPublicKey(publicKey);
const jwk = publicKeyObj.export({ format: "jwk" });

console.log("\n📋 JWKS format (host this at /.well-known/jwks.json):");
console.log(
  JSON.stringify(
    {
      keys: [
        {
          kty: "RSA",
          use: "sig",
          alg: "RS256",
          kid: "ehr-integration-key-1", // Change this to a unique identifier
          n: jwk.n,
          e: jwk.e,
        },
      ],
    },
    null,
    2,
  ),
);

console.log("\n⚠️  Important:");
console.log(
  "- Keep private_key.pem and private_key_pkcs8.pem secure and never commit them",
);
console.log("- Register the public key with Epic at your JWKS endpoint");
console.log("- The private key is now in your .env file for JWT signing");

console.log("\n🧹 Cleaning up temporary files...");
fs.unlinkSync("private_key.pem");
fs.unlinkSync("private_key_pkcs8.pem");

console.log("✅ Setup complete! You can now use JWT authentication with Epic.");
