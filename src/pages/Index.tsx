import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/icon";

const IMG_HERO = "https://cdn.poehali.dev/projects/40fd3ffb-65ba-4467-a3a2-a57542356d40/bucket/8b91c65f-dc4b-4008-9a41-0651e5e70fb5.jpg";
const IMG_VENUE = "https://cdn.poehali.dev/projects/40fd3ffb-65ba-4467-a3a2-a57542356d40/bucket/1d33951a-91b7-4a91-bc90-c4252a87c3b8.jpg";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && el.classList.add("revealed"),
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal-block ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

const DRINKS = ["Игристое вино", "Красное вино", "Белое вино", "Водка", "Самогон", "Коньяк"];

const RSVP_URL = "https://functions.poehali.dev/14df0165-ee7d-4d53-b87b-ff168ad82763";

function RSVPForm() {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState<"yes" | "no" | null>(null);
  const [drinks, setDrinks] = useState<string[]>([]);
  const [customDrink, setCustomDrink] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleDrink = (d: string) => {
    setDrinks(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  };

  if (submitted) {
    return (
      <div className="py-12 text-center">
        <p className="font-display text-5xl mb-3" style={{ color: "var(--ink)" }}>Спасибо!</p>
        <p className="font-body text-sm tracking-widest uppercase" style={{ color: "var(--stone)" }}>
          Ждём вас, {name || "дорогой гость"}
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch(RSVP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, attending, drinks, customDrink }),
    });
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="border-b pb-4" style={{ borderColor: "var(--line)" }}>
        <p className="font-body text-xs tracking-[0.3em] uppercase mb-3" style={{ color: "var(--stone)" }}>Ваше имя</p>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Введите имя"
          className="w-full bg-transparent font-display text-3xl outline-none placeholder-opacity-30"
          style={{ color: "var(--ink)", caretColor: "var(--accent)" }}
        />
      </div>

      <div className="border-b pb-6" style={{ borderColor: "var(--line)" }}>
        <p className="font-body text-xs tracking-[0.3em] uppercase mb-4" style={{ color: "var(--stone)" }}>Вы придёте?</p>
        <div className="flex gap-3">
          {[{ v: "yes", l: "Буду" }, { v: "no", l: "Не смогу" }].map(o => (
            <button
              key={o.v}
              type="button"
              onClick={() => setAttending(o.v as "yes" | "no")}
              className="flex-1 py-4 font-body text-xs tracking-widest uppercase transition-all duration-300"
              style={{
                background: attending === o.v ? "var(--ink)" : "transparent",
                color: attending === o.v ? "var(--paper)" : "var(--ink)",
                border: "1px solid var(--ink)",
              }}
            >
              {o.l}
            </button>
          ))}
        </div>
      </div>

      {attending === "yes" && (
        <div>
          <p className="font-body text-xs tracking-[0.3em] uppercase mb-4" style={{ color: "var(--stone)" }}>
            Что будете пить?
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {DRINKS.map(d => (
              <button
                key={d}
                type="button"
                onClick={() => toggleDrink(d)}
                className="px-4 py-2 font-body text-xs tracking-wider transition-all duration-200"
                style={{
                  background: drinks.includes(d) ? "var(--ink)" : "transparent",
                  color: drinks.includes(d) ? "var(--paper)" : "var(--ink)",
                  border: "1px solid var(--ink)",
                }}
              >
                {d}
              </button>
            ))}
          </div>
          <input
            value={customDrink}
            onChange={e => setCustomDrink(e.target.value)}
            placeholder="Свой вариант..."
            className="w-full bg-transparent border-b py-2 font-body text-sm outline-none"
            style={{ borderColor: "var(--line)", color: "var(--ink)" }}
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-5 font-body text-xs tracking-[0.3em] uppercase transition-all duration-300 hover:opacity-70 disabled:opacity-50"
        style={{ background: "var(--accent)", color: "var(--paper)" }}
      >
        {loading ? "Отправляем..." : "Отправить ответ"}
      </button>
    </form>
  );
}

export default function Index() {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--paper)", color: "var(--ink)" }}>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5"
        style={{ background: "rgba(249,247,243,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--line)" }}>
        <span className="font-display text-xl" style={{ color: "var(--ink)" }}>С & О</span>
        <nav className="hidden md:flex gap-10">
          {["about", "venue", "program", "dresscode", "rsvp"].map(id => (
            <button key={id} onClick={() => scrollTo(id)}
              className="font-body text-xs tracking-[0.25em] uppercase transition-opacity hover:opacity-50"
              style={{ color: "var(--stone)" }}>
              {({ about: "О нас", venue: "Место", program: "Программа", dresscode: "Дресс-код", rsvp: "RSVP" })[id]}
            </button>
          ))}
        </nav>
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} style={{ color: "var(--ink)" }}>
          <Icon name={menuOpen ? "X" : "Menu"} size={20} />
        </button>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8"
          style={{ background: "var(--paper)" }}>
          {["about", "venue", "program", "dresscode", "rsvp"].map(id => (
            <button key={id} onClick={() => scrollTo(id)}
              className="font-display text-4xl transition-opacity hover:opacity-50"
              style={{ color: "var(--ink)" }}>
              {({ about: "О нас", venue: "Место", program: "Программа", dresscode: "Дресс-код", rsvp: "RSVP" })[id]}
            </button>
          ))}
        </div>
      )}

      {/* HERO — fullscreen editorial split */}
      <section className="min-h-screen grid md:grid-cols-2 pt-16">
        {/* Left — text */}
        <div className="flex flex-col justify-end p-8 md:p-16 pb-16 order-2 md:order-1">
          <Reveal>
            <p className="font-body text-xs tracking-[0.4em] uppercase mb-8" style={{ color: "var(--stone)" }}>
              08 · 08 · 2026 &nbsp;·&nbsp; Уфа
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="font-display leading-[0.9] mb-2" style={{ fontSize: "clamp(4rem, 11vw, 9rem)", color: "var(--ink)" }}>
              София
            </h1>
          </Reveal>
          <Reveal delay={150}>
            <div className="flex items-center gap-4 my-3">
              <div className="flex-1 h-px" style={{ background: "var(--accent)" }} />
              <span className="font-display text-xl italic" style={{ color: "var(--accent)" }}>&</span>
              <div className="flex-1 h-px" style={{ background: "var(--accent)" }} />
            </div>
          </Reveal>
          <Reveal delay={200}>
            <h1 className="font-display leading-[0.9] mb-10" style={{ fontSize: "clamp(4rem, 11vw, 9rem)", color: "var(--ink)" }}>
              Олег
            </h1>
          </Reveal>
          <Reveal delay={300}>
            <p className="font-body text-sm leading-relaxed max-w-sm mb-10" style={{ color: "var(--stone)" }}>
              Мы приглашаем вас разделить с нами самый важный день нашей жизни — день, когда мы станем семьёй.
            </p>
          </Reveal>
          <Reveal delay={400}>
            <button onClick={() => scrollTo("rsvp")}
              className="self-start px-10 py-4 font-body text-xs tracking-[0.3em] uppercase transition-all duration-300 hover:opacity-80"
              style={{ background: "var(--ink)", color: "var(--paper)" }}>
              Подтвердить присутствие
            </button>
          </Reveal>
        </div>

        {/* Right — photo */}
        <div className="relative min-h-[50vh] md:min-h-screen order-1 md:order-2 overflow-hidden"
          style={{ background: "#1a1714" }}>
          <img src={IMG_HERO} alt="Wedding" className="absolute inset-0 w-full h-full"
            style={{ objectFit: "contain", objectPosition: "center top" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 70%, var(--paper))" }} />
          {/* Issue label */}
          <div className="absolute top-8 right-8 text-right">
            <p className="font-body text-xs tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.7)" }}>
              Свадьба
            </p>
            <p className="font-display text-lg" style={{ color: "rgba(255,255,255,0.9)" }}>2026</p>
          </div>
        </div>
      </section>

      {/* О событии */}
      <section id="about" className="py-24 px-8 md:px-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-16 items-start">
          <div className="md:col-span-1">
            <Reveal>
              <p className="font-body text-xs tracking-[0.35em] uppercase mb-4" style={{ color: "var(--stone)" }}>01</p>
              <h2 className="font-display text-6xl leading-tight" style={{ color: "var(--ink)" }}>О<br />нас</h2>
            </Reveal>
          </div>
          <div className="md:col-span-2 space-y-10">
            <Reveal delay={100}>
              <p className="font-body text-lg leading-loose" style={{ color: "var(--stone)" }}>
                8 августа 2026 года в нашей жизни состоится важное событие — наша свадьба! Мы приглашаем вас и будем рады провести этот особенный день в кругу самых близких людей!
              </p>
            </Reveal>
            <Reveal delay={200}>
              <div className="grid grid-cols-3 gap-8 pt-6" style={{ borderTop: "1px solid var(--line)" }}>
                {[
                  { n: "08.08", l: "Дата" },
                  { n: "14:40", l: "Начало" },
                  { n: "Уфа", l: "Город" },
                ].map(item => (
                  <div key={item.l}>
                    <p className="font-display text-3xl mb-1" style={{ color: "var(--ink)" }}>{item.n}</p>
                    <p className="font-body text-xs tracking-widest uppercase" style={{ color: "var(--stone)" }}>{item.l}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Место — full bleed photo + overlay */}
      <section id="venue" className="relative overflow-hidden">
        <div className="relative h-[70vh]">
          <img src={IMG_VENUE} alt="Venue" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)" }} />
          <div className="absolute inset-0 flex items-end p-10 md:p-20">
            <Reveal>
              <p className="font-body text-xs tracking-[0.35em] uppercase mb-3" style={{ color: "rgba(255,255,255,0.6)" }}>02 — Место проведения</p>
              <h2 className="font-display text-5xl md:text-7xl mb-4 leading-tight" style={{ color: "#fff" }}>
                Ресторан<br />«Версаль»
              </h2>
              <p className="font-body text-sm mb-6" style={{ color: "rgba(255,255,255,0.7)" }}>
                Уфа, ул. Элеваторная, 13
              </p>
              <a href="https://yandex.ru/maps/?text=Уфа+Элеваторная+13" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-body text-xs tracking-widest uppercase transition-opacity hover:opacity-70"
                style={{ color: "var(--accent-light)", borderBottom: "1px solid var(--accent-light)", paddingBottom: "2px" }}>
                <Icon name="MapPin" size={14} />
                Открыть карту
              </a>
            </Reveal>
          </div>
        </div>

        {/* Транспорт */}
        <div className="bg-white py-12 px-8 md:px-20">
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
            {[
              { icon: "Car", title: "На машине", desc: "Бесплатная парковка на территории ресторана" },
              { icon: "Phone", title: "Вопросы по проезду", desc: "Свяжитесь с нами — поможем добраться" },
            ].map(item => (
              <Reveal key={item.title}>
                <div className="flex gap-4">
                  <div className="mt-1 flex-shrink-0" style={{ color: "var(--accent)" }}>
                    <Icon name={item.icon} size={18} />
                  </div>
                  <div>
                    <p className="font-body text-xs tracking-widest uppercase mb-1" style={{ color: "var(--ink)" }}>{item.title}</p>
                    <p className="font-body text-sm" style={{ color: "var(--stone)" }}>{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Программа */}
      <section id="program" className="py-24 px-8 md:px-16" style={{ background: "var(--ink)" }}>
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <p className="font-body text-xs tracking-[0.35em] uppercase mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>03</p>
            <h2 className="font-display text-6xl mb-16" style={{ color: "var(--paper)" }}>Программа</h2>
          </Reveal>

          <div className="space-y-0">
            {[
              { time: "14:20", title: "Сбор гостей", desc: "Встреча у ЗАГСа Калининского района · ул. Орджоникидзе, 18" },
              { time: "14:40", title: "Регистрация брака", desc: "Торжественная церемония в ЗАГСе Калининского района" },
              { time: "17:00", title: "Банкет", desc: "Праздничный ужин в ресторане «Версаль»" },
              { time: "23:00", title: "Окончание вечера", desc: "До новых встреч!" },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="flex items-start gap-8 py-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  <span className="font-display text-2xl w-20 flex-shrink-0" style={{ color: "var(--accent-light)" }}>
                    {item.time}
                  </span>
                  <div className="flex-1">
                    <p className="font-display text-3xl mb-1" style={{ color: "var(--paper)" }}>{item.title}</p>
                    <p className="font-body text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>{item.desc}</p>
                  </div>
                  <span className="font-body text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>0{i + 1}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Дресс-код */}
      <section id="dresscode" className="py-24 px-8 md:px-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <Reveal>
            <p className="font-body text-xs tracking-[0.35em] uppercase mb-4" style={{ color: "var(--stone)" }}>04 — Дресс-код</p>
            <h2 className="font-display text-6xl leading-tight mb-8" style={{ color: "var(--ink)" }}>
              Стиль<br />вечера
            </h2>
            <p className="font-body text-base leading-loose mb-10" style={{ color: "var(--stone)" }}>
              Мы будем рады нарядам в тёплой, земляной гамме — шоколадных, кремовых, пыльно-розовых и оливковых оттенках. Ваш образ станет частью общей атмосферы праздника.
            </p>
          </Reveal>

          <Reveal delay={150}>
            <img
              src="https://cdn.poehali.dev/projects/40fd3ffb-65ba-4467-a3a2-a57542356d40/bucket/d83d70b5-c5ff-4042-81fc-f133760c4c12.png"
              alt="Дресс-код палитра"
              className="w-full rounded-sm"
              style={{ border: "1px solid var(--line)" }}
            />
          </Reveal>
        </div>
      </section>

      {/* RSVP */}
      <section id="rsvp" style={{ background: "var(--cream-dark)" }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2">
          {/* Left info */}
          <div className="py-24 px-8 md:px-16 flex flex-col justify-center" style={{ background: "var(--accent)", color: "var(--paper)" }}>
            <Reveal>
              <p className="font-body text-xs tracking-[0.35em] uppercase mb-6" style={{ color: "rgba(255,255,255,0.6)" }}>05 — RSVP</p>
              <h2 className="font-display text-5xl mb-6 leading-tight">Подтвердите<br />присутствие</h2>
              <p className="font-body text-sm leading-loose mb-10" style={{ color: "rgba(255,255,255,0.75)" }}>
                Просим ответить до 1 июля 2026 года, чтобы мы могли позаботиться о каждом госте.
              </p>
              <div className="space-y-2">
                <p className="font-body text-xs tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>Контакты</p>
                <p className="font-display text-xl">+7 937 164-63-38 (София)</p>
                <p className="font-display text-xl">+7 996 581-17-69 (Олег)</p>
                <p className="font-display text-xl">@Sonya0336</p>
              </div>
            </Reveal>
          </div>

          {/* Right form */}
          <div className="py-24 px-8 md:px-16 flex flex-col justify-center" style={{ background: "var(--paper)" }}>
            <Reveal>
              <RSVPForm />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Контакты */}
      <section id="contacts" className="py-24 px-8 md:px-16">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <p className="font-body text-xs tracking-[0.35em] uppercase mb-4" style={{ color: "var(--stone)" }}>06 — Контакты</p>
            <h2 className="font-display text-6xl mb-16" style={{ color: "var(--ink)" }}>Связь</h2>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: "Phone", label: "София", value: "+7 937 164-63-38" },
              { icon: "Phone", label: "Олег", value: "+7 996 581-17-69" },
              { icon: "MessageCircle", label: "Telegram", value: "@Sonya0336" },
              { icon: "MapPin", label: "Адрес", value: "Уфа, ул. Элеваторная, 13" },
            ].map((item, i) => (
              <Reveal key={item.label} delay={i * 80}>
                <div className="flex items-start gap-5 py-6" style={{ borderBottom: "1px solid var(--line)" }}>
                  <div style={{ color: "var(--accent)" }}><Icon name={item.icon} size={18} /></div>
                  <div>
                    <p className="font-body text-xs tracking-widest uppercase mb-1" style={{ color: "var(--stone)" }}>{item.label}</p>
                    <p className="font-display text-2xl" style={{ color: "var(--ink)" }}>{item.value}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-8 text-center" style={{ background: "var(--ink)" }}>
        <p className="font-display text-5xl mb-3" style={{ color: "var(--paper)" }}>София & Олег</p>
        <p className="font-body text-xs tracking-[0.4em] uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>
          08 · 08 · 2026 &nbsp;·&nbsp; Уфа
        </p>
      </footer>
    </div>
  );
}