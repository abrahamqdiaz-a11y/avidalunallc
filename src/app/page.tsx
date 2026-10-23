import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/Icons";
import { HomeExperience, HomeMotion } from "@/components/HomeExperience";
import {
  getArticles,
  getFaqs,
  getPageText,
  getServices,
  getTestimonials,
} from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import "./home.css";

export const revalidate = 3600;
export const metadata: Metadata = pageMetadata({
  title: "Mobile IV Therapy in Lakewood Ranch, FL | Avida Luna Wellness",
  description:
    "Nurse-led mobile IV hydration in Lakewood Ranch, FL. Shary Gonzalez, RN, BSN, brings 17+ years of nursing experience to your home, office or event.",
  path: "/",
});

const previewMenu = [
  {
    name: "Hydration",
    description: "Our starting option for IV hydration.",
    price: 99,
  },
  {
    name: "Athlete Recovery",
    description: "An IV option for your post-training plans.",
    price: 180,
  },
  {
    name: "Energy",
    description: "Personalized IV wellness, with your nurse.",
    price: 180,
  },
  {
    name: "Myers",
    description: "Discuss this IV option with Shary.",
    price: 199,
  },
  {
    name: "Myers with Chromium",
    description: "A Myers option with chromium.",
    price: 240,
  },
];
const Book = () => (
  <Link href="/book" className="home-button">
    Book an appointment <ArrowRightIcon />
  </Link>
);

