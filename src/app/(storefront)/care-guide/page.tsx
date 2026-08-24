import { Droplets, Sun, Wind, Sparkles, AlertTriangle, Flower2 } from "lucide-react";
import styles from "./care-guide.module.css";

export const metadata = {
  title: "Crochet Care Guide | Hearthside Yarn",
  description: "Keep your handmade crochet pieces beautiful for years — washing, drying, storing and refreshing tips from our studio.",
};

const RULES = [
  {
    icon: Droplets,
    title: "Gentle Washing",
    text: "Hand wash in cool water with mild detergent. Never wring or twist — gently press the water out between folded towels.",
  },
  {
    icon: Sun,
    title: "Dry Flat, Away From Sun",
    text: "Lay pieces flat on a towel to dry, reshaping them while damp. Direct sunlight can fade colors over time.",
  },
  {
    icon: Wind,
    title: "Smart Storage",
    text: "Store folded in a breathable cotton bag with a cedar block or lavender sachet. Never hang crochet — it stretches.",
  },
];

const DOS = [
  "Spot clean small marks instead of full washes",
  "Use a fabric shaver to gently remove pills",
  "Reshape amigurumi stuffing while slightly damp",
  "Air out blankets seasonally instead of frequent washing",
];

const DONTS = [
  "Machine wash or tumble dry — even on gentle",
  "Iron directly on stitches; steam lightly above if needed",
  "Bleach — it yellows fibers and weakens stitches",
  "Store in plastic bags where moisture gets trapped",
];

const PRODUCT_CARE = [
  {
    title: "Amigurumi & Plushies",
    tip: "Surface clean with a damp cloth and a touch of mild soap. For deeper cleaning, hand wash briefly and air-dry over a bottle to keep their shape.",
  },
  {
    title: "Blankets & Throws",
    tip: "Wash once a season or as needed. Soak for 15 minutes, press water out with towels, and dry flat over multiple chairs or a drying rack.",
  },
  {
    title: "Bags & Totes",
    tip: "Empty pockets, spot clean the lining, and stuff with tissue paper while drying so granny squares keep their structure.",
  },
  {
    title: "Flower Arrangements",
    tip: "Our everlasting bouquets need zero water! Dust with a soft makeup brush or cool hairdryer setting — they'll bloom forever.",
  },
];

export default function CareGuidePage() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Hero */}
        <div className={styles.hero}>
          <span className={styles.heroBadge}>
            <Flower2 className={styles.heroBadgeIcon} /> Made to Last
          </span>
          <h1 className={styles.heroTitle}>Crochet Care Guide</h1>
          <p className={styles.heroText}>
            Your handmade piece can stay beautiful for decades. Here&apos;s how we recommend caring for it.
          </p>
        </div>

        {/* Golden rules */}
        <h2 className={styles.sectionTitle}>The Three Golden Rules</h2>
        <div className={styles.rulesGrid}>
          {RULES.map((rule) => (
            <div key={rule.title} className={styles.ruleCard}>
              <span className={styles.ruleIconWrapper}>
                <rule.icon className={styles.ruleIcon} />
              </span>
              <h3 className={styles.ruleTitle}>{rule.title}</h3>
              <p className={styles.ruleText}>{rule.text}</p>
            </div>
          ))}
        </div>

        {/* Do / Don't */}
        <div className={styles.dosDontsGrid}>
          <div className={`${styles.listCard} ${styles.doCard}`}>
            <h3 className={styles.listTitle}>
              <Sparkles className={styles.listTitleIcon} /> Do
            </h3>
            <ul className={styles.list}>
              {DOS.map((item) => (
                <li key={item} className={styles.doItem}>{item}</li>
              ))}
            </ul>
          </div>
          <div className={`${styles.listCard} ${styles.dontCard}`}>
            <h3 className={styles.listTitle}>
              <AlertTriangle className={styles.listTitleIcon} /> Don&apos;t
            </h3>
            <ul className={styles.list}>
              {DONTS.map((item) => (
                <li key={item} className={styles.dontItem}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Product-specific care */}
        <h2 className={styles.sectionTitle}>Care By Piece</h2>
        <div className={styles.productGrid}>
          {PRODUCT_CARE.map((p) => (
            <div key={p.title} className={styles.productCard}>
              <h3 className={styles.productTitle}>{p.title}</h3>
              <p className={styles.productTip}>{p.tip}</p>
            </div>
          ))}
        </div>

        {/* Closing note */}
        <div className={styles.noteBox}>
          <p className={styles.noteText}>
            Every Hearthside piece is made from premium milk cotton chosen for its durability and softness.
            With a little care, your piece will carry warmth through years of everyday love.
          </p>
        </div>
      </div>
    </div>
  );
}
