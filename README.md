# QualityOps Lab

[![Playwright Tests](https://github.com/KhoiiHa/QualityOps-Lab/actions/workflows/playwright.yml/badge.svg)](https://github.com/KhoiiHa/QualityOps-Lab/actions/workflows/playwright.yml)

QualityOps Lab ist ein praxisnahes QA-Engineering-Portfolio. Das Projekt zeigt schrittweise, wie Webanwendungen strukturiert geprüft, Testergebnisse nachvollziehbar dokumentiert und automatisierte Tests reproduzierbar ausgeführt werden.

## Aktueller Stand

- drei automatisierte Web-End-to-End-Tests mit Playwright und TypeScript
- ein positiver API-Test ohne zusätzlichen Browser
- positive und negative Login-Abdeckung
- zusammenhängender Warenkorb-Ablauf
- strukturierter Testfallkatalog mit Rückverweisen auf die Automatisierung
- lokale Ausführung mit Chromium
- automatische Ausführung bei Pushes und Pull Requests über GitHub Actions
- HTML-Testbericht als CI-Artefakt mit 30 Tagen Aufbewahrung

Als öffentliche Testobjekte dienen die für Browser-Tests vorgesehene Demoanwendung [SauceDemo](https://www.saucedemo.com/) und die Test-API [JSONPlaceholder](https://jsonplaceholder.typicode.com/). Es werden keine produktiven Konten oder privaten Zugangsdaten verwendet.

## Automatisierte Testszenarien

| Bereich | Typ | Geprüftes Verhalten |
| --- | --- | --- |
| Login | positiv | Ein gültiger Benutzer erreicht die Produktübersicht. |
| Login | negativ | Ein falsches Passwort zeigt eine Fehlermeldung und verhindert die Weiterleitung. |
| Warenkorb | positiv | Ein ausgewähltes Produkt erhöht den Zähler und erscheint als einziger Warenkorbeintrag. |
| API – Beitrag | positiv | `GET /posts/1` liefert Status 200, JSON und die erwartete Datenstruktur. |

Die vollständigen Voraussetzungen, Testdaten, Schritte und erwarteten Ergebnisse stehen im [Testfallkatalog](docs/test-cases.md).

## Technik

- Node.js 24 LTS
- npm
- TypeScript 7
- Playwright Test 1.62
- Chromium
- GitHub Actions auf Ubuntu Linux

## Projekt lokal ausführen

Voraussetzung ist eine installierte Node.js-Version 24.

```bash
npm ci
npx playwright install chromium
npm test
```

Test mit sichtbarem Browser ausführen:

```bash
npm run test:headed
```

Den zuletzt erzeugten HTML-Bericht öffnen:

```bash
npm run test:report
```

## Continuous Integration

Der Workflow [Playwright Tests](https://github.com/KhoiiHa/QualityOps-Lab/actions/workflows/playwright.yml) startet automatisch bei:

- Pushes auf `main`
- Pull Requests gegen `main`

GitHub richtet dafür eine frische Linux-Umgebung mit Node.js 24 und Chromium ein. Anschließend werden alle Tests ausgeführt und der HTML-Bericht als herunterladbares Artefakt gespeichert.

## Projektstruktur

```text
QualityOps-Lab/
├── .github/workflows/playwright.yml  # Automatische CI-Testausführung
├── docs/test-cases.md                 # Strukturierter Testfallkatalog
├── tests/
│   ├── api/posts.spec.ts              # Positiver GET-API-Test
│   ├── cart.spec.ts                  # Warenkorb-Ablauf
│   └── login.spec.ts                 # Positive und negative Login-Tests
├── playwright.config.ts              # Gemeinsame Playwright-Einstellungen
├── package.json                      # Abhängigkeiten und npm-Skripte
└── package-lock.json                 # Reproduzierbar festgelegte Paketversionen
```

## Aktuelle Grenzen

- Die Browser-Tests laufen derzeit ausschließlich mit Chromium.
- Die Tests sind von der Erreichbarkeit und Stabilität der externen Testsysteme abhängig.
- Negative API-Tests, SQL-Prüfungen und Mobile-QA-Szenarien sind noch nicht umgesetzt.
- Die Tests verwenden bewusst öffentliche Demo-Zugangsdaten und keine produktiven Konten.

## Geplante Erweiterungen

- weitere fachliche Web-Testfälle
- negative API-Tests und weitere Endpunkte
- einfache SQL- und Datenprüfungen
- professionelle Bug Reports und eine kurze QA-Fallstudie
- optional eine separate Mobile-QA-Fallstudie
