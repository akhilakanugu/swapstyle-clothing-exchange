const BRAND_MULTIPLIERS = {
  'Zara': 1.0,
  'H&M': 0.8,
  'Nike': 1.2,
  'Adidas': 1.2,
  'Levi\'s': 1.3,
  'Patagonia': 1.8,
  'Gucci': 3.5,
  'Generic': 0.6
};

const CONDITION_MULTIPLIERS = {
  'Brand New': 1.0,
  'Like New': 0.85,
  'Gently Used': 0.65,
  'Well Worn': 0.4
};

const BASE_CATEGORY_VALUES = {
  'T-Shirt': 15,
  'Shirt': 25,
  'Pants': 35,
  'Jacket': 60,
  'Dress': 45,
  'Shoes': 50
};

exports.calculateSwapValue = (category, brand, condition) => {
  const base = BASE_CATEGORY_VALUES[category] || 20;
  const brandMult = BRAND_MULTIPLIERS[brand] || BRAND_MULTIPLIERS['Generic'];
  const condMult = CONDITION_MULTIPLIERS[condition] || 0.5;

  return Math.round(base * brandMult * condMult);
};