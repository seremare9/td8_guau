// Script de verificación completa del proyecto
const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración del proyecto...\n');

let errors = [];
let warnings = [];
let success = [];

// Colores para la consola (Windows compatible)
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[36m',
};

function logSuccess(message) {
  console.log(`${colors.green}✅${colors.reset} ${message}`);
  success.push(message);
}

function logWarning(message) {
  console.log(`${colors.yellow}⚠️${colors.reset} ${message}`);
  warnings.push(message);
}

function logError(message) {
  console.log(`${colors.red}❌${colors.reset} ${message}`);
  errors.push(message);
}

function logInfo(message) {
  console.log(`${colors.blue}ℹ️${colors.reset} ${message}`);
}

// Verificar archivos del backend
console.log('\n📦 BACKEND:');
console.log('─'.repeat(50));

// 1. Verificar package.json del backend
const backendPackageJson = path.join(__dirname, 'backend', 'package.json');
if (fs.existsSync(backendPackageJson)) {
  logSuccess('backend/package.json existe');
  try {
    const pkg = JSON.parse(fs.readFileSync(backendPackageJson, 'utf8'));
    const requiredDeps = ['express', 'cors', 'pg', 'dotenv'];
    const missingDeps = requiredDeps.filter(dep => !pkg.dependencies?.[dep]);
    if (missingDeps.length === 0) {
      logSuccess('Todas las dependencias requeridas están en package.json');
    } else {
      logError(`Faltan dependencias: ${missingDeps.join(', ')}`);
    }
  } catch (e) {
    logError('Error al leer backend/package.json');
  }
} else {
  logError('backend/package.json NO existe');
}

// 2. Verificar index.js
const backendIndex = path.join(__dirname, 'backend', 'index.js');
if (fs.existsSync(backendIndex)) {
  logSuccess('backend/index.js existe');
  const content = fs.readFileSync(backendIndex, 'utf8');
  if (content.includes('PORT') && content.includes('4001')) {
    logSuccess('Puerto configurado correctamente (4001 por defecto)');
  }
  if (content.includes('cors()')) {
    logSuccess('CORS está configurado');
  }
} else {
  logError('backend/index.js NO existe');
}

// 3. Verificar db.config.js
const dbConfig = path.join(__dirname, 'backend', 'config', 'db.config.js');
if (fs.existsSync(dbConfig)) {
  logSuccess('backend/config/db.config.js existe');
} else {
  logError('backend/config/db.config.js NO existe');
}

// 4. Verificar rutas
const routes = ['dueño.routes.js', 'animal.routes.js', 'evento_salud.routes.js', 'peso.routes.js'];
routes.forEach(route => {
  const routePath = path.join(__dirname, 'backend', 'routes', route);
  if (fs.existsSync(routePath)) {
    logSuccess(`Ruta ${route} existe`);
  } else {
    logError(`Ruta ${route} NO existe`);
  }
});

// 5. Verificar .env del backend
const backendEnv = path.join(__dirname, 'backend', '.env');
if (fs.existsSync(backendEnv)) {
  logSuccess('backend/.env existe');
  try {
    const envContent = fs.readFileSync(backendEnv, 'utf8');
    const requiredVars = ['DB_USER', 'DB_HOST', 'DB_DATABASE', 'DB_PASSWORD'];
    const missingVars = requiredVars.filter(varName => !envContent.includes(`${varName}=`));
    if (missingVars.length === 0) {
      logSuccess('Todas las variables de entorno requeridas están configuradas');
    } else {
      logWarning(`Faltan variables de entorno: ${missingVars.join(', ')}`);
    }
    if (envContent.includes('PORT=')) {
      const portMatch = envContent.match(/PORT=(\d+)/);
      if (portMatch) {
        logInfo(`Puerto configurado en .env: ${portMatch[1]}`);
      }
    } else {
      logInfo('PORT no está en .env (usará 4001 por defecto)');
    }
  } catch (e) {
    logError('Error al leer backend/.env');
  }
} else {
  logWarning('backend/.env NO existe - Necesitas crearlo con las credenciales de la base de datos');
}

// Verificar archivos del frontend
console.log('\n🎨 FRONTEND:');
console.log('─'.repeat(50));

// 1. Verificar api-config.ts
const apiConfig = path.join(__dirname, 'front', 'lib', 'api-config.ts');
if (fs.existsSync(apiConfig)) {
  logSuccess('front/lib/api-config.ts existe');
  const content = fs.readFileSync(apiConfig, 'utf8');
  if (content.includes('localhost:4001')) {
    logSuccess('URL del backend configurada correctamente (localhost:4001)');
  }
} else {
  logError('front/lib/api-config.ts NO existe');
}

