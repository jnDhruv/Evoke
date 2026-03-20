# D.A.S.H. – Disruption Aware Safety Harbour

## Table of Content

## Problem Statement

India's gig economy is built on the backs of millions of food delivery riders working for platforms like Zomato and Swiggy. 

These riders operate as independent contractors — earning per order, with no fixed salary, no employer benefits, and no financial safety net of any kind. Their income is entirely dependent on their ability to ride disruptions cause gig workers to lose anywhere between 20–30% of their monthly earnings, yet not a single rupee of that loss is compensated by anyone.

## Target Persona

Zomato and Swiggy riders spend their entire working day outdoors on two-wheelers with no indoor alternative.

Every disruption we cover hits them directly:

- Heavy rain makes roads dangerous, halting deliveries entirely
- Extreme heat makes prolonged outdoor riding physically impossible
- Severe AQI forces riders off the road with no indoor fallback
- Curfews and bandhs shut down both restaurants and customers simultaneously

With no base wage and no employer safety net, a disrupted day is simply a day of zero income.

## What we’re solving?

When a disruption hits, a Zomato rider has **three options** - ride anyway and risk their safety, stay home and absorb the full financial loss, or borrow money to cover daily expenses.  

We are building that **fourth option** — an AI-powered parametric insurance platform that automatically detects disruptions in a rider's operative zone, triggers a claim without any action from the rider, and processes an income replacement payout instantly. No forms, no waiting, no friction.

## How we are doing this ?

We are building dash which provides gig workers with premiums dynamically calculated using historical weather, AQI, and civil disruption data specific to their operative zone.

When a disruption is detected in a rider's zone, DASH automatically calculates the income they were unable to earn based on their historical average earnings. We flag affected areas and for how they were affected then at the end of each affected day, the compensation is transferred directly to their UPI account.

```
Compensation = Average hourly wage × Hours lost to disruption
```

## Key Features

- **Dynamic premium calculation :** Riders in historically high-risk zones pay a higher premium, riders in safer zones pay less.
- **Real-time zone disruption scoring :** Every active pin code is assigned a live disruption score, recalculated every 15 minutes using three real-time data sources:
    - Weather API — current rainfall, temperature, and AQI readings for that zone
    - Traffic data — road accessibility and congestion levels indicating whether movement is possible
    - RSS feeds — active curfew, bandh, or strike alerts for that specific area
- **Automated end-of-day compensation :** At the end of each disrupted day, DASH automatically identifies all active subscribers within flagged pin codes and calculates their payout. Payment is credited directly to the rider's UPI account overnight.
- **GPS spoof-resistant fraud detection:** Since triggers are zone-based and derived entirely from external APIs , not rider-reported location, there is nothing for a rider to spoof.
- **Rider-friendly onboarding :** Designed for low digital literacy — simple PWA-based signup, weekly payments auto-deducted and credited via UPI.

## System Workflow

### 1. User Registration Flow

The onboarding process is designed to be **fast, low-friction, and fraud-resistant**, ensuring only genuine food delivery partners are registered.

#### Step 1: Basic Details (User Input)

- Full Name
- Mobile Number (**OTP verified**)
- Email ID

#### Step 2: Identity Verification (KYC)

- Aadhar Card / PAN Card upload
- Live selfie capture (face verification with ID)

> Ensures authenticity and prevents duplicate/fake accounts.
> 

#### Step 3: Address & Zone Mapping

- PIN Code (primary working area)

> Used to map the user to a **risk-rated zone** for premium calculation and payouts.
> 

#### Step 4: Platform Verification

- Select platform (Zomato / Swiggy)
- Upload proof:
    - Screenshot of delivery partner profile / ID

> Confirms that the user is an **active food delivery partner**.
> 

#### Step 5: Payment Setup

- Bank Account Details **or** UPI ID

> Used for:
> 
- Automatic premium deduction
- Direct payout disbursement

### 2. Premium Model Work Flow

#### **Step 1 — Rider onboarding**

When a rider signs up, they provide their operative pin code and city. This is used for future premium calculation and compensation decisions.

