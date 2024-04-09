# Verwenden eines offiziellen Python-Images als Eltern-Image
FROM python:3.9-slim

# Arbeitsverzeichnis im Container setzen
WORKDIR /usr/src/app

# Abhängigkeiten installieren
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# App-Quellcode in das Container-Dateisystem kopieren
COPY . .

# Port, den die App im Container nutzen wird, freigeben
EXPOSE 5000

# Vorherige Anweisungen beibehalten
CMD ["python3", "./app.py"]
