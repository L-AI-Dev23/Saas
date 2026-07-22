import { MessageSquare, KeyRound, Sparkles, ShoppingBag, ClipboardList } from "lucide-react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ChatbotConfigModal } from "@/components/dashboard/ChatbotConfigModal";
import { chatbotTemplates } from "@/lib/mock-data";

const icons: Record<string, typeof MessageSquare> = {
  comment_to_dm: MessageSquare,
  keyword_reply: KeyRound,
  welcome: Sparkles,
  catalog_flow: ShoppingBag,
  data_capture: ClipboardList,
};

export default function ChatbotsPlantillasPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Plantillas de chatbot"
        description="Elige un tipo de bot y configúralo en un par de pasos."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {chatbotTemplates.map((t) => {
          const Icon = icons[t.id];
          return (
            <div
              key={t.id}
              className="flex flex-col rounded-lg border border-border bg-white p-5 shadow-sg-sm transition-shadow hover:shadow-sg-md"
            >
              <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Icon size={20} />
              </span>
              <p className="text-sm font-semibold text-text-primary">{t.nombre}</p>
              <p className="mt-1 flex-1 text-xs text-text-secondary">{t.desc}</p>
              <ChatbotConfigModal
                templateId={t.id}
                templateName={t.nombre}
                trigger={
                  <Button className="mt-4 h-9 w-full rounded-lg bg-cta text-white hover:bg-cta-hover">
                    Usar plantilla
                  </Button>
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
