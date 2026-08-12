# QA-Fallstudie – QualityOps Lab

## Kurzüberblick

QualityOps Lab ist ein eigenständiges QA-Engineering-Portfolio. Untersucht werden eine öffentliche Web-Demo, eine öffentliche Test-API und feste Bestelldaten in einer temporären SQLite-Datenbank. Ziel ist nicht eine möglichst hohe Testanzahl, sondern ein kleiner, nachvollziehbarer Nachweis für Testdesign, Automatisierung, Datenprüfung und kontinuierliche Testausführung.

- **Stand:** 12. August 2026
- **Automatisierungsstatus:** 8 von 8 dokumentierten Testfällen automatisiert
- **Letzte lokale Verifikation:** 8 Tests erfolgreich
- **CI:** automatische Ausführung über [GitHub Actions](https://github.com/KhoiiHa/QualityOps-Lab/actions)

## Ausgangslage und Qualitätsziel

Öffentliche Demo-Systeme ermöglichen realistische QA-Übungen, ohne produktive Konten oder private Daten zu verwenden. Sie bringen jedoch auch Abhängigkeiten mit: Inhalte, Erreichbarkeit und Verhalten können sich außerhalb dieses Projekts ändern.

Der erste Projektumfang konzentriert sich deshalb auf drei überprüfbare Qualitätsziele:

1. Zentrale Benutzerabläufe der Webanwendung funktionieren und reagieren kontrolliert auf ungültige Eingaben.
2. Die API liefert bei vorhandenen und nicht vorhandenen Ressourcen den erwarteten Status und das vereinbarte JSON-Format.
3. Eine SQL-Abfrage filtert fachlich relevante Datensätze korrekt und berechnet ein reproduzierbares Aggregat.

## Teststrategie

Die Auswahl folgt einem risikoorientierten MVP-Ansatz:

- **Web:** Anmeldung ist die Voraussetzung für geschützte Funktionen; Warenkorb und Bestellabschluss bilden einen zentralen Geschäftsablauf.
- **API:** Sowohl ein erfolgreicher Abruf als auch eine nicht vorhandene Ressource werden geprüft, damit Erfolgs- und Fehlerverhalten sichtbar sind.
- **Daten:** Eine Statusfilterung mit Aggregation prüft, ob stornierte Bestellungen von einer fachlichen Auswertung ausgeschlossen werden.
- **Regression:** Alle Tests laufen gemeinsam lokal und bei jedem Push beziehungsweise Pull Request gegen `main`.

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

Voraussetzungen, Testdaten, Einzelschritte und erwartete Ergebnisse sind im [Testfallkatalog](test-cases.md) beschrieben. Jeder Testfall verweist dort auf seine Automatisierung.

## Technische Umsetzung

- Playwright Test und TypeScript bilden einen gemeinsamen, bewusst einfachen Test-Runner.
- Webtests laufen mit Chromium gegen [SauceDemo](https://www.saucedemo.com/).
- Die Checkout-Tests prüfen den positiven Bestellabschluss und die gezielte Abweisung bei fehlendem Vornamen.
- API-Tests verwenden Playwrights Request-Kontext ohne einen Browser zu starten und prüfen [JSONPlaceholder](https://jsonplaceholder.typicode.com/).
- Der Datentest erzeugt mit `node:sqlite` bei jeder Ausführung eine neue SQLite-Datenbank im Arbeitsspeicher.
- Geldbeträge werden als ganze Centwerte gespeichert, um Rundungsfehler mit Fließkommazahlen zu vermeiden.
- Die SQL-Abfrage nutzt einen Parameter für den Status, anstatt den Wert direkt in den Abfragetext einzusetzen.
- Die Datenbank wird nach dem Test geschlossen; es bleibt keine lokale Datenbankdatei zurück.

## Ausführung und Ergebnisnachweis

Die vollständige Suite wurde am 12. August 2026 auf macOS mit Node.js 24.19.0 ausgeführt:

```text
8 passed
```

GitHub Actions führt dieselbe Suite in einer frischen Ubuntu-Umgebung mit Node.js 24 und Chromium aus. Der Workflow installiert die festgeschriebenen npm-Abhängigkeiten, startet alle Tests und speichert den HTML-Testbericht für 30 Tage als Artefakt. Dadurch ist das Ergebnis unabhängig von der lokalen Mac-Konfiguration überprüfbar.

## Beobachtungen und Entscheidungen

- Die direkte Adresse `https://www.saucedemo.com/` wird als Testziel verwendet, weil nur dort die erwartete Login-Oberfläche zuverlässig verfügbar ist.
- Der positive Checkout-Test wurde aus der dokumentierten explorativen Sitzung [`QOL-EXP-CHECKOUT-001`](exploratory-session-checkout.md) abgeleitet.
- Feste API-Ressourcen und feste SQL-Testdaten machen die erwarteten Ergebnisse verständlich und wiederholbar.
- Die In-Memory-Datenbank isoliert den Datentest von bestehenden Daten und verhindert bleibende Änderungen.
- Die Tests enthalten derzeit keine erfundenen Bug Reports. Ein professioneller Fehlerbericht wird erst ergänzt, wenn ein tatsächliches Problem reproduzierbar beobachtet und mit Belegen dokumentiert wurde.

## Grenzen und Restrisiken

- Die Browser-Abdeckung ist aktuell auf Chromium beschränkt; Firefox, WebKit und reale Mobilgeräte sind nicht verifiziert.
- SauceDemo und JSONPlaceholder sind externe Testsysteme. Ausfälle oder Änderungen können Tests beeinflussen, ohne dass sich dieses Repository geändert hat.
- Die Checkout-Tests verwenden nur `standard_user` und ein Produkt. Fehlender Nachname, fehlende Postleitzahl, mehrere Produkte und Zurücknavigation sind nicht automatisiert.
- Die API-Abdeckung beschränkt sich auf lesende `GET`-Anfragen ohne Authentifizierung.
- Die Datenprüfung verwendet eine einzelne Tabelle im Arbeitsspeicher. Persistente Datenbanken, Beziehungen, Joins und Migrationen sind nicht geprüft.
- Der erfolgreiche CI-Lauf belegt die automatisierte Ausführung unter Ubuntu Linux, nicht das Verhalten auf allen Betriebssystemen oder Browsern.

## Nachgewiesene QA-Kompetenzen

Dieser Projektstand zeigt:

- fachliche Testfälle mit Voraussetzungen, Testdaten und erwarteten Ergebnissen formulieren
- positive und negative Szenarien auswählen und automatisieren
- Weboberflächen, HTTP-Antworten und SQL-Ergebnisse prüfen
- Testfälle und automatisierte Tests rückverfolgbar verbinden
- Tests lokal und in Continuous Integration reproduzierbar ausführen
- Ergebnisse, Abhängigkeiten und nicht geprüfte Bereiche transparent dokumentieren

## Sinnvoller nächster Schritt

Als nächster kleiner Block bietet sich eine zweite SQL-Datenprüfung für eine ungültige negative Bestellsumme an. Sie würde gezielt belegen, dass die bestehende Datenbankregel fehlerhafte Beträge abweist. Ein professioneller Bug Report entsteht weiterhin nur, wenn ein tatsächliches Problem reproduzierbar beobachtet und belegt wurde.
