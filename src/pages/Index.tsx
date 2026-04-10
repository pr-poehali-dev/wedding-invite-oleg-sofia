import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/40fd3ffb-65ba-4467-a3a2-a57542356d40/files/5e818587-0389-4719-bbf2-333db9e8f17a.jpg";

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className={`section-enter ${className}`}>
      {children}
    </div>
  );
}

function Divider() {
  return <div className="divider-line my-16 mx-auto max-w-xs" />;
}

function RSVPForm() {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState<"yes" | "no" | null>(null);
  const [guests, setGuests] = useState("1");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <p className="font-cormorant text-3xl italic" style={{ color: "var(--rose-deep)" }}>
          Спасибо, {name || "дорогой гость"}!
        </p>
        <p className="font-montserrat text-sm mt-3" style={{ color: "var(--text-muted)" }}>
          Мы с нетерпением ждём встречи с вами
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
      <div>
        <label className="block font-montserrat text-xs tracking-widest uppercase mb-2" style={{ color: "var(--text-muted)" }}>
          Ваше имя
        </label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Введите имя"
          className="w-full border-b bg-transparent py-2 font-montserrat text-sm outline-none transition-colors focus:border-current"
          style={{ borderColor: "var(--rose)", color: "var(--dark)" }}
        />
      </div>

      <div>
        <label className="block font-montserrat text-xs tracking-widest uppercase mb-3" style={{ color: "var(--text-muted)" }}>
          Вы придёте?
        </label>
        <div className="flex gap-4">
          {[{ val: "yes", label: "С радостью!" }, { val: "no", label: "К сожалению, нет" }].map(opt => (
            <button
              key={opt.val}
              type="button"
              onClick={() => setAttending(opt.val as "yes" | "no")}
              className="flex-1 py-3 font-montserrat text-xs tracking-wider transition-all duration-300"
              style={{
                border: `1px solid ${attending === opt.val ? "var(--rose-deep)" : "var(--rose)"}`,
                backgroundColor: attending === opt.val ? "var(--rose-deep)" : "transparent",
                color: attending === opt.val ? "white" : "var(--dark)",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {attending === "yes" && (
        <div>
          <label className="block font-montserrat text-xs tracking-widest uppercase mb-2" style={{ color: "var(--text-muted)" }}>
            Количество гостей
          </label>
          <select
            value={guests}
            onChange={e => setGuests(e.target.value)}
            className="w-full border-b bg-transparent py-2 font-montserrat text-sm outline-none"
            style={{ borderColor: "var(--rose)", color: "var(--dark)" }}
          >
            {["1", "2", "3", "4"].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      )}

      <button
        type="submit"
        className="w-full py-4 font-montserrat text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-80"
        style={{ backgroundColor: "var(--dark)", color: "white" }}
      >
        Подтвердить
      </button>
    </form>
  );
}

export default function Index() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen font-montserrat" style={{ backgroundColor: "var(--cream)", color: "var(--dark)" }}>

      {/* Nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          backgroundColor: scrolled ? "rgba(250,248,245,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(8px)" : "none",
          borderBottom: scrolled ? "1px solid var(--rose)" : "none",
        }}
      >
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="font-cormorant text-lg italic" style={{ color: "var(--rose-deep)" }}>A & M</span>
          <div className="hidden md:flex gap-8">
            {[
              { id: "about", label: "О событии" },
              { id: "venue", label: "Место" },
              { id: "program", label: "Программа" },
              { id: "rsvp", label: "RSVP" },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="font-montserrat text-xs tracking-widest uppercase hover:opacity-60 transition-opacity"
                style={{ color: "var(--dark)" }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${HERO_IMAGE})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, var(--cream) 0%, rgba(250,248,245,0.3) 40%, rgba(250,248,245,0.3) 60%, var(--cream) 100%)",
          }}
        />

        <div className="relative z-10">
          <p className="fade-up font-montserrat text-xs tracking-[0.4em] uppercase mb-10" style={{ color: "var(--text-muted)" }}>
            Мы приглашаем вас разделить с нами этот особый день
          </p>

          <h1 className="fade-up-delay-1 font-cormorant font-light leading-none" style={{ fontSize: "clamp(3.5rem, 10vw, 8rem)", color: "var(--dark)" }}>
            Алексей
          </h1>

          <div className="fade-up-delay-2 flex items-center justify-center gap-6 my-4">
            <div className="h-px w-16" style={{ background: "linear-gradient(90deg, transparent, var(--rose))" }} />
            <span className="font-cormorant italic text-2xl" style={{ color: "var(--rose-deep)" }}>&</span>
            <div className="h-px w-16" style={{ background: "linear-gradient(90deg, var(--rose), transparent)" }} />
          </div>

          <h1 className="fade-up-delay-2 font-cormorant font-light leading-none" style={{ fontSize: "clamp(3.5rem, 10vw, 8rem)", color: "var(--dark)" }}>
            Мария
          </h1>

          <div className="fade-up-delay-3 mt-12 space-y-2">
            <p className="font-cormorant text-2xl" style={{ color: "var(--rose-deep)" }}>14 июня 2025</p>
            <p className="font-montserrat text-xs tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>
              Суббота · Москва
            </p>
          </div>

          <button
            onClick={() => scrollTo("rsvp")}
            className="fade-up-delay-4 mt-14 px-12 py-4 font-montserrat text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-80"
            style={{ border: "1px solid var(--rose-deep)", color: "var(--rose-deep)" }}
          >
            Подтвердить присутствие
          </button>
        </div>

        <button
          onClick={() => scrollTo("about")}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"
          style={{ color: "var(--rose)" }}
        >
          <Icon name="ChevronDown" size={24} />
        </button>
      </section>

      <div className="max-w-3xl mx-auto px-6">

        {/* О событии */}
        <section id="about">
          <Section>
            <div className="text-center py-20">
              <p className="font-montserrat text-xs tracking-[0.35em] uppercase mb-6" style={{ color: "var(--text-muted)" }}>01 — О событии</p>
              <h2 className="font-cormorant text-5xl font-light mb-10" style={{ color: "var(--dark)" }}>Наш день</h2>
              <p className="font-montserrat text-sm leading-loose max-w-xl mx-auto" style={{ color: "var(--text-muted)" }}>
                Мы рады сообщить вам, что 14 июня 2025 года мы соединим наши жизни в браке.
                Этот день будет наполнен теплом, любовью и искренними эмоциями — и мы очень
                хотим разделить его с самыми близкими людьми.
              </p>

              <div className="grid grid-cols-3 gap-8 mt-16">
                {[
                  { icon: "Calendar", label: "Дата", value: "14 июня 2025" },
                  { icon: "Clock", label: "Время", value: "16:00" },
                  { icon: "MapPin", label: "Место", value: "Москва" },
                ].map(item => (
                  <div key={item.label} className="text-center">
                    <div className="flex justify-center mb-3" style={{ color: "var(--rose-deep)" }}>
                      <Icon name={item.icon} size={20} />
                    </div>
                    <p className="font-montserrat text-xs tracking-widest uppercase mb-1" style={{ color: "var(--text-muted)" }}>{item.label}</p>
                    <p className="font-cormorant text-xl" style={{ color: "var(--dark)" }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        </section>

        <Divider />

        {/* Место */}
        <section id="venue">
          <Section>
            <div className="text-center py-4">
              <p className="font-montserrat text-xs tracking-[0.35em] uppercase mb-6" style={{ color: "var(--text-muted)" }}>02 — Место проведения</p>
              <h2 className="font-cormorant text-5xl font-light mb-10" style={{ color: "var(--dark)" }}>Где нас найти</h2>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="text-left space-y-6">
                  <div>
                    <p className="font-cormorant text-2xl mb-2" style={{ color: "var(--dark)" }}>Усадьба «Архангельское»</p>
                    <p className="font-montserrat text-sm" style={{ color: "var(--text-muted)" }}>
                      Ул. Садовая, 12, Москва
                    </p>
                  </div>
                  <div className="space-y-3">
                    {[
                      { icon: "Car", text: "30 минут от центра Москвы" },
                      { icon: "ParkingCircle", text: "Бесплатная парковка на территории" },
                      { icon: "Bus", text: "Автобус 541 от станции м. Митино" },
                    ].map(item => (
                      <div key={item.text} className="flex items-start gap-3">
                        <Icon name={item.icon} size={16} style={{ color: "var(--rose-deep)", marginTop: "2px", flexShrink: 0 }} />
                        <p className="font-montserrat text-sm" style={{ color: "var(--text-muted)" }}>{item.text}</p>
                      </div>
                    ))}
                  </div>
                  <a
                    href="https://yandex.ru/maps/?text=Усадьба+Архангельское+Москва"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-montserrat text-xs tracking-widest uppercase transition-opacity hover:opacity-60"
                    style={{ color: "var(--rose-deep)" }}
                  >
                    <Icon name="ExternalLink" size={14} />
                    Открыть на карте
                  </a>
                </div>

                <div
                  className="aspect-square rounded-sm overflow-hidden"
                  style={{ border: "1px solid var(--rose)" }}
                >
                  <iframe
                    title="Карта"
                    src="https://yandex.ru/map-widget/v1/?ll=37.370300%2C55.771530&z=14&pt=37.370300,55.771530,pm2rdm"
                    width="100%"
                    height="100%"
                    style={{ border: "none" }}
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </Section>
        </section>

        <Divider />

        {/* Программа */}
        <section id="program">
          <Section>
            <div className="text-center py-4">
              <p className="font-montserrat text-xs tracking-[0.35em] uppercase mb-6" style={{ color: "var(--text-muted)" }}>03 — Программа торжества</p>
              <h2 className="font-cormorant text-5xl font-light mb-14" style={{ color: "var(--dark)" }}>Расписание дня</h2>

              <div className="relative max-w-lg mx-auto">
                <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2" style={{ background: "linear-gradient(180deg, transparent, var(--rose) 20%, var(--rose) 80%, transparent)" }} />

                {[
                  { time: "15:30", event: "Сбор гостей", desc: "Приветственный коктейль в саду" },
                  { time: "16:00", event: "Церемония", desc: "Торжественная регистрация брака" },
                  { time: "17:00", event: "Фотосессия", desc: "Прогулка по территории усадьбы" },
                  { time: "18:00", event: "Банкет", desc: "Праздничный ужин и танцевальная программа" },
                  { time: "23:00", event: "Фейерверк", desc: "Яркое завершение вечера" },
                ].map((item, i) => (
                  <div key={i} className={`flex items-start gap-8 mb-10 ${i % 2 === 0 ? "flex-row-reverse text-right" : "text-left"}`}>
                    <div className="flex-1">
                      <p className="font-cormorant text-2xl mb-1" style={{ color: "var(--dark)" }}>{item.event}</p>
                      <p className="font-montserrat text-xs" style={{ color: "var(--text-muted)" }}>{item.desc}</p>
                    </div>
                    <div className="relative flex-shrink-0 flex items-center justify-center w-8">
                      <div className="w-2 h-2 rounded-full z-10" style={{ backgroundColor: "var(--rose-deep)" }} />
                    </div>
                    <div className="flex-1">
                      <p className="font-cormorant text-xl italic" style={{ color: "var(--rose-deep)" }}>{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        </section>

        <Divider />

        {/* Дресс-код */}
        <section id="dresscode">
          <Section>
            <div className="text-center py-4">
              <p className="font-montserrat text-xs tracking-[0.35em] uppercase mb-6" style={{ color: "var(--text-muted)" }}>04 — Дресс-код</p>
              <h2 className="font-cormorant text-5xl font-light mb-8" style={{ color: "var(--dark)" }}>Стиль вечера</h2>
              <p className="font-montserrat text-sm leading-loose max-w-lg mx-auto mb-12" style={{ color: "var(--text-muted)" }}>
                Мы будем рады, если вы выберете наряды в нежных и элегантных тонах.
                Это создаст единую гармоничную атмосферу нашего торжества.
              </p>

              <div className="flex flex-wrap justify-center gap-8">
                {[
                  { color: "#e8c4c4", name: "Нежно-розовый" },
                  { color: "#d4d4e4", name: "Серебристый" },
                  { color: "#f5f0e8", name: "Айвори" },
                  { color: "#c4d4c4", name: "Мятный" },
                ].map(item => (
                  <div key={item.name} className="text-center">
                    <div
                      className="w-16 h-16 rounded-full mx-auto mb-3 shadow-sm"
                      style={{ backgroundColor: item.color, border: "1px solid rgba(0,0,0,0.05)" }}
                    />
                    <p className="font-montserrat text-xs" style={{ color: "var(--text-muted)" }}>{item.name}</p>
                  </div>
                ))}
              </div>

              <p className="font-cormorant text-lg italic mt-10" style={{ color: "var(--rose-deep)" }}>
                Просьба избегать белого и чёрного цветов
              </p>
            </div>
          </Section>
        </section>

        <Divider />

        {/* RSVP */}
        <section id="rsvp">
          <Section>
            <div className="text-center py-4 mb-10">
              <p className="font-montserrat text-xs tracking-[0.35em] uppercase mb-6" style={{ color: "var(--text-muted)" }}>05 — RSVP</p>
              <h2 className="font-cormorant text-5xl font-light mb-4" style={{ color: "var(--dark)" }}>Подтвердите присутствие</h2>
              <p className="font-montserrat text-sm mb-12" style={{ color: "var(--text-muted)" }}>
                Просим ответить до 1 июня 2025 года
              </p>
              <RSVPForm />
            </div>
          </Section>
        </section>

        <Divider />

        {/* Контакты */}
        <section id="contacts">
          <Section>
            <div className="text-center py-4 pb-24">
              <p className="font-montserrat text-xs tracking-[0.35em] uppercase mb-6" style={{ color: "var(--text-muted)" }}>06 — Контакты</p>
              <h2 className="font-cormorant text-5xl font-light mb-8" style={{ color: "var(--dark)" }}>Есть вопросы?</h2>
              <p className="font-montserrat text-sm mb-12" style={{ color: "var(--text-muted)" }}>
                Свяжитесь с организаторами по любому удобному каналу
              </p>

              <div className="grid md:grid-cols-2 gap-4 max-w-lg mx-auto">
                {[
                  { icon: "Phone", label: "Алексей", value: "+7 (999) 000-00-00" },
                  { icon: "Phone", label: "Мария", value: "+7 (999) 111-11-11" },
                  { icon: "MessageCircle", label: "Telegram", value: "@wedding_am" },
                  { icon: "Mail", label: "Email", value: "wedding@example.com" },
                ].map(item => (
                  <div
                    key={item.label}
                    className="flex items-center gap-4 p-5 transition-all duration-300 hover:opacity-80"
                    style={{ border: "1px solid var(--rose)" }}
                  >
                    <div style={{ color: "var(--rose-deep)" }}>
                      <Icon name={item.icon} size={18} />
                    </div>
                    <div className="text-left">
                      <p className="font-montserrat text-xs tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>{item.label}</p>
                      <p className="font-cormorant text-lg" style={{ color: "var(--dark)" }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        </section>

      </div>

      {/* Footer */}
      <footer className="text-center py-12 border-t" style={{ borderColor: "var(--rose)" }}>
        <p className="font-cormorant text-3xl italic mb-2" style={{ color: "var(--rose-deep)" }}>Алексей & Мария</p>
        <p className="font-montserrat text-xs tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>
          14 · 06 · 2025
        </p>
      </footer>
    </div>
  );
}