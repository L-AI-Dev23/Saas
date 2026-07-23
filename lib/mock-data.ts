// Datos de muestra — todo estático, solo para maquetar la UI (sin conexión a Supabase todavía).

import { subDays, format } from "date-fns";
import { es } from "date-fns/locale";

// Serie de 30 días con fechas reales (relativas a hoy) para el gráfico de contactos nuevos.
// Cuando se conecte a Supabase, esto se reemplaza por un query agregado por día.
const contactosPorDiaValores = [
  14, 22, 18, 30, 26, 34, 28, 40, 33, 45, 38, 52, 41, 47, 55, 49, 60, 58, 63,
  57, 66, 61, 70, 68, 75, 72, 80, 77, 85, 90,
];

export const contactosNuevosPorDia = contactosPorDiaValores.map((valor, i) => {
  const fecha = subDays(new Date(), contactosPorDiaValores.length - 1 - i);
  return {
    fecha: format(fecha, "yyyy-MM-dd"),
    fechaCorta: format(fecha, "d MMM", { locale: es }),
    contactos: valor,
  };
});

export const kpisDashboard = [
  { label: "Leads nuevos (7 días)", value: "128", delta: "+18%" },
  { label: "Mensajes respondidos", value: "946", delta: "+6%" },
  { label: "Ventas de catálogo", value: "S/ 4,320", delta: "+12%" },
  { label: "Campañas activas", value: "5", delta: "0%" },
];

// Nota: por ahora cada item enlaza a la vista del módulo, no a la entidad exacta
// (lead/conversación/campaña puntual), porque el mock no tiene IDs reales.
// Cuando esto venga de Supabase, cada fila debería traer su propio id y el href
// apuntar directo al recurso, ej. `/home/crm/contactos/${leadId}`.
export const actividadReciente = [
  { modulo: "Chatbots", texto: "El bot “Bienvenida IG” capturó un nuevo lead", tiempo: "hace 4 min", href: "/home/crm/contactos" },
  { modulo: "Email", texto: "Campaña “Verano 2026” fue enviada a 1,204 contactos", tiempo: "hace 32 min", href: "/home/email/campanas" },
  { modulo: "CRM", texto: "María Fernández pasó a la etapa “Cliente”", tiempo: "hace 1 h", href: "/home/crm/contactos" },
  { modulo: "Automatizaciones", texto: "“Recordatorio de carrito abandonado” se ejecutó 14 veces", tiempo: "hace 2 h", href: "/home/automatizaciones/activas" },
  { modulo: "Catálogo", texto: "El producto “Curso de Excel Avanzado” alcanzó 300 vistas", tiempo: "hace 3 h", href: "/home/catalogo/productos" },
  { modulo: "Inbox", texto: "Nueva conversación esperando atención humana", tiempo: "hace 5 h", href: "/home/inbox" },
];

export const onboardingSteps = [
  { step: "connect_account", label: "Conecta tu primera cuenta (Instagram, Messenger o TikTok)", done: true, href: "/home/configuracion" },
  { step: "activate_chatbot", label: "Activa tu primer chatbot desde una plantilla", done: true, href: "/home/chatbots/plantillas" },
  { step: "add_product", label: "Agrega tu primer producto al catálogo", done: false, href: "/home/catalogo/productos" },
  { step: "first_campaign", label: "Lanza tu primera campaña", done: false, href: "/home/email/campanas" },
];

// ---------- Inbox ----------
export const conversaciones = [
  { id: 1, nombre: "Luis Ramírez", canal: "instagram", estado: "esperando_humano", ultimo: "¿Tienen el curso disponible en cuotas?", tiempo: "10:42" },
  { id: 2, nombre: "Andrea Solís", canal: "messenger", estado: "bot_activo", ultimo: "El bot está respondiendo automáticamente", tiempo: "10:20" },
  { id: 3, nombre: "Grupo Textil Rivas", canal: "tiktok", estado: "atendido_humano", ultimo: "Perfecto, gracias por la info 🙌", tiempo: "09:58" },
  { id: 4, nombre: "Camila Torres", canal: "instagram", estado: "cerrado", ultimo: "Listo, ya hice el pedido", tiempo: "Ayer" },
  { id: 5, nombre: "Jorge Paredes", canal: "messenger", estado: "esperando_humano", ultimo: "¿Hacen envíos a Arequipa?", tiempo: "Ayer" },
];

