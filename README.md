# Valentine Proposal Site 💕

A simple, responsive Valentine proposal website that works on both PC and mobile.

## Host on GitHub Pages

1. Create a new repository on GitHub (e.g. `Chandan_Divya` or `valentine-proposal`).
2. Upload all project files (index.html, proposal.html, success.html, crying.html, proposal.js, styles.css, and assets: background.jpeg, letter.gif, tt.gif).
3. Go to **Settings** → **Pages**.
4. Under **Source**, choose **Deploy from a branch**.
5. Select branch **main** (or **master**) and folder **/ (root)**. Save.
6. Your site will be live at: `https://<username>.github.io/<repo-name>/`

Use **index.html** as the entry point. All links are relative, so they work on GitHub Pages.

## Flow

- **index.html** → Open Letter → **proposal.html**
- **proposal.html** → Yes → "Are you Sure?" overlay → Yes → **success.html** | No → **crying.html**
- **crying.html** → "Try again?" → **proposal.html**

## Responsive

- Viewport and touch-friendly buttons for mobile.
- Layout and fonts scale with `clamp()` and media queries for different screen sizes.
