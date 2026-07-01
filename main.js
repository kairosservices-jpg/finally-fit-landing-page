/**
 * Finally Fit - Spokane Pilot (main.js)
 * Calculates Mifflin-St Jeor Macros and reveals customized pricing/meals.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 0. Cooked Food & Meal Databases (Macros per cooked oz, price per oz)
    const INGREDIENTS = {
        // proteins
        'tri_tip': { name: "Tri-Tip", category: "protein", price_per_oz: 0.606, protein_per_oz: 7.5, carbs_per_oz: 0, fat_per_oz: 4.0, calories_per_oz: 66 },
        'ground_turkey': { name: "Ground Turkey", category: "protein", price_per_oz: 0.271, protein_per_oz: 7.0, carbs_per_oz: 0, fat_per_oz: 2.5, calories_per_oz: 51 },
        'chicken_breast': { name: "Chicken Breast", category: "protein", price_per_oz: 0.165, protein_per_oz: 8.5, carbs_per_oz: 0, fat_per_oz: 1.0, calories_per_oz: 43 },
        'pork_shoulder': { name: "Pork Shoulder", category: "protein", price_per_oz: 0.118, protein_per_oz: 7.5, carbs_per_oz: 0, fat_per_oz: 4.5, calories_per_oz: 71 },
        'chicken_thigh': { name: "Chicken Thigh", category: "protein", price_per_oz: 0.107, protein_per_oz: 7.0, carbs_per_oz: 0, fat_per_oz: 3.0, calories_per_oz: 55 },
        'eggs': { name: "Whole Eggs", category: "protein", price_per_oz: 0.180, protein_per_oz: 3.6, carbs_per_oz: 0.3, fat_per_oz: 2.8, calories_per_oz: 41 },
        'greek_yogurt': { name: "Greek Yogurt", category: "protein", price_per_oz: 0.150, protein_per_oz: 3.0, carbs_per_oz: 1.0, fat_per_oz: 0, calories_per_oz: 16 },
        'cottage_cheese': { name: "Cottage Cheese", category: "protein", price_per_oz: 0.120, protein_per_oz: 3.5, carbs_per_oz: 1.0, fat_per_oz: 0.5, calories_per_oz: 23 },
        
        // carbs
        'chopped_potato': { name: "Chopped Potato", category: "carb", price_per_oz: 0.150, protein_per_oz: 0.7, carbs_per_oz: 6.0, fat_per_oz: 0.5, calories_per_oz: 31 },
        'mashed_potato': { name: "Mashed Potato", category: "carb", price_per_oz: 0.103, protein_per_oz: 0.6, carbs_per_oz: 5.0, fat_per_oz: 1.0, calories_per_oz: 31 },
        'sweet_potato': { name: "Sweet Potato", category: "carb", price_per_oz: 0.083, protein_per_oz: 0.6, carbs_per_oz: 6.0, fat_per_oz: 0, calories_per_oz: 26 },
        'jasmine_rice': { name: "Jasmine Rice", category: "carb", price_per_oz: 0.021, protein_per_oz: 0.7, carbs_per_oz: 8.0, fat_per_oz: 0, calories_per_oz: 35 },
        'pasta': { name: "Spaghetti Pasta", category: "carb", price_per_oz: 0.036, protein_per_oz: 1.5, carbs_per_oz: 8.0, fat_per_oz: 0.2, calories_per_oz: 40 },
        'granola': { name: "Granola/Fruit", category: "carb", price_per_oz: 0.100, protein_per_oz: 0.5, carbs_per_oz: 6.0, fat_per_oz: 1.0, calories_per_oz: 35 },
        
        // veggies
        'broccoli': { name: "Broccoli", category: "veg", price_per_oz: 0.133, protein_per_oz: 0.8, carbs_per_oz: 2.0, fat_per_oz: 0, calories_per_oz: 11 },
        'green_beans': { name: "Green Beans", category: "veg", price_per_oz: 0.099, protein_per_oz: 0.5, carbs_per_oz: 2.0, fat_per_oz: 0, calories_per_oz: 10 }
    };

    const MEAL_TEMPLATES = {
        // Breakfasts
        'Steak and Eggs': { protein_id: 'tri_tip', carb_id: 'chopped_potato', veg_id: 'broccoli' },
        'Yogurt Parfait': { protein_id: 'greek_yogurt', carb_id: 'granola', veg_id: 'broccoli' },
        'Honey Sweet Cottage Cheese': { protein_id: 'cottage_cheese', carb_id: 'granola', veg_id: 'green_beans' },
        'Morning Grand Slam': { protein_id: 'eggs', carb_id: 'sweet_potato', veg_id: 'broccoli' },
        
        // Snacks
        'Meat & Cheese-To-Go': { protein_id: 'pork_shoulder', carb_id: 'mashed_potato', veg_id: 'green_beans' },

        // Lunches / Dinners
        'Steak n Mash': { protein_id: 'tri_tip', carb_id: 'mashed_potato', veg_id: 'broccoli' },
        'Teriyaki Chicken': { protein_id: 'chicken_breast', carb_id: 'jasmine_rice', veg_id: 'broccoli' },
        'Chicken Fried Rice': { protein_id: 'chicken_breast', carb_id: 'jasmine_rice', veg_id: 'green_beans' },
        'Chili Margarita': { protein_id: 'chicken_breast', carb_id: 'jasmine_rice', veg_id: 'green_beans' },
        'BBQ Chicken Thigh': { protein_id: 'chicken_thigh', carb_id: 'mashed_potato', veg_id: 'green_beans' },
        'Sweet Chili Chicken Thigh': { protein_id: 'chicken_thigh', carb_id: 'jasmine_rice', veg_id: 'green_beans' },
        'Asian Zing Chicken Thigh': { protein_id: 'chicken_thigh', carb_id: 'jasmine_rice', veg_id: 'green_beans' },
        'Spaghetti and Meatballs': { protein_id: 'ground_turkey', carb_id: 'pasta', veg_id: 'broccoli' },
        'Chicken Pesto Pasta': { protein_id: 'chicken_breast', carb_id: 'pasta', veg_id: 'broccoli' }
    };

    const BASE_PREP_FEE = 5.00;
    const INGREDIENT_MARKUP = 1.0; // 1.0 = raw cost, 1.5 = 50% markup, etc.

    function calculateMealPortionsAndPricing(mealName, targetMealProtein, targetMealCarbs, targetMealFat) {
        if (mealName === 'Homemade Meal') {
            return {
                name: "Homemade Meal",
                price: 0.00,
                protein: Math.round(targetMealProtein),
                carbs: Math.round(targetMealCarbs),
                fat: Math.round(targetMealFat),
                calories: Math.round((targetMealProtein * 4) + (targetMealCarbs * 4) + (targetMealFat * 9)),
                portions: {
                    protein: { name: "Prepare at home", oz: 0 },
                    carb: { name: "", oz: 0 },
                    veg: { name: "", oz: 0 }
                },
                detailsHtml: "Prepare at home"
            };
        }

        const template = MEAL_TEMPLATES[mealName];
        if (!template) {
            return { name: mealName, price: 9.95, protein: 30, carbs: 30, fat: 10, calories: 330, detailsHtml: "" };
        }

        const pIng = INGREDIENTS[template.protein_id];
        const cIng = INGREDIENTS[template.carb_id];
        const vIng = INGREDIENTS[template.veg_id];

        // Determine required ounces by dividing target meal macros by the ingredient macros per cooked ounce
        let pOz = Math.round(targetMealProtein / pIng.protein_per_oz);
        
        // Carb rounding based on fitness goal (floor for Fat Loss, ceil for Muscle Gain, round for Maintain)
        const answers = JSON.parse(localStorage.getItem('ffp_user_answers')) || userAnswers;
        const fitnessGoal = answers['Goal'] || 'Maintain';
        const cOzRaw = targetMealCarbs / cIng.carbs_per_oz;
        let cOz = Math.round(cOzRaw);
        if (fitnessGoal === 'Fat Loss') {
            cOz = Math.floor(cOzRaw);
        } else if (fitnessGoal === 'Muscle Gain') {
            cOz = Math.ceil(cOzRaw);
        }
        
        let vOz = 2; // standard serving of 2 oz

        // Use min/max guardrails only *after* macro division and rounding are complete
        pOz = Math.max(4, Math.min(8, pOz));
        cOz = Math.max(3, Math.min(10, cOz));

        // Recompute actual meal macros using these clamped whole ounces
        const mealP = Math.round((pOz * pIng.protein_per_oz) + (cOz * cIng.protein_per_oz) + (vOz * vIng.protein_per_oz));
        const mealC = Math.round((pOz * pIng.carbs_per_oz) + (cOz * cIng.carbs_per_oz) + (vOz * vIng.carbs_per_oz));
        const mealF = Math.round((pOz * pIng.fat_per_oz) + (cOz * cIng.fat_per_oz) + (vOz * vIng.fat_per_oz));
        const mealCal = Math.round((mealP * 4) + (mealC * 4) + (mealF * 9));

        // Pricing formula: Base Prep Fee + (Ounces * Cost/oz * Markup)
        const pCost = pOz * pIng.price_per_oz * INGREDIENT_MARKUP;
        const cCost = cOz * cIng.price_per_oz * INGREDIENT_MARKUP;
        const vCost = vOz * vIng.price_per_oz * INGREDIENT_MARKUP;
        const totalPrice = Math.round((BASE_PREP_FEE + pCost + cCost + vCost) * 100) / 100;

        return {
            name: mealName,
            price: totalPrice,
            protein: mealP,
            carbs: mealC,
            fat: mealF,
            calories: mealCal,
            portions: {
                protein: { name: pIng.name, oz: pOz },
                carb: { name: cIng.name, oz: cOz },
                veg: { name: vIng.name, oz: vOz }
            },
            detailsHtml: `${pOz}oz ${pIng.name}, ${cOz}oz ${cIng.name}, ${vOz}oz ${vIng.name}`
        };
    }

    // State Variables
    let currentStep = 1;
    const totalSteps = 9;
    const userAnswers = {};
    const calculatedPlan = {};

    // DOM Elements - Quiz steps
    const steps = document.querySelectorAll('.quiz-step-pane');
    const fillBar = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const progressNum = document.getElementById('progress-num');
    
    // Webhook Configuration (matching user's verified Kairos Make integration)
    const MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/634ao2dslkl43sfihn02hn9quq9s6pml';
    
    // Stripe Checkout link for the $200 8-Week Program (User replaces this with live link)
    const STRIPE_CHECKOUT_URL = 'https://buy.stripe.com/28EbJ14Mh3lRg7g0na1ck07';

    // Initialize Progress
    updateProgress();
    setupGroceryDownload();

    // Clear selected buttons in Step 2 if user starts typing in custom gym input
    const gymInput = document.getElementById('quiz-gym-input');
    if (gymInput) {
        gymInput.addEventListener('input', () => {
            const pane = gymInput.closest('.quiz-step-pane');
            if (pane) {
                pane.querySelectorAll('.quiz-btn-option').forEach(b => {
                    b.classList.remove('selected');
                });
                delete userAnswers['Gym'];
            }
        });
    }

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

        let isValid = true;

        // Custom validation for step 2 (Gym step)
        if (stepNum === 2) {
            const selectedOpt = pane.querySelector('.quiz-btn-option.selected');
            const customGym = pane.querySelector('#quiz-gym-input');
            const textVal = customGym ? customGym.value.trim() : '';
            if (!selectedOpt && !textVal) {
                isValid = false;
                if (customGym) {
                    customGym.style.borderColor = '#FF5E00';
                    setTimeout(() => {
                        customGym.style.borderColor = '';
                    }, 2000);
                }
            }
            return isValid;
        }

        const inputs = pane.querySelectorAll('input[required]');
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

            // Clear text input if any in the same pane
            const textInput = parentPane.querySelector('input[type="text"]');
            if (textInput) {
                textInput.value = '';
            }

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
                        const val = input.value.trim();
                        // Only save if it's not empty, OR if we don't have a value for it yet
                        if (val !== "" || !userAnswers[key]) {
                            userAnswers[key] = val;
                        }
                    }
                });

                if (currentStep === 7) {
                    // Contact Info step: trigger background webhook for abandonment tracking
                    const firstName = document.getElementById('input-first')?.value?.trim();
                    const lastName = document.getElementById('input-last')?.value?.trim();
                    const email = document.getElementById('input-email')?.value?.trim();
                    const phone = document.getElementById('input-phone')?.value?.trim();
                    
                    if (firstName && lastName && email && phone) {
                        userAnswers['First Name'] = firstName;
                        userAnswers['Last Name'] = lastName;
                        userAnswers['Email'] = email;
                        userAnswers['Phone'] = phone;
                        
                        const payload = {
                            ...userAnswers,
                            partial: true,
                            source: "Finally Fit Spokane Pilot Landing Page - Partial Lead"
                        };
                        fetch(MAKE_WEBHOOK_URL, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                        }).catch(err => console.warn('Partial lead tracking error:', err));
                    }
                }

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

            // Capture Step 9 Allergies input
            const allergiesInput = document.getElementById('quiz-allergies-input');
            userAnswers['Allergies'] = allergiesInput ? allergiesInput.value.trim() : '';

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
                // Calculate targets for the 4 main meals (Breakfast, Lunch #1, Lunch #2, Dinner)
                // Deducting snack (25g Protein, 20g Carbs, 10g Fat) and dividing the rest by 4
                const mealTargetP = (proteinGrams - 25) / 4;
                const mealTargetC = (carbGrams - 20) / 4;
                const mealTargetF = (fatGrams - 10) / 4;

                // Calculate dynamic portions for signature meals for webhook mapping
                const steakDetails = calculateMealPortionsAndPricing('Steak n Mash', mealTargetP, mealTargetC, mealTargetF);
                const chickenDetails = calculateMealPortionsAndPricing('Teriyaki Chicken', mealTargetP, mealTargetC, mealTargetF);

                // Execute webhook submission
                const payload = {
                    ...userAnswers,
                    ...calculatedPlan,
                    source: "Finally Fit Spokane Pilot Landing Page",
                    studio: userAnswers['Gym'] || userAnswers['Studio'] || 'At Home',
                    gym: userAnswers['Gym'] || userAnswers['Studio'] || 'At Home',
                    // Portion & Pricing details for Make/Google Sheets integration
                    steak_meal_name: steakDetails.name,
                    steak_meal_price: steakDetails.price,
                    steak_meal_portions: steakDetails.detailsHtml,
                    steak_meal_protein: steakDetails.protein,
                    steak_meal_carbs: steakDetails.carbs,
                    steak_meal_fat: steakDetails.fat,
                    steak_meal_calories: steakDetails.calories,
                    
                    chicken_meal_name: chickenDetails.name,
                    chicken_meal_price: chickenDetails.price,
                    chicken_meal_portions: chickenDetails.detailsHtml,
                    chicken_meal_protein: chickenDetails.protein,
                    chicken_meal_carbs: chickenDetails.carbs,
                    chicken_meal_fat: chickenDetails.fat,
                    chicken_meal_calories: chickenDetails.calories
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

        // Render dynamic Daily Meal Plan Blueprint
        renderDailyPlanDays();


        
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

        // Print / Save Meal Plan PDF button listener
        const printBtn = document.getElementById('print-meal-plan-btn');
        if (printBtn) {
            printBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.print();
            });
        }
    }





    // Render dynamic Daily Meal Plan Blueprint cards
    function renderDailyPlanDays() {
        const container = document.getElementById('plan-days-grid-container');
        if (!container) return;

        const plan = JSON.parse(localStorage.getItem('ffp_macro_plan')) || calculatedPlan;
        const targetP = plan.protein || 160;
        const targetC = plan.carbs || 140;
        const targetF = plan.fat || 55;

        const dayMeals = [
            { tag: "BREAKFAST", name: "Steak and Eggs", img: "assets/steak_eggs.png", class: "tag-breakfast" },
            { tag: "LUNCH #1", name: "Teriyaki Chicken", img: "assets/teriyaki_chicken.png", class: "tag-lunch" },
            { tag: "LUNCH #2", name: "Chicken Fried Rice", img: "assets/chicken_fried_rice.png", class: "tag-lunch" },
            { tag: "DINNER", name: "Steak n Mash", img: "assets/steak_n_mash.png", class: "tag-dinner" },
            { tag: "SNACK", name: "Meat & Cheese-To-Go (Pack of 5)", img: "assets/meat_cheese_to_go.png", class: "tag-snack" }
        ];

        // Format grid styles for visual daily layout
        container.style.display = 'grid';
        container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
        container.style.gap = '20px';

        container.innerHTML = dayMeals.map(meal => {
            const isSnack = meal.tag === "SNACK";
            const mealTargetP = isSnack ? 25 : (targetP - 25) / 4;
            const mealTargetC = isSnack ? 20 : (targetC - 20) / 4;
            const mealTargetF = isSnack ? 10 : (targetF - 10) / 4;
            const d = calculateMealPortionsAndPricing(meal.name, mealTargetP, mealTargetC, mealTargetF);
            
            // Format details to display cooked specs cleanly
            const portionsHtml = d.portions ? `
                <div style="font-size: 0.8rem; opacity: 0.7; margin-top: 5px; line-height: 1.4;">
                    ${d.portions.protein.oz > 0 ? `<strong>${d.portions.protein.oz}oz</strong> ${d.portions.protein.name}` : ''}
                    ${d.portions.carb.oz > 0 ? `<br><strong>${d.portions.carb.oz}oz</strong> ${d.portions.carb.name}` : ''}
                    ${d.portions.veg.oz > 0 ? `<br><strong>${d.portions.veg.oz}oz</strong> ${d.portions.veg.name}` : ''}
                </div>
            ` : '';

            return `
            <div class="meal-card-premium hover-lift">
                <div style="height: 140px; background: #222; overflow: hidden; border-bottom: 1.5px solid rgba(255,255,255,0.08); position: relative;">
                    <img src="${meal.img}" alt="${d.name}" style="width: 100%; height: 100%; object-fit: cover;">
                    <span class="meal-tag-label ${meal.class}" style="position: absolute; top: 10px; left: 10px; padding: 4px 8px; font-size: 0.7rem; font-weight: 700; border-radius: 2px;">${meal.tag}</span>
                    <span style="position: absolute; top: 10px; right: 10px; background: #000; color: #fff; border: 1px solid rgba(255,255,255,0.15); font-size: 0.8rem; font-weight: 700; padding: 3px 6px; border-radius: 2px;">$${d.price.toFixed(2)}</span>
                </div>
                <div style="padding: 15px; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <h4 style="font-size: 1.05rem; font-family: var(--font-primary); margin: 0; color: #fff; line-height: 1.3;">${d.name}</h4>
                        ${portionsHtml}
                    </div>
                    <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.05); font-size: 0.75rem; color: #2ec4b6; font-weight: 700;">
                        ${d.protein}g P / ${d.carbs}g C / ${d.fat}g F | ${d.calories} Cal
                    </div>
                </div>
            </div>
            `;
        }).join('');
    }

    // Dynamic grocery list generator that opens a beautifully styled, print-ready checklist window
    function printGroceryList(plan) {
        const targetP = plan.protein || 160;
        const targetC = plan.carbs || 140;
        const targetF = plan.fat || 55;

        const meals = [
            { name: "Steak and Eggs", isSnack: false },
            { name: "Teriyaki Chicken", isSnack: false },
            { name: "Chicken Fried Rice", isSnack: false },
            { name: "Steak n Mash", isSnack: false },
            { name: "Meat & Cheese-To-Go (Pack of 5)", isSnack: true }
        ];

        const totals = {}; // Map of ingredient name -> total ounces cooked

        meals.forEach(m => {
            const isSnack = m.isSnack;
            const mealTargetP = isSnack ? 25 : (targetP - 25) / 4;
            const mealTargetC = isSnack ? 20 : (targetC - 20) / 4;
            const mealTargetF = isSnack ? 10 : (targetF - 10) / 4;
            const d = calculateMealPortionsAndPricing(m.name, mealTargetP, mealTargetC, mealTargetF);
            
            if (d.portions) {
                Object.keys(d.portions).forEach(key => {
                    const item = d.portions[key];
                    if (item && item.oz > 0 && item.name) {
                        totals[item.name] = (totals[item.name] || 0) + (item.oz * 5); // 5-day supply
                    }
                });
            }
        });

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert("Popup blocked! Please allow popups to download/print your grocery list.");
            return;
        }
        
        let rowsHtml = Object.keys(totals).map(name => {
            const cookedOz = totals[name];
            const cookedLbs = (cookedOz / 16).toFixed(1);
            
            let yieldNote = "";
            if (name.includes("Sirloin")) {
                const rawOz = Math.ceil(cookedOz / 0.708);
                const rawLbs = (rawOz / 16).toFixed(1);
                yieldNote = `<span class="shrinkage-note">Requires <strong>${rawOz} oz</strong> / <strong>${rawLbs} lbs</strong> raw weight due to shrinkage</span>`;
            } else if (name.includes("Chicken Breast")) {
                const rawOz = Math.ceil(cookedOz / 0.769);
                const rawLbs = (rawOz / 16).toFixed(1);
                yieldNote = `<span class="shrinkage-note">Requires <strong>${rawOz} oz</strong> / <strong>${rawLbs} lbs</strong> raw weight due to shrinkage</span>`;
            } else if (name.includes("Chicken Thigh")) {
                const rawOz = Math.ceil(cookedOz / 0.727);
                const rawLbs = (rawOz / 16).toFixed(1);
                yieldNote = `<span class="shrinkage-note">Requires <strong>${rawOz} oz</strong> / <strong>${rawLbs} lbs</strong> raw weight due to shrinkage</span>`;
            }

            return `
            <div class="grocery-item">
                <div class="checkbox-box"></div>
                <div class="item-details">
                    <div class="item-name">${name}</div>
                    <div class="item-weight">${cookedOz} oz (${cookedLbs} lbs) cooked ${yieldNote}</div>
                </div>
            </div>
            `;
        }).join('');

        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Finally Fit Spokane - Grocery List</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    color: #111;
                    background: #fff;
                    margin: 40px;
                    line-height: 1.5;
                }
                .header {
                    border-bottom: 3px solid #ff003c;
                    padding-bottom: 15px;
                    margin-bottom: 30px;
                }
                .brand-title {
                    font-size: 26px;
                    font-weight: 800;
                    letter-spacing: 1px;
                    color: #ff003c;
                    margin: 0;
                }
                .brand-subtitle {
                    font-size: 14px;
                    text-transform: uppercase;
                    color: #666;
                    letter-spacing: 2px;
                    font-weight: 600;
                    margin-top: 3px;
                }
                .meta-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin: 20px 0;
                    font-size: 13px;
                    background: #f9f9f9;
                    padding: 15px;
                    border-radius: 6px;
                    border: 1px solid #eee;
                }
                .meta-item strong {
                    color: #333;
                }
                .title-sec {
                    font-size: 18px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-top: 30px;
                    margin-bottom: 20px;
                    color: #111;
                    border-bottom: 1.5px solid #333;
                    padding-bottom: 8px;
                }
                .grocery-item {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 12px 10px;
                    border-bottom: 1px solid #f1f1f1;
                }
                .checkbox-box {
                    width: 18px;
                    height: 18px;
                    border: 2px solid #333;
                    border-radius: 3px;
                    flex-shrink: 0;
                }
                .item-details {
                    flex: 1;
                }
                .item-name {
                    font-size: 15px;
                    font-weight: 700;
                    color: #111;
                }
                .item-weight {
                    font-size: 13px;
                    color: #555;
                    margin-top: 2px;
                }
                .shrinkage-note {
                    color: #e63946;
                    font-weight: 500;
                    margin-left: 5px;
                }
                .footer {
                    margin-top: 50px;
                    border-top: 1px solid #eee;
                    padding-top: 20px;
                    font-size: 12px;
                    color: #777;
                    text-align: center;
                    line-height: 1.6;
                }
                @media print {
                    body { margin: 20px; }
                    .meta-grid { background: #fff !important; border: 1px solid #ccc; }
                    .checkbox-box { border-color: #000; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1 class="brand-title">FINALLY FIT SPOKANE</h1>
                <div class="brand-subtitle">Personalized Grocery Blueprint</div>
            </div>
            <div class="meta-grid">
                <div class="meta-item">
                    <strong>Calorie Target:</strong> ${plan.calories} Calories (${plan.tier} Tier)<br>
                    <strong>Macros:</strong> ${plan.protein}g Protein &bull; ${plan.carbs}g Carbs &bull; ${plan.fat}g Fat
                </div>
                <div class="meta-item">
                    <strong>Quantity:</strong> 5-Day Supply (25 total containers)<br>
                    <strong>Generated On:</strong> ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
               </div>
            </div>
            <h2 class="title-sec">Shopping List (Cooked vs. Raw Prep target)</h2>
            <div class="items-list">
                ${rowsHtml}
            </div>
            <div class="footer">
                Tired of the shopping, portion prep, cooking, and clean up? Let us prepare and cook these exact scaled portions for you!<br>
                Order at: <strong>https://thefinallyfitproject.com/</strong>
            </div>
        </body>
        </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    }

    // Initialize click listener to print styled grocery list
    function setupGroceryDownload() {
        const btn = document.getElementById('download-grocery-list-btn');
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const plan = JSON.parse(localStorage.getItem('ffp_macro_plan')) || calculatedPlan;
                printGroceryList(plan);
            });
        }
    }

    // Check if user has already calculated macros in past session and load directly if wanted
    // We keep it clean to start quiz on load, but if they reload on results it can persist.
});
