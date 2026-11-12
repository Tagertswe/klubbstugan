# Spec: Team Blekinge LF website, remastered

Status: draft 3, 2026-11-09 (draft 2: 2026-10-27, draft 1: 2026-10-16). Draft 2 added the member
survey (section 2.6), news and the member feed Klubbflödet (section 5.2), FAQ, "Prova på" and
findability. Draft 3 adds the editors (2.8.1), page and heading editing (5.7), the three themes
(5.8.1), what the first build covers (section 9) and the demo at `klubbstugan.appzma.com`.
The live site has not been changed.

## 1. Summary

Team Blekinge LF (running club, Karlskrona, founded 1992) runs
`www.teamblekinge.nu` on the SvenskaLag.se club-site template. Members-only information (race
travel, relay team assignments, carpooling, training changes) mostly lives in a private Facebook
group, so members who are not on Facebook, or who miss a post in the feed, miss it.

The remastered site gathers everything in one place the club controls:

- **Public site** for prospective members and race participants: club, training, membership, the
  club's own races, results and records.
- **Member area** with login, members-only news with pinned announcements, and Klubbflödet, a
  feed where members post runs, photos and questions, replacing the Facebook group, with notifications so nobody has to check a
  feed to stay informed.
- **Structured club data** instead of hand-edited tables: calendar with sign-up, training plans,
  results with automatic year-best and all-time lists, relay team assignments.

Section 2 maps the current site; sections 4 to 6 are the new design; section 8 is the migration.

## 2. The current site (survey of 2026-10-16)

How it was surveyed: about 75 read-only page loads of the public site with no login, no form
submitted and nothing posted, plus the public iCal and RSS feeds. Member-only pages were seen only
as "not logged in". Personal data on the pages (names, results, phone numbers) is not copied here.

### 2.1 Platform

| Aspect | Finding |
|---|---|
| Platform | SvenskaLag.se club site, club slug `teamblekingelf`, custom domain `www.teamblekinge.nu`. Footer: "Levererat av Svenskalag.se" |
| Front end | Server-rendered HTML 4.01, Bootstrap 3 with responsiveness disabled plus separate mobile stylesheets, jQuery 3.7, jQuery UI, Vue 2.6 for some widgets |
| Member register | SvenskaLag's own register (with personal identity numbers; section 2.8). IdrottOnline Klubb (Riksidrottsförbundet) is also in use. SvenskaLag's built-in integration pushes members and attendance to IdrottOnline, so SvenskaLag is likely the register of record if that integration is on (section 6.1, to be confirmed). |
| Feeds | News RSS (`/rss/67863`), calendar iCal (`webcal://cal.svenskalag.se/67863`, 284 events at survey time) |
| Third parties on the page | Google Fonts, Font Awesome CDN, SvenskaLag CDN, cookie dialog ("Godkänn alla kakor" / "Bara nödvändiga") with web analytics |
| Created | December 2022, results migrated from earlier sites back to 2002 |

### 2.2 Design

- **Colours:** near-black primary `#221E1F` (header gradient to `#1B1819`), orange accent `#EE8915`
  / `#EE7100`, white content area. Club racing kit is orange, black and purple.
- **Type:** Inter for headings and body, Roboto as secondary.
- **Logo:** club mark served from the SvenskaLag CDN in many icon sizes.
- **Layout (desktop):** dark header with the club name and a login box. Left column: deep
  navigation menu. Centre: page content or news feed. Right column: upcoming activities, "Följ oss
  på" (Facebook, Instagram), "Bli medlem" and "Träning" call-to-action boxes. Footer: sponsor
  logos ("Samarbetspartners"), SvenskaLag fundraising banner, print link.
- **Home page:** upcoming activities (5), latest news with excerpt and comment count, older news
  titles, full upcoming list, then sponsors.
- **Mobile:** the template's separate mobile stylesheet; the desktop layout is fixed-width.

### 2.3 Site map

Approximate menu tree, from the navigation markup (exact nesting can differ):

```
Hem
Nyheter                      news list by year, RSS, share to Facebook/X, comments
Kalender                     month view, category filter, subscribe (iCal)
Kontakt                      address, club and org number, chair, Facebook group join instructions
Löpträning                   Tuesday training at the club house, three groups
  Intervallträning
  Hälsagruppen
  Träningspass               weekly plan as images, updated every Monday
  Intervallpass              term table: week, date, session, comment, coach (long/short group)
  Hälsagruppen               same table for the health group
  Test intervallpass
  Långpass                   monthly long run schedule: date, place, organisers
  Träningsprogram            marathon plans, two levels (files)
  Parkering                  map image: where to park at the club house
Om föreningen                history, policies (drugs, equality, anti-doping plan as files)
  Medlemskap                 how to join, fee, Swish/bankgiro, benefits, statutes excerpt
  Styrelsen och ansvariga    board, coaches, committees, contact roles
  Årens utmärkelser          yearly awards with citations
  Torsdagsgruppen            60+/daytime group, run with RF-SISU Blekinge
  Triathlon                  federation membership, licences, distances
Våra lopp
  Kustmaran                  own race: Kustmaran & Kristianopel Runt (July), courses, prices, maps
  Funktionärer Kustmaran     volunteers page (empty to the public)
  Jämjöhalvan                own race (November), courses, starts, relay, prices
  Veteran-SM                 national veteran championships hosted 2026 (half) and 2027 (marathon)
Tävlingsresultat <year>      members' results this year, by race; registered by a results manager
Resultatarkiv                13,000+ results from about 1,300 races since 2002
  All Time High              club all-time lists per race/distance, women and men
  Resultat <year>, Årsbästa <year>   one page each per year, 2020 to 2026
Bildarkiv                    links to Google Photos albums per event, 2018 to 2026
Löpartävlingar o Resultat    links to race calendars and timing sites
Förbättring hemsida          feedback form link for site suggestions
```

A second sub-site, **Torsdagsgruppen** (`/teamblekingelf-torsdagsgruppen`), has its own home,
news, calendar, photo gallery and contact page, and shows the club's news alongside its own.

### 2.4 Functionality inventory

| Feature | Where | Audience | Notes for the remaster |
|---|---|---|---|
| News with excerpt, comments, share, RSS | Nyheter, home | Public read, members comment | Keep. Comments need login |
| Calendar with categories (Föreningsaktiviteter, Arbetspass, Läger, Möten, Träningar, Tävlingar, Utbildningar, Övrigt) | Kalender | Public | Keep categories; iCal per category |
| Activity page with sign-up ("Anmälan är öppen för föreningens alla medlemmar") | Each activity | Members sign up | Keep, extend with questions (e.g. relay leg, carpool) |
| Calendar subscription (iCal) | Kalender | Public | Keep, plus a private feed per member |
| Login, password reset, "remember me" | Header | Members | Replace (section 5.1) |
| Member-only pages | Dokument (board minutes), photo gallery, insurance info | Members | Keep as the member area; documents get links and announcements (sections 2.7, 5.7) |
| Static pages with tables, images and files | Most menu items | Public | Replace hand-made tables with structured data where it repeats |
| Training plans per term and group | Intervallpass, Hälsagruppen | Public | Structured sessions; "this Tuesday" on the home page |
| Weekly training image | Träningspass | Public | Replaced by the structured plan |
| Monthly long runs with fee and organisers | Långpass + news | Public | Calendar events of a "Långpass" type |
| Results this year, by race | Tävlingsresultat | Public | Results database (section 5.5) |
| Year-best lists per distance and sex | Årsbästa per year | Public | Computed, not hand-edited |
| All-time lists per race | All Time High | Public | Computed |
| Awards | Årens utmärkelser | Public | Simple yearly entries |
| Own races: info, courses, prices, maps, registration via mittlopp.se | Kustmaran, Jämjöhalvan, VSM | Public | Race pages; registration stays with the timing provider |
| Race volunteers | Funktionärer Kustmaran | Members | Volunteer shifts with sign-up |
| Photo albums | Bildarkiv (Google Photos via goo.gl short links) | Public | Album links kept; resolve short links to full URLs |
| Membership application, fee, payment details | Medlemskap | Public | Application form; register stays in IdrottOnline |
| Facebook group join instructions with QR code | Kontakt, Medlemskap | Public | Replaced by the member area |
| External Google Forms for trips and subsidies | News posts | Members | Built-in forms on activities |
| Club clothing shop (Trimtex team shop, team code) | News | Members | Link from the member area; the team code is member-only |
| Sponsors with links | Footer | Public | Sponsor list managed in admin |
| Site feedback form | Förbättring hemsida | Public | Keep |
| Cookie consent with analytics | All pages | Public | Not needed if no tracking is used (section 7) |
| Print page | Footer | Public | Print stylesheet |