export const mensajesPorConversacion: Record<number, { id: number; from: "contact" | "bot" | "agent"; texto: string; hora: string }[]> = {
  1: [
    { id: 1, from: "contact", texto: "Hola! vi el anuncio del curso", hora: "10:38" },
    { id: 2, from: "bot", texto: "¡Hola Luis! Sí, tenemos el curso disponible 🙌 ¿quieres que te cuente los detalles?", hora: "10:39" },
    { id: 3, from: "contact", texto: "¿Tienen el curso disponible en cuotas?", hora: "10:42" },
  ],
  2: [
    { id: 1, from: "contact", texto: "Hola, quiero info del curso de Excel", hora: "10:15" },
    { id: 2, from: "bot", texto: "¡Hola Andrea! Claro, el curso de Excel Avanzado dura 6 semanas y cuesta S/ 350. ¿Te comparto el temario?", hora: "10:16" },
    { id: 3, from: "contact", texto: "El bot está respondiendo automáticamente", hora: "10:20" },
  ],
  3: [
    { id: 1, from: "contact", texto: "Buenas, necesitamos cotización para 20 personas", hora: "09:40" },
    { id: 2, from: "agent", texto: "¡Hola! Con gusto, para grupos de 20+ el precio es S/ 280 por persona con certificado incluido.", hora: "09:52" },
    { id: 3, from: "contact", texto: "Perfecto, gracias por la info 🙌", hora: "09:58" },
  ],
  4: [
    { id: 1, from: "contact", texto: "Hola, quiero comprar el curso de Excel", hora: "Ayer 16:02" },
    { id: 2, from: "agent", texto: "¡Genial! Te comparto el link de pago: wa.me/pago-curso-excel", hora: "Ayer 16:05" },
    { id: 3, from: "contact", texto: "Listo, ya hice el pedido", hora: "Ayer 16:10" },
  ],
  5: [
    { id: 1, from: "contact", texto: "Hola, ¿tienen el curso de Excel?", hora: "Ayer 14:20" },
    { id: 2, from: "bot", texto: "¡Hola Jorge! Sí, está disponible. ¿Quieres que te pase los detalles?", hora: "Ayer 14:21" },
    { id: 3, from: "contact", texto: "¿Hacen envíos a Arequipa?", hora: "Ayer 14:30" },
  ],
};

// ---------- Email ----------
export const emailKpis = [
  { label: "Enviados (mes)", value: "8,412", href: "#envios-chart" },
  { label: "Open rate promedio", value: "38%", href: "#envios-chart" },
  { label: "Click rate promedio", value: "11%", href: "#envios-chart" },
  { label: "Contactos suscritos", value: "3,096", href: "/home/email/listas" },
];

// Serie de 30 días con fechas reales para el gráfico de envíos del dashboard.
// Cuando se conecte al proveedor de email, esto se reemplaza por un query agregado por día.
const enviosPorDiaValores = [
  180, 240, 150, 290, 380, 220, 310, 400, 210, 340, 460, 350, 300, 420, 260,
  390, 480, 330, 410, 500, 280, 440, 520, 360, 450, 530, 310, 470, 540, 420,
];

export const emailEnviosPorDia = enviosPorDiaValores.map((valor, i) => {
  const fecha = subDays(new Date(), enviosPorDiaValores.length - 1 - i);
  return {
    fecha: format(fecha, "yyyy-MM-dd"),
    fechaCorta: format(fecha, "d MMM", { locale: es }),
    envios: valor,
  };
});

export const emailListas = [
  { id: 1, nombre: "Newsletter general", tipo: "Manual", contactos: 2140, actualizado: "hace 2 días" },
  { id: 2, nombre: "No compró en 30 días", tipo: "Dinámica", contactos: 512, actualizado: "hace 6 h" },
  { id: 3, nombre: "Clientes VIP", tipo: "Manual", contactos: 88, actualizado: "hace 1 semana" },
  { id: 4, nombre: "Abrió el último correo", tipo: "Dinámica", contactos: 356, actualizado: "hace 6 h" },
];

