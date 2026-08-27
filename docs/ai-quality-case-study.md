# AI-Quality-Fallstudie – Lokale Bewertung synthetischer Bug-Reports

## Kurzüberblick

Diese Fallstudie untersucht, wie sich die Ausgabe eines kleinen lokalen Sprachmodells mit Playwright und TypeScript prüfen lässt. Das Ziel ist keine eigene KI-Anwendung und kein Modelltraining. Im Mittelpunkt stehen Testdesign, strukturierte Antwortverträge, referenzbasierte Qualitätsbewertung und der bewusste Umgang mit nicht vollständig deterministischen Ergebnissen.

- **Stand:** 27. August 2026
- **Testobjekt:** `qwen3:1.7b` über Ollama 0.33.1
- **Ausführung:** lokal auf macOS über `http://127.0.0.1:11434`
- **Testdaten:** drei vollständig synthetische Bug-Reports
- **Automatisierung:** eine getrennte Playwright-Evaluation mit drei Modellanfragen
- **Kosten:** keine nutzungsabhängigen API-Kosten
- **CI-Status:** bewusst nicht Bestandteil von GitHub Actions

## Ausgangslage und Qualitätsrisiko

Ein erfolgreicher HTTP-Status und syntaktisch korrektes JSON belegen bei einem Sprachmodell noch keine fachlich richtige Antwort. Das Modell kann eine erlaubte Kategorie liefern und trotzdem den Bug falsch einordnen, einen unpassenden Schweregrad wählen oder seine Bewertung auf eine irrelevante Aussage stützen.

Die erste lokale Machbarkeitsprobe zeigte genau diese Grenze: Bei einer frei formulierten Beleganforderung ergänzte das Modell eigene Aussagen, statt exakt auf den gegebenen Bug-Report zurückzugreifen. Ein wortgenauer Vergleich kompletter Modellantworten wäre zugleich zu fragil gewesen.

Daraufhin wurde die Belegprüfung umgestellt. Jeder synthetische Bug-Report besteht aus nummerierten Aussagen. Das Modell darf nur eine vorhandene `evidenceId` auswählen. Damit wird aus einer schwer prüfbaren Freitextbehauptung ein klarer, automatisierbarer Vertrag.

## Testziel

Die Evaluation trennt zwei Qualitätsdimensionen:

1. **Technischer Vertrag:** Ist die Antwort erreichbar, parsebar und strukturell gültig?
2. **Fachliche Referenz:** Stimmen Kategorie, Schweregrad und ausgewählte Beleg-ID mit der vorab festgelegten menschlichen Bewertung überein?

Diese Trennung verhindert, dass ein korrektes JSON vorschnell als fachlich richtige KI-Antwort bewertet wird.

## Testdaten

| Fall | Qualitätsrisiko | Referenzbewertung |
| --- | --- | --- |
| Standardkonto lädt eine fremde Rechnung herunter | unberechtigter Datenzugriff | `SECURITY`, `HIGH`, Beleg `S2` |
| Ein Klick erzeugt zwei identische Bestellungen | doppelte fachliche Transaktion | `FUNCTIONAL`, `HIGH`, Beleg `S2` |
| Button-Text ist abgeschnitten, Funktion bleibt erhalten | rein visueller Bedienbarkeitsfehler | `USABILITY`, `LOW`, Beleg `S2` |

Alle Angaben sind erfunden. Es werden keine realen Konten, E-Mail-Adressen, Kundendaten oder internen Fehlerberichte verarbeitet.

## Automatisierte Prüfungen

Für jede der drei lokalen Modellanfragen prüft die Automatisierung:

- Ollama ist unter der lokalen Adresse erreichbar.
- Das festgelegte Modell `qwen3:1.7b` ist installiert.
- Der HTTP-Status ist `200`.
- Der Content-Type enthält `application/json`.
- Der Inhalt lässt sich als JSON parsen.
- Die Antwort enthält genau `category`, `severity`, `summary` und `evidenceId`.
- Kategorie, Schweregrad und Beleg-ID stammen aus den erlaubten Wertemengen.
- Die Zusammenfassung ist nicht leer.
- Mindestens zwei von drei vollständigen Referenzbewertungen stimmen mit der Modellausgabe überein.

Soll, Ist und Übereinstimmungsstatus werden innerhalb des Playwright-Ergebnisses als `ai-evaluation.json` angehängt. Falls die Qualitätsschwelle unterschritten wird, enthält auch die Fehlermeldung die vollständige Evaluation.

## Maßnahmen für reproduzierbarere Ergebnisse

