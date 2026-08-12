# Testfallkatalog – Web, API und Datenbank

Dieser Katalog dokumentiert die aktuell automatisierten Testszenarien für die öffentlichen Testsysteme [SauceDemo](https://www.saucedemo.com/) und [JSONPlaceholder](https://jsonplaceholder.typicode.com/) sowie für eine lokale In-Memory-Datenbank. Er verbindet fachliches Testdesign mit den zugehörigen Playwright-Tests.

## Testumgebung

| Merkmal | Wert |
| --- | --- |
| Testobjekte | SauceDemo (Web), JSONPlaceholder (API) und feste Bestelldaten (SQLite) |
| Teststufen | End-to-End-Systemtest, API-Test und Datenprüfung |
| Browser | Chromium für Webtests; für API- und Datenprüfungen nicht erforderlich |
| Datenbank | SQLite über `node:sqlite`, bei jedem Test neu im Arbeitsspeicher erzeugt |
| Automatisierung | Playwright Test mit TypeScript |
| Lokale Plattform | macOS |
| CI-Plattform | Ubuntu Linux über GitHub Actions |

## Übersicht und Rückverfolgbarkeit

| Testfall-ID | Bereich | Typ | Priorität | Automatisiert in |
| --- | --- | --- | --- | --- |
| QOL-WEB-LOGIN-001 | Login | positiv | hoch | [`tests/login.spec.ts`](../tests/login.spec.ts) |
| QOL-WEB-LOGIN-002 | Login | negativ | hoch | [`tests/login.spec.ts`](../tests/login.spec.ts) |
| QOL-WEB-CART-001 | Warenkorb | positiv | hoch | [`tests/cart.spec.ts`](../tests/cart.spec.ts) |
| QOL-WEB-CHECKOUT-001 | Checkout | positiv | hoch | [`tests/checkout.spec.ts`](../tests/checkout.spec.ts) |
| QOL-WEB-CHECKOUT-002 | Checkout | negativ | hoch | [`tests/checkout.spec.ts`](../tests/checkout.spec.ts) |
| QOL-API-POSTS-001 | Posts API | positiv | hoch | [`tests/api/posts.spec.ts`](../tests/api/posts.spec.ts) |
| QOL-API-POSTS-002 | Posts API | negativ | hoch | [`tests/api/posts.spec.ts`](../tests/api/posts.spec.ts) |
| QOL-DATA-ORDERS-001 | Bestelldaten | positiv | hoch | [`tests/database/orders.spec.ts`](../tests/database/orders.spec.ts) |
| QOL-DATA-ORDERS-002 | Bestelldaten | negativ | hoch | [`tests/database/orders.spec.ts`](../tests/database/orders.spec.ts) |

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

## QOL-WEB-CHECKOUT-001 – Bestellung erfolgreich abschließen

| Feld | Inhalt |
| --- | --- |
| Ziel | Prüfen, dass ein angemeldeter Benutzer ein Produkt mit gültigen Kundendaten und korrekter Preisübersicht erfolgreich bestellen kann. |
| Priorität | hoch |
| Testtyp | positiv |
| Automatisierungsstatus | automatisiert |

### Voraussetzungen

- SauceDemo ist erreichbar.
- Der Benutzer ist nicht angemeldet und befindet sich auf der Login-Seite.
- Das Produkt „Sauce Labs Backpack“ ist für `$29.99` verfügbar.
- Der Checkout-Ablauf wurde zuvor in der explorativen Sitzung [`QOL-EXP-CHECKOUT-001`](exploratory-session-checkout.md) geprüft.

### Testdaten

| Eingabe | Wert |
| --- | --- |
| Benutzername | `standard_user` |
| Passwort | `secret_sauce` |
| Produkt | `Sauce Labs Backpack` |
| Vorname | `Max` |
| Nachname | `Mustermann` |
| Postleitzahl | `20095` |
| Erwartete Zwischensumme | `$29.99` |
| Erwartete Steuer | `$2.40` |
| Erwartete Gesamtsumme | `$32.39` |

### Testschritte

| Nr. | Aktion | Erwartetes Ergebnis |
| --- | --- | --- |
| 1 | Mit den gültigen Demo-Zugangsdaten anmelden. | Die Produktübersicht wird geöffnet. |
| 2 | Den „Sauce Labs Backpack“ zum Warenkorb hinzufügen und den Warenkorb öffnen. | Der Warenkorb enthält das ausgewählte Produkt. |
| 3 | Den Checkout starten. | Das Formular für die Kundendaten unter `checkout-step-one.html` wird geöffnet. |
| 4 | Vorname, Nachname und Postleitzahl eingeben und fortfahren. | Die Bestellübersicht unter `checkout-step-two.html` wird geöffnet. |
| 5 | Produkt und Preisübersicht prüfen. | Der Rucksack ist sichtbar; Zwischensumme, Steuer und Gesamtsumme entsprechen den erwarteten Werten. |
| 6 | Die Bestellung abschließen. | Die Abschlussseite `checkout-complete.html` zeigt „Thank you for your order!“. |

## QOL-WEB-CHECKOUT-002 – Checkout ohne Vornamen abweisen

| Feld | Inhalt |
| --- | --- |
| Ziel | Prüfen, dass ein fehlender Vorname das Fortsetzen zur Bestellübersicht verhindert und eine verständliche Fehlermeldung auslöst. |
| Priorität | hoch |
| Testtyp | negativ |
| Automatisierungsstatus | automatisiert |

### Voraussetzungen

- SauceDemo ist erreichbar.
- Der Benutzer ist nicht angemeldet und befindet sich auf der Login-Seite.
- Das Produkt „Sauce Labs Backpack“ ist verfügbar.

### Testdaten

| Eingabe | Wert |
| --- | --- |
| Benutzername | `standard_user` |
| Passwort | `secret_sauce` |
| Produkt | `Sauce Labs Backpack` |
| Vorname | leer |
| Nachname | `Mustermann` |
| Postleitzahl | `20095` |

### Testschritte

| Nr. | Aktion | Erwartetes Ergebnis |
| --- | --- | --- |
| 1 | Mit den gültigen Demo-Zugangsdaten anmelden. | Die Produktübersicht wird geöffnet. |
| 2 | Den „Sauce Labs Backpack“ zum Warenkorb hinzufügen, den Warenkorb öffnen und den Checkout starten. | Das Formular unter `checkout-step-one.html` wird geöffnet. |
| 3 | Nachname und Postleitzahl eingeben, den Vornamen aber leer lassen. | Die beiden eingegebenen Werte stehen in den vorgesehenen Feldern; das Vornamensfeld bleibt leer. |
| 4 | Die Schaltfläche „Continue“ betätigen. | Die Bestellübersicht wird nicht geöffnet; die URL bleibt auf `checkout-step-one.html`. |
| 5 | Die Validierungsmeldung prüfen. | `Error: First Name is required` wird angezeigt. |

## QOL-API-POSTS-001 – Einzelnen Beitrag abrufen

| Feld | Inhalt |
| --- | --- |
| Ziel | Prüfen, dass ein vorhandener Beitrag erfolgreich als JSON mit der erwarteten Struktur und den erwarteten Identifikatoren zurückgegeben wird. |
| Priorität | hoch |
| Testtyp | positiv |
| Automatisierungsstatus | automatisiert |

### Voraussetzungen

- JSONPlaceholder ist erreichbar.
- Der Testdatensatz `/posts/1` ist verfügbar.
- Für den öffentlichen Lesezugriff ist keine Authentifizierung erforderlich.

### Testdaten

| Eingabe | Wert |
| --- | --- |
| HTTP-Methode | `GET` |
| Endpunkt | `https://jsonplaceholder.typicode.com/posts/1` |
| Erwartete Beitrags-ID | `1` |
| Erwartete Benutzer-ID | `1` |

### Testschritte

| Nr. | Aktion | Erwartetes Ergebnis |
| --- | --- | --- |
| 1 | Eine GET-Anfrage an `/posts/1` senden. | Der Server beantwortet die Anfrage. |
| 2 | Den HTTP-Status prüfen. | Der Statuscode ist `200`. |
| 3 | Den Content-Type prüfen. | Der Antworttyp enthält `application/json`. |
| 4 | Die JSON-Struktur prüfen. | Die Antwort enthält genau `userId`, `id`, `title` und `body` mit den erwarteten Datentypen. |
| 5 | Die Identifikatoren prüfen. | `id` und `userId` haben jeweils den Wert `1`. |
| 6 | Die Textfelder prüfen. | `title` und `body` sind nicht leer. |

## QOL-API-POSTS-002 – Nicht vorhandenen Beitrag abrufen

| Feld | Inhalt |
| --- | --- |
| Ziel | Prüfen, dass die API eine Anfrage nach einem nicht vorhandenen Beitrag kontrolliert und im erwarteten JSON-Format beantwortet. |
| Priorität | hoch |
| Testtyp | negativ |
| Automatisierungsstatus | automatisiert |

### Voraussetzungen

- JSONPlaceholder ist erreichbar.
- Unter `/posts/999999` ist kein Beitrag vorhanden.
- Für den öffentlichen Lesezugriff ist keine Authentifizierung erforderlich.

### Testdaten

| Eingabe | Wert |
| --- | --- |
| HTTP-Methode | `GET` |
| Endpunkt | `https://jsonplaceholder.typicode.com/posts/999999` |
| Nicht vorhandene Beitrags-ID | `999999` |

### Testschritte

| Nr. | Aktion | Erwartetes Ergebnis |
| --- | --- | --- |
| 1 | Eine GET-Anfrage an `/posts/999999` senden. | Der Server beantwortet die Anfrage kontrolliert. |
| 2 | Den HTTP-Status prüfen. | Der Statuscode ist `404`. |
| 3 | Den Content-Type prüfen. | Der Antworttyp enthält `application/json`. |
| 4 | Den JSON-Körper prüfen. | Die Antwort ist das leere JSON-Objekt `{}` und enthält keine erfundenen Ressourcendaten. |

## QOL-DATA-ORDERS-001 – Bezahlte Bestellungen aggregieren

| Feld | Inhalt |
| --- | --- |
| Ziel | Prüfen, dass eine SQL-Abfrage ausschließlich bezahlte Bestellungen berücksichtigt und deren Anzahl sowie Gesamtsumme korrekt berechnet. |
| Priorität | hoch |
| Testtyp | positiv |
| Automatisierungsstatus | automatisiert |

### Voraussetzungen

- Node.js 24 mit dem integrierten Modul `node:sqlite` ist verfügbar.
- Der Test erzeugt eine neue, leere SQLite-Datenbank im Arbeitsspeicher.
- Es wird keine bestehende oder dauerhafte Datenbank verändert.

### Testdaten

| Bestell-ID | Status | Betrag in Cent |
| --- | --- | --- |
| `1` | `PAID` | `1299` |
| `2` | `PAID` | `2500` |
| `3` | `CANCELLED` | `999` |
| `4` | `PAID` | `3201` |

### Testschritte

| Nr. | Aktion | Erwartetes Ergebnis |
| --- | --- | --- |
| 1 | Eine leere In-Memory-Datenbank und die Tabelle `orders` erzeugen. | Die Tabelle akzeptiert Bestell-ID, Status und einen nicht negativen Betrag in Cent. |
| 2 | Die vier festgelegten Bestellungen einfügen. | Drei bezahlte und eine stornierte Bestellung sind gespeichert. |
| 3 | Anzahl und Gesamtsumme für den Status `PAID` per SQL abfragen. | Die stornierte Bestellung wird durch den Statusfilter ausgeschlossen. |
| 4 | Das Abfrageergebnis prüfen. | Die Anzahl ist `3` und die Gesamtsumme beträgt `7000` Cent. |
| 5 | Die Datenbank schließen. | Die temporären Testdaten werden vollständig verworfen. |

## QOL-DATA-ORDERS-002 – Negative Bestellsumme abweisen

| Feld | Inhalt |
| --- | --- |
| Ziel | Prüfen, dass die Datenbank eine Bestellung mit einer negativen Gesamtsumme ablehnt und keinen ungültigen Datensatz speichert. |
| Priorität | hoch |
| Testtyp | negativ |
| Automatisierungsstatus | automatisiert |

### Voraussetzungen

- Node.js 24 mit dem integrierten Modul `node:sqlite` ist verfügbar.
- Der Test erzeugt eine neue, leere SQLite-Datenbank im Arbeitsspeicher.
- Die Spalte `total_cents` besitzt die Regel `CHECK (total_cents >= 0)`.

### Testdaten

| Eingabe | Wert |
| --- | --- |
| Bestell-ID | `1` |
| Status | `PAID` |
| Betrag in Cent | `-1` |

### Testschritte

| Nr. | Aktion | Erwartetes Ergebnis |
| --- | --- | --- |
| 1 | Eine leere In-Memory-Datenbank und die Tabelle `orders` mit der Betragsregel erzeugen. | Die Tabelle ist verfügbar und erlaubt nur Beträge ab `0` Cent. |
| 2 | Eine bezahlte Bestellung mit `-1` Cent einfügen. | SQLite lehnt den Schreibvorgang wegen der verletzten `CHECK`-Regel ab. |
| 3 | Die Anzahl der gespeicherten Bestellungen abfragen. | Die Anzahl ist `0`; der ungültige Datensatz wurde nicht gespeichert. |
| 4 | Die Datenbank schließen. | Die temporäre Datenbank wird vollständig verworfen. |

## Bekannte Grenzen

- Die Ergebnisse hängen von der Erreichbarkeit und dem aktuellen Zustand der externen Testsysteme ab.
- Die Webtests decken derzeit nur Chromium ab.
- Weitere Checkout-Pflichtfelder und Varianten, API-Methoden, persistente Datenbanken, Tabellenbeziehungen und mobile Tests sind noch nicht Bestandteil dieses Katalogs.
