**STROLLABLE**

Product Requirements Document

Version 1.0 \| March 2026

*Helping parents navigate the city with confidence.*

**1. Product Vision**

Strollable is the definitive trust layer for parents navigating cities with strollers. It is a mobile-first, community-powered map app that helps parents discover baby-friendly restaurants, cafes, and shops --- with verified, crowd-sourced information on the three things that actually matter: step-free entry, an accessible bathroom, and change table availability.

The north star: what percentage of stroller-accessible spots in a given city does Strollable have accurate, community-verified data on? That number --- not downloads, not revenue --- is the leading indicator of whether the product is delivering on its promise.

+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| **Long-Term Vision**                                                                                                                                                                                                                                        |
|                                                                                                                                                                                                                                                             |
| Strollable becomes the AllTrails of urban parenting --- a beloved, free community resource that parents trust completely, sustained by a modest premium tier and driven by a contributor community that takes pride in the data they collectively maintain. |
+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

**2. The Problem**

New parents --- particularly those on parental leave --- spend significant time in their neighbourhood. They want to explore the city: try new cafes, meet friends at restaurants, run errands. But navigating the city with a stroller is full of invisible friction.

The three core pain points, in order of severity:

  --------------------------- ---------------------------------------------------------------------------------------------------------------------------------------
  **Pain Point**              **Description**

  **Inaccessible entry**      Raised entryways, single steps, or narrow doorways that prevent stroller access entirely.

  **Bathroom doesn\'t fit**   The restroom is technically accessible but too narrow for a stroller --- forcing the parent to leave it outside or abandon the visit.

  **No change table**         No dedicated space to change a baby, forcing improvisation in bathrooms, on seats, or on the floor.
  --------------------------- ---------------------------------------------------------------------------------------------------------------------------------------

Google Maps has partial wheelchair accessibility data (entrance width, restroom access) but no change table field. Yelp and Google Reviews surface this information incidentally through written reviews --- unreliably, and not filterable. The result: parents learn the hard way, or they stop exploring.

+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| **Founder\'s Note**                                                                                                                                                                                                                                                                                                                                             |
|                                                                                                                                                                                                                                                                                                                                                                 |
| This product was born from personal experience. As a new mom on mat leave in Toronto, I kept arriving at spots only to discover the stroller couldn\'t get through the door, the bathroom was too narrow, or there was nowhere to change my baby. I wanted a tool that would surface this information before I left the house. It didn\'t exist. So I built it. |
+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

**3. Users**

**3.1 Primary User --- Parents**

Parents with infants navigating urban environments with strollers. Predominantly on parental leave or part-time work arrangements. High daytime availability. High motivation to discover safe, comfortable places to spend time outside the home.

+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| **Scope Note**                                                                                                                                                                                                                                   |
|                                                                                                                                                                                                                                                  |
| v1 targets parents of infants (0--12 months). The stroller dependency is highest and most acute at this stage. v2 will expand scope to toddlers (1--3 years), who have overlapping but distinct needs --- high chairs, kid menus, space to move. |
+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

Two primary use cases:

-   Planning ahead --- researching where to go before leaving home. This is the primary use case and the one Strollable optimises for first.

-   Real-time discovery --- finding spots nearby in the moment. Secondary use case; lower priority since the parent is already out and can observe conditions directly.

**3.2 Secondary User --- Establishment Owners**

Restaurant and cafe owners, particularly those in family-dense urban neighbourhoods. Their primary motivation is business: attracting the daytime parent demographic during typically low-utilization hours.

Realistic expectations: most establishment owners will not proactively engage with Strollable, especially at launch. The ones who will are a narrow subset --- family-focused venues, new openings, and cafes in stroller-dense neighbourhoods that already see parent traffic and want more of it.

+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| **Important Scoping Decision**                                                                                                                                                                                                                                                                                                                                                                                                                          |
|                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| The establishment-facing product is deliberately minimal at launch. Google Places pre-populates all location data (address, hours, phone, type, photos). Owners who need to correct inaccurate location data are directed to update their Google Business Profile --- Strollable pulls from that source. The only owner-facing surface at launch is a lightweight \'report incorrect info\' flag. A full claim/verify flow is deferred to Phase 2 or 3. |
+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

**4. Key Features & Functionality**

**4.1 Core Map Experience**

