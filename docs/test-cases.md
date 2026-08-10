# Testfallkatalog – Web End-to-End

Dieser Katalog dokumentiert die aktuell automatisierten Testszenarien für die öffentliche Demoanwendung [SauceDemo](https://www.saucedemo.com/). Er verbindet fachliches Testdesign mit den zugehörigen Playwright-Tests.

## Testumgebung

| Merkmal | Wert |
| --- | --- |
| Testobjekt | SauceDemo |
| Teststufe | End-to-End-Systemtest |
| Browser | Chromium |
| Automatisierung | Playwright Test mit TypeScript |
| Lokale Plattform | macOS |
| CI-Plattform | Ubuntu Linux über GitHub Actions |

## Übersicht und Rückverfolgbarkeit

| Testfall-ID | Bereich | Typ | Priorität | Automatisiert in |
| --- | --- | --- | --- | --- |
| QOL-WEB-LOGIN-001 | Login | positiv | hoch | [`tests/login.spec.ts`](../tests/login.spec.ts) |
| QOL-WEB-LOGIN-002 | Login | negativ | hoch | [`tests/login.spec.ts`](../tests/login.spec.ts) |
| QOL-WEB-CART-001 | Warenkorb | positiv | hoch | [`tests/cart.spec.ts`](../tests/cart.spec.ts) |

## QOL-WEB-LOGIN-001 – Erfolgreiche Anmeldung

| Feld | Inhalt |
| --- | --- |
| Ziel | Prüfen, dass sich ein gültiger Benutzer anmelden und die Produktübersicht erreichen kann. |
| Priorität | hoch |
| Testtyp | positiv |
| Automatisierungsstatus | automatisiert |

### Voraussetzungen

- SauceDemo ist erreichbar.
- Der Benutzer ist nicht angemeldet und befindet sich auf der Login-Seite.
- Der öffentliche Demo-Benutzer `standard_user` ist verfügbar.

### Testdaten

| Eingabe | Wert |
| --- | --- |
| Benutzername | `standard_user` |
| Passwort | `secret_sauce` |

### Testschritte

| Nr. | Aktion | Erwartetes Ergebnis |
| --- | --- | --- |
| 1 | SauceDemo öffnen. | Die Login-Seite wird angezeigt. |
| 2 | Den gültigen Benutzernamen eingeben. | Der Benutzername steht im Eingabefeld. |
| 3 | Das gültige Passwort eingeben. | Das Passwort steht maskiert im Eingabefeld. |
| 4 | Die Schaltfläche „Login“ betätigen. | Die Anwendung öffnet die Produktübersicht; die URL endet auf `inventory.html`. |
| 5 | Die Überschrift der Zielseite prüfen. | „Products“ ist sichtbar. |

## QOL-WEB-LOGIN-002 – Abgewiesene Anmeldung mit falschem Passwort

| Feld | Inhalt |
| --- | --- |
| Ziel | Prüfen, dass ein falsches Passwort die Anmeldung verhindert und eine verständliche Fehlermeldung auslöst. |
| Priorität | hoch |
| Testtyp | negativ |
| Automatisierungsstatus | automatisiert |

### Voraussetzungen

- SauceDemo ist erreichbar.
- Der Benutzer ist nicht angemeldet und befindet sich auf der Login-Seite.
- Der öffentliche Demo-Benutzer `standard_user` ist verfügbar.

### Testdaten

| Eingabe | Wert |
| --- | --- |
| Benutzername | `standard_user` |
| Passwort | `wrong_password` |

### Testschritte

| Nr. | Aktion | Erwartetes Ergebnis |
| --- | --- | --- |
| 1 | SauceDemo öffnen. | Die Login-Seite wird angezeigt. |
| 2 | Den gültigen Benutzernamen eingeben. | Der Benutzername steht im Eingabefeld. |
| 3 | Das falsche Passwort eingeben. | Das Passwort steht maskiert im Eingabefeld. |
| 4 | Die Schaltfläche „Login“ betätigen. | Die Anmeldung wird abgewiesen. |
| 5 | Die Fehlermeldung prüfen. | „Epic sadface: Username and password do not match any user in this service“ ist sichtbar. |
| 6 | Die aktuelle URL prüfen. | Die URL endet nicht auf `inventory.html`; die Produktübersicht wurde nicht geöffnet. |

## QOL-WEB-CART-001 – Produkt in den Warenkorb legen

| Feld | Inhalt |
| --- | --- |
| Ziel | Prüfen, dass ein angemeldeter Benutzer ein bestimmtes Produkt auswählen und im Warenkorb wiederfinden kann. |
| Priorität | hoch |
| Testtyp | positiv |
| Automatisierungsstatus | automatisiert |

### Voraussetzungen

- SauceDemo ist erreichbar.
- Der Benutzer ist nicht angemeldet und befindet sich auf der Login-Seite.
- Das Produkt „Sauce Labs Backpack“ ist in der Produktübersicht verfügbar.

### Testdaten

| Eingabe | Wert |
| --- | --- |
| Benutzername | `standard_user` |
| Passwort | `secret_sauce` |
| Produkt | `Sauce Labs Backpack` |
| Erwartete Anzahl | `1` |

### Testschritte

| Nr. | Aktion | Erwartetes Ergebnis |
| --- | --- | --- |
| 1 | Mit den gültigen Demo-Zugangsdaten anmelden. | Die Produktübersicht wird geöffnet. |
| 2 | Beim Produkt „Sauce Labs Backpack“ die Schaltfläche „Add to cart“ betätigen. | Das Produkt wird zum Warenkorb hinzugefügt. |
| 3 | Den Warenkorb-Zähler prüfen. | Der Zähler zeigt `1`. |
| 4 | Den Warenkorb öffnen. | Die Warenkorbseite wird geöffnet; die URL endet auf `cart.html`. |
| 5 | Die Anzahl der Warenkorbeinträge prüfen. | Genau ein Eintrag ist vorhanden. |
| 6 | Den Produktnamen im Warenkorb prüfen. | „Sauce Labs Backpack“ ist sichtbar. |

## Bekannte Grenzen

- Die Ergebnisse hängen von der Erreichbarkeit und dem aktuellen Zustand der externen Demoanwendung ab.
- Der Katalog deckt derzeit nur Chromium ab.
- Checkout, API, Datenbank und mobile Szenarien sind noch nicht Bestandteil dieses Katalogs.
