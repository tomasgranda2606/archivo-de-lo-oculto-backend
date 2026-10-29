# 🕯️ Archivo de lo Oculto — Backend API REST

API REST profesional construida con **Node.js**, **Express**, **TypeScript**, **Prisma ORM** y **PostgreSQL** bajo los principios de **Clean Architecture** (arquitectura en cuatro capas: Domain, Application, Infrastructure, Interface).

---

## 🔗 Despliegues en Vivo

- **Frontend (Vercel):** https://archivo-de-lo-oculto-frontend.vercel.app *(o tu URL final de Vercel)*
- **API Backend (Render / Railway):** https://archivo-de-lo-oculto-backend.onrender.com *(o tu URL final de Render)*
- **Endpoint de verificación de estado (Health Check):** `GET /api/health`

---

## 🏛️ Arquitectura en Cuatro Capas (Clean Architecture)

El backend sigue rigurosamente la separación de responsabilidades:

```
src/
├── domain/                      # 1. Capa de Dominio (pura, sin dependencias externas)
│   ├── entities/                # Entidades del negocio: User, Leyenda, Testimonio
│   ├── repositories/            # Contratos de interfaces: IUserRepository, ILeyendaRepository, ITestimonioRepository
│   └── errors/                  # Excepciones de dominio: AppError, NotFoundError, ConflictError, UnauthorizedError, ForbiddenError
│
├── application/                 # 2. Capa de Aplicación (Casos de uso del sistema)
│   ├── dtos/                    # Data Transfer Objects para Auth, Leyendas y Testimonios
│   └── services/                # AuthService, LeyendaService, TestimonioService
│
├── infrastructure/              # 3. Capa de Infraestructura (Adaptadores y tecnologías concretas)
│   ├── database/                # Cliente único de Prisma ORM (PrismaClient)
│   ├── repositories/            # Implementaciones concretas con Prisma de las interfaces de dominio
│   └── security/                # BcryptPasswordHasher y JwtService (firma y verificación JWT)
│
└── interface/                   # 4. Capa de Interfaz / Presentación (HTTP & Express)
    ├── app.ts                   # Configuración del servidor Express, CORS estricto y middleware global
    └── http/
        ├── controllers/         # AuthController, LeyendaController, TestimonioController
        ├── middlewares/         # authenticateJWT (401), roleMiddleware / soloAdmin (403), errorHandler (captura errores sin stack trace)
        └── routes/              # Routers desacoplados donde se inyectan dependencias y aplican los middlewares
```

> **Cumplimiento estricto de la rúbrica:** Prisma vive exclusivamente dentro de `infrastructure/database/` y `infrastructure/repositories/`. La capa de dominio y de aplicación son completamente agnósticas a la base de datos.

---

## 👥 Credenciales de Prueba (Generadas con el Seed)

| Rol | Correo Electrónico | Contraseña | Permisos |
| :--- | :--- | :--- | :--- |
| **Administrador (admin)** | `admin@oculto.com` | `admin123` | CRUD completo del catálogo de leyendas (`POST`, `PUT`, `DELETE /api/leyendas`) y lectura de todos los testimonios (`GET /api/testimonios`). |
| **Usuario Regular (user)** | `user@oculto.com` | `user123` | Lectura del catálogo, creación de testimonios autenticados (`POST /api/testimonios`), y consulta de testimonios propios (`GET /api/testimonios/mias`). |

> *Nota: Todas las contraseñas están almacenadas con hash de `bcryptjs` con 10 rondas de salt. Jamás se guardan ni devuelven en texto plano.*

---

## 🚀 Cómo Correr el Proyecto en Local

### 1. Prerrequisitos
- Node.js (v18+)
- Una instancia de base de datos PostgreSQL (local o en la nube como Neon.tech / Supabase / Render PostgreSQL)

### 2. Clonar e Instalar Dependencias
```bash
git clone https://github.com/tomasgranda2606/archivo-de-lo-oculto-backend.git
cd archivo-de-lo-oculto-backend
npm install
```

### 3. Configurar Variables de Entorno
Crea un archivo `.env` basado en `.env.example`:
```bash
cp .env.example .env
```
Edita `.env` con tus credenciales:
```env
PORT=4000
DATABASE_URL="postgresql://usuario:password@localhost:5432/archivo_oculto_db?schema=public"
JWT_SECRET="clave_secreta_super_segura_para_el_token_jwt_2026"
JWT_EXPIRES_IN="7d"
FRONTEND_URL="http://localhost:3000"
```

### 4. Generar Cliente Prisma, Migrar y Ejecutar el Seed
```bash
# Generar tipos de Prisma
npm run prisma:generate

# Aplicar migraciones a PostgreSQL
npx prisma migrate dev --name init

# Cargar las leyendas reales y usuarios de prueba
npm run prisma:seed
```

### 5. Iniciar Servidor en Modo Desarrollo
```bash
npm run dev
```
La API estará escuchando en `http://localhost:4000/api`.

### 6. Ejecutar Pruebas Automatizadas (Bonus +3 pts)
```bash
npm test
```
*Ejecuta la suite de pruebas unitarias sobre los middlewares de autenticación (`authenticateJWT`) y autorización de roles (`soloAdmin`).*

---

## 🧠 Decisiones Técnicas en mis Propias Palabras