#### **Step 2 — Weekly premium calculation (runs every Monday)**

Every week, DASH automatically recalculates the rider's premium using two factors:

- **Zone risk score** — derived from historical weather data for that pin code. How frequently has that zone experienced heavy rain, extreme heat, severe AQI, or civil disruptions over the past 1–3 years?
    
     Higher frequency = higher risk score = higher premium.
    
- **City economic index** — a baseline multiplier derived from the economic profile of the rider's city. A rider operating in Mumbai or Pune (Maharashtra) has a higher earning potential than one in a smaller UP city, meaning their income loss per disrupted hour is greater, and the premium reflects that.

Premium = Base rate × Zone risk score × City economic multiplier

#### **Step 3 — Auto-deduction**

The calculated weekly premium is automatically deducted every Monday via UPI mandate.

![image.png](docs/diagrams/premium_calc_workflow.jpeg)

### 3. Payout Flow

#### **Step 1 — Pin code flagging**

When a zone's score crosses the disruption threshold, it is flagged as unworkable. It remains flagged and re-evaluated every 15 minutes until conditions normalise.

#### **Step 2 — End of day:  Rider matching**

At the end of each day, DASH identifies riders eligible for compensation by applying two checks:

- App status was active during the disruption window : the rider was online and ready to accept orders but could not
- Historical delivery locations confirm the rider regularly operates in the flagged zone — preventing compensation claims for zones a rider has never worked in

#### **Step 3 — UPI payout**

Compensation is automatically credited to the rider's UPI account. No claim form, no manual intervention.

![image.png](docs/diagrams/payout_workflow.jpeg)

## Fraud Detection

DASH architecture is inherently fraud-resistant because:

- Triggers come from external APIs — not rider-reported, so there is nothing to manipulate
- Riders must be app-active during the disruption — they can't claim retroactively
- Historical delivery locations must match the flagged zone — a rider can't claim for a zone they've never worked in

These three together eliminate the majority of fraudulent claims without any dedicated fraud layer.

**Duplicate claim prevention :** A rider can only receive one payout per disruption event per day. Even if multiple zones they operate in are flagged simultaneously, the system calculates one combined payout — preventing double dipping.

## MODELS

#### **NLP Model — Social Disruption Score**

RSS feeds from local news sources are continuously monitored for civil disruption events — curfews, bandhs, strikes, road blockages, and protest activity. Raw news text is unstructured and noisy, so a dedicated NLP model processes it to extract three things:

**1. Event classification** — is this article reporting an active disruption or just discussing a past one? The model distinguishes between "curfew imposed in Dharavi today" versus "curfew was lifted last week."

**2. Location extraction** — which specific area, district, or pin code does this event affect? The model maps the mentioned locality to the corresponding pin codes in DASH's operative zone database.

**3. Severity scoring** —  A full curfew scores higher than a localised road blockage. The model assigns a severity score based on the nature and scale of the reported event.

> Social disruption score = f(event type, affected area, severity)
> 

A pin code receiving a high social disruption score is flagged as delivery-impossible for that time window, feeding directly into the index calculation model alongside weather and traffic data.

***Social disruption score and weather score from weather api is then used to flag the pincodes***

#### **Index Calculation Model — Pin Code Disruption Score**

The index model runs every 15 minutes, combining inputs from three real-time sources for each pin code:

- **Weather score** — derived from live weather API data, reflecting rain intensity, temperature, and AQI levels in that zone
- **Traffic score** — derived from live traffic data, reflecting road accessibility and movement possibility
- **Social disruption score** — derived from the NLP model, reflecting active curfews, bandhs, or strikes in that area

Rather than averaging these scores together, the model takes the dominant score — the highest of the three. This is intentional: a zone only needs one condition to make delivery impossible. A clear sunny day with a curfew is just as unworkable as a flooded road with no civil disruption.

> Zone disruption score = max(weather score, traffic score, social disruption score)
> 

#### Compensation engine

Every night at 12:00 a.m., DASH runs the compensation engine:

