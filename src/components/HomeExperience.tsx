"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  {
    label: "Request",
    title: "A little about you. Then a time that works.",
    text: "Share your name and email. Continue to Hydreight to choose your IV and appointment time. No health information is collected on this website.",
    detail: "01 / YOUR DETAILS",
    visual: "Your care starts with a conversation.",
    note: "A simple first step. About 30 seconds.",
  },
  {
    label: "Assessment",
    title: "Professional care starts with listening.",
    text: "Complete your confidential health screening on Hydreight. Before your IV begins, Shary reviews it with you and checks that the service is a good fit.",
    detail: "02 / BOOKING & SCREENING",
    visual: "Personal attention. From the very beginning.",
    note: "Medical screening happens securely on Hydreight.",
  },
  {
    label: "Visit",
    title: "Your place. Your nurse. Your time.",
    text: "Shary comes to your home, office or event in the Lakewood Ranch area and stays with you throughout your visit.",
    detail: "03 / YOUR VISIT",
    visual: "Professional care. Personally delivered.",
    note: "Optional add-ons can be arranged after booking.",
  },
];

export function HomeExperience() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const elements = root.current?.querySelectorAll<HTMLElement>("[data-step]");
    if (!elements) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting)
            setActive(Number((entry.target as HTMLElement).dataset.step));
      },
      { rootMargin: "-25% 0px -35% 0px", threshold: 0 },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  return (
    <div className="visit-story" ref={root}>
      <div className="visit-visual" aria-hidden="true">
        <p className="home-label">{steps[active].detail}</p>
        <div className="visit-drawing">
          <span className="visit-orbit" />
          <span className="visit-point" />
          <span className="visit-path" />
        </div>
        <p className="visit-message">{steps[active].visual}</p>
        <p className="visit-note">{steps[active].note}</p>
        <div className="visit-progress">
          {steps.map((step, i) => (
            <span key={step.label} className={i <= active ? "is-active" : ""} />
          ))}
        </div>
      </div>
      <ol className="visit-steps">
        {steps.map((step, i) => (
          <li
            key={step.label}
            data-step={i}
            className={i === active ? "is-active" : ""}
          >
            <span className="step-index">0{i + 1}</span>
            <div>
              <p className="home-label">{step.label}</p>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function HomeMotion() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-seen");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    document
      .querySelectorAll(".home-design [data-reveal]")
      .forEach((element) => observer.observe(element));
    const update = () => {
      document.body.classList.toggle("home-scrolled", window.scrollY > 60);
      const hero = document.querySelector(".home-hero");
      document.body.classList.toggle(
        "home-past-hero",
        !!hero && hero.getBoundingClientRect().bottom < 80,
      );
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", update);
      document.body.classList.remove("home-scrolled", "home-past-hero");
    };
  }, []);
  return null;
}
