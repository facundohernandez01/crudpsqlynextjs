import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

// Configuración de tu tenant
const tenantId = "37cd273a-1cec-4aae-a297-41480ea54f8d";
const clientId = "d424e7b6-06b6-452d-9a03-b4ea8c01c0c0";

const client = jwksClient({
  jwksUri: `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`
});

// Función para obtener la clave pública del token
function getKey(header: any, callback: any) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) {
      callback(err, null);
    } else {
      const signingKey = key?.getPublicKey();
      callback(null, signingKey);
    }
  });
}

// Función principal para validar token y obtener datos del usuario
export async function verifyToken(token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getKey,
      {
        audience: clientId, // tu App Registration
        issuer: `https://login.microsoftonline.com/${tenantId}/v2.0`
      },
      (err, decoded) => {
        if (err) return reject(err);
        resolve(decoded);
      }
    );
  });
}