**Step 1 — Fetch affected areas**
All pin codes that were flagged at least once during that day are retrieved.

**Step 2 — Fetch affected riders**
For each flagged pin code, DASH identifies all riders associated with that zone using their registered operative area and historical delivery locations.

**Step 3 — Match flags to rider activity**
Since pin codes are flagged every 15 minutes, each flag represents a 15-minute disruption window. For each rider, DASH cross-references the flagged timestamps against the rider's active timestamps retrieved from the mock platform API. Only timestamps where both conditions are true — zone was flagged AND rider was active — are counted as Valid Flags.

**Step 4 — Calculate compensation**

> Compensation = Valid_Flags × (Avg_Hourly_Earning / 4)
> 

Where:

- Valid_Flags = number of 15-minute windows where the rider was active in a disrupted zone
- Avg_Hourly_Earning / 4 = the rider's earning rate per 15-minute window, retrieved from mock platform API

**Step 5 — UPI payout**
The calculated amount is automatically credited to the rider's UPI account with zero manual intervention

## Tech Stack

| Requirement | Technology | Costing |
| --- | --- | --- |
| Frontend | React.js + Tailwind CSS | Free |
| Backend | Node.js + Express.js + Python | Free |
| Database | Supabase PostgreSQL | Free Tier |
| Authentication | Firebase Auth (OTP) | Free Tier |
| Weather Data | OpenWeatherMap API | Free Tier |
| Traffic Data | Google Maps API | Limited Free |
| Platform data  | Mock API | Free |
| News / Social Feed | RSS + Python feedparser | Free Tier |
| Payments (UPI) | Razorpay / Cashfree | Transaction-based |
| Hosting (Frontend) | Vercel | Free |
| Hosting (Backend) | Render / Railway | Free Tier |
| Storage (Docs/Images) | Cloudinary / Firebase Storage | Free Tier |

## Platform Choice

DASH is designed as a **Progressive Web App (PWA)** rather than a native mobile application.

#### Why PWA instead of native apps?

Most food delivery partners:

- Use **low to mid-range Android devices**
- Have **limited storage availability**
- Prefer **fast onboarding without installing large apps**
- Work in areas with **unstable network connectivity**

A PWA allows:

- No app-store download required
- Instant access via browser
- Lightweight performance on low-end devices
- Offline fallback support for unstable connectivity
- Faster development and deployment during early rollout

This makes PWA the most practical and scalable solution for deployment.

## Development Plan

DASH will be developed in three phases.

### Phase 1 — Foundation

Goal: Get the core infrastructure and onboarding working.

- Set up project repository and tech stack
- Build rider onboarding system — pin code, city, UPI mandate registration
- Integrate OpenWeatherMap API and RSS feedparser for live data ingestion
- Build the basic zone scoring model — weather score and social disruption score per pin code
- Set up PostgreSQL schema for riders, zones, flags, and payouts
- Basic frontend dashboard for riders showing their coverage status

### Phase 2 — Premium Automation & Claim Triggering

Goal: Get the real-time flagging, ML models, and compensation engine working end to end.

Includes:

- Build the 15-minute zone re-evaluation cron job
- Build and integrate the NLP model for RSS social disruption scoring
- Build the prediction model for weekly premium calculation using historical weather data
- Build the index calculation model — combining weather, traffic, and social scores using dominant score logic
- Build the midnight compensation engine — fetch flagged zones, match riders, calculate Valid_Flags × (Avg_Hourly_Earning / 4)
- Integrate Razorpay test mode for simulated UPI payouts
- Mock platform API for rider active timestamps and average hourly earnings

**Outcome:**

Dynamic weekly premium + **zero-touch claim** eligibility workflow.

---

### **Phase 3 — Polish & Scale**

Goal: Fraud detection, dashboards, and final submission preparation.

- Build the insurer/admin analytics dashboard — flagged zones, active disruptions, payout volumes, loss ratios
- Final polish on rider dashboard — compensation history, active coverage, weekly premium breakdown
- End-to-end testing with simulated disruption scenarios