export const emailPlantillas = [
  { id: 1, nombre: "Bienvenida", editado: "hace 3 días" },
  { id: 2, nombre: "Carrito abandonado", editado: "hace 1 semana" },
  { id: 3, nombre: "Newsletter mensual", editado: "hace 2 semanas" },
  { id: 4, nombre: "Agradecimiento post-compra", editado: "hace 1 mes" },
];

export const emailAutomatizaciones = [
  { id: 1, nombre: "Bienvenida a nuevo suscriptor", evento: "Contacto nuevo", plantilla: "Bienvenida", estado: "Activa" },
  { id: 2, nombre: "Recordatorio de carrito", evento: "Carrito abandonado", plantilla: "Carrito abandonado", estado: "Activa" },
  { id: 3, nombre: "Agradecimiento de compra", evento: "Compra realizada", plantilla: "Agradecimiento post-compra", estado: "Pausada" },
];

export const emailCampanas = [
  { id: 1, nombre: "Verano 2026", lista: "Newsletter general", estado: "Enviada", fecha: "12 jul 2026" },
  { id: 2, nombre: "Reactivación clientes inactivos", lista: "No compró en 30 días", estado: "Programada", fecha: "22 jul 2026" },
  { id: 3, nombre: "Lanzamiento curso nuevo", lista: "Clientes VIP", estado: "Borrador", fecha: "—" },
];

// ---------- Automatizaciones ----------
export const automatizacionesKpis = [
  { label: "Automatizaciones activas", value: "9", href: "/home/automatizaciones/activas" },
  { label: "Ejecuciones (mes)", value: "2,318", href: "#ejecuciones-chart" },
  { label: "Tasa de éxito", value: "97.4%", href: "#ejecuciones-chart" },
];

// Serie de 30 días de ejecuciones (exitosas vs fallidas) para el gráfico del dashboard.
// Cuando se conecte a Trigger.dev/Supabase, esto sale de un query agregado por día.
const ejecucionesPorDiaValores: [number, number][] = [
  [58, 2], [64, 1], [70, 3], [61, 2], [75, 1], [80, 4], [72, 2],
  [85, 1], [90, 3], [78, 2], [95, 1], [88, 2], [102, 3], [97, 1],
  [110, 2], [105, 4], [99, 1], [115, 2], [120, 1], [108, 3],
  [125, 2], [130, 1], [118, 2], [135, 3], [128, 1], [140, 2],
  [133, 1], [145, 3], [138, 2], [150, 1],
];

export const automatizacionesEjecucionesPorDia = ejecucionesPorDiaValores.map(([exitosas, fallidas], i) => {
  const fecha = subDays(new Date(), ejecucionesPorDiaValores.length - 1 - i);
  return {
    fecha: format(fecha, "yyyy-MM-dd"),
    fechaCorta: format(fecha, "d MMM", { locale: es }),
    exitosas,
    fallidas,
  };
});

// Nota: por ahora cada fila enlaza a la vista de reglas activas, no a la ejecución
// puntual (el mock no tiene un log de ejecuciones con id propio). Cuando esto
// venga de Trigger.dev, el href debería apuntar directo al log de esa corrida.
export const automatizacionesFallidas = [
  { id: 1, nombre: "Etiquetado interés curso", motivo: "Contacto sin email válido", fecha: "hoy 09:14", href: "/home/automatizaciones/activas" },
  { id: 2, nombre: "Recordatorio de carrito", motivo: "Plantilla de email eliminada", fecha: "ayer 22:03", href: "/home/automatizaciones/activas" },
];

