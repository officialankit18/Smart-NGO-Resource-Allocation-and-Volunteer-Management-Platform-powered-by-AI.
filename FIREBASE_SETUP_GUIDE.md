# Firebase Setup Guide For This Repo

This guide explains exactly how to move this project from your friend's Firebase project to your own Firebase project.

It is written specifically for this repo.

## 1. What Actually Needs To Change

In this repo, almost all Firebase pages load the shared file:

- `firebase.js`

That means:

- you do **not** need to replace Firebase credentials in every HTML file
- you mainly need to replace the config object in `firebase.js`
- then you must create and enable the required Firebase services in your own Firebase Console

Current config location:

- [firebase.js](<C:/Semester 6th/dummy/Resource-Allocation-NGO--main/Resource-Allocation-NGO--main/firebase.js:8>)

Current Firebase initialization:

- [firebase.js](<C:/Semester 6th/dummy/Resource-Allocation-NGO--main/Resource-Allocation-NGO--main/firebase.js:18>)

## 2. Important First Clarification

The Firebase web config values like `apiKey`, `authDomain`, and `projectId` identify your Firebase project. For Firebase web apps, these values are generally not treated as secrets. Firebase's official docs say authorization is handled separately using IAM, Security Rules, or App Check, and that Firebase API keys are usually okay to include in code.

Source:

- Firebase API keys doc: https://firebase.google.com/docs/projects/api-keys

So the real ownership move is:

1. create your own Firebase project
2. connect this repo to that project
3. enable the required services
4. secure the database and storage with rules

## 3. Repo Features That Depend On Firebase

This repo currently uses:

- Firebase Auth
- Cloud Firestore
- Cloud Storage
- optionally Google Analytics in the config

Features already wired in code:

- Email/password sign-up in [auth.js](<C:/Semester 6th/dummy/Resource-Allocation-NGO--main/Resource-Allocation-NGO--main/auth.js:24>)
- Email/password login in [login.js](<C:/Semester 6th/dummy/Resource-Allocation-NGO--main/Resource-Allocation-NGO--main/login.js:52>)
- Google sign-in in [login.js](<C:/Semester 6th/dummy/Resource-Allocation-NGO--main/Resource-Allocation-NGO--main/login.js:96>)
- Password reset in [login.js](<C:/Semester 6th/dummy/Resource-Allocation-NGO--main/Resource-Allocation-NGO--main/login.js:202>)
- Shared Firestore/Auth/Storage bootstrap in [firebase.js](<C:/Semester 6th/dummy/Resource-Allocation-NGO--main/Resource-Allocation-NGO--main/firebase.js:19>)

## 4. Step-By-Step Setup In Firebase Console

Official setup references:

- Add Firebase to web app: https://firebase.google.com/docs/web/setup
- Firebase Auth web: https://firebase.google.com/docs/auth/web/start
- Email/password auth: https://firebase.google.com/docs/auth/web/password-auth
- Google sign-in: https://firebase.google.com/docs/auth/web/google-signin
- Firestore quickstart: https://firebase.google.com/docs/firestore/quickstart
- Cloud Storage quickstart: https://firebase.google.com/docs/storage/web/start

### Step 4.1: Create your own Firebase project

In Firebase Console:

1. Open https://console.firebase.google.com/
2. Click `Create a project`
3. Give it your own project name
4. Keep or skip Google Analytics, your choice
5. Finish project creation

Firebase's web setup doc says to first create a Firebase project and then register your web app.

### Step 4.2: Register this repo as a Web App

In your new Firebase project:

1. Go to Project Overview
2. Click the `Web` icon `</>`
3. Enter any nickname, for example:
   - `ngo-resource-web`
4. Click `Register app`
5. Firebase will show a config object

Firebase docs reference:

- `Step 1: Create a Firebase project and register your app`
- `Register your app`

Source:

- https://firebase.google.com/docs/web/setup

### Step 4.3: Copy your new Firebase config

Firebase will give you something like:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

Now replace the old values in:

- [firebase.js](<C:/Semester 6th/dummy/Resource-Allocation-NGO--main/Resource-Allocation-NGO--main/firebase.js:8>)

Replace these exact lines:

