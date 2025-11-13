const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const products = [
  // Electronics Category
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium wireless headphones with noise cancellation, 30-hour battery life, and superior sound quality. Perfect for music lovers and professionals.',
    price: 6999,
    originalPrice: 10999,
    discount: 36,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500',
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500',
      'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=500'
    ],
    category: 'Electronics',
    brand: 'SoundMax',
    stock: 50,
    rating: 4.5,
    numReviews: 128,
    variants: {
      colors: ['Black', 'White', 'Blue'],
      sizes: []
    },
    features: ['Noise Cancellation', '30hr Battery', 'Quick Charge', 'Bluetooth 5.0'],
    isFeatured: true,
    isOnSale: true,
  },
  {
    name: 'Smart Watch Pro',
    description: 'Advanced smartwatch with fitness tracking, heart rate monitor, GPS, and 7-day battery life. Water-resistant and compatible with iOS and Android.',
    price: 16999,
    originalPrice: 20999,
    discount: 19,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500',
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500'
    ],
    category: 'Electronics',
    brand: 'TechWear',
    stock: 35,
    rating: 4.7,
    numReviews: 89,
    variants: {
      colors: ['Black', 'Silver', 'Rose Gold'],
      sizes: ['42mm', '46mm']
    },
    features: ['Fitness Tracking', 'Heart Rate Monitor', 'GPS', 'Water Resistant'],
    isFeatured: true,
    isOnSale: false,
  },
  {
    name: 'Portable Power Bank 20000mAh',
    description: 'High-capacity power bank with fast charging support. Can charge smartphones up to 5 times. Compact design with LED indicator.',
    price: 2499,
    originalPrice: 3299,
    discount: 24,
    image: 'https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=500',
    category: 'Electronics',
    brand: 'PowerUp',
    stock: 100,
    rating: 4.3,
    numReviews: 256,
    variants: {
      colors: ['Black', 'Blue', 'Red'],
      sizes: []
    },
    features: ['20000mAh Capacity', 'Fast Charging', 'Dual USB Ports', 'LED Indicator'],
    isFeatured: false,
    isOnSale: true,
  },

  // Clothing Category
  {
    name: 'Classic Cotton T-Shirt',
    description: 'Comfortable 100% cotton t-shirt with modern fit. Available in multiple colors. Perfect for casual wear or layering.',
    price: 1699,
    originalPrice: 2499,
    discount: 32,
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500',
    images: [
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500',
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500'
    ],
    category: 'Clothing',
    brand: 'FashionWear',
    stock: 200,
    rating: 4.2,
    numReviews: 342,
    variants: {
      colors: ['White', 'Black', 'Navy', 'Gray', 'Red'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    features: ['100% Cotton', 'Pre-shrunk', 'Machine Washable', 'Modern Fit'],
    isFeatured: false,
    isOnSale: true,
  },
  {
    name: 'Denim Jeans - Classic Fit',
    description: 'Classic fit denim jeans with stretch comfort. Durable construction with modern styling. Perfect for everyday wear.',
    price: 4199,
    originalPrice: 5799,
    discount: 28,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500',
    category: 'Clothing',
    brand: 'DenimCo',
    stock: 75,
    rating: 4.4,
    numReviews: 198,
    variants: {
      colors: ['Blue', 'Black', 'Light Blue'],
      sizes: ['28', '30', '32', '34', '36', '38']
    },
    features: ['Stretch Denim', 'Classic Fit', 'Durable Construction', 'Machine Washable'],
    isFeatured: true,
    isOnSale: true,
  },
  {
    name: 'Winter Jacket - Waterproof',
    description: 'Warm and waterproof winter jacket with insulated lining. Perfect for cold weather. Features multiple pockets and adjustable hood.',
    price: 7499,
    originalPrice: 10799,
    discount: 31,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500',
    category: 'Clothing',
    brand: 'OutdoorGear',
    stock: 45,
    rating: 4.6,
    numReviews: 112,
    variants: {
      colors: ['Black', 'Navy', 'Gray', 'Red'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    features: ['Waterproof', 'Insulated', 'Multiple Pockets', 'Adjustable Hood'],
    isFeatured: true,
    isOnSale: false,
  },

  // Home & Kitchen Category
  {
    name: 'Stainless Steel Cookware Set',
    description: '10-piece premium stainless steel cookware set. Includes pots, pans, and lids. Dishwasher safe and compatible with all cooktops.',
    price: 12499,
    originalPrice: 16599,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1584990347449-39bcf2dc3e0d?w=500',
    category: 'Home & Kitchen',
    brand: 'KitchenPro',
    stock: 30,
    rating: 4.5,
    numReviews: 167,
    variants: {
      colors: ['Silver'],
      sizes: ['10-Piece Set']
    },
    features: ['Stainless Steel', 'Dishwasher Safe', 'All Cooktops', '10-Piece Set'],
    isFeatured: true,
    isOnSale: true,
  },
  {
    name: 'Coffee Maker - Programmable',
    description: '12-cup programmable coffee maker with auto-shutoff and brew strength control. Perfect for coffee enthusiasts.',
    price: 4999,
    originalPrice: 6699,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1583428372402-2f3b8b6d05d6?w=500',
    category: 'Home & Kitchen',
    brand: 'BrewMaster',
    stock: 60,
    rating: 4.3,
    numReviews: 234,
    variants: {
      colors: ['Black', 'White', 'Stainless Steel'],
      sizes: []
    },
    features: ['12-Cup Capacity', 'Programmable', 'Auto Shutoff', 'Brew Strength Control'],
    isFeatured: false,
    isOnSale: true,
  },
  {
    name: 'Bedding Set - Queen Size',
    description: 'Luxury 6-piece bedding set including comforter, sheets, and pillowcases. 100% cotton with elegant design. Machine washable.',
    price: 6699,
    originalPrice: 9999,
    discount: 33,
    image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=500',
    category: 'Home & Kitchen',
    brand: 'ComfortHome',
    stock: 40,
    rating: 4.4,
    numReviews: 145,
    variants: {
      colors: ['White', 'Gray', 'Beige', 'Blue'],
      sizes: ['Queen', 'King']
    },
    features: ['100% Cotton', '6-Piece Set', 'Machine Washable', 'Elegant Design'],
    isFeatured: false,
    isOnSale: true,
  },

  // Books Category
  {
    name: 'The Complete Guide to Web Development',
    description: 'Comprehensive guide covering HTML, CSS, JavaScript, React, and Node.js. Perfect for beginners and intermediate developers. 500+ pages with practical examples.',
    price: 2899,
    originalPrice: 4199,
    discount: 31,
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500',
    images: [
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500',
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500'
    ],
    category: 'Books',
    brand: 'TechBooks',
    stock: 80,
    rating: 4.6,
    numReviews: 278,
    variants: {
      colors: [],
      sizes: ['Paperback', 'Hardcover', 'eBook']
    },
    features: ['500+ Pages', 'Practical Examples', 'Beginner Friendly', 'Latest Technologies'],
    isFeatured: true,
    isOnSale: false,
  },
  {
    name: 'Laptop Stand - Adjustable Aluminum',
    description: 'Ergonomic laptop stand with adjustable height and angle. Made from premium aluminum. Improves posture and workspace organization.',
    price: 3299,
    originalPrice: 4999,
    discount: 34,
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500',
    images: [
      'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500'
    ],
    category: 'Electronics',
    brand: 'ErgoTech',
    stock: 120,
    rating: 4.4,
    numReviews: 189,
    variants: {
      colors: ['Silver', 'Space Gray', 'Black'],
      sizes: []
    },
    features: ['Adjustable Height', 'Aluminum Build', 'Ergonomic Design', 'Ventilation'],
    isFeatured: false,
    isOnSale: true,
  },
  {
    name: 'Wireless Mouse - Ergonomic Design',
    description: 'Comfortable wireless mouse with ergonomic design. Long battery life up to 12 months. Precision tracking and silent clicks.',
    price: 2099,
    originalPrice: 2899,
    discount: 28,
    image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=500',
    images: [
      'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=500',
      'https://images.unsplash.com/photo-1563297007-0686b7003af7?w=500'
    ],
    category: 'Electronics',
    brand: 'TechPro',
    stock: 200,
    rating: 4.3,
    numReviews: 456,
    variants: {
      colors: ['Black', 'White', 'Pink', 'Blue'],
      sizes: []
    },
    features: ['Wireless', '12 Month Battery', 'Ergonomic', 'Silent Clicks'],
    isFeatured: false,
    isOnSale: true,
  },
  {
    name: '4K Ultra HD Smart TV - 55 inch',
    description: '55-inch 4K Ultra HD Smart TV with HDR. Built-in streaming apps, voice control, and stunning picture quality. Perfect for entertainment.',
    price: 37999,
    originalPrice: 49999,
    discount: 24,
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500',
    images: [
      'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500',
      'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=500'
    ],
    category: 'Electronics',
    brand: 'VisionTech',
    stock: 25,
    rating: 4.7,
    numReviews: 234,
    variants: {
      colors: ['Black'],
      sizes: ['55 inch', '65 inch', '75 inch']
    },
    features: ['4K Ultra HD', 'HDR', 'Smart TV', 'Voice Control'],
    isFeatured: true,
    isOnSale: true,
  },
  {
    name: 'Running Shoes - Athletic',
    description: 'Lightweight running shoes with cushioned sole and breathable mesh upper. Perfect for jogging, training, and daily workouts.',
    price: 5899,
    originalPrice: 8299,
    discount: 29,
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500',
    images: [
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500'
    ],
    category: 'Clothing',
    brand: 'SportMax',
    stock: 150,
    rating: 4.5,
    numReviews: 312,
    variants: {
      colors: ['Black', 'White', 'Blue', 'Red'],
      sizes: ['7', '8', '9', '10', '11', '12']
    },
    features: ['Lightweight', 'Cushioned Sole', 'Breathable', 'Durable'],
    isFeatured: true,
    isOnSale: true,
  },
  {
    name: 'Leather Jacket - Classic',
    description: 'Premium genuine leather jacket with classic design. Lined interior, multiple pockets, and timeless style. Perfect for any occasion.',
    price: 16999,
    originalPrice: 24999,
    discount: 32,
    image: 'https://images.unsplash.com/photo-1520975916090-3105956dda38?w=500',
    images: [
      'https://images.unsplash.com/photo-1520975916090-3105956dda38?w=500',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500'
    ],
    category: 'Clothing',
    brand: 'LeatherCraft',
    stock: 40,
    rating: 4.6,
    numReviews: 98,
    variants: {
      colors: ['Black', 'Brown', 'Navy'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    features: ['Genuine Leather', 'Lined Interior', 'Multiple Pockets', 'Classic Design'],
    isFeatured: true,
    isOnSale: false,
  },
  {
    name: 'Yoga Mat - Premium',
    description: 'Extra thick premium yoga mat with non-slip surface. Eco-friendly material, easy to clean, and perfect for all yoga practices.',
    price: 2499,
    originalPrice: 3699,
    discount: 32,
    image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500',
    images: [
      'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500',
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500'
    ],
    category: 'Sports & Outdoors',
    brand: 'FitLife',
    stock: 180,
    rating: 4.4,
    numReviews: 267,
    variants: {
      colors: ['Purple', 'Blue', 'Pink', 'Black'],
      sizes: ['Standard', 'Extra Long']
    },
    features: ['Non-Slip', 'Extra Thick', 'Eco-Friendly', 'Easy Clean'],
    isFeatured: false,
    isOnSale: true,
  },
  {
    name: 'Dumbbell Set - Adjustable',
    description: 'Adjustable dumbbell set with weight range from 5-25 lbs per dumbbell. Space-saving design perfect for home gyms.',
    price: 12499,
    originalPrice: 16599,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=500&q=80'
    ],
    category: 'Sports & Outdoors',
    brand: 'FitPro',
    stock: 60,
    rating: 4.6,
    numReviews: 145,
    variants: {
      colors: ['Black', 'Silver'],
      sizes: ['5-25 lbs', '10-50 lbs']
    },
    features: ['Adjustable Weight', 'Space Saving', 'Durable', 'Easy Adjust'],
    isFeatured: true,
    isOnSale: true,
  },
  {
    name: 'Backpack - Travel',
    description: 'Durable travel backpack with laptop compartment, multiple pockets, and water-resistant material. Perfect for work and travel.',
    price: 4199,
    originalPrice: 6699,
    discount: 37,
    image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=500',
    images: [
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=500',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'
    ],
    category: 'Sports & Outdoors',
    brand: 'TravelGear',
    stock: 90,
    rating: 4.5,
    numReviews: 223,
    variants: {
      colors: ['Black', 'Navy', 'Gray', 'Red'],
      sizes: ['30L', '40L', '50L']
    },
    features: ['Laptop Compartment', 'Water Resistant', 'Multiple Pockets', 'Durable'],
    isFeatured: false,
    isOnSale: true,
  },
  {
    name: 'Air Fryer - Digital',
    description: '5.8-quart digital air fryer with rapid air technology. Cook healthier meals with 85% less fat. Easy to use and clean.',
    price: 6699,
    originalPrice: 9999,
    discount: 33,
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1606679231023-c90d9b55b5cd?auto=format&fit=crop&w=500&q=80'
    ],
    category: 'Home & Kitchen',
    brand: 'KitchenPro',
    stock: 75,
    rating: 4.5,
    numReviews: 389,
    variants: {
      colors: ['Black', 'White', 'Stainless Steel'],
      sizes: ['5.8 Quart', '6.5 Quart']
    },
    features: ['Digital Display', 'Rapid Air Tech', '85% Less Fat', 'Easy Clean'],
    isFeatured: true,
    isOnSale: true,
  },
  {
    name: 'Stand Mixer - Professional',
    description: 'Professional stand mixer with 5-quart capacity. Includes multiple attachments for versatile cooking and baking.',
    price: 20999,
    originalPrice: 29099,
    discount: 28,
    image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500',
    images: [
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500',
      'https://images.unsplash.com/photo-1600093479361-aa8b1626b5e4?w=500'
    ],
    category: 'Home & Kitchen',
    brand: 'KitchenPro',
    stock: 35,
    rating: 4.7,
    numReviews: 156,
    variants: {
      colors: ['Red', 'Blue', 'Black', 'White'],
      sizes: ['5 Quart', '6 Quart']
    },
    features: ['5-Quart Capacity', 'Multiple Attachments', 'Powerful Motor', 'Durable'],
    isFeatured: true,
    isOnSale: false,
  },
  {
    name: 'Skincare Set - Complete Routine',
    description: 'Complete skincare set with cleanser, toner, serum, and moisturizer. Suitable for all skin types. Natural ingredients.',
    price: 4999,
    originalPrice: 7499,
    discount: 33,
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500',
    images: [
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500',
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500'
    ],
    category: 'Beauty & Personal Care',
    brand: 'GlowSkin',
    stock: 100,
    rating: 4.4,
    numReviews: 278,
    variants: {
      colors: [],
      sizes: ['Normal Skin', 'Dry Skin', 'Oily Skin']
    },
    features: ['Complete Set', 'Natural Ingredients', 'All Skin Types', '4 Products'],
    isFeatured: false,
    isOnSale: true,
  },
  {
    name: 'Electric Toothbrush - Sonic',
    description: 'Sonic electric toothbrush with 5 cleaning modes. Long battery life, pressure sensor, and multiple brush heads included.',
    price: 3299,
    originalPrice: 4999,
    discount: 34,
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1607613009820-a29f7bb81c10?auto=format&fit=crop&w=500&q=80'
    ],
    category: 'Beauty & Personal Care',
    brand: 'OralCare',
    stock: 200,
    rating: 4.5,
    numReviews: 445,
    variants: {
      colors: ['White', 'Pink', 'Blue', 'Black'],
      sizes: []
    },
    features: ['5 Cleaning Modes', 'Pressure Sensor', 'Long Battery', 'Multiple Heads'],
    isFeatured: true,
    isOnSale: true,
  },
  {
    name: 'Board Game - Strategy',
    description: 'Award-winning strategy board game for 2-4 players. Engaging gameplay, high-quality components, and hours of fun.',
    price: 2899,
    originalPrice: 4199,
    discount: 31,
    image: 'https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=500',
    images: [
      'https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=500',
      'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=500'
    ],
    category: 'Toys & Games',
    brand: 'GameMaster',
    stock: 80,
    rating: 4.6,
    numReviews: 189,
    variants: {
      colors: [],
      sizes: []
    },
    features: ['2-4 Players', 'Strategy Game', 'High Quality', 'Award Winning'],
    isFeatured: true,
    isOnSale: false,
  },
  {
    name: 'LEGO Building Set - Architecture',
    description: 'Detailed LEGO building set featuring famous architecture. Perfect for collectors and builders of all ages.',
    price: 6699,
    originalPrice: 8299,
    discount: 19,
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500',
    images: [
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500',
      'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=500'
    ],
    category: 'Toys & Games',
    brand: 'LEGO',
    stock: 50,
    rating: 4.7,
    numReviews: 234,
    variants: {
      colors: [],
      sizes: ['500 pieces', '1000 pieces', '2000 pieces']
    },
    features: ['Detailed Design', 'Collectible', 'All Ages', 'High Quality'],
    isFeatured: true,
    isOnSale: true,
  },
  {
    name: 'Novel - Bestseller Fiction',
    description: 'Bestselling fiction novel with captivating storyline. Hardcover edition with beautiful cover design. Perfect for book lovers.',
    price: 1699,
    originalPrice: 2299,
    discount: 26,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500',
    images: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500',
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'
    ],
    category: 'Books',
    brand: 'BookHouse',
    stock: 150,
    rating: 4.5,
    numReviews: 567,
    variants: {
      colors: [],
      sizes: ['Paperback', 'Hardcover', 'eBook', 'Audiobook']
    },
    features: ['Bestseller', 'Captivating Story', 'Hardcover', 'Great Gift'],
    isFeatured: false,
    isOnSale: true,
  },
  {
    name: 'Cookbook - Healthy Recipes',
    description: 'Comprehensive cookbook with 200+ healthy recipes. Beautiful photography, step-by-step instructions, and nutritional information.',
    price: 2099,
    originalPrice: 2899,
    discount: 28,
    image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=500',
    images: [
      'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=500',
      'https://images.unsplash.com/photo-1505682634904-d7c8d95cdc50?w=500'
    ],
    category: 'Books',
    brand: 'CookBooks',
    stock: 120,
    rating: 4.4,
    numReviews: 198,
    variants: {
      colors: [],
      sizes: ['Paperback', 'Hardcover']
    },
    features: ['200+ Recipes', 'Healthy Options', 'Step-by-Step', 'Nutritional Info'],
    isFeatured: false,
    isOnSale: true,
  },
  {
    name: 'Tablet - 10 inch',
    description: '10-inch tablet with high-resolution display, long battery life, and powerful processor. Perfect for work, entertainment, and creativity.',
    price: 16999,
    originalPrice: 24999,
    discount: 32,
    image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500',
    images: [
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500',
      'https://images.unsplash.com/photo-1585790050230-5dd28404f005?w=500'
    ],
    category: 'Electronics',
    brand: 'TechTab',
    stock: 60,
    rating: 4.5,
    numReviews: 312,
    variants: {
      colors: ['Space Gray', 'Silver', 'Gold'],
      sizes: ['64GB', '128GB', '256GB']
    },
    features: ['10-inch Display', 'Long Battery', 'Powerful Processor', 'High Resolution'],
    isFeatured: true,
    isOnSale: true,
  },
  {
    name: 'Gaming Keyboard - Mechanical',
    description: 'RGB mechanical gaming keyboard with customizable keys, anti-ghosting, and premium switches. Perfect for gaming and typing.',
    price: 7499,
    originalPrice: 10799,
    discount: 31,
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33cab9ef?w=500',
    images: [
      'https://images.unsplash.com/photo-1618384887929-16ec33cab9ef?w=500',
      'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500'
    ],
    category: 'Electronics',
    brand: 'GameTech',
    stock: 85,
    rating: 4.6,
    numReviews: 267,
    variants: {
      colors: ['Black', 'White'],
      sizes: ['Full Size', 'Tenkeyless']
    },
    features: ['RGB Lighting', 'Mechanical Switches', 'Anti-Ghosting', 'Customizable'],
    isFeatured: true,
    isOnSale: false,
  },
  {
    name: 'Sunglasses - Aviator',
    description: 'Classic aviator sunglasses with UV protection, polarized lenses, and durable frame. Stylish design for all occasions.',
    price: 4199,
    originalPrice: 6699,
    discount: 37,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500'
    ],
    category: 'Clothing',
    brand: 'SunStyle',
    stock: 200,
    rating: 4.4,
    numReviews: 445,
    variants: {
      colors: ['Black', 'Gold', 'Silver', 'Brown'],
      sizes: []
    },
    features: ['UV Protection', 'Polarized Lenses', 'Durable Frame', 'Classic Design'],
    isFeatured: false,
    isOnSale: true,
  },
  {
    name: 'Vacuum Cleaner - Cordless',
    description: 'Powerful cordless vacuum cleaner with long battery life, multiple attachments, and HEPA filter. Lightweight and easy to use.',
    price: 12499,
    originalPrice: 16599,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500',
    images: [
      'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'
    ],
    category: 'Home & Kitchen',
    brand: 'CleanHome',
    stock: 70,
    rating: 4.5,
    numReviews: 234,
    variants: {
      colors: ['Red', 'Blue', 'Black'],
      sizes: []
    },
    features: ['Cordless', 'HEPA Filter', 'Long Battery', 'Multiple Attachments'],
    isFeatured: true,
    isOnSale: true,
  },
];

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    let mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';
    
    // Add database name if not present
    if (mongoURI.includes('mongodb.net/?')) {
      mongoURI = mongoURI.replace('mongodb.net/?', 'mongodb.net/ecommerce?');
    } else if (mongoURI.endsWith('mongodb.net/')) {
      mongoURI = mongoURI + 'ecommerce';
    }
    
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert products
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Created ${createdProducts.length} products`);

    console.log('\n📦 Products seeded successfully!');
    console.log('Categories:', [...new Set(products.map(p => p.category))].join(', '));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();