export const automatizacionesPlantillas = [
  { id: 1, nombre: "Recordatorio de carrito abandonado", desc: "Reengancha contactos que dejaron un producto sin comprar.", icono: "carrito", evento: "Carrito abandonado", accion: "Enviar email" },
  { id: 2, nombre: "Bienvenida a nuevo contacto", desc: "Envía un mensaje automático cuando llega un lead nuevo.", icono: "bienvenida", evento: "Contacto nuevo", accion: "Enviar email" },
  { id: 3, nombre: "Seguimiento post-venta", desc: "Pide feedback unos días después de una compra.", icono: "seguimiento", evento: "Compra realizada", accion: "Esperar X días" },
  { id: 4, nombre: "Etiquetado por interés", desc: "Agrega un tag automático según palabras clave del contacto.", icono: "etiqueta", evento: "Etiqueta agregada", accion: "Agregar etiqueta" },
];

export const eventTypes = [
  { key: "purchase_completed", label: "Compra realizada", desc: "Se dispara cuando un contacto completa una compra.", modulos: ["Automatizaciones", "CRM"] },
  { key: "tag_added", label: "Etiqueta agregada", desc: "Se dispara al agregar un tag a un contacto.", modulos: ["Automatizaciones", "CRM"] },
  { key: "contact_created", label: "Contacto nuevo", desc: "Se dispara al crearse un contacto nuevo.", modulos: ["Automatizaciones", "Chatbots", "CRM"] },
  { key: "form_submitted", label: "Formulario enviado", desc: "Se dispara cuando se envía un formulario de captura.", modulos: ["Automatizaciones", "Chatbots"] },
  { key: "cart_abandoned", label: "Carrito abandonado", desc: "Se dispara cuando un visitante no completa su compra.", modulos: ["Automatizaciones", "Email"] },
];

export const automatizacionesActivas = [
  { id: 1, nombre: "Recordatorio de carrito", evento: "Carrito abandonado", accion: "Enviar email + esperar 24h", estado: true },
  { id: 2, nombre: "Bienvenida general", evento: "Contacto nuevo", accion: "Agregar tag “nuevo” + enviar email", estado: true },
  { id: 3, nombre: "Seguimiento post-venta", evento: "Compra realizada", accion: "Esperar 3 días + enviar email", estado: true },
  { id: 4, nombre: "Etiquetado interés curso", evento: "Formulario enviado", accion: "Agregar tag “interesado-curso”", estado: false },
  { id: 5, nombre: "Notificación venta nueva", evento: "Compra realizada", accion: "Crear notificación interna", estado: true },
  { id: 6, nombre: "Alerta carrito VIP", evento: "Carrito abandonado", accion: "Agregar tag “vip” + esperar 2h", estado: true },
  { id: 7, nombre: "Bienvenida chatbot", evento: "Contacto nuevo", accion: "Enviar email de bienvenida", estado: true },
  { id: 8, nombre: "Etiqueta interesado curso", evento: "Etiqueta agregada", accion: "Enviar email + esperar 24h", estado: true },
  { id: 9, nombre: "Seguimiento formulario", evento: "Formulario enviado", accion: "Esperar 1 día + enviar email", estado: true },
];

// ---------- Chatbots ----------
export const chatbotsKpis = [
  { label: "Bots activos", value: "6", href: "/home/chatbots/activos" },
  { label: "Mensajes del mes", value: "13,380", href: "#mensajes-chart" },
  { label: "Contactos capturados", value: "834", href: "/home/crm/contactos" },
];

// Serie de 30 días con fechas reales para el gráfico de mensajes del dashboard.
// Cuando se conecte a Supabase, esto se reemplaza por un query agregado por día.
const mensajesPorDiaValores = [
  260, 310, 290, 340, 300, 380, 350, 420, 360, 400, 440, 380, 460, 410, 500,
  430, 480, 520, 450, 540, 490, 560, 510, 580, 530, 600, 560, 620, 590, 640,
];

export const chatbotsMensajesPorDia = mensajesPorDiaValores.map((valor, i) => {
  const fecha = subDays(new Date(), mensajesPorDiaValores.length - 1 - i);
  return {
    fecha: format(fecha, "yyyy-MM-dd"),
    fechaCorta: format(fecha, "d MMM", { locale: es }),
    mensajes: valor,
  };
});

