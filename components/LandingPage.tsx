"use client";

import Link from "next/link";
import { Lato, Playfair_Display } from "next/font/google";
import { useEffect, useState } from "react";
import "@/app/landing.css";

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const FAQ_ITEMS = [
  {
    q: "How long does it take to fill out the form?",
    a: "Most team parents finish the entire roster in 15–20 minutes. The fun facts and parent quotes are optional but they make the profiles significantly better, so it's worth taking an extra few minutes.",
  },
  {
    q: "What if I don't have all the stats?",
    a: "No problem. Stats help, but they're optional. A season highlight, a memorable moment, or even just a description of how the player contributed works just as well. The profiles are built around personality as much as performance.",
  },
  {
    q: "Can I edit the profiles once they're generated?",
    a: "Yes. You get a chance to review every profile before your final PDF is produced. If something doesn't sound right, just let us know and we'll revise it.",
  },
  {
    q: "What sports do you support?",
    a: "Baseball, softball, soccer, football, basketball, lacrosse, hockey, volleyball, and more. If your sport isn't listed, reach out — we handle custom requests all the time.",
  },
  {
    q: "How many players can I include?",
    a: "There's no hard limit. Most teams run 12–20 players and the pricing covers any size. Large travel programs with multiple rosters should contact us for custom pricing.",
  },
  {
    q: "Is there a money-back guarantee?",
    a: "Absolutely. If you're not happy with the profiles, we'll rewrite them. If you're still not happy, we'll give you a full refund. We want parents to cry happy tears, not regret the purchase.",
  },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const root = document.querySelector(".landing-root");
    if (!root) return;
    const els = root.querySelectorAll(
      ".how-step, .sample-card, .pricing-card, .testimonial-card"
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = "1";
            (entry.target as HTMLElement).style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => {
      (el as HTMLElement).style.opacity = "0";
      (el as HTMLElement).style.transform = "translateY(24px)";
      (el as HTMLElement).style.transition =
        "opacity 0.5s ease, transform 0.5s ease";
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`landing-root ${lato.className} ${playfair.variable}`}>
      <nav>
        <Link href="/" className="nav-logo">
          Season<span>Remembered</span>
        </Link>
        <Link href="/create" className="nav-cta">
          Get Started
        </Link>
      </nav>

      <section className="hero">
        <div className="hero-left">
          <div className="hero-badge">End-of-Season Memory Books</div>
          <h1 className="hero-headline">
            Every Kid Deserves to Be
            <em>Remembered.</em>
          </h1>
          <p className="hero-sub">
            Beautiful, personalized memory books for your entire team — ready
            in <strong>24 hours</strong>. Every player gets their own story,
            written like they were the star of the season.
          </p>
          <div className="hero-actions">
            <Link href="/create" className="btn-primary">
              Create Your Book
            </Link>
            <a href="#samples" className="btn-ghost">
              See sample profiles →
            </a>
          </div>
          <div className="hero-social-proof">
            <div className="avatars">
              <div className="avatar">👩</div>
              <div className="avatar">👨</div>
              <div className="avatar">👩</div>
              <div className="avatar">👨</div>
            </div>
            <div className="social-text">
              <strong>Loved by 200+ coaches & team parents</strong>
              Parents say it made them cry. In a good way.
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div style={{ position: "relative", padding: "30px 40px 30px 20px" }}>
            <div className="floating-badge top-right">
              <div className="badge-emoji">⚡</div>
              <div className="badge-label">Ready in 24hrs</div>
              <div className="badge-sub">Just fill in the form</div>
            </div>

            <div className="floating-badge bottom-left">
              <div className="badge-emoji">❤️</div>
              <div className="badge-label">&quot;My son cried&quot;</div>
              <div className="badge-sub">— Team Parent, IL</div>
            </div>

            <div className="book-mockup">
              <div className="book-cover">
                <div className="book-cover-number">⚾</div>
                <div className="book-cover-tag">2025 Season</div>
                <div className="book-cover-title">
                  Fort Atkinson
                  <br />
                  Fury
                </div>
                <div className="book-cover-sub">Little League Baseball</div>
                <div className="book-cover-season">Spring 2025 · 14-2</div>
              </div>
              <div className="book-pages">
                <div className="player-entry">
                  <div className="player-number-badge">7</div>
                  <div>
                    <div className="player-name-line">
                      Jake Morrison
                      <span className="player-pos">SS</span>
                    </div>
                    <div className="player-text-preview">
                      From the first crack of his bat in March to the final out
                      of the championship game, Jake was the heartbeat of this
                      infield...
                    </div>
                  </div>
                </div>
                <div className="player-entry">
                  <div className="player-number-badge">12</div>
                  <div>
                    <div className="player-name-line">
                      Mia Rodriguez
                      <span className="player-pos">P / CF</span>
                    </div>
                    <div className="player-text-preview">
                      Ask any opposing coach what they feared most about the
                      Fury, and the answer was always the same: number
                      twelve...
                    </div>
                  </div>
                </div>
                <div className="player-entry">
                  <div className="player-number-badge">3</div>
                  <div>
                    <div className="player-name-line">
                      Tyler Chen
                      <span className="player-pos">1B</span>
                    </div>
                    <div className="player-text-preview">
                      Tyler brought more than a steady glove to first base — he
                      brought an energy that lifted the whole dugout...
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="how">
        <div className="section-label">How It Works</div>
        <h2 className="section-title">
          Three steps.
          <br />
          {"One book they'll keep forever."}
        </h2>
        <p className="section-sub">
          No design skills needed. No hours of writing. Just fill in the
          details and we handle everything.
        </p>

        <div className="how-grid">
          <div className="how-step">
            <div className="step-num">01</div>
            <span className="step-icon">📋</span>
            <div className="step-title">Fill In Your Roster</div>
            <div className="step-text">
              Enter each player&apos;s name, position, jersey number, season
              stats, a few fun facts, and an optional note from their parents.
              Takes about 15 minutes for a full team.
            </div>
          </div>
          <div className="how-step">
            <div className="step-num">02</div>
            <span className="step-icon">✨</span>
            <div className="step-title">We Write Every Profile</div>
            <div className="step-text">
              Our AI writes a warm, specific, 150-word profile for every single
              player — unique to them, not generic. Reads like it was written
              by someone who watched every game.
            </div>
          </div>
          <div className="how-step">
            <div className="step-num">03</div>
            <span className="step-icon">📖</span>
            <div className="step-title">{"Print & Hand Out"}</div>
            <div className="step-text">
              Download your print-ready PDF or let us ship physical copies
              straight to you. Hand them out at the end-of-season party and
              watch the parents&apos; faces.
            </div>
          </div>
        </div>
      </section>

      <section className="sample-section" id="samples">
        <div className="section-label">Sample Profiles</div>
        <h2 className="section-title">
          This is what your
          <br />
          kids will read.
        </h2>
        <p className="section-sub">
          Real sample outputs — specific, warm, and written like they actually
          matter. Because they do.
        </p>

        <div className="sample-grid">
          <div className="sample-card">
            <div className="sample-player-header">
              <div className="sample-player-num">7</div>
              <div>
                <div className="sample-player-name">Jake Morrison</div>
                <div className="sample-player-pos">
                  #7 · Shortstop · Baseball
                </div>
              </div>
            </div>
            <p className="sample-text">
              From the first crack of his bat in March to the final out of the
              championship game, Jake Morrison was the quiet heartbeat of this
              infield. Playing shortstop with a maturity far beyond his years,
              Jake committed just two errors in eighteen games — a stat that
              tells you something, but not everything. What the stat sheet
              can&apos;t capture is the way he&apos;d call off the second
              baseman with a calm &quot;I got it&quot; that settled the whole
              infield, or how he&apos;d be first to the mound when a pitcher
              needed a word. His .385 average was impressive. His leadership
              was unforgettable. Jake, your love of post-game pizza is already
              legendary, but what this team will remember most is that you
              always played like the team was counting on you — because they
              were.
            </p>
            <div className="sample-sport-tag">⚾ Little League Baseball</div>
          </div>

          <div className="sample-card">
            <div className="sample-player-header">
              <div
                className="sample-player-num"
                style={{ background: "#2d5a27" }}
              >
                9
              </div>
              <div>
                <div className="sample-player-name">Sofia Patel</div>
                <div className="sample-player-pos">
                  #9 · Midfielder · Soccer
                </div>
              </div>
            </div>
            <p className="sample-text">
              Sofia Patel runs like she has something to prove, and she usually
              does. Stationed in the center of the park, she covered more grass
              this season than anyone on the roster — her coach&apos;s stats
              showing she averaged 5.4 miles per game across twelve matches.
              But raw distance doesn&apos;t tell the Sofia Patel story.
              It&apos;s the recovery sprint at minute seventy-eight when
              everyone else was fading. It&apos;s the dropped shoulder that sent
              defenders the wrong way so many times this fall. Sofia racked up
              six assists and three goals this season, but ask her teammates
              what her best quality was and they&apos;ll say the same thing:
              she made everyone around her better. She wants to play in college
              one day. Those who watched her this fall already believe she will.
            </p>
            <div className="sample-sport-tag">⚽ Youth Soccer</div>
          </div>

          <div className="sample-card">
            <div className="sample-player-header">
              <div
                className="sample-player-num"
                style={{ background: "#7f1d1d" }}
              >
                44
              </div>
              <div>
                <div className="sample-player-name">Marcus Williams</div>
                <div className="sample-player-pos">
                  #44 · Running Back · Football
                </div>
              </div>
            </div>
            <p className="sample-text">
              There&apos;s a certain type of player who doesn&apos;t just run
              through a hole — they create one where none existed. Marcus
              Williams is that player. In nine games this fall, Marcus rushed
              for 612 yards and seven touchdowns, numbers that alone would earn
              a spot in any memory book. But what defines Marcus&apos;s season
              isn&apos;t the touchdowns. It&apos;s the way he&apos;d walk back
              to the huddle after a big hit and tap his helmet twice — his
              signal that he was fine, the team was fine, they were all fine.
              His teammates knew it meant: stay in it. Marcus is the kind of
              kid who will be somebody&apos;s favorite memory of youth football
              for the rest of their lives. His parents put it best: &quot;He
              plays the game the way we want him to live his life.&quot;
            </p>
            <div className="sample-sport-tag">🏈 Youth Football</div>
          </div>

          <div className="sample-card">
            <div className="sample-player-header">
              <div
                className="sample-player-num"
                style={{ background: "#1e3a8a" }}
              >
                23
              </div>
              <div>
                <div className="sample-player-name">Emma Thornton</div>
                <div className="sample-player-pos">
                  #23 · Point Guard · Basketball
                </div>
              </div>
            </div>
            <p className="sample-text">
              Some players score. Some players pass. Emma Thornton does both,
              but what she really does is see the game two seconds before
              everyone else. As the starting point guard for all fourteen games
              this winter, Emma averaged 11 points and 7 assists per outing — a
              combination that put her among the best in the league at her age.
              She spent most of her pregame routine drawing plays on the locker
              room whiteboard, which her coach noticed and started incorporating
              into their actual gameplan. Her lucky number is 23 and her pregame
              ritual involves exactly four songs, in order, every time. Emma
              dreams of coaching one day. Watch her run a pick-and-roll at
              thirteen years old and you&apos;ll understand why she&apos;d be
              extraordinary at it.
            </p>
            <div className="sample-sport-tag">🏀 Youth Basketball</div>
          </div>
        </div>
      </section>

      <section className="pricing-section" id="pricing">
        <div style={{ textAlign: "center", marginBottom: 0 }}>
          <div className="section-label">Simple Pricing</div>
          <h2 className="section-title">
            One team. One price.
            <br />
            Memories that last forever.
          </h2>
          <p className="section-sub" style={{ margin: "0 auto" }}>
            No subscription. No per-player fees. Pay once, download instantly.
          </p>
        </div>

        <div className="pricing-grid">
          <div className="pricing-card">
            <div className="pricing-name">Digital</div>
            <div className="pricing-price">
              <sup>$</sup>97
            </div>
            <div className="pricing-desc">
              Print-ready PDF delivered in 24 hours. Perfect for Staples or home
              printing.
            </div>
            <ul className="pricing-features">
              <li>Personalized profile for every player</li>
              <li>Coach intro letter</li>
              <li>Season recap narrative</li>
              <li>Your choice of 4 design themes</li>
              <li>Print-ready PDF (8.5×11)</li>
              <li>Unlimited downloads</li>
            </ul>
            <Link href="/create" className="btn-pricing">
              Get Digital Book
            </Link>
          </div>

          <div className="pricing-card featured">
            <div className="pricing-tag">Most Popular</div>
            <div className="pricing-name">{"Printed & Shipped"}</div>
            <div className="pricing-price">
              <sup>$</sup>197
            </div>
            <div className="pricing-desc">
              Professional print copies shipped to your door, ready to hand out
              at the party.
            </div>
            <ul className="pricing-features">
              <li>Everything in Digital, plus:</li>
              <li>25 professionally printed copies</li>
              <li>Spiral-bound or saddle-stitched</li>
              <li>Full-color throughout</li>
              <li>Shipped in 3–5 business days</li>
              <li>Extra copies at $6 each</li>
            </ul>
            <Link href="/create" className="btn-pricing">
              Get Printed Books
            </Link>
          </div>

          <div className="pricing-card">
            <div className="pricing-name">Premium Yearbook</div>
            <div className="pricing-price">
              <sup>$</sup>297
            </div>
            <div className="pricing-desc">
              The full experience — includes a time capsule letter for each
              player to open at graduation.
            </div>
            <ul className="pricing-features">
              <li>Everything in Printed, plus:</li>
              <li>Time capsule letter per player</li>
              <li>Custom team cover photo page</li>
              <li>Extended 250-word profiles</li>
              <li>Digital slideshow video add-on</li>
              <li>Priority 12-hour turnaround</li>
            </ul>
            <Link href="/create" className="btn-pricing">
              Get Premium Book
            </Link>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <div style={{ textAlign: "center" }}>
          <div className="section-label">What Parents Are Saying</div>
          <h2 className="section-title">
            The reaction at the
            <br />
            end-of-season party.
          </h2>
        </div>

        <div className="testimonial-grid">
          <div className="testimonial-card">
            <div className="stars">★★★★★</div>
            <p className="testimonial-text">
              &quot;I ordered this on a whim and I am so glad I did. My son
              read his profile four times on the way home. He asked me to frame
              it. This is going on his wall.&quot;
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">👩</div>
              <div>
                <div className="author-name">Jennifer M.</div>
                <div className="author-role">Baseball mom · Naperville, IL</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="stars">★★★★★</div>
            <p className="testimonial-text">
              &quot;As a coach I&apos;ve done end-of-season speeches for 12
              years. This is the first time I&apos;ve seen every single parent
              get emotional at the same time. The profiles were that good.&quot;
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">👨</div>
              <div>
                <div className="author-name">Coach Dave T.</div>
                <div className="author-role">Youth soccer · Madison, WI</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="stars">★★★★★</div>
            <p className="testimonial-text">
              &quot;I sent it to my daughter&apos;s grandparents who live across
              the country. My mother-in-law called me crying. Worth every penny
              and then some.&quot;
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">👩</div>
              <div>
                <div className="author-name">Rachel K.</div>
                <div className="author-role">
                  Softball mom · Fort Atkinson, WI
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div>
          <div className="section-label">Questions</div>
          <h2 className="section-title">Everything you need to know.</h2>
          <p className="section-sub">
            Still have a question? Email us at hello@seasonremembered.com
          </p>
        </div>

        <div className="faq-list" id="faq">
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={item.q}
              className={`faq-item${openFaq === i ? " open" : ""}`}
            >
              <div
                className="faq-q"
                role="button"
                tabIndex={0}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOpenFaq(openFaq === i ? null : i);
                  }
                }}
              >
                {item.q} <span className="arrow">▼</span>
              </div>
              <div className="faq-a">{item.a}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <div className="section-label">
          Don&apos;t Let the Season End Without It
        </div>
        <h2 className="final-cta-title">
          The game ends.
          <br />
          The memory doesn&apos;t have to.
        </h2>
        <p className="final-cta-sub">
          Every parent on your team will thank you. Every kid will remember it.
          Takes 15 minutes to order.
        </p>
        <Link href="/create" className="btn-primary">
          Create Your Memory Book
        </Link>
        <p className="final-guarantee">
          30-day money-back guarantee · No subscription · Delivered in 24 hours
        </p>
      </section>

      <footer>
        <Link href="/" className="footer-logo">
          Season<span>Remembered</span>
        </Link>
        <div className="footer-links">
          <a href="#how">How It Works</a>
          <a href="#samples">Sample Profiles</a>
          <a href="#pricing">Pricing</a>
          <a href="#">Contact</a>
          <a href="#">Privacy</a>
        </div>
      </footer>
    </div>
  );
}
