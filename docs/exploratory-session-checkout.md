# Explorative Testsitzung – Warenkorb bis Bestellabschluss

## Sitzungsübersicht

| Merkmal | Wert |
| --- | --- |
| Sitzungs-ID | `QOL-EXP-CHECKOUT-001` |
| Datum | 12. August 2026 |
| Testobjekt | [SauceDemo](https://www.saucedemo.com/) |
| Bereich | Warenkorb, Checkout-Formular, Bestellübersicht und Abschluss |
| Benutzer | öffentlicher Demo-Benutzer `standard_user` |
| Umgebung | Chromium über Playwright, macOS, Node.js 24.19.0 |
| Ergebnis | kein reproduzierbarer Fehler im untersuchten Umfang gefunden |

## Testauftrag

Untersucht wird, ob ein angemeldeter Benutzer ein Produkt vom Warenkorb bis zum Bestellabschluss konsistent bearbeiten kann. Der Schwerpunkt liegt auf Zustandsübergängen, Pflichtfeldvalidierung, Preisberechnung und verständlicher Rückmeldung.

Diese Sitzung ist eine gezielte explorative Prüfung und kein vollständiger Abnahmetest des gesamten Shops.

## Leitfragen

- Bleiben Produkt, Anzahl und Preis beim Wechsel zwischen den Seiten erhalten?
- Verhindert das Checkout-Formular die Fortsetzung bei fehlenden Pflichtangaben?
- Benennt die Anwendung das jeweils fehlende Feld verständlich?
- Stimmen Zwischensumme, Steuer und Gesamtsumme miteinander überein?
- Erreicht der Benutzer nach dem Abschluss eine eindeutige Bestätigung?
- Treten während des Ablaufs sichtbare technische Fehler auf?

## Verwendete Testdaten

| Eingabe | Wert |
| --- | --- |
| Benutzername | `standard_user` |
| Passwort | `secret_sauce` |
| Produkt | `Sauce Labs Backpack` |
| Vorname | `Max` |
| Nachname | `Mustermann` |
| Postleitzahl | `20095` |

Die Zugangsdaten sind öffentliche SauceDemo-Testdaten. Es wurden keine privaten oder produktiven Daten verwendet.

## Durchgeführte Untersuchung und Beobachtungen

| Nr. | Untersuchung | Beobachtung |
| --- | --- | --- |
| 1 | Mit dem gültigen Demo-Benutzer anmelden. | Die Produktübersicht unter `inventory.html` wurde geöffnet. |
| 2 | Den „Sauce Labs Backpack“ zum Warenkorb hinzufügen. | Der Warenkorb-Zähler zeigte `1`. |
| 3 | Den Warenkorb öffnen und den Eintrag prüfen. | Produktname, Menge `1` und Preis `$29.99` waren korrekt. |
| 4 | Den Checkout ohne Eingaben fortsetzen. | `Error: First Name is required` wurde angezeigt. |
| 5 | Nur den Vornamen eingeben und erneut fortsetzen. | `Error: Last Name is required` wurde angezeigt. |
| 6 | Zusätzlich den Nachnamen eingeben und erneut fortsetzen. | `Error: Postal Code is required` wurde angezeigt. |
| 7 | Die Postleitzahl ergänzen und fortsetzen. | Die Bestellübersicht unter `checkout-step-two.html` wurde geöffnet. |
| 8 | Preisberechnung prüfen. | Zwischensumme `$29.99`, Steuer `$2.40` und Gesamtsumme `$32.39` waren rechnerisch konsistent. |
| 9 | Die Bestellung abschließen. | `Thank you for your order!` wurde unter `checkout-complete.html` angezeigt. |
| 10 | Technische Laufzeitbeobachtungen prüfen. | Keine Konsolenfehler, Seitenfehler oder fehlgeschlagenen Netzwerkanfragen wurden im untersuchten Ablauf beobachtet. |

## Bewertung

Im untersuchten Ablauf wurde kein reproduzierbarer Produktfehler gefunden. Die Anwendung bewahrte den Warenkorbzustand, validierte die drei Pflichtfelder in nachvollziehbarer Reihenfolge, berechnete die angezeigte Gesamtsumme korrekt und bestätigte den Bestellabschluss eindeutig.

Die negativen Pflichtfeldprüfungen zeigen erwartetes Validierungsverhalten. Sie sind deshalb keine Bug Reports.

## Grenzen der Sitzung

- Die Prüfung verwendete nur Chromium und keine weiteren Browser oder realen Mobilgeräte.
- Es wurde nur `standard_user` mit einem einzelnen Produkt untersucht.
- Mengenänderungen, mehrere Produkte, Entfernen, Sortierung und Zurücknavigation waren nicht Bestandteil des Auftrags.
- Visuelle Details, Tastaturbedienung und Barrierefreiheit wurden nicht systematisch bewertet.
- Netzwerkunterbrechungen, langsame Verbindungen, Performance und Sicherheit wurden nicht simuliert.
- SauceDemo ist ein externes Demo-System; spätere Änderungen können zu anderen Beobachtungen führen.
- Die Ausführung erfolgte automatisiert ohne sichtbares Browserfenster. Das belegt den funktionalen Ablauf, ersetzt aber keine manuelle visuelle Prüfung.

## Umgesetzte Folgearbeit

Der erfolgreiche Kernablauf wurde anschließend als positiver Regressionstest `QOL-WEB-CHECKOUT-001` in [`tests/checkout.spec.ts`](../tests/checkout.spec.ts) automatisiert und im [Testfallkatalog](test-cases.md) dokumentiert. Zusätzlich prüft `QOL-WEB-CHECKOUT-002`, dass ein fehlender Vorname das Fortsetzen im Checkout verhindert. Weitere Benutzer, Produkte und Browser bleiben bewusst außerhalb dieser Sitzung und sind als Grenzen dokumentiert.
