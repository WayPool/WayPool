# Guía de Despliegue - WayPool

## Información General

- **Versión Actual:** v1.1.3
- **Fecha:** 2026-01-19
- **Repositorio GitHub:** https://github.com/WayPool/WayPool.git
- **Servidor Producción:** waypool.net (Professional Hosting con Plesk)

---

## Estructura de Carpetas Correctas

### Carpeta de Desarrollo Local
```
/Users/lorenzoballantimoran/Documents/waybank.info/
```

### Carpetas Principales del Proyecto
| Carpeta | Descripción |
|---------|-------------|
| `client/` | Frontend React/Vite |
| `server/` | Backend Node.js/Express |
| `shared/` | Código compartido (schemas, tipos) |
| `scripts/` | Scripts de utilidad y mantenimiento |
| `docs/` | Documentación |
| `backups/` | Copias de seguridad |

### Carpeta de Backup Actual (VERIFICADA)
```
backups/2026-01-19-v1.1.3-completa/
```
Esta carpeta contiene la versión funcional con todas las características:
- Sistema de emails multiidioma (10 idiomas)
- Alertas de distribución APR con datos de pools
- currentApr funcionando en dashboard
- Control de versión en sidebar

---

## Credenciales de Acceso SSH

### WayPool.net (PRODUCCIÓN)
```bash
Host: waypool.net
Puerto: 50050
Usuario: waypool.net_732ap8wrgob
Password: c1c@sty4Q0zX#dmK
```

**Comando de conexión:**
```bash
sshpass -p 'c1c@sty4Q0zX#dmK' ssh -p 50050 waypool.net_732ap8wrgob@waypool.net
```

---

## Procedimiento de Despliegue

### PASO 1: Verificar que Git está sincronizado localmente

**IMPORTANTE:** Antes de subir archivos, asegúrate de que tu carpeta local está sincronizada con Git.

```bash
cd /Users/lorenzoballantimoran/Documents/waybank.info

# Verificar estado
git status

# Si hay cambios sin sincronizar, sincronizar primero:
git checkout -- .
git pull origin main
```

### PASO 2: Verificar la versión local

```bash
# Verificar versión en el archivo
cat client/src/lib/version.ts

# Debe mostrar la versión correcta (ej: 1.1.3)
```

### PASO 3: Conectar al servidor

```bash
sshpass -p 'c1c@sty4Q0zX#dmK' ssh -p 50050 waypool.net_732ap8wrgob@waypool.net
```

### PASO 4: Subir archivos al servidor

**Desde tu máquina local** (no desde SSH), usa `scp` para subir los archivos:

```bash
# Subir carpeta client/src
scp -P 50050 -r client/src waypool.net_732ap8wrgob@waypool.net:~/client/

# Subir carpeta server
scp -P 50050 -r server waypool.net_732ap8wrgob@waypool.net:~/

# Subir carpeta shared
scp -P 50050 -r shared waypool.net_732ap8wrgob@waypool.net:~/

# Subir archivos de configuración
scp -P 50050 package.json tsconfig.json vite.config.ts drizzle.config.ts waypool.net_732ap8wrgob@waypool.net:~/
```

### PASO 5: Reconstruir en el servidor

Conectar al servidor y ejecutar:

```bash
# Ir al directorio del proyecto
cd ~

# Instalar dependencias (si es necesario)
npm install

# Reconstruir el proyecto
npm run build

# Reiniciar PM2
pm2 restart all

# Verificar estado
pm2 status
pm2 logs --lines 20
```

### PASO 6: Verificar el despliegue

1. Visitar https://waypool.net
2. Verificar la versión en el sidebar del dashboard
3. Verificar que el APR actual se muestra correctamente
4. Probar la API: `curl https://waypool.net/api/dashboard/[USER_ID]`

---

## Errores Comunes y Soluciones

### Error: "Archivos locales desactualizados"

**Problema:** Los archivos en disco no coinciden con Git.

**Solución:**
```bash
cd /Users/lorenzoballantimoran/Documents/waybank.info
git fetch origin
git checkout -- .
git pull origin main
```

### Error: "Build failed" en servidor

**Problema:** Dependencias faltantes o código incompatible.

**Solución:**
```bash
rm -rf node_modules
npm install
npm run build
```

### Error: "currentApr no se muestra"

**Problema:** Schema o servidor desactualizado.

**Verificar:**
1. `shared/schema.ts` debe tener el campo `currentApr`
2. El servidor debe retornar el campo en la API
3. El frontend debe mostrar ambos APRs separados

---

## Lista de Verificación Pre-Despliegue

- [ ] `git status` muestra "working tree clean"
- [ ] `git pull origin main` ejecutado
- [ ] Versión en `client/src/lib/version.ts` es correcta
- [ ] Backup creado antes de subir
- [ ] Todas las características funcionan localmente

## Lista de Verificación Post-Despliegue

- [ ] Versión correcta en sidebar del dashboard
- [ ] currentApr se muestra diferente a apr contratado
- [ ] Emails funcionan (probar con script de test)
- [ ] PM2 muestra estado "online"
- [ ] Sin errores en `pm2 logs`

---

## Historial de Versiones

| Versión | Fecha | Características |
|---------|-------|-----------------|
| v1.1.3 | 2026-01-19 | currentApr en dashboard, emails multiidioma, alertas APR |
| v1.1.2 | 2026-01-18 | Alertas email distribución APR |
| v1.1.1 | 2026-01-18 | Sistema daily APR distribution |
| v1.1.0 | 2026-01-17 | Mejoras UI y sistema de referidos |

---

## Contacto de Emergencia

Si hay problemas críticos:
1. Revisar `pm2 logs` en el servidor
2. Restaurar desde backup si es necesario
3. Verificar credenciales en `docs/credenciales.md`

---

## Notas Importantes

1. **NUNCA** subir archivos sin verificar primero que Git está sincronizado
2. **SIEMPRE** crear backup antes de hacer cambios importantes
3. **SIEMPRE** verificar la versión después de desplegar
4. Los archivos locales pueden desincronizarse de Git si no se hace `git checkout` o `git pull`