### 2.5 Problems the remaster addresses

1. **Information split across two places.** Members-only news lives in a private Facebook group;
   the site points people there. Members without Facebook, or who miss a post, miss races, relay
   teams and carpool plans.
2. **Little control.** The template decides layout, mobile behaviour, data model and features.
3. **Hand-maintained data.** Results, year-best and all-time lists are edited as page tables, one
   page per year and list. The menu grows by two pages every year.
4. **Forms outside the club.** Trip and subsidy sign-ups go through Google Forms; personal data
   then lives in someone's Google account.
5. **Desktop-first.** Most members will read it on a phone.
6. **Hard to find and hard to navigate.** The club rarely shows up in search results for running
   in Karlskrona, and the left menu has many entries without clear grouping (section 2.6).

### 2.6 Member survey (Google Form, 9 responses)

The club asked members "Vad skulle du vilja se för förbättring på TeamBlekinge hemsidan?". One
response was a test. The others, and what the remaster does about each:

| # | Feedback (summarised) | Response in this spec |
|---|---|---|
| F1 | The club rarely appears on Google; put keywords about running and running clubs in Karlskrona in titles and headings. Also: meta tags, alt text, internal links, mobile friendly, fast loading, backlinks, regular fresh content (raised twice) | Section 5.9, findability |
| F2 | The home page shortcut "Träning" is unclear; call it "Träningspass", "Träningskalender" or similar so it is obvious it leads to the training schedule | Section 5.8, shortcut labels |
| F3 | Make it clearer that newcomers can try training for free up to three times; add a shortcut such as "Prova på Team Blekinge" or "Nyfiken på att löpträna?" so people who have never heard of the club quickly get what they need | Section 5.6, "Prova på" page; section 5.8 home page |
| F4 | The Medlemskap page shows an old first section that can only be edited as raw HTML, and a newer unpublished version sits below it | Section 5.7, editable pages; section 8, content rewritten, not copied |
| F5 | Torsdagsgruppen appears in both the left and the right menu | Section 5.8, one entry per destination |
| F6 | Add an FAQ: the club mailbox gets many of the same questions (is there a medal, what are the time limits), about ten recurring ones | Section 5.7, FAQ |
| F7 | The cookie dialog appears every time | Section 7: no tracking, so no cookie banner |
| F8 | Too many headings in the left menu; group them so it looks tidier | Section 5.8, navigation |

### 2.7 Board documents and the news flow (logged-out view, 2026-10-27)

Seen without login; the member side still needs a logged-in look (section 2.8).

- **How the board announces minutes today:** after each board meeting a public news post titled
  "Nytt protokoll från styrelsemöte finns att läsa" is published, about once a month (2026: May,
  June, July, August, September, October). The text is one line: the minutes from the meeting
  on a given date can be read "under Dokument\Protokoll\Styrelsemöte 2026".
- **No link.** The post names a folder path as plain text. The member has to log in, find
  Dokument in the menu and click through the folders by hand.
- **The documents page is hidden from visitors.** `/teamblekingelf/dokument` redirects to
  `/blank/15`, which says "Inte inloggad. Du måste vara inloggad för att se denna sida." The photo
  gallery (`/bildgalleri`) behaves the same. After logging in it is not known whether the visitor
  is sent back to the page they wanted.
- **The minutes posts crowd the news.** 6 of the 15 latest news posts (May to October 2026) are
  these one-line notices, the same title every time, public, while the content is members-only.
- **No notification.** Members learn about new minutes only by visiting the news page or the
  RSS feed.

### 2.8 The logged-in side and the admin (screenshots, 2026-10-27)

Source: five admin screenshots provided by the club. They contain personal data (names, personal
identity numbers); only the structure is recorded here, never the data.

**SvenskaLag is the club's administration system, not only its website.** The admin top menu:

| Admin section | What it holds (structure only) |
|---|---|
| Hemsida | The website, edited in place: on the home page an editor sees "+ Nyhet", "+ Stycke" and "+ Knapp" buttons, and a pencil on each block and shortcut button |
| Register | The member register. Columns: first and last name, groups, member type, **personal identity number** (shown masked), two flag columns (M, B), a document icon, created and changed date with the editor's initials. Sub-tabs: Personer, Organisationer, Rapporter, Medlemskort, Dubbletter, Belastningsutdrag, Välkomstmejl, Inställningar, Loggen (change log) |
| Fakturering | Invoicing. Not used by the club (confirmed 2026-10-27); membership fee reminders go out as group e-mail (see Utskick) |
| Formulär | Built-in forms, with one item waiting (likely a membership application) |
| Grupper | Three groups: Team Blekinge LF (all members, with a few in a leader role), Torsdagsgruppen (its own top-menu tab), Tränare (locked group, its own top-menu tab). Per group: places, member counts per role, top-menu choice, created date, activity count, notifications on/off |
| Aktiviteter | About 250 activities in the last year. Columns: activity, time, place, group, signed up, **attended**, attendance taken by (initials), **LOK activity** toggle. Sub-tabs: Närvarostatistik, Närvarokrockar, **LOK-stöd**, **Kommunalt stöd**. Board meetings, coach training and competitions are marked as LOK activities with attendance |
| Utskick | **Group e-mail and SMS** sent from the system: about 150 e-mails, with subject, attachments, number of recipients (up to all members), bounces, sender, sent time. Used for membership fee reminders, invitations, surveys, greetings from the chair |
| Schemaläggning | Scheduling (not opened) |

**Logged-in website.** The member sees extra top tabs (Hem, Torsdagsgruppen, Tränare) and these
left-menu items marked with a lock: Medlemmar, Våra grupper, Dokument, Styrelsen (with sub-pages),
Interna resultat. The page frame is today's: orange page background, black banner with three
running figures and the wordmark "TEAM BLEKINGE / LÖPARFÖRENING", black rounded shortcut buttons
with the club mark and a chevron ("Bli medlem – Mer info & ansökan – Klicka här", "Träning – Här
hittar du aktuella träningspass"), right column with Aktiviteter, Följ oss på, and sponsor logos
in a separate column on the orange background.

**Places used for activities:** Teamlokalen and Klubblokalen at Tennvägen 11/11A (Tuesday
intervals 18:00–20:00), Västra Marks IP (Torsdagslöpning 17:30–18:45), plus race venues.

**Consequences for this spec:**

1. Section 2.1 was wrong: personal identity numbers *are* stored in SvenskaLag's register. The
   register of record may be SvenskaLag, IdrottOnline or both; to be confirmed with the board.
2. Replacing the website alone would leave the register, invoicing, group e-mail, attendance and
   LOK/municipal grant reporting in SvenskaLag. Replacing everything is a much larger project and
   means handling identity numbers. This is now open decision 11 and must be settled before
   phase 1.
3. Group e-mail (Utskick) is the channel the club already uses to reach all members; the new
   notifications (section 5.2) must at least match it, including bounce handling.
4. Attendance and the LOK flag on activities are in active use and feed grant applications.
5. Groups with their own top-menu tab (Torsdagsgruppen, Tränare) are how sub-areas work today; a
   coaches' area (Tränare) exists and needs a place in the new site (section 5.1).
6. In-place editing ("+ Nyhet / + Stycke / + Knapp" on the page itself) is what editors know; the
   new admin keeps it (section 5.8).

### 2.8.1 Writing news and editing results today (screenshots, 2026-11-09)

Source: two screenshots of the SvenskaLag editor provided by the club. The results screenshot holds
members' names and times; only the structure is recorded here.

**"Skriv nyhet"** (`/teamblekingelf/cms/redigera/nyhet`) is one page with a main column and a
settings column:

| Part | What it has |
|---|---|
| Header | Back arrow, "Skriv nyhet / Team Blekinge LF", **Publicera** (top right). No preview, no "save draft" |
| Rubrik | One-line title |
| Mall | Layout template, e.g. "Text & bild", "Endast text" |
| Bild | "Infoga bild" box (with "Text & bild") |
| Text | Rich-text editor: undo, redo, bold, italic, underline, bullet and numbered lists, table, link, remove link. No headings, quotes, attachments or embeds in the toolbar |
| Publicera | "Direkt" or a later time |
| Avpublicera | "Aldrig" or a date |
| Åtkomst | "Alla besökare" or (presumably) members only |
| Avisera | Checkboxes per member type, each with a member count: Utövare & målsmän, Ledare, Styrelse, Personal, Volontärer, Stödmedlemmar, Supportrar. Utövare & målsmän and Styrelse are ticked by default, so **every news item notifies almost every member** unless the writer unticks it |
| | "Visa mitt namn i aviseringen" (ticked by default) |

No category, pinning, link to an activity or document, comments setting, or image alt text.

**Results are page text, not data.** Each race's results are a *stycke* (a text block, template
"Endast text") on a results page, edited at `/cms/redigera/stycke/<page>/<block>`:

