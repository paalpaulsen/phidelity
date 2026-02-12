# Pitch: "Just Add Brand" – Et Komponerbart Designsystem

## DEL 1: PROBLEMET (Historien gjentar seg)

### Slide 1: Det Amerikanske Kaoset (2015)
*   **Historikk:** I 2015 gjennomførte 18F en "Visual Audit" av føderale nettsider.
*   **Kilde:** [USWDS: History & Visual Audit](https://designsystem.digital.gov/about/history/)
*   **Funn:** De fant ekstrem inkonsistens. Eksempelvis fantes det over **50 forskjellige varianter av en "blå knapp"** og utallige versjoner av søkefelter og skjemaer.
*   **Symptomet:** Visuelt kaos. Enorm teknisk gjeld. Hver eneste etat satt og kodet sine egne løsninger fra bunnen av.
*   **Sløsingen:** Skattebetalerne betalte for at hjulet ble funnet opp hundrevis av ganger.

### Slide 2: Løsningen (18F & USWDS)
*   **Trigger (2013):** Katastrofen rundt **Healthcare.gov** (Obamacare).
*   **Kostnaden:** Prosjektet hadde et opprinnelig budsjett på **$93 millioner**, men endte opp med å koste over **$2.1 milliarder**.
*   **Erkjennelsen:** Obama innså at staten ikke kunne kjøpe IT på samme måte som de kjøpte stridsvogner. De trengte interne eksperter.
*   **Grepet:** Opprettelsen av **18F** og **USDS** (U.S. Digital Service). En "Tech Startup" på innsiden av Washington.
*   **Resultatet:** *U.S. Web Design System (USWDS)*.
*   **Effekten:** Etablerte én standard. I dag kjører systemet på nesten 200 offentlige nettsteder.
*   **Twist (2025):** DOGE avviklet 18F. Men *systemet* lever videre som open source. Teknologien overlevde byråkratiet.

### Slide 3: Det Norske Svaret
*   **Parallellen:** Norge hadde nøyaktig samme problem. Hver kommune og etat med sin egen "blå knapp".
*   **Løsningen:** Etableringen av **Designsystemet.no**.
*   **Verdien:** Et felles bibliotek av *komponenter* som alle kan bruke. Staten tar regningen for "grunnmuren".

### Slide 4: Det Lokale Kaoset (Stavanger / Lyse)
*   **Realiteten:** Selv store, proffe aktører i vår region sliter med det samme.
*   **Eksempelet (Altibox):** En gjennomgang viste at de opererte med **7 ulike headere** på tvers av sine flater.
*   **Konsekvensen:**
    *   7x Designarbeid.
    *   7x Koding og testing.
    *   7x Vedlikeholdskostnad.
    *   Fragmentert merkevareopplevelse for kunden.

### Slide 5: De Kostbare Forsøkene (Wave, Lux, Form)
*   **Historikken:** Lyse/Altibox har forsøkt flere ganger.
    *   *Forsøk 1:* Wave
    *   *Forsøk 2:* Lux
    *   *Forsøk 3:* Form
*   **Lærdommen:** Å starte **fra scratch** ("Vi bygger alt selv!") er ekstremt dyrt og risikabelt.
*   **Hvorfor feiler det?**
    *   Vanskelig å etablere et dedikert team som varer.
    *   Politisk vanskelig å få *buy-in* fra alle produktteam hvis man tvinger dem inn i en monolitt.

---

## DEL 2: LØSNINGEN (Phidelity)

### Slide 6: Strategien (Gjenbruk, ikke Oppfinnelse)
*   **Mantra:** "Don't Reinvent the Wheel. Just Reinvent the Brand."
*   **Metoden:** Et **Lagdelt Designsystem**.
*   **Prinsippet:** Vi bygger ikke *knapper* (Designsystemet.no gjør det). Vi bygger *opplevelser* (Widgets).

### Slide 7: De 7 Lagene (Phidelity Arkitektur)
Vi har delt ansvaret tydelig for å unngå "Vendor Lock-in" og kaos:

1.  **Token (Brand):** Deres farger, deres fonter. (Eies av Brand).
2.  **Component (The Bricks):** Standardiserte brikker fra Designsystemet. (Open Source).
3.  **Layout (The Skeleton):** Vårt unike CSS Grid. (Eies av Phidelity).
4.  **Content (The Narrative):** Strukturert innhold fra Sanity CMS. (Eies av Redaktør).
5.  **Build (The Factory):** Automatisert sammensetting av delene.
6.  **Delivery (The Edge):** Rask levering globalt eller lokalt.
7.  **Governance (The Rules):** Tydelige spilleregler for hvem som eier hva.

### Slide 8: "Just Add Brand"
*   **Konklusjon:** Phidelity er "Kakemiksen".
    *   Kjemien (koden) er garantert å funke.
    *   Dere tilsetter bare smaken (merkevaren).
*   **Resultat:** Dere slipper å bygge den 8. headeren fra bunnen av. Dere konfigurerer den som allerede virker.
