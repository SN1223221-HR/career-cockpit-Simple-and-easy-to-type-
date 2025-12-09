# 🚀 Career Cockpit Pro
> **Transform your job hunt from "Management" to "Strategy". An integrated cockpit for engineers to win their next career.**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Google%20Apps%20Script-green.svg)
![Status](https://img.shields.io/badge/status-Stable-brightgreen.svg)

## 📖 Overview
**Career Cockpit Pro** is a comprehensive job hunting support platform built on Google Sheets and Google Apps Script (GAS).

It goes beyond simple application tracking. It serves as a **Decision Support System (DSS)** designed for engineers, featuring **KPI reverse-engineering**, **real-time interview assistance**, and **weighted offer comparison**. This tool helps you make data-driven decisions for your career investment.

## ✨ Key Features

### 1. 📊 Strategic KPI Dashboard
* **Reverse Engineering:** Set your target date (KGI) and desired number of offers. The system calculates the "Required Number of Applications" based on market conversion rates.
* **Visual Gap Analysis:** Instantly visualize how many more applications you need to meet your goal.

### 2. 🗓 Smart Scheduler
* **Automated Slot Detection:** Scans your Google Calendar to find free slots within a specified range (e.g., "Next Wed-Fri").
* **One-Click Formatting:** Generates a professional business email text with available dates ready to copy and paste.

### 3. 🎙 Interview Cockpit (Live Assistant)
* **Cheat Sheet:** Displays your "Reasons for changing jobs" and "Company-specific motivations" in a sidebar during the interview.
* **Speaking Timer:** Real-time calculation of how many minutes your answer will take (based on character count).
* **Live Minutes:** A chat-like interface to log "Questions Asked" and "Your Answers" during the interview. Saves structured data for review.

### 4. 📥 Structured Data Import
* Simply input the Job URL and Company Name.
* Input details like "Job Description" and "Required Skills" via the form, and the system automatically formats and saves them to your Preparation Sheet.

### 5. ⚖️ Offer Comparison Matrix
* **Quantitative Decision Making:** Input offer details (Salary, Remote Work policy, Tech Stack, etc.).
* **Weighted Scoring:** Calculates a "Total Score" based on your personal weightings for each category, preventing emotional bias when choosing between multiple offers.

## 🛠 Tech Stack
* **Backend:** Google Apps Script (ES6+)
* **Frontend:** HTML5, Bootstrap 5 (Sidebar UI)
* **Database:** Google Spreadsheet
* **Architecture:** MVC-like separation (Service / Controller / Repository pattern)

## 📦 Installation

1.  **Create a Spreadsheet**
    * Create a new Google Spreadsheet.

2.  **Install Scripts**
    * Open `Extensions` > `Apps Script`.
    * Copy and paste all files from the `src/` directory of this repository into the script editor.
    * *Note: Filenames like `1_Config.gs` are recommended for organization.*

3.  **Initial Setup**
    * Reload the Spreadsheet. You will see a new menu: **"⚡ Career Menu"**.
    * Run `⚙️ Initial Setup`. This will automatically generate all necessary sheets (Main, Tasks, Prep, Minutes, Offers, Settings).

4.  **Configuration**
    * Open the generated `Settings` sheet.
    * Customize your parameters: "Reason for Change," "KPI Targets," and "Offer Comparison Weights."

## 📖 Usage Workflow

### Phase 1: Preparation
1.  Open the **"📥 Register"** tab in the sidebar.
2.  Import job details.
3.  Switch to the **"📝 Prep"** tab to draft your motivation and questions (use the timer!).

### Phase 2: Scheduling
1.  Open the **"🗓 Schedule"** tab.
2.  Set your available dates (From/To) and duration.
3.  Copy the generated list of available slots and send it to the recruiter.

### Phase 3: The Interview
1.  Open the sidebar alongside your video call (Zoom/Meet).
2.  Use the **"🎙 Live"** tab. Refer to your cheat sheet while speaking.
3.  Log Q&A in real-time and save the minutes after the call.

### Phase 4: Decision
1.  Once you receive an offer, open the **"⚖️ Offer"** tab.
2.  Input the conditions.
3.  Check the "Offer Ranking" to see which company objectively matches your criteria best.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