-   **Map view:** Mapbox or Google Maps-powered map with establishment markers. Supports neighbourhood-level browsing and real-time location.

-   **List/map toggle:** Airbnb-style toggle between map view and a scrollable list of nearby spots.

-   **Filters:** Filter by baby-friendly features --- step-free entrance, accessible bathroom, change table. Filter by establishment type (cafe, restaurant, shop).

-   **Establishment card:** Shows name, type, neighbourhood, photo, distance, and a summary of verified baby-friendly features.

**4.2 Baby-Friendly Feature Layer**

Features are split into two tiers by launch scope. v1 features are the highest-impact fields for parents of infants and have no existing reliable data source. v2 features add depth once the core data layer is established.

+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| **Product Decision --- No Establishment Badge at Launch**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
|                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| An earlier version of this PRD included a baby-friendly badge awarded to establishments meeting all three v1 feature criteria. This has been descoped at launch for two reasons. First, accessible bathrooms are genuinely rare in Toronto\'s older building stock --- a badge requiring all three features would result in near-zero qualifying establishments, which is worse than no badge at all. Second, from a data model perspective, features-only is the easier architecture to iterate on: the underlying data is identical either way, and badge logic can be layered on top of existing feature data at any point without touching the data model. The decision to introduce a badge --- and what threshold it requires --- will be made with real coverage data after launch, when the actual distribution of features across Toronto establishments is known. The establishment window decal program (Section 8.3) is similarly deferred. |
+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

**v1 Features (launch)**

  ----------------------------------------- ------------------------------------------------------------------------------------------------------------------------
  **Feature**                               **What it captures**

  **Step-free / ramp entrance**             Entry to the establishment is fully step-free or has a permanent ramp. No lifting required.

  **Accessible bathroom (stroller fits)**   The bathroom is large enough to bring a stroller inside, or has space immediately outside the stall to park it safely.

  **Change table**                          A dedicated change table or surface exists, is accessible, and is in reasonable condition.
  ----------------------------------------- ------------------------------------------------------------------------------------------------------------------------

**v2 Features**

  -------------------------------------------- ----------------------------------------------------------------------------------------------------------------
  **Feature**                                  **What it captures**

  **Change table in men\'s washroom**          A change table is available specifically in the men\'s washroom.

  **Change table in family/unisex washroom**   A change table is available in a family or gender-neutral washroom.

  **High chairs**                              High chairs are available for use.

  **Automatic door opener**                    A push-button automatic door opener is available at the entrance.

  **Stroller-accessible layout**               The interior layout allows a stroller to navigate comfortably between tables and toward the back of the space.

  **Booster seats**                            Booster seats are available for use.
  -------------------------------------------- ----------------------------------------------------------------------------------------------------------------

**4.3 Establishment Detail Page**

-   Location info pulled from Google Places: address, hours, phone, type, photos.

-   Baby-friendly feature summary with confidence state per field.

-   Contribute button --- add or verify features, with optional review comment and photo (see Section 4.4).

+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| **Scoping Decision --- Reviews**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
|                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Standalone written reviews are descoped at launch. Reviews and contributions are treated as one unified flow: when a parent submits feature data, they are optionally prompted to leave a short comment and photo. This keeps the contribution flow as the single point of community input, avoids a sparse standalone reviews section at launch, and still captures qualitative context where parents choose to share it. A dedicated reviews surface may be introduced in Phase 2 once contribution volume is sufficient to make it feel full. |
+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

**4.4 Community Contribution Flow**

The contribution flow is the product\'s most critical interaction. It must be fast, low-friction, and satisfying. Three contribution types:

  -------------------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Contribution Type**      **Description**

  **Feature Report**         Add baby-friendly feature data to a spot that has none yet. The most common and most valuable contribution, especially pre-launch. Optionally includes a short comment and photo.

  **Feature Verification**   Confirm or dispute an existing feature submission. Required to move a feature from Reported to Confirmed state. Optionally includes a short comment.

  **Scout**                  Add a location not yet in the app (i.e., not in Google Places). Less common but expands map coverage. Requires at least one feature to be submitted alongside the new location.
  -------------------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Design principles for the contribution flow:

-   Three fields maximum per contribution session. No required photos at launch --- photos are optional.

-   Immediate positive reinforcement --- show progress toward badge thresholds after each contribution.

