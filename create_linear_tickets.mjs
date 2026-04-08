import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

// Load .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  for (const line of envFile.split('\n')) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim();
  }
}

const API_KEY = process.env.LINEAR_API_KEY;
const TEAM_ID = 'f46448d6-1d66-43dd-9d3c-48e7013434f5';

if (!API_KEY) {
  console.error('❌ LINEAR_API_KEY not found in .env.local');
  process.exit(1);
}

function linearRequest(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query, variables });
    const options = {
      hostname: 'api.linear.app',
      path: '/graphql',
      method: 'POST',
      headers: {
        'Authorization': API_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const parsed = JSON.parse(data);
        if (parsed.errors) {
          reject(new Error(parsed.errors[0].message));
        } else {
          resolve(parsed.data);
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function createProject(name) {
  const data = await linearRequest(`
    mutation CreateProject($name: String!, $teamId: String!) {
      projectCreate(input: { name: $name, teamIds: [$teamId] }) {
        success
        project { id name }
      }
    }
  `, { name, teamId: TEAM_ID });
  return data.projectCreate.project;
}

async function createIssue(title, description, projectId) {
  const data = await linearRequest(`
    mutation CreateIssue($title: String!, $description: String, $teamId: String!, $projectId: String) {
      issueCreate(input: {
        title: $title,
        description: $description,
        teamId: $teamId,
        projectId: $projectId
      }) {
        success
        issue { id title }
      }
    }
  `, { title, description, teamId: TEAM_ID, projectId });
  return data.issueCreate.issue;
}

const epics = [
  {
    name: '🗺️ Core Map Experience',
    tickets: [
      { title: 'Build Map View Component', description: 'Acceptance: Mapbox/Google Maps integration, marker rendering, zoom/pan' },
      { title: 'Build List View Component', description: 'Acceptance: Scrollable establishment list, matches map results' },
      { title: 'Implement Map/List Toggle', description: 'Acceptance: Persistent toggle, remembers user preference' },
      { title: 'Build Establishment Card Component', description: 'Acceptance: Photo, name, type, distance, feature chips (3 v1 features), matches DESIGN_SPEC' },
    ]
  },
  {
    name: '✅ Baby-Friendly Feature Layer',
    tickets: [
      { title: 'Implement Feature Chip Component (4 States)', description: 'Acceptance: Unknown (grey), Reported (amber), Confirmed (green), Disputed (terracotta) — per DESIGN_SPEC' },
      { title: 'Build Feature Data Model', description: 'Acceptance: Schema for step_free_entrance, accessible_bathroom, change_table + v2 fields' },
      { title: 'Implement Confidence Display Logic', description: 'Acceptance: Show state + metadata (e.g., "Confirmed by 3 parents, last checked 2 weeks ago")' },
    ]
  },
  {
    name: '🏪 Establishment Detail Page',
    tickets: [
      { title: 'Build Detail Page Layout', description: 'Acceptance: Location info (Google Places), feature summary, contribute button' },
      { title: 'Integrate Google Places Data', description: 'Acceptance: Pull address, hours, phone, type, photos' },
      { title: 'Add Feature Summary Section', description: 'Acceptance: Display all v1 features with confidence states' },
    ]
  },
  {
    name: '✏️ Community Contribution Flow',
    tickets: [
      { title: 'Build Contribution Modal/Flow', description: 'Acceptance: 3 questions max, one-thumb navigation, under 60 seconds' },
      { title: 'Implement Feature Report Flow', description: 'Acceptance: Step-free, accessible bathroom, change table — yes/no/unsure + optional photo/comment' },
      { title: 'Implement Feature Verification Flow', description: 'Acceptance: Confirm/dispute existing feature + optional comment' },
      { title: 'Implement Scout Flow (Add Location)', description: 'Acceptance: Name, address, at least one feature required' },
      { title: 'Build Contribution Success State', description: 'Acceptance: Badge progress update, warm confirmation message' },
    ]
  },
  {
    name: '🔍 Filters & Search',
    tickets: [
      { title: 'Build Filter Modal Component', description: 'Acceptance: Feature filters (sage-deep active) and type filters (ink active), full-width divider between groups, per DESIGN_SPEC' },
      { title: 'Implement Feature Filters', description: 'Acceptance: Step-free, accessible bathroom, change table checkboxes' },
      { title: 'Implement Type Filters', description: 'Acceptance: Cafe, restaurant, shop checkboxes' },
      { title: 'Build Search Suggestions', description: 'Acceptance: "Nearby you" first and elevated, location search, recent searches' },
    ]
  },
  {
    name: '🛡️ Verification & Data Quality',
    tickets: [
      { title: 'Implement Phase 1 Verification Logic', description: 'Acceptance: Two matching submissions = Confirmed, conflicts = Disputed' },
      { title: 'Build Dispute Resolution UI', description: 'Acceptance: Surface "community disagrees" prompt, allow tiebreaker votes' },
      { title: 'Implement Data Freshness Tracking', description: 'Acceptance: Store submission dates, display recency in feature metadata' },
    ]
  },
  {
    name: '🏅 User Profiles & Badge System',
    tickets: [
      { title: 'Build User Profile Page', description: 'Acceptance: Display earned badges, contribution history, contribution counts' },
      { title: 'Implement Badge Logic', description: 'Acceptance: Founding Reporter (3 pre-launch), Reporter (5 establishments), Verifier (5 verified), Scout (5 new locations)' },
      { title: 'Build Badge Display Component', description: 'Acceptance: Trophy case on profile, small avatar/handle next to verified features' },
      { title: 'Track Contribution Metrics', description: 'Acceptance: Count features per establishment, thresholds per badge type' },
    ]
  },
  {
    name: '📱 Bottom Navigation & Core UX',
    tickets: [
      { title: 'Build Bottom Nav Component', description: 'Acceptance: Explore, Saved, Contribute, Notifications, Profile — always visible per DESIGN_SPEC' },
      { title: 'Implement Explore Tab (Default)', description: 'Acceptance: Map view default, shows filtered results' },
      { title: 'Implement Saved Tab (Stub)', description: 'Acceptance: Heart/bookmark saves to local state (full list management Phase 2)' },
      { title: 'Implement Contribute Tab', description: 'Acceptance: Triggers contribution flow' },
      { title: 'Implement Notifications Tab (Stub)', description: 'Acceptance: Placeholder for Phase 2' },
      { title: 'Implement Profile Tab', description: 'Acceptance: User profile, badge display, settings stub' },
    ]
  },
  {
    name: '💬 Empty States & Microcopy',
    tickets: [
      { title: 'Build Empty State Components', description: 'Acceptance: No features, no results, no saved items — each with clear CTA' },
      { title: 'Write & Implement Microcopy', description: 'Acceptance: Per BRAND_GUIDELINES and PRD Section 12.2 (e.g., "No one has checked this one yet...")' },
      { title: 'Implement Loading & Skeleton States', description: 'Acceptance: Smooth transitions, no jarring blanks' },
    ]
  },
  {
    name: '🚀 Onboarding & First Run',
    tickets: [
      { title: 'Build Onboarding Flow', description: 'Acceptance: 2-3 screens, explain core value, location permission request' },
      { title: 'Implement Location Permission Handling', description: 'Acceptance: Ask for permission, gracefully degrade if denied' },
      { title: 'Build First-Run Empty State', description: 'Acceptance: Guide user toward exploring nearby or searching' },
    ]
  },
  {
    name: '🗄️ Backend & Data Integration',
    tickets: [
      { title: 'Set Up Supabase Project', description: 'Acceptance: Database, auth, RLS policies configured' },
      { title: 'Implement Authentication Flow', description: 'Acceptance: Email signup/login, persistent session' },
      { title: 'Seed Mock Data (10 Toronto Establishments)', description: 'Acceptance: Test data in Supabase, all 3 v1 features populated' },
      { title: 'Build API Integration Layer', description: 'Acceptance: Fetch establishments, features, contributions from Supabase' },
    ]
  },
  {
    name: '📍 Google Places Integration',
    tickets: [
      { title: 'Integrate Google Places API', description: 'Acceptance: Search locations, fetch place details (address, hours, phone, photos)' },
      { title: 'Implement Place Detail Fetch', description: 'Acceptance: Populate establishment cards and detail pages from Google Places' },
      { title: 'Handle Missing/Inaccurate Data', description: 'Acceptance: UX for "report incorrect info" flag, direct users to update Google Business Profile' },
    ]
  },
  {
    name: '🎨 Design System Implementation',
    tickets: [
      { title: 'Extract Design Spec from UI System', description: 'Acceptance: DESIGN_SPEC.md complete with colors, typography, component specs' },
      { title: 'Implement Color Tokens in Tailwind', description: 'Acceptance: Stroller Sage (#7A9E7E), Parchment (#FAF7F2), Terracotta (#C9714A), Butter (#F2D98B), Sky (#A8C5D6) as Tailwind config' },
      { title: 'Implement Typography Scale', description: 'Acceptance: Fraunces (display) + DM Sans (UI) integrated, font sizes matched to spec' },
      { title: 'Build Button Component Library', description: 'Acceptance: Primary, secondary, tertiary — all states per DESIGN_SPEC' },
      { title: 'Build Feature Chip Components', description: 'Acceptance: 4 states, exact sizing and colors per DESIGN_SPEC' },
      { title: 'Build Establishment Card to Spec', description: 'Acceptance: 24px border radius, warm white background, floating glassmorphism verified pill, mist-tinted inset footer — per DESIGN_SPEC' },
    ]
  },
];

const phase2Epics = [
  '📈 [Phase 2] Confidence Score Verification',
  '💾 [Phase 2] Saved Lists',
  '💰 [Phase 2] Premium Subscription Features',
  '🏢 [Phase 2] Establishment Claim Flow',
  '➕ [Phase 2] v2 Feature Fields',
  '🗺️ [Phase 2] Neighbourhood Expansion',
];

async function main() {
  console.log('🚀 Creating Strollable epics and tickets in Linear...\n');

  for (const epic of epics) {
    process.stdout.write(`📁 Creating epic: ${epic.name}...`);
    const project = await createProject(epic.name);
    console.log(` ✅`);

    for (const ticket of epic.tickets) {
      process.stdout.write(`   └─ ${ticket.title}...`);
      await createIssue(ticket.title, ticket.description, project.id);
      console.log(` ✅`);
      await new Promise(r => setTimeout(r, 300));
    }
    console.log('');
  }

  console.log('📋 Creating Phase 2 placeholder epics...\n');
  for (const name of phase2Epics) {
    process.stdout.write(`📁 ${name}...`);
    await createProject(name);
    console.log(` ✅`);
    await new Promise(r => setTimeout(r, 300));
  }

  console.log('\n🎉 Done! All epics and tickets created in Linear.');
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