export const chatbotTemplates = [
  { id: "comment_to_dm", nombre: "Comentario → DM", desc: "Responde por DM a quien comente en tu post.", redes: ["Instagram"] },
  { id: "keyword_reply", nombre: "Palabra clave", desc: "Responde automáticamente según palabras clave en DM.", redes: ["Instagram", "Messenger"] },
  { id: "welcome", nombre: "Bienvenida", desc: "Saluda a todo nuevo seguidor o contacto.", redes: ["Instagram", "Messenger"] },
  { id: "catalog_flow", nombre: "Flujo con catálogo", desc: "Muestra productos del catálogo dentro del chat.", redes: ["Instagram", "TikTok"] },
  { id: "data_capture", nombre: "Captura de datos", desc: "Recolecta datos del contacto y los manda al CRM.", redes: ["Instagram", "Messenger", "TikTok"] },
];

export const chatbotsActivos = [
  { id: 1, nombre: "Bienvenida IG", tipo: "Bienvenida", templateId: "welcome", red: "Instagram", estado: "Activo", activo: true, mensajes: 3120 },
  { id: 2, nombre: "Promo comentarios reel", tipo: "Comentario → DM", templateId: "comment_to_dm", red: "Instagram", estado: "Activo", activo: true, mensajes: 4890 },
  { id: 3, nombre: "FAQ palabra clave", tipo: "Palabra clave", templateId: "keyword_reply", red: "Messenger", estado: "Activo", activo: true, mensajes: 2210 },
  { id: 4, nombre: "Catálogo TikTok Shop", tipo: "Flujo con catálogo", templateId: "catalog_flow", red: "TikTok", estado: "Necesita atención", activo: true, mensajes: 640 },
  { id: 5, nombre: "Captura leads curso", tipo: "Captura de datos", templateId: "data_capture", red: "Instagram", estado: "Activo", activo: true, mensajes: 1620 },
  { id: 6, nombre: "Bienvenida Messenger", tipo: "Bienvenida", templateId: "welcome", red: "Messenger", estado: "Activo", activo: true, mensajes: 900 },
];

export const chatbotCampanas = [
  { id: 1, nombre: "Campaña Verano 2026", botIds: [1, 2, 5], inicio: "2026-07-01", fin: "2026-08-31" },
  { id: 2, nombre: "Lanzamiento curso Excel", botIds: [3, 5], inicio: "2026-07-15", fin: "2026-07-30" },
];

// ---------- CRM ----------
export const crmKpis = [
  { label: "Leads nuevos (semana)", value: "42", href: "/home/crm/contactos" },
  { label: "Pasaron a Cliente (mes)", value: "17", href: "/home/crm/contactos" },
  { label: "Tasa de conversión", value: "14.2%", href: "#leads-chart" },
];

// Nota: "tiempo" es solo para la vista de actividad reciente del dashboard;
// con datos reales vendría de la fecha de última interacción del contacto.
export const contactos = [
  { id: 1, nombre: "María Fernández", email: "maria.fernandez@gmail.com", telefono: "+51 987 654 321", origen: "chatbot", etapa: "cliente", tags: ["curso-excel", "vip"], tiempo: "hace 25 min" },
  { id: 2, nombre: "Luis Ramírez", email: "luis.ramirez@gmail.com", telefono: "+51 954 112 233", origen: "chatbot", etapa: "en_conversacion", tags: ["interesado-curso"], tiempo: "hace 6 min" },
  { id: 3, nombre: "Andrea Solís", email: "andrea.solis@hotmail.com", telefono: "+51 944 221 987", origen: "email", etapa: "nuevo", tags: [], tiempo: "hace 1 h" },
  { id: 4, nombre: "Jorge Paredes", email: "jorge.paredes@gmail.com", telefono: "+51 933 445 112", origen: "manual", etapa: "en_conversacion", tags: ["arequipa"], tiempo: "hace 3 h" },
  { id: 5, nombre: "Camila Torres", email: "camila.torres@gmail.com", telefono: "+51 922 887 665", origen: "catalogo", etapa: "cliente", tags: ["curso-excel"], tiempo: "hace 5 h" },
  { id: 6, nombre: "Grupo Textil Rivas", email: "contacto@textilrivas.com", telefono: "+51 911 223 344", origen: "chatbot", etapa: "inactivo", tags: ["b2b"], tiempo: "hace 1 día" },
];

