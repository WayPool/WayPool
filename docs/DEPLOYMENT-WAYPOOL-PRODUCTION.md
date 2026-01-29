# Guía de Despliegue - WayPool Producción

## Información del Servidor

| Campo | Valor |
|-------|-------|
| **Host** | waypool.net |
| **Puerto SSH** | 50050 |
| **Usuario** | waypool.net_732ap8wrgob |
| **Password** | c1c@sty4Q0zX#dmK |
| **Node.js** | /opt/plesk/node/20/bin (v20.20.0) |
| **PM2** | ~/WayPool/node_modules/pm2/bin/pm2 |

---

## Estructura del Servidor

```
/var/www/vhosts/waypool.net/
├── WayPool/                    # Backend Node.js + Frontend compilado
│   ├── dist/
│   │   ├── index.js           # Server bundle compilado
│   │   └── public/
│   │       ├── index.html     # HTML principal
│   │       └── assets/        # JS/CSS compilados (React)
│   ├── node_modules/
│   ├── server/                # Código fuente servidor (no se usa en prod)
│   ├── .env                   # Variables de entorno
│   └── package.json
├── httpdocs/                   # Frontend público (Apache/Nginx)
│   ├── index.html
│   ├── assets/                # JS/CSS compilados
│   └── .htaccess              # Proxy a backend :5001
└── WayPool.net/               # Backup/versión anterior (ignorar)
```

**Importante:** El servidor NO tiene repositorio Git. Se usa `scp` para subir archivos.

---

## Comandos de Conexión

### Conectar por SSH
```bash
sshpass -p 'c1c@sty4Q0zX#dmK' ssh -p 50050 -o StrictHostKeyChecking=no waypool.net_732ap8wrgob@waypool.net
```

### Subir archivo individual
```bash
sshpass -p 'c1c@sty4Q0zX#dmK' scp -P 50050 -o StrictHostKeyChecking=no <archivo_local> waypool.net_732ap8wrgob@waypool.net:<ruta_destino>
```

### Subir carpeta recursiva
```bash
sshpass -p 'c1c@sty4Q0zX#dmK' scp -P 50050 -o StrictHostKeyChecking=no -r <carpeta_local>/* waypool.net_732ap8wrgob@waypool.net:<ruta_destino>/
```

---

## Proceso de Despliegue Completo

### Paso 1: Build Local

Desde la carpeta del proyecto local:
```bash
cd /Users/lorenzoballantimoran/Documents/waybank.info
npm run build
```

Esto genera:
- `dist/index.js` - Bundle del servidor
- `dist/public/index.html` - HTML principal
- `dist/public/assets/*` - JS/CSS compilados del frontend

### Paso 2: Subir Assets del Frontend

```bash
# Subir JS/CSS compilados a WayPool
sshpass -p 'c1c@sty4Q0zX#dmK' scp -P 50050 -o StrictHostKeyChecking=no -r dist/public/assets/* waypool.net_732ap8wrgob@waypool.net:~/WayPool/dist/public/assets/

# Subir index.html a WayPool
sshpass -p 'c1c@sty4Q0zX#dmK' scp -P 50050 -o StrictHostKeyChecking=no dist/public/index.html waypool.net_732ap8wrgob@waypool.net:~/WayPool/dist/public/

# Subir también a httpdocs (frontend público)
sshpass -p 'c1c@sty4Q0zX#dmK' scp -P 50050 -o StrictHostKeyChecking=no -r dist/public/assets/* waypool.net_732ap8wrgob@waypool.net:~/httpdocs/assets/
sshpass -p 'c1c@sty4Q0zX#dmK' scp -P 50050 -o StrictHostKeyChecking=no dist/public/index.html waypool.net_732ap8wrgob@waypool.net:~/httpdocs/
```

### Paso 3: Subir Server Bundle (si hay cambios en backend)

```bash
sshpass -p 'c1c@sty4Q0zX#dmK' scp -P 50050 -o StrictHostKeyChecking=no dist/index.js waypool.net_732ap8wrgob@waypool.net:~/WayPool/dist/
```

### Paso 4: Reiniciar PM2

```bash
sshpass -p 'c1c@sty4Q0zX#dmK' ssh -p 50050 -o StrictHostKeyChecking=no waypool.net_732ap8wrgob@waypool.net "export PATH=/opt/plesk/node/20/bin:\$PATH && cd ~/WayPool && node node_modules/pm2/bin/pm2 restart waypool"
```

### Paso 5: Verificar Estado

```bash
# Ver estado de PM2
sshpass -p 'c1c@sty4Q0zX#dmK' ssh -p 50050 -o StrictHostKeyChecking=no waypool.net_732ap8wrgob@waypool.net "export PATH=/opt/plesk/node/20/bin:\$PATH && cd ~/WayPool && node node_modules/pm2/bin/pm2 list"

# Ver logs recientes
sshpass -p 'c1c@sty4Q0zX#dmK' ssh -p 50050 -o StrictHostKeyChecking=no waypool.net_732ap8wrgob@waypool.net "export PATH=/opt/plesk/node/20/bin:\$PATH && cd ~/WayPool && node node_modules/pm2/bin/pm2 logs waypool --lines 20 --nostream"
```

