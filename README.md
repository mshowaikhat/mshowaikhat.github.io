# mshowaikhat.github.io

Personal portfolio. Static HTML/CSS/JS — no build step.

## Local preview

Just open `index.html` in a browser, or serve it:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Deploy to GitHub Pages

GitHub serves any repo named `<username>.github.io` from the **root of `main`** automatically — no Pages settings to flip, no build step, no Actions.

```bash
cd C:\Users\mhm14\projects\portfolio
git init -b main
git add .
git commit -m "Initial portfolio"
```

Create the repo on GitHub (must be named **exactly** `mshowaikhat.github.io`):

- Go to https://github.com/new
- Repository name: `mshowaikhat.github.io`
- Public
- **Do NOT** check "Add a README" (we already have one)
- Create

Then push:

```bash
git remote add origin https://github.com/mshowaikhat/mshowaikhat.github.io.git
git push -u origin main
```

Site is live at **https://mshowaikhat.github.io** within ~1 minute. Subsequent edits just need `git add . && git commit -m "..." && git push`.

## Updating content

Everything is in three files:

- `index.html` — content (sections, project cards, links)
- `styles.css` — all styling (CSS variables at the top control the palette)
- `script.js` — nav scroll state, scroll reveals, mobile menu

To change the accent color, edit `--accent` in `styles.css:8`.

To add a project, copy any `<article class="project-card">` block in `index.html` and edit it.

## Custom domain (optional, later)

If you ever buy a domain (e.g. `showaikhat.dev`):

1. Add a `CNAME` file at the root containing your domain (one line, no protocol)
2. In your DNS, point `A` records to GitHub Pages IPs (185.199.108.153 etc.) or `CNAME` your apex/`www` to `mshowaikhat.github.io`
3. In repo Settings → Pages, set the custom domain and enable "Enforce HTTPS"