// 2. Verificar api.ts
const apiFile = path.join(__dirname, 'front', 'lib', 'api.ts');
if (fs.existsSync(apiFile)) {
  logSuccess('front/lib/api.ts existe');
  const content = fs.readFileSync(apiFile, 'utf8');
  const apis = ['dueñoApi', 'animalApi', 'eventoSaludApi', 'pesoApi'];
  apis.forEach(apiName => {
    if (content.includes(apiName)) {
      logSuccess(`API ${apiName} está definida`);
    } else {
      logError(`API ${apiName} NO está definida`);
    }
  });
} else {
  logError('front/lib/api.ts NO existe');
}

// 3. Verificar hooks
const useApiHook = path.join(__dirname, 'front', 'hooks', 'use-api.ts');
if (fs.existsSync(useApiHook)) {
  logSuccess('front/hooks/use-api.ts existe');
} else {
  logError('front/hooks/use-api.ts NO existe');
}

// 4. Verificar .env.local del frontend
const frontendEnv = path.join(__dirname, 'front', '.env.local');
if (fs.existsSync(frontendEnv)) {
  logSuccess('front/.env.local existe');
  try {
    const envContent = fs.readFileSync(frontendEnv, 'utf8');
    if (envContent.includes('NEXT_PUBLIC_API_URL')) {
      logSuccess('NEXT_PUBLIC_API_URL está configurada');
    } else {
      logWarning('NEXT_PUBLIC_API_URL no está en .env.local');
    }
  } catch (e) {
    logError('Error al leer front/.env.local');
  }
} else {
  logWarning('front/.env.local NO existe - Se usará el valor por defecto (localhost:4001)');
}

// Verificar node_modules
console.log('\n📚 DEPENDENCIAS:');
console.log('─'.repeat(50));

const backendNodeModules = path.join(__dirname, 'backend', 'node_modules');
if (fs.existsSync(backendNodeModules)) {
  logSuccess('Dependencias del backend instaladas (node_modules existe)');
} else {
  logWarning('Dependencias del backend NO instaladas - Ejecuta: cd backend && npm install');
}

const frontendNodeModules = path.join(__dirname, 'front', 'node_modules');
if (fs.existsSync(frontendNodeModules)) {
  logSuccess('Dependencias del frontend instaladas (node_modules existe)');
} else {
  logWarning('Dependencias del frontend NO instaladas - Ejecuta: cd front && npm install');
}

// Resumen
console.log('\n' + '='.repeat(50));
console.log('📊 RESUMEN:');
console.log('='.repeat(50));
console.log(`${colors.green}✅ Exitosos: ${success.length}${colors.reset}`);
console.log(`${colors.yellow}⚠️  Advertencias: ${warnings.length}${colors.reset}`);
console.log(`${colors.red}❌ Errores: ${errors.length}${colors.reset}`);

if (errors.length === 0 && warnings.length === 0) {
  console.log(`\n${colors.green}🎉 ¡Todo está configurado correctamente!${colors.reset}`);
} else if (errors.length === 0) {
  console.log(`\n${colors.yellow}⚠️  Hay algunas advertencias, pero nada crítico.${colors.reset}`);
} else {
  console.log(`\n${colors.red}❌ Hay errores que necesitan ser corregidos.${colors.reset}`);
}

// Próximos pasos
console.log('\n📝 PRÓXIMOS PASOS:');
console.log('─'.repeat(50));

if (!fs.existsSync(backendEnv)) {
  console.log('1. Crea backend/.env con las credenciales de PostgreSQL');
  console.log('   (Puedes copiar de backend/.env.example si existe)');
}

if (!fs.existsSync(backendNodeModules)) {
  console.log('2. Instala dependencias del backend:');
  console.log('   cd backend && npm install');
}

if (!fs.existsSync(frontendNodeModules)) {
  console.log('3. Instala dependencias del frontend:');
  console.log('   cd front && npm install');
}

if (fs.existsSync(backendNodeModules) && fs.existsSync(backendEnv)) {
  console.log('4. Inicia el backend:');
  console.log('   cd backend && npm start');
  console.log('   O desde la raíz: npm run dev:backend');
}

if (fs.existsSync(frontendNodeModules)) {
  console.log('5. Inicia el frontend:');
  console.log('   cd front && npm run dev');
  console.log('   O desde la raíz: npm run dev');
}

console.log('\n');



