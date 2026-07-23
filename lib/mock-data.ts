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

export const mensajesConversacion1 = [
  { id: 1, from: "contact", texto: "Hola! vi el anuncio del curso", hora: "10:38" },
  { id: 2, from: "bot", texto: "¡Hola Luis! Sí, tenemos el curso disponible 🙌 ¿quieres que te cuente los detalles?", hora: "10:39" },
  { id: 3, from: "contact", texto: "¿Tienen el curso disponible en cuotas?", hora: "10:42" },
];

// ---------- Email ----------
export const emailKpis = [
  { label: "Enviados (mes)", value: "8,412" },
  { label: "Open rate promedio", value: "38%" },
  { label: "Click rate promedio", value: "11%" },
  { label: "Contactos suscritos", value: "3,096" },
];

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
  { label: "Automatizaciones activas", value: "9" },
  { label: "Ejecuciones (mes)", value: "2,318" },
  { label: "Tasa de éxito", value: "97.4%" },
];

export const automatizacionesPlantillas = [
  { id: 1, nombre: "Recordatorio de carrito abandonado", desc: "Reengancha contactos que dejaron un producto sin comprar." },
  { id: 2, nombre: "Bienvenida a nuevo contacto", desc: "Envía un mensaje automático cuando llega un lead nuevo." },
  { id: 3, nombre: "Seguimiento post-venta", desc: "Pide feedback unos días después de una compra." },
  { id: 4, nombre: "Etiquetado por interés", desc: "Agrega un tag automático según palabras clave del contacto." },
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
];

// ---------- Chatbots ----------
export const chatbotsKpis = [
  { label: "Bots activos", value: "6" },
  { label: "Mensajes del mes", value: "12,480" },
  { label: "Contactos capturados", value: "834" },
];

export const chatbotTemplates = [
  { id: "comment_to_dm", nombre: "Comentario → DM", desc: "Responde por DM a quien comente en tu post." },
  { id: "keyword_reply", nombre: "Palabra clave", desc: "Responde automáticamente según palabras clave en DM." },
  { id: "welcome", nombre: "Bienvenida", desc: "Saluda a todo nuevo seguidor o contacto." },
  { id: "catalog_flow", nombre: "Flujo con catálogo", desc: "Muestra productos del catálogo dentro del chat." },
  { id: "data_capture", nombre: "Captura de datos", desc: "Recolecta datos del contacto y los manda al CRM." },
];

export const chatbotsActivos = [
  { id: 1, nombre: "Bienvenida IG", tipo: "Bienvenida", red: "Instagram", estado: "Activo", mensajes: 3120 },
  { id: 2, nombre: "Promo comentarios reel", tipo: "Comentario → DM", red: "Instagram", estado: "Activo", mensajes: 4890 },
  { id: 3, nombre: "FAQ palabra clave", tipo: "Palabra clave", red: "Messenger", estado: "Activo", mensajes: 2210 },
  { id: 4, nombre: "Catálogo TikTok Shop", tipo: "Flujo con catálogo", red: "TikTok", estado: "Necesita atención", mensajes: 640 },
  { id: 5, nombre: "Captura leads curso", tipo: "Captura de datos", red: "Instagram", estado: "Activo", mensajes: 1620 },
];

export const chatbotCampanas = [
  { id: 1, nombre: "Campaña Verano 2026", bots: 3, inicio: "01 jul 2026", fin: "31 ago 2026" },
  { id: 2, nombre: "Lanzamiento curso Excel", bots: 2, inicio: "15 jul 2026", fin: "30 jul 2026" },
];

// ---------- CRM ----------
export const crmKpis = [
  { label: "Leads nuevos (semana)", value: "42" },
  { label: "Pasaron a Cliente (mes)", value: "17" },
  { label: "Tasa de conversión", value: "14.2%" },
];

export const contactos = [
  { id: 1, nombre: "María Fernández", email: "maria.fernandez@gmail.com", telefono: "+51 987 654 321", origen: "chatbot", etapa: "cliente", tags: ["curso-excel", "vip"] },
  { id: 2, nombre: "Luis Ramírez", email: "luis.ramirez@gmail.com", telefono: "+51 954 112 233", origen: "chatbot", etapa: "en_conversacion", tags: ["interesado-curso"] },
  { id: 3, nombre: "Andrea Solís", email: "andrea.solis@hotmail.com", telefono: "+51 944 221 987", origen: "email", etapa: "nuevo", tags: [] },
  { id: 4, nombre: "Jorge Paredes", email: "jorge.paredes@gmail.com", telefono: "+51 933 445 112", origen: "manual", etapa: "en_conversacion", tags: ["arequipa"] },
  { id: 5, nombre: "Camila Torres", email: "camila.torres@gmail.com", telefono: "+51 922 887 665", origen: "catalogo", etapa: "cliente", tags: ["curso-excel"] },
  { id: 6, nombre: "Grupo Textil Rivas", email: "contacto@textilrivas.com", telefono: "+51 911 223 344", origen: "chatbot", etapa: "inactivo", tags: ["b2b"] },
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
