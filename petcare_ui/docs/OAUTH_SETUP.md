Google OAuth setup (secure)

- Create a local env file by copying `.env.example` to `.env.local` and set your real client id.

```bash
cp .env.example .env.local
# then edit .env.local and set REACT_APP_GOOGLE_CLIENT_ID
```

- `.env.local` is already listed in `.gitignore` so your client id won't be committed.

- For production, set `REACT_APP_GOOGLE_CLIENT_ID` as a secret in your CI/CD or hosting platform (do not commit it to git).

- This app uses the Google Identity Services client-side flow; the client id is safe to expose to the browser, but avoid committing it to source control.