- [firebase.js:9](<C:/Semester 6th/dummy/Resource-Allocation-NGO--main/Resource-Allocation-NGO--main/firebase.js:9>)
- [firebase.js:10](<C:/Semester 6th/dummy/Resource-Allocation-NGO--main/Resource-Allocation-NGO--main/firebase.js:10>)
- [firebase.js:11](<C:/Semester 6th/dummy/Resource-Allocation-NGO--main/Resource-Allocation-NGO--main/firebase.js:11>)
- [firebase.js:12](<C:/Semester 6th/dummy/Resource-Allocation-NGO--main/Resource-Allocation-NGO--main/firebase.js:12>)
- [firebase.js:13](<C:/Semester 6th/dummy/Resource-Allocation-NGO--main/Resource-Allocation-NGO--main/firebase.js:13>)
- [firebase.js:14](<C:/Semester 6th/dummy/Resource-Allocation-NGO--main/Resource-Allocation-NGO--main/firebase.js:14>)
- [firebase.js:15](<C:/Semester 6th/dummy/Resource-Allocation-NGO--main/Resource-Allocation-NGO--main/firebase.js:15>)

## 5. Authentication Setup

This repo needs the following sign-in methods:

- Email/Password
- Google
- Password Reset Email

### Step 5.1: Enable Email/Password

In Firebase Console:

1. Open `Authentication`
2. Go to `Sign-in method`
3. Enable `Email/Password`
4. Click `Save`

Official doc:

- https://firebase.google.com/docs/auth/web/password-auth

That is required because the repo uses:

- `createUserWithEmailAndPassword(...)`
- `signInWithEmailAndPassword(...)`

### Step 5.2: Enable Google Sign-In

In Firebase Console:

1. Open `Authentication`
2. Go to `Sign-in method`
3. Enable `Google`
4. Choose your support email
5. Save

Official doc:

- https://firebase.google.com/docs/auth/web/google-signin

That is required because the repo already uses:

- [login.js:96](<C:/Semester 6th/dummy/Resource-Allocation-NGO--main/Resource-Allocation-NGO--main/login.js:96>)

### Step 5.3: Authorized Domains

Google popup login can fail with:

- `auth/unauthorized-domain`

You already handle that case here:

- [login.js:121](<C:/Semester 6th/dummy/Resource-Allocation-NGO--main/Resource-Allocation-NGO--main/login.js:121>)

So in Firebase Console:

1. Open `Authentication`
2. Open `Settings`
3. Add domains you use for testing and hosting

Add at least:

- `localhost`
- `127.0.0.1`

If you deploy later, also add:

- your custom domain
- your Firebase Hosting domain if you use Hosting

Important:

- ports usually don't matter here
- `localhost:5502` still needs `localhost`
- `127.0.0.1:5502` still needs `127.0.0.1`

Official Google sign-in doc also says custom domains must be added to authorized domains.

## 6. Firestore Setup

This repo uses Firestore heavily.

Main collections used by code:

- `users`
- `ngos`
- `volunteers`
- `citizens`
- `requests`
- `tasks`
- `emergencies`

### Step 6.1: Create Firestore database

In Firebase Console:

1. Open `Firestore Database`
2. Click `Create database`
3. Choose a region close to you
4. Start in:
   - `Production mode` if you want safer defaults
   - or `Test mode` only for quick temporary testing

Official doc:

- https://firebase.google.com/docs/firestore/quickstart

### Step 6.2: Recommended Firestore location

Pick one region and keep it. Good choices are usually:

- nearest to your expected users
- same region mindset as Storage

Do not randomly choose because moving later is not simple.

### Step 6.3: Firestore data will be auto-created by the app

You do not need to manually create collections first.

The app will auto-create them when users register or actions happen:

- user registration creates `users` and role-specific docs
- issue reports create `requests`
- task creation creates `tasks`
- emergency reporting creates `emergencies`

## 7. Storage Setup

This repo uploads:

- issue proof images
- volunteer proof uploads
- profile images

Storage usage in code:

- [report-issue.html:251](<C:/Semester 6th/dummy/Resource-Allocation-NGO--main/Resource-Allocation-NGO--main/report-issue.html:251>)
- [volunteer-tasks.html:440](<C:/Semester 6th/dummy/Resource-Allocation-NGO--main/Resource-Allocation-NGO--main/volunteer-tasks.html:440>)
- [firebase.js:21](<C:/Semester 6th/dummy/Resource-Allocation-NGO--main/Resource-Allocation-NGO--main/firebase.js:21>)

### Step 7.1: Create Storage bucket

In Firebase Console:

1. Open `Storage`
2. Click `Get started`
3. Choose bucket location
4. Finish

Official doc:

- https://firebase.google.com/docs/storage/web/start

Important official note:

- Firebase docs currently say Cloud Storage for Firebase requires the `Blaze` pay-as-you-go plan

Source:

- https://firebase.google.com/docs/storage/web/start

So if Storage setup asks you to upgrade, that is expected.

## 8. Exact Code Change You Need In This Repo

