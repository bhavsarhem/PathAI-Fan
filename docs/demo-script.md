# PathAI Fan Navigator — Demo Script

Follow this script to demonstrate the core features of the application to the judges.

## 1. Onboarding & Fan Dashboard
1. Open `http://localhost:5173`
2. Show the **Landing Page**. Point out the sleek FIFA 2026 branding and glassmorphism.
3. Click "Start Demo".
4. On the **Auth Screen**, mention passwordless OTP. Click "Use Demo Quick-Fill" and submit.
5. In the **Profile Step**, enter seat `A42` (Zone A). Click "Enter Stadium".
6. The **Fan Dashboard** appears. Highlight the personalized greeting, current match score widget, and the prominent SOS button.

## 2. Seat-Relative Navigation
1. Click **Find My Seat**. Show the stadium wireframe highlighting Zone A and the step-by-step walking directions.
2. Go back. Click **Nearest Washroom**. 
   - Point out that it calculates the distance to `W1` purely based on seat `A42`.
   - Mention the accessibility indicator (wheelchair access).
3. Go back. Click **Parking Locator**.
   - Show the dynamic occupancy bar. If the vehicle is registered, show the confirmation card.

## 3. Emergency & Safety (Fan Side)
1. Click **Women's Safety**.
   - Toggle "Discreet Mode". Explain that this allows fans to call security without an aggressor seeing the screen flash red.
   - Click Send. The screen returns to the dashboard silently.
2. Click **Find Person**. Show the detailed reporting form for a lost child.
3. Click the red **SOS** button in the top right.
   - Select "Medical Emergency". Submit. Show the "Help is on the way" confirmation.

## 4. Stadium Operations (Staff Side)
1. Open a **New Incognito Window** (or log out).
2. Go to `http://localhost:5173/auth` and log in. In the Profile step, change role to **Organizer**.
3. The **Staff Dashboard** appears with different options.
4. Click **Live Crowd Count**.
   - Show the Recharts bar chart updating in real-time (demo data simulates +/- 10 fans every 5 seconds).
   - Point out the color-coding (Red = >90% capacity).
5. Go back. Click **Incident Queue**.
   - Show the medical SOS and Women's safety alerts you just created.
   - Click "Claim" on one of them, then "Resolve".
6. Go back. Click **Emergency Broadcast**.
   - Explain the anti-rush logic: "If an emergency happens, we don't want 80,000 fans rushing Gate 1."
   - Show the deterministic Zone-to-Gate mapping preview.
   - Check the confirmation box and click **Trigger Emergency Broadcast**.

## 5. The Evacuation Experience
1. Switch back to the **Fan Window**.
2. Notice the screen has automatically updated with a red **Emergency Banner**.
3. The fan is instructed to go to **Gate 1** (because they are in Zone A).
4. *(Optional)* Log in as a fan in **Zone F** in a third window. Show that their screen tells them to go to **Gate 7**.
5. Emphasize: **"By assigning different exits to different fans, PathAI eliminates stampede risks. And this is done using deterministic rules, not unpredictable LLMs."**
