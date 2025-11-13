flowchart TB

    %% ============================
    %% Browser Client
    %% ============================
    BrowserClient["Browser Client<br/>Next.js SPA"]

    %% ============================
    %% Vercel Deployment Layer
    %% ============================
    subgraph Vercel["Vercel Deployment"]
        Frontend["Next.js Frontend"]
        EdgeFn["Edge Function"]
        APIRoutes["Next.js API Routes"]
        Frontend -->|HTTPS| EdgeFn -->|HTTPS| APIRoutes
    end

    BrowserClient -->|HTTPS| Frontend
    BrowserClient -->|direct upload/download| APIRoutes

    %% ============================
    %% External Services
    %% ============================
    subgraph External["External Services"]
        SupaAuth["Supabase Auth"]
        SupaPostgres["Supabase Postgres + RLS + FTS"]
        SupaStorage["Supabase Storage"]
        OpenAI["ChatGPT API"]
        FirebaseMsg["Firebase Cloud Messaging"]
        Realtime["Supabase Realtime"]
    end

    %% Auth → Routes
    APIRoutes -->|OAuth / JWT| SupaAuth
    %% DB
    APIRoutes -->|SQL & TLS| SupaPostgres
    APIRoutes -->|write summary| SupaPostgres
    SupaPostgres -->|WAL / CDC| Realtime
    %% Storage
    APIRoutes -->|pre-signed URL| SupaStorage
    %% Summaries
    APIRoutes -->|summarize(channel)| OpenAI
    APIRoutes -->|summary| OpenAI
    %% Notifications
    OpenAI -->|notify offline| FirebaseMsg

    %% ============================
    %% Browser APIs
    %% ============================
    subgraph BrowserAPIs["Browser APIs & Libraries"]
        ServiceWorker["Firebase Service Worker"]
        RealtimeClient["Supabase Realtime Client"]
    end

    FirebaseMsg -->|Web Push| ServiceWorker
    Realtime -->|WebSocket events| RealtimeClient
    RealtimeClient --> BrowserClient
    ServiceWorker --> BrowserClient
