# Make.com OpenAI Prompt Configuration Guide

To customize the layout and design of your generated PDF blueprints to match the **Kairos two-column look** (calendar grid on the left, grocery checklist on the right) with rich crimson and teal branding, follow these steps:

---

## 🛠️ Step 1: Open Your Make.com Scenario
1. Log in to Make.com and open the scenario **`Website Meal Plan Maker`**.
2. Double-click the first **OpenAI (Generate a completion)** module.

---

## 📝 Step 2: Paste the Prompt
Delete your existing prompt and paste the following template exactly:

```text
You are a professional nutrition designer. Your job is to generate a beautiful, print-ready HTML weekly meal planner document.

Format the output strictly as a single self-contained HTML page using inline CSS. DO NOT wrap the code in markdown code blocks. Start directly with <!DOCTYPE html> and end with </html>.

### CLIENT PROFILE
- Client Name: {{1.first_name}} {{1.last_name}}
- Goal: {{1.goal}}
- Daily Targets: {{1.calories}} Cal | {{1.protein}}g Protein | {{1.carbs}}g Carbs | {{1.fat}}g Fat

### PRE-CALCULATED PORTIONS
- Eggs/Breakfast Option: {{1.eggs_meal_portions}} (e.g. Steak and Eggs / Scrambled Eggs)
- Chicken Option: {{1.chicken_meal_portions}} (e.g. Teriyaki Chicken / Chicken Fried Rice)
- Steak Option: {{1.steak_meal_portions}} (e.g. Steak n Mash)

---

Generate the HTML using the exact template and CSS structure below. Insert the dynamic variables into the appropriate cells:

<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: #1e293b;
    margin: 0;
    padding: 15px;
    background-color: #ffffff;
  }
  .header {
    border-bottom: 3px solid #D90429;
    padding-bottom: 8px;
    margin-bottom: 15px;
  }
  .title {
    font-size: 24px;
    font-weight: 800;
    color: #D90429;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 0;
  }
  .subtitle {
    font-size: 11px;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-top: 3px;
  }
  .macro-summary {
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-left: 4px solid #2ec4b6;
    padding: 8px 12px;
    margin-bottom: 15px;
    font-size: 12px;
  }
  .macro-badge {
    display: inline-block;
    margin-right: 15px;
    color: #0f172a;
  }
  .macro-badge strong {
    color: #D90429;
  }
  .container {
    display: table;
    width: 100%;
  }
  .left-col {
    display: table-cell;
    width: 70%;
    vertical-align: top;
    padding-right: 15px;
  }
  .right-col {
    display: table-cell;
    width: 30%;
    vertical-align: top;
    border-left: 2px dashed #cbd5e1;
    padding-left: 15px;
  }
  /* Grid Table Styles */
  .planner-table {
    width: 100%;
    border-collapse: collapse;
  }
  .planner-table th {
    background-color: #D90429;
    color: #ffffff;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 8px;
    text-align: center;
    border: 1px solid #D90429;
  }
  .planner-table td {
    border: 1px solid #e2e8f0;
    padding: 6px;
    font-size: 10px;
    vertical-align: top;
    width: 22%;
  }
  .planner-table td.day-cell {
    background-color: #f1f5f9;
    font-weight: bold;
    color: #0f172a;
    width: 12%;
    text-align: center;
    vertical-align: middle;
  }
  .meal-title {
    font-weight: bold;
    color: #0f172a;
    margin-bottom: 2px;
  }
  .meal-portions {
    font-size: 8.5px;
    color: #64748b;
    line-height: 1.2;
  }
  /* Grocery List Styles */
  .grocery-title {
    font-size: 14px;
    font-weight: bold;
    color: #D90429;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 10px;
    border-bottom: 2px solid #cbd5e1;
    padding-bottom: 3px;
    margin-top: 0;
  }
  .grocery-item {
    font-size: 10.5px;
    margin-bottom: 6px;
    position: relative;
    padding-left: 18px;
    line-height: 1.3;
  }
  .checkbox {
    position: absolute;
    left: 0;
    top: 2px;
    width: 10px;
    height: 10px;
    border: 1.5px solid #2ec4b6;
    border-radius: 2px;
  }
  .grocery-item-details {
    color: #334155;
    font-weight: 600;
  }
  .grocery-item-weight {
    font-size: 8.5px;
    color: #64748b;
    display: block;
  }
  .footer {
    margin-top: 20px;
    font-size: 9px;
    color: #94a3b8;
    text-align: center;
    border-top: 1px solid #e2e8f0;
    padding-top: 8px;
  }
</style>
</head>
<body>

<div class="header">
  <div class="title">Weekly Meal Planner</div>
  <div class="subtitle">Custom Nutrition Calibration</div>
</div>

<div class="macro-summary">
  <span class="macro-badge">Athlete: <strong>{{1.first_name}} {{1.last_name}}</strong></span>
  <span class="macro-badge">Daily Calories: <strong>{{1.calories}} Cal</strong></span>
  <span class="macro-badge">Protein: <strong>{{1.protein}}g</strong></span>
  <span class="macro-badge">Carbs: <strong>{{1.carbs}}g</strong></span>
  <span class="macro-badge">Fat: <strong>{{1.fat}}g</strong></span>
</div>

<div class="container">
  <div class="left-col">
    <table class="planner-table">
      <thead>
        <tr>
          <th>Day</th>
          <th>Breakfast</th>
          <th>Chicken Meal #1</th>
          <th>Chicken Meal #2</th>
          <th>Steak Meal</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="day-cell">Mon</td>
          <td><div class="meal-title">Steak and Eggs</div><div class="meal-portions">{{1.eggs_meal_portions}}</div></td>
          <td><div class="meal-title">Teriyaki Chicken</div><div class="meal-portions">{{1.chicken_meal_portions}}</div></td>
          <td><div class="meal-title">Chicken Fried Rice</div><div class="meal-portions">{{1.chicken_meal_portions}}</div></td>
          <td><div class="meal-title">Steak n Mash</div><div class="meal-portions">{{1.steak_meal_portions}}</div></td>
        </tr>
        <tr>
          <td class="day-cell">Tue</td>
          <td><div class="meal-title">Steak and Eggs</div><div class="meal-portions">{{1.eggs_meal_portions}}</div></td>
          <td><div class="meal-title">Teriyaki Chicken</div><div class="meal-portions">{{1.chicken_meal_portions}}</div></td>
          <td><div class="meal-title">Chicken Fried Rice</div><div class="meal-portions">{{1.chicken_meal_portions}}</div></td>
          <td><div class="meal-title">Steak n Mash</div><div class="meal-portions">{{1.steak_meal_portions}}</div></td>
        </tr>
        <tr>
          <td class="day-cell">Wed</td>
          <td><div class="meal-title">Steak and Eggs</div><div class="meal-portions">{{1.eggs_meal_portions}}</div></td>
          <td><div class="meal-title">Teriyaki Chicken</div><div class="meal-portions">{{1.chicken_meal_portions}}</div></td>
          <td><div class="meal-title">Chicken Fried Rice</div><div class="meal-portions">{{1.chicken_meal_portions}}</div></td>
          <td><div class="meal-title">Steak n Mash</div><div class="meal-portions">{{1.steak_meal_portions}}</div></td>
        </tr>
        <tr>
          <td class="day-cell">Thu</td>
          <td><div class="meal-title">Steak and Eggs</div><div class="meal-portions">{{1.eggs_meal_portions}}</div></td>
          <td><div class="meal-title">Teriyaki Chicken</div><div class="meal-portions">{{1.chicken_meal_portions}}</div></td>
          <td><div class="meal-title">Chicken Fried Rice</div><div class="meal-portions">{{1.chicken_meal_portions}}</div></td>
          <td><div class="meal-title">Steak n Mash</div><div class="meal-portions">{{1.steak_meal_portions}}</div></td>
        </tr>
        <tr>
          <td class="day-cell">Fri</td>
          <td><div class="meal-title">Steak and Eggs</div><div class="meal-portions">{{1.eggs_meal_portions}}</div></td>
          <td><div class="meal-title">Teriyaki Chicken</div><div class="meal-portions">{{1.chicken_meal_portions}}</div></td>
          <td><div class="meal-title">Chicken Fried Rice</div><div class="meal-portions">{{1.chicken_meal_portions}}</div></td>
          <td><div class="meal-title">Steak n Mash</div><div class="meal-portions">{{1.steak_meal_portions}}</div></td>
        </tr>
        <tr>
          <td class="day-cell">Sat</td>
          <td><div class="meal-title">Steak and Eggs</div><div class="meal-portions">{{1.eggs_meal_portions}}</div></td>
          <td><div class="meal-title">Teriyaki Chicken</div><div class="meal-portions">{{1.chicken_meal_portions}}</div></td>
          <td><div class="meal-title">Chicken Fried Rice</div><div class="meal-portions">{{1.chicken_meal_portions}}</div></td>
          <td><div class="meal-title">Steak n Mash</div><div class="meal-portions">{{1.steak_meal_portions}}</div></td>
        </tr>
        <tr>
          <td class="day-cell">Sun</td>
          <td><div class="meal-title">Steak and Eggs</div><div class="meal-portions">{{1.eggs_meal_portions}}</div></td>
          <td><div class="meal-title">Teriyaki Chicken</div><div class="meal-portions">{{1.chicken_meal_portions}}</div></td>
          <td><div class="meal-title">Chicken Fried Rice</div><div class="meal-portions">{{1.chicken_meal_portions}}</div></td>
          <td><div class="meal-title">Steak n Mash</div><div class="meal-portions">{{1.steak_meal_portions}}</div></td>
        </tr>
      </tbody>
    </table>
  </div>
  
  <div class="right-col">
    <div class="grocery-title">Grocery List</div>
    <div class="grocery-item"><div class="checkbox"></div><span class="grocery-item-details">Sirloin Steak</span><span class="grocery-item-weight">Pre-calculated Portion: {{1.steak_meal_portions}}</span></div>
    <div class="grocery-item"><div class="checkbox"></div><span class="grocery-item-details">Chicken Breast</span><span class="grocery-item-weight">Pre-calculated Portion: {{1.chicken_meal_portions}}</span></div>
    <div class="grocery-item"><div class="checkbox"></div><span class="grocery-item-details">Jasmine Rice</span><span class="grocery-item-weight">Pre-calculated Portion: {{1.chicken_meal_portions}}</span></div>
    <div class="grocery-item"><div class="checkbox"></div><span class="grocery-item-details">Garlic Mashed Potato</span><span class="grocery-item-weight">Pre-calculated Portion: {{1.steak_meal_portions}}</span></div>
    <div class="grocery-item"><div class="checkbox"></div><span class="grocery-item-details">Eggs & Green Beans</span><span class="grocery-item-weight">Standard Calibrations</span></div>
  </div>
</div>

<div class="footer">
  The Finally Fit Project &copy; 2026 Spokane. All Calibrations Powered by Kairos.
</div>

</body>
</html>
```

---

## ⚡ Step 3: Trigger a New Webhook Payload
Since we have added the new breakfast fields (`eggs_meal_portions`, `eggs_meal_name`, etc.) to your landing page code, follow these steps to load them as mapping choices inside Make:

1. Open your landing page locally (or live) and **complete a test quiz**.
2. Make sure the Make.com webhook triggers and receives this payload successfully.
3. Open the **ChatGPT** module and select the new colored pills (like `eggs_meal_portions`) to verify they are matched to the HTML cells.
