# Podcast Naukowy
Aplikacja znajduje się pod adresem: https://science-podcast.herokuapp.com/#/

## O działaniu aplikacji
Strona jest aplikacją SPA, w której wymiana danych pomiędzy klientem a serwerem działa na zasadzie REST API. Za frontend odpowiada React (Typescript, SCSS), któremu w zarządaniu danymi pomaga Redux. Po stronie backendu mamy Pythona i jego framweork Django. Django REST Framework umożliwia wymianę danych pomiędzy serwerem a klientem.

## Funkcjonalności
- Słuchanie podcastów przechowywanych w AWS
- System logowania (JSON Web Token)
- Likowanie podcastów (lista polubionych podcastów wyświetla się w panelu użytkownika)
- Wyszukiwarka podcastów
- System komentarzy (komentarze, odpowiedzi, edycja, usuwanie, likowanie)
- Prosta prognoza pogody
- Podział na podstrony (który ostatecznie nie jest używany, ale jest w kodzie)
- **(ADMIN)** Możliwość dodawania, edytowania i usuwania podcastów oraz użytkowników

## Użyte technologie
- React
- Typescript
- Redux
- SASS
- Python
- Django (DRF, JWT)
- PostgreSQL
- Amazon Web Services
