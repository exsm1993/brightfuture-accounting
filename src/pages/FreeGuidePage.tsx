import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  CheckCircle2,
  Download,
  Loader2,
  Users,
  Bot,
  Workflow,
  Zap,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const GUIDE_PATH = "/guia-delegar.pdf";

const formSchema = z.object({
  firstName: z.string().trim().min(1, "Escribe tu nombre."),
  email: z.string().trim().email("Escribe un correo electrónico válido."),
});

type FormValues = z.infer<typeof formSchema>;

const parts = [
  {
    icon: Users,
    title: "Delegar a humanos",
    text: "El filtro de 4 decisiones, las primeras 5 tareas que debes soltar y cómo entregarlas sin arrepentirte.",
  },
  {
    icon: Bot,
    title: "Delegar a la IA",
    text: "Qué tareas hace mejor la inteligencia artificial, qué herramientas usar y cómo darle instrucciones que funcionan.",
  },
  {
    icon: Workflow,
    title: "El sistema híbrido",
    text: "Cómo combinar a tu equipo con la IA y GoHighLevel para que ningún cliente se te escape.",
  },
  {
    icon: Zap,
    title: "Plan de 7 días",
    text: "Un plan día por día para montar todo el sistema en una semana y soltarlo a tu equipo.",
  },
];

