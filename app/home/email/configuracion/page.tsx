"use client";

import { useState } from "react";
import { Check, Copy, ShieldCheck, ShieldAlert, Loader2 } from "lucide-react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { useEmailConfig, updateRemitente, agregarDominio, verificarDominio } from "@/lib/email-config-store";

const ESTADO_BADGE: Record<string, { texto: string; clase: string }> = {
  sin_configurar: { texto: "Sin dominio", clase: "bg-surface text-text-secondary" },
  pendiente: { texto: "DKIM sin verificar", clase: "bg-warning/10 text-warning" },
  verificado: { texto: "Dominio verificado", clase: "bg-success/10 text-success" },
};

export default function EmailConfiguracionPage() {
  const config = useEmailConfig();

  const [nombreRemitente, setNombreRemitente] = useState(config.nombreRemitente);
  const [emailRemitente, setEmailRemitente] = useState(config.emailRemitente);
  const [replyTo, setReplyTo] = useState(config.replyTo);
  const [dominioInput, setDominioInput] = useState(config.dominio);
  const [verificando, setVerificando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [copiado, setCopiado] = useState<string | null>(null);

  const dominioActualDelEmail = emailRemitente.split("@")[1] ?? "";
  const emailNoCoincideConDominio =
    config.estadoDominio !== "sin_configurar" && dominioActualDelEmail && dominioActualDelEmail !== config.dominio;

  function guardarRemitente() {
    updateRemitente({ nombreRemitente: nombreRemitente.trim(), emailRemitente: emailRemitente.trim(), replyTo: replyTo.trim() });
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  }

  function handleAgregarDominio() {
    if (!dominioInput.trim() || dominioInput.trim() === config.dominio) return;
    agregarDominio(dominioInput);
  }

  function handleVerificar() {
    setVerificando(true);
    // Simulado: en producción esto consulta la API de Resend, que resuelve los
    // registros DNS reales del dominio antes de marcarlo como verificado.
    setTimeout(() => {
      verificarDominio();
      setVerificando(false);
    }, 900);
  }

  async function copiar(valor: string, key: string) {
    try {
      await navigator.clipboard.writeText(valor);
      setCopiado(key);
      setTimeout(() => setCopiado(null), 1500);
    } catch {
      // Clipboard no disponible; no bloqueamos el flujo por esto.
    }
  }

  const badge = ESTADO_BADGE[config.estadoDominio];

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Configuración de Email" description="Remitente y dominio de envío (vía Resend)." />

      <div className="flex flex-col gap-5 rounded-lg border border-border bg-white p-6 shadow-sg-sm">
        <div className="flex flex-col gap-1.5">
          <Label>Nombre del remitente</Label>
          <Input value={nombreRemitente} onChange={(e) => setNombreRemitente(e.target.value)} placeholder="Ej. Codew Agencia" />
          <p className="text-xs text-text-muted">Así se ve en la bandeja de entrada: “{nombreRemitente || "Tu nombre"} &lt;{emailRemitente || "tu@dominio.com"}&gt;”.</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Email del remitente</Label>
          <Input value={emailRemitente} onChange={(e) => setEmailRemitente(e.target.value)} placeholder="hola@tudominio.com" />
          {emailNoCoincideConDominio ? (
            <p className="text-xs text-warning">
              Este correo no pertenece a “{config.dominio}”. Para enviar desde acá, el dominio del email debe coincidir con tu dominio verificado.
            </p>
          ) : (
            <p className="text-xs text-text-muted">Debe pertenecer a tu dominio verificado para evitar que caiga en spam.</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Email de respuesta (opcional)</Label>
          <Input value={replyTo} onChange={(e) => setReplyTo(e.target.value)} placeholder="Ej. soporte@tudominio.com" />
          <p className="text-xs text-text-muted">Si tus clientes responden el correo, llegará acá en vez de al remitente.</p>
        </div>

        <div className="border-t border-border pt-5">
          <Button className="bg-cta text-white hover:bg-cta-hover" onClick={guardarRemitente} disabled={!nombreRemitente.trim() || !emailRemitente.trim()}>
            Guardar cambios
          </Button>
          {guardado && (
            <span className="ml-3 inline-flex items-center gap-1 text-xs font-medium text-success">
              <Check size={14} /> Cambios guardados
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-5 rounded-lg border border-border bg-white p-6 shadow-sg-sm">
        <div>
          <p className="text-sm font-semibold text-text-primary">Dominio de envío</p>
          <p className="mt-1 text-xs text-text-secondary">
            Todos los correos se envían a través de la cuenta de Resend de Codew. Para que tus emails salgan desde tu
            propio dominio (y no un genérico), agregalo acá y verificalo con los registros DNS que te damos abajo.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Dominio propio</Label>
          <div className="flex items-center gap-2">
            <Input value={dominioInput} onChange={(e) => setDominioInput(e.target.value)} className="flex-1" placeholder="tudominio.com" />
            <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${badge.clase}`}>{badge.texto}</span>
          </div>
        </div>

        {dominioInput.trim() !== config.dominio && (
          <Button variant="outline" className="w-fit" onClick={handleAgregarDominio}>
            Agregar dominio
          </Button>
        )}

        {config.estadoDominio !== "sin_configurar" && (
          <>
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface font-semibold uppercase text-text-muted">
                  <tr>
                    <th className="px-3 py-2">Tipo</th>
                    <th className="px-3 py-2">Host</th>
                    <th className="px-3 py-2">Valor</th>
                    <th className="px-3 py-2" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {config.registrosDns.map((r, i) => {
                    const key = `${r.tipo}-${i}`;
                    return (
                      <tr key={key}>
                        <td className="px-3 py-2 font-mono text-text-secondary">{r.tipo}</td>
                        <td className="px-3 py-2 font-mono text-text-secondary">{r.host}</td>
                        <td className="max-w-xs truncate px-3 py-2 font-mono text-text-secondary" title={r.valor}>
                          {r.valor}
                          {r.prioridad !== undefined && <span className="text-text-muted"> (prioridad {r.prioridad})</span>}
                        </td>
                        <td className="px-3 py-2">
                          <button
                            onClick={() => copiar(r.valor, key)}
                            aria-label="Copiar valor"
                            className="flex items-center gap-1 text-text-muted hover:text-text-primary"
                          >
                            {copiado === key ? <Check size={13} /> : <Copy size={13} />}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-text-muted">
              Agregá estos registros en el proveedor DNS de “{config.dominio}” y después tocá “Verificar dominio”.
            </p>

            <Button variant="outline" className="w-fit" onClick={handleVerificar} disabled={verificando || config.estadoDominio === "verificado"}>
              {verificando ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Verificando…
                </>
              ) : config.estadoDominio === "verificado" ? (
                <>
                  <ShieldCheck size={14} /> Dominio verificado
                </>
              ) : (
                <>
                  <ShieldAlert size={14} /> Verificar dominio
                </>
              )}
            </Button>
            <p className="text-xs text-text-muted">
              Nota: la verificación está simulada en esta demo. En producción se conecta a la API de dominios de
              Resend, que resuelve estos registros DNS reales antes de marcar el dominio como verificado.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
