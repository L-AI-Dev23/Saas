"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/animate-ui/components/radix/dialog";
import { SelectDropdown } from "@/components/dashboard/SelectDropdown";
import { productos } from "@/lib/mock-data";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { TextArea } from "@/components/base/textarea/textarea";
import { X } from "lucide-react";

const origenes = [
  "Instagram — @codew.pe",
  "Messenger — Codew Agencia",
  "TikTok — no conectada, ir a Configuración → Cuentas",
];

export function ChatbotConfigModal({
  templateId,
  templateName,
  trigger,
}: {
  templateId: string;
  templateName: string;
  trigger: React.ReactNode;
}) {
  const [keywords, setKeywords] = useState<string[]>(
    templateId === "keyword_reply" ? ["precio", "info"] : []
  );
  const [keywordInput, setKeywordInput] = useState("");
  const [alcance, setAlcance] = useState<"general" | "especifico">("general");
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [origen, setOrigen] = useState(origenes[0]);

  const showKeywords = templateId === "keyword_reply" || templateId === "comment_to_dm";
  const showCommentReply = templateId === "comment_to_dm";
  const showProducts = templateId === "catalog_flow";

  function addKeyword() {
    if (keywordInput.trim()) {
      setKeywords((k) => [...k, keywordInput.trim()]);
      setKeywordInput("");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configurar chatbot — {templateName}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-2">
          {/* Paso 1: Origen */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold uppercase text-text-muted">1. Origen</Label>
            <SelectDropdown
              options={origenes}
              value={origen}
              onChange={setOrigen}
              disabledOptions={["TikTok — no conectada, ir a Configuración → Cuentas"]}
            />
          </div>

          {/* Paso 2: Alcance */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold uppercase text-text-muted">2. Alcance</Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAlcance("general")}
                className={
                  alcance === "general"
                    ? "flex-1 rounded-lg border-2 border-cta bg-cta/5 px-3 py-2 text-sm font-semibold text-text-primary"
                    : "flex-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-secondary"
                }
              >
                General
              </button>
              <button
                type="button"
                onClick={() => setAlcance("especifico")}
                className={
                  alcance === "especifico"
                    ? "flex-1 rounded-lg border-2 border-cta bg-cta/5 px-3 py-2 text-sm font-semibold text-text-primary"
                    : "flex-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-secondary"
                }
              >
                Post/video específico
              </button>
            </div>
            {alcance === "especifico" && (
              <Input placeholder="Pega el link del post o video" className="mt-1" />
            )}
          </div>

          {/* Paso 3: Disparador */}
          {showKeywords && (
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold uppercase text-text-muted">3. Disparador</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Agregar palabra clave…"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
                />
                <Button type="button" variant="outline" onClick={addKeyword}>
                  Agregar
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {keywords.map((k, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-text-primary"
                  >
                    {k}
                    <button onClick={() => setKeywords((kw) => kw.filter((_, idx) => idx !== i))}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="mt-1 flex flex-col gap-1.5">
                <Label>Límite de respuestas por usuario</Label>
                <Input type="number" defaultValue={1} className="w-24" />
              </div>
            </div>
          )}

          {/* Paso 4: Mensajes */}
          <div className="flex flex-col gap-3">
            <Label className="text-xs font-semibold uppercase text-text-muted">
              {showKeywords ? "4." : "3."} Mensajes
            </Label>
            {showCommentReply && (
              <div className="flex flex-col gap-1.5">
                <Label>Mensaje de respuesta al comentario</Label>
                <TextArea rows={2} defaultValue="Te enviamos un DM 🙌" aria-label="Mensaje de respuesta al comentario" />
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <Label>Mensaje de DM</Label>
              <TextArea rows={3} defaultValue="Gracias por tu interés, aquí tienes el recurso" aria-label="Mensaje de DM" />
            </div>
          </div>

          {/* Paso 5: Productos */}
          {showProducts && (
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold uppercase text-text-muted">5. Productos a ofrecer</Label>
              <div className="flex flex-col gap-1.5 rounded-lg border border-border p-2">
                {productos.map((p) => (
                  <label key={p.id} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-surface">
                    <Checkbox
                      isSelected={selectedProducts.includes(p.id)}
                      onChange={() =>
                        setSelectedProducts((sp) =>
                          sp.includes(p.id) ? sp.filter((id) => id !== p.id) : [...sp, p.id]
                        )
                      }
                    />
                    <span className="text-text-primary">{p.nombre}</span>
                    <span className="ml-auto text-text-muted">{p.precio}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline">Cancelar</Button>
          <Button className="bg-cta text-white hover:bg-cta-hover">Guardar y activar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}