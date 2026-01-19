# WayPool - Guía de Despliegue a Producción

## Información del Servidor

- **Host:** waypool.net
- **Puerto SSH:** 50050
- **Usuario:** waypool.net_732ap8wrgob
- **Password:** c1c@sty4Q0zX#dmK

## Rutas en Producción

### IMPORTANTE: Los archivos deben subirse a DOS ubicaciones

| Tipo de archivo | Ruta en servidor |
|-----------------|------------------|
| **Assets (JS, CSS)** | `/var/www/vhosts/waypool.net/httpdocs/assets/` |
| **index.html** | `/var/www/vhosts/waypool.net/httpdocs/` |
| **Assets (copia)** | `/var/www/vhosts/waypool.net/WayPool.net/dist/public/assets/` |
| **index.html (copia)** | `/var/www/vhosts/waypool.net/WayPool.net/dist/public/` |
| **Server (index.js)** | `/var/www/vhosts/waypool.net/WayPool.net/dist/` |
| **ecosystem.config.cjs** | `/var/www/vhosts/waypool.net/WayPool.net/` |

## Proceso de Despliegue Completo

### 1. Actualizar versión (SIEMPRE antes de build)

Editar `client/src/lib/version.ts`:
```typescript
export const APP_VERSION = "X.X.X";  // Incrementar versión
export const BUILD_DATE = "YYYY-MM-DD";  // Fecha actual
```

### 2. Compilar el proyecto

```bash
cd /Users/lorenzoballantimoran/Documents/waybank.info
npm run build
```

### 3. Subir archivos a producción

```bash
# Conexión SSH
sshpass -p 'c1c@sty4Q0zX#dmK' ssh -p 50050 waypool.net_732ap8wrgob@waypool.net

# O usar SCP para subir archivos:

# Assets a httpdocs
sshpass -p 'c1c@sty4Q0zX#dmK' scp -P 50050 dist/public/assets/* waypool.net_732ap8wrgob@waypool.net:/var/www/vhosts/waypool.net/httpdocs/assets/

# index.html a httpdocs
sshpass -p 'c1c@sty4Q0zX#dmK' scp -P 50050 dist/public/index.html waypool.net_732ap8wrgob@waypool.net:/var/www/vhosts/waypool.net/httpdocs/

# Assets a WayPool.net/dist/public
sshpass -p 'c1c@sty4Q0zX#dmK' scp -P 50050 dist/public/assets/* waypool.net_732ap8wrgob@waypool.net:/var/www/vhosts/waypool.net/WayPool.net/dist/public/assets/

# index.html a WayPool.net/dist/public
sshpass -p 'c1c@sty4Q0zX#dmK' scp -P 50050 dist/public/index.html waypool.net_732ap8wrgob@waypool.net:/var/www/vhosts/waypool.net/WayPool.net/dist/public/

# Server index.js
sshpass -p 'c1c@sty4Q0zX#dmK' scp -P 50050 dist/index.js waypool.net_732ap8wrgob@waypool.net:/var/www/vhosts/waypool.net/WayPool.net/dist/
```

### 4. Reiniciar el servidor

```bash
sshpass -p 'c1c@sty4Q0zX#dmK' ssh -p 50050 waypool.net_732ap8wrgob@waypool.net "cd /var/www/vhosts/waypool.net/WayPool.net && export PATH=\$PATH:/opt/plesk/node/22/bin && npx pm2 restart waypool --update-env"
```

### 5. Verificar logs

```bash
sshpass -p 'c1c@sty4Q0zX#dmK' ssh -p 50050 waypool.net_732ap8wrgob@waypool.net "cd /var/www/vhosts/waypool.net/WayPool.net && export PATH=\$PATH:/opt/plesk/node/22/bin && npx pm2 logs waypool --lines 30 --nostream"
```

## Script de Despliegue Rápido

Copia y pega todo esto en la terminal:

```bash
cd /Users/lorenzoballantimoran/Documents/waybank.info && \
npm run build && \
sshpass -p 'c1c@sty4Q0zX#dmK' scp -P 50050 dist/public/assets/* waypool.net_732ap8wrgob@waypool.net:/var/www/vhosts/waypool.net/httpdocs/assets/ && \
sshpass -p 'c1c@sty4Q0zX#dmK' scp -P 50050 dist/public/index.html waypool.net_732ap8wrgob@waypool.net:/var/www/vhosts/waypool.net/httpdocs/ && \
sshpass -p 'c1c@sty4Q0zX#dmK' scp -P 50050 dist/public/assets/* waypool.net_732ap8wrgob@waypool.net:/var/www/vhosts/waypool.net/WayPool.net/dist/public/assets/ && \
sshpass -p 'c1c@sty4Q0zX#dmK' scp -P 50050 dist/public/index.html waypool.net_732ap8wrgob@waypool.net:/var/www/vhosts/waypool.net/WayPool.net/dist/public/ && \
sshpass -p 'c1c@sty4Q0zX#dmK' scp -P 50050 dist/index.js waypool.net_732ap8wrgob@waypool.net:/var/www/vhosts/waypool.net/WayPool.net/dist/ && \
sshpass -p 'c1c@sty4Q0zX#dmK' ssh -p 50050 waypool.net_732ap8wrgob@waypool.net "cd /var/www/vhosts/waypool.net/WayPool.net && export PATH=\$PATH:/opt/plesk/node/22/bin && npx pm2 restart waypool --update-env"
```

## Variables de Entorno (ecosystem.config.cjs)

El archivo `ecosystem.config.cjs` en el servidor contiene todas las variables de entorno:

```javascript
module.exports = {
  apps: [{
    name: 'waypool',
    script: 'dist/index.js',
    cwd: '/var/www/vhosts/waypool.net/WayPool.net',
    env: {
      NODE_ENV: 'production',
      PORT: 5001,
      DATABASE_URL: 'postgresql://...',
      SESSION_SECRET: '...',
      SMTP_HOST: '...',
      SMTP_PORT: '465',
      SMTP_USER: '...',
      SMTP_PASSWORD: '...',
      SMTP_FROM: '...',
      ADMIN_EMAIL: '...',
      ALCHEMY_API_KEY: '...'
    }
  }]
};
```

Si necesitas actualizar variables de entorno:
1. Editar `ecosystem.config.cjs` en el servidor
2. Ejecutar: `npx pm2 delete waypool && npx pm2 start ecosystem.config.cjs && npx pm2 save`

## Troubleshooting

### El sitio no muestra cambios
1. Verificar que subiste a AMBAS rutas (httpdocs Y WayPool.net/dist/public)
2. Limpiar cache del navegador (Ctrl+Shift+R)
3. Verificar versión en el sidebar

### PM2 no encuentra comandos
Siempre usar: `export PATH=$PATH:/opt/plesk/node/22/bin` antes de comandos PM2

### NFTs no cargan
Verificar que ALCHEMY_API_KEY está en ecosystem.config.cjs y reiniciar con `--update-env`

## Backups

Los backups se guardan en: `/Users/lorenzoballantimoran/Documents/waybank.info/backups/`

Estructura:
```
backups/
└── YYYY-MM-DD/
    └── database_backup.json
```

---

**Última actualización:** 2026-01-18
**Versión actual en producción:** v1.0.2