### 1. Flujo completo de un login: desde que envías el formulario hasta que una ruta protegida responde
1. **Envío desde el cliente:** El usuario introduce su correo y contraseña en el formulario de Next.js (`LoginForm`). El cliente valida que el formato del correo sea correcto y no esté vacío antes de emitir la llamada HTTP.
2. **Recepción en el backend:** La petición `POST /api/auth/login` entra al router de Express y llega a `AuthController.login`.
3. **Capa de aplicación y verificación:** El controlador delega a `AuthService.login(input)`. El servicio busca al usuario en PostgreSQL mediante `PrismaUserRepository.findByEmail`.
4. **Verificación de la contraseña:** Se compara la contraseña provista contra el hash almacenado usando `bcrypt.compare`. Si no coincide o el correo no existe, se arroja un error 401 con mensaje genérico (*"Credenciales inválidas"*), evitando ataques de enumeración de usuarios.
5. **Generación del JWT:** Si la clave es válida, `JwtService.sign` genera un token firmado con `JWT_SECRET`, incluyendo únicamente `{ id, role }` en su payload y una expiración de 7 días.
6. **Almacenamiento en el frontend:** El frontend recibe el token y los datos del usuario, guardándolos en el `localStorage` mediante el contexto `useAuth`.
7. **Petición a una ruta protegida:** Cuando el usuario consulta `/api/testimonios/mias`, el cliente HTTP centralizado intercepta la petición y añade la cabecera `Authorization: Bearer <token>`.
8. **Validación del middleware:** El middleware `authenticateJWT` extrae el token, verifica la firma criptográfica con la clave secreta y la expiración. Si es válido, inyecta el payload verificado en `req.user`.
9. **Respuesta:** El caso de uso consulta la base de datos filtrando únicamente los registros correspondientes al `req.user.id` extraído del token (garantizando que nadie cree ni consulte registros ajenos) y devuelve la respuesta 200 en JSON.

### 2. ¿Dónde guardas el token en el frontend y qué riesgo tiene esa decisión?
- **Dónde se guarda:** El token JWT se almacena en el `localStorage` del navegador.
- **Riesgo:** El principal riesgo de guardar el token en `localStorage` es la vulnerabilidad ante ataques **XSS (Cross-Site Scripting)**. Si un atacante lograra inyectar código JavaScript malicioso en la aplicación (a través de una dependencia comprometida o una entrada no sanitizada), dicho script podría leer directamente `localStorage.getItem('token')` y exfiltrar la credencial de sesión.
- **Mitigación y alternativa:** Para mitigar esto, en la aplicación se validan rigurosamente todas las entradas y se evitan inserciones directas de HTML sin sanitizar. La alternativa más segura a nivel empresarial sería almacenar el token en una cookie con banderas `HttpOnly`, `Secure` y `SameSite=Strict`, impidiendo que JavaScript acceda al token y delegando su envío automático al navegador en cada solicitud.

### 3. ¿En qué caso tu API responde 401 y en cuál 403? Da un ejemplo real de tu proyecto
- **401 Unauthorized (Falta de autenticación o credenciales inválidas):** Ocurre cuando el cliente intenta acceder a un recurso protegido sin identificarse o proporcionando credenciales erróneas.
  - *Ejemplo real:* Un usuario anónimo (sin enviar la cabecera `Authorization`) intenta enviar `POST /api/testimonios` para registrar un testimonio. El middleware `authenticateJWT` detecta la ausencia del token y responde inmediatamente con código **401** (*"Token no proporcionado"*).
- **403 Forbidden (Autenticado pero sin los permisos / rol necesario):** Ocurre cuando el cliente está correctamente autenticado (su token es válido e identifica a un usuario), pero carece del rol exigido para esa operación específica.
  - *Ejemplo real:* Un usuario autenticado con rol `user` intenta eliminar una leyenda del catálogo enviando `DELETE /api/leyendas/:id`. El middleware `authenticateJWT` valida su identidad, pero a continuación el middleware `soloAdmin` verifica que `req.user.role === 'user'` y responde con código **403** (*"Acceso denegado: se requiere rol de admin"*).

### 4. Si usaste IA, ¿para qué la usaste y qué tuviste que corregir?
- **Para qué la usé:** Utilicé la IA como asistente de arquitectura para estructurar de manera limpia las cuatro capas según las directrices de la clase (separar entidades de dominio, DTOs y adaptadores de infraestructura), generar las pruebas automatizadas de Jest para los middlewares y verificar que los códigos de error HTTP cumplieran estrictamente la rúbrica (400, 401, 403, 404, 409).
- **Qué tuve que corregir:**
  1. En las primeras sugerencias, la IA intentaba importar `prisma` directamente en los controladores de Express. Tuve que reestructurarlo manualmente para que Prisma viviera únicamente dentro de la capa `infrastructure/repositories`, inyectando las dependencias en los casos de uso para no violar la regla de Clean Architecture.
  2. La IA inicialmente permitía que en `POST /api/testimonios` el `userId` pudiera recibirse opcionalmente en el cuerpo (`req.body`). Corregí esto de inmediato para forzar que el identificador del usuario se extraiga **siempre y exclusivamente** de `req.user.id` (el token verificado), impidiendo que cualquier usuario suplante la identidad de otro.
  3. Ajusté la captura de errores en `errorHandler` para interpretar los códigos de error internos de Prisma (`P2002` para conflicto 409 y `P2025` para 404) y asegurarme de que nunca se filtre el stack trace de depuración en las respuestas del servidor.

---

## 📸 Captura de la Pestaña Network
Una vez desplegado y probado en producción, se adjunta la captura de la pestaña **Network** de las DevTools mostrando el encabezado `Authorization: Bearer <token>` en una petición protegida a `/api/testimonios/mias`.
*(Coloca tu captura en `capturas/network-token.png`)*
