/**
 * Finally Fit - Kitchen Operator Dashboard (admin.js)
 * Calculations for production sheets, raw ingredients lists, delivery logs, and box labels.
 */

document.addEventListener('DOMContentLoaded', () => {
    let customLogoDataUrl = null;
    
    // 1. Ingredients & Meals Databases (Duplicated for calculations)
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

    const slots = ['breakfast', 'chicken_1', 'chicken_2', 'steak_meal'];
    
    const SLOT_LABELS = {
        'breakfast': 'Breakfast',
        'chicken_1': 'Chicken #1',
        'chicken_2': 'Chicken #2',
        'steak_meal': 'Steak'
    };

    // Helper to calculate target macros for the 4 meals
    function getSlotTargets(slot, totalProtein, totalCarbs, totalFat) {
        return {
            protein: totalProtein / 4,
            carbs: totalCarbs / 4,
            fat: totalFat / 4
        };
    }

    // Dynamic Ounces portion calculator
    function calculateMealOunces(mealName, targetMealProtein, targetMealCarbs, targetMealFat, fitnessGoal) {
        if (mealName === 'Homemade Meal') {
            return null; // Skip raw prep calculations for homemade
        }

        const template = MEAL_TEMPLATES[mealName];
        if (!template) return null;

        const pIng = INGREDIENTS[template.protein_id];
        const cIng = INGREDIENTS[template.carb_id];
        
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

        return {
            protein_id: template.protein_id,
            protein_oz: pOz,
            carb_id: template.carb_id,
            carb_oz: cOz,
            veg_id: template.veg_id,
            veg_oz: vOz
        };
    }

    // Dynamic portion & macros details for box labels
    function getMealLabelMacros(mealName, targetMealProtein, targetMealCarbs, targetMealFat, fitnessGoal) {
        if (mealName === 'Homemade Meal') {
            return {
                name: "Homemade Meal",
                price: 0,
                protein: Math.round(targetMealProtein),
                carbs: Math.round(targetMealCarbs),
                fat: Math.round(targetMealFat),
                calories: Math.round((targetMealProtein * 4) + (targetMealCarbs * 4) + (targetMealFat * 9)),
                ingredients: "Self-prepared at home",
                isHomemade: true
            };
        }

        const template = MEAL_TEMPLATES[mealName];
        if (!template) return null;

        const pIng = INGREDIENTS[template.protein_id];
        const cIng = INGREDIENTS[template.carb_id];
        const vIng = INGREDIENTS[template.veg_id];

        const portions = calculateMealOunces(mealName, targetMealProtein, targetMealCarbs, targetMealFat, fitnessGoal);
        if (!portions) return null;

        const mealP = Math.round((portions.protein_oz * pIng.protein_per_oz) + (portions.carb_oz * cIng.protein_per_oz) + (portions.veg_oz * vIng.protein_per_oz));
        const mealC = Math.round((portions.protein_oz * pIng.carbs_per_oz) + (portions.carb_oz * cIng.carbs_per_oz) + (portions.veg_oz * vIng.carbs_per_oz));
        const mealF = Math.round((portions.protein_oz * pIng.fat_per_oz) + (portions.carb_oz * cIng.fat_per_oz) + (portions.veg_oz * vIng.fat_per_oz));
        const mealCal = Math.round((mealP * 4) + (mealC * 4) + (mealF * 9));

        const pCost = portions.protein_oz * pIng.price_per_oz * INGREDIENT_MARKUP;
        const cCost = portions.carb_oz * cIng.price_per_oz * INGREDIENT_MARKUP;
        const vCost = portions.veg_oz * vIng.price_per_oz * INGREDIENT_MARKUP;
        const totalPrice = Math.round((BASE_PREP_FEE + pCost + cCost + vCost) * 100) / 100;

        // Compile clean sub-ingredients list
        const ingredientsText = `${pIng.raw_items}, ${cIng.raw_items}, ${vIng.raw_items}`;

        return {
            name: mealName.toUpperCase(),
            price: totalPrice,
            protein: mealP,
            carbs: mealC,
            fat: mealF,
            calories: mealCal,
            ingredients: ingredientsText,
            isHomemade: false
        };
    }

    // 2. Mock Active Customers Database (Phase 3)
    const mockCustomers = [
        {
            id: "cust-1",
            first_name: "Lidiya",
            last_name: "Ervin",
            goal: "Fat Loss",
            calories: 1650,
            protein: 145,
            carbs: 120,
            fat: 50,
            delivery_method: "studio_pickup",
            pickup_location: "Spokane Valley Center",
            shipping_address: null,
            is_skipped: false,
            selections: {
                'Monday-breakfast': 'Steak and Eggs', 'Monday-chicken_1': 'Teriyaki Chicken', 'Monday-chicken_2': 'Chile Margarita', 'Monday-steak_meal': 'Steak n Mash',
                'Tuesday-breakfast': 'Yogurt Parfait', 'Tuesday-chicken_1': 'Chicken Fried Rice', 'Tuesday-chicken_2': 'Teriyaki Chicken', 'Tuesday-steak_meal': 'Steak n Mash',
                'Wednesday-breakfast': 'Honey Sweet Cottage Cheese', 'Wednesday-chicken_1': 'Chile Margarita', 'Wednesday-chicken_2': 'Teriyaki Chicken', 'Wednesday-steak_meal': 'Steak n Mash',
                'Thursday-breakfast': 'Loaded Breakfast Bowl', 'Thursday-chicken_1': 'Asian Zing', 'Thursday-chicken_2': 'Sweet Chili Chicken Thigh', 'Thursday-steak_meal': 'Steak n Mash',
                'Friday-breakfast': 'Steak and Eggs', 'Friday-chicken_1': 'Teriyaki Chicken', 'Friday-chicken_2': 'Chile Margarita', 'Friday-steak_meal': 'Steak n Mash',
                'Saturday-breakfast': 'Yogurt Parfait', 'Saturday-chicken_1': 'Chicken Fried Rice', 'Saturday-chicken_2': 'Teriyaki Chicken', 'Saturday-steak_meal': 'Steak n Mash',
                'Sunday-breakfast': 'Honey Sweet Cottage Cheese', 'Sunday-chicken_1': 'Teriyaki Chicken', 'Sunday-chicken_2': 'Chicken Fried Rice', 'Sunday-steak_meal': 'Steak n Mash'
            }
        },
        {
            id: "cust-2",
            first_name: "David",
            last_name: "Smith",
            goal: "Muscle Gain",
            calories: 2800,
            protein: 200,
            carbs: 280,
            fat: 80,
            delivery_method: "studio_pickup",
            pickup_location: "North Division Studio",
            shipping_address: null,
            is_skipped: false,
            selections: {
                'Monday-breakfast': 'Steak and Eggs', 'Monday-chicken_1': 'Teriyaki Chicken', 'Monday-chicken_2': 'Chicken Fried Rice', 'Monday-steak_meal': 'Steak n Mash',
                'Tuesday-breakfast': 'Loaded Breakfast Bowl', 'Tuesday-chicken_1': 'Chicken Fried Rice', 'Tuesday-chicken_2': 'Teriyaki Chicken', 'Tuesday-steak_meal': 'Steak n Mash',
                'Wednesday-breakfast': 'Steak and Eggs', 'Wednesday-chicken_1': 'Chile Margarita', 'Wednesday-chicken_2': 'Chicken Fried Rice', 'Wednesday-steak_meal': 'Steak n Mash',
                'Thursday-breakfast': 'Loaded Breakfast Bowl', 'Thursday-chicken_1': 'BBQ Chicken Thigh', 'Thursday-chicken_2': 'Sweet Chili Chicken Thigh', 'Thursday-steak_meal': 'Steak n Mash',
                'Friday-breakfast': 'Steak and Eggs', 'Friday-chicken_1': 'Teriyaki Chicken', 'Friday-chicken_2': 'Chicken Fried Rice', 'Friday-steak_meal': 'Steak n Mash',
                'Saturday-breakfast': 'Loaded Breakfast Bowl', 'Saturday-chicken_1': 'Chicken Fried Rice', 'Saturday-chicken_2': 'Teriyaki Chicken', 'Saturday-steak_meal': 'Steak n Mash',
                'Sunday-breakfast': 'Steak and Eggs', 'Sunday-chicken_1': 'Chile Margarita', 'Sunday-chicken_2': 'Teriyaki Chicken', 'Sunday-steak_meal': 'Steak n Mash'
            }
        },
        {
            id: "cust-3",
            first_name: "Matthew",
            last_name: "Davis",
            goal: "Maintain",
            calories: 2100,
            protein: 160,
            carbs: 180,
            fat: 65,
            delivery_method: "home_delivery",
            pickup_location: null,
            shipping_address: { street: "104 Main St", unit: "Apt 302", city: "Spokane", zip: "99201" },
            is_skipped: false,
            selections: {
                'Monday-breakfast': 'Steak and Eggs', 'Monday-chicken_1': 'Teriyaki Chicken', 'Monday-chicken_2': 'Chicken Fried Rice', 'Monday-steak_meal': 'Steak n Mash',
                'Tuesday-breakfast': 'Yogurt Parfait', 'Tuesday-chicken_1': 'Chicken Fried Rice', 'Tuesday-chicken_2': 'Teriyaki Chicken', 'Tuesday-steak_meal': 'Steak n Mash',
                'Wednesday-breakfast': 'Honey Sweet Cottage Cheese', 'Wednesday-chicken_1': 'Chile Margarita', 'Wednesday-chicken_2': 'Chicken Fried Rice', 'Wednesday-steak_meal': 'Steak n Mash',
                'Thursday-breakfast': 'Loaded Breakfast Bowl', 'Thursday-chicken_1': 'Asian Zing', 'Thursday-chicken_2': 'Sweet Chili Chicken Thigh', 'Thursday-steak_meal': 'Steak n Mash',
                'Friday-breakfast': 'Steak and Eggs', 'Friday-chicken_1': 'Teriyaki Chicken', 'Friday-chicken_2': 'Chile Margarita', 'Friday-steak_meal': 'Steak n Mash',
                'Saturday-breakfast': 'Yogurt Parfait', 'Saturday-chicken_1': 'Chicken Fried Rice', 'Saturday-chicken_2': 'Steak n Mash', 'Saturday-steak_meal': 'Steak n Mash',
                'Sunday-breakfast': 'Honey Sweet Cottage Cheese', 'Sunday-chicken_1': 'Chile Margarita', 'Sunday-chicken_2': 'Teriyaki Chicken', 'Sunday-steak_meal': 'Steak n Mash'
            }
        },
        {
            id: "cust-4",
            first_name: "Savannah",
            last_name: "Jenkins",
            goal: "Fat Loss",
            calories: 1400,
            protein: 130,
            carbs: 110,
            fat: 45,
            delivery_method: "studio_pickup",
            pickup_location: "South Hill Studio",
            shipping_address: null,
            is_skipped: false,
            selections: {
                'Monday-breakfast': 'Yogurt Parfait', 'Monday-chicken_1': 'Teriyaki Chicken', 'Monday-chicken_2': 'Chicken Fried Rice', 'Monday-steak_meal': 'Steak n Mash',
                'Tuesday-breakfast': 'Yogurt Parfait', 'Tuesday-chicken_1': 'Chicken Fried Rice', 'Tuesday-chicken_2': 'Teriyaki Chicken', 'Tuesday-steak_meal': 'Steak n Mash',
                'Wednesday-breakfast': 'Honey Sweet Cottage Cheese', 'Wednesday-chicken_1': 'Chile Margarita', 'Wednesday-chicken_2': 'Teriyaki Chicken', 'Wednesday-steak_meal': 'Steak n Mash',
                'Thursday-breakfast': 'Yogurt Parfait', 'Thursday-chicken_1': 'Asian Zing', 'Thursday-chicken_2': 'Sweet Chili Chicken Thigh', 'Thursday-steak_meal': 'Steak n Mash',
                'Friday-breakfast': 'Yogurt Parfait', 'Friday-chicken_1': 'Teriyaki Chicken', 'Friday-chicken_2': 'Chicken Fried Rice', 'Friday-steak_meal': 'Steak n Mash',
                'Saturday-breakfast': 'Yogurt Parfait', 'Saturday-chicken_1': 'Chicken Fried Rice', 'Saturday-chicken_2': 'Teriyaki Chicken', 'Saturday-steak_meal': 'Steak n Mash',
                'Sunday-breakfast': 'Honey Sweet Cottage Cheese', 'Sunday-chicken_1': 'Teriyaki Chicken', 'Sunday-chicken_2': 'Chicken Fried Rice', 'Sunday-steak_meal': 'Steak n Mash'
            }
        },
        {
            id: "cust-5",
            first_name: "Duane",
            last_name: "Brown",
            goal: "Fat Loss",
            calories: 2200,
            protein: 175,
            carbs: 165,
            fat: 60,
            delivery_method: "home_delivery",
            pickup_location: null,
            shipping_address: { street: "220 Division St", unit: "", city: "Spokane", zip: "99202" },
            is_skipped: false,
            selections: {
                'Monday-breakfast': 'Steak and Eggs', 'Monday-chicken_1': 'Teriyaki Chicken', 'Monday-chicken_2': 'Chicken Fried Rice', 'Monday-steak_meal': 'Steak n Mash',
                'Tuesday-breakfast': 'Yogurt Parfait', 'Tuesday-chicken_1': 'Chicken Fried Rice', 'Tuesday-chicken_2': 'Teriyaki Chicken', 'Tuesday-steak_meal': 'Steak n Mash',
                'Wednesday-breakfast': 'Honey Sweet Cottage Cheese', 'Wednesday-chicken_1': 'Chile Margarita', 'Wednesday-chicken_2': 'Chicken Fried Rice', 'Wednesday-steak_meal': 'Steak n Mash',
                'Thursday-breakfast': 'Loaded Breakfast Bowl', 'Thursday-chicken_1': 'Asian Zing', 'Thursday-chicken_2': 'Sweet Chili Chicken Thigh', 'Thursday-steak_meal': 'Steak n Mash',
                'Friday-breakfast': 'Steak and Eggs', 'Friday-chicken_1': 'Teriyaki Chicken', 'Friday-chicken_2': 'Chile Margarita', 'Friday-steak_meal': 'Steak n Mash',
                'Saturday-breakfast': 'Yogurt Parfait', 'Saturday-chicken_1': 'Chicken Fried Rice', 'Saturday-chicken_2': 'Steak n Mash', 'Saturday-steak_meal': 'Steak n Mash',
                'Sunday-breakfast': 'Honey Sweet Cottage Cheese', 'Sunday-chicken_1': 'Chile Margarita', 'Sunday-chicken_2': 'Teriyaki Chicken', 'Sunday-steak_meal': 'Steak n Mash'
            }
        }
    ];

    // Connection Settings variables (loaded from localStorage)
    let connectionMode = 'simulation';
    let supabaseUrl = '';
    let supabaseKey = '';
    let makeOrdersUrl = 'https://hook.us2.make.com/placeholder_get_orders';

    let activeCustomers = [];

    // Helper functions for settings drawer
    function loadConnectionSettings() {
        const savedMode = localStorage.getItem('ff_conn_mode');
        if (savedMode) connectionMode = savedMode;
        
        supabaseUrl = localStorage.getItem('ff_sb_url') || '';
        supabaseKey = localStorage.getItem('ff_sb_key') || '';
        makeOrdersUrl = localStorage.getItem('ff_make_orders_url') || 'https://hook.us2.make.com/placeholder_get_orders';
        
        const modeSelect = document.getElementById('settings-connection-mode');
        if (modeSelect) modeSelect.value = connectionMode;
        
        const sbUrlInput = document.getElementById('settings-supabase-url');
        if (sbUrlInput) sbUrlInput.value = supabaseUrl;
        
        const sbKeyInput = document.getElementById('settings-supabase-key');
        if (sbKeyInput) sbKeyInput.value = supabaseKey;
        
        const makeOrdersInput = document.getElementById('settings-make-orders-url');
        if (makeOrdersInput) makeOrdersInput.value = makeOrdersUrl;
        
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
                const makeOrders = document.getElementById('settings-make-orders-url').value.trim();
                
                localStorage.setItem('ff_conn_mode', mode);
                localStorage.setItem('ff_sb_url', sbUrl);
                localStorage.setItem('ff_sb_key', sbKey);
                localStorage.setItem('ff_make_orders_url', makeOrders);
                
                connectionMode = mode;
                supabaseUrl = sbUrl;
                supabaseKey = sbKey;
                makeOrdersUrl = makeOrders;
                
                const status = document.getElementById('settings-status-message');
                if (status) {
                    status.style.color = '#2ec4b6';
                    status.textContent = 'Connection settings saved!';
                    setTimeout(() => { status.textContent = ''; }, 3000);
                }
                
                closeDrawer();
                loadKitchenData();
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
                    const makeOrders = document.getElementById('settings-make-orders-url').value.trim();
                    if (!makeOrders) {
                        status.style.color = 'var(--brand-red)';
                        status.textContent = 'Error: Get Active Orders URL is empty.';
                        return;
                    }
                    try {
                        const res = await fetch(`${makeOrders}?test=true`, { mode: 'cors' });
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

    async function loadKitchenData() {
        try {
            if (connectionMode === 'supabase') {
                if (typeof supabase === 'undefined') {
                    throw new Error("Supabase client SDK not loaded.");
                }
                if (!supabaseUrl || !supabaseKey) {
                    throw new Error("Supabase URL or Key not set.");
                }
                const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
                const upcomingMonday = getUpcomingMondayDateString();

                // Fetch dynamic ingredients and meals definitions
                const { data: dbIngredients, error: ingError } = await supabaseClient.from('ingredients').select('*');
                if (ingError) throw ingError;

                const { data: dbMeals, error: mealsError } = await supabaseClient.from('meals').select('*');
                if (mealsError) throw mealsError;

                // Sync local dictionaries in admin.js
                if (dbIngredients && dbIngredients.length > 0) {
                    dbIngredients.forEach(ing => {
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

                if (dbMeals && dbMeals.length > 0) {
                    dbMeals.forEach(meal => {
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

                const { data: dbCustomers, error: custError } = await supabaseClient
                    .from('customers')
                    .select(`
                        id, first_name, last_name, gym, fitness_goal, status,
                        macro_profiles(calories, protein_grams, carb_grams, fat_grams, is_active),
                        weekly_orders(id, status, week_start_date)
                    `)
                    .eq('status', 'active');
                
                if (custError) throw custError;

                const activeOrderIds = [];
                const customerOrderMap = {};
                dbCustomers.forEach(cust => {
                    const matchingOrder = cust.weekly_orders ? cust.weekly_orders.find(o => o.week_start_date === upcomingMonday) : null;
                    if (matchingOrder) {
                        activeOrderIds.push(matchingOrder.id);
                        customerOrderMap[cust.id] = matchingOrder;
                    }
                });

                let dbOrderDetails = [];
                if (activeOrderIds.length > 0) {
                    const { data: details, error: detailsError } = await supabaseClient
                        .from('weekly_order_details')
                        .select(`
                            weekly_order_id, day_of_week, meal_slot,
                            meals(name)
                        `)
                        .in('weekly_order_id', activeOrderIds);
                    if (detailsError) throw detailsError;
                    dbOrderDetails = details || [];
                }

                const { data: dbDefaultSelections, error: defaultsError } = await supabaseClient
                    .from('customer_meal_selections')
                    .select(`
                        customer_id, day_of_week, meal_slot,
                        meals(name)
                    `);
                if (defaultsError) throw defaultsError;

                let dbDeliveryDetails = [];
                if (activeOrderIds.length > 0) {
                    const { data: delivs, error: delivsError } = await supabaseClient
                        .from('delivery_details')
                        .select('*')
                        .in('weekly_order_id', activeOrderIds);
                    if (delivsError) throw delivsError;
                    dbDeliveryDetails = delivs || [];
                }
                const orderDeliveryMap = {};
                dbDeliveryDetails.forEach(d => {
                    orderDeliveryMap[d.weekly_order_id] = d;
                });

                activeCustomers = dbCustomers.map(cust => {
                    const activeMacro = cust.macro_profiles ? cust.macro_profiles.find(mp => mp.is_active) : null;
                    const order = customerOrderMap[cust.id];
                    const is_skipped = order ? (order.status === 'skipped') : false;

                    let delivery_method = 'studio_pickup';
                    let pickup_location = cust.gym || 'Spokane Valley Center';
                    let shipping_address = null;

                    if (order && orderDeliveryMap[order.id]) {
                        const del = orderDeliveryMap[order.id];
                        delivery_method = del.delivery_type;
                        if (delivery_method === 'studio_pickup') {
                            pickup_location = del.location_name;
                        } else {
                            pickup_location = null;
                            shipping_address = parseAddressString(del.delivery_address);
                        }
                    }

                    const selections = {};
                    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                    days.forEach(day => {
                        slots.forEach(slot => {
                            selections[`${day}-${slot}`] = 'Homemade Meal';
                        });
                    });

                    if (order) {
                        const details = dbOrderDetails.filter(d => d.weekly_order_id === order.id);
                        details.forEach(d => {
                            const name = d.meals ? d.meals.name : null;
                            if (name) {
                                selections[`${d.day_of_week}-${d.meal_slot}`] = name;
                            }
                        });
                    } else {
                        const defaults = dbDefaultSelections.filter(ds => ds.customer_id === cust.id);
                        defaults.forEach(ds => {
                            const name = ds.meals ? ds.meals.name : null;
                            if (name) {
                                selections[`${ds.day_of_week}-${ds.meal_slot}`] = name;
                            }
                        });
                    }

                    return {
                        id: cust.id,
                        first_name: cust.first_name,
                        last_name: cust.last_name,
                        goal: cust.fitness_goal || 'Fat Loss',
                        calories: activeMacro ? activeMacro.calories : 2000,
                        protein: activeMacro ? activeMacro.protein_grams : 150,
                        carbs: activeMacro ? activeMacro.carb_grams : 150,
                        fat: activeMacro ? activeMacro.fat_grams : 60,
                        delivery_method,
                        pickup_location,
                        shipping_address,
                        is_skipped,
                        selections
                    };
                });

                const badge = document.querySelector('.portal-status-badge');
                if (badge) {
                    badge.innerHTML = `
                        <span class="status-indicator-dot active-pulse"></span>
                        <span class="status-text">Status: <strong>Active DB</strong></span>
                    `;
                }
            } else if (connectionMode === 'make') {
                if (!makeOrdersUrl || makeOrdersUrl.includes('placeholder_get_orders')) {
                    throw new Error("Make.com orders webhook URL not set.");
                }
                const response = await fetch(makeOrdersUrl);
                if (!response.ok) throw new Error("Make.com orders webhook request failed.");
                const data = await response.json();
                
                if (Array.isArray(data)) {
                    activeCustomers = data;
                } else if (data && Array.isArray(data.customers)) {
                    activeCustomers = data.customers;
                } else {
                    throw new Error("Invalid response schema from Make.com webhook.");
                }

                const badge = document.querySelector('.portal-status-badge');
                if (badge) {
                    badge.innerHTML = `
                        <span class="status-indicator-dot" style="background-color: #2ec4b6; box-shadow: 0 0 10px rgba(46, 196, 182, 0.4);"></span>
                        <span class="status-text">Status: <strong>Webhook Live</strong></span>
                    `;
                }
            } else {
                loadMockKitchenData();
            }
        } catch (err) {
            console.warn("Failed to retrieve live kitchen data. Using simulation database fallback:", err);
            loadMockKitchenData();
        } finally {
            calculateAndRender();
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

    function loadMockKitchenData() {
        activeCustomers = [...mockCustomers];
        const badge = document.querySelector('.portal-status-badge');
        if (badge) {
            badge.innerHTML = `
                <span class="status-indicator-dot" style="background-color: #ffaa00; box-shadow: 0 0 10px rgba(255, 170, 0, 0.4);"></span>
                <span class="status-text" style="color: #ffaa00;"><strong>Simulation Mode</strong></span>
            `;
        }
    }

    // 3. Tab switching logic
    const tabButtons = document.querySelectorAll('.admin-tab-btn');
    const tabSections = document.querySelectorAll('.admin-tab-section');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => {
                b.classList.remove('active-tab');
                b.classList.add('btn-charcoal');
            });
            btn.classList.add('active-tab');
            btn.classList.remove('btn-charcoal');

            const targetTab = btn.getAttribute('data-tab');
            tabSections.forEach(sec => {
                if (sec.id === targetTab) {
                    sec.style.display = 'block';
                } else {
                    sec.style.display = 'none';
                }
            });
        });
    });

    // 4. Calculate Data and Render Templates
    function calculateAndRender() {
        calculateProductionSheets();
        calculateShoppingList();
        calculateDeliveriesList();
        generateThermalLabels();
    }

    // Tab 1: Production Sheets (Aggregate meal prep orders)
    function calculateProductionSheets() {
        const tbody = document.getElementById('production-list-tbody');
        if (!tbody) return;

        const mealCounts = {};

        activeCustomers.forEach(cust => {
            if (cust.is_skipped) return;
            
            Object.keys(cust.selections).forEach(key => {
                const mealName = cust.selections[key];
                
                // Track counts (ignore Homemade Meal in cooking lists)
                if (mealName === 'Homemade Meal') return;

                mealCounts[mealName] = (mealCounts[mealName] || 0) + 1;
            });
        });

        if (Object.keys(mealCounts).length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 24px; color: rgba(255,255,255,0.45);">No production scheduled for next week.</td></tr>`;
            return;
        }

        tbody.innerHTML = Object.keys(mealCounts).map(meal => {
            const temp = MEAL_TEMPLATES[meal];
            const categoryLabel = temp ? temp.category.toUpperCase() : "N/A";
            
            return `
                <tr style="border-bottom: 1px solid var(--color-border); font-size: 0.95rem;">
                    <td style="padding: 16px; font-weight: 600; color: var(--color-white);">${meal}</td>
                    <td style="padding: 16px; color: rgba(255,255,255,0.5);">${categoryLabel}</td>
                    <td style="padding: 16px; text-align: center; font-weight: 700; color: var(--brand-red);">${mealCounts[meal]}</td>
                    <td style="padding: 16px; text-align: center; font-size: 0.85rem; color: rgba(255,255,255,0.45);">Custom sized portions</td>
                </tr>
            `;
        }).join('');
    }

    // Tab 2: Shopping List (Aggregate raw ingredient ounces)
    function calculateShoppingList() {
        const tbody = document.getElementById('shopping-list-tbody');
        if (!tbody) return;

        const ingredientData = {};

        activeCustomers.forEach(cust => {
            if (cust.is_skipped) return;

            Object.keys(cust.selections).forEach(key => {
                const mealName = cust.selections[key];
                if (mealName === 'Homemade Meal') return;

                const slot = key.split('-')[1];
                const targets = getSlotTargets(slot, cust.protein, cust.carbs, cust.fat);
                const portions = calculateMealOunces(mealName, targets.protein, targets.carbs, targets.fat, cust.goal);
                
                if (portions) {
                    const pIng = INGREDIENTS[portions.protein_id];
                    const cIng = INGREDIENTS[portions.carb_id];
                    const vIng = INGREDIENTS[portions.veg_id];

                    if (pIng) {
                        if (!ingredientData[portions.protein_id]) ingredientData[portions.protein_id] = { cooked: 0, raw: 0 };
                        ingredientData[portions.protein_id].cooked += portions.protein_oz;
                        ingredientData[portions.protein_id].raw += (portions.protein_oz / pIng.yield_ratio);
                    }
                    if (cIng) {
                        if (!ingredientData[portions.carb_id]) ingredientData[portions.carb_id] = { cooked: 0, raw: 0 };
                        ingredientData[portions.carb_id].cooked += portions.carb_oz;
                        ingredientData[portions.carb_id].raw += (portions.carb_oz / cIng.yield_ratio);
                    }
                    if (vIng) {
                        if (!ingredientData[portions.veg_id]) ingredientData[portions.veg_id] = { cooked: 0, raw: 0 };
                        ingredientData[portions.veg_id].cooked += portions.veg_oz;
                        ingredientData[portions.veg_id].raw += (portions.veg_oz / vIng.yield_ratio);
                    }
                }
            });
        });

        if (Object.keys(ingredientData).length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 24px; color: rgba(255,255,255,0.45);">No ingredients needed. All orders skipped.</td></tr>`;
            return;
        }

        tbody.innerHTML = Object.keys(ingredientData).map(ingId => {
            const ing = INGREDIENTS[ingId];
            const data = ingredientData[ingId];
            
            const cookedOz = data.cooked.toFixed(1);
            const cookedLbs = (data.cooked / 16).toFixed(1);
            
            const rawOz = data.raw.toFixed(1);
            const rawLbs = (data.raw / 16).toFixed(1);

            return `
                <tr style="border-bottom: 1px solid var(--color-border); font-size: 0.95rem;">
                    <td style="padding: 16px; font-weight: 600; color: var(--color-white);">${ing ? ing.name : ingId}</td>
                    <td style="padding: 16px; text-transform: uppercase; font-size: 0.8rem; font-weight: 700; color: rgba(255,255,255,0.45);">${ing ? ing.category : 'N/A'}</td>
                    <td style="padding: 16px; text-align: right; font-weight: 500; color: rgba(255,255,255,0.65);">${cookedOz} oz (${cookedLbs} lbs)</td>
                    <td style="padding: 16px; text-align: right; color: #2ec4b6; font-weight: 700;">${rawOz} oz (${rawLbs} lbs)</td>
                </tr>
            `;
        }).join('');
    }

    // Tab 3: Deliveries
    function calculateDeliveriesList() {
        const container = document.getElementById('deliveries-tables-container');
        if (!container) return;

        // Grouping
        const pickups = {};
        const deliveries = [];

        activeCustomers.forEach(cust => {
            if (cust.is_skipped) return;

            // Calculate total meals count for client (excluding homemade)
            let mealCount = 0;
            Object.keys(cust.selections).forEach(k => {
                if (cust.selections[k] !== 'Homemade Meal') mealCount++;
            });

            if (cust.delivery_method === 'studio_pickup') {
                const loc = cust.pickup_location || 'Unknown Studio';
                if (!pickups[loc]) pickups[loc] = [];
                pickups[loc].push({ name: `${cust.first_name} ${cust.last_name}`, count: mealCount });
            } else {
                deliveries.push({
                    name: `${cust.first_name} ${cust.last_name}`,
                    address: `${cust.shipping_address.street}, ${cust.shipping_address.unit ? cust.shipping_address.unit + ', ' : ''}${cust.shipping_address.city} (${cust.shipping_address.zip})`,
                    count: mealCount
                });
            }
        });

        let html = '';

        // Render Studio Pickups
        html += `<h4 style="color: var(--brand-red); margin-bottom: 15px; margin-top: 10px;">Studio Pickups</h4>`;
        Object.keys(pickups).forEach(studio => {
            html += `
                <div style="background: rgba(255,255,255,0.01); border: 1px solid var(--color-border); border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                    <span style="font-family: var(--font-primary); font-weight: 750; font-size: 1rem; text-transform: uppercase; color: var(--color-white); display: block; margin-bottom: 12px;">📍 ${studio}</span>
                    <table style="width: 100%; text-align: left; border-collapse: collapse;">
                        <thead>
                            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1); font-size: 0.8rem; text-transform: uppercase; color: rgba(255,255,255,0.45);">
                                <th style="padding: 8px 12px;">Customer Name</th>
                                <th style="padding: 8px 12px; text-align: right;">Meals to Deliver</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${pickups[studio].map(row => `
                                <tr style="border-bottom: 1px solid rgba(255,255,255,0.03);">
                                    <td style="padding: 10px 12px; font-weight: 600;">${row.name}</td>
                                    <td style="padding: 10px 12px; text-align: right; font-weight: 750; color: #2ec4b6;">${row.count} meals</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        });

        // Render Home Deliveries
        html += `<h4 style="color: var(--brand-red); margin-bottom: 15px; margin-top: 20px;">Home Deliveries</h4>`;
        if (deliveries.length === 0) {
            html += `<p style="font-size: 0.95rem; color: rgba(255,255,255,0.45); margin-bottom: 24px;">No home deliveries scheduled.</p>`;
        } else {
            html += `
                <div style="background: rgba(255,255,255,0.01); border: 1px solid var(--color-border); border-radius: 8px; padding: 20px;">
                    <table style="width: 100%; text-align: left; border-collapse: collapse;">
                        <thead>
                            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1); font-size: 0.8rem; text-transform: uppercase; color: rgba(255,255,255,0.45);">
                                <th style="padding: 8px 12px;">Customer</th>
                                <th style="padding: 8px 12px;">Shipping Address</th>
                                <th style="padding: 8px 12px; text-align: right;">Meals to Courier</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${deliveries.map(row => `
                                <tr style="border-bottom: 1px solid rgba(255,255,255,0.03);">
                                    <td style="padding: 12px; font-weight: 600; vertical-align: top;">${row.name}</td>
                                    <td style="padding: 12px; color: rgba(255,255,255,0.6);">${row.address}</td>
                                    <td style="padding: 12px; text-align: right; font-weight: 750; color: #2ec4b6; vertical-align: top;">${row.count} meals</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }

        container.innerHTML = html;
    }

    // Tab 4: Box Label Generator (Renders clean cards matching the requested layout)
    function generateThermalLabels() {
        const container = document.getElementById('labels-print-container');
        if (!container) return;

        const sizeSelect = document.getElementById('label-size-select');
        const labelSize = sizeSelect ? sizeSelect.value : 'brother-ql';

        // Update container grid class to style layouts differently
        container.className = `admin-labels-grid ${labelSize}`;

        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        let html = '';

        activeCustomers.forEach(cust => {
            if (cust.is_skipped) return;

            days.forEach(day => {
                slots.forEach(slot => {
                    const mealName = cust.selections[`${day}-${slot}`];
                    if (mealName === 'Homemade Meal') return; // No print labels for homemade meals!

                    const targets = getSlotTargets(slot, cust.protein, cust.carbs, cust.fat);
                    const l = getMealLabelMacros(mealName, targets.protein, targets.carbs, targets.fat, cust.goal);

                    if (l) {
                        let displayName = l.name.toUpperCase();
                        if (displayName === "STEAK N MASH") displayName = "STEAK N' MASH";

                        // Determine the Logo Area content: default SVG logomark vs custom uploaded logo
                        let logoAreaContent = '';
                        if (customLogoDataUrl) {
                            logoAreaContent = `
                                <img src="${customLogoDataUrl}" class="label-custom-logo" alt="Custom Brand Logo">
                            `;
                        } else {
                            logoAreaContent = `
                                <svg class="label-logo-svg" viewBox="0 0 200 110" fill="none" stroke="black" stroke-linecap="butt" stroke-linejoin="miter">
                                    <!-- Symbol (Double K, stroke-width 12) -->
                                    <g stroke-width="12">
                                        <path d="M92 10 V62" />
                                        <path d="M108 10 V62" />
                                        <path d="M108 36 L76 10" />
                                        <path d="M108 36 L76 62" />
                                        <path d="M92 36 L124 10" />
                                        <path d="M92 36 L124 62" />
                                    </g>
                                    <!-- Logotype "KAIROS" (stroke-width 5) -->
                                    <g stroke-width="5" stroke-linecap="square">
                                        <!-- K -->
                                        <path d="M38 80 V98" />
                                        <path d="M38 89 L54 80" />
                                        <path d="M40 88 L54 98" />
                                        <!-- A -->
                                        <path d="M62 98 L70 80 L78 98" />
                                        <path d="M65 92 H75" />
                                        <!-- I -->
                                        <path d="M90 80 V98" />
                                        <!-- R -->
                                        <path d="M98 80 V98" />
                                        <path d="M98 80 H110 C113 80 114 83 114 87 C114 91 113 92 110 92 H98" />
                                        <path d="M104 92 L114 98" />
                                        <!-- O [ ] -->
                                        <path d="M128 80 H122 V98 H128" />
                                        <path d="M132 80 H138 V98 H132" />
                                        <!-- S -->
                                        <path d="M162 80 H146 V89 H162 V98 H146" />
                                    </g>
                                </svg>
                                <div class="label-brand-sub">MEAL PREPS</div>
                            `;
                        }

                        html += `
                            <div class="box-thermal-label ${labelSize}">
                                <!-- Download PNG Button (hidden in printing) -->
                                <button class="label-download-btn no-print" data-html2canvas-ignore="true" title="Download PNG">⬇</button>

                                <!-- 1. Brand Logo Header -->
                                <div class="label-logo-area">
                                    ${logoAreaContent}
                                </div>
                                
                                <!-- 2. Meal Title -->
                                <div class="label-meal-title">${displayName}</div>
                                
                                <!-- 3. Calories -->
                                <div class="label-calories">CALORIES: ${l.calories}</div>
                                
                                <!-- 4. Macro Table Grid -->
                                <table class="label-macro-table">
                                    <thead>
                                        <tr>
                                            <th>PROTEIN</th>
                                            <th>FAT</th>
                                            <th>CARBS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>${l.protein}G</td>
                                            <td>${l.fat}G</td>
                                            <td>${l.carbs}G</td>
                                        </tr>
                                    </tbody>
                                </table>
                                
                                <!-- 5. Ingredients -->
                                <div class="label-ingredients-row">
                                    <strong>Ingredients:</strong> ${l.ingredients}
                                </div>
                                
                                <!-- 6. Warm Up Instructions -->
                                <div class="label-instructions-row">
                                    <strong>Warm Up Instructions:</strong> We recommend cooking for 1-1:30 min or until core temperature reaches 165 degrees.
                                </div>

                                <!-- 7. Kitchen Internal Sorting Tag -->
                                <div class="label-sorting-tag">
                                    Client: ${cust.first_name} ${cust.last_name} | ${day.substring(0,3).toUpperCase()} - ${SLOT_LABELS[slot]}
                                </div>
                            </div>
                        `;
                    }
                });
            });
        });

        if (html === '') {
            container.innerHTML = `<p style="text-align: center; padding: 48px; color: rgba(255,255,255,0.45);">No labels to generate. All orders skipped.</p>`;
            return;
        }

        container.innerHTML = html;
    }

    // Attach print button handler
    const printBtn = document.getElementById('print-all-labels-btn');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // Set production date indicator range (next Monday)
    const weekNode = document.getElementById('admin-production-week');
    if (weekNode) {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const monday = new Date(today);
        monday.setDate(today.getDate() + distanceToMonday + 7);
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        weekNode.textContent = `Production Week: ${monday.toLocaleDateString('en-US', options)}`;
    }

    // Custom logo upload logic
    const logoUpload = document.getElementById('label-logo-upload');
    const resetLogoBtn = document.getElementById('reset-logo-btn');

    if (logoUpload) {
        logoUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    customLogoDataUrl = event.target.result;
                    if (resetLogoBtn) resetLogoBtn.style.display = 'block';
                    generateThermalLabels(); // re-generate labels with custom logo
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (resetLogoBtn) {
        resetLogoBtn.addEventListener('click', () => {
            customLogoDataUrl = null;
            if (logoUpload) logoUpload.value = ''; // clear file input
            resetLogoBtn.style.display = 'none';
            generateThermalLabels(); // re-generate default labels
        });
    }

    // Custom label size changer
    const sizeSelect = document.getElementById('label-size-select');
    if (sizeSelect) {
        sizeSelect.addEventListener('change', () => {
            generateThermalLabels(); // re-generate labels with selected size
        });
    }

    // PNG Download handlers
    const labelsContainer = document.getElementById('labels-print-container');
    if (labelsContainer) {
        // Individual label download
        labelsContainer.addEventListener('click', (e) => {
            const downloadBtn = e.target.closest('.label-download-btn');
            if (downloadBtn) {
                const labelCard = downloadBtn.closest('.box-thermal-label');
                if (labelCard) {
                    const sortingTag = labelCard.querySelector('.label-sorting-tag')?.innerText || 'label';
                    const filename = sortingTag.replace(/Client:\s*/i, '').replace(/[^a-z0-9]/gi, '_').toLowerCase();

                    // Convert to PNG via html2canvas
                    html2canvas(labelCard, {
                        scale: 3, // High quality res
                        useCORS: true,
                        backgroundColor: '#ffffff'
                    }).then(canvas => {
                        const link = document.createElement('a');
                        link.download = `${filename}.png`;
                        link.href = canvas.toDataURL('image/png');
                        link.click();
                    });
                }
            }
        });
    }

    // Bulk labels download
    const downloadAllBtn = document.getElementById('download-all-labels-btn');
    if (downloadAllBtn) {
        downloadAllBtn.addEventListener('click', () => {
            const labels = document.querySelectorAll('.box-thermal-label');
            if (labels.length === 0) return;

            labels.forEach((label, idx) => {
                // Stagger downloads to prevent browser blocking sequential downloads
                setTimeout(() => {
                    const sortingTag = label.querySelector('.label-sorting-tag')?.innerText || 'label';
                    const filename = sortingTag.replace(/Client:\s*/i, '').replace(/[^a-z0-9]/gi, '_').toLowerCase();

                    html2canvas(label, {
                        scale: 3,
                        useCORS: true,
                        backgroundColor: '#ffffff'
                    }).then(canvas => {
                        const link = document.createElement('a');
                        link.download = `${filename}.png`;
                        link.href = canvas.toDataURL('image/png');
                        link.click();
                    });
                }, idx * 600); // 600ms delay between each download
            });
        });
    }

    // Load local settings and start handlers
    loadConnectionSettings();
    initSettingsHandlers();

    // Run aggregations and layout builder on start
    loadKitchenData();
});
