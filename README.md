# QualityOps Lab

[![Playwright Tests](https://github.com/KhoiiHa/QualityOps-Lab/actions/workflows/playwright.yml/badge.svg)](https://github.com/KhoiiHa/QualityOps-Lab/actions/workflows/playwright.yml)

QualityOps Lab ist ein praxisnahes QA-Engineering-Portfolio. Das Projekt zeigt schrittweise, wie Webanwendungen strukturiert geprüft, Testergebnisse nachvollziehbar dokumentiert und automatisierte Tests reproduzierbar ausgeführt werden.

## Aktueller Stand

- fünf automatisierte Web-End-to-End-Tests mit Playwright und TypeScript
- zwei API-Tests mit positiver und negativer Abdeckung ohne zusätzlichen Browser
- zwei reproduzierbare SQL-Datenprüfungen mit positiver und negativer Abdeckung in einer temporären In-Memory-Datenbank
- positive und negative Login-Abdeckung
- zusammenhängender Warenkorb- und Checkout-Ablauf
- strukturierter Testfallkatalog mit Rückverweisen auf die Automatisierung
- lokale Ausführung mit Chromium
- automatische Ausführung bei Pushes und Pull Requests über GitHub Actions
- HTML-Testbericht als CI-Artefakt mit 30 Tagen Aufbewahrung

Als öffentliche Testobjekte dienen die für Browser-Tests vorgesehene Demoanwendung [SauceDemo](https://www.saucedemo.com/) und die Test-API [JSONPlaceholder](https://jsonplaceholder.typicode.com/). Die SQL-Prüfung verwendet ausschließlich feste Testdaten in einer temporären Datenbank im Arbeitsspeicher. Es werden keine produktiven Konten, privaten Zugangsdaten oder dauerhaften Datenbankdateien verwendet.

## Automatisierte Testszenarien

| Bereich | Typ | Geprüftes Verhalten |
| --- | --- | --- |
| Login | positiv | Ein gültiger Benutzer erreicht die Produktübersicht. |
| Login | negativ | Ein falsches Passwort zeigt eine Fehlermeldung und verhindert die Weiterleitung. |
| Warenkorb | positiv | Ein ausgewähltes Produkt erhöht den Zähler und erscheint als einziger Warenkorbeintrag. |
| Checkout | positiv | Ein Produkt kann mit gültigen Kundendaten, korrekter Preisübersicht und Bestellbestätigung bestellt werden. |
| Checkout | negativ | Ein fehlender Vorname verhindert das Fortsetzen und zeigt eine verständliche Fehlermeldung. |
| API – Beitrag | positiv | `GET /posts/1` liefert Status 200, JSON und die erwartete Datenstruktur. |
| API – Beitrag | negativ | `GET /posts/999999` liefert Status 404 und ein kontrolliertes leeres JSON-Objekt. |
| Datenbank – Bestellungen | positiv | Eine SQL-Abfrage berücksichtigt nur bezahlte Bestellungen und berechnet deren Anzahl und Gesamtsumme korrekt. |
| Datenbank – Bestellungen | negativ | Eine Datenbankregel weist eine negative Bestellsumme ab und verhindert das Speichern des ungültigen Datensatzes. |

Die vollständigen Voraussetzungen, Testdaten, Schritte und erwarteten Ergebnisse stehen im [Testfallkatalog](docs/test-cases.md).

Weitere QA-Artefakte sind die [QA-Fallstudie](docs/qa-case-study.md), das [explorative Checkout-Protokoll](docs/exploratory-session-checkout.md) und eine [professionelle Bug-Report-Vorlage](docs/bug-report-template.md). Die Vorlage ist noch kein gemeldeter Produktfehler; ein konkreter Bericht wird erst bei einer belegbaren Beobachtung erstellt.

## Technik

- Node.js 24 LTS
- npm
- TypeScript 7
- Playwright Test 1.62
- Chromium
- SQLite im Arbeitsspeicher über das in Node.js integrierte `node:sqlite`
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
├── docs/
│   ├── bug-report-template.md          # Wiederverwendbare Fehlervorlage
│   ├── exploratory-session-checkout.md # Exploratives Checkout-Protokoll
│   ├── qa-case-study.md                # Kompakte QA-Fallstudie
│   └── test-cases.md                   # Strukturierter Testfallkatalog
├── tests/
│   ├── api/posts.spec.ts              # Positive und negative GET-API-Tests
│   ├── database/orders.spec.ts        # SQL-Prüfung von Bestelldaten
│   ├── cart.spec.ts                   # Warenkorb-Ablauf
│   ├── checkout.spec.ts               # Positive und negative Checkout-Tests
│   └── login.spec.ts                  # Positive und negative Login-Tests
├── playwright.config.ts              # Gemeinsame Playwright-Einstellungen
├── package.json                      # Abhängigkeiten und npm-Skripte
└── package-lock.json                 # Reproduzierbar festgelegte Paketversionen
```

## Aktuelle Grenzen

- Die Browser-Tests laufen derzeit ausschließlich mit Chromium.
- Die Tests sind von der Erreichbarkeit und Stabilität der externen Testsysteme abhängig.
- Die Checkout-Tests decken einen positiven Ablauf und die Validierung eines fehlenden Vornamens mit einem Benutzer und einem Produkt ab.
- Persistente Datenbanken, komplexere SQL-Abfragen und Mobile-QA-Szenarien sind noch nicht umgesetzt.
- Die Tests verwenden bewusst öffentliche Demo-Zugangsdaten und keine produktiven Konten.

## Geplante Erweiterungen

- weitere fachliche Web-Testfälle
- weitere API-Endpunkte und HTTP-Methoden
- weitere SQL- und Datenprüfungen, zum Beispiel mit Tabellenbeziehungen
- erster konkreter Bug Report mit der vorhandenen Vorlage, sobald ein tatsächlicher Fehler reproduzierbar gefunden wurde
- optional eine separate Mobile-QA-Fallstudie