You mainly change only this one file:

- [firebase.js](<C:/Semester 6th/dummy/Resource-Allocation-NGO--main/Resource-Allocation-NGO--main/firebase.js:8>)

### Replace this block

```js
const firebaseConfig = {
  apiKey: "OLD_KEY",
  authDomain: "OLD_PROJECT.firebaseapp.com",
  projectId: "OLD_PROJECT_ID",
  storageBucket: "OLD_PROJECT.firebasestorage.app",
  messagingSenderId: "OLD_SENDER_ID",
  appId: "OLD_APP_ID",
  measurementId: "OLD_MEASUREMENT_ID"
};
```

### With your new config block

```js
const firebaseConfig = {
  apiKey: "YOUR_NEW_KEY",
  authDomain: "YOUR_NEW_PROJECT.firebaseapp.com",
  projectId: "YOUR_NEW_PROJECT_ID",
  storageBucket: "YOUR_NEW_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_NEW_SENDER_ID",
  appId: "YOUR_NEW_APP_ID",
  measurementId: "YOUR_NEW_MEASUREMENT_ID"
};
```

You do **not** need to edit every HTML page because all pages depend on `firebase.js`.

## 9. Firestore Rules

This app reads data across roles:

- NGOs read volunteer and request data
- volunteers read task data
- citizens create request data
- some pages read all users

So rules must be planned carefully.

### Option A: Quick development rules

Use this only while testing your own setup. Do **not** leave this in production.

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Warning:

- this blocks anonymous writes
- your landing-page emergency form allows anonymous emergency creation in code
- so if you keep this rule, emergency creation should be tested while logged in

### Option B: Better starter rules for this repo

Paste into Firestore Rules:

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function signedIn() {
      return request.auth != null;
    }

    function myUserDoc() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid));
    }

    function myRole() {
      return signedIn() && myUserDoc().exists() ? myUserDoc().data.role : null;
    }

    function isNGO() {
      return myRole() == "ngo";
    }

    function isVolunteer() {
      return myRole() == "volunteer";
    }

    function isCitizen() {
      return myRole() == "citizen";
    }

    match /users/{uid} {
      allow create: if signedIn() && request.auth.uid == uid;
      allow read: if signedIn();
      allow update: if signedIn() && (request.auth.uid == uid || isNGO());
      allow delete: if false;
    }

    match /ngos/{uid} {
      allow create, update, read: if signedIn() && (request.auth.uid == uid || isNGO());
      allow delete: if false;
    }

    match /volunteers/{uid} {
      allow create, update, read: if signedIn() && (request.auth.uid == uid || isNGO());
      allow delete: if false;
    }

    match /citizens/{uid} {
      allow create, update, read: if signedIn() && (request.auth.uid == uid || isNGO());
      allow delete: if false;
    }

    match /requests/{id} {
      allow create: if signedIn();
      allow read: if signedIn();
      allow update: if isNGO();
      allow delete: if false;
    }

    match /tasks/{id} {
      allow create: if isNGO();
      allow read: if signedIn();
      allow update: if isNGO() || (isVolunteer() && resource.data.assignedTo == request.auth.uid);
      allow delete: if false;
    }

    match /emergencies/{id} {
      allow create: if true;
      allow read: if signedIn();
      allow update: if isNGO();
      allow delete: if false;
    }
  }
}
```

Note:

- `allow create: if true` for `emergencies` is only there because `index.js` currently allows anonymous emergency submissions
- if you want safer rules, change the code later so emergency reporting also requires login

Official rules background:

- https://firebase.google.com/docs/firestore/security/get-started
- https://firebase.google.com/docs/firestore/security/rules-conditions

## 10. Storage Rules

Starter Storage rules for this repo:

```txt
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /requests/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }

    match /proofs/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }

    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

This is a safer default for this app.

If you want public/anonymous issue uploads, then rules must be loosened, but that is less safe.

Official rules background:

- https://firebase.google.com/docs/storage/security/get-started

## 11. Firestore Indexes You May Need

This app has some queries that often trigger composite index requirements.

Likely indexes:

### `requests`

- `status` ascending
- `createdAt` descending

Because of:

- [ngo-dashboard.html:444](<C:/Semester 6th/dummy/Resource-Allocation-NGO--main/Resource-Allocation-NGO--main/ngo-dashboard.html:444>)

### `emergencies`

- `status` ascending
- `reportedAt` descending

Because of:

- [ngo-dashboard.html:465](<C:/Semester 6th/dummy/Resource-Allocation-NGO--main/Resource-Allocation-NGO--main/ngo-dashboard.html:465>)
- [volunteer-dashboard.html:448](<C:/Semester 6th/dummy/Resource-Allocation-NGO--main/Resource-Allocation-NGO--main/volunteer-dashboard.html:448>)