const triggerDownload = () => {
  const a = document.createElement("a");
  a.href = GUIDE_PATH;
  a.download = "Guia-Como-Delegar-Humanos-y-IA.pdf";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const FreeGuidePage = () => {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { firstName: "", email: "" },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const { data, error } = await supabase.functions.invoke("subscribe-lead", {
        body: {
          firstName: values.firstName,
          email: values.email,
          source: "Landing Page - Guia Delegar",
          tags: ["Lead Magnet - Guia Delegar"],
        },
      });

      if (error) {
        // La captura falló en el servidor (p. ej. GHL aún sin configurar).
        // Lo registramos, pero igual entregamos la guía para no romper la
        // experiencia del visitante.
        console.error("Error al capturar el lead:", error);
      } else if (data && data.configured === false) {
        console.warn(
          "Lead recibido pero GoHighLevel no está configurado (faltan GHL_API_KEY / GHL_LOCATION_ID).",
        );
      }
    } catch (err) {
      console.error("Error inesperado al enviar el lead:", err);
    } finally {
      setSubmitted(true);
      triggerDownload();
      toast.success("¡Listo! Tu descarga acaba de comenzar.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1F33] font-sans text-white antialiased">
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0E9F8E] font-bold">
            EZ
          </div>
          <span className="text-sm font-semibold tracking-wide text-white/90">
            EZ Marketing Consulting Group
          </span>
        </div>
        <a
          href="#claim"
          className="hidden rounded-full bg-[#0E9F8E] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0A7D70] sm:inline-block"
        >
          Descargar guía gratis
        </a>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-[#0E9F8E]/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-40 top-40 h-96 w-96 rounded-full bg-[#F5A623]/10 blur-3xl" />

        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 pb-20 pt-8 lg:grid-cols-2">
          {/* Copy */}
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#0E9F8E]/40 bg-[#0E9F8E]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#63d3c4]">
              <Download className="h-3.5 w-3.5" /> Guía gratis en PDF
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">
              Cómo delegar: a <span className="text-[#0E9F8E]">humanos</span> y a
              la <span className="text-[#0E9F8E]">IA</span>.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/70">
              Deja de ser el cuello de botella de tu negocio. Descarga el sistema
              paso a paso para soltar el trabajo repetitivo, poner a la
              inteligencia artificial a trabajar por ti y multiplicar tu tiempo.
            </p>

            <ul className="mt-7 space-y-3">
              {[
                "Qué delegar primero y cómo entregarlo bien",
                "Cómo usar la IA para hacer 5 veces más en menos tiempo",
                "El flujo híbrido humano + IA + GoHighLevel",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-white/85">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#0E9F8E]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Form card */}
          <div id="claim" className="lg:pl-6">
            <div className="rounded-2xl bg-white p-8 text-[#0B1F33] shadow-2xl">
              {submitted ? (
                <div className="py-6 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF4F2]">
                    <CheckCircle2 className="h-8 w-8 text-[#0E9F8E]" />
                  </div>
                  <h2 className="text-2xl font-bold">¡Todo listo!</h2>
                  <p className="mt-2 text-[#43566B]">
                    Tu descarga debió comenzar automáticamente. Si no empezó,
                    descárgala aquí:
                  </p>
                  <button
                    onClick={triggerDownload}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0E9F8E] px-6 py-3 font-semibold text-white transition hover:bg-[#0A7D70]"
                  >
                    <Download className="h-5 w-5" /> Descargar la guía
                  </button>
                  <p className="mt-4 text-sm text-[#6B7A8D]">
                    Revisa también tu correo — te enviaremos algunos consejos
                    rápidos.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold">Descarga la guía gratis</h2>
                  <p className="mt-1.5 text-[#43566B]">
                    Déjanos tus datos y te enviamos la guía al instante.
                  </p>

                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="mt-6 space-y-4"
                    noValidate
                  >
                    <div>
                      <label
                        htmlFor="firstName"
                        className="mb-1.5 block text-sm font-medium text-[#0B1F33]"
                      >
                        Nombre
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        autoComplete="given-name"
                        placeholder="María"
                        {...register("firstName")}
                        className="w-full rounded-xl border border-[#D8E3E1] bg-white px-4 py-3 text-[#0B1F33] outline-none transition focus:border-[#0E9F8E] focus:ring-2 focus:ring-[#0E9F8E]/30"
                      />
                      {errors.firstName && (
                        <p className="mt-1.5 text-sm text-red-600">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="mb-1.5 block text-sm font-medium text-[#0B1F33]"
                      >
                        Correo electrónico
                      </label>
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="maria@tunegocio.com"
                        {...register("email")}
                        className="w-full rounded-xl border border-[#D8E3E1] bg-white px-4 py-3 text-[#0B1F33] outline-none transition focus:border-[#0E9F8E] focus:ring-2 focus:ring-[#0E9F8E]/30"
                      />
                      {errors.email && (
                        <p className="mt-1.5 text-sm text-red-600">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0E9F8E] px-6 py-3.5 font-semibold text-white transition hover:bg-[#0A7D70] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" /> Enviando…
                        </>
                      ) : (
                        <>
                          Enviarme la guía <ArrowRight className="h-5 w-5" />
                        </>
                      )}
                    </button>

                    <p className="flex items-center justify-center gap-1.5 text-center text-xs text-[#6B7A8D]">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Respetamos tu privacidad. Cancela cuando quieras.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Qué incluye */}
      <section className="bg-white py-20 text-[#0B1F33]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-[#0E9F8E]">
              Qué incluye
            </span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Todo lo que necesitas para dejar de hacerlo todo tú
            </h2>
            <p className="mt-3 text-[#43566B]">
              Cinco secciones prácticas que te llevan de estar saturado a tener un
              sistema que trabaja por ti — con tu equipo y con la IA.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {parts.map((part, i) => (
              <div
                key={part.title}
                className="rounded-2xl border border-[#E1E8EE] bg-[#F7FAFB] p-7 transition hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#EAF4F2] text-[#0A7D70]">
                    <part.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#0E9F8E]">
                      Parte {i + 1}
                    </div>
                    <h3 className="text-lg font-bold">{part.title}</h3>
                  </div>
                </div>
                <p className="mt-4 leading-relaxed text-[#43566B]">{part.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-[#0B1F33] py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            ¿Listo para dejar de hacerlo todo tú?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">
            Descarga la guía gratis y empieza a construir un sistema que trabaja
            sin ti.
          </p>
          <a
            href="#claim"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#0E9F8E] px-8 py-4 text-lg font-semibold text-white transition hover:bg-[#0A7D70]"
          >
            <Download className="h-5 w-5" /> Descargar la guía gratis
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 text-sm text-white/50 sm:flex-row">
          <span>© {new Date().getFullYear()} EZ Marketing Consulting Group</span>
          <a
            href="https://ez-marketing.us"
            className="transition hover:text-white/80"
          >
            ez-marketing.us
          </a>
        </div>
      </footer>
    </div>
  );
};

export default FreeGuidePage;
