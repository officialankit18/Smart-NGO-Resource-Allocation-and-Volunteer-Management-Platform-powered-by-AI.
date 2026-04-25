# How to Fix Firebase Storage CORS Error

Your browser is blocking the file upload because of a **CORS (Cross-Origin Resource Sharing)** policy. This happens when you try to upload files from `localhost` (or `127.0.0.1`) to Firebase without explicitly telling Firebase to allow it.

### Step 1: Create a CORS Configuration File
Create a file named `cors.json` in your project folder with this exact content:

```json
[
  {
    "origin": ["*"],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "maxAgeSeconds": 3600
  }
]
```

### Step 2: Apply the Configuration
You need to use the Google Cloud CLI (`gsutil`) to apply this. Open your terminal and run:

1. **Login to your Google account:**
   ```bash
   gcloud auth login
   ```

2. **Set your project:**
   ```bash
   gcloud config set project resource-allocation-ngo
   ```

3. **Apply the CORS settings:**
   ```bash
   gsutil cors set cors.json gs://resource-allocation-ngo.firebasestorage.app
   ```

---

### Alternative: Use the Firebase Console (Quick Fix)
If you don't have the CLI installed, you can try this temporary workaround in your `volunteer-tasks.html` (I have already implemented a more robust error handler for you), but the **permanent fix** is the one above.

**Note:** I have also optimized the code to handle these errors better and provide clearer instructions if the upload fails again.
