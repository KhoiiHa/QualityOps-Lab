# Bug-Report-Vorlage

Diese Vorlage dient dazu, einen tatsächlich beobachteten und reproduzierbaren Fehler vollständig und nachvollziehbar zu dokumentieren. Sie ist selbst kein Bug Report und darf nicht mit erfundenen Beobachtungen ausgefüllt werden.

Vor dem Veröffentlichen müssen Screenshots, Videos, Logs und Testdaten auf personenbezogene Daten, Zugangsdaten, Tokens und andere vertrauliche Inhalte geprüft werden.

---

## `[QOL-BUG-XXX] Kurzer, eindeutiger Fehlertitel`

### Zusammenfassung

In ein bis zwei Sätzen beschreiben:

- Was funktioniert nicht?
- Wo tritt der Fehler auf?
- Welche Auswirkung hat er?

### Umgebung

| Merkmal | Wert |
| --- | --- |
| Testobjekt | `<Anwendung oder API>` |
| URL oder Endpunkt | `<vollständige URL>` |
| Datum und Uhrzeit | `<JJJJ-MM-TT, HH:MM, Zeitzone>` |
| Betriebssystem | `<Name und Version>` |
| Browser oder Client | `<Name und Version>` |
| Bildschirmgröße | `<nur falls relevant>` |
| Benutzer oder Rolle | `<Testbenutzer oder Rolle, keine geheimen Daten>` |
| Build oder Version | `<falls bekannt>` |

### Voraussetzungen

- `<notwendiger Ausgangszustand>`
- `<benötigte Testdaten>`
- `<Anmeldestatus oder Benutzerrolle>`

### Schritte zur Reproduktion

1. `<erster konkreter Schritt>`
2. `<zweiter konkreter Schritt>`
3. `<Aktion, die den Fehler auslöst>`

### Erwartetes Ergebnis

`<Beschreiben, welches überprüfbare Verhalten laut Anforderung, fachlicher Regel oder konsistenter Benutzerführung erwartet wird.>`

### Tatsächliches Ergebnis

`<Nur das beobachtete Verhalten beschreiben, ohne Vermutung über die technische Ursache.>`

### Reproduzierbarkeit

| Merkmal | Wert |
| --- | --- |
| Wiederholungen | `<zum Beispiel 3>` |
| Fehler aufgetreten | `<zum Beispiel 3 von 3>` |
| Quote | `<zum Beispiel 100 %>` |

### Schweregrad

`<kritisch | hoch | mittel | niedrig>`

Begründung: `<Auswirkung auf Benutzer, Daten oder zentralen Geschäftsablauf>`

- **kritisch:** System oder zentraler Ablauf ist nicht nutzbar; möglicher Datenverlust oder Sicherheitsbezug.
- **hoch:** Wichtige Funktion ist blockiert und es gibt keinen sinnvollen Umweg.
- **mittel:** Funktion ist beeinträchtigt, aber ein Umweg ist möglich.
- **niedrig:** Kleine funktionale oder visuelle Abweichung mit geringer Auswirkung.

### Priorität

`<sofort | hoch | normal | niedrig>`

Begründung: `<Warum und bis wann sollte der Fehler bearbeitet werden?>`

Die Priorität beschreibt die Dringlichkeit der Bearbeitung. Sie kann vom Schweregrad abweichen und sollte mit Produktverantwortlichen abgestimmt werden.

### Belege

- Screenshot: `<Datei oder Link>`
- Video: `<Datei oder Link>`
- Playwright-Trace: `<Datei oder Link>`
- Logauszug: `<nur relevante und bereinigte Zeilen>`
- Betroffener Testfall: `<Testfall-ID oder nicht vorhanden>`

### Zusätzliche Beobachtungen

- `<tritt der Fehler auch unter anderen Bedingungen auf?>`
- `<funktioniert ein vergleichbarer Ablauf korrekt?>`
- `<gibt es einen bekannten Umweg?>`

### Datenschutzkontrolle vor Veröffentlichung

- [ ] Keine Passwörter, Tokens oder geheimen Schlüssel enthalten
- [ ] Keine privaten oder personenbezogenen Daten enthalten
- [ ] Screenshots und Videos auf sensible Inhalte geprüft
- [ ] Logs auf Cookies, Header und Zugangsdaten geprüft
- [ ] Nur für die Reproduktion erforderliche Informationen enthalten

### Nachtest

| Merkmal | Wert |
| --- | --- |
| Status | `<offen | zur Prüfung bereit | bestanden | weiterhin fehlerhaft>` |
| Getestete Version | `<Build oder Version>` |
| Datum | `<JJJJ-MM-TT>` |
| Ergebnis | `<kurze, belegbare Beobachtung>` |

## Qualitätscheck für den fertigen Bericht

Ein Bug Report ist bereit zur Weitergabe, wenn:

- der Titel Fehler, Ort und Auswirkung verständlich zusammenfasst,
- eine andere Person den Fehler mit den Schritten reproduzieren kann,
- erwartetes und tatsächliches Ergebnis klar getrennt sind,
- Umgebung und Reproduzierbarkeit angegeben sind,
- Schweregrad und Priorität begründet statt nur ausgewählt wurden,
- mindestens ein geeigneter Beleg vorhanden ist,
- keine vertraulichen oder personenbezogenen Daten veröffentlicht werden.