- Das Modell ist fest auf `qwen3:1.7b` gesetzt.
- Die Anfragen laufen seriell mit einem Worker.
- Die Temperatur ist `0`.
- Ein fester Seed von `42` wird verwendet.
- Die maximale Ausgabe ist auf 140 Tokens begrenzt.
- Ein JSON-Schema schränkt Felder, Datentypen und erlaubte Werte ein.
- Die KI-Suite besitzt mit `npm run test:ai` einen eigenen Startbefehl.
- Die neun Standardtests bleiben von Ollama unabhängig.

Diese Maßnahmen reduzieren Schwankungen, garantieren aber keine identischen Ergebnisse über alle zukünftigen Modell- und Laufzeitversionen.

## Verifiziertes Ergebnis

Die lokale Evaluation wurde nach der Implementierung mehrfach erfolgreich ausgeführt:

```text
1 passed
```

Dabei erfüllten alle drei Antworten den technischen JSON-Vertrag. Zwei der drei Fälle trafen zusätzlich Kategorie, Schweregrad und Beleg-ID der Referenz vollständig:

| Fall | Technischer Vertrag | Referenz vollständig getroffen |
| --- | --- | --- |
| Unberechtigter Rechnungszugriff | bestanden | ja |
| Doppelte Bestellung | bestanden | ja |
| Abgeschnittene Button-Beschriftung | bestanden | nein |

Beim visuellen Fall lieferte das Modell zuletzt `SECURITY`, `HIGH` und `S1` statt `USABILITY`, `LOW` und `S2`. Die Evaluation bestand dennoch, weil die vorab definierte Mindestschwelle von zwei vollständigen Übereinstimmungen erreicht wurde. Die Abweichung bleibt im strukturierten Ergebnis sichtbar.

Das ist kein nachgewiesener Fehler in einer produktiven Anwendung und daher kein Bug Report. Es ist eine beobachtete Qualitätsgrenze des getesteten lokalen Modells innerhalb dieses kleinen Datensatzes.

## Warum keine Cloud-KI und keine CI-Ausführung?

Die lokale Ausführung vermeidet API-Token, nutzungsabhängige Gebühren und die Übertragung der Testdaten an einen Cloud-Inference-Dienst. Nach dem einmaligen Modelldownload verarbeitet Ollama die Anfragen auf dem eigenen Rechner.

GitHub Actions führt weiterhin nur die neun Standardtests aus. Eine Ollama-Installation und ein Modelldownload im bestehenden CI-Workflow würden Laufzeit, Ressourcenbedarf und Wartungsaufwand deutlich erhöhen, ohne für diese kleine optionale Fallstudie einen angemessenen Zusatznutzen zu liefern.

## Lokale Ausführung

Voraussetzungen sind Node.js 24, die npm-Abhängigkeiten des Projekts, [Ollama](https://docs.ollama.com/) und das Modell [`qwen3:1.7b`](https://ollama.com/library/qwen3:1.7b).

```bash
npm ci
ollama pull qwen3:1.7b
npm run test:ai
```

Ollama muss während der Evaluation laufen. Ist der Dienst nicht erreichbar oder das Modell nicht installiert, endet der Test mit einer konkreten deutschen Anleitung.

## Grenzen

- Drei synthetische Fälle sind eine Machbarkeits- und Portfolio-Evaluation, kein statistisch belastbarer Benchmark.
- Die Schwelle von zwei aus drei ist ein projektspezifisches Akzeptanzkriterium und keine allgemeine Genauigkeitskennzahl.
- Das kleine 1.7B-Modell repräsentiert nicht die Leistungsfähigkeit größerer lokaler oder kommerzieller Modelle.
- Die Ausführung ist auf der dokumentierten lokalen Umgebung belegt, nicht auf allen Betriebssystemen und Hardwareklassen.
- Künftige Ollama- oder Modellversionen können trotz festgelegter Sampling-Parameter andere Resultate liefern.
- Es werden weder Last, Parallelverarbeitung, Prompt-Injection-Abwehr noch personenbezogene Datenverarbeitung geprüft.

## Nachgewiesene QA-Kompetenzen

Die Fallstudie zeigt:

- technische und fachliche Qualitätskriterien voneinander trennen
- nicht vollständig deterministische Ausgaben mit expliziten Akzeptanzkriterien prüfen
- JSON-Schemas, Wertemengen und Grounding-Referenzen automatisiert validieren
- eine menschlich definierte Referenzbewertung als Testorakel verwenden
- Abweichungen strukturiert erfassen, statt sie durch schwache Assertions zu verbergen
- Datenschutz, Kosten, Reproduzierbarkeit und Betriebsgrenzen im Testdesign berücksichtigen
- eine optionale lokale Evaluation von der stabilen Standard- und CI-Suite isolieren

Die vollständigen Testdaten und Schritte stehen im [Testfallkatalog](test-cases.md) unter `QOL-AI-BUG-001`. Die Automatisierung befindet sich in [`ai-tests/bug-report-quality.spec.ts`](../ai-tests/bug-report-quality.spec.ts).
