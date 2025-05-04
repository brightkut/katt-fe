# Katt Project

 Katt is a simple and easy to use tool for managing your tasks and projects.

### Features
1. You can view all transactions history include filter
2. You can deposit and withdraw money


### Tech Stack
1. [React](https://react.dev/)
2. [Auth0](https://auth0.com/)
3. [React Router](https://reactrouter.com/en/main)
4. [Firebase](https://firebase.google.com/)
5. [GitHub Actions](github.com/features/actions)

### Step to Deploy
1. create github action file in this path `.github/workflows/deploy.yml`

2. create firebase project on firebase console https://console.firebase.google.com/

3. Set environment variable in github action secret

4. Running this command to login to firebase
```bash
firebase login
```

5. Running this command to login to deploy to firebase
```bash
firebase init hosting
```

6. Answer the question like this
```bash
? What do you want to use as your public directory? public
? Configure as a single-page app (rewrite all urls to /index.html)? Yes
? Set up automatic builds and deploys with GitHub? Yes
? File public/index.html already exists. Overwrite? Yes
✔  Wrote public/index.html
? For which GitHub repository would you like to set up a GitHub workflow? (format: user/repository) brightkut/katt-fe

✔  Created service account github-action-976074271 with Firebase Hosting admin permissions.
✔  Uploaded service account JSON to GitHub as secret FIREBASE_SERVICE_ACCOUNT_KATT_B81BD.
i  You can manage your secrets at https://github.com/brightkut/katt-fe/settings/secrets.

? Set up the workflow to run a build script before every deploy? No
? GitHub workflow file for PR previews exists. Overwrite? firebase-hosting-pull-request.yml Yes

✔  Created workflow file /Users/disornthitikornkovit/dev/IdeaProjects/katt-fe/.github/workflows/firebase-hosting-pull-request.yml
? Set up automatic deployment to your site's live channel when a PR is merged? Yes
? What is the name of the GitHub branch associated with your site's live channel? master
? The GitHub workflow file for deploying to the live channel already exists. Overwrite? firebase-hosting-merge.yml Yes

✔  Created workflow file /Users/disornthitikornkovit/dev/IdeaProjects/katt-fe/.github/workflows/firebase-hosting-merge.yml
```

7. After that you can push your code to github and it will automatically deploy to firebase hosting

### Related Backend
- [Katt API](https://github.com/brightkut/katt-be)

### Url Access
 [Katt UI](https://katt-b81bd.firebaseapp.com/)