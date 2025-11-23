# Kanban board per la gestione delle issues
## Preview 
Web application per visualizzare sulla mappa punti geografici e le loro coordinate temperature locali e nome del luogo e tenerne traccia tramite database pocketbase

## Componenti del team creatore
- Choukrani Ayoub


## Requisiti di dominio
- css
- HTML
- JavaScript
- leaflet
- api openmeteo
- api nominatim
- pocketbase

## Requisiti funzionali
La web app permette di:
- Aggiungere in qualsiasi momento un nuovo cerchio sulla mappa con un click
- Visualizzare i punti geografici selezionati in precedenza anche se si riaggiorna la pagina
- visualizzare di ogni punto un proprio popup
- Salvare i punti in un database con pocketbase con i relativi dati
- cercare con la barra di ricerca i punti che appartengono ad una località

## Requisiti non funzionali
- **Interfaccia utente**: Garantire un design moderno e responsivo e allo stesso momento un'interfaccia intuitiva
- **Accessibilità**: le interazioni devono essere semplici e intuitivi da usare
- **Prestazioni**: La mappa deve essere reattiva e fluida durante le operazioni di selezione

## Requisiti di vincolo
- **Vincolo di tempo**: Richiesta consegna progetto in data 24/11/2025
- **Vincolo di sviluppo**: Interfaccia grafica da realizzare con pocketbase, leaflet, nominatim e utilizzo di GitHub come ambiente di collaborazione

## Analisi di affidabilità
- **Tempistica**: Il progetto è realizzabile in breve tempo
- **Costi**: Il progetto è poco costoso in quanto un team composto da 1 persona può realizzarlo
- **Utilizzabilità**: L'applicativo è utilizzabile da tutti gli utenti senza alcun requisito di programmazione

## Fonti e servizi utilizzati:
- Leaflet – mappa interattiva
- PocketBase – gestione dei dati e API locali
- Open-Meteo – dati meteorologici
- Nominatim / OpenStreetMap – geocoding e informazioni sui luoghi
- Dati geografici © OpenStreetMap contributors
