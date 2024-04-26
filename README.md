# Mercedes Finder
Finde die zu Dir passende Mercedes Limousine! Ein Projekt im Rahmen des Moduls DWH.

Das Projekt dient der Demonstration von Ähnlichkeitssuche durch Vectordatenbanken. Dafür wurden verschiedene aktuelle Limousinenmodelle von Mercedes (Stand: 04/2024) gesammelt und mit ihren Spezifikationen festgehalten. Diese sind in der DWH-Mercedes_Data.csv zu finden.

## Hosted Version
[mercedesfinder.matzeits.de](https://mercedesfinder.matzeits.de)

## Installation mit Docker
Projekt lokal speichern
```
git clone https://github.com/samuelmatzeit/dwh-similarity-search.git
```
Ordner wechsel
```
cd dwh-similarity-search
```
Dockercontainer starten
```
docker compose up
```

## Funktionsweise
Im folgenden werden die Funktionsinterna erklärt.

#### Anpassen des lokalen Klons
Die Anwendung ist größtenteils vorbereitet. Lediglich die .env.example muss umbenannt werden zu .env und kann anschließend produktiv genutzt werden. Diese gibt den Verbindungsstring für die Datenbankverbindung an. Wenn diese durch docker-compose.yaml definierte Datenbank andere Werte nutzen soll als die Standardwerte, so müssen beide Dateien diesbezüglich angepasst werden.

#### Laden neuer Daten
Die csv Datei kann bei Bedarf mit neuen oder weiteren Werten befüllt werden. Um die Daten in die Umgebung zu übernehmen, muss das Pythonskript: load_data.py ausgeführt werden. Dieses liest alle Daten aus, normiert die Daten für die Vektordatenbank und erstellt SQL-Prompts in initdb für den nächsten Start der Anwendung. Nur wenn dieser Schritt gemacht wird, werden die neuen Daten in die Applikation übernommen.

### Umgebungs Setup

Zum Aufsetzen der Umgebung kann die Dockeranleitung oben verwendet werden. Bei Bedarf zum neuen starten kann auch die start.sh verwendet werden. Diese entfernt erst den laufenden Container, löscht dessen Daten, baut die Container neu und deployt diese anschließend.

Der Aufbau der Umgebung ist vollständig automatisiert und lässt sich mit der docker-compose.yaml erledigen.
Getestet auf: Ubuntu 22.04.3 LTS

Beim Starten der Docker-Compose wird eine Postgres-Datenbank mit pgvector durch die Datei "Dockerfile.pgvector" geladen. Diese bekommt die Startdatei in initdb: "start_database.sql" mit. Dabei werden sowohl die notwendigen Erweiterungen installiert (vector), die Tabellen spezifiziert, wie auch die Werte in die Tabellen geladen. Damit ist die Datenbank bereit und unter dem Wert in der .env erreichbar.

Anschließend wird durch "Dockerfile" die app.py gestartet, wodurch die Applikation gestartet wird und über den Port 5000 erreichbar ist. 

Damit ist die App nutzbar. Viel Spaß damit!
