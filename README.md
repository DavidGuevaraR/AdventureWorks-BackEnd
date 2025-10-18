# AdventureWorks Backend

Servicio **Backend** del proyecto AdventureWorks.

## 🚀 Puesta en marcha en local

### Requisitos
- **Node.js** 18+ (recomendado LTS)
- **Yarn** instalado (o `corepack` en Windows)
- **Docker** y **Docker Compose** (para ejecución en contenedores)


## 📦 Instalación de dependencias

**Opción estándar (macOS/Linux/Windows):**
```bash
yarn install
```

**Si estás en Windows y usas Corepack:**
```bash
corepack yarn install
```

> **¿Para qué sirve?**  
> Instala todas las dependencias definidas en `package.json` para que el proyecto pueda compilar y ejecutarse.

---

## ▶️ Modo desarrollo

**Opción estándar:**
```bash
yarn dev
```

**Con Corepack (Windows):**
```bash
corepack yarn dev
```

> **¿Para qué sirve?**  
> Inicia el servidor en modo desarrollo, normalmente con *hot reload* (reinicia al detectar cambios). Ideal para programar y probar endpoints rápidamente.

---

## 🚀 Modo producción (local)

**Opción estándar:**
```bash
yarn start
```

**Con Corepack (Windows):**
```bash
corepack yarn start
```

> **¿Para qué sirve?**  
> Arranca la aplicación “como en producción”. Usualmente ejecuta el código transpilado/compilado sin herramientas de recarga en caliente.

---

## 🐳 Ejecutar con Docker

### Levantar (build + up en segundo plano)
```bash
docker compose up -d --build
```
> **¿Para qué sirve?**  
> Construye las imágenes (si cambiaron) y levanta los contenedores en *background* (`-d`). Útil para levantar base de datos, backend y otros servicios definidos en `docker-compose.yml`.

### Apagar y limpiar contenedores
```bash
docker compose down
```
> **¿Para qué sirve?**  
> Detiene y elimina los contenedores (no borra las imágenes ni volúmenes por defecto).

> **Notas:**  
> - Asegúrate de tener un `Dockerfile` y un `docker-compose.yml` configurados.  
> - Si necesitas recrear desde cero, puedes añadir `--volumes` para borrar volúmenes (¡cuidado con los datos!).

---

## 🌱 Poblar datos de prueba (seed)
```bash
npm run seed
```
> **¿Para qué sirve?**  
> Ejecuta un script que inserta **datos iniciales/de prueba** en la base de datos (usuario administrador). Útil para tener un entorno listo rápidamente.  
> - Requiere que la BD esté accesible (ya sea local o en Docker).  


---

## 📜 Scripts útiles (resumen)
```bash
yarn dev        # Servidor en modo desarrollo con recarga
yarn start      # Ejecuta la app en modo producción (local)
npm run seed    # Inserta datos iniciales en la BD

docker compose up -d --build  # Construye y levanta contenedores en background
docker compose down           # Detiene y elimina contenedores
```

> Con Corepack en Windows antepone `corepack` a los comandos `yarn`:
```bash
corepack yarn dev
corepack yarn start
corepack yarn install
```

---

## 🛠️ Problemas comunes

- **“Command ‘yarn’ not found”**  
  Activa Corepack:
  ```bash
  corepack enable
  ```

- **Conexión a la BD falla en Docker**  
  Verifica variables en `docker-compose.yml` y `.env`. Confirma que el servicio de BD expone el puerto correcto y que `DATABASE_URL` apunta al host adecuado (`localhost` fuera de Docker, nombre del servicio dentro de la red de Docker).

- **El seeder falla (bcrypt u otra dependencia no encontrada)**  
  Asegúrate de haber corrido `yarn install` antes y que la versión de Node sea compatible. Si la dependencia es nativa (ej. `bcrypt`), preferible instalarla antes de construir la imagen o usar alternativas como `bcryptjs` si tu proyecto lo permite.

---
