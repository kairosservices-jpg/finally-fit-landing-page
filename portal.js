/**
 * Finally Fit - Customer Portal Controller (portal.js)
 * Manages weekly meal configurations, swaps, dynamic pricing math, and Make webhooks.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Ingredients & Meals Databases (Duplicated from main.js for calculations)
    const INGREDIENTS = {
        // Proteins
        'sirloin': { name: "Sirloin Steak", category: "protein", price_per_oz: 0.650, protein_per_oz: 7.0, carbs_per_oz: 0, fat_per_oz: 2.0, calories_per_oz: 46, yield_ratio: 0.708 }, // 5.65 raw -> 4oz cooked (4/5.65 = 0.708)
        'ground_turkey': { name: "Turkey Meatballs", category: "protein", price_per_oz: 0.271, protein_per_oz: 7.0, carbs_per_oz: 0, fat_per_oz: 2.5, calories_per_oz: 51, yield_ratio: 1.000 },
        'chicken_breast': { name: "Chicken Breast", category: "protein", price_per_oz: 0.165, protein_per_oz: 8.5, carbs_per_oz: 0, fat_per_oz: 1.0, calories_per_oz: 43, yield_ratio: 0.769 }, // 5.2 raw -> 4oz cooked (4/5.2 = 0.769)
        'chicken_thigh': { name: "Chicken Thigh", category: "protein", price_per_oz: 0.107, protein_per_oz: 7.0, carbs_per_oz: 0, fat_per_oz: 3.0, calories_per_oz: 55, yield_ratio: 0.727 }, // 5.5 raw -> 4oz cooked (4/5.5 = 0.727)
        'eggs': { name: "Scrambled Eggs", category: "protein", price_per_oz: 0.180, protein_per_oz: 3.6, carbs_per_oz: 0.3, fat_per_oz: 2.8, calories_per_oz: 41, yield_ratio: 1.000 },
        'greek_yogurt': { name: "Vanilla Greek Yogurt", category: "protein", price_per_oz: 0.150, protein_per_oz: 3.0, carbs_per_oz: 1.0, fat_per_oz: 0, calories_per_oz: 16, yield_ratio: 1.000 },
        'cottage_cheese': { name: "Cottage Cheese", category: "protein", price_per_oz: 0.120, protein_per_oz: 3.5, carbs_per_oz: 1.0, fat_per_oz: 0.5, calories_per_oz: 23, yield_ratio: 1.000 },
        'lean_meat': { name: "Lean Meat", category: "protein", price_per_oz: 0.300, protein_per_oz: 7.5, carbs_per_oz: 0, fat_per_oz: 1.5, calories_per_oz: 45, yield_ratio: 1.000 },
        
        // Carbs
        'mashed_potato': { name: "Garlic Mashed Potato", category: "carb", price_per_oz: 0.103, protein_per_oz: 0.6, carbs_per_oz: 5.0, fat_per_oz: 1.0, calories_per_oz: 31, yield_ratio: 1.000 },
        'sweet_potato': { name: "Mashed Sweet Potato", category: "carb", price_per_oz: 0.083, protein_per_oz: 0.6, carbs_per_oz: 6.0, fat_per_oz: 0, calories_per_oz: 26, yield_ratio: 1.000 },
        'jasmine_rice': { name: "Jasmine Rice", category: "carb", price_per_oz: 0.021, protein_per_oz: 0.7, carbs_per_oz: 8.0, fat_per_oz: 0, calories_per_oz: 35, yield_ratio: 1.000 },
        'fried_rice': { name: "Fried Rice Mix", category: "carb", price_per_oz: 0.045, protein_per_oz: 1.0, carbs_per_oz: 8.0, fat_per_oz: 0.5, calories_per_oz: 40, yield_ratio: 1.000 },
        'pasta': { name: "Pasta Noodles", category: "carb", price_per_oz: 0.036, protein_per_oz: 1.5, carbs_per_oz: 8.0, fat_per_oz: 0.2, calories_per_oz: 40, yield_ratio: 1.000 },
        'granola': { name: "Granola", category: "carb", price_per_oz: 0.100, protein_per_oz: 0.5, carbs_per_oz: 6.0, fat_per_oz: 1.0, calories_per_oz: 35, yield_ratio: 1.000 },
        'pretzel': { name: "Pretzel Sticks", category: "carb", price_per_oz: 0.080, protein_per_oz: 0.8, carbs_per_oz: 7.0, fat_per_oz: 0.2, calories_per_oz: 33, yield_ratio: 1.000 },
        
        // Veggies / Others
        'broccoli': { name: "Broccoli", category: "veg", price_per_oz: 0.133, protein_per_oz: 0.8, carbs_per_oz: 2.0, fat_per_oz: 0, calories_per_oz: 11, yield_ratio: 1.000 },
        'green_beans': { name: "Green Beans", category: "veg", price_per_oz: 0.099, protein_per_oz: 0.5, carbs_per_oz: 2.0, fat_per_oz: 0, calories_per_oz: 10, yield_ratio: 1.000 },
        'mixed_veg': { name: "Mixed Vegetables", category: "veg", price_per_oz: 0.110, protein_per_oz: 0.6, carbs_per_oz: 2.0, fat_per_oz: 0.1, calories_per_oz: 11, yield_ratio: 1.000 }
    };

    const MEAL_TEMPLATES = {
        // Breakfast
        'Steak and Eggs': { protein_id: 'sirloin', carb_id: 'mashed_potato', veg_id: 'green_beans', category: 'breakfast', image_url: 'assets/steak_eggs.png' },
        'Loaded Breakfast Bowl': { protein_id: 'eggs', carb_id: 'mashed_potato', veg_id: 'broccoli', category: 'breakfast', image_url: 'assets/KairosMealPrep-04.jpg' },
        'Yogurt Parfait': { protein_id: 'greek_yogurt', carb_id: 'granola', veg_id: 'green_beans', category: 'breakfast', image_url: 'assets/yogurt_parfait.png' },
        'Honey Sweet Cottage Cheese': { protein_id: 'cottage_cheese', carb_id: 'granola', veg_id: 'green_beans', category: 'breakfast', image_url: 'assets/KairosMealPrep-03.jpg' },
        
        // Snack
        'Meat & Cheese-To-Go (Pack of 5)': { protein_id: 'lean_meat', carb_id: 'pretzel', veg_id: 'green_beans', category: 'snack', image_url: 'assets/meat_cheese_to_go.png' },

        // Main Meals (Lunch/Dinner)
        'Steak n Mash': { protein_id: 'sirloin', carb_id: 'mashed_potato', veg_id: 'green_beans', category: 'lunch', image_url: 'assets/steak_n_mash.png' },
        'Chicken Fried Rice': { protein_id: 'chicken_breast', carb_id: 'fried_rice', veg_id: 'green_beans', category: 'lunch', image_url: 'assets/chicken_fried_rice.png' },
        'Chile Margarita': { protein_id: 'chicken_breast', carb_id: 'jasmine_rice', veg_id: 'mixed_veg', category: 'lunch', image_url: 'assets/chile_margarita.png' },
        'Asian Zing': { protein_id: 'chicken_thigh', carb_id: 'jasmine_rice', veg_id: 'mixed_veg', category: 'lunch', image_url: 'assets/asian_zing.png' },
        'BBQ Chicken Thigh': { protein_id: 'chicken_thigh', carb_id: 'sweet_potato', veg_id: 'green_beans', category: 'dinner', image_url: 'assets/bbq_chicken.png' },
        'Spaghetti and Meatballs': { protein_id: 'ground_turkey', carb_id: 'pasta', veg_id: 'broccoli', category: 'dinner', image_url: 'assets/spaghetti_meatballs.png' },
        'Roasted Ranch': { protein_id: 'chicken_thigh', carb_id: 'jasmine_rice', veg_id: 'mixed_veg', category: 'lunch', image_url: 'assets/roasted_ranch.png' },
        'Mashed Buffalo': { protein_id: 'chicken_breast', carb_id: 'mashed_potato', veg_id: 'mixed_veg', category: 'lunch', image_url: 'assets/mashed_buffalo.jpg' },
        'Chipotle Burrito Bowl': { protein_id: 'chicken_breast', carb_id: 'jasmine_rice', veg_id: 'mixed_veg', category: 'lunch', image_url: 'assets/chipotle_bowl.png' },
        'Pesto Chicken Pasta': { protein_id: 'chicken_breast', carb_id: 'pasta', veg_id: 'broccoli', category: 'dinner', image_url: 'assets/pesto_chicken_pasta.png' },
        'Teriyaki Chicken': { protein_id: 'chicken_breast', carb_id: 'jasmine_rice', veg_id: 'broccoli', category: 'lunch', image_url: 'assets/teriyaki_chicken.png' },
        'Sweet Chili Chicken Thigh': { protein_id: 'chicken_thigh', carb_id: 'jasmine_rice', veg_id: 'green_beans', category: 'dinner', image_url: 'assets/sweet_chili_chicken.png' },
        'Buttery Chicken': { protein_id: 'chicken_breast', carb_id: 'jasmine_rice', veg_id: 'broccoli', category: 'lunch', image_url: 'assets/chile_margarita.png' },
        'Chicken Alfredo': { protein_id: 'chicken_breast', carb_id: 'pasta', veg_id: 'broccoli', category: 'dinner', image_url: 'assets/chicken_alfredo.png' }
    };

    const BASE_PREP_FEE = 5.00;
    const INGREDIENT_MARKUP = 1.0; 

    // Connection Settings variables (loaded from localStorage)
    let connectionMode = 'simulation';
    let supabaseUrl = '';
    let supabaseKey = '';
    let makeGetProfileUrl = 'https://hook.us2.make.com/placeholder_get_profile';
    let makePostSelectionsUrl = 'https://hook.us2.make.com/placeholder_save_selections';

    // 2. State Variables
    let customerData = null;
    let weeklySelections = {}; // Maps "Day-Slot" -> MealTemplateName
    let isSkipped = false;
    let activeSwapTarget = null; // { day, slot }

    const slots = ['breakfast', 'lunch_1', 'lunch_2', 'dinner', 'snack'];
    
    const SLOT_LABELS = {
        'breakfast': 'BREAKFAST',
        'lunch_1': 'LUNCH #1',
        'lunch_2': 'LUNCH #2',
        'dinner': 'DINNER',
        'snack': 'SNACK'
    };

    // Helper to calculate target macros for snack vs main meals
    function getSlotTargets(slot, totalProtein, totalCarbs, totalFat) {
        const isSnack = slot === 'snack';
        if (isSnack) {
            return {
                protein: 25,
                carbs: 20,
                fat: 10
            };
        } else {
            return {
                protein: (totalProtein - 25) / 4,
                carbs: (totalCarbs - 20) / 4,
                fat: (totalFat - 10) / 4
            };
        }
    }

    // 3. Mifflins portion and pricing calculator
    function calculateMealPortionsAndPricing(mealName, targetMealProtein, targetMealCarbs, targetMealFat, fitnessGoal) {
        if (mealName === 'Homemade Meal') {
            return {
                name: "Homemade Meal",
                price: 0.00,
                protein: Math.round(targetMealProtein),
                carbs: Math.round(targetMealCarbs),
                fat: Math.round(targetMealFat),
                calories: Math.round((targetMealProtein * 4) + (targetMealCarbs * 4) + (targetMealFat * 9)),
                portionsHtml: "Prepare at home"
            };
        }

        const template = MEAL_TEMPLATES[mealName];
        if (!template) {
            return { name: mealName, price: 9.95, protein: 30, carbs: 30, fat: 10, calories: 330, detailsHtml: "" };
        }

        const pIng = INGREDIENTS[template.protein_id];
        const cIng = INGREDIENTS[template.carb_id];
        const vIng = INGREDIENTS[template.veg_id];

        let pOz = Math.round(targetMealProtein / pIng.protein_per_oz);
        
        const cOzRaw = targetMealCarbs / cIng.carbs_per_oz;
        let cOz = Math.round(cOzRaw);
        if (fitnessGoal === 'Fat Loss') {
            cOz = Math.floor(cOzRaw);
        } else if (fitnessGoal === 'Muscle Gain') {
            cOz = Math.ceil(cOzRaw);
        }
        
        let vOz = 2; // standard serving

        pOz = Math.max(4, Math.min(8, pOz));
        cOz = Math.max(3, Math.min(10, cOz));

        const mealP = Math.round((pOz * pIng.protein_per_oz) + (cOz * cIng.protein_per_oz) + (vOz * vIng.protein_per_oz));
        const mealC = Math.round((pOz * pIng.carbs_per_oz) + (cOz * cIng.carbs_per_oz) + (vOz * vIng.carbs_per_oz));
        const mealF = Math.round((pOz * pIng.fat_per_oz) + (cOz * cIng.fat_per_oz) + (vOz * vIng.fat_per_oz));
        const mealCal = Math.round((mealP * 4) + (mealC * 4) + (mealF * 9));

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
            portionsHtml: `${pOz}oz ${pIng.name}, ${cOz}oz ${cIng.name}, ${vOz}oz ${vIng.name}`
        };
    }

    // Settings Drawer helper functions
    function loadConnectionSettings() {
        const savedMode = localStorage.getItem('ff_conn_mode');
        if (savedMode) connectionMode = savedMode;
        
        supabaseUrl = localStorage.getItem('ff_sb_url') || '';
        supabaseKey = localStorage.getItem('ff_sb_key') || '';
        
        makeGetProfileUrl = localStorage.getItem('ff_make_get_url') || 'https://hook.us2.make.com/placeholder_get_profile';
        makePostSelectionsUrl = localStorage.getItem('ff_make_post_url') || 'https://hook.us2.make.com/placeholder_save_selections';
        
        // Sync to DOM fields if they exist
        const modeSelect = document.getElementById('settings-connection-mode');
        if (modeSelect) modeSelect.value = connectionMode;
        
        const sbUrlInput = document.getElementById('settings-supabase-url');
        if (sbUrlInput) sbUrlInput.value = supabaseUrl;
        
        const sbKeyInput = document.getElementById('settings-supabase-key');
        if (sbKeyInput) sbKeyInput.value = supabaseKey;
        
        const makeGetInput = document.getElementById('settings-make-get-url');
        if (makeGetInput) makeGetInput.value = makeGetProfileUrl;
        
        const makePostInput = document.getElementById('settings-make-post-url');
        if (makePostInput) makePostInput.value = makePostSelectionsUrl;
        
        toggleSettingsFieldGroups();
    }

    function toggleSettingsFieldGroups() {
        const mode = document.getElementById('settings-connection-mode')?.value || 'simulation';
        const makeGroup = document.getElementById('settings-fields-make');
        const supabaseGroup = document.getElementById('settings-fields-supabase');
        
        if (makeGroup) makeGroup.style.display = mode === 'make' ? 'block' : 'none';
        if (supabaseGroup) supabaseGroup.style.display = mode === 'supabase' ? 'block' : 'none';
    }

    function initSettingsHandlers() {
        const openBtn = document.getElementById('settings-open-btn');
        const closeBtn = document.getElementById('settings-close-btn');
        const overlay = document.getElementById('settings-overlay');
        const drawer = document.getElementById('settings-drawer');
        const saveBtn = document.getElementById('settings-save-btn');
        const testBtn = document.getElementById('settings-test-btn');
        const modeSelect = document.getElementById('settings-connection-mode');
        
        if (openBtn && drawer && overlay) {
            openBtn.addEventListener('click', () => {
                drawer.classList.add('active');
                overlay.classList.add('active');
                loadConnectionSettings();
            });
        }
        
        const closeDrawer = () => {
            if (drawer) drawer.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
        };
        
        if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
        if (overlay) overlay.addEventListener('click', closeDrawer);
        
        if (modeSelect) {
            modeSelect.addEventListener('change', toggleSettingsFieldGroups);
        }
        
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const mode = document.getElementById('settings-connection-mode').value;
                let sbUrl = document.getElementById('settings-supabase-url').value.trim();
                sbUrl = sbUrl.replace(/\/rest\/v1\/?$/, ''); // Strip rest API suffix if copied directly from integrations page
                const sbKey = document.getElementById('settings-supabase-key').value.trim();
                const makeGet = document.getElementById('settings-make-get-url').value.trim();
                const makePost = document.getElementById('settings-make-post-url').value.trim();
                
                localStorage.setItem('ff_conn_mode', mode);
                localStorage.setItem('ff_sb_url', sbUrl);
                localStorage.setItem('ff_sb_key', sbKey);
                localStorage.setItem('ff_make_get_url', makeGet);
                localStorage.setItem('ff_make_post_url', makePost);
                
                connectionMode = mode;
                supabaseUrl = sbUrl;
                supabaseKey = sbKey;
                makeGetProfileUrl = makeGet;
                makePostSelectionsUrl = makePost;
                
                const status = document.getElementById('settings-status-message');
                if (status) {
                    status.style.color = '#2ec4b6';
                    status.textContent = 'Connection settings saved!';
                    setTimeout(() => { status.textContent = ''; }, 3000);
                }
                
                closeDrawer();
                initializePortal(); // reload portal data with new settings!
            });
        }
        
        if (testBtn) {
            testBtn.addEventListener('click', async () => {
                const mode = document.getElementById('settings-connection-mode').value;
                const status = document.getElementById('settings-status-message');
                if (!status) return;
                
                status.style.color = '#fff';
                status.textContent = 'Testing connection...';
                
                if (mode === 'simulation') {
                    status.style.color = '#2ec4b6';
                    status.textContent = 'Connection test passed (Simulation Mode)!';
                } else if (mode === 'make') {
                    const makeGet = document.getElementById('settings-make-get-url').value.trim();
                    if (!makeGet) {
                        status.style.color = 'var(--brand-red)';
                        status.textContent = 'Error: Get Profile URL is empty.';
                        return;
                    }
                    try {
                        const res = await fetch(`${makeGet}?test=true`, { mode: 'cors' });
                        status.style.color = '#2ec4b6';
                        status.textContent = 'Webhook URL reachable!';
                    } catch (err) {
                        status.style.color = '#e65100';
                        status.textContent = 'URL ping failed, but endpoint configured.';
                    }
                } else if (mode === 'supabase') {
                    let sbUrl = document.getElementById('settings-supabase-url').value.trim();
                    sbUrl = sbUrl.replace(/\/rest\/v1\/?$/, ''); // Strip rest API suffix if copied directly from integrations page
                    const sbKey = document.getElementById('settings-supabase-key').value.trim();
                    if (!sbUrl || !sbKey) {
                        status.style.color = 'var(--brand-red)';
                        status.textContent = 'Error: URL and Key are required.';
                        return;
                    }
                    try {
                        if (typeof supabase === 'undefined') {
                            status.style.color = 'var(--brand-red)';
                            status.textContent = 'Supabase Client SDK not loaded.';
                            return;
                        }
                        const testClient = supabase.createClient(sbUrl, sbKey);
                        const { data, error } = await testClient.from('customers').select('id').limit(1);
                        if (error) throw error;
                        
                        status.style.color = '#2ec4b6';
                        status.textContent = 'Supabase database connected successfully!';
                    } catch (err) {
                        status.style.color = 'var(--brand-red)';
                        status.textContent = `Supabase error: ${err.message || err}`;
                    }
                }
            });
        }
    }

    // 4. Initialize page - Parse parameter & fetch data
    async function initializePortal() {
        const urlParams = new URLSearchParams(window.location.search);
        const customerId = urlParams.get('customer_id') || urlParams.get('id');

        if (!customerId) {
            console.log("No customer ID provided in URL. Running simulation mode.");
            loadMockAthleteData();
            return;
        }

        const loader = document.getElementById('portal-loader');
        if (loader) {
            loader.style.display = 'flex';
        }
        const dashboard = document.getElementById('portal-dashboard');
        if (dashboard) {
            dashboard.style.display = 'none';
        }

        try {
            if (connectionMode === 'supabase') {
                if (typeof supabase === 'undefined') {
                    throw new Error("Supabase client SDK not loaded.");
                }
                if (!supabaseUrl || !supabaseKey) {
                    throw new Error("Supabase credentials not configured in settings drawer.");
                }
                const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
                const upcomingMonday = getUpcomingMondayDateString();

                const [custResult, macroResult, mealsResult, selectionsResult, orderResult, ingredientsResult] = await Promise.all([
                    supabaseClient.from('customers').select('*').eq('id', customerId).single(),
                    supabaseClient.from('macro_profiles').select('*').eq('customer_id', customerId).eq('is_active', true).maybeSingle(),
                    supabaseClient.from('meals').select('*'),
                    supabaseClient.from('customer_meal_selections').select('day_of_week, meal_slot, meal_id').eq('customer_id', customerId),
                    supabaseClient.from('weekly_orders').select('*').eq('customer_id', customerId).eq('week_start_date', upcomingMonday).maybeSingle(),
                    supabaseClient.from('ingredients').select('*')
                ]);

                if (custResult.error) {
                    throw new Error(`Customer profile fetch failed: ${custResult.error.message}`);
                }

                const customer = custResult.data;
                const macro = macroResult.data;
                const mealsList = mealsResult.data || [];
                const ingredientsList = ingredientsResult.data || [];
                const selections = selectionsResult.data || [];
                const order = orderResult.data;

                // Dynamically sync INGREDIENTS with DB values
                if (ingredientsList.length > 0) {
                    ingredientsList.forEach(ing => {
                        INGREDIENTS[ing.id] = {
                            name: ing.name,
                            category: ing.category,
                            price_per_oz: Number(ing.price_per_oz),
                            protein_per_oz: Number(ing.protein_per_oz),
                            carbs_per_oz: Number(ing.carbs_per_oz),
                            fat_per_oz: Number(ing.fat_per_oz),
                            calories_per_oz: Number(ing.calories_per_oz),
                            yield_ratio: Number(ing.yield_ratio || 1.000)
                        };
                    });
                }

                // Dynamically sync MEAL_TEMPLATES with DB values
                if (mealsList.length > 0) {
                    mealsList.forEach(meal => {
                        if (meal.is_active !== false) {
                            MEAL_TEMPLATES[meal.name] = {
                                protein_id: meal.protein_ingredient_id,
                                carb_id: meal.carb_ingredient_id,
                                veg_id: meal.veg_ingredient_id,
                                category: meal.category,
                                image_url: meal.image_url || 'assets/kairos_logo.png'
                            };
                        } else {
                            delete MEAL_TEMPLATES[meal.name];
                        }
                    });
                }

                // Build meal mappings for lookup
                const mealIdToName = {};
                const mealNameToId = {};
                mealsList.forEach(m => {
                    mealIdToName[m.id] = m.name;
                    mealNameToId[m.name] = m.id;
                });
                window.ffMealNameToId = mealNameToId;
                window.ffMealIdToName = mealIdToName;

                customerData = {
                    customer_id: customer.id,
                    first_name: customer.first_name,
                    last_name: customer.last_name,
                    email: customer.email,
                    phone: customer.phone,
                    gym: customer.gym || 'Spokane Valley Center',
                    gender: customer.gender,
                    age: customer.age,
                    weight: customer.weight_lbs,
                    goal: customer.fitness_goal,
                    calories: macro ? macro.calories : 2000,
                    protein: macro ? macro.protein_grams : 150,
                    carbs: macro ? macro.carb_grams : 150,
                    fat: macro ? macro.fat_grams : 60
                };

                // Populate selections
                weeklySelections = {};
                const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                days.forEach(day => {
                    slots.forEach(slot => {
                        weeklySelections[`${day}-${slot}`] = 'Homemade Meal'; // Default fallback
                    });
                });

                selections.forEach(sel => {
                    const name = mealIdToName[sel.meal_id];
                    if (name) {
                        weeklySelections[`${sel.day_of_week}-${sel.meal_slot}`] = name;
                    }
                });

                // Fetch delivery preferences
                let deliveryDetails = null;
                if (order) {
                    const { data: deliv } = await supabaseClient
                        .from('delivery_details')
                        .select('*')
                        .eq('weekly_order_id', order.id)
                        .maybeSingle();
                    deliveryDetails = deliv;
                }

                if (deliveryDetails) {
                    deliveryMethod = deliveryDetails.delivery_type;
                    if (deliveryMethod === 'studio_pickup') {
                        document.getElementById('portal-pickup-select').value = deliveryDetails.location_name;
                    } else if (deliveryMethod === 'home_delivery') {
                        const addr = parseAddressString(deliveryDetails.delivery_address);
                        document.getElementById('portal-address-street').value = addr.street || '';
                        document.getElementById('portal-address-unit').value = addr.unit || '';
                        document.getElementById('portal-address-city').value = addr.city || '';
                        document.getElementById('portal-address-zip').value = addr.zip || '';
                    }
                } else {
                    deliveryMethod = 'studio_pickup';
                    if (customer.gym) {
                        document.getElementById('portal-pickup-select').value = customer.gym;
                    }
                }

                updateDeliveryUI();

                isSkipped = order ? (order.status === 'skipped') : false;

                // Sync status indicator
                const statusBadge = document.querySelector('.portal-status-badge');
                if (statusBadge) {
                    statusBadge.innerHTML = `
                        <span class="status-indicator-dot active-pulse"></span>
                        <span class="status-text">Status: <strong>Active DB</strong></span>
                    `;
                }

                renderDashboard();
            } else if (connectionMode === 'make') {
                if (!makeGetProfileUrl || makeGetProfileUrl.includes('placeholder_get_profile')) {
                    throw new Error("Make.com profiles webhook is not configured.");
                }
                const response = await fetch(`${makeGetProfileUrl}?customer_id=${customerId}`);
                if (!response.ok) throw new Error(`Make webhook error: ${response.statusText}`);
                
                const data = await response.json();
                customerData = data.customer;
                weeklySelections = data.selections;
                isSkipped = data.is_skipped || false;
                
                if (data.delivery_method) {
                    deliveryMethod = data.delivery_method;
                    if (deliveryMethod === 'studio_pickup' && data.pickup_location) {
                        document.getElementById('portal-pickup-select').value = data.pickup_location;
                    } else if (deliveryMethod === 'home_delivery' && data.shipping_address) {
                        const addr = data.shipping_address;
                        document.getElementById('portal-address-street').value = addr.street || '';
                        document.getElementById('portal-address-unit').value = addr.unit || '';
                        document.getElementById('portal-address-city').value = addr.city || '';
                        document.getElementById('portal-address-zip').value = addr.zip || '';
                    }
                    updateDeliveryUI();
                }

                const statusBadge = document.querySelector('.portal-status-badge');
                if (statusBadge) {
                    statusBadge.innerHTML = `
                        <span class="status-indicator-dot" style="background-color: #2ec4b6; box-shadow: 0 0 10px rgba(46, 196, 182, 0.4);"></span>
                        <span class="status-text">Status: <strong>Webhook Live</strong></span>
                    `;
                }
                
                renderDashboard();
            } else {
                // Simulation Mode
                loadMockAthleteData();
            }
        } catch (err) {
            console.warn("Failed to load live portal data. Falling back to Simulation Mode:", err);
            loadMockAthleteData();
        }
    }

    function getUpcomingMondayDateString() {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const monday = new Date(today);
        monday.setDate(today.getDate() + distanceToMonday + 7);
        return monday.toISOString().split('T')[0];
    }

    function parseAddressString(str) {
        if (!str) return {};
        try {
            return JSON.parse(str);
        } catch (e) {
            const parts = str.split(',').map(p => p.trim());
            return {
                street: parts[0] || '',
                unit: parts.length > 3 ? parts[1] : '',
                city: parts.length > 3 ? parts[2] : (parts[1] || ''),
                zip: parts.length > 3 ? parts[3] : (parts[2] || '')
            };
        }
    }

    function updateDeliveryUI() {
        const btnPickup = document.getElementById('deliv-btn-pickup');
        const btnDelivery = document.getElementById('deliv-btn-delivery');
        const pickupWrap = document.getElementById('pickup-location-wrap');
        const deliveryWrap = document.getElementById('home-delivery-wrap');
        
        if (!btnPickup || !btnDelivery || !pickupWrap || !deliveryWrap) return;
        if (deliveryMethod === 'studio_pickup') {
            btnPickup.classList.add('selected');
            btnDelivery.classList.remove('selected');
            pickupWrap.style.display = 'block';
            deliveryWrap.style.display = 'none';
        } else {
            btnDelivery.classList.add('selected');
            btnPickup.classList.remove('selected');
            pickupWrap.style.display = 'none';
            deliveryWrap.style.display = 'block';
        }
    }

    // 5. Simulation Fallback Data
    function loadMockAthleteData() {
        customerData = {
            first_name: "Lidiya",
            last_name: "Ervin",
            gym: "Spokane Valley Center",
            gender: "Female",
            age: 34,
            weight: 155,
            goal: "Fat Loss",
            calories: 1650,
            protein: 145,
            carbs: 120,
            fat: 50,
            tier: "M"
        };

        // Populate mock default schedule (5 meals)
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        days.forEach(day => {
            weeklySelections[`${day}-breakfast`] = 'Steak and Eggs';
            weeklySelections[`${day}-lunch_1`] = 'Teriyaki Chicken';
            weeklySelections[`${day}-lunch_2`] = 'Chicken Fried Rice';
            weeklySelections[`${day}-dinner`] = 'Steak n Mash';
            weeklySelections[`${day}-snack`] = 'Meat & Cheese-To-Go';
        });

        isSkipped = false;

        // Show notice in header about simulation mode
        const header = document.querySelector('.portal-status-badge');
        if (header) {
            header.innerHTML = `
                <span class="status-indicator-dot" style="background-color: #ffaa00; box-shadow: 0 0 10px rgba(255, 170, 0, 0.4);"></span>
                <span class="status-text" style="color: #ffaa00;"><strong>Simulation Mode</strong></span>
            `;
        }

        renderDashboard();
    }

    // 6. UI Render Functions
    function renderDashboard() {
        // Hide loader, reveal content
        document.getElementById('portal-loader').style.display = 'none';
        document.getElementById('portal-dashboard').style.display = 'grid';

        // Render Welcome Banner
        document.getElementById('portal-welcome-title').textContent = `Welcome back, ${customerData.first_name}!`;
        document.getElementById('portal-gym-name').textContent = customerData.gym;

        // Render targets
        document.getElementById('portal-macro-calories').textContent = customerData.calories;
        document.getElementById('portal-macro-protein').textContent = `${customerData.protein}g`;
        document.getElementById('portal-macro-carbs').textContent = `${customerData.carbs}g`;
        document.getElementById('portal-macro-fat').textContent = `${customerData.fat}g`;

        // Render dates
        const dateRangeNode = document.getElementById('portal-week-date-range');
        if (dateRangeNode) {
            const today = new Date();
            const dayOfWeek = today.getDay();
            const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
            const monday = new Date(today);
            monday.setDate(today.getDate() + distanceToMonday + 7); // Next Monday
            const options = { month: 'long', day: 'numeric', year: 'numeric' };
            dateRangeNode.textContent = `Week of ${monday.toLocaleDateString('en-US', options)}`;
        }

        // Render grid and update pricing
        renderWeeklyCalendar();
        updatePriceSummary();
    }

    function renderWeeklyCalendar() {
        const calendarContainer = document.getElementById('portal-calendar-container');
        if (!calendarContainer) return;

        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        calendarContainer.innerHTML = days.map(day => {
            const dayClass = isSkipped ? 'portal-day-row skipped-day' : 'portal-day-row';
            
            return `
                <div class="${dayClass}" data-day="${day}">
                    <div class="portal-day-header">
                        <span class="portal-day-title">${day.toUpperCase()}</span>
                        <span class="portal-day-meta">5 Meals prepped fresh</span>
                    </div>
                    
                    <div class="portal-day-meals-grid">
                        ${slots.map(slot => {
                            const targets = getSlotTargets(slot, customerData.protein, customerData.carbs, customerData.fat);
                            const mealName = weeklySelections[`${day}-${slot}`];
                            const d = calculateMealPortionsAndPricing(mealName, targets.protein, targets.carbs, targets.fat, customerData.goal);
                            
                            // Highlight Homemade Meal differently
                            const isHomemade = mealName === 'Homemade Meal';
                            const badgeStyle = isHomemade ? 'style="background: rgba(46, 196, 182, 0.1); border-color: rgba(46, 196, 182, 0.3); color: #2ec4b6;"' : '';
                            const macroLabelStyle = isHomemade ? 'style="color: #ffaa00;"' : '';

                            return `
                                <div class="portal-meal-slot" data-slot="${slot}">
                                    <div class="portal-meal-header">
                                        <span class="portal-slot-label" style="color: var(--tag-${slot === 'lunch_1' || slot === 'lunch_2' ? 'lunch' : slot}-color);">${SLOT_LABELS[slot]}</span>
                                        <span class="portal-price-badge" ${badgeStyle}>$${d.price.toFixed(2)}</span>
                                    </div>
                                    
                                    <div>
                                        <div class="portal-meal-name">${d.name}</div>
                                        <div class="portal-meal-weights" ${macroLabelStyle}>${d.portionsHtml}</div>
                                        <div class="portal-meal-macros">${d.protein}g P / ${d.carbs}g C / ${d.fat}g F | ${d.calories} cal</div>
                                    </div>
                                    
                                    <button class="portal-swap-btn" data-day="${day}" data-slot="${slot}" ${isSkipped ? 'disabled' : ''}>
                                        Swap Selection
                                    </button>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }).join('');

        // Attach event listeners to swap buttons
        document.querySelectorAll('.portal-swap-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const day = btn.getAttribute('data-day');
                const slot = btn.getAttribute('data-slot');
                openSwapModal(day, slot);
            });
        });
    }

    function updatePriceSummary() {
        let total = 0;
        
        // Sum up each meal's calculated price
        Object.keys(weeklySelections).forEach(key => {
            const slot = key.split('-')[1]; // e.g. 'lunch_1'
            const targets = getSlotTargets(slot, customerData.protein, customerData.carbs, customerData.fat);
            const mealName = weeklySelections[key];
            const d = calculateMealPortionsAndPricing(mealName, targets.protein, targets.carbs, targets.fat, customerData.goal);
            total += d.price;
        });

        const displayTotal = isSkipped ? 0 : total;
        
        document.getElementById('portal-base-meals-price').textContent = `$${displayTotal.toFixed(2)}`;
        document.getElementById('portal-weekly-total').textContent = `$${displayTotal.toFixed(2)}`;

        // Handle skip display states
        const skipAlert = document.getElementById('skip-week-alert');
        const skipBtn = document.getElementById('skip-week-btn');
        
        if (isSkipped) {
            skipAlert.style.display = 'block';
            skipBtn.textContent = 'Unskip Delivery';
            skipBtn.classList.remove('btn-charcoal');
            skipBtn.classList.add('brutalist-btn');
            skipBtn.style.backgroundColor = '#ffaa00';
            skipBtn.style.borderColor = '#ffaa00';
        } else {
            skipAlert.style.display = 'none';
            skipBtn.textContent = 'Skip Upcoming Week';
            skipBtn.classList.add('btn-charcoal');
            skipBtn.style.backgroundColor = '';
            skipBtn.style.borderColor = '';
        }
    }

    // 7. Modal Functions
    function openSwapModal(day, slot) {
        activeSwapTarget = { day, slot };
        const modal = document.getElementById('swap-modal');
        const titleNode = document.getElementById('modal-slot-tag');
        
        titleNode.textContent = `${day.toUpperCase()} - ${SLOT_LABELS[slot]}`;
        modal.style.display = 'flex';

        renderModalOptions(day, slot);
    }

    function closeSwapModal() {
        document.getElementById('swap-modal').style.display = 'none';
        activeSwapTarget = null;
    }

    function renderModalOptions(day, slot) {
        const listContainer = document.getElementById('modal-meals-list');
        if (!listContainer) return;

        // Fetch target macros for this specific slot
        const targets = getSlotTargets(slot, customerData.protein, customerData.carbs, customerData.fat);

        // Get currently selected meal details
        const currentMealName = weeklySelections[`${day}-${slot}`];
        const currentMealObj = calculateMealPortionsAndPricing(currentMealName, targets.protein, targets.carbs, targets.fat, customerData.goal);

        // Filter menu items by slot category
        const targetCategory = slot === 'snack' ? 'snack' : (slot === 'breakfast' ? 'breakfast' : 'lunch'); // Lunches/Dinners can swap between each other
        
        const filteredMeals = Object.keys(MEAL_TEMPLATES).filter(key => {
            const temp = MEAL_TEMPLATES[key];
            if (targetCategory === 'lunch') {
                return temp.category === 'lunch' || temp.category === 'dinner';
            }
            return temp.category === targetCategory;
        });

        // Add Homemade Meal Option
        if (!filteredMeals.includes('Homemade Meal')) {
            filteredMeals.push('Homemade Meal');
        }

        listContainer.innerHTML = filteredMeals.map(mealKey => {
            const d = calculateMealPortionsAndPricing(mealKey, targets.protein, targets.carbs, targets.fat, customerData.goal);
            const isActive = mealKey === currentMealName;
            
            // Calculate price difference
            const diff = d.price - currentMealObj.price;
            let diffHtml = '';
            if (isActive) {
                diffHtml = `<span class="opt-price-diff diff-equal">Selected</span>`;
            } else if (diff === 0) {
                diffHtml = `<span class="opt-price-diff diff-equal">+$0.00</span>`;
            } else if (diff > 0) {
                diffHtml = `<span class="opt-price-diff diff-up">+$${diff.toFixed(2)}</span>`;
            } else {
                diffHtml = `<span class="opt-price-diff diff-down">-$${Math.abs(diff).toFixed(2)}</span>`;
            }

            const template = MEAL_TEMPLATES[mealKey];
            const imageUrl = (template && template.image_url) ? template.image_url : 'assets/kairos_logo.png';

            return `
                <div class="modal-meal-option ${isActive ? 'active-selection' : ''}" data-meal="${mealKey}">
                    <div class="opt-left-wrap">
                        <img class="opt-img" src="${imageUrl}" alt="${d.name}">
                        <div class="opt-details">
                            <span class="opt-title">${d.name}</span>
                            <span class="opt-weights">${d.portionsHtml}</span>
                            <span class="opt-macros">${d.protein}g P / ${d.carbs}g C / ${d.fat}g F | ${d.calories} cal</span>
                        </div>
                    </div>
                    <div class="opt-price-block">
                        <span class="opt-price">$${d.price.toFixed(2)}</span>
                        ${diffHtml}
                    </div>
                </div>
            `;
        }).join('');

        // Handle item selection clicks
        document.querySelectorAll('.modal-meal-option').forEach(row => {
            row.addEventListener('click', () => {
                const newMeal = row.getAttribute('data-meal');
                selectAndSwapMeal(newMeal);
            });
        });

        // Handle image zoom click preview
        document.querySelectorAll('.opt-img').forEach(img => {
            img.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent swapping selection when clicking the image to zoom it
                const src = img.getAttribute('src');
                const mealName = img.getAttribute('alt');
                showImageLightbox(src, mealName);
            });
        });
    }

    function showImageLightbox(src, mealName) {
        let lightbox = document.getElementById('image-lightbox');
        if (!lightbox) {
            lightbox = document.createElement('div');
            lightbox.id = 'image-lightbox';
            lightbox.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.85);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                z-index: 11000;
                opacity: 0;
                transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                cursor: pointer;
                padding: 20px;
            `;
            
            // Close on click
            lightbox.addEventListener('click', () => {
                lightbox.style.opacity = '0';
                setTimeout(() => {
                    lightbox.style.display = 'none';
                }, 250);
            });
            
            document.body.appendChild(lightbox);
        }
        
        lightbox.innerHTML = `
            <div style="position: absolute; top: 20px; right: 20px; color: #fff; font-size: 2.5rem; font-family: var(--font-primary); font-weight: 300; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">&times;</div>
            <div style="max-width: 90%; max-height: 85%; display: flex; flex-direction: column; align-items: center; gap: 16px; cursor: default;" onclick="event.stopPropagation()">
                <img src="${src}" alt="${mealName}" style="
                    max-width: 100%;
                    max-height: 70vh;
                    border-radius: 12px;
                    border: 3px solid var(--color-border);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.5);
                    background: #fff;
                    object-fit: contain;
                    transform: scale(0.9);
                    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                " id="lightbox-img">
                <span style="color: #fff; font-family: var(--font-primary); font-weight: 850; font-size: 1.3rem; text-transform: uppercase; letter-spacing: 1.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.6);">${mealName}</span>
            </div>
        `;
        
        lightbox.style.display = 'flex';
        // Trigger reflow
        lightbox.offsetHeight;
        lightbox.style.opacity = '1';
        
        // Trigger image zoom animation
        setTimeout(() => {
            const img = document.getElementById('lightbox-img');
            if (img) img.style.transform = 'scale(1)';
        }, 50);
    }

    function selectAndSwapMeal(newMealName) {
        if (!activeSwapTarget) return;

        const { day, slot } = activeSwapTarget;
        weeklySelections[`${day}-${slot}`] = newMealName;

        closeSwapModal();
        renderDashboard();
    }

    // 8. Event Binding for actions
    const modalCloseBtn = document.getElementById('modal-close-btn');
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeSwapModal);
    }

    const modalOverlay = document.getElementById('swap-modal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeSwapModal();
        });
    }

    // Delivery / Pickup Preferences Controller
    let deliveryMethod = 'studio_pickup'; // 'studio_pickup' or 'home_delivery'
    
    const btnPickup = document.getElementById('deliv-btn-pickup');
    const btnDelivery = document.getElementById('deliv-btn-delivery');
    const pickupWrap = document.getElementById('pickup-location-wrap');
    const deliveryWrap = document.getElementById('home-delivery-wrap');
    
    if (btnPickup && btnDelivery) {
        btnPickup.addEventListener('click', (e) => {
            e.preventDefault();
            deliveryMethod = 'studio_pickup';
            btnPickup.classList.add('selected');
            btnDelivery.classList.remove('selected');
            pickupWrap.style.display = 'block';
            deliveryWrap.style.display = 'none';
        });
        
        btnDelivery.addEventListener('click', (e) => {
            e.preventDefault();
            deliveryMethod = 'home_delivery';
            btnDelivery.classList.add('selected');
            btnPickup.classList.remove('selected');
            pickupWrap.style.display = 'none';
            deliveryWrap.style.display = 'block';
        });
    }

    // Confirm selections webhook handler
    const saveBtn = document.getElementById('save-selections-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
            saveBtn.disabled = true;
            const originalText = saveBtn.textContent;
            saveBtn.textContent = 'Saving Changes...';

            const statusNode = document.getElementById('portal-save-status');
            statusNode.style.display = 'block';
            statusNode.style.color = '#ffffff';
            statusNode.textContent = 'Transmitting order schedule...';

            // Validation for Home Delivery
            let shippingAddress = null;
            if (deliveryMethod === 'home_delivery') {
                const street = document.getElementById('portal-address-street').value.trim();
                const unit = document.getElementById('portal-address-unit').value.trim();
                const city = document.getElementById('portal-address-city').value.trim();
                const zip = document.getElementById('portal-address-zip').value.trim();
                
                if (!street || !city || !zip) {
                    alert('Please fill out all address fields for Home Delivery.');
                    saveBtn.disabled = false;
                    saveBtn.textContent = originalText;
                    statusNode.style.display = 'none';
                    return;
                }
                
                shippingAddress = { street, unit, city, zip };
            }
            
            const selectedStudio = document.getElementById('portal-pickup-select').value;

            try {
                if (connectionMode === 'supabase') {
                    if (typeof supabase === 'undefined') {
                        throw new Error("Supabase client SDK not loaded.");
                    }
                    const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
                    
                    // 1. Update customer profile delivery defaults
                    const custUpdate = {};
                    if (deliveryMethod === 'studio_pickup') {
                        custUpdate.gym = selectedStudio;
                    }
                    await supabaseClient
                        .from('customers')
                        .update(custUpdate)
                        .eq('id', customerData.customer_id);

                    // 2. Update default templates in customer_meal_selections
                    await supabaseClient
                        .from('customer_meal_selections')
                        .delete()
                        .eq('customer_id', customerData.customer_id);

                    const mealNameToId = window.ffMealNameToId || {};
                    const selectionPayloads = [];
                    for (const key of Object.keys(weeklySelections)) {
                        const parts = key.split('-');
                        const day = parts[0];
                        const slot = parts[1];
                        const mealName = weeklySelections[key];
                        const mealId = mealNameToId[mealName];
                        if (mealId) {
                            selectionPayloads.push({
                                customer_id: customerData.customer_id,
                                day_of_week: day,
                                meal_slot: slot,
                                meal_id: mealId
                            });
                        }
                    }
                    if (selectionPayloads.length > 0) {
                        const { error: selError } = await supabaseClient
                            .from('customer_meal_selections')
                            .insert(selectionPayloads);
                        if (selError) throw selError;
                    }

                    // 3. Upsert Order for upcoming week start
                    const upcomingMonday = getUpcomingMondayDateString();
                    let totalPrice = 0;
                    Object.keys(weeklySelections).forEach(key => {
                        const slot = key.split('-')[1];
                        const targets = getSlotTargets(slot, customerData.protein, customerData.carbs, customerData.fat);
                        const mealName = weeklySelections[key];
                        const d = calculateMealPortionsAndPricing(mealName, targets.protein, targets.carbs, targets.fat, customerData.goal);
                        totalPrice += d.price;
                    });
                    if (isSkipped) totalPrice = 0;

                    const orderStatus = isSkipped ? 'skipped' : 'confirmed';

                    const { data: orderData, error: orderUpsertError } = await supabaseClient
                        .from('weekly_orders')
                        .upsert({
                            customer_id: customerData.customer_id,
                            week_start_date: upcomingMonday,
                            status: orderStatus,
                            total_price: totalPrice
                        }, { onConflict: 'customer_id,week_start_date' })
                        .select()
                        .single();

                    if (orderUpsertError) throw orderUpsertError;
                    const orderId = orderData.id;

                    // 4. Update Delivery Details for this weekly order
                    await supabaseClient.from('delivery_details').delete().eq('weekly_order_id', orderId);
                    const deliveryPayload = {
                        weekly_order_id: orderId,
                        delivery_type: deliveryMethod,
                        location_name: deliveryMethod === 'studio_pickup' ? selectedStudio : 'Customer Address',
                        delivery_address: deliveryMethod === 'home_delivery' ? JSON.stringify(shippingAddress) : null,
                        delivery_status: 'pending'
                    };
                    const { error: delivError } = await supabaseClient
                        .from('delivery_details')
                        .insert(deliveryPayload);
                    if (delivError) throw delivError;

                    // 5. Update Weekly Order Details (specific portion weights and individual prices)
                    await supabaseClient
                        .from('weekly_order_details')
                        .delete()
                        .eq('weekly_order_id', orderId);

                    const detailsPayloads = [];
                    for (const key of Object.keys(weeklySelections)) {
                        const parts = key.split('-');
                        const day = parts[0];
                        const slot = parts[1];
                        const mealName = weeklySelections[key];
                        const mealId = mealNameToId[mealName];

                        if (!mealId) continue;

                        const targets = getSlotTargets(slot, customerData.protein, customerData.carbs, customerData.fat);
                        const d = calculateMealPortionsAndPricing(mealName, targets.protein, targets.carbs, targets.fat, customerData.goal);

                        let proteinOz = 0;
                        let carbOz = 0;
                        let vegOz = 0;

                        if (mealName !== 'Homemade Meal') {
                            const template = MEAL_TEMPLATES[mealName];
                            if (template) {
                                const pIng = INGREDIENTS[template.protein_id];
                                const cIng = INGREDIENTS[template.carb_id];
                                
                                proteinOz = Math.round(targets.protein / pIng.protein_per_oz);
                                const cOzRaw = targets.carbs / cIng.carbs_per_oz;
                                carbOz = Math.round(cOzRaw);
                                if (customerData.goal === 'Fat Loss') {
                                    carbOz = Math.floor(cOzRaw);
                                } else if (customerData.goal === 'Muscle Gain') {
                                    carbOz = Math.ceil(cOzRaw);
                                }
                                vegOz = 2; // standard serving
                                
                                proteinOz = Math.max(4, Math.min(8, proteinOz));
                                carbOz = Math.max(3, Math.min(10, carbOz));
                            }
                        }

                        detailsPayloads.push({
                            weekly_order_id: orderId,
                            day_of_week: day,
                            meal_slot: slot,
                            meal_id: mealId,
                            protein_oz: proteinOz,
                            carb_oz: carbOz,
                            veg_oz: vegOz,
                            calculated_price: d.price
                        });
                    }

                    if (detailsPayloads.length > 0) {
                        const { error: insertDetailsError } = await supabaseClient
                            .from('weekly_order_details')
                            .insert(detailsPayloads);
                        if (insertDetailsError) throw insertDetailsError;
                    }

                    statusNode.style.color = '#2ec4b6';
                    statusNode.textContent = '✓ Database schedule successfully synchronized!';
                } else if (connectionMode === 'make') {
                    if (!makePostSelectionsUrl || makePostSelectionsUrl.includes('placeholder_save_selections')) {
                        throw new Error("Make.com post webhook URL not configured.");
                    }
                    const payload = {
                        customer_id: customerData.customer_id || 'mock-id-123',
                        selections: weeklySelections,
                        is_skipped: isSkipped,
                        delivery_method: deliveryMethod,
                        pickup_location: deliveryMethod === 'studio_pickup' ? selectedStudio : null,
                        shipping_address: deliveryMethod === 'home_delivery' ? shippingAddress : null,
                        timestamp: new Date().toISOString()
                    };

                    const response = await fetch(makePostSelectionsUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    if (!response.ok) throw new Error(`Make webhook error: ${response.statusText}`);

                    statusNode.style.color = '#2ec4b6';
                    statusNode.textContent = '✓ Weekly selections successfully locked in via Webhook!';
                } else {
                    // Simulation mode fallback
                    statusNode.style.color = '#2ec4b6';
                    statusNode.textContent = '✓ Simulated selections updated successfully!';
                }
            } catch (err) {
                console.warn("Outbound saving failed. Falling back to Simulation Mode success status:", err);
                statusNode.style.color = '#e65100';
                statusNode.textContent = `⚠️ Save error: ${err.message || err}. Simulated fallback OK.`;
            } finally {
                saveBtn.disabled = false;
                saveBtn.textContent = originalText;
                
                setTimeout(() => {
                    statusNode.style.display = 'none';
                }, 4000);
            }
        });
    }

    // Toggle skip behavior
    const skipBtn = document.getElementById('skip-week-btn');
    if (skipBtn) {
        skipBtn.addEventListener('click', () => {
            isSkipped = !isSkipped;
            
            const statusNode = document.getElementById('portal-save-status');
            statusNode.style.display = 'block';
            statusNode.style.color = isSkipped ? '#ffaa00' : '#2ec4b6';
            statusNode.textContent = isSkipped ? '⚠️ Delivery marked to skip next week. Make sure to click save.' : '✓ Delivery resumed!';
            
            renderDashboard();
            
            setTimeout(() => {
                statusNode.style.display = 'none';
            }, 3000);
        });
    }

    // Load local settings and start handlers
    loadConnectionSettings();
    initSettingsHandlers();

    // Run loader initialization
    initializePortal();
});
