/**
 * Finally Fit - Orange Theory Spokane Pilot (main.js)
 * Calculates Mifflin-St Jeor Macros and reveals customized pricing/meals.
 */

document.addEventListener('DOMContentLoaded', () => {
    // State Variables
    let currentStep = 1;
    const totalSteps = 7;
    const userAnswers = {};
    const calculatedPlan = {};

    // DOM Elements - Quiz steps
    const steps = document.querySelectorAll('.quiz-step-pane');
    const fillBar = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const progressNum = document.getElementById('progress-num');
    
    // Webhook Configuration (matching user's verified Kairos Make integration)
    const MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/3jgfgdufxl5k485zgecvwwbg7b3rjmxt';
    
    // Stripe Checkout link for the $200 8-Week Program (User replaces this with live link)
    const STRIPE_CHECKOUT_URL = 'https://buy.stripe.com/28EbJ14Mh3lRg7g0na1ck07';

    // Initialize Progress
    updateProgress();

    // 1. Navigation Functions
    function updateProgress() {
        if (fillBar && progressNum) {
            const pct = Math.round(((currentStep - 1) / totalSteps) * 100);
            fillBar.style.width = `${pct}%`;
            progressNum.textContent = `${pct}%`;
        }
    }

    function showStep(stepNum) {
        steps.forEach(pane => {
            pane.classList.remove('active');
        });
        
        const nextPane = document.getElementById(`quiz-step-${stepNum}`);
        if (nextPane) {
            nextPane.classList.add('active');
            currentStep = stepNum;
            updateProgress();
        }
    }

    // Input Validation Helper
    function validateStep(stepNum) {
        const pane = document.getElementById(`quiz-step-${stepNum}`);
        if (!pane) return true;

        const inputs = pane.querySelectorAll('input[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#FF5E00'; // Flash orange border
                setTimeout(() => {
                    input.style.borderColor = '';
                }, 2000);
            }
        });

        return isValid;
    }

    // 2. Event Listeners for Quiz Buttons & Navigation
    
    // Handle Option Button Clicks (Goals, Gender, Activity, Studio)
    const optionButtons = document.querySelectorAll('.quiz-btn-option');
    optionButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const parentPane = btn.closest('.quiz-step-pane');
            const question = btn.getAttribute('data-question');
            const val = btn.getAttribute('data-val');
            
            // Save state
            userAnswers[question] = val;
            
            // Toggle visual selection
            parentPane.querySelectorAll('.quiz-btn-option').forEach(b => {
                b.classList.remove('selected');
            });
            btn.classList.add('selected');

            // Auto-advance with slight delay for click feeling (only if the step doesn't require further input/Next button)
            const hasNextBtn = parentPane.querySelector('.quiz-next-btn');
            if (!hasNextBtn) {
                const nextStepNum = parseInt(parentPane.getAttribute('data-step-index')) + 1;
                setTimeout(() => {
                    showStep(nextStepNum);
                }, 250);
            }
        });
    });

    // Handle Manual Navigation Back Buttons
    const backButtons = document.querySelectorAll('.quiz-back-btn');
    backButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const prevStepNum = currentStep - 1;
            if (prevStepNum >= 1) {
                showStep(prevStepNum);
            }
        });
    });

    // Handle Manual Navigation Next Buttons (for input fields)
    const nextButtons = document.querySelectorAll('.quiz-next-btn');
    nextButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (validateStep(currentStep)) {
                // Save text input values
                const pane = document.getElementById(`quiz-step-${currentStep}`);
                const textInputs = pane.querySelectorAll('input');
                textInputs.forEach(input => {
                    const key = input.getAttribute('data-question');
                    if (key) {
                        userAnswers[key] = input.value.trim();
                    }
                });

                const nextStepNum = currentStep + 1;
                showStep(nextStepNum);
            }
        });
    });

    // 3. Lead Submission and Macro Calculations
    const leadForm = document.getElementById('lead-info-form');
    if (leadForm) {
        leadForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Verify inputs
            const firstName = document.getElementById('input-first').value.trim();
            const lastName = document.getElementById('input-last').value.trim();
            const email = document.getElementById('input-email').value.trim();
            const phone = document.getElementById('input-phone').value.trim();

            if (!firstName || !lastName || !email || !phone) {
                alert('Please fill out all contact information.');
                return;
            }

            // Capture last set of inputs
            userAnswers['First Name'] = firstName;
            userAnswers['Last Name'] = lastName;
            userAnswers['Email'] = email;
            userAnswers['Phone'] = phone;

            // Extract numeric values from prior steps
            userAnswers['Age'] = parseInt(userAnswers['Age']) || 35;
            userAnswers['Weight'] = parseFloat(userAnswers['Weight']) || 170;
            userAnswers['Height Feet'] = parseInt(userAnswers['Height Feet']) || 5;
            userAnswers['Height Inches'] = parseInt(userAnswers['Height Inches']) || 9;

            // Calculations: Mifflin-St Jeor Equation
            const weightKg = userAnswers['Weight'] * 0.45359237;
            const totalHeightInches = (userAnswers['Height Feet'] * 12) + userAnswers['Height Inches'];
            const heightCm = totalHeightInches * 2.54;
            const age = userAnswers['Age'];
            const gender = userAnswers['Gender'] || 'Female';
            const activityMultiplier = parseFloat(userAnswers['Activity']) || 1.375;
            const fitnessGoal = userAnswers['Goal'] || 'Fat Loss';

            // Basal Metabolic Rate (BMR)
            let BMR = 0;
            if (gender === 'Male') {
                BMR = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5;
            } else {
                BMR = (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
            }

            // Total Daily Energy Expenditure (TDEE)
            const TDEE = Math.round(BMR * activityMultiplier);

            // Calorie budget based on target goals
            let targetCalories = TDEE;
            if (fitnessGoal === 'Fat Loss') {
                targetCalories = Math.round(TDEE - 500);
                // Safe minimums
                if (gender === 'Female' && targetCalories < 1200) targetCalories = 1200;
                if (gender === 'Male' && targetCalories < 1500) targetCalories = 1500;
            } else if (fitnessGoal === 'Muscle Gain') {
                targetCalories = Math.round(TDEE + 300);
            }

            // High-Protein Macronutrient Breakdown
            // Protein: 1.0g per lb of body weight (4 kcal/g)
            let proteinGrams = Math.round(userAnswers['Weight']);
            
            // Apply absolute gender-specific protein caps (220g for men, 160g for women)
            if (gender === 'Male') {
                if (proteinGrams > 220) proteinGrams = 220;
            } else {
                if (proteinGrams > 160) proteinGrams = 160;
            }
            
            // Limit protein to maximum of 40% total calories for safety margins
            if (proteinGrams * 4 > targetCalories * 0.4) {
                proteinGrams = Math.round((targetCalories * 0.4) / 4);
            }

            // Fat: 27.5% of total calories (9 kcal/g)
            const fatGrams = Math.round((targetCalories * 0.275) / 9);

            // Carbs: Remaining calories (4 kcal/g)
            const proteinCal = proteinGrams * 4;
            const fatCal = fatGrams * 9;
            const carbCal = targetCalories - proteinCal - fatCal;
            const carbGrams = Math.max(20, Math.round(carbCal / 4)); // absolute minimum of 20g carbs

            // Determine Target Plan Portion Tier
            let calculatedTier = 'L'; // Default Medium
            if (targetCalories < 1700) {
                calculatedTier = 'S'; // Small/Cut
            } else if (targetCalories > 2300) {
                calculatedTier = 'XL'; // Large/Build
            }

            // Package calculated payload
            Object.assign(calculatedPlan, {
                calories: targetCalories,
                protein: proteinGrams,
                carbs: carbGrams,
                fat: fatGrams,
                bmr: Math.round(BMR),
                tdee: TDEE,
                tier: calculatedTier
            });

            // Persist locally for state-keeping
            localStorage.setItem('ffp_user_answers', JSON.stringify(userAnswers));
            localStorage.setItem('ffp_macro_plan', JSON.stringify(calculatedPlan));

            // Show loading state on submission button
            const submitBtn = leadForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Calculating Plan & Opening Offers...';

            try {
                // Execute webhook submission
                const payload = {
                    ...userAnswers,
                    ...calculatedPlan,
                    source: "Orange Theory Spokane Pilot Landing Page",
                    studio: userAnswers['Studio'] || 'North Spokane'
                };

                await fetch(MAKE_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                console.log('Lead successfully submitted.');
            } catch (err) {
                // Graceful fallback logging so checkout isn't blocked by CORS or network drops
                console.warn('Webhook transmission error, proceeding with UI reveal:', err);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                
                // Hide Quiz Widget & Show Custom Tiers / Pricing
                revealDashboardResults();
            }
        });
    }

    // 4. Results Dashboard Renderer
    function revealDashboardResults() {
        const answers = JSON.parse(localStorage.getItem('ffp_user_answers')) || userAnswers;
        const plan = JSON.parse(localStorage.getItem('ffp_macro_plan')) || calculatedPlan;
        
        // Hide Main Hero Header and Hero Grid
        const heroSection = document.querySelector('.hero-sec');
        if (heroSection) {
            heroSection.style.padding = '40px 0 60px 0'; // Tighten padding
        }
        
        const heroGrid = document.querySelector('.hero-grid');
        if (heroGrid) {
            heroGrid.style.display = 'none'; // Clear out the form view
        }

        // Target Results Pane
        const resultsPane = document.getElementById('results-pane');
        if (resultsPane) {
            resultsPane.style.display = 'block'; // Make results visible
            
            // Smooth scroll to results header
            resultsPane.scrollIntoView({ behavior: 'smooth' });
        }

        // Render calculated metrics in UI
        const nameNode = document.getElementById('result-user-name');
        const calNode = document.getElementById('macro-val-calories');
        const proteinNode = document.getElementById('macro-val-protein');
        const carbNode = document.getElementById('macro-val-carbs');
        const fatNode = document.getElementById('macro-val-fat');
        
        if (nameNode) nameNode.textContent = answers['First Name'] || 'Athlete';
        if (calNode) calNode.textContent = plan.calories;
        if (proteinNode) proteinNode.textContent = `${plan.protein}g`;
        if (carbNode) carbNode.textContent = `${plan.carbs}g`;
        if (fatNode) fatNode.textContent = `${plan.fat}g`;

        // Render dynamic Client Weekly Meal Plan metadata
        const planClientNameNode = document.getElementById('plan-client-name');
        const planWeekDateNode = document.getElementById('plan-week-date');

        if (planClientNameNode) {
            planClientNameNode.textContent = `${answers['First Name'] || 'Lidiya'} ${answers['Last Name'] || 'Ervin'}`;
        }

        if (planWeekDateNode) {
            // Calculate current week's Monday date
            const today = new Date();
            const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
            const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
            const monday = new Date(today);
            monday.setDate(today.getDate() + distanceToMonday);

            const options = { month: 'long', day: 'numeric', year: 'numeric' };
            planWeekDateNode.textContent = monday.toLocaleDateString('en-US', options);
        }

        // Render dynamic Weekly Days Schedule (Monday through Sunday)
        renderWeeklyPlanDays();


        
        // Update checkout link to Stripe for the 8-Week Program purchase
        const stripeBtn = document.getElementById('stripe-checkout-btn');
        if (stripeBtn) {
            stripeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // Pass customer email dynamically to prefill Stripe Checkout if possible
                const emailParam = answers['Email'] ? `?prefilled_email=${encodeURIComponent(answers['Email'])}` : '';
                window.location.href = `${STRIPE_CHECKOUT_URL}${emailParam}`;
            });
        }
    }



    // 5. Studio Interactive Map Selector (Orange Theory North Spokane vs South Hill)
    const studioTags = document.querySelectorAll('.partner-sec .loc-tag');
    const studioNameNode = document.getElementById('studio-display-name');
    const studioAddressNode = document.getElementById('studio-display-address');
    
    // Spokane Orange Theory Address Data
    const studioLocations = {
        'North Spokane': {
            name: "Orange Theory - North Spokane",
            address: "9312 N Division St, Spokane, WA 99218"
        },
        'South Hill': {
            name: "Orange Theory - Spokane South Hill",
            address: "2525 E 29th Ave, Spokane, WA 99223"
        }
    };

    studioTags.forEach(tag => {
        tag.addEventListener('click', () => {
            // Remove active style from siblings
            studioTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');

            const selectedStudioKey = tag.getAttribute('data-studio');
            const data = studioLocations[selectedStudioKey];
            
            if (data && studioNameNode && studioAddressNode) {
                // Fade effect
                const card = document.getElementById('studio-info-card');
                if (card) {
                    card.style.opacity = '0.5';
                    card.style.transform = 'scale(0.98)';
                }
                
                setTimeout(() => {
                    studioNameNode.textContent = data.name;
                    studioAddressNode.textContent = data.address;
                    if (card) {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }
                }, 150);
            }
        });
    });

    // Render dynamic Weekly Days Schedule (Monday through Sunday) with rotated items
    function renderWeeklyPlanDays() {
        const container = document.getElementById('plan-days-grid-container');
        if (!container) return;

        const daysData = [
            {
                day: "MONDAY",
                meals: [
                    { tag: "BREAKFAST", name: "Steak and Eggs", class: "tag-breakfast" },
                    { tag: "LUNCH", name: "Teriyaki Chicken", class: "tag-lunch" },
                    { tag: "SNACK", name: "Meat & Cheese-To-Go", class: "tag-snack" },
                    { tag: "DINNER", name: "Steak n Mash", class: "tag-dinner" }
                ]
            },
            {
                day: "TUESDAY",
                meals: [
                    { tag: "BREAKFAST", name: "Yogurt Parfait", class: "tag-breakfast" },
                    { tag: "LUNCH", name: "Chicken Fried Rice", class: "tag-lunch" },
                    { tag: "SNACK", name: "Meat & Cheese-To-Go", class: "tag-snack" },
                    { tag: "DINNER", name: "Spaghetti and Meatballs", class: "tag-dinner" }
                ]
            },
            {
                day: "WEDNESDAY",
                meals: [
                    { tag: "BREAKFAST", name: "Honey Sweet Cottage Cheese", class: "tag-breakfast" },
                    { tag: "LUNCH", name: "Chili Margarita", class: "tag-lunch" },
                    { tag: "SNACK", name: "Meat & Cheese-To-Go", class: "tag-snack" },
                    { tag: "DINNER", name: "Chicken Pesto Pasta", class: "tag-dinner" }
                ]
            },
            {
                day: "THURSDAY",
                meals: [
                    { tag: "BREAKFAST", name: "Morning Grand Slam", class: "tag-breakfast" },
                    { tag: "LUNCH", name: "Asian Zing Chicken Thigh", class: "tag-lunch" },
                    { tag: "SNACK", name: "Meat & Cheese-To-Go", class: "tag-snack" },
                    { tag: "DINNER", name: "BBQ Chicken Thigh", class: "tag-dinner" }
                ]
            },
            {
                day: "FRIDAY",
                meals: [
                    { tag: "BREAKFAST", name: "Steak and Eggs", class: "tag-breakfast" },
                    { tag: "LUNCH", name: "Teriyaki Chicken", class: "tag-lunch" },
                    { tag: "SNACK", name: "Meat & Cheese-To-Go", class: "tag-snack" },
                    { tag: "DINNER", name: "Sweet Chili Chicken Thigh", class: "tag-dinner" }
                ]
            },
            {
                day: "SATURDAY",
                meals: [
                    { tag: "BREAKFAST", name: "Yogurt Parfait", class: "tag-breakfast" },
                    { tag: "LUNCH", name: "Chicken Fried Rice", class: "tag-lunch" },
                    { tag: "SNACK", name: "Meat & Cheese-To-Go", class: "tag-snack" },
                    { tag: "DINNER", name: "Steak n Mash", class: "tag-dinner" }
                ]
            },
            {
                day: "SUNDAY",
                meals: [
                    { tag: "BREAKFAST", name: "Honey Sweet Cottage Cheese", class: "tag-breakfast" },
                    { tag: "LUNCH", name: "Chili Margarita", class: "tag-lunch" },
                    { tag: "SNACK", name: "Meat & Cheese-To-Go", class: "tag-snack" },
                    { tag: "DINNER", name: "Chicken Pesto Pasta", class: "tag-dinner" }
                ]
            }
        ];

        container.innerHTML = daysData.map(dayObj => `
            <div class="plan-day-column">
                <div class="day-header-bar">${dayObj.day}</div>
                <table class="day-meals-table">
                    ${dayObj.meals.map(meal => `
                        <tr>
                            <td class="meal-tag-cell ${meal.class}">${meal.tag}</td>
                            <td class="meal-name-cell">${meal.name}</td>
                        </tr>
                    `).join('')}
                </table>
            </div>
        `).join('');
    }

    // Check if user has already calculated macros in past session and load directly if wanted
    // We keep it clean to start quiz on load, but if they reload on results it can persist.
});
