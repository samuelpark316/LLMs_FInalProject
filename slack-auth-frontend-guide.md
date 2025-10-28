# Slack-Style Auth Flow (Frontend Only)

This guide walks you through adding a simple login / signup screen to your Slack clone **frontend**.  
Behavior:
- The auth screen is the first thing users see.
- User can "Continue" with email, then enter password, then click "Sign in".
- We hardcode credentials in the frontend and only allow:
  - **email:** `ronit@golden.vc`
  - **password:** `testing`
- "Continue with Google" / "Continue with Apple" buttons are just UI (no functionality yet).

This guide assumes React + modern component structure (Next.js, Vite React, CRA, etc.).  
If your setup is different, adjust imports/paths, but the logic is the same.

---

## 1. Create an `AuthContext` to track login state

We'll keep simple global auth state so the rest of the app knows if the user is logged in.

Create: `src/context/AuthContext.jsx`

```jsx
import { createContext, useContext, useState } from "react";

// hardcoded allowed credentials
const VALID_EMAIL = "ronit@golden.vc";
const VALID_PASSWORD = "testing";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null = logged out

  function login(email, password) {
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      const authedUser = { email };
      setUser(authedUser);
      return { ok: true };
    } else {
      return { ok: false, error: "Invalid email or password" };
    }
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

### Why we do this
- `user` being `null` means "not logged in".
- After successful login we store `{ email }` in state, which unlocks the rest of the app.

You can later replace `login()` with a real backend call without touching the rest of your UI.

---

## 2. Build the Login / Signup screen UI

This is the screen that looks like Slack's "First, enter your email" page.

Create: `src/components/AuthPage.jsx`

```jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const { login } = useAuth();

  // step 1: ask for email
  // step 2: ask for password
  const [stage, setStage] = useState("email"); // "email" | "password"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleEmailContinue(e) {
    e.preventDefault();

    // move to password stage no matter what they typed
    // (Slack does workspace lookup here, but we're skipping that)
    setStage("password");
    setError("");
  }

  function handlePasswordLogin(e) {
    e.preventDefault();
    const res = login(email, password);
    if (!res.ok) {
      setError(res.error || "Login failed");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-20 bg-white text-gray-900">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <div className="w-6 h-6 rounded-sm bg-gradient-to-br from-purple-600 to-pink-500" />
          <span>slack</span>
        </div>
      </div>

      <div className="w-full max-w-md flex flex-col items-center text-center">
        <h1 className="text-4xl font-semibold leading-tight mb-2">
          First, enter your email
        </h1>
        <p className="text-gray-600 mb-8">
          We suggest using the <b>email address you use at work.</b>
        </p>

        {/* card */}
        <div className="w-full border border-gray-300 rounded-lg p-6 shadow-sm">
          {stage === "email" && (
            <form onSubmit={handleEmailContinue} className="flex flex-col gap-4">
              <input
                className="w-full rounded-md border border-gray-400 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
                placeholder="name@work-email.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button
                type="submit"
                className="w-full bg-purple-700 text-white font-semibold rounded-md py-3 hover:bg-purple-800 transition"
              >
                Continue
              </button>
            </form>
          )}

          {stage === "password" && (
            <form onSubmit={handlePasswordLogin} className="flex flex-col gap-4">
              <div className="text-left">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Email
                </label>
                <input
                  className="w-full rounded-md border border-gray-400 px-3 py-3 text-base bg-gray-100 text-gray-700"
                  value={email}
                  disabled
                />
              </div>

              <div className="text-left">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Password
                </label>
                <input
                  className="w-full rounded-md border border-gray-400 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
                  placeholder="Your password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  (hardcoded demo: password is <code>testing</code>)
                </p>
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center">{error}</div>
              )}

              <button
                type="submit"
                className="w-full bg-purple-700 text-white font-semibold rounded-md py-3 hover:bg-purple-800 transition"
              >
                Sign in
              </button>

              <button
                type="button"
                onClick={() => setStage("email")}
                className="text-sm text-purple-700 hover:underline"
              >
                Back
              </button>
            </form>
          )}

          {/* Divider + OAuth-looking buttons */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
              Other options
            </span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          <div className="flex flex-col gap-3">
            <button
              className="w-full flex items-center justify-center gap-2 border border-gray-400 rounded-md py-3 text-sm font-medium hover:bg-gray-50 transition"
              type="button"
            >
              <span role="img" aria-label="google">🔍</span>
              Continue with Google
            </button>
            <button
              className="w-full flex items-center justify-center gap-2 border border-gray-400 rounded-md py-3 text-sm font-medium hover:bg-gray-50 transition"
              type="button"
            >
              <span role="img" aria-label="apple">🍎</span>
              Continue with Apple
            </button>
          </div>

          <p className="text-[11px] text-gray-500 leading-relaxed mt-6 text-left">
            By entering your email and continuing, you will either create a new
            workspace or be directed to any existing workspaces or invitations
            associated with your email.
          </p>
        </div>

        <div className="text-xs text-gray-600 mt-6">
          <p className="mb-2">Already using Slack?</p>
          <button className="text-purple-700 hover:underline">
            Sign in to an existing workspace
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Notes:
- We mimic Slack's flow with two stages instead of a separate signup page.
- You *can* style this with Tailwind (shown) or normal CSS classes — up to you.
- For now, "Sign in to an existing workspace" is just visual.

---

## 3. Gate the rest of the app behind auth

You want:  
- If **not logged in** → show `AuthPage`.  
- If **logged in** → show the rest of Slack (channels, messages, etc.)

In your top-level component (e.g. `App.jsx` or `page.jsx` depending on framework), do this pattern:

### Example `src/App.jsx`

```jsx
import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthPage from "./components/AuthPage";
import MainApp from "./components/MainApp"; // <-- your existing chat UI

function AppContent() {
  const { user } = useAuth();

  // while logged out
  if (!user) {
    return <AuthPage />;
  }

  // once logged in
  return <MainApp />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
```

Where `MainApp` is whatever you already built (sidebar, channels, DM UI, etc.).  
You don't have to rewrite that; just make sure your "real" Slack clone UI lives in `MainApp`.

---

## 4. Add a Logout button somewhere in your main UI

Inside `MainApp.jsx` (your chat UI), drop in logout so you can get back to the login screen for testing.

Example `src/components/MainApp.jsx`:

```jsx
import { useAuth } from "../context/AuthContext";

export default function MainApp() {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen">
      {/* Left sidebar, channels list, etc */}
      <aside className="w-64 bg-gray-900 text-white p-4 flex flex-col">
        <div className="text-sm mb-4">
          <div className="font-semibold">{user?.email}</div>
          <button
            onClick={logout}
            className="text-[11px] text-gray-400 hover:text-white underline"
          >
            Log out
          </button>
        </div>

        {/* ...rest of your sidebar ... */}
      </aside>

      {/* Main chat panel */}
      <main className="flex-1 bg-white">
        {/* ...your messages UI etc... */}
        <div className="p-4 text-gray-800">
          <h2 className="font-semibold mb-2"># general</h2>
          <p>Chat goes here...</p>
        </div>
      </main>
    </div>
  );
}
```

Now you can manually test the flow:
1. Refresh page → you see the Slack-style auth screen.
2. Enter any email, hit `Continue`.
3. Enter password `testing` and keep email as `ronit@golden.vc` to succeed.
4. If credentials match the hardcoded pair, `MainApp` renders.

---

## 5. Quick checklist

- [ ] `AuthContext.jsx` exists and wraps the app with `<AuthProvider>`  
- [ ] `AuthPage.jsx` is created and imported  
- [ ] Your root component decides which screen to show based on `user`  
- [ ] Hardcoded valid creds:  
  - Email: `ronit@golden.vc`  
  - Password: `testing`  
- [ ] `logout()` button exists somewhere in the main UI

---

## 6. Common gotchas

**"I'm not seeing the login page first"**  
Make sure your root render path is `<AuthProvider><AppContent/></AuthProvider>` and that `AppContent` returns `<AuthPage />` if `user` is null.

**Tailwind isn't applying**  
Confirm Tailwind is already wired in your project (global `index.css` with `@tailwind base; @tailwind components; @tailwind utilities;`).  
If you're not using Tailwind, replace the className strings with your own CSS.

**I want a separate Signup**  
Right now we merged "signup" and "login" into one flow just like Slack: you type an email, then you get asked for a password. You can easily fork the UI later.

---

## 7. Summary

After you add these 3 files/components:
- `AuthContext.jsx`
- `AuthPage.jsx`
- `MainApp.jsx` (or your existing main UI with logout)
and wrap everything with `<AuthProvider>`, your app will:
1. Always show the Slack-style login first,
2. Accept only `ronit@golden.vc` / `testing`,
3. Unlock the rest of the Slack clone once you're "logged in".

This gives you an MVP auth wall with zero backend.
