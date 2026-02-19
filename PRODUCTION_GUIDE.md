# How to Deploy Project O to a Real Website

This guide explains how to transition your application from `localhost` to a live production environment.

## 1. Environment Configuration
We have refactored the code to use **Environment Variables** for API connections.
- **Local Development**: Uses `.env` file where `VITE_API_URL=http://localhost:3000`.
- **Production**: You will set this variable in your hosting provider's dashboard.

## 2. Frontend Deployment (Vue.js)

### Build the Project
Run the following command to compile your Vue application:
```bash
npm run build
```
This creates a `dist` folder containing optimized HTML, CSS, and JavaScript.

### Hosting Options
You can host the `dist` folder on:
- **Netlify / Vercel** (Recommended): Drag and drop the `dist` folder or connect your Git repository.
  - **Important**: Set the Environment Variable `VITE_API_URL` to your live backend URL (e.g., `https://my-api.herokuapp.com`).
- **Nginx / Apache**: Copy `dist` contents to your web server root.

## 3. Backend Deployment (Node.js/Express)

### Prepare the Server
1. Ensure your Production DB is ready (e.g., MongoDB Atlas).
2. Set Environment Variables on your server:
   - `PORT`: 3000 (or provided by host)
   - `DB_URI`: Your MongoDB connection string
   - `CORS_ORIGIN`: Your Frontend Domain (e.g., `https://my-website.com`) - *You may need to update `index.ts` to allow this origin.*

### Hosting Options
- **Render / Railway / Heroku**: Connect your Git repo. They will automatically detect `package.json` and run `npm start`.
- **Cloud VPS (DigitalOcean/AWS)**: Use `pm2` to keep the server running:
  ```bash
  npm install -g pm2
  pm2 start dist/index.js --name "backend"
  ```

## 4. Updates Made
We have updated the following files to be production-ready:
- `src/api/TaskAPI.js`
- `src/components/SignInView.vue`
- `src/components/DashboardView.vue`
- `src/components/EmployeeDashboardView.vue`
- `src/components/ProjectListView.vue`
- `src/components/CreateProjectModal.vue`
- `src/components/RegistrationForm.vue`

All direct calls to `localhost:3000` have been replaced with `${import.meta.env.VITE_API_URL}`.