export const crmTags = [
  { id: 1, nombre: "curso-excel", color: "#f65858", contactos: 2 },
  { id: 2, nombre: "vip", color: "#00c98d", contactos: 1 },
  { id: 3, nombre: "interesado-curso", color: "#009fc1", contactos: 1 },
  { id: 4, nombre: "arequipa", color: "#ca8a04", contactos: 1 },
  { id: 5, nombre: "b2b", color: "#6b7280", contactos: 1 },
];

// ---------- Catálogo ----------
export const catalogoKpis = [
  { label: "Visitas (mes)", value: "6,420" },
  { label: "Clics a contacto", value: "312" },
  { label: "Productos activos", value: "24" },
];

export const productos = [
  { id: 1, nombre: "Curso de Excel Avanzado", precio: "S/ 129", categoria: "Cursos", stock: null, activo: true },
  { id: 2, nombre: "Plantilla de finanzas personales", precio: "S/ 39", categoria: "Plantillas", stock: null, activo: true },
  { id: 3, nombre: "Mentoría 1:1 (1 hora)", precio: "S/ 199", categoria: "Servicios", stock: 5, activo: true },
  { id: 4, nombre: "Curso de Power BI", precio: "S/ 149", categoria: "Cursos", stock: null, activo: false },
];

export const categorias = [
  { id: 1, nombre: "Cursos", padre: null, productos: 2 },
  { id: 2, nombre: "Plantillas", padre: null, productos: 1 },
  { id: 3, nombre: "Servicios", padre: null, productos: 1 },
  { id: 4, nombre: "Excel", padre: "Cursos", productos: 1 },
];

// ---------- Configuración ----------
export const cuentasConectadas = [
  { plataforma: "Instagram", nombre: "@codew.pe", estado: "Conectada" },
  { plataforma: "Messenger", nombre: "Codew Agencia", estado: "Conectada" },
  { plataforma: "TikTok", nombre: null, estado: "No conectada" },
];

export const equipo = [
  { id: 1, nombre: "Luis Ramírez", email: "luis@codew.pe", rol: "admin", modulos: ["Todos"], estado: "Activo" },
  { id: 2, nombre: "Fabiana Quispe", email: "fabiana@codew.pe", rol: "empleado", modulos: ["Inbox", "CRM"], estado: "Activo" },
  { id: 3, nombre: "Renzo Ibáñez", email: "renzo@codew.pe", rol: "empleado", modulos: ["Chatbots", "Email"], estado: "Invitado" },
];

export const notificacionesConfig = [
  { evento: "Nuevo lead", inapp: true, email: true },
  { evento: "Error de conexión de cuenta", inapp: true, email: true },
  { evento: "Campaña finalizada", inapp: true, email: false },
  { evento: "Límite de uso alcanzado", inapp: true, email: true },
];

export const usuarioActual = { nombre: "Luis Ramírez", iniciales: "L", negocio: "Codew Agencia" };

export const planActual = { nombre: "Pro", precio: "S/ 49/mes", renueva: "Renueva el 01 agosto 2026" };

export const usoPlan = [
  { metrica: "Contactos", usado: 1240, limite: 2000 },
  { metrica: "Mensajes (mes)", usado: 3820, limite: 5000 },
  { metrica: "Cuentas conectadas", usado: 2, limite: 3 },
  { metrica: "Campañas (mes)", usado: 4, limite: 10 },
];

export const planes = [
  { nombre: "Starter", precio: "S/ 0", contactos: 200, mensajes: 500, cuentas: 1 },
  { nombre: "Pro", precio: "S/ 49", contactos: 2000, mensajes: 5000, cuentas: 3, actual: true },
  { nombre: "Business", precio: "S/ 99", contactos: 10000, mensajes: 20000, cuentas: 5 },
];

export const historialPagos = [
  { fecha: "01 jul 2026", monto: "S/ 49.00", estado: "Aprobado" },
  { fecha: "01 jun 2026", monto: "S/ 49.00", estado: "Aprobado" },
  { fecha: "01 may 2026", monto: "S/ 49.00", estado: "Aprobado" },
];