# Welcome to my Savia - A mobile app for tracking and analyzing daily expenses.👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Setup Google Sheets and App script Api
2.1 Create a new Google Sheet and name the tab (e.g., Savia)
In the first row, add the following column headers:
   ```bash
   Date,	Time,	Amount,	Category,	Type,	Description,	Payment Method,	Note
   ```
2.2 Set up Google Apps Script API
Open the Google Sheet and go to Extensions > Apps Script
Delete the default code and replace it with the code from AppScript.txt
   ```bash
   Note:
   Replace EDIT_HERE1 and EDIT_HERE3 with your Google Spreadsheet ID (found in the sheet's URL).
   Replace EDIT_HERE2 and EDIT_HERE4 with your Sheet name (e.g., "Savia").
   ```

3. Start the app

   ```bash
   npx expo start
   ```

4. Export into .apk, .aab ect.
   ```bash
   npx expo login
   npx eas build -p android --profile preview
   ```

## Otherwise e.g. missing some library: Ask ChatGPT