---

## Script de Despliegue Rápido

Copia y ejecuta todo esto para un despliegue completo:

```bash
# === DESPLIEGUE WAYPOOL ===
cd /Users/lorenzoballantimoran/Documents/waybank.info

# 1. Build
npm run build

# 2. Subir frontend a WayPool
sshpass -p 'c1c@sty4Q0zX#dmK' scp -P 50050 -o StrictHostKeyChecking=no -r dist/public/assets/* waypool.net_732ap8wrgob@waypool.net:~/WayPool/dist/public/assets/
sshpass -p 'c1c@sty4Q0zX#dmK' scp -P 50050 -o StrictHostKeyChecking=no dist/public/index.html waypool.net_732ap8wrgob@waypool.net:~/WayPool/dist/public/

# 3. Subir frontend a httpdocs
sshpass -p 'c1c@sty4Q0zX#dmK' scp -P 50050 -o StrictHostKeyChecking=no -r dist/public/assets/* waypool.net_732ap8wrgob@waypool.net:~/httpdocs/assets/
sshpass -p 'c1c@sty4Q0zX#dmK' scp -P 50050 -o StrictHostKeyChecking=no dist/public/index.html waypool.net_732ap8wrgob@waypool.net:~/httpdocs/

# 4. Subir server bundle
sshpass -p 'c1c@sty4Q0zX#dmK' scp -P 50050 -o StrictHostKeyChecking=no dist/index.js waypool.net_732ap8wrgob@waypool.net:~/WayPool/dist/

# 5. Reiniciar PM2
sshpass -p 'c1c@sty4Q0zX#dmK' ssh -p 50050 -o StrictHostKeyChecking=no waypool.net_732ap8wrgob@waypool.net "export PATH=/opt/plesk/node/20/bin:\$PATH && cd ~/WayPool && node node_modules/pm2/bin/pm2 restart waypool && node node_modules/pm2/bin/pm2 list"
```

---

## Comandos PM2 Útiles

Todos requieren el prefijo de PATH y ejecutarse desde ~/WayPool:

```bash
# Prefijo común
PREFIX="export PATH=/opt/plesk/node/20/bin:\$PATH && cd ~/WayPool && node node_modules/pm2/bin/pm2"

# Listar procesos
$PREFIX list

# Reiniciar
$PREFIX restart waypool

# Ver logs en vivo
$PREFIX logs waypool

# Ver logs últimas N líneas
$PREFIX logs waypool --lines 50 --nostream

# Detener
$PREFIX stop waypool

# Iniciar
$PREFIX start waypool

# Ver detalles del proceso
$PREFIX describe 0
```

---

## Troubleshooting

### El frontend no se actualiza
- Hacer hard refresh: `Cmd+Shift+R` (Mac) o `Ctrl+Shift+R` (Windows)
- Verificar que los assets se subieron a **ambas** carpetas:
  - `~/WayPool/dist/public/assets/`
  - `~/httpdocs/assets/`

### PM2 no encuentra el comando
- Usar siempre la ruta completa: `node node_modules/pm2/bin/pm2`
- Añadir PATH: `export PATH=/opt/plesk/node/20/bin:$PATH`

### Error de conexión SSH
- Verificar que el puerto es 50050 (no el default 22)
- Usar flag `-o StrictHostKeyChecking=no` para evitar problemas de host key

### Ver errores del servidor
```bash
sshpass -p 'c1c@sty4Q0zX#dmK' ssh -p 50050 -o StrictHostKeyChecking=no waypool.net_732ap8wrgob@waypool.net "cat ~/.pm2/logs/waypool-error.log | tail -50"
```

---

## Variables de Entorno (.env)

Ubicación: `~/WayPool/.env`

```env
DATABASE_URL="postgresql://neondb_owner:npg_AGK3v2utzVxf@ep-jolly-butterfly-a9adjssi-pooler.gwc.azure.neon.tech/neondb?sslmode=require"
SESSION_SECRET="waypool-secure-session-secret-a8f2k9m3x7p1q4w6e0r5t8y2u"
SMTP_HOST="elysiumdubai.net"
SMTP_PORT="465"
SMTP_USER="noreply@elysiumdubai.net"
SMTP_PASSWORD="1lyl_5O36"
SMTP_FROM="WayPool <noreply@elysiumdubai.net>"
ADMIN_EMAIL="info@waypool.net"
NODE_ENV="production"
PORT=5001
ALCHEMY_API_KEY="KaVqN2ssq8kWchnWv9pw0"
```

---

## Notas Importantes

1. **No hay Git en el servidor** - Todo se sube manualmente con `scp`
2. **Puerto 5001** - WayPool usa 5001 para evitar conflicto con WayBank (5000)
3. **Dos ubicaciones frontend** - Siempre subir a WayPool/dist/public Y httpdocs
4. **PM2 no está en PATH** - Usar siempre la ruta completa con node

---

*Última actualización: 29 Enero 2026*