-   Mobile-first --- the entire flow must be completable with one thumb in under 60 seconds.

**4.5 Verification Logic**

**Phase 1 --- Simple Threshold (Launch)**

A feature is marked Community Confirmed when two community members submit the same value independently. This is fast to build, easy to reason about, and appropriate for early sparse data.

  ------------------------- ------------------------------------------------------------
  **State**                 **Condition**

  **Unknown**               No community submissions for this feature.

  **Reported**              One submission exists. Not yet confirmed.

  **Community Confirmed**   Two or more submissions agree on the same value.

  **Disputed**              Submissions conflict. Flagged for additional verification.
  ------------------------- ------------------------------------------------------------

**Handling Disputed Features**

When submissions conflict, the feature is marked Disputed and surfaced to the community for resolution. The handling logic:

-   A dispute is triggered when two or more submissions disagree on the same feature value.

-   The feature card displays a \'Community disagrees on this --- help resolve it\' prompt, inviting additional verification from other parents.

-   A third matching submission for either value breaks the tie --- the majority value moves to Confirmed, the minority is discarded.

-   If the dispute cannot be resolved after a defined period (e.g., 30 days with no new submissions), the feature reverts to Unknown rather than showing misleading data.

-   Phase 2: contributor trust weighting is applied --- a Verifier badge holder\'s submission carries more weight than a new user\'s in dispute resolution.

**Phase 2 --- Confidence Score (Post-Launch)**

Once data volume is sufficient, replace the binary threshold with a dynamic confidence score per feature, factoring in:

-   Percentage of submissions in agreement.

-   Age of the most recent verification --- fresher data carries more weight.

-   Contributor trust weight --- contributors whose past submissions hold up over time carry more weight in the algorithm.

This means a feature confirmed by 10 people two years ago may show lower confidence than one confirmed by 3 people last month --- accurately reflecting real-world change (e.g., a change table that gets removed).

**4.6 Saved Lists (Phase 2)**

