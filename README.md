# QualityOps Lab

[![Playwright Tests](https://github.com/KhoiiHa/QualityOps-Lab/actions/workflows/playwright.yml/badge.svg)](https://github.com/KhoiiHa/QualityOps-Lab/actions/workflows/playwright.yml)

QualityOps Lab ist ein praxisnahes QA-Engineering-Portfolio. Das Projekt zeigt schrittweise, wie Webanwendungen strukturiert geprüft, Testergebnisse nachvollziehbar dokumentiert und automatisierte Tests reproduzierbar ausgeführt werden.

Ergänzend untersucht eine getrennte lokale AI-Quality-Fallstudie, wie sich strukturierte, aber nicht vollständig deterministische Modellausgaben mit technischen Verträgen und einer transparenten Qualitätsschwelle prüfen lassen.

## Aktueller Stand

- fünf automatisierte Web-End-to-End-Tests mit Playwright und TypeScript
- zwei API-Tests mit positiver und negativer Abdeckung ohne zusätzlichen Browser
- zwei reproduzierbare SQL-Datenprüfungen mit positiver und negativer Abdeckung in einer temporären In-Memory-Datenbank
- eine optionale lokale KI-Evaluation mit drei synthetischen Bug-Reports, festem JSON-Schema und referenzbasierter Qualitätsprüfung
- positive und negative Login-Abdeckung
- zusammenhängender Warenkorb- und Checkout-Ablauf
- strukturierter Testfallkatalog mit Rückverweisen auf die Automatisierung
- lokale Ausführung mit Chromium
- automatische Ausführung bei Pushes und Pull Requests über GitHub Actions
- HTML-Testbericht als CI-Artefakt mit 30 Tagen Aufbewahrung

Als öffentliche Testobjekte dienen die für Browser-Tests vorgesehene Demoanwendung [SauceDemo](https://www.saucedemo.com/) und die Test-API [JSONPlaceholder](https://jsonplaceholder.typicode.com/). Die SQL-Prüfung verwendet ausschließlich feste Testdaten in einer temporären Datenbank im Arbeitsspeicher. Es werden keine produktiven Konten, privaten Zugangsdaten oder dauerhaften Datenbankdateien verwendet.

Die KI-Evaluation verwendet das lokal installierte Modell `qwen3:1.7b` über Ollama. Ihre drei vollständig erfundenen Bug-Reports werden ausschließlich an `127.0.0.1` gesendet. Sie ist bewusst nicht Bestandteil der neun Standardtests oder der CI-Ausführung.

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
| Lokale KI-Evaluation | Vertrag und Referenz | Drei synthetische Bug-Reports werden auf JSON-Struktur, erlaubte Werte, Beleg-ID und eine definierte fachliche Mindestqualität geprüft. |

Die vollständigen Voraussetzungen, Testdaten, Schritte und erwarteten Ergebnisse stehen im [Testfallkatalog](docs/test-cases.md).

Weitere QA-Artefakte sind die [QA-Fallstudie](docs/qa-case-study.md), die [AI-Quality-Fallstudie](docs/ai-quality-case-study.md), das [explorative Checkout-Protokoll](docs/exploratory-session-checkout.md) und eine [professionelle Bug-Report-Vorlage](docs/bug-report-template.md). Die Vorlage ist noch kein gemeldeter Produktfehler; ein konkreter Bericht wird erst bei einer belegbaren Beobachtung erstellt.

## Technik

- Node.js 24 LTS
- npm
- TypeScript 7
- Playwright Test 1.62
- Chromium
- SQLite im Arbeitsspeicher über das in Node.js integrierte `node:sqlite`
- Ollama 0.33 mit dem lokalen Modell `qwen3:1.7b` für die optionale KI-Evaluation
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

### Optionale lokale KI-Evaluation

Die KI-Evaluation benötigt zusätzlich [Ollama](https://docs.ollama.com/) und das lokale Modell [`qwen3:1.7b`](https://ollama.com/library/qwen3:1.7b). Nach der einmaligen Installation und dem Modelldownload Ollama starten und die getrennte Suite ausführen:

```bash
ollama pull qwen3:1.7b
npm run test:ai
```

`npm run test:ai` sendet drei synthetische Testfälle an die lokale Ollama-Adresse. Der Befehl `npm test` bleibt davon unabhängig und führt weiterhin nur die neun Standardtests aus.

## Continuous Integration

Der Workflow [Playwright Tests](https://github.com/KhoiiHa/QualityOps-Lab/actions/workflows/playwright.yml) startet automatisch bei:

- Pushes auf `main`
- Pull Requests gegen `main`

GitHub richtet dafür eine frische Linux-Umgebung mit Node.js 24 und Chromium ein. Anschließend werden die neun Standardtests ausgeführt und der HTML-Bericht als herunterladbares Artefakt gespeichert. Die lokale KI-Evaluation läuft dort nicht, weil sie eine separate Ollama-Installation und den Modelldownload voraussetzt.

## Projektstruktur

```text
QualityOps-Lab/
├── .github/workflows/playwright.yml  # Automatische CI-Testausführung
├── ai-tests/
│   └── bug-report-quality.spec.ts     # Lokale KI-Evaluation mit drei Datensätzen
├── docs/
│   ├── ai-quality-case-study.md       # Fallstudie zur lokalen KI-Qualitätsprüfung
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
├── playwright.ai.config.ts           # Getrennte Einstellungen der lokalen KI-Suite
├── package.json                      # Abhängigkeiten und npm-Skripte
└── package-lock.json                 # Reproduzierbar festgelegte Paketversionen
```

## Aktuelle Grenzen

- Die Browser-Tests laufen derzeit ausschließlich mit Chromium.
- Die Tests sind von der Erreichbarkeit und Stabilität der externen Testsysteme abhängig.
- Die Checkout-Tests decken einen positiven Ablauf und die Validierung eines fehlenden Vornamens mit einem Benutzer und einem Produkt ab.
- Persistente Datenbanken, komplexere SQL-Abfragen und Mobile-QA-Szenarien sind noch nicht umgesetzt.
- Die Tests verwenden bewusst öffentliche Demo-Zugangsdaten und keine produktiven Konten.
- Die KI-Evaluation ist lokal, optional und nicht in GitHub Actions reproduziert.
- Die aktuelle KI-Qualitätsschwelle basiert nur auf drei synthetischen Fällen; sie ist keine allgemeine Genauigkeitsangabe für das Modell.
- Modellversion, Ollama-Version oder Laufzeitumgebung können die nicht vollständig deterministischen Ergebnisse beeinflussen.

## Geplante Erweiterungen

- weitere fachliche Web-Testfälle
- weitere API-Endpunkte und HTTP-Methoden
- weitere SQL- und Datenprüfungen, zum Beispiel mit Tabellenbeziehungen
- erster konkreter Bug Report mit der vorhandenen Vorlage, sobald ein tatsächlicher Fehler reproduzierbar gefunden wurde
- optional eine separate Mobile-QA-Fallstudie
