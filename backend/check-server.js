// Script para verificar que el servidor backend está corriendo
const http = require('http');

const PORT = process.env.PORT || 4001;
const HOST = 'localhost';

const options = {
  hostname: HOST,
  port: PORT,
  path: '/',
  method: 'GET',
  timeout: 2000
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log(`✅ Servidor backend está corriendo en http://${HOST}:${PORT}`);
      console.log(`Respuesta: ${data}`);
      process.exit(0);
    } else {
      console.log(`⚠️  Servidor respondió con código ${res.statusCode}`);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error(`❌ Error: El servidor NO está corriendo en el puerto ${PORT}`);
  console.error(`   Detalles: ${error.message}`);
  console.error(`\n💡 Solución: Ejecuta "npm start" en la carpeta backend`);
  process.exit(1);
});

req.on('timeout', () => {
  console.error(`❌ Timeout: El servidor no respondió en el puerto ${PORT}`);
  req.destroy();
  process.exit(1);
});

req.end();