- Rubrik "<date>, <race>" (e.g. "2026-11-07, Jämjöhalvan").
- A **hand-typed table** in the rich-text editor with four columns: Sträcka (e.g. "21,1 km
  Herr" / "21,1 km Dam"), Namn, Tid (h:mm:ss), Plac (overall place, optionally with the class
  place in brackets: "1 (1 i H45)", "115 ( 6 i H60)").
- Problems visible in one table:
  - Inconsistent spacing and brackets in Plac.
  - Namesakes told apart by a birth-year suffix in the name ("-74", "-68").
  - Men and women are mixed in time order, while Plac counts within each sex.
  - At least one row has a "Herr" distance but a women's class (D60).

  Nothing checks the data. Year-best and all-time lists therefore have to be kept by hand,
  which is what section 5.5 replaces.

**Consequences:**

1. The new editor keeps the familiar shape (title, image, text on the left; Publicera,
   Avpublicera, Åtkomst, Avisera on the right) and the same Swedish labels (section 5.2).
2. "Avisera" today is a per-post choice of member types, and the member types are in practice
   one group. The new site turns it into category-based notifications with a recipient preview.
3. Results entry becomes a form with one row per runner, not a table typed into text
   (section 5.5). The existing tables are regular enough to parse in migration (section 8).

### 2.9 Still to survey

- Dokument: folder structure, file types, who uploads, and what a member sees.
- Formulär (in use; which forms, who fills them in, where answers go) and Schemaläggning.
  Fakturering is not used (confirmed 2026-10-27).
- The member's own view: profile, notification settings, sign-up on an activity.
- Interna resultat: what is in it and why it is members-only.
- Whether membership and LOK reporting also go through IdrottOnline today.

## 3. Facebook: what can and cannot be connected

Meta removed the Facebook Groups API for all Graph API versions on 22 April 2024. An external site
can no longer read posts from, or publish to, a group. A private group was never readable from
outside in any case. Automatic mirroring of the group into the new site is therefore not possible,
and scraping it would break Facebook's terms and members' expectations of privacy.

What works instead:

- **The site becomes the place where member information is published.** News (section 5.2)
  takes over the announcements from board, coaches and organisers, pinned while they matter
  (relay recruitment, race trips, sign-up deadlines); Klubbflödet takes over members' own posts:
  spontaneous runs, photos, questions.
- **Notifications carry it to members** (section 5.2), so it reaches them without Facebook.
- **The Facebook group stays as a social space**, for spontaneous runs and quick chat. Organisers
  can post a one-line pointer there with a link to the news item.
- **Instagram** stays as an outbound channel. Today the home page's "Följ oss på Facebook" link
  points to the private member group, which a visitor cannot see; it should point to a public page,
  if the club has one, or be removed.

## 4. Goals and non-goals

Goals:

- One place for all club information, public and members-only.
- Members never miss a members-only post: notifications by e-mail, and push where they opt in.
- Volunteers can run it without a developer: posts, events, sign-ups, results and pages are
  edited in an admin interface.
- Feels familiar to existing members, moderators and admins, with a modern look (section 5.8).
- Works well on a phone and on a computer or laptop: one responsive layout.
- Keeps everything the current site does (section 2.4) and every existing URL resolves (section 8).
- Answers the member survey (section 2.6).
- Newcomers find the club when they search for running in Karlskrona, and find how to try it.
- Personal data handled under GDPR with as little of it stored as possible.

Non-goals:

- Replacing IdrottOnline as the member register, or handling membership fees and invoices. Since
  these also live in SvenskaLag today (section 2.8), how far the new site replaces SvenskaLag is
  open decision 11.
- Race registration and timing for the club's own races (stay with the timing provider).
- A chat of any kind (decided 2026-10-27). News comments and Klubbflödet cover discussion; quick chat
  stays in the Facebook group if members want it.
- A native app. A web app that can be added to the home screen covers push and quick access.

## 5. The remastered site

### 5.1 Roles and access

| Role | Can |
|---|---|
| Visitor | Read public pages, news, calendar, results, race pages; apply for membership |
| Member | Everything above, plus members-only news, comments, Klubbflödet (post, comment, löprundor), sign-ups, documents, photos, own profile and notification settings |
| Organiser (coach, race committee, trip lead) | Post news, pin news, create events and sign-ups, build relay teams for their event |
| Moderator (board-appointed, may be the same people) | Hide, edit or remove posts and comments in Klubbflödet and on news |
| Coach (Tränare group) | A coaches' area (own feed and documents) hidden from other members, as the locked Tränare group today; take attendance |
| Results manager | Approve and edit results |
| Board | Documents, member list, all of the above |
| Admin | Users, roles, site settings, sponsors, pages |

Login by e-mail one-time link (no password to forget), with passkeys as an option. Accounts are
created by an admin or on approval of a membership application. A member's access ends when the
board marks the membership as ended; there is no automatic sync with IdrottOnline (open decision 4).
The register of record is RF's system (Idrottsarenan); member lists are imported from it
(section 6.1). The new login replaces members' separate SvenskaLag login (members do not use
IdrottsID today): at launch every member gets an invitation e-mail and signs in with a one-time
link, so no password has to be carried over or remembered.

### 5.2 News, Klubbflödet and notifications

Revised 2026-10-27 after looking at the Facebook group (screenshots, structure only). The group
is used for two different things, so the site has two places for them:

1. **Official information** from the board, coaches and organisers (minutes, race trips, relay
   recruitment, volunteer calls, club kit orders): this belongs in **Nyheter**.
2. **Members' own posts**: spontaneous runs ("Tänkte mig ett långpass på lördag 9.00, fart efter
   kamrat"), the weekly Torsdagslöpning, photos and videos, survey reminders, banter, likes and
   comments: this is **Klubbflödet**, the replacement for the Facebook group's feed.

No chat of any kind (decided 2026-10-27): no live messages, typing indicators, presence or direct
messages. Both places use posts with comments.

#### Nyheter (news)

- **One news section for public and members-only news.** Visitors see public news; logged-in
  members also see members-only news, marked with a lock. Replaces today's public news list and
  the Facebook group's role as notice board.
- Written by organisers, coaches, board and admin. Title, text, images, attachments, **category**
  (Tävling & resor, Stafett, Funktionärer, Träning, Långpass, Styrelsen, Klubbkläder,
  Torsdagsgruppen, Övrigt), visibility (public or members only; members only is the default for
  Styrelsen and Stafett).
