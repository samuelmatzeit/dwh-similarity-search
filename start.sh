#!/bin/bash

# Warte auf die Datenbank
./wait-for-it.sh db:5432 -- echo "Datenbank ist bereit."

# Führe main.py aus
python load_data.py

# Starte die Flask-Anwendung
python app.py
