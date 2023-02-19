# Learning Corner - Advance Web Development Project

## Funktionalitäten
Das Projekt Learning Corner bietet eine offene Lernplattform für alle. 

Um die Lernplattform nutzen zu können, müssen sich NutzerInnen zunächst mit ihrem Vor- und Nachnamen, ihrer Email-Adresse und einem Passwort registrieren und können sich anschließend mit der Email-Adresse und dem Passwort anmelden. 

Für angemeldete Nutzer bietet die Platform folgende Funktionalitäten:
- Erstellen von eigenen Kursen
- Teilnehmen an Kursen von Anderen
- Erstellen von eigenen Gruppen innerhalb von Kursen (Sowohl in eigenen Kursen als auch in Kursen Anderer, an denen der Nutzer teilnimmt)
- Hinzufügen und Löschen von Inhaltssektionen und Dateien zu eigenen Kursen
- Herunterladen von Dateien aus Kursen an denen der Nutzer teilnimmt
- Hinzufügen und Löschen von Inhaltssektionen und Dateien zu Gruppen an denen der Nutzer teilnimmt
- Hinzufügen und Entfernen von Kursen zu einer persönlichen Favoriten-Liste
- Chatten innerhalb von Kursen und Gruppen, mit anderen Nutzern die gerade auf der Seite des Kurses/der Gruppe sind, an denen der Nutzer teilnimmt
- Anzeigen und Ändern der Accountdaten wie Name, Passwort, Email und Profilbild
- Löschen des eigenen Accounts
- Suchen nach Kursen über Ihren Namen
- Gefiltertes Anzeigen von Kursen
- Nach Kursen gruppiertes Anzeigen von Gruppen
- Gemeinsames arbeiten an kollaborativen Dokumenten in Gruppen und Kursen

## Routen
Eine vollständige Übersicht über alle API-Routen befindet sich im Ordner 'api_docs'. Diese Dokumentation wurde mittels openapi markdown generator erstellt.

## Starten der Applikation
Nach erfolgreichem Klonen des Repository kann die Anwendung wie folgt gestartet werden:

### Start der Anwendung via Docker-Compose
Am einfachsten ist es die Anwendung mittels Docker Compose zu starten, hier wird direkt die benötigte Datenbank mit bereitgestellt:

Befinden wir uns im Root Verzeichnis des Repositories können wir mit folgendem Befehlt die Anwendung starten:

```docker compose up```

## Ausführen der Tests

Damit die Tests erfolgreich ausgeführt werden können ist es zwingend Erforderlich, dass die Datenbank und das Backend bereitsteht. Um dies zu gewährleisten, empfehlen wir, die Anwendung zuerst mittels docker compose, wie oben beschrieben, zu starten.

Befinden wir uns im Root Verzeichnis des Repositories können wir mit folgenden Befehlen die automatischen Tests starten:

### Backend
```cd backend && npm run test```

### Frontend
```cd frontend && npm run test```