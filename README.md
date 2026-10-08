# Chandra Prakash Reddy — AWS DevOps Portfolio

Premium dark-theme React/Vite personal portfolio. Personalized using the uploaded resume (October 2026) and GitHub profile `prakashreddy7799`.

## Start in VS Code

Requires Node.js 20.19+ and Git.

```bash
npm install
npm run dev
```

Visit the local URL printed by Vite, generally http://localhost:5173.

## Check production build

```bash
npm run build
npm run preview
```

## Edit content

- All personal details, skill groups, client experience, and projects: `src/content.js`
- Design and responsive CSS: `src/styles.css`
- Layout and site interactions: `src/main.jsx`
- Resume download: `public/resume.pdf`
- Deployment settings: `netlify.toml`

**Privacy:** Resume contains a personal phone number and email and is publicly downloadable once published. Remove the phone number from the PDF if you do not want it publicly exposed. Do not publish client code, AWS credentials, architecture secrets, or confidential information.

**Accuracy:** Review the professional project claims and LinkedIn URL before publishing. The resume provides the project achievements shown; the GitHub links point to the overall account, not to unverified individual project repos. The AWS DevOps Professional certification is accurately labeled *In preparation*.

## Push to GitHub

Create an empty GitHub repo named `aws-devops-portfolio` under `prakashreddy7799` (no README/.gitignore when creating, as included here). In the VS Code terminal:

```bash
git init
git add .
git commit -m "Launch personal DevOps portfolio"
git branch -M main
git remote add origin https://github.com/prakashreddy7799/aws-devops-portfolio.git
git push -u origin main
```

## Deploy on Netlify

1. Sign into https://app.netlify.com/ with GitHub.
2. Add new project → Import existing project → GitHub.
3. Select `prakashreddy7799/aws-devops-portfolio`.
4. Configure branch `main`, build command `npm run build`, publish directory `dist`.
5. Deploy and choose an available `.netlify.app` subdomain.

Netlify reads the included `netlify.toml`, and new pushes to main can trigger automatic builds and deployments. The free tier is subject to usage limits.
