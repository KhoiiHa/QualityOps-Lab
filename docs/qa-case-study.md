# QA-Fallstudie – QualityOps Lab

## Kurzüberblick

QualityOps Lab ist ein eigenständiges QA-Engineering-Portfolio. Untersucht werden eine öffentliche Web-Demo, eine öffentliche Test-API und feste Bestelldaten in einer temporären SQLite-Datenbank. Eine getrennte lokale KI-Evaluation prüft ergänzend drei synthetische Bug Reports mit einem lokal ausgeführten Sprachmodell. Ziel ist nicht eine möglichst hohe Testanzahl, sondern ein kleiner, nachvollziehbarer Nachweis für Testdesign, Automatisierung, Datenprüfung und kontinuierliche Testausführung.

- **Stand:** 27. August 2026
- **Standard-Automatisierung:** 9 Standardtestfälle automatisiert und CI-fähig
- **Lokale KI-Evaluation:** `QOL-AI-BUG-001` mit 3 Datensätzen automatisiert
- **Letzte lokale Verifikation:** 9 Standardtests und 1 lokale KI-Evaluation erfolgreich
- **CI:** automatische Ausführung der 9 Standardtests über [GitHub Actions](https://github.com/KhoiiHa/QualityOps-Lab/actions)

## Ausgangslage und Qualitätsziel

Öffentliche Demo-Systeme ermöglichen realistische QA-Übungen, ohne produktive Konten oder private Daten zu verwenden. Sie bringen jedoch auch Abhängigkeiten mit: Inhalte, Erreichbarkeit und Verhalten können sich außerhalb dieses Projekts ändern.

Der erste Projektumfang konzentriert sich deshalb auf drei überprüfbare Qualitätsziele:

1. Zentrale Benutzerabläufe der Webanwendung funktionieren und reagieren kontrolliert auf ungültige Eingaben.
2. Die API liefert bei vorhandenen und nicht vorhandenen Ressourcen den erwarteten Status und das vereinbarte JSON-Format.
3. SQL-Abfragen werten fachlich relevante Datensätze korrekt aus und die Datenbank weist einen ungültigen negativen Betrag ab.

Nach der Veröffentlichung von `v1.0.0` wurde der Umfang um eine optionale lokale KI-Evaluation ergänzt. Sie trennt die technische Einhaltung eines vorgegebenen JSON-Vertrags von der inhaltlichen Übereinstimmung mit einer Referenzbewertung.

## Teststrategie

Die Auswahl folgt einem risikoorientierten MVP-Ansatz:

- **Web:** Anmeldung ist die Voraussetzung für geschützte Funktionen; Warenkorb und Bestellabschluss bilden einen zentralen Geschäftsablauf.
- **API:** Sowohl ein erfolgreicher Abruf als auch eine nicht vorhandene Ressource werden geprüft, damit Erfolgs- und Fehlerverhalten sichtbar sind.
- **Daten:** Eine Statusfilterung mit Aggregation prüft, ob stornierte Bestellungen von einer fachlichen Auswertung ausgeschlossen werden.
- **KI-Qualität:** Drei synthetische Bug Reports prüfen, ob ein lokales Modell strukturierte Klassifizierungen mit belegbaren Referenzen liefert.
- **Regression:** Die 9 Standardtests laufen gemeinsam lokal und bei jedem Push beziehungsweise Pull Request gegen `main`. Die KI-Evaluation bleibt wegen ihrer lokalen Modellabhängigkeit bewusst außerhalb der CI.

Positive und negative Szenarien werden gezielt kombiniert. Der negative Login- und der negative API-Test belegen erwartetes Fehlerverhalten; sie sind keine dokumentierten Produktfehler.

## Umgesetzte Testabdeckung

| Bereich | Testfall | Prüfschwerpunkt |
| --- | --- | --- |
| Web | `QOL-WEB-LOGIN-001` | Erfolgreiche Anmeldung und Weiterleitung zur Produktübersicht |
| Web | `QOL-WEB-LOGIN-002` | Abweisung eines falschen Passworts mit verständlicher Fehlermeldung |
| Web | `QOL-WEB-CART-001` | Produktwahl, Warenkorb-Zähler und korrekter Warenkorbeintrag |
| Web | `QOL-WEB-CHECKOUT-001` | Kundendaten, Preisübersicht und erfolgreicher Bestellabschluss |
| Web | `QOL-WEB-CHECKOUT-002` | Abweisung des Checkouts bei fehlendem Vornamen |
| API | `QOL-API-POSTS-001` | Status 200, JSON-Content-Type, Datenstruktur und Identifikatoren |
| API | `QOL-API-POSTS-002` | Status 404 und kontrollierter leerer JSON-Körper |
| Daten | `QOL-DATA-ORDERS-001` | Filterung bezahlter Bestellungen sowie korrekte Anzahl und Gesamtsumme |
| Daten | `QOL-DATA-ORDERS-002` | Abweisung einer negativen Bestellsumme ohne Speicherung |
| KI (lokal) | `QOL-AI-BUG-001` | JSON-Vertrag, Belegreferenzen und inhaltliche Klassifizierung von 3 synthetischen Bug Reports |

Voraussetzungen, Testdaten, Einzelschritte und erwartete Ergebnisse sind im [Testfallkatalog](test-cases.md) beschrieben. Jeder Testfall verweist dort auf seine Automatisierung.

## Technische Umsetzung

- Playwright Test und TypeScript bilden einen gemeinsamen, bewusst einfachen Test-Runner.
- Webtests laufen mit Chromium gegen [SauceDemo](https://www.saucedemo.com/).
- Die Checkout-Tests prüfen den positiven Bestellabschluss und die gezielte Abweisung bei fehlendem Vornamen.
- API-Tests verwenden Playwrights Request-Kontext ohne einen Browser zu starten und prüfen [JSONPlaceholder](https://jsonplaceholder.typicode.com/).
- Der Datentest erzeugt mit `node:sqlite` bei jeder Ausführung eine neue SQLite-Datenbank im Arbeitsspeicher.
- Geldbeträge werden als ganze Centwerte gespeichert, um Rundungsfehler mit Fließkommazahlen zu vermeiden.
- Die SQL-Abfrage nutzt einen Parameter für den Status, anstatt den Wert direkt in den Abfragetext einzusetzen.
- Ein negativer Datentest belegt, dass die `CHECK`-Regel einen Betrag unter `0` Cent abweist und kein Datensatz zurückbleibt.
- Die Datenbank wird nach dem Test geschlossen; es bleibt keine lokale Datenbankdatei zurück.
- Die optionale KI-Evaluation verwendet das lokal installierte Ollama-Modell `qwen3:1.7b` und übermittelt keine Testdaten an einen externen KI-Dienst.
- Ein festes JSON-Schema prüft die technische Antwortstruktur. Jede Bewertung muss über `evidenceIds` auf konkrete Belege des Eingabetexts verweisen.
- Temperatur `0` und Seed `42` reduzieren vermeidbare Schwankungen; sie garantieren bei generativer Ausgabe trotzdem keine vollständige Deterministik.
- Eine getrennte Playwright-Konfiguration und der Befehl `npm run test:ai` halten die lokale KI-Evaluation von der Standardtestsuite und der CI getrennt.

## Ausführung und Ergebnisnachweis

Die 9 Standardtests wurden am 27. August 2026 auf macOS erfolgreich ausgeführt:

```text
9 passed
```

Die getrennte lokale KI-Evaluation wurde am selben Tag mit laufendem Ollama-Dienst ausgeführt:

```text
1 passed
```

Der eine Playwright-Test führt drei Modellaufrufe aus. Alle 3 Antworten erfüllten den technischen Vertrag; 2 von 3 stimmten vollständig mit der festgelegten Referenzklassifizierung überein. Diese Differenz wird als messbares Evaluationsergebnis dokumentiert und nicht als Produkttest-Erfolg umgedeutet.

GitHub Actions führt ausschließlich die 9 Standardtests in einer frischen Ubuntu-Umgebung mit Node.js 24 und Chromium aus. Der Workflow installiert die festgeschriebenen npm-Abhängigkeiten, startet diese Tests und speichert den HTML-Testbericht für 30 Tage als Artefakt. Dadurch ist deren Ergebnis unabhängig von der lokalen Mac-Konfiguration überprüfbar. Die lokale KI-Evaluation ist nicht Bestandteil dieses CI-Nachweises.

## Beobachtungen und Entscheidungen

- Die direkte Adresse `https://www.saucedemo.com/` wird als Testziel verwendet, weil nur dort die erwartete Login-Oberfläche zuverlässig verfügbar ist.
- Der positive Checkout-Test wurde aus der dokumentierten explorativen Sitzung [`QOL-EXP-CHECKOUT-001`](exploratory-session-checkout.md) abgeleitet.
- Feste API-Ressourcen und feste SQL-Testdaten machen die erwarteten Ergebnisse verständlich und wiederholbar.
- Die In-Memory-Datenbank isoliert den Datentest von bestehenden Daten und verhindert bleibende Änderungen.
- Die [Bug-Report-Vorlage](bug-report-template.md) definiert eine einheitliche Struktur für reproduzierbare Fehler, Belege, Schweregrad, Priorität und Nachtest.
- Die [KI-Quality-Fallstudie](ai-quality-case-study.md) dokumentiert Prompt-Vertrag, Datensätze, Bewertungskriterien und das beobachtete Ergebnis getrennt vom Portfolio-MVP.
- Die drei synthetischen Bug Reports sind ausdrücklich Testdaten für die KI-Evaluation und keine im Testsystem entdeckten Produktfehler. Ein professioneller Fehlerbericht wird weiterhin erst ergänzt, wenn ein tatsächliches Problem reproduzierbar beobachtet und mit Belegen dokumentiert wurde.

## Grenzen und Restrisiken

- Die Browser-Abdeckung ist aktuell auf Chromium beschränkt; Firefox, WebKit und reale Mobilgeräte sind nicht verifiziert.
- SauceDemo und JSONPlaceholder sind externe Testsysteme. Ausfälle oder Änderungen können Tests beeinflussen, ohne dass sich dieses Repository geändert hat.
- Die Checkout-Tests verwenden nur `standard_user` und ein Produkt. Fehlender Nachname, fehlende Postleitzahl, mehrere Produkte und Zurücknavigation sind nicht automatisiert.
- Die API-Abdeckung beschränkt sich auf lesende `GET`-Anfragen ohne Authentifizierung.
- Die Datenprüfung verwendet eine einzelne Tabelle im Arbeitsspeicher. Persistente Datenbanken, Beziehungen, Joins und Migrationen sind nicht geprüft.
- Der erfolgreiche CI-Lauf belegt die automatisierte Ausführung unter Ubuntu Linux, nicht das Verhalten auf allen Betriebssystemen oder Browsern.
- Die KI-Evaluation benötigt einen lokal laufenden Ollama-Dienst und das Modell `qwen3:1.7b`; sie ist nicht durch GitHub Actions verifiziert.
- Drei synthetische Datensätze sind ein kleiner Machbarkeitsnachweis und kein repräsentativer Benchmark. Modellwechsel oder generative Schwankungen können das Ergebnis verändern.

## Nachgewiesene QA-Kompetenzen

Dieser Projektstand zeigt:

- fachliche Testfälle mit Voraussetzungen, Testdaten und erwarteten Ergebnissen formulieren
- positive und negative Szenarien auswählen und automatisieren
- Weboberflächen, HTTP-Antworten und SQL-Ergebnisse prüfen
- Testfälle und automatisierte Tests rückverfolgbar verbinden
- Tests lokal und in Continuous Integration reproduzierbar ausführen
- professionelle Fehlerdokumentation strukturiert und datenschutzbewusst vorbereiten
- strukturierte KI-Ausgaben technisch validieren und getrennt nach Vertrags- und Inhaltsqualität bewerten
- Modellantworten über Belegreferenzen rückverfolgbar machen und Abweichungen transparent ausweisen
- Ergebnisse, Abhängigkeiten und nicht geprüfte Bereiche transparent dokumentieren

## Portfolio-MVP-Status

Der fokussierte Portfolio-MVP mit 9 Standardtests wurde als [`v1.0.0`](https://github.com/KhoiiHa/QualityOps-Lab/releases/tag/v1.0.0) öffentlich veröffentlicht. Die damalige Abschlussprüfung bestätigte einen sauberen und synchronen Git-Stand, rückverfolgbare Testfälle, funktionierende Dokumentverweise, eine erfolgreiche lokale Testsuite, einen grünen CI-Nachweis und keine bekannten npm-Schwachstellen.

Die lokale KI-Evaluation wurde danach als optionale Erweiterung ergänzt und bleibt technisch sowie in der Ergebnisdarstellung vom CI-fähigen Standardumfang getrennt. Sie verändert nicht rückwirkend den nachgewiesenen Umfang von `v1.0.0`; eine neue Version wurde für diese Erweiterung bislang nicht ausgewiesen.