export default async function HomePage() {
  const [text, faqs, services, testimonials, articles] = await Promise.all([
    getPageText("home"),
    getFaqs(),
    getServices(),
    getTestimonials(),
    getArticles(),
  ]);
  const reading = articles.slice(0, 3);
  const s = text.sections;
  const liveMenu = services.filter(
    (s) => s.category === "iv" && !s.todo && s.showPrice && s.price !== null,
  );
  const menu = liveMenu.length ? liveMenu : previewMenu;
  const questions = [
    "faq-eligibility",
    "faq-before",
    "faq-during",
    "faq-book",
  ].flatMap((id) => faqs.filter((f) => f.id === id));
  return (
    <div className="home-design">
      <HomeMotion />
      <section className="home-hero home-wrap">
        <div className="hero-copy">
          <p className="home-label">
            <span className="label-line" />
            Mobile IV therapy · Lakewood Ranch, FL
          </p>
          <h1>{text.heading}</h1>
          <p className="hero-intro">{text.intro}</p>
          <div className="hero-actions">
            <Book />
            <a className="home-text-link" href="#meet">
              Meet your nurse <ArrowRightIcon className="home-diagonal-arrow" />
            </a>
          </div>
          <p className="hero-credentials">
            RN, BSN <span>·</span> 17+ years in nursing <span>·</span> English &
            Spanish
          </p>
        </div>
        <figure className="hero-portrait">
          <div className="portrait-frame">
            <Image
              src={process.env.BRAND_PORTRAIT || "/brand/shary.webp"}
              alt="Shary Gonzalez, RN, BSN, founder of Avida Luna Wellness"
              fill
              priority
              sizes="(min-width: 900px) 42vw, 100vw"
            />
          </div>
          <figcaption>
            <span>Shamarith “Shary” Gonzalez</span>
            <span>YOUR NURSE. YOUR NEIGHBOR.</span>
          </figcaption>
        </figure>
        <div className="hero-bottom">
          <p>Professional care. Personally delivered.</p>
          <a href="#services">
            Explore the practice <span aria-hidden>↓</span>
          </a>
        </div>
      </section>
      <section
        id="services"
        className="home-services home-wrap home-section"
        data-reveal
      >
        <div className="section-heading">
          <p className="home-label">01 / Care, on your terms</p>
          <h2>{s.services?.heading}</h2>
          <p>
            Experienced hands. Personal attention.
            <br />
            Without the trip to a clinic.
          </p>
        </div>
        <div className="service-editorial">
          <Link href="/services" className="service-main">
            <Image
              src="/services/iv-hydration.webp"
              alt=""
              fill
              className="service-photo"
              sizes="(min-width: 768px) 55vw, 100vw"
            />
            <span className="home-label">THE CORE OF OUR PRACTICE</span>
            <div>
              <h3>
                Mobile IV
                <br />
                hydration
              </h3>
              <p>
                Personalized IV hydration, provided by your nurse at your home,
                office or event.
              </p>
            </div>
            <span className="service-bottom">
              Explore IV services <ArrowRightIcon />
            </span>
          </Link>
          <div className="service-support">
            <Link href="/services#consultation">
              <span className="home-label">LET’S TALK</span>
              <h3>
                Personalized
                <br />
                consultations
              </h3>
              <p>
                Time to discuss your goals and the services that may be right
                for you.
              </p>
              <span className="service-bottom">
                Learn more <ArrowRightIcon />
              </span>
            </Link>
            <Link href="/events">
              <span className="home-label">CARE, TOGETHER</span>
              <h3>
                Group & corporate
                <br />
                wellness
              </h3>
              <p>
                Professional mobile care for your workplace, private group or
                event.
              </p>
              <span className="service-bottom">
                Plan a group visit <ArrowRightIcon />
              </span>
            </Link>
          </div>
        </div>
        <p className="small-addons">
          A little extra, if you’d like.{" "}
          <Link href="/add-ons">
            Explore optional red light and aromatherapy add-ons{" "}
            <ArrowRightIcon className="home-diagonal-arrow" />
          </Link>
        </p>
      </section>
      <section id="meet" className="home-meet" data-reveal>
        <div className="home-wrap meet-grid">
          <figure>
            <div className="meet-photo">
              <Image
                src="/brand/shary-meet.webp"
                alt="Shary Gonzalez, RN, BSN, smiling outdoors in black scrubs"
                fill
                sizes="(min-width: 900px) 36vw, 90vw"
              />
            </div>
            <figcaption>Shary Gonzalez, RN, BSN · Founder</figcaption>
          </figure>
          <div className="meet-copy">
            <p className="home-label">02 / Meet your nurse</p>
            <h2>{s.meet?.heading}</h2>
            <p>{s.meet?.text}</p>
            <div className="meet-credentials">
              <p>Registered Nurse, BSN · 17+ years in nursing</p>
              <p>
                Mental health, women’s health, maternal health,
                <br />
                surgery and neurology
              </p>
              <p>English & Spanish · Se habla español</p>
            </div>
            <Link href="/about" className="home-text-link">
              Get to know Shary <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </section>
      <section id="how" className="home-how home-wrap home-section" data-reveal>
        <div className="section-heading">
          <p className="home-label">03 / How a visit works</p>
          <h2>{s.how?.heading}</h2>
          <p>
            From your first hello
            <br />
            to your own front door.
          </p>
        </div>
        <HomeExperience />
      </section>
      <section className="home-menu" data-reveal>
        <div className="home-wrap home-section">
          <div className="section-heading">
            <p className="home-label">04 / The IV menu</p>
            <h2>
              Clear pricing.
              <br />
              No surprises.
            </h2>
            <p>
              Your options, at a glance.
              <br />
              Your nurse helps you find the right fit.
            </p>
          </div>
          <div className="iv-menu">
            {menu.map((item, i) => (
              <details key={item.name}>
                <summary>
                  <span className="menu-index">0{i + 1}</span>
                  <h3>{item.name}</h3>
                  <span className="menu-price">
                    <small>FROM</small> ${item.price}
                  </span>
                  <span className="menu-plus" aria-hidden>
                    +
                  </span>
                </summary>
                <div className="menu-detail">
                  <p>{item.description}</p>
                  <Link href="/book">
                    Book an appointment <ArrowRightIcon />
                  </Link>
                </div>
              </details>
            ))}
          </div>
          <div className="menu-foot">
            <p>
              {!liveMenu.length
                ? "Starting prices are pending Shary’s confirmation. Final service selection and pricing are on Hydreight."
                : "Service selection and final pricing are confirmed on Hydreight."}
            </p>
            <Link href="/services" className="home-text-link">
              View all services <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </section>
      {testimonials.length > 0 && (
        <section className="home-wrap home-section" data-reveal>
          <p className="home-label">Patient experiences</p>
          <h2>In their own words.</h2>
          <div className="home-quotes">
            {testimonials.map((t) => (
              <figure key={t.id}>
                <blockquote>“{t.quote}”</blockquote>
                <figcaption>{t.firstName}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
      <section className="home-area home-wrap home-section" data-reveal>
        <div>
          <p className="home-label">05 / Close to home</p>
          <h2>{s.areas?.heading}</h2>
          <p>{s.areas?.text}</p>
          <p className="area-note">
            Nearby? Ask us about your location and any travel fee before
            booking.
          </p>
          <Link href="/contact" className="home-text-link">
            Ask about your location <ArrowRightIcon />
          </Link>
        </div>
        <div className="area-map">
          <svg
            viewBox="0 0 620 480"
            role="img"
            aria-labelledby="map-title map-desc"
          >
            <title id="map-title">Lakewood Ranch service area</title>
            <desc id="map-desc">
              A schematic illustration of Lakewood Ranch in Florida. Nearby
              travel availability is confirmed individually; this is not a
              geographic coverage boundary.
            </desc>
            <path
              className="map-water"
              d="M0 0h82l18 95-29 75 40 80-16 80 53 70-4 80H0Z"
            />
            <g className="map-streets">
              <path d="M135 0l32 87-14 114 38 90-6 189M260 0l-12 127 24 86-13 267M390 0l-20 100 25 133-10 247M510 0l-23 130 19 109-25 241M82 95l167 32 121-27 250 20M71 170l201 43 123 20 225 6M111 250l80 41 198 12 231 25M95 330l164 27 247 16 114 24" />
              <path d="M192 0l-7 480M0 400l620 23" />
            </g>
            <path
              className="map-highway"
              d="M316 -10l-18 127 25 118-8 100 21 155"
            />
            <ellipse className="map-area" cx="425" cy="221" rx="112" ry="125" />
            <circle cx="417" cy="221" r="7" className="map-pin" />
            <circle cx="417" cy="221" r="16" className="map-pin-ring" />
            <text x="445" y="217" className="map-name">
              Lakewood
            </text>
            <text x="445" y="239" className="map-name">
              Ranch
            </text>
            <text
              x="35"
              y="310"
              className="map-water-label"
              transform="rotate(-90 35 310)"
            >
              FLORIDA GULF COAST
            </text>
            <text x="304" y="67" className="map-road">
              I-75
            </text>
            <text x="549" y="442" className="map-north">
              N ↑
            </text>
          </svg>
          <p>
            LAKEWOOD RANCH, FL <span>SCHEMATIC · NOT TO SCALE</span>
          </p>
        </div>
      </section>
      {reading.length > 0 && (
        <section
          id="education"
          className="home-education home-wrap home-section"
          data-reveal
        >
          <div>
            <p className="home-label">06 / Wellness education</p>
            <h2>
              Know more.{" "}
              <br />
              Feel at ease.
            </h2>
            <p>
              Plain-language reading from Shary on IV hydration and everyday
              wellness.
            </p>
            <p className="education-note">
              General information, not medical advice. For questions about your
              own health, talk with your healthcare provider.
            </p>
            <Link href="/wellness-education" className="home-text-link">
              All wellness reading <ArrowRightIcon />
            </Link>
          </div>
          <ul className="education-list">
            {reading.map((a, i) => (
              <li key={a.id}>
                <Link href={`/wellness-education/${a.slug}`}>
                  <span className="education-index">0{i + 1}</span>
                  <div>
                    <h3>{a.title}</h3>
                    <p>{a.summary}</p>
                  </div>
                  <ArrowRightIcon className="home-diagonal-arrow" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <section className="home-faq home-wrap home-section" data-reveal>
        <div>
          <p className="home-label">07 / A little clarity</p>
          <h2>{s.faq?.heading}</h2>
          <Link href="/faq" className="home-text-link">
            All your questions <ArrowRightIcon />
          </Link>
        </div>
        <div>
          {questions.map((f) => (
            <details key={f.id}>
              <summary>
                <h3>{f.question}</h3>
                <span aria-hidden>+</span>
              </summary>
              <p>{f.answer}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="home-final">
        <div className="home-wrap">
          <p className="home-label">YOUR PLACE. YOUR PACE. YOUR NURSE.</p>
          <h2>{s.cta?.heading}</h2>
          <div>
            <p>{s.cta?.text}</p>
            <Book />
          </div>
        </div>
      </section>
    </div>
  );
}
