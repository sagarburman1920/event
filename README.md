# RED & REGA Delhi Edition Landing Page

A complete, pixel-perfect clone of the landing page at [skt.zaptriq.in](https://skt.zaptriq.in), built as a self-contained, standalone web project with zero external CMS/WordPress dependencies.

## Features Replicated

- **Top Sticky Banner:** Event date & timing alert (`RED & REGA Delhi Edition · 31 Oct. 2026 · 8:30 AM–6:00 PM`).
- **Hero Section:** Full responsive typography, badges, workshop headlines, and author intro.
- **Hero Video & Poster:** Workshop intro video with custom unmute/sound toggle overlay and responsive aspect ratio (`16:9`).
- **Audience Qualifier:** Pain points ("You are tired of...") vs. Solutions ("And you are ready to...").
- **Event Details & Venue Visuals:** Date, time, venue cards (Holiday Inn, Mayur Vihar, Delhi) with high-res imagery.
- **Pass & Ticket Experience Grid:**
  - **Silver Pass:** ₹3,499 (Theatre style, AM/PM Tea + Lunch, standard access).
  - **Gold Pass:** ₹8,999 (Cluster style, priority networking, partner showcase).
  - **VIP Pass:** ₹20,999 (Sofa seating front row, special dinner with Shashish Kumar Tiwari).
  - Linked to original secure Razorpay checkouts.
- **10 Core Practical Outcomes:** Grid of 10 workshop takeaways with custom SVG icons.
- **Summit Photo Rails:** Horizontal swipeable photo carousels from past summits and keynotes.
- **Meet Your Coach Section:** Shashish Kumar Tiwari biography, quote, speaker highlights, and portrait photo rail.
- **Impact & Recognition Collage:** 14+ years experience, 5M+ lives impacted, award collages with prominent personalities.
- **Awards & Glory Gallery:** High-resolution achievement photo showcase (Aarambh Bharat Award, Best Motivational Award, etc.).
- **Professional Edge Pillars:** 6-pillar breakdown with custom SVG visuals.
- **Interactive FAQ Accordion:** Expanding questions and answers with pure HTML5 details/summary styling.
- **Contact & Final Booking CTA Banner:** Dark navy gold-bordered callout with direct call/email links.
- **Sticky Bottom Mobile Bar:** Appears dynamically on scroll with quick booking action.
- **Floating WhatsApp Widget:** Direct WhatsApp chat link for attendee queries.

## Project Structure

```
skt-landing-page/
├── index.html          # Cleaned, standalone landing page HTML
├── landing.css         # Complete Tailwind + custom component styling
├── mobile.css          # Responsive mobile optimizations & ticket layout
├── checkout.js         # Interactive behavior (video sound, sticky bar, passes)
├── server.js           # Built-in lightweight HTTP server with MP4 range streaming
├── assets/             # 109 local media files (images, SVGs, posters, video)
├── package.json        # Node npm scripts
└── README.md           # Documentation
```

## How to Run

### Option 1: Using Built-in Server (Recommended)
From this directory:
```bash
npm start
# Or: node server.js
```
Then open your browser to [http://localhost:3000](http://localhost:3000).

### Option 2: Open Directly in Browser
You can directly open `index.html` in Chrome, Edge, or Safari:
```bash
start index.html
```