### `tasks`

- `status` ascending
- `createdAt` descending

Because of:

- [ngo-dashboard.html:417](<C:/Semester 6th/dummy/Resource-Allocation-NGO--main/Resource-Allocation-NGO--main/ngo-dashboard.html:417>)
- [volunteer-dashboard.html:466](<C:/Semester 6th/dummy/Resource-Allocation-NGO--main/Resource-Allocation-NGO--main/volunteer-dashboard.html:466>)

### `tasks`

- `assignedTo` ascending
- `status` ascending

Because of:

- [volunteer-tasks.html:508](<C:/Semester 6th/dummy/Resource-Allocation-NGO--main/Resource-Allocation-NGO--main/volunteer-tasks.html:508>)
- [volunteer-tasks.html:534](<C:/Semester 6th/dummy/Resource-Allocation-NGO--main/Resource-Allocation-NGO--main/volunteer-tasks.html:534>)

Good news:

- if an index is missing, Firestore usually throws an error with a direct link to create that index
- the easiest path is often to click that link once during testing

## 12. What Will Not Automatically Come Over From Your Friend's Project

Switching config to your own Firebase project does **not** migrate old data automatically.

That means these old things stay in your friend's project unless you export/import them:

- old registered users
- old Firestore data
- old uploaded Storage files
- old analytics data

If you do not have access to your friend's Firebase project:

- just start fresh with a clean database
- create new accounts in your own project

If you do have access and want migration:

- export Firestore data from the old project
- export Storage files from the old bucket
- optionally import auth users using Firebase Auth export/import tools

That migration is a separate task from simply replacing the config.

## 13. Local Testing Checklist

After setup, test in this order:

### Test 1: Firebase init

1. Start Live Server
2. Open `index.html`
3. Open browser console
4. Make sure there is no Firebase init error

### Test 2: Registration

1. Open NGO registration
2. Register a new NGO account
3. Check Firestore:
   - `users`
   - `ngos`

Then repeat for:

- volunteer
- citizen

### Test 3: Login

1. Test email/password login
2. Test Google login
3. Test forgot password

### Test 4: Citizen report

1. Login as citizen
2. Open `report-issue.html`
3. Submit a report
4. Check Firestore `requests`

### Test 5: NGO task management

1. Login as NGO
2. Open dashboard
3. Verify requests load
4. Create a task
5. Check Firestore `tasks`

### Test 6: Volunteer flow

1. Login as volunteer
2. Accept an open task
3. Upload proof
4. Check:
   - Firestore `tasks`
   - Storage `proofs/...`

### Test 7: Emergency

1. From landing page, submit emergency
2. Check Firestore `emergencies`
3. Check if NGO and volunteer dashboards show it

## 14. Common Problems And Their Meaning

### `auth/unauthorized-domain`

Meaning:

- your domain is not in Firebase Auth authorized domains

Fix:

- add `localhost` and `127.0.0.1` in Auth settings

### `Missing or insufficient permissions`

Meaning:

- Firestore or Storage rules are blocking your request

Fix:

- update rules
- verify the user is logged in
- verify your rule matches the collection/path being used

### `The query requires an index`

Meaning:

- Firestore composite index is missing

Fix:

- click the auto-generated index link from the error

### `storage/unauthorized`

Meaning:

- Storage rules blocked the upload

Fix:

- update Storage rules
- verify the user is authenticated

### `Firebase: Error (auth/popup-blocked)`

Meaning:

- browser blocked Google sign-in popup

Fix:

- allow popups and retry

## 15. Minimal Change Summary

If you want the shortest possible version:

1. Create your own Firebase project
2. Register a web app
3. Replace config in [firebase.js](<C:/Semester 6th/dummy/Resource-Allocation-NGO--main/Resource-Allocation-NGO--main/firebase.js:8>)
4. Enable Auth:
   - Email/Password
   - Google
5. Add authorized domains:
   - `localhost`
   - `127.0.0.1`
6. Create Firestore
7. Create Storage
8. Add Firestore rules and Storage rules
9. Test registration, login, report, task creation, proof upload
10. Create indexes if Firestore asks

## 16. If You Want Me To Finish The Code Side For You

I can do the next step for you too.

If you send me your new Firebase config object, I can:

1. replace the old config in `firebase.js`
2. add cleaner comments
3. optionally create ready-to-paste Firestore and Storage rule files
4. optionally prepare a safer production version with role-based rules and fewer anonymous writes