Deferred to Phase 2. Parents will be able to save establishments to named lists (e.g., \'Roncy spots\', \'Brunch places\') for offline reference and trip planning. Lists will be private by default. Saving an individual establishment via a heart/bookmark icon is in scope for launch; full list management is Phase 2.

**4.7 User Profiles & Badge System**

Contributor profiles display earned badges and contribution history. Badges are earned by contribution type and threshold --- not raw volume. This rewards quality and accuracy over quantity.

  ------------------- ---------------------------------------------------------------- ------------------------------------------------------- --------------------------------------------------------------------------------------------------------------------------------------------------
  **Badge**           **Earned by**                                                    **Threshold**                                           **Notes**

  Founding Reporter   Adding features pre-launch during the Data Ranger seed program   Minimum 3 establishments verified before launch         Finite. Never earnable post-launch. Rarest badge. Threshold ensures it reflects genuine contribution, not a single quick entry.

  Reporter            Adding features to existing locations post-launch                5 establishments with at least one feature added each   Core contribution badge. Threshold is per establishment, not per individual feature field, to reward meaningful visits over micro-contributions.

  Verifier            Confirming or disputing existing features                        5 establishments verified                               Rewards data accuracy. Same threshold logic --- per establishment visited and verified, not per field tapped.

  Scout               Adding new locations not in Google Places                        5 new locations added                                   Rewards map expansion. Each Scout submission must include at least one feature to count.
  ------------------- ---------------------------------------------------------------- ------------------------------------------------------- --------------------------------------------------------------------------------------------------------------------------------------------------

Badge display: Badges live on user profiles --- the \'trophy case\' moment that motivates contributors. At the data point level, a small avatar and handle is shown next to each verified feature (e.g., \'change table confirmed by \@sarahto\'). This builds trust in individual data points without cluttering listing pages.

**5. Data Strategy**

**5.1 Data Architecture**

Strollable uses a three-layer data model:

  -------------------------- ----------------------------------------------------------------------------------------------------------------
  **Layer**                  **Source & Timing**

  **Location data**          Google Places API --- pre-launch, ongoing. Address, hours, phone, type, photos.

  **Feature data**           Data Rangers (community volunteers) --- pre-launch seed. The three baby-friendly fields Google cannot provide.

  **Feature verification**   General community --- post-launch, ongoing. Confirmation and dispute of existing feature data.
  -------------------------- ----------------------------------------------------------------------------------------------------------------

**5.2 Google Places API**

Google Places is used exclusively for location data --- address, hours, phone, establishment type, and photos. All baby-friendly feature data comes from community contribution only. Google\'s accessibility fields (wheelchair entrance, restroom) are not pulled or displayed --- they are imprecise proxies for stroller use and would create a mixed-trust data model.

**5.3 Pre-Launch Data Sprint**

Before launch, a small group of volunteer Data Rangers manually verify the three mandatory baby-friendly fields for 20-30 establishments per target neighbourhood: step-free entrance, accessible bathroom, and change table. This is the critical step that makes the app useful from day one.

Data Rangers are recruited from existing Toronto parent communities --- Facebook groups, local forums, mat leave networks. Incentives:

-   Founding Reporter badge --- permanent, finite, never earnable post-launch.

-   Free premium access when monetization launches.

-   Intrinsic motivation --- building something they personally needed.

The data sprint is deliberately unscalable but appropriate for a lifestyle business launching in one city. A rolling neighbourhood launch model (see Section 7) keeps data quality high by concentrating effort rather than spreading thin.

**6. Technical Architecture**

**6.1 Tech Stack**

  ------------------------- -----------------------------------------------------------------------------
  **Layer**                 **Technology**

  **Frontend**              React / TypeScript

  **Styling**               Tailwind CSS

  **Platform**              Web-only, mobile-first (iOS and Android native apps are descoped at launch)

  **Mapping**               Mapbox (recommended) or Google Maps API --- see note below

  **Backend / Database**    Supabase

  **AI review summaries**   Claude API (Anthropic)

  **Location data**         Google Places API
  ------------------------- -----------------------------------------------------------------------------

+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| **Mapbox vs Google Maps**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
|                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Both are viable mapping layers, but they involve a meaningful tradeoff. Google Maps offers tighter integration with Google Places API (same ecosystem, simpler auth, consistent data) and higher map familiarity for users. Mapbox offers more visual customisation, better pricing at scale, and no dependency on a single vendor for both mapping and location data. Recommendation: start with Google Maps for faster integration at launch; evaluate Mapbox migration in Phase 2 once usage patterns are established and if Google\'s pricing becomes a concern. |
+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

**6.2 Database Schema (Key Tables)**

Core tables required at launch:

-   establishments --- place_id, name, address, lat/lng, type, hours, phone, google_data_json

-   features --- establishment_id, feature_type (step_free_entrance/accessible_bathroom/change_table/change_table_mens/change_table_family/high_chairs/auto_door/stroller_layout/booster_seats), value, status (unknown/reported/confirmed/disputed)

-   contributions --- user_id, establishment_id, feature_id, contribution_type (report/verify/scout), value, comment (optional), photo_url (optional), created_at

-   users --- id, display_name, email, badge_flags, contribution_counts

**6.3 AI Review Summaries**

The Claude API is used to generate concise, parent-focused summaries of community reviews for each establishment --- similar to Amazon\'s AI review summaries. The summary surfaces the most relevant signals for parents (stroller access, noise level, staff friendliness toward babies) rather than general dining commentary.

**7. Launch Strategy**

**7.1 Geographic Approach --- Rolling Neighbourhood Launch**

Rather than launching city-wide, Strollable launches neighbourhood by neighbourhood. This keeps data quality high, makes the map feel full and useful immediately within each launch area, and creates repeatable local community moments.

  -------------------------- ------------------------------------------------------------------------------------------------------------------------------------------
  **Tier**                   **Neighbourhoods & Rationale**

  **Tier 1 --- Launch**      Roncesvalles, Leslieville, Trinity Bellwoods. Highest stroller density, most active parent communities, strong independent cafe culture.

  **Tier 2 --- Month 2-3**   The Junction, Bloorcourt, Danforth East, Parkdale. Strong but slightly more diffuse parent communities.

  **Tier 3 --- Defer**       Suburbs, North York, Scarborough. Lower walkability reduces the core use case. Later expansion.
  -------------------------- ------------------------------------------------------------------------------------------------------------------------------------------

Target density per neighbourhood before opening to the public: 20-30 verified listings. This is the minimum for the map to feel useful rather than sparse.

**7.2 Year 1 User Targets**

Monetization readiness for this product is not about total installs --- it is about engagement density in specific geographies. Revised targets reflect a more ambitious but still achievable trajectory for a part-time founder with strong community distribution:

  ----------------------------------------- ---------------------------------------------------------------------------------
  **Metric**                                **Year 1 Target**

  **Monthly active users**                  1,000--2,000 across 4--6 Toronto neighbourhoods

  **Contribution rate**                     25--35% of MAU have contributed at least one feature

  **Verified listings per neighbourhood**   75--100

  **Neighbourhood launches**                4--6 by end of year 1, with 1 new neighbourhood per 6--8 weeks after launch

  **Data Rangers recruited**                15--25 across all launch neighbourhoods

  **Key leading indicator**                 \% of users who open the app more than once in their first week --- target 40%+
  ----------------------------------------- ---------------------------------------------------------------------------------

**7.3 Distribution Channels**

**High Impact, Low Effort**

-   Toronto neighbourhood parent Facebook groups (Roncy Parents, Leslieville Families, etc.) --- warm, self-selected audiences experiencing the exact problem.

-   Founder story --- a mat leave mom who built the app she needed is genuinely compelling and shareable. Lead with personal narrative, not product features.

**High Impact, Medium Effort**

-   2-3 local Toronto parent influencers or bloggers for an honest review at launch.

-   Data Ranger founding stories --- \'I helped build this\' narratives travel well in tight parent communities.

-   r/toronto and r/torontobabies --- genuine founder post at launch, not a promotional push.

**Medium Impact, Medium Effort**

-   Local Toronto parenting newsletters and blogs for a launch feature.

**Defer**

-   Paid social --- too early and too expensive relative to organic opportunity.

-   Press outreach --- valuable if it happens but hard to manufacture at this stage.

**8. Monetization**

**8.1 Strategic Principles**

Strollable is designed as a lifestyle business --- sustainable, community-driven, and profitable at modest scale. Monetization must not compromise data trust. Community data is only valuable if parents believe it came from other parents, not from establishments paying for visibility.

**8.2 Primary Path --- B2C Premium Subscription**

A modest subscription (\$3-5/month) for parents unlocking enhanced features. This aligns incentives with the core user and avoids the trust problems of monetizing the establishment side early.

Potential premium features (to validate with users):

-   Saved lists with offline access.

-   \'Plan my day\' AI-powered route planner --- input a neighbourhood and time window, get an optimized itinerary of baby-friendly stops.

-   Push notifications for newly verified listings in saved neighbourhoods.

-   Early access to new neighbourhood launches.

**8.3 Secondary Path --- Establishment Badge (Deferred)**

A physical Strollable Certified window badge for qualifying establishments is a compelling long-term mechanic --- it turns establishments into advocates and creates a discovery moment for passing parents. However, this is deferred until after launch for two reasons: the badge criteria cannot be responsibly defined without knowing the actual distribution of features across Toronto establishments, and the establishment badge program depends on the product decision in Section 4.2 being resolved with real data.

When introduced, the hard constraint remains: badge status must be earned through community verification, never purchased. Reference models: Safe Place network (window decal earned, not bought), allergen-free certification badges in bakeries.

**8.4 Tertiary Path --- Affiliate / Booking (Phase 3+)**

Commission on reservations made through the app (OpenTable-style). Longer to build, dependent on establishment relationships, but scales with usage. Not a launch consideration.

+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| **Monetization Sequencing**                                                                                                                                                                                                                                                                                                                  |
|                                                                                                                                                                                                                                                                                                                                              |
| Do not build premium features before the free product is genuinely useful. The free version must be valuable enough that parents recommend it without any incentive. Premium then converts the most engaged users. Attempting to monetize before hitting community trust thresholds will suppress the organic growth the product depends on. |
+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

**9. Product Phasing**

  ------------------------ -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Phase**                **Scope**

  **Phase 1 --- Launch**   Core map, baby-friendly feature layer (3 v1 fields), community contribution flow, Data Ranger seed program, contributor badge system, Google Places integration, basic user profiles.

  **Phase 2 --- Growth**   Confidence score verification, establishment claim flow, premium subscription tier, push notifications, v2 feature fields, saved lists, expanded neighbourhood coverage.

  **Phase 3 --- Scale**    AI-powered day planning, establishment badge program (pending data-informed decision --- see Section 4.2), establishment-facing dashboard, affiliate/booking integration, expansion beyond Toronto.
  ------------------------ -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**10. Open Questions & Risks**

**10.1 Key Open Questions**

-   What is the minimum viable verified listing count for a neighbourhood to feel useful? 20-30 is the current hypothesis --- needs validation with first users.

-   Will Data Rangers reliably complete their verification tasks? Contribution format must be simple enough to complete in a single neighbourhood walk.

-   What premium features will parents actually pay for? The \'plan my day\' AI feature is a hypothesis, not a validated want.

-   How does verification logic handle establishments that change over time (change table removed, renovation, new management)?

**10.2 Key Risks**

-   **Cold start:** The app is not useful until the data is good, but community won\'t contribute until it\'s useful. Mitigated by the Data Ranger pre-launch seed program.

-   **Data quality degradation:** Community data becomes stale without active re-verification. Phase 2 confidence score (weighted by recency) is the mitigation.

-   **Trust erosion:** Introducing pay-to-play establishment features before community trust is established would undermine the product\'s core value. Hard constraint: badge status cannot be purchased.

-   **Scope creep:** The establishment-facing product is explicitly descoped at launch. Resist pressure to build it before consumer traction is demonstrated.

**11. Success Metrics**

  ---------------------------------------------- --------------------------------------------------------------------------------------
  **Metric**                                     **Why It Matters**

  **% of users returning in first week**         Primary leading indicator of data quality --- only useful data drives return visits.

  **Contribution rate (% MAU who contribute)**   Target 20-30%. Signals community health, not just passive consumption.

  **Feature coverage per neighbourhood**         Target 50-75 verified listings. Signals map density and usefulness.

  **Verification agreement rate**                \% of features where community submissions agree. High agreement = trustworthy data.

  **Monthly active users**                       Target 500-1,000 by end of year 1 across 3-4 Toronto neighbourhoods.
  ---------------------------------------------- --------------------------------------------------------------------------------------

**12. Brand & Tone**

Strollable is a tool built by a parent, for parents. The brand should feel like advice from a trusted friend who happens to know every cafe on the block --- warm, direct, and genuinely useful. It should never feel clinical, corporate, or condescending.

+--------------------------------------------------------------------------------------------------------------------------+
| **Brand in One Sentence**                                                                                                |
|                                                                                                                          |
| Strollable is the app that helps parents explore their city with confidence --- built on community trust, not guesswork. |
+--------------------------------------------------------------------------------------------------------------------------+

**12.1 Brand Personality**

Five adjectives that should define every brand touchpoint --- copy, UI, marketing, and onboarding:

  ---------------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Trait**              **What it means in practice**

  **Warm**               Parents are already stressed. Strollable should feel like a relief, not another task. Tone is friendly and human --- never robotic or bureaucratic.

  **Trustworthy**        The data is the product. Every design decision should reinforce the feeling that this information has been verified by real parents who actually visited. Never oversell or exaggerate.

  **Calm**               Parents are navigating chaos. The UI and copy should reduce cognitive load, not add to it. Clean, uncluttered, breathing room.

  **Practical**          Parents do not have time. Get to the point. Lead with the most useful information. No filler copy, no unnecessary steps.

  **Community-proud**    Contributors are the engine. The brand should make contributors feel proud and recognized --- not like anonymous data entry workers.
  ---------------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**12.2 Voice & Tone Guidelines**

**Do**

-   Write like you\'re talking to another parent --- conversational, empathetic, direct.

-   Lead with the most useful information first. Do not bury the answer.

-   Celebrate community contributions --- make contributors feel seen and valued.

-   Use plain language. Avoid jargon. If a tired parent cannot read it at a glance, rewrite it.

-   Be honest about data gaps --- \'No info yet\' is better than a false confidence signal.

**Don\'t**

-   Do not be cutesy or over-playful. Parents are adults. The tone is warm, not infantilizing.

-   Do not use passive voice or vague qualifiers. Be direct.

-   Do not over-automate copy. Microcopy should feel human, not templated.

-   Do not use guilt or urgency as motivators for contribution. Community should feel voluntary and rewarding.

**Example Microcopy**

  ------------------------------------- ----------------------------------------------------------------------------------------------------
  **Context**                           **Example copy**

  **Empty state --- no features yet**   No one has checked this one yet. Be the first to help parents find out.

  **Feature confirmed**                 Confirmed by 3 parents. Last checked 2 weeks ago.

  **Contribution success**              Nice one. That helps parents in the neighbourhood plan better.

  **Founding Reporter badge earned**    You\'re a Founding Reporter. This badge is permanent --- you helped build Strollable from nothing.

  **Onboarding --- first screen**       Find places your stroller can actually get into. Verified by parents, for parents.

  **Data Ranger recruitment**           Know your neighbourhood? Help other parents navigate it.
  ------------------------------------- ----------------------------------------------------------------------------------------------------

**12.3 Visual Direction**

Strollable\'s visual identity has not yet been formally defined. The following are directional principles drawn from visual reference apps --- Wonder Weeks, Tiimo, Airbnb, AllTrails --- to guide future branding work:

  -------------------------------------------- --------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Principle**                                **Rationale & Reference**

  **Clean, minimal chrome**                    The map and establishment content are the hero. UI elements should recede, not compete. Reference: Airbnb map view.

  **Warm, soft palette**                       Avoid cold blues or harsh contrasts. The brand should feel approachable and human. Reference: Wonder Weeks cream and amber tones; Tiimo lavender.

  **Rounded, generous shapes**                 Pill buttons, rounded cards, soft corners throughout. Nothing sharp or corporate. Reference: Tiimo, Wonder Weeks.

  **Expressive but restrained illustration**   A small set of original illustrations for empty states, onboarding, and badge moments. Not overused. Reference: Tiimo character illustrations, Wonder Weeks icons.

  **Strong typographic hierarchy**             Large, confident headings paired with clean body text. Editorial feel. Reference: Tiimo serif/sans-serif pairing.

  **Photography-forward cards**                Establishment cards should lead with real photos from Google Places. The visual should do the work. Reference: Airbnb card grid.
  -------------------------------------------- --------------------------------------------------------------------------------------------------------------------------------------------------------------------

Formal brand decisions --- colour palette, typeface selection, logo, icon style --- are intentionally deferred until the target audience has been validated through user research. The above principles are guardrails, not constraints.

**13. Design Principles**

Strollable is mobile-first and used in one of two contexts: planning at home (likely on a couch, baby nearby) or checking quickly while out. Both contexts demand low friction, fast information retrieval, and a UI that works with one hand.

**13.1 Core UX Principles**

  ------------------------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Principle**                   **Application**

  **Information first**           The three mandatory baby-friendly features --- step-free entrance, accessible bathroom, change table --- must be immediately visible on every listing without scrolling. No hunting for the key data.

  **One thumb, one action**       Every core interaction must be completable with one hand. No multi-step flows for browsing. Contribution flow capped at 60 seconds.

  **Trust signals everywhere**    Data confidence state (Unknown / Reported / Confirmed) should be visible and legible at a glance. Parents should never be uncertain about the reliability of what they\'re reading.

  **Progressive disclosure**      Show the minimum needed to make a decision. Details expand on demand. Listing cards show the essentials; tapping reveals the full picture.

  **Celebrate contribution**      Badge moments, confirmation animations, and contribution counts should feel rewarding --- not clinical. Inspired by Tiimo\'s celebratory transitions.

  **Empty states with purpose**   When data is missing, tell the user why it matters and make it easy to fill the gap. Never show a blank screen without a clear call to action.
  ------------------------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**13.2 Key UI Patterns**

**Map + List Toggle**

Airbnb-style toggle between map view and a vertically scrollable list. Map is the default for exploration; list is the default for comparison. Both views show the same filtered results. The toggle is persistent and remembers the user\'s last preference.

**Feature Chips**

Baby-friendly features are displayed as compact, scannable chips on listing cards --- similar to AllTrails attribute tags. Three states: grey (unknown), amber (reported), green (confirmed). Colour and icon convey state at a glance without requiring the user to read text.

**Contribution Flow**

Triggered from any listing page via a persistent \'Contribute\' button. The flow presents one question at a time --- step-free entrance? accessible bathroom? change table? --- with simple yes/no/unsure responses. Optional photo and comment at the end. Progress is shown. Completion triggers a badge progress update and a warm confirmation message.

**Bottom Navigation**

Five tabs: Explore (map), Saved (lists), Contribute, Notifications, Profile. Explore is always the default. Navigation is always visible and never hides on scroll.

**Establishment Card**

Photo-forward card pulled from Google Places, with establishment name, type, neighbourhood, distance, and three feature chips. Save icon in top corner (Airbnb-style). Tapping expands to the full detail page.

**13.3 Accessibility**

-   Minimum touch target size of 44x44pt for all interactive elements.

-   Feature states must not rely on colour alone --- icons and labels provide redundant signalling.

-   All UI text meets WCAG AA contrast requirements.

-   Padding and spacing are generous throughout --- the app should be usable without precise tap accuracy.

**14. User Personas**

Three primary personas representing the core Strollable user base at launch. These are directional and should be refined as real user data emerges from the Toronto launch.

**Persona 1 --- The Explorer**

  ----------------------------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                                

  **Name**                      Maya, 32

  **Situation**                 First-time mom, 7 months into mat leave in Roncesvalles. Previously worked in marketing. Social, active, used to exploring the city freely.

  **Stroller situation**        Full-size travel system. Quickly learned that her pre-baby cafe rotation is no longer accessible without reconnaissance.

  **Core frustration**          She wants to maintain her pre-baby social life --- brunches, coffee catch-ups, neighbourhood walks. Every outing now requires advance research that does not exist in one place.

  **Primary use case**          Weekend planning: researching 3-4 spots in advance, building a mental map of her neighbourhood.

  **Contribution likelihood**   High. Naturally shares recommendations with her mom group. Motivated by social recognition and helping others avoid her past frustrations.

  **Quote**                     I spent 20 minutes googling before I found out the cafe had a step at the entrance. I just want to know before I go.
  ----------------------------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**Persona 2 --- The Pragmatist**

  ----------------------------- ------------------------------------------------------------------------------------------------------------------------------------------
                                

  **Name**                      James, 35

  **Situation**                 Dad of a 14-month-old in Leslieville. Works from home part-time, handles a lot of daytime childcare. Efficiency-oriented.

  **Stroller situation**        Lightweight umbrella stroller. Moves fast and does not want to be slowed down by avoidable obstacles.

  **Core frustration**          He does not want a parenting app. He wants a fast, functional tool that answers one question: can I get in, and is there a change table?

  **Primary use case**          Quick lookup while already out --- checking a nearby spot before committing to walking there. Values speed above all.

  **Contribution likelihood**   Moderate. Will contribute when friction is near-zero. A quick yes/no/unsure input works. A form does not.

  **Quote**                     Just tell me if I can get the stroller in the door. That is all I need.
  ----------------------------- ------------------------------------------------------------------------------------------------------------------------------------------

**Persona 3 --- The Community Builder**

  ----------------------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
                                

  **Name**                      Priya, 29

  **Situation**                 Mom of twins, 11 months old, in Trinity Bellwoods. Runs a local parent WhatsApp group. Deeply embedded in the neighbourhood parent community.

  **Stroller situation**        Double stroller --- the most demanding mode of urban navigation. Has developed encyclopedic knowledge of which spots work.

  **Core frustration**          She is already doing this manually --- texting friends, posting in her group. She wants a better tool to organise and share what she knows, and to get credit for it.

  **Primary use case**          Contributing and verifying. Less a passive consumer, more an active builder. Strollable gives her existing behaviour an official home.

  **Contribution likelihood**   Very high. Founding Reporter material. Will recruit others from her network. Potentially a Data Ranger lead.

  **Quote**                     I already know which places work. I just want somewhere to put it so everyone else can benefit too.
  ----------------------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------

**14.1 Persona Implications**

  --------------------------------- --------------------------------------------------------------------------------------------------------------------------------
  **Decision area**                 **Implication**

  **Contribution flow design**      Must satisfy James --- near-zero friction, completable in under 60 seconds. If it works for him, it works for everyone.

  **Community & badge system**      Designed for Priya --- recognition, permanence, and social visibility. She is the engine of early data quality.

  **Onboarding & marketing copy**   Written for Maya --- emotionally resonant, speaks to the frustration of pre-baby city life now requiring advance planning.

  **Distribution strategy**         Priya distributes. Maya amplifies. James converts once the data is good enough to be immediately useful to him.

  **Premium feature design**        Plan my day planner maps to Maya. Speed and offline access map to James. Badge archive and community recognition map to Priya.
  --------------------------------- --------------------------------------------------------------------------------------------------------------------------------

*Strollable PRD v1.4 \| March 2026 \| Confidential*
