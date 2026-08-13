import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  CheckCircle2,
  Download,
  Loader2,
  Mail,
  Users,
  Workflow,
  Zap,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const GUIDE_PATH = "/delegation-guide.pdf";

const formSchema = z.object({
  firstName: z.string().trim().min(1, "Please enter your first name."),
  email: z.string().trim().email("Please enter a valid email address."),
});

type FormValues = z.infer<typeof formSchema>;

const parts = [
  {
    icon: Users,
    title: "The Delegation Framework",
    text: "The 4-D filter for deciding what to hand off — and the first 5 tasks every owner should stop doing today.",
  },
  {
    icon: Mail,
    title: "The Email Collection Machine",
    text: "Lead magnets, landing pages, and forms that turn cold traffic into opted-in leads at 20–40%.",
  },
  {
    icon: Workflow,
    title: "Wiring It Into GoHighLevel",
    text: "The exact 6-step flow to send every captured email into GHL and automate the follow-up.",
  },
  {
    icon: Zap,
    title: "7-Day Quick-Start Checklist",
    text: "A day-by-day plan to build the whole system in one week and hand it off to your team.",
  },
];

const triggerDownload = () => {
  const a = document.createElement("a");
  a.href = GUIDE_PATH;
  a.download = "The-Delegation-and-Lead-Capture-Playbook.pdf";
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
          source: "Landing Page - Delegation Guide",
          tags: ["Lead Magnet - Delegation Guide"],
        },
      });

      if (error) {
        // Capture failed server-side (e.g. GHL not configured yet). Log it, but
        // still deliver the guide so the visitor's experience never breaks.
        console.error("Lead capture error:", error);
      } else if (data && data.configured === false) {
        console.warn(
          "Lead captured locally but GHL is not configured (missing GHL_API_KEY / GHL_LOCATION_ID).",
        );
      }
    } catch (err) {
      console.error("Unexpected error submitting lead:", err);
    } finally {
      setSubmitted(true);
      triggerDownload();
      toast.success("Your guide is on the way — the download just started.");
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
          Get the free guide
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
              <Download className="h-3.5 w-3.5" /> Free PDF Guide
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">
              Delegate, collect emails, and send every lead straight to{" "}
              <span className="text-[#0E9F8E]">GoHighLevel</span>.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/70">
              Stop being the bottleneck. Get the step-by-step playbook to hand off
              the busywork, capture emails on autopilot, and pipe every contact
              into GHL so the follow-up happens without you.
            </p>

            <ul className="mt-7 space-y-3">
              {[
                "A delegation framework you can put to work today",
                "Landing pages & forms that convert 20–40%",
                "The exact GoHighLevel automation flow, step by step",
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
                  <h2 className="text-2xl font-bold">You're all set!</h2>
                  <p className="mt-2 text-[#43566B]">
                    Your download should have started automatically. If it didn't,
                    grab it here:
                  </p>
                  <button
                    onClick={triggerDownload}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0E9F8E] px-6 py-3 font-semibold text-white transition hover:bg-[#0A7D70]"
                  >
                    <Download className="h-5 w-5" /> Download the guide
                  </button>
                  <p className="mt-4 text-sm text-[#6B7A8D]">
                    Check your inbox too — we'll follow up with a few quick tips.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold">Get the free guide</h2>
                  <p className="mt-1.5 text-[#43566B]">
                    Enter your details and we'll send the playbook straight to you.
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
                        First name
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        autoComplete="given-name"
                        placeholder="Jane"
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
                        Email address
                      </label>
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="jane@yourbusiness.com"
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
                          <Loader2 className="h-5 w-5 animate-spin" /> Sending…
                        </>
                      ) : (
                        <>
                          Send me the guide <ArrowRight className="h-5 w-5" />
                        </>
                      )}
                    </button>

                    <p className="flex items-center justify-center gap-1.5 text-center text-xs text-[#6B7A8D]">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      We respect your privacy. Unsubscribe anytime.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* What's inside */}
      <section className="bg-white py-20 text-[#0B1F33]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-[#0E9F8E]">
              What's inside
            </span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Everything you need to build the machine
            </h2>
            <p className="mt-3 text-[#43566B]">
              Four focused sections take you from overwhelmed operator to a
              hands-off lead-capture system running on GoHighLevel.
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
                      Part {i + 1}
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

      {/* Final CTA */}
      <section className="bg-[#0B1F33] py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to stop doing it all yourself?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">
            Download the free playbook and start building a lead-capture system
            that runs without you.
          </p>
          <a
            href="#claim"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#0E9F8E] px-8 py-4 text-lg font-semibold text-white transition hover:bg-[#0A7D70]"
          >
            <Download className="h-5 w-5" /> Get the free guide
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
