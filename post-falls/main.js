/**
 * Finally Fit - Post Falls (main.js)
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
        'jasmine_rice': { name: "Cooked Jasmine Rice", category: "carb", price_per_oz: 0.021, protein_per_oz: 0.8, carbs_per_oz: 8.0, fat_per_oz: 0.1, calories_per_oz: 37 },
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
                detailsHtml: "Prepare at home",
                recipePortions: "Prepare at home"
            };
        }

        const template = MEAL_TEMPLATES[mealName];
        if (!template) {
            return { name: mealName, price: 9.95, protein: 30, carbs: 30, fat: 10, calories: 330, detailsHtml: "", recipePortions: "" };
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
        cOz = Math.max(3, Math.min(5, cOz));

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
            detailsHtml: `${pOz}oz ${pIng.name}, ${cOz}oz ${cIng.name}, ${vOz}oz ${vIng.name}`,
            recipePortions: `${pOz}oz ${pIng.name}, ${cOz}oz ${cIng.name}`
        };
    }

    // State Variables
    let currentStep = 1;
    const totalSteps = 13;
    const userAnswers = {};
    const calculatedPlan = {};

    // Webhook Configuration
    const MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/634ao2dslkl43sfihn02hn9quq9s6pml';
    
    // Stripe Checkout link for the $200 8-Week Program
    const STRIPE_CHECKOUT_URL = 'https://buy.stripe.com/28EbJ14Mh3lRg7g0na1ck07';

    // Strategy Session Booking URL
    const STRATEGY_SESSION_BOOKING_URL = 'https://calendar.app.google/egZH5unsZwM9oJwYA';

    // Capture UTM parameters from URL for GHL attribution tracking
    function captureUTMs() {
        const urlParams = new URLSearchParams(window.location.search);
        const utms = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid'];
        utms.forEach(param => {
            if (urlParams.has(param)) {
                userAnswers[param] = urlParams.get(param);
            }
        });
    }

    // Initialize UTMs, Grocery, and FAQ
    captureUTMs();
    setupGroceryDownload();
    setupFaqAccordion();

    // 1. Quiz Step Navigation Logic

    // Option Buttons Click Handler (quiz-btn)
    const optionButtons = document.querySelectorAll('.quiz-btn');
    optionButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const parentPane = btn.closest('.quiz-step');
            if (!parentPane) return;
            
            const questionNode = parentPane.querySelector('h3');
            const question = questionNode ? questionNode.textContent.trim() : parentPane.id;
            const val = btn.textContent.replace('→', '').replace('✓', '').trim();
            
            // Save answer
            userAnswers[question] = val;
            
            // Visual feedback
            parentPane.querySelectorAll('.quiz-btn').forEach(b => {
                b.classList.remove('selected');
            });
            btn.classList.add('selected');

            // Auto-advance
            const nextStepId = btn.getAttribute('data-next');
            const nextPane = document.getElementById(nextStepId);
            if (parentPane && nextPane) {
                parentPane.style.display = 'none';
                nextPane.style.display = 'block';
                const stepMatch = nextStepId.match(/\d+/);
                if (stepMatch) {
                    currentStep = parseInt(stepMatch[0]);
                } else if (nextStepId.includes('email')) {
                    currentStep = 13;
                }
            }
        });
    });

    // Back Buttons Handler
    const backButtons = document.querySelectorAll('.quiz-back-btn');
    backButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const parentPane = btn.closest('.quiz-step');
            const prevStepId = btn.getAttribute('data-prev');
            const prevPane = document.getElementById(prevStepId);
            if (parentPane && prevPane) {
                parentPane.style.display = 'none';
                prevPane.style.display = 'block';
                const stepMatch = prevStepId.match(/\d+/);
                if (stepMatch) {
                    currentStep = parseInt(stepMatch[0]);
                }
            }
        });
    });

    // Next Buttons Handler for Text/Number Inputs
    const nextButtons = document.querySelectorAll('.text-next-btn');
    nextButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const parentPane = btn.closest('.quiz-step');
            if (!parentPane) return;
            
            const inputs = parentPane.querySelectorAll('.lead-input');
            let isValid = true;
            
            inputs.forEach(input => {
                if (input.required && !input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'var(--brand-red)';
                    setTimeout(() => {
                        input.style.borderColor = '';
                    }, 2000);
                }
            });
            
            if (isValid && inputs.length > 0) {
                inputs.forEach(input => {
                    const key = input.getAttribute('data-question');
                    if (key) {
                        userAnswers[key] = input.value.trim();
                    }
                });
                
                const nextStepId = btn.getAttribute('data-next');
                const nextPane = document.getElementById(nextStepId);
                if (parentPane && nextPane) {
                    parentPane.style.display = 'none';
                    nextPane.style.display = 'block';
                    const stepMatch = nextStepId.match(/\d+/);
                    if (stepMatch) {
                        currentStep = parseInt(stepMatch[0]);
                    } else if (nextStepId.includes('email')) {
                        currentStep = 13;
                    }
                }
            }
        });
    });

    // 2. Submit Lead Info Form & Macro Calculations
    const leadForm = document.getElementById('quiz-form');
    if (leadForm) {
        leadForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Verify inputs
            const emailInput = document.getElementById('quiz-email');
            const phoneInput = document.getElementById('quiz-phone');
            const email = emailInput ? emailInput.value.trim() : '';
            const phone = phoneInput ? phoneInput.value.trim() : '';

            if (!email || !phone) {
                alert('Please fill out all contact information.');
                return;
            }

            // Phone validation
            const cleanPhone = phone.replace(/\D/g, '');
            if (cleanPhone.length < 10 || cleanPhone.length > 15) {
                alert('Please enter a valid phone number (minimum 10 digits).');
                if (phoneInput) phoneInput.focus();
                return;
            }

            userAnswers['Email'] = email;
            userAnswers['Phone'] = phone;

            // Extract numeric values from quiz answers
            const age = parseInt(userAnswers['How old are you?']) || 35;
            const heightFeet = parseInt(userAnswers['Height (Feet)']) || 5;
            const heightInches = parseInt(userAnswers['Height (Inches)']) || 9;
            
            const rawWeight = userAnswers['What is your current weight?'] || '170';
            const weightNum = parseFloat(rawWeight.replace(/[^\d.]/g, '')) || 170;

            const gender = userAnswers['3. Are you:'] || 'Female';
            const activityText = userAnswers['6. Which best describes your activity level?'] || 'Lightly active';

            // Determine activity multiplier
            let activityMultiplier = 1.375;
            if (activityText.toLowerCase().includes('sitting') || activityText.toLowerCase().includes('desk')) {
                activityMultiplier = 1.2;
            } else if (activityText.toLowerCase().includes('light')) {
                activityMultiplier = 1.375;
            } else if (activityText.toLowerCase().includes('moderate')) {
                activityMultiplier = 1.55;
            } else if (activityText.toLowerCase().includes('very')) {
                activityMultiplier = 1.725;
            }

            // Mifflin-St Jeor Formula
            const weightKg = weightNum * 0.45359237;
            const totalHeightInches = (heightFeet * 12) + heightInches;
            const heightCm = totalHeightInches * 2.54;

            let BMR = 0;
            if (gender === 'Male') {
                BMR = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5;
            } else {
                BMR = (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
            }

            // TDEE & Target Calories
            const TDEE = Math.round(BMR * activityMultiplier);
            let targetCalories = Math.round(TDEE - 500);

            // Safe minimums
            if (gender === 'Female' && targetCalories < 1200) targetCalories = 1200;
            if (gender === 'Male' && targetCalories < 1500) targetCalories = 1500;

            // Macros
            let proteinGrams = Math.round(weightNum);
            if (gender === 'Male') {
                if (proteinGrams > 220) proteinGrams = 220;
            } else {
                if (proteinGrams > 160) proteinGrams = 160;
            }

            if (proteinGrams * 4 > targetCalories * 0.4) {
                proteinGrams = Math.round((targetCalories * 0.4) / 4);
            }

            const fatGrams = Math.round((targetCalories * 0.275) / 9);
            const proteinCal = proteinGrams * 4;
            const fatCal = fatGrams * 9;
            const carbCal = targetCalories - proteinCal - fatCal;
            const carbGrams = Math.max(20, Math.round(carbCal / 4));

            // Portion Tier
            let calculatedTier = 'L';
            if (targetCalories < 1700) {
                calculatedTier = 'S';
            } else if (targetCalories > 2300) {
                calculatedTier = 'XL';
            }

            // Store calculated plan details
            Object.assign(calculatedPlan, {
                calories: targetCalories,
                protein: proteinGrams,
                carbs: carbGrams,
                fat: fatGrams,
                bmr: Math.round(BMR),
                tdee: TDEE,
                tier: calculatedTier
            });

            // Local Storage Sync
            localStorage.setItem('ffp_user_answers', JSON.stringify({
                "First Name": userAnswers["What's your first name?"] || "Athlete",
                "Last Name": userAnswers["What's your last name?"] || "",
                Email: email,
                Phone: phone,
                Weight: weightNum,
                Age: age,
                Gender: gender,
                "Height Feet": heightFeet,
                "Height Inches": heightInches,
                Goal: "Fat Loss",
                "Weight Goal": userAnswers["How much weight would you like to lose?"] || "10-20 lbs",
                Activity: activityMultiplier
            }));
            localStorage.setItem('ffp_macro_plan', JSON.stringify(calculatedPlan));
            localStorage.setItem('ffp_results_view_count', '0');

            // Hide Step 13, Show loading step pane
            const stepEmail = document.getElementById('quiz-step-email');
            const loadingPane = document.getElementById('quiz-step-loading');
            if (stepEmail) stepEmail.style.display = 'none';
            if (loadingPane) loadingPane.style.display = 'block';

            let currentProgress = 0;
            const progressBar = document.getElementById('loading-bar-progress');
            const progressText = document.getElementById('loading-step-text');
            
            const loadingStages = [
                { limit: 20, text: "Analyzing your daily calorie needs..." },
                { limit: 40, text: "Calculating macronutrient splits (Protein/Carbs/Fat)..." },
                { limit: 60, text: "Creating customized meal portion guides..." },
                { limit: 80, text: "Syncing with your local kitchen database..." },
                { limit: 99, text: "Final Touches on Your Meal Plan..." }
            ];

            const progressInterval = setInterval(() => {
                if (currentProgress < 99) {
                    currentProgress += 1;
                    if (progressBar) progressBar.style.width = currentProgress + '%';
                    
                    const stage = loadingStages.find(s => currentProgress <= s.limit);
                    if (stage && progressText) {
                        progressText.textContent = stage.text;
                    }
                }
            }, 45);

            function finishProgressAndReveal() {
                clearInterval(progressInterval);
                if (progressBar) progressBar.style.width = '100%';
                if (progressText) progressText.textContent = "Plan generated! Opening your results...";
                
                setTimeout(() => {
                    if (loadingPane) loadingPane.style.display = 'none';
                    revealDashboardResults();
                }, 350);
            }

            try {
                // Calculate featured portions
                const mealTargetP = (proteinGrams - 25) / 4;
                const mealTargetC = (carbGrams - 20) / 4;
                const mealTargetF = (fatGrams - 10) / 4;
                
                const eggsDetails = calculateMealPortionsAndPricing('Morning Grand Slam', mealTargetP, mealTargetC, mealTargetF);
                const steakDetails = calculateMealPortionsAndPricing('Steak n Mash', mealTargetP, mealTargetC, mealTargetF);
                const chickenDetails = calculateMealPortionsAndPricing('Teriyaki Chicken', mealTargetP, mealTargetC, mealTargetF);

                const budgets = calculateStoreBudgets({
                    protein: proteinGrams,
                    carbs: carbGrams,
                    fat: fatGrams,
                    tier: calculatedPlan.tier
                });

                const payload = {
                    ...userAnswers,
                    ...calculatedPlan,
                    lead_status: "quiz-completed",
                    pipeline_stage: "Quiz Completed",
                    source: "Finally Fit Post Falls Landing Page",
                    studio: 'At Home',
                    gym: 'At Home',
                    eggs_meal_name: eggsDetails.name,
                    eggs_meal_portions: eggsDetails.detailsHtml,
                    eggs_recipe_portions: eggsDetails.recipePortions,
                    eggs_meal_protein: eggsDetails.protein,
                    eggs_meal_carbs: eggsDetails.carbs,
                    eggs_meal_fat: eggsDetails.fat,
                    eggs_meal_calories: eggsDetails.calories,
                    
                    steak_meal_name: steakDetails.name,
                    steak_meal_price: steakDetails.price,
                    steak_meal_portions: steakDetails.detailsHtml,
                    steak_recipe_portions: steakDetails.recipePortions,
                    steak_meal_protein: steakDetails.protein,
                    steak_meal_carbs: steakDetails.carbs,
                    steak_meal_fat: steakDetails.fat,
                    steak_meal_calories: steakDetails.calories,
                    
                    chicken_meal_name: chickenDetails.name,
                    chicken_meal_price: chickenDetails.price,
                    chicken_meal_portions: chickenDetails.detailsHtml,
                    chicken_recipe_portions: chickenDetails.recipePortions,
                    chicken_meal_protein: chickenDetails.protein,
                    chicken_meal_carbs: chickenDetails.carbs,
                    chicken_meal_fat: chickenDetails.fat,
                    chicken_meal_calories: chickenDetails.calories,

                    super1_grocery_list: budgets.super1List,
                    super1_total_cost: budgets.super1Total,
                    yokes_grocery_list: budgets.yokesList,
                    yokes_total_cost: budgets.yokesTotal,
                    walmart_grocery_list: budgets.walmartList,
                    walmart_total_cost: budgets.walmartTotal
                };

                await fetch(MAKE_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } catch (err) {
                console.warn('Webhook transmission error:', err);
            } finally {
                finishProgressAndReveal();
            }
        });
    }

    // 3. Results Dashboard Renderer
    function revealDashboardResults() {
        const answers = JSON.parse(localStorage.getItem('ffp_user_answers')) || userAnswers;
        const plan = JSON.parse(localStorage.getItem('ffp_macro_plan')) || calculatedPlan;
        
        // Hide Main Hero Header and Hero Grid
        const heroSection = document.querySelector('.hero-sec');
        if (heroSection) {
            heroSection.style.padding = '40px 0 60px 0';
        }
        
        const heroGrid = document.querySelector('.quiz-hero-container');
        if (heroGrid) {
            heroGrid.style.display = 'none';
        }

        // Target Results Pane
        const resultsPane = document.getElementById('results-pane');
        if (resultsPane) {
            resultsPane.style.display = 'block';
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

        // Populate personalized roadmap profile
        const roadmapWeight = document.getElementById('roadmap-current-weight');
        const roadmapWeightLoss = document.getElementById('roadmap-weight-loss');
        const roadmapActivity = document.getElementById('roadmap-activity');
        const roadmapCalories = document.getElementById('roadmap-calories');
        const roadmapTimeline = document.getElementById('roadmap-timeline');

        const currentWeight = answers['Weight'] || '--';
        const weightLossText = answers['Weight Goal'] || '10-20 lbs';
        
        let weightLossDigits = '10-20';
        let timelineWeeks = '8-12';
        if (weightLossText.includes('1-10')) {
            weightLossDigits = '1-10';
            timelineWeeks = '4-6';
        } else if (weightLossText.includes('10-20')) {
            weightLossDigits = '10-20';
            timelineWeeks = '8-12';
        } else if (weightLossText.includes('20-30')) {
            weightLossDigits = '20-30';
            timelineWeeks = '12-16';
        } else if (weightLossText.includes('30+')) {
            weightLossDigits = '30+';
            timelineWeeks = '16+';
        }

        let activityLabel = 'Lightly Active';
        const rawActivity = answers['Activity'] || '1.375';
        const rawActivityStr = String(rawActivity).toLowerCase();
        if (rawActivityStr.includes('sitting') || rawActivityStr.includes('desk') || rawActivityStr === '1.2') {
            activityLabel = 'Desk Job / Inactive';
        } else if (rawActivityStr.includes('lightly') || rawActivityStr === '1.375') {
            activityLabel = 'Lightly Active';
        } else if (rawActivityStr.includes('moderately') || rawActivityStr === '1.55') {
            activityLabel = 'Moderately Active';
        } else if (rawActivityStr.includes('very') || rawActivityStr === '1.725') {
            activityLabel = 'Very Active';
        }

        if (roadmapWeight) roadmapWeight.textContent = currentWeight;
        if (roadmapWeightLoss) roadmapWeightLoss.textContent = weightLossDigits;
        if (roadmapActivity) roadmapActivity.textContent = activityLabel;
        if (roadmapCalories) roadmapCalories.textContent = plan.calories;
        if (roadmapTimeline) roadmapTimeline.textContent = timelineWeeks;

        // Render dynamic Client Weekly Meal Plan metadata
        const planClientNameNode = document.getElementById('plan-client-name');
        const planWeekDateNode = document.getElementById('plan-week-date');

        if (planClientNameNode) {
            planClientNameNode.textContent = `${answers['First Name'] || 'Lidiya'} ${answers['Last Name'] || 'Ervin'}`;
        }

        if (planWeekDateNode) {
            const today = new Date();
            const dayOfWeek = today.getDay();
            const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
            const monday = new Date(today);
            monday.setDate(today.getDate() + distanceToMonday);

            const options = { month: 'long', day: 'numeric', year: 'numeric' };
            planWeekDateNode.textContent = monday.toLocaleDateString('en-US', options);
        }

        // Render dynamic Daily Meal Plan Blueprint
        renderDailyPlanDays();

        // Render new personalized elements
        const transNameNode = document.getElementById('trans-user-name');
        if (transNameNode) {
            transNameNode.textContent = (answers['First Name'] || 'ATHLETE').toUpperCase();
        }

        const bookingGoalCopyNode = document.getElementById('booking-goal-copy');
        if (bookingGoalCopyNode) {
            const rawGoal = answers['Weight Goal'] || 'weight';
            let goalPhrase = 'losing weight';
            if (rawGoal.includes('lbs') || rawGoal.includes('+')) {
                goalPhrase = `losing ${rawGoal}`;
            }
            bookingGoalCopyNode.textContent = `We'll review the plan you just received, talk about your goals, and I'll show you what your first 28 days toward ${goalPhrase} could look like.`;
        }

        // Update Strategy Session booking CTA links
        const bookingBtns = document.querySelectorAll('.cta-btn-strategy');
        bookingBtns.forEach(btn => {
            let bookingUrl = STRATEGY_SESSION_BOOKING_URL;
            if (answers['Email']) {
                const email = encodeURIComponent(answers['Email']);
                bookingUrl += `?email=${email}`;
            }
            btn.href = bookingUrl;
        });

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
            { tag: "BREAKFAST", name: "Steak and Eggs", img: "/assets/steak_eggs.png", class: "tag-breakfast" },
            { tag: "LUNCH #1", name: "Teriyaki Chicken", img: "/assets/teriyaki_chicken.png", class: "tag-lunch" },
            { tag: "LUNCH #2", name: "Chicken Fried Rice", img: "/assets/chicken_fried_rice.png", class: "tag-lunch" },
            { tag: "DINNER", name: "Steak n Mash", img: "/assets/steak_n_mash.png", class: "tag-dinner" },
            { tag: "SNACK", name: "Meat & Cheese-To-Go (Pack of 5)", img: "/assets/meat_cheese_to_go.png", class: "tag-snack" }
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
            <title>Finally Fit Post Falls - Grocery List</title>
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
                <h1 class="brand-title">FINALLY FIT POST FALLS</h1>
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

    // FAQ Accordion click toggles
    function setupFaqAccordion() {
        const triggers = document.querySelectorAll('.faq-trigger');
        triggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const item = trigger.closest('.faq-item');
                const content = item.querySelector('.faq-content');
                const isOpen = item.classList.contains('active');
                
                // Close all other FAQ items first
                document.querySelectorAll('.faq-item').forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const otherContent = otherItem.querySelector('.faq-content');
                    if (otherContent) {
                        otherContent.style.maxHeight = '0px';
                        otherContent.style.padding = '0 24px';
                    }
                });
                
                // Toggle clicked item
                if (!isOpen) {
                    item.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + 'px';
                    content.style.padding = '0 24px 20px 24px';
                }
            });
        });
    }

    function calculateStoreBudgets(plan) {
        const targetP = plan.protein || 160;
        const targetC = plan.carbs || 140;
        const targetF = plan.fat || 55;
        const tier = plan.tier || 'S';

        // Calculate meal structures
        const mealTargetP = (targetP - 25) / 4;
        const mealTargetC = (targetC - 20) / 4;
        const mealTargetF = (targetF - 10) / 4;

        const chickenDetails = calculateMealPortionsAndPricing('Teriyaki Chicken', mealTargetP, mealTargetC, mealTargetF);
        const steakDetails = calculateMealPortionsAndPricing('Steak n Mash', mealTargetP, mealTargetC, mealTargetF);

        // Get cooked portions
        const chickenBreastOz = chickenDetails.portions.protein.oz;
        const chickenThighOz = chickenDetails.portions.protein.oz; // Ranch Chicken Thigh has same protein target
        const triTipOz = steakDetails.portions.protein.oz;
        const jasmineRiceOz = chickenDetails.portions.carb.oz;
        const mashedPotatoOz = steakDetails.portions.carb.oz;

        // Calculate 7-day cooked needs
        const totalChickenBreastCookedOz = chickenBreastOz * 7;
        const totalChickenThighCookedOz = chickenThighOz * 7;
        const totalTriTipCookedOz = triTipOz * 7;
        const totalRiceCookedOz = jasmineRiceOz * 14; // used in lunch 1 and dinner
        const totalMashedPotatoCookedOz = mashedPotatoOz * 7; // used in dinner

        // Convert cooked to raw weights
        const rawChickenBreastLbs = (totalChickenBreastCookedOz / 0.769) / 16;
        const rawChickenThighLbs = (totalChickenThighCookedOz / 0.727) / 16;
        const rawTriTipLbs = (totalTriTipCookedOz / 0.708) / 16;
        const rawDryRiceLbs = (totalRiceCookedOz / 3.0) / 16; // 1oz dry yields 3oz cooked
        
        // Yogurt and Granola needs
        const yogurtOz = (tier === 'S') ? 35 : 56;
        const yogurtTubs = Math.ceil(yogurtOz / 32); // 32oz (2lb) tubs
        const granolaOz = (tier === 'S') ? 7 : 14;
        const granolaBags = Math.ceil(granolaOz / 11); // 11oz bags

        // Mashed Potato packets (1.5lb / 24oz per packet)
        const mashedPotatoPacks = Math.ceil(totalMashedPotatoCookedOz / 24);

        // Produce and Frozen
        const bellPeppersCount = 4;
        const onionsLbs = 2;
        const babyCarrotsBags = 1; // 1lb bag
        const mixedVeggiesBags = 2; // 12oz bags
        const peasCarrotsBags = 2; // 12oz bags
        
        // Broccoli bags calculations based on store pack sizes:
        // Super 1: 24oz bag, Yokes: 16oz bag, Walmart: 32oz bag
        // 7 cups of broccoli = approx 21oz of broccoli needed
        const broccoliOzNeeded = 21;
        const super1BroccoliBags = Math.ceil(broccoliOzNeeded / 24);
        const yokesBroccoliBags = Math.ceil(broccoliOzNeeded / 16);
        const walmartBroccoliBags = Math.ceil(broccoliOzNeeded / 32);

        // Helper to format item line
        function itemLine(name, qty, cost) {
            return `- **${name}**: ${qty} (Est. $${cost.toFixed(2)})`;
        }

        // --- SUPER 1 BUDGET ---
        const super1Cost = {
            triTip: rawTriTipLbs * 10.98,
            chickenBreast: rawChickenBreastLbs * 2.98,
            chickenThigh: rawChickenThighLbs * 2.98,
            yogurt: yogurtTubs * 6.98,
            rice: Math.ceil(rawDryRiceLbs / 2) * 3.48, // sold as 2lb bags
            granola: granolaBags * 2.98,
            mashedPotato: mashedPotatoPacks * 2.98, // fallback to Walmart price
            bellPepper: bellPeppersCount * 1.50,
            onion: onionsLbs * 1.79,
            babyCarrots: babyCarrotsBags * 2.98,
            mixedVeggies: mixedVeggiesBags * 1.18,
            peasCarrots: peasCarrotsBags * 2.58,
            broccoli: super1BroccoliBags * 2.88
        };
        const super1Total = Object.values(super1Cost).reduce((a, b) => a + b, 0);
        const super1List = [
            itemLine("Tri-Tip", `${rawTriTipLbs.toFixed(1)} lbs raw`, super1Cost.triTip),
            itemLine("Chicken Breast", `${rawChickenBreastLbs.toFixed(1)} lbs raw`, super1Cost.chickenBreast),
            itemLine("Chicken Thighs", `${rawChickenThighLbs.toFixed(1)} lbs raw`, super1Cost.chickenThigh),
            itemLine("Vanilla Oikos Yogurt", `${yogurtTubs} x 2lb tub(s)`, super1Cost.yogurt),
            itemLine("Jasmine Rice", `${Math.ceil(rawDryRiceLbs / 2) * 2} lbs (dry)`, super1Cost.rice),
            itemLine("Granola", `${granolaBags} x 11oz bag(s)`, super1Cost.granola),
            itemLine("Mashed Potatoes", `${mashedPotatoPacks} x 1.5lb pack(s)`, super1Cost.mashedPotato),
            itemLine("Bell Peppers", `${bellPeppersCount} count`, super1Cost.bellPepper),
            itemLine("Onions", `${onionsLbs} lbs`, super1Cost.onion),
            itemLine("Baby Carrots", `${babyCarrotsBags} x 1lb bag(s)`, super1Cost.babyCarrots),
            itemLine("Frozen Mixed Veggies", `${mixedVeggiesBags} x 12oz bag(s)`, super1Cost.mixedVeggies),
            itemLine("Frozen Peas & Carrots", `${peasCarrotsBags} x 12oz bag(s)`, super1Cost.peasCarrots),
            itemLine("Frozen Broccoli", `${super1BroccoliBags} x 24oz bag(s)`, super1Cost.broccoli)
        ].join('\n');

        // --- YOKE'S BUDGET ---
        const yokesCost = {
            triTip: rawTriTipLbs * 8.99,
            chickenBreast: rawChickenBreastLbs * 2.99,
            chickenThigh: rawChickenThighLbs * 3.99,
            yogurt: yogurtTubs * 7.29,
            rice: Math.ceil(rawDryRiceLbs / 2) * 3.69, // sold as 2lb bags
            granola: granolaBags * 3.69,
            mashedPotato: mashedPotatoPacks * 5.29,
            bellPepper: bellPeppersCount * 1.79,
            onion: onionsLbs * 0.99,
            babyCarrots: babyCarrotsBags * 1.79,
            mixedVeggies: mixedVeggiesBags * 1.79,
            peasCarrots: peasCarrotsBags * 1.18,
            broccoli: yokesBroccoliBags * 2.49
        };
        const yokesTotal = Object.values(yokesCost).reduce((a, b) => a + b, 0);
        const yokesList = [
            itemLine("Tri-Tip", `${rawTriTipLbs.toFixed(1)} lbs raw`, yokesCost.triTip),
            itemLine("Chicken Breast", `${rawChickenBreastLbs.toFixed(1)} lbs raw`, yokesCost.chickenBreast),
            itemLine("Chicken Thighs", `${rawChickenThighLbs.toFixed(1)} lbs raw`, yokesCost.chickenThigh),
            itemLine("Vanilla Oikos Yogurt", `${yogurtTubs} x 2lb tub(s)`, yokesCost.yogurt),
            itemLine("Jasmine Rice", `${Math.ceil(rawDryRiceLbs / 2) * 2} lbs (dry)`, yokesCost.rice),
            itemLine("Granola", `${granolaBags} x 11oz bag(s)`, yokesCost.granola),
            itemLine("Mashed Potatoes", `${mashedPotatoPacks} x 1.5lb pack(s)`, yokesCost.mashedPotato),
            itemLine("Bell Peppers", `${bellPeppersCount} count`, yokesCost.bellPepper),
            itemLine("Onions", `${onionsLbs} lbs`, yokesCost.onion),
            itemLine("Baby Carrots", `${babyCarrotsBags} x 1lb bag(s)`, yokesCost.babyCarrots),
            itemLine("Frozen Mixed Veggies", `${mixedVeggiesBags} x 12oz bag(s)`, yokesCost.mixedVeggies),
            itemLine("Frozen Peas & Carrots", `${peasCarrotsBags} x 12oz bag(s)`, yokesCost.peasCarrots),
            itemLine("Frozen Broccoli", `${yokesBroccoliBags} x 16oz bag(s)`, yokesCost.broccoli)
        ].join('\n');

        // --- WALMART BUDGET ---
        const walmartCost = {
            triTip: rawTriTipLbs * 10.72,
            chickenBreast: rawChickenBreastLbs * 2.57,
            chickenThigh: rawChickenThighLbs * 3.22,
            yogurt: yogurtTubs * 6.27,
            rice: Math.ceil(rawDryRiceLbs / 5) * 6.88, // sold as 5lb bag
            granola: granolaBags * 2.67,
            mashedPotato: mashedPotatoPacks * 2.98,
            bellPepper: bellPeppersCount * 1.50,
            onion: onionsLbs * 0.96,
            babyCarrots: babyCarrotsBags * 1.44,
            mixedVeggies: mixedVeggiesBags * 0.98,
            peasCarrots: peasCarrotsBags * 0.98,
            broccoli: walmartBroccoliBags * 2.28
        };
        const walmartTotal = Object.values(walmartCost).reduce((a, b) => a + b, 0);
        const walmartList = [
            itemLine("Tri-Tip", `${rawTriTipLbs.toFixed(1)} lbs raw`, walmartCost.triTip),
            itemLine("Chicken Breast", `${rawChickenBreastLbs.toFixed(1)} lbs raw`, walmartCost.chickenBreast),
            itemLine("Chicken Thighs", `${rawChickenThighLbs.toFixed(1)} lbs raw`, walmartCost.chickenThigh),
            itemLine("Vanilla Oikos Yogurt", `${yogurtTubs} x 2lb tub(s)`, walmartCost.yogurt),
            itemLine("Jasmine Rice", `${Math.ceil(rawDryRiceLbs / 5) * 5} lbs (dry)`, walmartCost.rice),
            itemLine("Granola", `${granolaBags} x 11oz bag(s)`, walmartCost.granola),
            itemLine("Mashed Potatoes", `${mashedPotatoPacks} x 1.5lb pack(s)`, walmartCost.mashedPotato),
            itemLine("Bell Peppers", `${bellPeppersCount} count`, walmartCost.bellPepper),
            itemLine("Onions", `${onionsLbs} lbs`, walmartCost.onion),
            itemLine("Baby Carrots", `${babyCarrotsBags} x 1lb bag(s)`, walmartCost.babyCarrots),
            itemLine("Frozen Mixed Veggies", `${mixedVeggiesBags} x 12oz bag(s)`, walmartCost.mixedVeggies),
            itemLine("Frozen Peas & Carrots", `${peasCarrotsBags} x 12oz bag(s)`, walmartCost.peasCarrots),
            itemLine("Frozen Broccoli", `${walmartBroccoliBags} x 32oz bag(s)`, walmartCost.broccoli)
        ].join('\n');

        return {
            super1List, super1Total: super1Total.toFixed(2),
            yokesList, yokesTotal: yokesTotal.toFixed(2),
            walmartList, walmartTotal: walmartTotal.toFixed(2)
        };
    }

    // Check if user has already calculated macros and handle the 3-reload limit
    const savedAnswers = localStorage.getItem('ffp_user_answers');
    const savedPlan = localStorage.getItem('ffp_macro_plan');
    if (savedAnswers && savedPlan) {
        let viewCount = parseInt(localStorage.getItem('ffp_results_view_count')) || 0;
        if (viewCount < 3) {
            localStorage.setItem('ffp_results_view_count', viewCount + 1);
            revealDashboardResults();
        } else {
            // Reached reload limit, reset local storage to show fresh quiz
            localStorage.removeItem('ffp_user_answers');
            localStorage.removeItem('ffp_macro_plan');
            localStorage.removeItem('ffp_results_view_count');
        }
    }
});
