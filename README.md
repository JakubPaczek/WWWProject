# WWWProject

Prosta aplikacja czatu na żywo z logowaniem, pokojami i komunikacją w czasie rzeczywistym (WebSocket). Projekt wykonany w ramach przedmiotu **Programowanie WWW**.

## Demo

[Zobacz wersję online](https://jakubpaczek.github.io/WWWProject/)

## Funkcjonalności

- Rejestracja i logowanie (z JWT)
- Lista publicznych pokojów czatowych
- Czat w czasie rzeczywistym (socket.io)
- Historia wiadomości (REST API)
- Obsługa wielu użytkowników
- Ochrona tras i połączeń WebSocket
- Stylizacja w Tailwind CSS

## Technologie

| Frontend | Backend |
|----------|---------|
| React + TypeScript | Node.js + Express |
| Vite | SQLite |
| Tailwind CSS | socket.io |
| Axios | JWT |

## Struktura katalogów
<pre>
WWWProject/
├── client/                                # Frontend: React + Tailwind + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx                 # Pasek nagłówka (nawigacja, tytuł)
│   │   │   └── ProtectedRoute.tsx         # Komponent do ochrony tras
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx              # Logowanie i rejestracja
│   │   │   ├── RoomsPage.tsx              # Lista dostępnych pokojów
│   │   │   ├── ChatRoom.tsx               # Główne okno czatu
│   │   │   └── ChatRoomWrapper.tsx        # Łączy czat z parametrami z URL
│   │   ├── socket.ts                      # Konfiguracja socket.io-client
│   │   ├── main.tsx                       # Punkt wejścia + routing
│   │   ├── App.tsx                        # Layout wrapper (opcjonalnie)
│   │   ├── index.css                      # Style Tailwind CSS
│   │   └── vite-env.d.ts                  # Typy Vite (wymagane przez TS)
│   ├── .gitignore                         # Ignorowane pliki
│   ├── eslint.config.js                   # Konfiguracja ESLinta (opcjonalnie)
│   ├── index.html                         # Główna strona HTML (root Reacta)
│   ├── package-lock.json
│   ├── package.json                       # Zależności frontendu
│   ├── postcss.config.cjs                 # Konfiguracja Tailwind (PostCSS)
│   ├── tailwind.config.js                 # Tailwind konfiguracja
│   ├── tsconfig.app.json                  # Typy aplikacji
│   ├── tsconfig.node.json                 # Typy dla środowiska Node
│   ├── tsconfig.json                      # Główny config TypeScript
│   ├── vite.config.ts                     # Konfiguracja Vite
│   └── README.md                          # Dokumentacja frontendu
│
├── server/                                # Backend: Node.js + Express + SQLite
│   ├── src/
│   │   ├── db.ts                          # Inicjalizacja i migracje SQLite
│   │   ├── index.ts                       # Główna aplikacja Express + socket.io
│   │   ├── routes/
│   │   │   └── auth.ts                    # Endpointy logowania/rejestracji
│   │   └── middleware/
│   │       └── auth.ts                    # Middleware JWT do REST i socket.io
│   ├── chat.db                            # Plik bazy danych SQLite
│   ├── package.json                       # Zależności backendu
│   ├── package-lock.json
│   ├── tsconfig.json                      # TypeScript config backendu
│   └── README.md
│
├── .gitignore                             # Ignorowane globalnie pliki (root)
├── LICENSE                                # Licencja projektu
|── package-lock.json
|── package.json
└── README.md                              # Dokumentacja główna
</pre>