- A news item can carry:
  - a **link to an event and its sign-up or volunteer shifts**, shown as a sign-up box with
    deadline and spots left ("Vi söker löpare till Kyrkstafetten", "Funktionärer till
    Jämjöhalvan"; section 5.3, 5.4);
  - a **link to a document** (board minutes; section 5.7), shown as a direct "Öppna protokollet";
  - a **"pinned until" date**. Pinned news shows in a "Viktigt nu" row on the news page, the
    member home and at the top of Klubbflödet, and unpins itself when the date passes (default:
    the linked sign-up deadline).
- **Comments** on news (members only, logged in), one level of replies, @mentions, a "Gilla"
  reaction. A reaction is not a sign-up; the sign-up box says so.
- News page: category filter, "Viktigt nu", latest news, upcoming deadlines, year archive
  (2026, 2025, …, as today), "+ Nyhet" for editors, RSS for public news.

#### Writing a news item ("Skriv nyhet")

Familiar layout from today's editor (section 2.8.1), same labels, works on a phone:

- **Main column**
  - **Rubrik.**
  - **Bild:** optional main image, with alt text required and a crop preview.
  - **Text:** rich text with a small, fixed toolbar: bold, italic, heading, bullet and numbered
    lists, link, quote, table, image.
    - Pasting from Word or Google Docs is cleaned to that set.
  - **Bilagor:** attachments, stored as documents with stable links.
  - **Koppla till:** an event or sign-up, or a document, shown as the sign-up box or
    "Öppna protokollet" (see above).
  - Today's "Mall" choice goes away: the layout follows from whether there is an image.
- **Settings column** (below the text on phones)
  - **Kategori** (required). Sets the default visibility and who is notified.
  - **Åtkomst:** "Alla besökare" or "Endast medlemmar".
  - **Publicera:** "Direkt" or a date and time.
  - **Avpublicera:** "Aldrig" or a date.
  - **Fäst till:** a date, or none. Defaults to the linked sign-up's deadline.
  - **Kommentarer:** on or off.
  - **Visa mitt namn som avsändare.**
- **Avisera** replaces today's member-type checkboxes:
  - A summary of who will be notified under the chosen category and members' own settings,
    e.g. "Meddelas: X via e-post direkt, Y i veckobrevet, Z har stängt av".
  - Board and admin get an extra **"Viktigt: skicka e-post till alla medlemmar"** that overrides
    digest settings. It is meant for rare, important messages, and the item records that it was
    used.
- **Header actions:**
  - **Förhandsgranska:** phone and computer view, exactly as members will see it.
  - **Spara utkast,** plus automatic saving while typing.
  - **Publicera.**
  - Drafts are listed under "Mina utkast".
- **After publishing:** "Redigera" and "Avpublicera" on the item. Editing never notifies again
  unless the editor asks for it ("Meddela om ändringen").
- "+ Nyhet" is reachable from the news page, the member home and in place on the home page, as
  today (section 2.8, point 6).

#### Klubbflödet (the club feed, members only)

- A chronological feed where **any member can post**: text, photos or a short video, and a link.
- **Löprunda** post type, inspired by how the group is used today: date, time, meeting place,
  distance, pace and a "Jag hänger med" button with the list of who is coming. Löprundor show in
  members' calendars and in "Kommande löprundor". The weekly Torsdagslöpning is posted the same
  way (or as a repeating löprunda).
- **Comments** with one level of replies, @mentions, "Gilla". Show the latest comment under each
  post and "Visa fler".
- **Filters:** all, löprundor, pictures, Köp & sälj, my posts; **groups** (Torsdagsgruppen, and
  Tränare for coaches only) have their own feed.
- Pinned news appears at the top of the feed as a "Viktigt i Nyheter" link, so members who only
  open the feed still see what matters.
- **Moderation:** report a post or comment; moderators can hide, edit or remove; short feed
  rules. Posts are never public and never indexed.

#### Notifications

- Per member and **news category**: immediately, daily digest, weekly digest, or off. E-mail is
  on by default for Stafett, Tävling & resor, Funktionärer and Styrelsen news.
- Klubbflödet: replies to your posts and comments, @mentions and löprundor you joined notify
  immediately; everything else is off or in the weekly digest by default.
- Channels: e-mail, web push (opt-in), and a private iCal feed of events and löprundor the member
  signed up for. Members follow a news item or post automatically when they comment.
- **"Nytt sedan sist"** on the member home: new news and feed posts since the last visit.
- **Group e-mail (Utskick)**: board and organisers can send an e-mail to all members or a group
  (Torsdagsgruppen, Tränare, everyone signed up to an activity), with attachments, as today.
  Sent mails are listed with recipients and bounces, and also saved as a members-only news item
  so they can be found later. SMS only if the board wants to keep paying for it.

### 5.3 Calendar, events and sign-ups

- Event types: Träning, Långpass, Tävling, Resa, Möte, Arbetspass/funktionär, Läger, Utbildning,
  Torsdagsgruppen, Övrigt. Public or members-only per event.
- **Sign-up** per event, with an optional deadline, a cap, a waiting list and custom questions
  (distance, relay interest, carpool seats offered or wanted, diet, t-shirt size). This replaces
  the Google Forms.
- **Volunteer shifts** for the club's own races: positions and times, members sign up per shift.
- **Attendance** (närvaro) per activity, taken on a phone by the coach or organiser, with an
  "LOK-aktivitet" flag and an export for Kommunalt stöd. LOK-stöd itself is reported in
  Idrottsarenan (section 6.1).
- **Places** as a list (Teamlokalen, Klubblokalen, Västra Marks IP, ...) with address and map
  link, chosen when creating an activity.
- Feeds: public iCal per category, private iCal per member.

### 5.4 Relay team assignment (stafettlagsindelning)

For relays such as Jämjöhallenstafetten, the Växjö Marathon relay or Kyrkstafetten:

1. The organiser creates a relay event: number of legs, leg distances, team size, mixed rules,
   sign-up deadline.
2. Members sign up with their preferred leg or distance and an expected pace (optional).
3. The organiser builds teams in a drag-and-drop view, with suggestions that balance expected
   time; team names must contain "Team Blekinge".
4. Publishing the teams notifies each member of their team, leg, start time and meeting point,
   and adds the team list to the relay news item.
5. Changes after publishing (injury, swap) notify the affected team only.

### 5.5 Results and records

- **Results database:** race, date, distance, discipline (road, trail, track, triathlon, ultra),
  member, time, place overall and in class, and a source link.
- **Entry:** members submit their own result; the results manager approves it. Bulk import from a
  timing provider's result list by pasting or uploading a file.
- **Entering a race's results** (replaces the hand-typed table, section 2.8.1):
  - **Lopp:** pick an existing race, or create one (name, date, place, link to the organiser's
    result list). It can be linked to the calendar event.
  - **Rows**, one per runner. Each row has:
    - the **member**, picked by name with autocomplete; namesakes are told apart by group or photo,
      not by a birth-year suffix; a free-text name is allowed for a guest;
    - **distance** (from the race's distances);
    - **time** (h:mm:ss, validated);
    - **overall place, place in own sex, class and place in class**, each a separate field;
    - a DNF/DNS status.
  - **Paste import:** copy rows from the organiser's result list or a spreadsheet; the form maps
    the columns, matches names to members, and shows unmatched or doubtful rows for review.
  - **Checks:** the sex must match the class (H/D), times must be in order within the places,
    and a member can't appear twice in one distance.
  - **Result:** the race page shows a table sorted and grouped by distance and sex, with
    "Personbästa" and "Klubbrekord" badges. Year-best and all-time lists update automatically.
  - **"Skapa nyhet"** creates a draft news item ("Resultat från Jämjöhalvan") that links to the
    race page, for the results manager to edit and publish.
- **Computed views:** results per year (replaces "Tävlingsresultat <year>" and "Resultat <year>"),
  year-best per standard distance and sex (replaces "Årsbästa <year>"), all-time lists per race
  and distance (replaces "All Time High"), and a member's own results page (members only by
  default).
- **Publication:** follows today's practice that a member can ask not to have results published;
  a per-member "publish my results" setting, default on.

### 5.6 Training

- Training groups (Långa, Korta, Hälsagruppen, Torsdagsgruppen) with a short description.
- **Term plans** as rows: week, date, session, comment, coach. The home page shows "Tisdag: ..."
  for each group, replacing the weekly image.
- Monthly long runs as Långpass events with place, organisers, fee and sign-up.
- Marathon training programmes as downloadable files.
- **"Prova på" page** (F3) for people who have never heard of the club: newcomers may train for
  free up to three times before joining; when and where Tuesday training is, which group suits
  whom, what to bring, where to park, who to ask, and then how to become a member. An optional
  "Jag vill prova" form notifies the coaches and asks nothing beyond name, e-mail and preferred
  group.

### 5.7 Pages and content

- Editable pages for the club, membership, board and contacts, policies, triathlon, parking,
  links, and the feedback form. Pages are edited in a visual editor, never as raw HTML, and a
  page has one published version plus at most one draft (F4).
- **FAQ** (F6): questions and answers grouped by topic (training, membership, the club's own races),
  each linkable, editable by board and race committees. Race pages show their own questions (medal,
  time limits, start numbers, results, prices). Starts with the roughly ten questions the club
  mailbox gets most often.
- **Own races:** one page per race with date, distances, courses with maps, prices per period,
  registration link to the timing provider, volunteer sign-up, results and photos. Veteran-SM as a
  section of the host race.
- **Torsdagsgruppen** as a section with its own posts, events and photos, not a separate site.
- **Awards** as yearly entries with category, winner and citation.
- **Photos:** albums linked (Google Photos) or uploaded; members-only albums possible.
- **Sponsors:** name, logo, link, level, shown in the footer and on race pages.
- **Documents** (replaces today's flow, section 2.7): a document library with folders (for
  example Protokoll / Styrelsemöte 2026, Årsmöte, Stadgar & policyer, Försäkring), access per
  folder (public, members, board only) with per-file override.
  - **Every folder and file has a stable, readable link**, such as
    `/dokument/protokoll/styrelsemote-2026/2026-10-12`, which works as a link in posts, e-mails
    and the Facebook group. A logged-out visitor who follows it is asked to log in and then lands
    on the document, not on the start page.
  - **Upload and announce in one step.** Uploading has a "Meddela medlemmarna" option, on by
    default for Protokoll, that creates a news item in the Styrelsen category (members
    only) with a direct link to the file, the meeting date in the title, and an optional short
    summary. Members following Styrelsen get it by their notification setting. Nothing is
    published as public news unless chosen.
  - **Templates for recurring uploads:** the board picks "Styrelseprotokoll", enters the meeting
    date, drops the PDF; title, file name, folder (by year, created automatically) and the
    announcement text are filled in.
  - Drag-and-drop or phone upload, several files at once; PDF preview in the browser; replacing a
    file keeps its link and the earlier version.
  - Search across document titles, and the newest board minutes listed on the member home.

#### Updating page texts with an overview

The board's question: *how can the site's texts be updated easily while still keeping an overview?*
Today a page is edited in place, block by block ("+ Stycke", pencil), with no list of pages, no
owner, no history, and old versions left in place (F4). The same fact (fee, bankgiro, training
times) is typed on several pages and drifts apart.

Alternatives, which can be combined:

| | Alternative | Easy to edit | Overview | Effort | Notes |
|---|---|---|---|---|---|
| A | **Edit in place** (as today): pencil on each block when logged in as editor | High, familiar | Low | Low | Keep as the way in, but not as the only way |
| B | **"Sidor" overview** in admin: every page in one list with section, status (Publicerad / Utkast / Behöver ses över), last changed and by whom, owner, next review date | Medium | **High** | Low | One place to see the state of all texts |
| C | **Draft, preview and version history:** edit without touching the live page, preview on phone and computer, publish; earlier versions can be compared and restored | High | Medium | Medium | Fixes F4: no half-old pages, and mistakes can be undone |
| D | **Owner and review date per page:** e.g. Medlemskap → kassör, Träning → tränarna; an e-mail reminder and a "Behöver ses över" flag when the date passes | Medium | **High** | Low | Keeps texts from going stale without a central editor |
| E | **Shared facts ("Fakta"):** membership fee, bankgiro and Swish, training times and places, contact addresses entered once and inserted into pages as a box or inline value | High | High | Medium | Change once, correct everywhere; also feeds the FAQ and the home page |
| F | **Suggest a change:** a "Föreslå ändring" link on each page for logged-in members; the suggestion goes to the page owner's list | High for members | Medium | Low | Members spot errors; owners decide |
| G | Pages as Markdown files in Git (edited on GitHub or through a Git-based CMS) | Low for the board | Medium | Low | Full history, but needs Git knowledge; not for the board |
| H | A separate headless CMS (e.g. Directus, Strapi, Sanity) | Medium | Medium | High | Another system, login and cost; the site already has its own admin |

**Recommendation:** A + B + C + D + E (F later). Editors keep the pencil they know, every edit
goes through draft → preview → publish with history, and the "Sidor" overview shows every page with
its owner, status and review date, sorted with "Behöver ses över" first. Shared facts remove the
most common source of contradictions. G and H are rejected: the people editing are the board and
volunteers, not developers. This replaces "one published version plus at most one draft" above
with a version history (open decision 12).

#### Headings, buttons and other short texts

Clarified 2026-11-09: the board's main need is to **change headings and short texts quickly**:
- the home page headline and the "Aktuellt" strip;
- shortcut button texts ("Bli medlem – Mer info & ansökan");
- section headings ("Veckans träning");
- menu labels;
- race names with the year.

Today each one is edited separately, in place, and a text repeated in several places has to be
found and changed by hand.

| | Alternative | Best for |
|---|---|---|
| 1 | **Click to edit in place:** in "Redigeringsläge" every heading and button text is editable directly on the page; Enter saves, Esc cancels, and the change can be undone | One heading, right now |
| 2 | **"Rubriker och knappar" list:** every short text on the site in one table, grouped by area (Startsidan, Menyn, Sidfoten, each page), with the current text, an edit field, where it is shown, and last changed | Overview, and changing several at once |
| 3 | **Search and replace across the site:** e.g. "Jämjöhalvan 2026" → "Jämjöhalvan 2027", or "Träning" → "Träningspass" (F2). Shows every hit with its context; you tick which to change and preview before applying. Logged and undoable | Renames and the yearly roll-over |
| 4 | **Scheduled headings and banners:** the home page headline and "Aktuellt" strip get "visa från / till", so the next one is prepared and swaps in by itself (Jämjöhalvan until race day, then Kustmaran) | Seasonal home page texts |
| 5 | **Headings that fill themselves in** from data: next race and its date, the current year, next training ("Nästa lopp: {lopp} {datum}") | Texts that would otherwise go out of date |
| 6 | **One name, one place:** a page's title drives its menu label, breadcrumbs and link texts (with an optional shorter menu label), and renaming keeps the old address working | Menus that stay in step with pages |

**Recommendation:** 1 + 2 + 3 as the core, with 4 for the home page and 5 for race and training
headings, plus 6. Short texts are stored as named fields, not inside page HTML, which is what
makes the list (2) and search and replace (3) possible.

### 5.8 Design

Familiar to the people who use today's site, with a modern feel, and equally good on a phone and
on a computer.

**Familiar.** Members, organisers, moderators and admins should recognise the site the day it
switches:

- Same club name, logo, colours and dark header with the orange accent; the same Swedish names for
  things (Nyheter, Kalender, Träningspass, Våra lopp, Resultatarkiv, All Time High, Bildarkiv,
  Medlemskap, Styrelsen och ansvariga) so people find what they look for by the word they know.
- The home page keeps today's building blocks in the same order of importance: upcoming
  activities, latest news, the club's races, sponsors at the bottom.
- On a computer, a right-hand column with upcoming activities and the "Bli medlem" / "Prova på"
  boxes stays, as today; it holds no menu links, so nothing is duplicated (F5).
- The admin interface uses the same concepts volunteers know from SvenskaLag (Nyheter, Kalender,
  Aktivitet med anmälan, Sidor, Dokument, Sponsorer) and adds the new ones (Klubbflödet, Resultat,
  Träningsplan, FAQ) alongside them, so admins learn additions rather than a new system.
- Old links and bookmarks keep working (section 8).
- Today's signature elements carry over in modern form: the black banner with the running
  figures and the "TEAM BLEKINGE / LÖPARFÖRENING" wordmark, the black rounded shortcut buttons
  with club mark and chevron, and orange as the page's dominant colour (section 2.8).
- Editors keep editing in place: logged in with edit rights, the home page and every page show
  "+ Nyhet", "+ Stycke", "+ Knapp" and a pencil per block, as in SvenskaLag today, alongside the
  full admin.

**Modern.** Clean, spacious layout on a white and light-grey base; cards for news, events and
races; large readable type; real photos from the club's albums; clear buttons with labels that say
what they do; fast pages without pop-ups or cookie banners.

**Responsive, phone and computer.** One responsive layout, not separate mobile and desktop sites:

- **Phone (from 360 px):** single column, bottom bar (below), tap targets at least 44 px, tables
  (training plans, results, all-time lists) turn into stacked rows or scroll sideways inside the
  table only, never the whole page.
- **Tablet:** two columns where it helps (content plus upcoming activities).
- **Computer and laptop (from about 1024 px):** grouped top menu with drop-downs, content area with
  a comfortable reading width, right column as described above, full-width tables for results and
  training plans, and the admin and relay team builder (section 5.4) laid out for mouse and
  keyboard.
- Tested on current iOS Safari, Android Chrome, and desktop Chrome, Firefox, Safari and Edge.

Visual identity, modernised:

- Colours from today's site and kit: near-black `#221E1F`, orange `#EE8915`, purple as a second
  accent (to be matched to the kit), white and light grey surfaces. Contrast to WCAG 2.2 AA.
- Inter for all text.
- Mobile first: a bottom bar on phones with Hem, Kalender, Flöde (members), Nyheter, Meny.
- **Navigation** (F5, F8): a short top menu of grouped sections instead of a long left column,
  for example Träna med oss (Prova på, Träningspass, grupper, Långpass, program), Tävla (våra
  lopp, resultat, rekord), Föreningen (om oss, medlemskap, styrelse, utmärkelser, Torsdagsgruppen,
  triathlon), Frågor & kontakt (FAQ, kontakt). Each destination appears once; no repeated links in
  side columns. Per-year result pages are gone from the menu (section 5.5).
- **Shortcut labels say where they lead** (F2): "Träningspass" or "Veckans träning", not
  "Träning"; "Prova på gratis", not just a group name.
- Home page for visitors: hero with "Prova på gratis" and "Bli medlem", one line stating that you
  can try training for free up to three times (F3), this week's training, upcoming events, latest
  public news, the club's own races, sponsors.
- Home page for members: "Viktigt nu" (pinned news), new news and feed posts, my sign-ups,
  this week's training, upcoming relay or trip deadlines.
- Swedish throughout; English for race pages as a later option.

### 5.8.1 Themes (added 2026-11-09)

The three mockup versions become **three themes of the same site**. Content, menus, pages and
functions are identical; only the look changes.

| Theme | From | Character |
|---|---|---|
| **Klassisk** | Mockup v1 | Closest to today's site: light ground, black header, rounded cards, orange accents. The familiar choice (section 5.8) |
| **Fart** | Mockup v2, based on a fellow member's demo (`teamblekinge.appzma.com`) | Dark hero, slanted section edges, speed lines, tilted photos and cards, countdown |
| **Klubbdräkt** | Mockup v3 ("Klubbstugan") | Photo-first with bold condensed headlines over images, square labels, purple bands, and the orange and purple stripes from the club singlet |

What differs between themes, and what never does:

- **Differs:**
  - colours (from the same palette: black, orange, purple and their tints);
  - heading font (Inter, or Barlow Condensed in Klubbdräkt);
  - corner radius;
  - slant and tilt;
  - section edges (straight or slanted);
  - decorations (speed lines, kit stripes);
  - two layout variants:
    - the home page hero: split with photo, or full-bleed photo;
    - news cards: image beside the text, or headline over the image.
- **Never differs:** page structure, menu, texts, order of sections, functions, and accessibility.
  - Every theme meets WCAG 2.2 AA on its own; contrast is checked automatically for each theme's
    colour pairs.
  - Tilts and slants are decoration only, and text is never rotated so far it is hard to read.
  - Motion respects "reduce motion".

**Who chooses:**
- **The site default:** an admin sets it under Administration › Utseende, with a live preview.
- **Each member:** can pick their own theme under Mina sidor; the choice is remembered on the
  device.
- **In the demo:** a theme switch in the footer (and `?tema=klassisk|fart|klubbdrakt`) lets the
  board compare the three on real pages.

The page is rendered on the server in the chosen theme, so it never flashes the wrong look.
Open decision 13.

### 5.9 Findability (F1)

- Server-rendered public pages with descriptive titles and headings that use the words people
  search for, such as "Löparklubb i Karlskrona", "löpträning Karlskrona", "intervallträning",
  "Kustmaran", "Jämjöhalvan".
- Per page: meta description, Open Graph image and text for link previews, canonical URL.
- Alt text required when uploading an image.
- Structured data (schema.org): SportsClub for the club, SportsEvent for the club's own races and
  public events.
- Sitemap and robots.txt; members-only pages excluded.
- Fast on a phone: small pages, optimised images, no third-party scripts.
- Internal links between related pages (race page → FAQ → results → photos).
- Backlinks the club can ask for: the municipality's club directory, Blekinge's sports
  federation, race calendars, the timing provider, sponsors.
- Regularly updated public content: public news, race reports and results keep the site fresh.
- A Google Business Profile for the club house, if the board wants one (open decision 10).

## 6. Architecture

Requirements that drive the choice: volunteers edit content, e-mail and push notifications,
structured data with computed lists, GDPR with EU hosting, low running cost, and one person able
to maintain it.

Options:

| Option | Control | Effort | Notes |
|---|---|---|---|
| A. Stay on SvenskaLag and tidy up | Low | Low | Fixes menu and content, not the Facebook split or the data model |
| B. Another club platform (Laget.se, IdrottOnline klubbsida) | Low | Medium | Same template limits |
| C. Own web app with an admin interface | Full | High | Everything in section 5 |

Recommended: **C**, as a single web application with a built-in admin, a relational database and
a transactional e-mail service, hosted in the EU. A concrete stack is open decision 1.

### 6.1 Decoupling: register and LOK in RF's system, website on its own (preliminary)

Decision 11 is preliminarily option C: three concerns, three homes, loosely coupled.

| Concern | Home | Notes |
|---|---|---|
| Member register (identity numbers, membership, roles) | RF: IdrottOnline, from 23 Nov 2026 **Idrottsarenan** ("Person- och organisationsregister") | The only place identity numbers are stored |
| LOK-stöd (and other RF grants) | RF: Idrottsarenan, "Ekonomiska stöd" | Attendance reported there |
| Website, member area, news, Klubbflödet, events, results, documents, group e-mail | The new site | No identity numbers |
| Invoicing of membership fees | Not needed: SvenskaLag's Fakturering is not used (confirmed 2026-10-27). Fees are paid by Swish/bankgiro as on the Medlemskap page; reminders go out as group e-mail | — |
| Forms (Formulär) | The new site (sign-up questions, section 5.3; membership application) | In use today; to be surveyed later (section 2.9) |
| Kommunalt stöd (Karlskrona municipality) | Open: attendance export from the new site, or reported from Idrottsarenan | To check what the municipality requires |

**What was found (web research, 2026-10-27; RF pages, not yet confirmed with RF):**

- **IdrottOnline closes for good on 10 November 2026 at 23:59.** The LOK app and the IdrottOnline
  app close with it. **Idrottsarenan**, RF's new system on the same data, opens to everyone on
  **23 November 2026**. Between those dates several services are unavailable. RF asks clubs to
  export what they need from IdrottOnline and finish open grant cases before 10 November.
  Membership applications are paused from 1 October to 23 November.
- **Login.** IdrottOnline login runs at `login.idrottonline.se` on RF's login service (Curity),
  with IdrottsID or personal identity number as user name; administrators have needed Freja+
  (e-ID) since 2023-11-01, and federations say every Idrottsarenan user in a club will need
  Freja+. RF says the login service is not affected by the shutdown. **No public information was
  found that RF offers "log in with IdrottsID" (OpenID Connect or similar) to third-party sites
  such as a club's own website.** Reusing the RF login on the new site is therefore unconfirmed.
- **APIs.** RF API 2.0 includes *Hämta person* and *Skapa, uppdatera, ta bort person* (member
  data), *Medlemsansökan* (membership applications from a club's website), and *Skicka in
  LOK-aktiviteter* (activities with participants for LOK). RF Synk API gives bulk data plus a
  change feed. *Hämta LOK-data* and *Hämta aktiviteter* are planned. **Access today is only for
  vendors working for federations and for vendors of club systems; individual clubs "will be
  able to connect later".** Production needs an agreement with RF. All APIs are closed 11–23
  November 2026; RF API 2.0 reopens on 23 November, RF Synk API in Q1 2027. The old XML/SFTP
  import and the REST/JSON export were retired on 2025-12-31 and 2026-02-02.
- **Club access to the register is the club's choice** (none, read without identity numbers, or
  read and change), which governs what an integration may see.
- **LOK-stöd** applies to activities for participants aged 6–25, applied for digitally through
  RF's system. Whether Team Blekinge has LOK-eligible activities today, given an adult club, is
  to be checked; the screenshots show LOK flags on board meetings and coach training.

**Consequences for the design (preliminary):**

1. **Login: the new site's own login** (e-mail one-time link, passkeys; section 5.1). Members
   log in to SvenskaLag today with a separate SvenskaLag account, not with IdrottsID (confirmed
   2026-10-27), so RF's login is not something members are used to and is not needed. Board
   members and registrars keep using RF's login (Freja+) in Idrottsarenan for the register and
   LOK, which is separate from the website. "Logga in med IdrottsID" on the new site stays a
   possible later option, never a requirement.
2. **Member list: manual sync first.** The board exports the member list (name, e-mail, member
   type; no identity numbers) from Idrottsarenan and imports it into the new site, which
   invites new members and flags members no longer on the list for the board to end. When RF
   opens the APIs to clubs, replace the import with *Hämta person* / Synk, reading without
   identity numbers.
3. **Membership applications** on the new site are sent to the board, who registers the member
   in Idrottsarenan. Later, *Medlemsansökan* can pass them on directly.
4. **LOK and attendance.** The new site keeps attendance per activity (section 5.3) for the
   club's own use and Kommunalt stöd; LOK reporting is done in Idrottsarenan. Later, *Skicka in
   LOK-aktiviteter* can send it from the new site.
5. **The new site's data model stays independent of RF's**: a member record holds an optional
   RF person id for future matching, nothing more.

**SvenskaLag today: how the site, login and register connect (investigated 2026-10-27, from
public pages, DNS and the site's own code; not yet confirmed with SvenskaLag):**

- **teamblekinge.nu *is* SvenskaLag; there is no separate website.** `www.teamblekinge.nu` is a
  CNAME to `svenskalag.se`, and the bare domain points to the same IP (81.91.4.137).
  `svenskalag.se/teamblekingelf` redirects (301) to `www.teamblekinge.nu`, and the bare domain
  redirects to `www`. The domain itself (DNS at Ballou, e-mail through MailChannels) belongs to the
  club, not to SvenskaLag. Moving the site means changing DNS and asking SvenskaLag to remove the
  custom domain, so that `svenskalag.se/teamblekingelf` stops redirecting.
- **Login is SvenskaLag's user name and password form**, posted to
  `www.teamblekinge.nu/teamblekingelf/logga-in` (fields `UserName`, `UserPass`, "Kom ihåg mig").
  It has forgot-password and set-new-password links, and accounts are created by the club. The
  session cookie belongs to the club's domain on SvenskaLag's server, so another site cannot see
  it.
- **No "log in with SvenskaLag" exists.** SvenskaLag has no public OAuth or OpenID Connect
  service. Its API (`api.svenskalag.se`, OpenAPI v1, documented at `/scalar`) has no login
  endpoints. The only way to reuse SvenskaLag passwords would be to pass members' passwords on to
  SvenskaLag's form, which is scraping and credential handling and is ruled out. **The login
  cannot be reused; the new site's own login stands (consequence 1).**
- **The register *can* be reused, read only, through SvenskaLag's API.** The API has two
  endpoints, authenticated with an API key (header `X-Api-Key`) or a JWT:
  - `GET /settings/membership-periods`
  - `GET /members?periodId=…`, with optional `email` and `ssn` filters. It returns user id,
    membership number, name, e-mail, mobile, city, member types, family and guardians, membership
    status (paying, honorary, permanent), and created, modified, deleted and anonymised dates. It
    **also returns the personal identity number (`ssn`)**.

  How a club gets an API key is not documented publicly (an article from 2024 still said there was
  no public API). Ask SvenskaLag.
- **SvenskaLag already feeds IdrottOnline.** Per SvenskaLag's FAQ, its IdrottOnline integration
  pushes members and attendance one way (SvenskaLag → IdrottOnline) several times a day. The
  integration is included in the base package and pre-fills the LOK application, which the club
  only confirms. It is switched on by a club administrator in IdrottOnline under Integration. If
  Team Blekinge has it on, **SvenskaLag is the register of record and LOK reporting is
  effectively automated today**. Leaving SvenskaLag entirely would lose that automation, and
  section 8 would have to plan for it.

**What this opens up: option C2, "SvenskaLag as register only" (alternative to C, to decide with
the board):**

| Concern | Option C (current) | Option C2 |
|---|---|---|
| Register | Idrottsarenan; manual CSV import | SvenskaLag stays the register and keeps feeding RF; the new site syncs nightly through `GET /members` |
| Login | Own (e-mail link, passkeys) | Same. The e-mail link is sent only to addresses that are current members in SvenskaLag |
| LOK | Entered in Idrottsarenan | Attendance stays in SvenskaLag, if LOK applies at all, so the pre-filled LOK flow continues |
| Website, news, Klubbflödet, events, documents | New site | New site |
| SvenskaLag website | Closed | Closed (domain moved); SvenskaLag kept for register and administration |

C2 keeps what works, automates the member list and removes the manual import, but keeps paying
SvenskaLag. The sync module (`server/utils/rf/` in CLAUDE.md, to be made generic as
`server/utils/register/`) must **drop `ssn` and guardians' `ssn` at the boundary** and never store
or log them.

**Questions for RF and the board before relying on this:**

- (Low priority) Can a club's own website use RF's login (IdrottsID via Curity/OIDC)?
- When and how can an individual club get API access, and can a club-built site qualify?
- Is the register of record today SvenskaLag or IdrottOnline? Board: check in IdrottOnline
  under Integration whether the "Svenskalag" integration is switched on.
- SvenskaLag (support@svenskalag.se):
  - How does a club get an API key for `api.svenskalag.se`, and at what cost?
  - Can the club keep the register and the RF integration but drop the website (price,
    package)?
  - Does the integration carry over to Idrottsarenan on 23 November 2026?
  - Can the API key be limited to fields without `ssn`?
- Which activities, if any, qualify for LOK-stöd, and what does the municipality need for
  Kommunalt stöd?

## 7. Privacy and security

- Store only name, e-mail, optional phone, role, notification settings, sign-ups and results. No
  identity numbers (they stay in IdrottOnline).
- Members-only content is never in public HTML, feeds or search indexes.
- No tracking cookies and no third-party analytics, so no cookie banner is needed; if analytics
  are wanted, a cookieless, EU-hosted tool.
- Fonts served from the site itself, not Google Fonts.
- A privacy notice: what is stored, why, how long, and how to have it removed.
- Leaving the club: account disabled, personal data deleted after a retention period, results
  kept as historical club records unless the member asks for removal.
- Backups of database and uploads, encrypted, in the EU.

## 8. Migration

Nothing on the live site changes until the switch; both run side by side.

1. **Content export, read-only.** Public pages, news (RSS plus pages), and calendar (iCal feed,
   284 events) can be fetched without login. Member-only content (documents, galleries, comments)
   needs an admin export or manual copy. Pages are reviewed and rewritten as they move, not copied
   as they are: for example Medlemskap is rewritten from its old and unpublished new versions (F4).
   The FAQ starts from the questions the club mailbox receives most often (F6).
2. **Results.** Parse the yearly result pages and all-time lists into the results database;
   flag rows that do not parse for manual review.
   - Each race is a text block headed "<date>, <race>" holding a table with the columns
     Sträcka, Namn, Tid and Plac, where Plac is "<overall> (<class place> i <class>)"
     (section 2.8.1).
   - Birth-year suffixes on names ("-74") help match namesakes to members.
   - Rows whose sex and class disagree are flagged. The archive says it holds over 13,000 results
   from about 1,300 races.
3. **Photo links.** Resolve the `goo.gl` short links to their full Google Photos URLs before
   storing them; Google has been retiring the short-link service.
4. **URLs.** Redirect every old path (`/sida/<id>/<slug>`, `/nyheter/<id>/<slug>`,
   `/<club>/aktivitet/<id>/<slug>`, `/kalender`, `/kontakt`) to its new page, from a mapping table.
5. **Members.** Invite current members by e-mail from a list the board exports from RF's system
   (Idrottsarenan after 23 November 2026) or SvenskaLag, without identity numbers.
   **Before 10 November 2026**, independent of this project: export from IdrottOnline whatever
   the club needs, as RF asks, and check with SvenskaLag how its IdrottOnline link behaves after
   the switch.
6. **Switch.** Move DNS for `teamblekinge.nu` to the new site; keep the SvenskaLag site reachable
   on its own address, read-only, for a transition period.
7. **Facebook.** Pin a post in the group announcing the new site, and from then on post
   pointers to news items there. The group's own history is not imported (section 3).
8. **SvenskaLag.** Export the register, activity and attendance history, documents and sent
   e-mails the club wants to keep; end the subscription only when every function has its new
   home (section 6.1).

## 9. Phases

1. **Foundation:** design system, grouped navigation, public pages, "Prova på", FAQ, news,
   calendar with iCal, findability basics, URL redirects. Content migrated. Can replace the public
   site on its own and answers most of the member survey.
2. **Member area:** login, roles, news with members-only items and pinning, Klubbflödet with
   löprundor, comments,
   notifications by e-mail.
3. **Events:** sign-ups with questions and waiting lists, volunteer shifts, private iCal.
4. **Relay team assignment.**
5. **Results database:** migration, submission and approval, computed lists.
6. **Training plans, Torsdagsgruppen section, photos, documents, sponsors.**
7. **Web push and home-screen install.**

### 9.1 Built so far (2026-11-09): first slice of phase 1

Implementation started 2026-11-09. Code and tooling are described in `CLAUDE.md`; this lists what
works for visitors.

| Area | Built | Not yet |
|---|---|---|
| Themes (5.8.1) | Klassisk, Fart and Klubbdräkt. The server picks the theme, so there is no flash of the wrong look. Footer switch and `?tema=` for the demo, remembered in a cookie. Site default from `SiteSetting`. Automatic contrast check per theme | Admin page "Utseende", member preference on Mina sidor |
| Navigation (5.8) | Grouped top menu with keyboard support, phone bottom bar (Hem · Kalender · Flöde · Nyheter · Meny), phone menu sheet, skip link | – |
| Phones and iPhone (5.8) | Tested on Android (Chromium) and iPhone (WebKit, which every iOS browser uses). Safe areas around the notch and home indicator, no sideways scroll in any theme, page locked behind the open menu | Testing on a real device before the demo |
| Home page | Hero with countdown to the next race, "Viktigt nu", Veckans träning from the term plan, latest news, upcoming activities, races (upcoming first, then "Avgjort"), FAQ, sponsors | Editing in place |
| News (5.2) | Public list with category and year filters, article page, members-only items hidden from visitors, lists, sitemap and RSS (404 by address), RSS feed | Members' view, comments, pinning UI, editor (2.8.1) |
| Calendar, training, races, FAQ, Prova på, Föreningen | Public pages from the database: upcoming events by month, groups and term plan, race pages, FAQ by topic | iCal, sign-ups, results |
| Findability (5.9) | Server-rendered pages, titles and descriptions, `sitemap.xml`, `robots.txt` | Structured data |
| Old addresses (8, step 4) | 301 redirects for known SvenskaLag pages and news, fallbacks per section | The full mapping table from the content export |
| Member area | `/flodet` and `/dokument` send visitors to a login placeholder | Login (magic link, passkeys), everything members-only |
| Data | PostgreSQL schema and first migration for settings, members (no identity numbers), news, events, training, FAQ and sponsors; demo seed with placeholder names | Member import, results, documents |
| Content packs (added 2026-11-14) | A deploy is loaded from a zip (`content.json` plus images): `check`, `import` (replaces all content in one go, members untouched) and `export`. The public repository holds only neutral placeholder images; the club's real photos travel in a private pack. Weekly activities are written once and expanded into dates | Admin upload of a pack; an editor for the content itself (5.7) |

Content in the demo is a sample from the public site with `[Namn]` placeholders. Recurring
activities and the term plan are generated relative to the day the seed runs. The demo server
is loaded from the club's private content pack, which adds the real photos. Photos of identifiable
people, children above all, are never in the public repository.

## 10. Open decisions

1. **Stack.** Chosen 2026-10-27 and built on 2026-11-09:
   - Nuxt 4.6 (Vue 3, TypeScript) with Nitro server routes;
   - PostgreSQL 17 and Prisma 7 in Docker Compose: one repo, one deploy;
   - Vitest 5 for unit and component tests, with coverage thresholds;
   - Playwright for e2e on desktop, Android and iPhone (WebKit), with axe accessibility checks.

   The repo layout is modelled on the sibling repo finishline. Details in `CLAUDE.md`.
2. **Hosting and cost.** EU hosting, a domain already owned, and an e-mail sending service. Who
   pays, and what monthly budget the board accepts.
   *Update 2026-11-09:* not relevant yet. The first version runs as a **demo at
   `klubbstugan.appzma.com`** (this project's own version), on a server a club member provides;
   production hosting is decided later. `teamblekinge.appzma.com` is a fellow member's separate demo,
   used as design inspiration (mockup v2).
3. **Who owns it.** Two or more admins, so the site does not depend on one person.
4. **Membership status.** Manual marking by the board, or a periodic import of the member list
   from IdrottOnline.
5. **Replies on public news.** Members only (recommended), or none.
6. **Photos.** Keep linking Google Photos albums (recommended to start), or host uploads.
7. **Results publication default.** On with opt-out (today's practice) or opt-in.
8. **Board approval.** The board decides on moving off SvenskaLag and on the Facebook group's
   new role.
   *Update 2026-11-09:* not relevant yet. The aim for now is to **demonstrate a replacement** for the
   current site; the board decides after seeing the demo.
9. ~~Forum or also chat.~~ Decided 2026-10-27: no chat. Revised the same day: official
   information goes in Nyheter, members' own posts in Klubbflödet (section 5.2).
10. **News and feed setup.** Final news categories, who may publish in each, who moderates
   Klubbflödet, and
   whether to create a Google Business Profile for the club (section 5.9).
11. **How much of SvenskaLag to replace** (section 2.8; decide before phase 1).
   - *A. Website and member area only.* SvenskaLag (or IdrottOnline) keeps the register,
     invoicing, attendance, LOK and municipal grant reporting and group e-mail. Smallest and safest
     with personal data, but two systems, two logins, and activities kept in two places unless
     the new site reads them from SvenskaLag's iCal feed.
   - *B. Everything.* One system, but the club then builds and maintains a member register with
     identity numbers, invoicing, attendance and grant exports, with the GDPR duties that come
     with it.
   - *C. Split by the national systems.* Register and LOK reporting in IdrottOnline (built for
     it, free for clubs), everything else in the new site, SvenskaLag ended. Needs checking
     that IdrottOnline covers invoicing and attendance the way the club uses them.
   - *C2. SvenskaLag as register only* (section 6.1, found 2026-10-27). SvenskaLag keeps the
     register and its automatic feed to RF (members, attendance, pre-filled LOK); the new site
     replaces the website and syncs the member list through SvenskaLag's API. The login is still
     the new site's own, because SvenskaLag offers no third-party login.
   *Update 2026-11-09:* set aside for now. Working assumption: **the new site keeps its own member
   register** (name, contact details, member type, status), and a migration into it from SvenskaLag
   or Idrottsarenan may be needed later. Options C and C2 above remain the background for that.

   **Chosen, preliminary (2026-10-27): C**, with register and LOK in RF's system (Idrottsarenan
   from 23 November 2026, section 6.1) and the website rebuilt as a completely new, separate
   system. The website has its own login, replacing the SvenskaLag login; invoicing is not used (section 6.1).
12. **Page editing model** (section 5.7, "Updating page texts with an overview"): recommended A + B
   + C + D + E, with page owners named by the board. Who owns which page is the board's call.
13. **Themes** (section 5.8.1):
   - Which theme is the default when the site goes live.
   - Whether members may pick their own theme (recommended: yes).
   - Whether the board wants all three kept or narrows them down after the demo.
   - Fart builds on a fellow member's design: ask them before it ships beyond the demo.

## 11. Risks

- **Adoption.** Members used to Facebook keep reading only Facebook, and an empty feed stays
  empty. Mitigation: e-mail by default for important announcements, pointers in the group, all
  relay and trip recruitment posted only as news from launch, löprundor posted in Klubbflödet by
  coaches and regulars from day one, a launch at a Tuesday training.
- **Scope.** SvenskaLag does far more than the website (section 2.8); leaving it may cost the
  club its register, forms, group e-mail and grant reporting unless decision 11 places each
  of them. Mitigation: decide 11 first; do not end the SvenskaLag subscription until each
  function has a new home.
- **RF's system in transition.** IdrottOnline closes 10 November 2026 and Idrottsarenan is new;
  login, API access and exports may change. Mitigation: keep the new site independent of RF
  (own login, manual member import), integrate only through documented APIs once clubs can
  connect.
- **Feed moderation.** A members' feed needs someone to handle reports. Mitigation: named
  moderators, short rules, members-only by default.
- **Volunteer maintenance.** A custom site depends on someone keeping it running. Mitigation: a
  boring stack, automatic updates and backups, two admins, documentation.
- **E-mail deliverability.** Notifications landing in spam. Mitigation: a transactional e-mail
  service with SPF, DKIM and DMARC on the club domain.
- **Results migration quality.** Hand-made tables vary in format. Mitigation: review queue for
  rows that do not parse.
- **Cost.** Hosting and e-mail are small but recurring, unlike the current free template.

## Sources

- Current site: `https://www.teamblekinge.nu/`, surveyed read-only on 2026-10-16.
- Member survey "Vad skulle du vilja se för förbättring på TeamBlekinge hemsidan?" (Google Form,
  9 responses), summarised in section 2.6 without names.
- Admin screenshots of SvenskaLag provided by the club, 2026-10-27; structure only (section 2.8).
- RF, Riksidrottsförbundets API:er (fetched 2026-10-27):
  https://www.rf.se/bidrag-och-stod/it-tjanster/integration/riksidrottsforbundets-apier
- RF, Integration: https://www.rf.se/bidrag-och-stod/it-tjanster/integration
- RF, Idrottsarenan: https://www.rf.se/rf-arbetar-med/digitalisering/idrottsarenan
- Svenska Judoförbundet, "IdrottOnline stängs, Idrottsarenan öppnar" (October 2026):
  https://judo.se/2026/10/idrottonline-stangs-idrottsarenan-oppnar/
- Svenska Gymnastikförbundet, Idrottsarenan:
  https://www.gymnastik.se/forening/it-och-administration/idrottsarenan
- IdrottOnline support, "Logga in i IdrottOnline":
  https://support.idrottonline.se/support/solutions/articles/101000475048-logga-in-i-idrottonline
- SvenskaLag, "Hur fungerar integrationen med IdrottOnline?" (fetched 2026-10-27):
  https://www.svenskalag.se/fragor-och-svar/narvaro/27/hur-fungerar-integrationen-med-idrottonline
- SvenskaLag API, OpenAPI v1 (fetched 2026-10-27): https://api.svenskalag.se/openapi/v1.json
  (docs at https://api.svenskalag.se/scalar)
- "Analyzing Svenskalag Data using DBT and DuckDB" (June 2024, "no public API"):
  https://dev.to/calleo/analyzing-svenskalag-data-using-dbt-and-duckdb-4lcf
- Meta Graph API v19.0 changelog, Groups API deprecation:
  https://developers.facebook.com/docs/graph-api/changelog/version19.0/
