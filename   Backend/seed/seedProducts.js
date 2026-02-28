import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/productModel.js';

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
console.log('✅ Connected to MongoDB');

// We use Picsum Photos for real-looking placeholder images
// Each ID gives a different image. For men's fashion we use specific IDs.
const products = [
  // ── T-SHIRTS ──────────────────────────────────────────────────────────────
  { name: "Classic White Crew Neck T-Shirt", price: 499, description: "Premium 100% cotton crew neck tee. Everyday essential with a relaxed fit and breathable fabric. Perfect for casual outings.", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80", stock: 120, category: "T-Shirts" },
  { name: "Black Graphic Oversized Tee", price: 649, description: "Trendy oversized graphic tee with bold print. Drop shoulder design, 100% cotton, unisex street-style fit.", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=80", stock: 85, category: "T-Shirts" },
  { name: "Navy Blue Polo T-Shirt", price: 799, description: "Classic pique cotton polo with ribbed collar and two-button placket. Smart casual staple for any wardrobe.", image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=500&q=80", stock: 60, category: "T-Shirts" },
  { name: "Striped Half Sleeve Shirt", price: 699, description: "Soft cotton blend striped tee with a modern slim fit. Versatile enough for work or weekend wear.", image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=500&q=80", stock: 75, category: "T-Shirts" },
  { name: "Henley Neck T-Shirt", price: 599, description: "Stylish henley with 3-button placket. Made from soft jersey fabric with a comfortable regular fit.", image: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=500&q=80", stock: 90, category: "T-Shirts" },
  { name: "V-Neck Plain Tee - Pack of 3", price: 999, description: "Value pack of 3 essential V-neck tees in white, grey and black. Soft, stretchy and long-lasting.", image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500&q=80", stock: 50, category: "T-Shirts" },

  // ── SHIRTS ────────────────────────────────────────────────────────────────
  { name: "Slim Fit Oxford Button-Down Shirt", price: 1299, description: "Timeless Oxford weave button-down in slim fit. Perfect for office, semi-formal, or smart casual looks.", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&q=80", stock: 45, category: "Shirts" },
  { name: "Linen Summer Shirt - Sky Blue", price: 1499, description: "Breathable pure linen shirt ideal for summer. Relaxed fit with a cool texture. Available in sky blue.", image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500&q=80", stock: 40, category: "Shirts" },
  { name: "Floral Print Casual Shirt", price: 1199, description: "Vibrant tropical floral print shirt. Relaxed Cuban collar, perfect for vacations and beach outings.", image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=500&q=80", stock: 35, category: "Shirts" },
  { name: "Flannel Checked Full Sleeve Shirt", price: 1399, description: "Cozy brushed flannel shirt in classic check pattern. Great for layering in autumn and winter.", image: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=500&q=80", stock: 55, category: "Shirts" },
  { name: "Mandarin Collar Linen Kurta Shirt", price: 1099, description: "Elegant mandarin collar shirt in breathable linen. A fusion of traditional and contemporary style.", image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&q=80", stock: 30, category: "Shirts" },
  { name: "Denim Overshirt", price: 1799, description: "Versatile denim overshirt that works as a light jacket or layering piece. Chest pockets, relaxed fit.", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&q=80", stock: 40, category: "Shirts" },

  // ── JEANS & PANTS ─────────────────────────────────────────────────────────
  { name: "Slim Fit Dark Wash Jeans", price: 1999, description: "Premium dark indigo slim fit jeans with slight stretch for comfort. Five-pocket construction, tapered leg.", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80", stock: 65, category: "Jeans" },
  { name: "Classic Straight Fit Jeans", price: 1799, description: "Evergreen straight cut jeans in mid-blue wash. Durable denim with comfortable regular waist.", image: "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=500&q=80", stock: 70, category: "Jeans" },
  { name: "Skinny Fit Black Jeans", price: 1699, description: "Sharp black skinny jeans with stretch denim. Modern silhouette that pairs well with any top.", image: "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=500&q=80", stock: 55, category: "Jeans" },
  { name: "Cargo Pants - Olive Green", price: 1899, description: "Rugged multi-pocket cargo pants in olive green. Relaxed fit with adjustable waist and durable fabric.", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80", stock: 45, category: "Pants" },
  { name: "Chino Trousers - Beige", price: 1599, description: "Smart chino trousers in classic beige. Slim tapered fit, cotton blend fabric, flat front design.", image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&q=80", stock: 60, category: "Pants" },
  { name: "Track Pants with Zipper Pockets", price: 1199, description: "Comfortable jogger-style track pants with secure zipper pockets. Moisture-wicking fabric for workouts.", image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=500&q=80", stock: 80, category: "Pants" },

  // ── JACKETS & HOODIES ─────────────────────────────────────────────────────
  { name: "Puffer Jacket - Black", price: 3499, description: "Lightweight puffer jacket with quilted shell and warm synthetic fill. Packable and water-resistant.", image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=500&q=80", stock: 30, category: "Jackets" },
  { name: "Leather Biker Jacket", price: 4999, description: "Classic faux leather biker jacket with asymmetric zip, snap-button collar and silver hardware.", image: "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=500&q=80", stock: 20, category: "Jackets" },
  { name: "Bomber Jacket - Olive", price: 2999, description: "Iconic bomber jacket in olive with ribbed cuffs, collar and hem. Satin lining, side pockets.", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80", stock: 25, category: "Jackets" },
  { name: "Pullover Hoodie - Grey Melange", price: 1499, description: "Soft fleece pullover hoodie with kangaroo pocket. Perfect for layering in cool weather.", image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=500&q=80", stock: 90, category: "Hoodies" },
  { name: "Zip-Up Sweatshirt Hoodie", price: 1699, description: "Full zip hoodie in heavyweight cotton fleece. Ribbed cuffs, dual pockets, comfortable fit.", image: "https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=500&q=80", stock: 75, category: "Hoodies" },
  { name: "Varsity Jacket - Navy & White", price: 2499, description: "Classic varsity jacket with contrast sleeves, snap buttons and embroidered details.", image: "https://images.unsplash.com/photo-1544441893-675973e31985?w=500&q=80", stock: 28, category: "Jackets" },

  // ── ETHNIC & TRADITIONAL ──────────────────────────────────────────────────
  { name: "Cotton Kurta - White", price: 999, description: "Classic cotton kurta in white. Comfortable straight cut with side slits. Ideal for daily wear and festivities.", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80", stock: 100, category: "Ethnic" },
  { name: "Kurta Pajama Set - Cream", price: 1799, description: "Elegant cream cotton kurta with matching pajama. Subtle embroidery on collar and cuffs.", image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&q=80", stock: 50, category: "Ethnic" },
  { name: "Pathani Suit - Navy Blue", price: 2199, description: "Traditional Pathani suit in premium cotton. Relaxed fit, comfortable in all seasons.", image: "https://images.unsplash.com/photo-1615886753866-779549a93816?w=500&q=80", stock: 35, category: "Ethnic" },
  { name: "Bandhgala Blazer - Black", price: 3999, description: "Sophisticated Nehru collar bandhgala blazer. Perfect for weddings and formal ethnic occasions.", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&q=80", stock: 18, category: "Ethnic" },

  // ── FOOTWEAR ──────────────────────────────────────────────────────────────
  { name: "White Sneakers - Minimal", price: 2499, description: "Clean minimalist white leather sneakers with rubber sole. Goes with everything from jeans to chinos.", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80", stock: 55, category: "Footwear" },
  { name: "Running Shoes - Black/Red", price: 3499, description: "Lightweight performance running shoes with cushioned midsole and breathable mesh upper.", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&q=80", stock: 40, category: "Footwear" },
  { name: "Brown Derby Leather Shoes", price: 3999, description: "Classic brown Derby shoes in genuine leather with brogue detailing. Perfect for formal occasions.", image: "https://images.unsplash.com/photo-1614252235316-8c857196f400?w=500&q=80", stock: 25, category: "Footwear" },
  { name: "Loafers - Tan Suede", price: 2999, description: "Premium suede loafers in tan. Slip-on style with cushioned insole for all-day comfort.", image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500&q=80", stock: 30, category: "Footwear" },
  { name: "Canvas Slip-On Shoes", price: 1499, description: "Casual canvas slip-on shoes with elastic side panels and flat rubber sole. Lightweight everyday wear.", image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&q=80", stock: 70, category: "Footwear" },
  { name: "Chelsea Boots - Black", price: 4499, description: "Sleek black Chelsea boots with elastic side panels and pull tab. Pairs with jeans or trousers.", image: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=500&q=80", stock: 22, category: "Footwear" },
  { name: "Sports Sandals", price: 1299, description: "Durable EVA sports sandals with adjustable straps. Ideal for outdoor activities and casual beach wear.", image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500&q=80", stock: 65, category: "Footwear" },

  // ── ACCESSORIES ───────────────────────────────────────────────────────────
  { name: "Leather Belt - Black", price: 799, description: "Classic genuine leather belt with silver buckle. 38mm width, fits waist 28-42 inches.", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80", stock: 100, category: "Accessories" },
  { name: "Aviator Sunglasses", price: 1299, description: "Iconic aviator sunglasses with UV400 protection. Metal frame, green lens, timeless design.", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80", stock: 60, category: "Accessories" },
  { name: "Canvas Tote Bag - Navy", price: 999, description: "Sturdy canvas tote bag with internal pocket. Carries laptops up to 15 inches plus daily essentials.", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a45?w=500&q=80", stock: 45, category: "Accessories" },
  { name: "Minimalist Watch - Silver", price: 2999, description: "Clean minimalist watch with mesh stainless steel bracelet and white dial. Water resistant 30m.", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80", stock: 35, category: "Accessories" },
  { name: "Wool Blend Scarf - Charcoal", price: 899, description: "Warm and soft wool blend scarf in charcoal grey. Oversized dimensions for multiple styling options.", image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=500&q=80", stock: 50, category: "Accessories" },
  { name: "Snapback Cap - Black", price: 699, description: "Structured snapback cap with flat brim and adjustable back strap. Classic all-black colorway.", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&q=80", stock: 80, category: "Accessories" },
  { name: "Bifold Leather Wallet", price: 1199, description: "Slim genuine leather bifold wallet with 6 card slots and a bill compartment. RFID blocking.", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80", stock: 75, category: "Accessories" },
  { name: "Sports Gym Bag - Black", price: 1799, description: "Spacious sports duffle bag with separate shoe compartment, wet pocket and adjustable strap.", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80", stock: 40, category: "Accessories" },

  // ── INNERWEAR & SOCKS ─────────────────────────────────────────────────────
  { name: "Cotton Boxer Briefs - Pack of 3", price: 799, description: "Premium cotton boxer briefs with elastic waistband. Tagless, comfortable fit for all-day wear. Pack of 3.", image: "https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=500&q=80", stock: 120, category: "Innerwear" },
  { name: "Ankle Socks - Pack of 6", price: 599, description: "Soft cotton ankle socks with cushioned sole. Breathable, moisture-wicking. Pack of 6 pairs.", image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=500&q=80", stock: 150, category: "Innerwear" },
  { name: "Thermal Vest & Tights Set", price: 1299, description: "Warm thermal base layer set. Soft fleece inner lining, seamless construction, stretchy fit.", image: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=500&q=80", stock: 55, category: "Innerwear" },

  // ── ACTIVEWEAR ────────────────────────────────────────────────────────────
  { name: "Compression Gym Shorts", price: 999, description: "High-performance compression shorts with moisture-wicking tech. 4-way stretch for full range of motion.", image: "https://images.unsplash.com/photo-1519505907962-0a6cb0167c73?w=500&q=80", stock: 70, category: "Activewear" },
  { name: "Dry-Fit Training T-Shirt", price: 799, description: "Lightweight dry-fit tee engineered for workouts. Quick-dry fabric keeps you cool and dry during exercise.", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80", stock: 90, category: "Activewear" },
  { name: "Jogger Pants - Dark Grey", price: 1399, description: "Tapered jogger pants with elastic waist and cuffs. Side and back pockets, soft brushed interior.", image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=500&q=80", stock: 65, category: "Activewear" },
  { name: "Cycling Jersey - Blue", price: 1599, description: "Aerodynamic cycling jersey with moisture management. Three rear pockets, full zip, reflective details.", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80", stock: 28, category: "Activewear" },

  // ── GROOMING ──────────────────────────────────────────────────────────────
  { name: "Beard Grooming Kit", price: 1499, description: "Complete 7-piece beard grooming set: trimmer scissors, comb, boar brush, oil, balm and wash.", image: "https://images.unsplash.com/photo-1621607512214-68297480165e?w=500&q=80", stock: 45, category: "Grooming" },
  { name: "Men's Perfume - Woody Oud", price: 2499, description: "Long-lasting woody oud fragrance with top notes of bergamot, heart of oud and base of amber.", image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=500&q=80", stock: 30, category: "Grooming" },
  { name: "Hair Styling Clay - Matte Finish", price: 699, description: "Strong hold matte clay for natural textured looks. No shine, reworkable all day, pleasant scent.", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=80", stock: 60, category: "Grooming" },
];

try {
  await Product.deleteMany({});
  console.log('🗑️  Cleared existing products');

  await Product.insertMany(products);
  console.log(`✅ Successfully seeded ${products.length} men's products!`);
  console.log('\nCategories seeded:');

  const categories = [...new Set(products.map(p => p.category))];
  categories.forEach(cat => {
    const count = products.filter(p => p.category === cat).length;
    console.log(`  • ${cat}: ${count} products`);
  });

} catch (error) {
  console.error('❌ Seeding failed:', error.message);
} finally {
  await mongoose.disconnect();
  console.log('\n🔌 Disconnected from MongoDB');
}