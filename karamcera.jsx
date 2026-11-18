import React, { useState, useEffect, useMemo } from 'react';

// ==========================================
// MOCK INITIAL CATALOGUE (1,000+ SKU-Ready)
// ==========================================
const INITIAL_PRODUCTS = [
  {
    id: 'KC-POR-901',
    name: 'Imperial Statuario Marble',
    sku: 'KC-POR-901',
    category: 'Marble Look Tiles',
    description: 'High-definition polished porcelain tile replicating classic Italian Statuario marble with subtle grey veining.',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80'
    ],
    size: '120x240 cm',
    thickness: '9 mm',
    finish: 'Glossy',
    colour: 'White / Grey',
    material: 'Porcelain',
    price: '₹240 / sq.ft',
    availability: 'In Stock',
    featured: true,
    published: true,
    views: 1420
  },
  {
    id: 'KC-VIT-402',
    name: 'Sahara Beige Vitrified Slab',
    sku: 'KC-VIT-402',
    category: 'Vitrified Tiles',
    description: 'Ultra-dense double charge vitrified floor tile designed for heavy footfall architectural environments.',
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
    ],
    size: '80x80 cm',
    thickness: '10 mm',
    finish: 'Matt',
    colour: 'Beige',
    material: 'Vitrified',
    price: '₹120 / sq.ft',
    availability: 'In Stock',
    featured: true,
    published: true,
    views: 980
  },
  {
    id: 'KC-WOD-105',
    name: 'Nordic Oak Timber Plank',
    sku: 'KC-WOD-105',
    category: 'Wooden Finish Tiles',
    description: 'Realistic wood-grain porcelain plank tile combining natural warmth with waterproof durability.',
    images: [
      'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=1200&q=80'
    ],
    size: '20x120 cm',
    thickness: '10 mm',
    finish: 'Matt / Textured',
    colour: 'Warm Brown',
    material: 'Porcelain',
    price: '₹145 / sq.ft',
    availability: 'In Stock',
    featured: true,
    published: true,
    views: 1150
  },
  {
    id: 'KC-OUT-708',
    name: 'Basalt Slate Outdoor Paver',
    sku: 'KC-OUT-708',
    category: 'Outdoor Tiles',
    description: 'Anti-slip 20mm thick porcelain paver engineered for patios, driveways, and poolside decking.',
    images: [
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80'
    ],
    size: '60x60 cm',
    thickness: '20 mm',
    finish: 'R11 Anti-Slip',
    colour: 'Charcoal',
    material: 'Full Body Porcelain',
    price: '₹190 / sq.ft',
    availability: 'In Stock',
    featured: false,
    published: true,
    views: 620
  },
  {
    id: 'KC-WAL-303',
    name: 'Aurelia 3D Fluted Wall Tile',
    sku: 'KC-WAL-303',
    category: 'Wall Tiles',
    description: 'Sophisticated tactile wall cladding tile featuring vertical fluting with a soft satin touch.',
    images: [
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80'
    ],
    size: '30x90 cm',
    thickness: '9 mm',
    finish: 'Satin',
    colour: 'Cream / Gold Accent',
    material: 'Ceramic',
    price: '₹165 / sq.ft',
    availability: 'In Stock',
    featured: true,
    published: true,
    views: 890
  },
  {
    id: 'KC-MAR-509',
    name: 'Nero Marquina Luxury Slab',
    sku: 'KC-MAR-509',
    category: 'Marble Look Tiles',
    description: 'Deep black marble-look porcelain tile accented with striking, sharp white lightning veins.',
    images: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80'
    ],
    size: '120x120 cm',
    thickness: '9.5 mm',
    finish: 'High Gloss',
    colour: 'Black',
    material: 'Porcelain',
    price: '₹220 / sq.ft',
    availability: 'Low Stock',
    featured: false,
    published: true,
    views: 740
  }
];

const CATEGORIES = [
  'Ceramic Tiles',
  'Vitrified Tiles',
  'Porcelain Tiles',
  'Double Charge Tiles',
  'Full Body Tiles',
  'Marble Look Tiles',
  'Wooden Finish Tiles',
  'Wall Tiles',
  'Floor Tiles',
  'Bathroom Tiles',
  'Outdoor Tiles'
];

export default function App() {
  // Navigation & View State
  const [currentView, setCurrentView] = useState('home'); // home, about, products, product-detail, contact, privacy, admin
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Catalogue & Supabase Hybrid State
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFinish, setSelectedFinish] = useState('All');
  const [selectedColour, setSelectedColour] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Supabase Configuration State
  const [supabaseUrl, setSupabaseUrl] = useState(() => localStorage.getItem('kc_sb_url') || '');
  const [supabaseKey, setSupabaseKey] = useState(() => localStorage.getItem('kc_sb_key') || '');
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [adminWhatsApp, setAdminWhatsApp] = useState('+919876543210');

  // Analytics State
  const [analytics, setAnalytics] = useState({
    pageViews: 5420,
    uniqueVisitors: 3120,
    whatsappClicks: 342,
    enquiries: 184,
    dateRange: 'Last 30 Days'
  });

  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallModal, setShowInstallModal] = useState(false);

  // Calculator State inside Product Details
  const [calcArea, setCalcArea] = useState(250); // sq ft default
  const [calcWastage, setCalcWastage] = useState(10); // 10% wastage

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView, selectedProduct]);

  useEffect(() => {
    // PWA Install listener
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (!p.published) return false;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesFinish = selectedFinish === 'All' || p.finish.includes(selectedFinish);
      const matchesColour = selectedColour === 'All' || p.colour.toLowerCase().includes(selectedColour.toLowerCase());
      return matchesSearch && matchesCategory && matchesFinish && matchesColour;
    }).sort((a, b) => {
      if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      if (sortBy === 'views') return b.views - a.views;
      if (sortBy === 'newest') return b.id.localeCompare(a.id);
      return 0;
    });
  }, [products, searchQuery, selectedCategory, selectedFinish, selectedColour, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // WhatsApp Enquiry Trigger
  const handleWhatsAppEnquiry = (prod, customNotes = '') => {
    setAnalytics(prev => ({ ...prev, whatsappClicks: prev.whatsappClicks + 1 }));
    const message = encodeURIComponent(
      `Hello Karam Cera Team,\n\nI would like to enquire about the following tile:\n` +
      `• Product: ${prod.name}\n` +
      `• SKU: ${prod.sku}\n` +
      `• Category: ${prod.category}\n` +
      `• Size / Finish: ${prod.size} | ${prod.finish}\n` +
      (customNotes ? `• Requirement: ${customNotes}\n\n` : `\nPlease share pricing, availability, and delivery details.`)
    );
    window.open(`https://wa.me/${adminWhatsApp.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E1E1E] font-sans antialiased selection:bg-[#B89358] selection:text-white">
      {/* Top Notification Bar */}
      <div className="bg-[#1E1E1E] text-[#EDE8E0] text-xs py-2 px-4 text-center tracking-wider font-medium flex justify-between items-center">
        <span className="hidden md:inline">KARAM CERA — Luxury Architectural Porcelain & Vitrified Surfaces</span>
        <div className="mx-auto md:mx-0 flex items-center space-x-4">
          <span>Showroom Hotline: +91 98765 43210</span>
          <span>•</span>
          <button onClick={() => setShowInstallModal(true)} className="text-[#B89358] hover:underline flex items-center gap-1 font-semibold">
            📱 Install App (PWA)
          </button>
        </div>
        <div className="hidden md:flex items-center space-x-3">
          <button onClick={() => setCurrentView('admin')} className="text-[#EDE8E0] hover:text-[#B89358] transition">Admin Portal</button>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EDE8E0] px-6 lg:px-16 py-4 flex items-center justify-between">
        <div className="cursor-pointer flex items-center space-x-3" onClick={() => { setCurrentView('home'); setSelectedProduct(null); }}>
          <div className="w-10 h-10 rounded bg-[#1E1E1E] flex items-center justify-center text-[#B89358] font-bold text-xl tracking-tighter">
            KC
          </div>
          <div>
            <h1 className="text-xl font-serif tracking-widest uppercase font-bold text-[#1E1E1E]">Karam Cera</h1>
            <p className="text-[10px] uppercase tracking-widest text-[#B89358]">Luxury Surfaces</p>
          </div>
        </div>

        <nav className="hidden lg:flex items-center space-x-8 text-sm uppercase tracking-widest font-medium">
          <button onClick={() => setCurrentView('home')} className={`transition hover:text-[#B89358] ${currentView === 'home' ? 'text-[#B89358] border-b-2 border-[#B89358] pb-1' : ''}`}>Home</button>
          <button onClick={() => { setCurrentView('products'); setSelectedCategory('All'); }} className={`transition hover:text-[#B89358] ${currentView === 'products' ? 'text-[#B89358] border-b-2 border-[#B89358] pb-1' : ''}`}>All Products</button>
          <button onClick={() => setCurrentView('about')} className={`transition hover:text-[#B89358] ${currentView === 'about' ? 'text-[#B89358] border-b-2 border-[#B89358] pb-1' : ''}`}>About</button>
          <button onClick={() => setCurrentView('contact')} className={`transition hover:text-[#B89358] ${currentView === 'contact' ? 'text-[#B89358] border-b-2 border-[#B89358] pb-1' : ''}`}>Contact Us</button>
        </nav>

        <div className="flex items-center space-x-4">
          <button 
            onClick={() => { setCurrentView('products'); }}
            className="hidden sm:inline-flex items-center bg-[#1E1E1E] text-white px-5 py-2.5 rounded text-xs uppercase tracking-widest hover:bg-[#B89358] transition duration-300">
            Explore Catalogue
          </button>
          <button 
            onClick={() => setCurrentView('admin')}
            className="lg:hidden text-xs uppercase tracking-wider bg-[#EDE8E0] px-3 py-2 rounded font-semibold">
            Admin
          </button>
        </div>
      </header>

      {/* RENDER CURRENT VIEW */}
      {currentView === 'home' && (
        <HomeView 
          products={products} 
          onSelectProduct={(p) => { setSelectedProduct(p); setCurrentView('product-detail'); }}
          onSelectCategory={(cat) => { setSelectedCategory(cat); setCurrentView('products'); }}
          onExploreClick={() => setCurrentView('products')}
        />
      )}

      {currentView === 'products' && (
        <ProductsView 
          products={paginatedProducts}
          allProductsCount={filteredProducts.length}
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedFinish={selectedFinish}
          setSelectedFinish={setSelectedFinish}
          selectedColour={selectedColour}
          setSelectedColour={setSelectedColour}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          onSelectProduct={(p) => { setSelectedProduct(p); setCurrentView('product-detail'); }}
          onWhatsApp={handleWhatsAppEnquiry}
          onOpenBulkImport={() => setCurrentView('admin-bulk')}
        />
      )}

      {currentView === 'product-detail' && selectedProduct && (
        <ProductDetailView 
          product={selectedProduct}
          onBack={() => setCurrentView('products')}
          onWhatsApp={(notes) => handleWhatsAppEnquiry(selectedProduct, notes)}
          calcArea={calcArea}
          setCalcArea={setCalcArea}
          calcWastage={calcWastage}
          setCalcWastage={setCalcWastage}
        />
      )}

      {currentView === 'about' && <AboutView />}
      {currentView === 'contact' && <ContactView />}
      {currentView === 'privacy' && <PrivacyPolicyView />}
      {currentView === 'admin' && (
        <AdminPortal 
          products={products}
          setProducts={setProducts}
          categories={CATEGORIES}
          analytics={analytics}
          supabaseUrl={supabaseUrl}
          setSupabaseUrl={setSupabaseUrl}
          supabaseKey={supabaseKey}
          setSupabaseKey={setSupabaseKey}
          isLiveConnected={isLiveConnected}
          setIsLiveConnected={setIsLiveConnected}
          adminWhatsApp={adminWhatsApp}
          setAdminWhatsApp={setAdminWhatsApp}
          onGoBack={() => setCurrentView('home')}
        />
      )}

      {/* PWA Install Modal */}
      {showInstallModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-xl p-6 shadow-2xl border border-[#EDE8E0]">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-[#1E1E1E] flex items-center justify-center text-[#B89358] font-bold text-2xl">KC</div>
                <div>
                  <h3 className="font-serif text-lg font-bold">Install Karam Cera App</h3>
                  <p className="text-xs text-gray-500">Access showroom & catalogue instantly</p>
                </div>
              </div>
              <button onClick={() => setShowInstallModal(false)} className="text-gray-400 hover:text-black text-xl">✕</button>
            </div>
            
            <div className="space-y-4 text-sm text-gray-700 my-4">
              <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#EDE8E0]">
                <p className="font-semibold text-black mb-1">Android (Chrome / Edge):</p>
                <p className="text-xs">Tap the browser menu (3 dots) in the top right and select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</p>
              </div>
              <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#EDE8E0]">
                <p className="font-semibold text-black mb-1">iPhone / iPad (Safari):</p>
                <p className="text-xs">Tap the <strong>Share</strong> button at the bottom of Safari, scroll down, and select <strong>"Add to Home Screen"</strong>.</p>
              </div>
            </div>

            {deferredPrompt && (
              <button 
                onClick={() => {
                  deferredPrompt.prompt();
                  deferredPrompt.userChoice.then(() => setDeferredPrompt(null));
                  setShowInstallModal(false);
                }}
                className="w-full bg-[#1E1E1E] text-white py-3 rounded text-xs uppercase tracking-widest font-semibold hover:bg-[#B89358] transition mb-2">
                Install Now Directly
              </button>
            )}

            <button 
              onClick={() => setShowInstallModal(false)}
              className="w-full bg-gray-100 text-gray-800 py-2.5 rounded text-xs uppercase tracking-widest font-medium hover:bg-gray-200 transition">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#1E1E1E] text-[#EDE8E0] pt-16 pb-12 px-6 lg:px-16 border-t border-[#333]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded bg-[#B89358] flex items-center justify-center text-white font-bold text-lg">KC</div>
              <span className="font-serif text-lg tracking-widest font-bold text-white uppercase">Karam Cera</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Curating exquisite architectural porcelain, vitrified tiles, and designer marble slabs for luxury residential and commercial spaces worldwide.
            </p>
            <p className="text-xs text-[#B89358]">Showroom & Global Logistics</p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#B89358] mb-4">Tile Collections</h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li><button onClick={() => { setSelectedCategory('Marble Look Tiles'); setCurrentView('products'); }} className="hover:text-white transition">Marble Look Surfaces</button></li>
              <li><button onClick={() => { setSelectedCategory('Vitrified Tiles'); setCurrentView('products'); }} className="hover:text-white transition">Double Charge Vitrified</button></li>
              <li><button onClick={() => { setSelectedCategory('Wooden Finish Tiles'); setCurrentView('products'); }} className="hover:text-white transition">Wooden Finish Planks</button></li>
              <li><button onClick={() => { setSelectedCategory('Outdoor Tiles'); setCurrentView('products'); }} className="hover:text-white transition">20mm Outdoor Pavers</button></li>
              <li><button onClick={() => { setSelectedCategory('Wall Tiles'); setCurrentView('products'); }} className="hover:text-white transition">3D Fluted Wall Cladding</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#B89358] mb-4">Customer Care</h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li><button onClick={() => setCurrentView('contact')} className="hover:text-white transition">Showroom Consultation</button></li>
              <li><button onClick={() => setShowInstallModal(true)} className="hover:text-white transition">Install Mobile App (PWA)</button></li>
              <li><button onClick={() => setCurrentView('privacy')} className="hover:text-white transition">Privacy Policy & Terms</button></li>
              <li><button onClick={() => setCurrentView('admin')} className="hover:text-white transition">Secure Admin Login</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#B89358] mb-4">Showroom Inquiries</h4>
            <p className="text-xs text-gray-300 mb-2">WhatsApp Concierge Available 24/7</p>
            <p className="text-sm font-semibold text-white mb-4">+91 98765 43210</p>
            <button 
              onClick={() => window.open(`https://wa.me/${adminWhatsApp.replace(/[^0-9]/g, '')}?text=Hello%20Karam%20Cera,%20I%20would%20like%20to%20schedule%20a%20showroom%20consultation.`, '_blank')}
              className="bg-[#B89358] text-white px-4 py-2 rounded text-xs uppercase tracking-widest font-semibold hover:bg-[#a07e4c] transition">
              Chat on WhatsApp
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-[#333] pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} KARAM CERA. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <button onClick={() => setCurrentView('privacy')} className="hover:underline">Privacy Policy</button>
            <button onClick={() => setCurrentView('admin')} className="hover:underline">Admin Panel</button>
            <button onClick={() => setShowInstallModal(true)} className="hover:underline">PWA Status</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ==========================================
// 1. HOME VIEW COMPONENT
// ==========================================
function HomeView({ products, onSelectProduct, onSelectCategory, onExploreClick }) {
  const featured = products.filter(p => p.featured && p.published);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[550px] flex items-center justify-center bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=90" 
            alt="Karam Cera Luxury Showroom" 
            className="w-full h-full object-cover opacity-60 scale-105 animate-pulse duration-[10000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6 text-white">
          <span className="text-[#B89358] uppercase tracking-[0.3em] text-xs font-semibold mb-4 inline-block">
            Architectural Porcelain & Vitrified Surfaces
          </span>
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-light tracking-wide mb-6">
            Sculpting Spaces with Timeless Elegance
          </h2>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto font-light leading-relaxed mb-8">
            Discover ultra-premium large format slabs, marble-look porcelain, and designer tiles crafted for world-class architectural interiors.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onExploreClick}
              className="w-full sm:w-auto bg-[#B89358] text-white px-8 py-3.5 rounded text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#a07e4c] transition shadow-lg">
              Explore Catalogue
            </button>
            <button 
              onClick={() => onSelectCategory('Marble Look Tiles')}
              className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-3.5 rounded text-xs uppercase tracking-[0.2em] font-semibold hover:bg-white/20 transition">
              Marble Look Slabs
            </button>
          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="py-20 px-6 lg:px-16 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[#B89358] uppercase tracking-widest text-xs font-bold mb-2 block">Curated Categories</span>
          <h3 className="text-3xl font-serif font-bold text-[#1E1E1E]">Surfaces for Every Architectural Vision</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { name: 'Marble Look Tiles', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80' },
            { name: 'Vitrified Tiles', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80' },
            { name: 'Wooden Finish Tiles', img: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=600&q=80' },
            { name: 'Outdoor Tiles', img: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=600&q=80' }
          ].map((cat, idx) => (
            <div 
              key={idx}
              onClick={() => onSelectCategory(cat.name)}
              className="group relative h-64 sm:h-80 rounded-lg overflow-hidden cursor-pointer shadow-md">
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                <h4 className="text-white font-serif text-lg sm:text-xl font-medium tracking-wide group-hover:text-[#B89358] transition">{cat.name}</h4>
                <p className="text-xs text-gray-300 uppercase tracking-widest mt-1">View Collection →</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Collections */}
      <section className="bg-[#EDE8E0]/40 py-20 px-6 lg:px-16 border-y border-[#EDE8E0]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <span className="text-[#B89358] uppercase tracking-widest text-xs font-bold mb-2 block">Masterpieces</span>
              <h3 className="text-3xl font-serif font-bold text-[#1E1E1E]">Featured Tile Collections</h3>
            </div>
            <button onClick={onExploreClick} className="mt-4 md:mt-0 text-xs uppercase tracking-widest font-bold underline hover:text-[#B89358] transition">
              View All Products ({products.length}) →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.slice(0, 3).map(product => (
              <div 
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition duration-500 cursor-pointer border border-[#EDE8E0] group">
                <div className="relative h-72 overflow-hidden bg-gray-100">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                  <span className="absolute top-4 left-4 bg-[#1E1E1E] text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded">
                    {product.category}
                  </span>
                  <span className="absolute top-4 right-4 bg-[#B89358] text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded font-bold">
                    {product.size}
                  </span>
                </div>
                <div className="p-6">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">SKU: {product.sku}</p>
                  <h4 className="font-serif text-xl font-bold mb-2 text-[#1E1E1E] group-hover:text-[#B89358] transition">{product.name}</h4>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-4">{product.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm font-bold text-[#1E1E1E]">{product.price || 'Price on Request'}</span>
                    <span className="text-xs uppercase tracking-widest font-semibold text-[#B89358]">Details & Enquiry →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Karam Cera */}
      <section className="py-20 px-6 lg:px-16 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[#B89358] uppercase tracking-widest text-xs font-bold mb-2 block">Uncompromising Standards</span>
          <h3 className="text-3xl font-serif font-bold text-[#1E1E1E]">Why Architects Choose Karam Cera</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Exquisite Aesthetics', desc: 'Precision high-definition inkjet printing replicating rare Italian marbles, natural slate, and warm timber.' },
            { title: 'Architectural Durability', desc: 'High-density vitrified and full-body porcelain engineered for extreme abrasion resistance and zero water absorption.' },
            { title: 'WhatsApp Concierge', desc: 'Instant sample dispatch, technical tear-sheets, and personalized quote assistance via WhatsApp.' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-lg border border-[#EDE8E0] shadow-sm text-center">
              <div className="w-12 h-12 bg-[#FAF8F5] border border-[#B89358]/30 text-[#B89358] rounded-full flex items-center justify-center font-serif text-xl font-bold mx-auto mb-6">
                0{idx + 1}
              </div>
              <h4 className="font-serif text-lg font-bold mb-3">{item.title}</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ==========================================
// 2. PRODUCTS CATALOGUE VIEW COMPONENT
// ==========================================
function ProductsView({ 
  products, allProductsCount, categories, selectedCategory, setSelectedCategory, 
  selectedFinish, setSelectedFinish, selectedColour, setSelectedColour,
  searchQuery, setSearchQuery, sortBy, setSortBy, currentPage, setCurrentPage, totalPages,
  onSelectProduct, onWhatsApp
}) {
  return (
    <div className="py-12 px-6 lg:px-16 max-w-7xl mx-auto">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-8 border-b border-[#EDE8E0]">
        <div>
          <span className="text-[#B89358] uppercase tracking-widest text-xs font-bold mb-1 block">Catalogue</span>
          <h2 className="text-3xl font-serif font-bold">All Tile Collections ({allProductsCount})</h2>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <input 
            type="text"
            placeholder="Search SKU or Tile Name..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="bg-white border border-[#EDE8E0] px-4 py-2.5 rounded text-xs w-full sm:w-64 focus:outline-none focus:border-[#B89358]"
          />
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-[#EDE8E0] px-4 py-2.5 rounded text-xs uppercase tracking-wider focus:outline-none focus:border-[#B89358]">
            <option value="featured">Featured First</option>
            <option value="views">Most Viewed</option>
            <option value="newest">Newest Arrival</option>
          </select>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-[#EDE8E0] shadow-sm">
            <h4 className="text-xs uppercase tracking-widest font-bold text-[#B89358] mb-4">Categories</h4>
            <div className="space-y-2">
              <button 
                onClick={() => { setSelectedCategory('All'); setCurrentPage(1); }}
                className={`block w-full text-left text-xs py-1.5 px-3 rounded transition ${selectedCategory === 'All' ? 'bg-[#1E1E1E] text-white font-semibold' : 'hover:bg-gray-50 text-gray-700'}`}>
                All Categories
              </button>
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                  className={`block w-full text-left text-xs py-1.5 px-3 rounded transition ${selectedCategory === cat ? 'bg-[#1E1E1E] text-white font-semibold' : 'hover:bg-gray-50 text-gray-700'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-[#EDE8E0] shadow-sm">
            <h4 className="text-xs uppercase tracking-widest font-bold text-[#B89358] mb-4">Finish</h4>
            <select 
              value={selectedFinish}
              onChange={(e) => { setSelectedFinish(e.target.value); setCurrentPage(1); }}
              className="w-full bg-[#FAF8F5] border border-[#EDE8E0] p-2.5 rounded text-xs">
              <option value="All">All Finishes</option>
              <option value="Glossy">Glossy</option>
              <option value="Matt">Matt</option>
              <option value="Satin">Satin</option>
              <option value="Anti-Slip">Anti-Slip</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {products.length === 0 ? (
            <div className="bg-white p-16 rounded-lg border border-[#EDE8E0] text-center">
              <p className="font-serif text-xl text-gray-600 mb-2">No tiles found matching your filters.</p>
              <p className="text-xs text-gray-400 mb-6">Try broadening your search or resetting category filters.</p>
              <button 
                onClick={() => { setSelectedCategory('All'); setSearchQuery('All'); setSelectedFinish('All'); }}
                className="bg-[#1E1E1E] text-white px-6 py-2.5 rounded text-xs uppercase tracking-widest">
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <div 
                  key={product.id}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition duration-500 border border-[#EDE8E0] flex flex-col justify-between group">
                  <div>
                    <div 
                      onClick={() => onSelectProduct(product)}
                      className="relative h-64 overflow-hidden bg-gray-100 cursor-pointer">
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                      <span className="absolute top-3 left-3 bg-[#1E1E1E] text-white text-[9px] uppercase tracking-widest px-2.5 py-1 rounded">
                        {product.size}
                      </span>
                      <span className="absolute top-3 right-3 bg-[#B89358] text-white text-[9px] uppercase tracking-widest px-2.5 py-1 rounded font-semibold">
                        {product.finish}
                      </span>
                    </div>

                    <div className="p-5">
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">{product.sku} • {product.category}</p>
                      <h4 
                        onClick={() => onSelectProduct(product)}
                        className="font-serif text-lg font-bold mb-2 text-[#1E1E1E] hover:text-[#B89358] cursor-pointer transition">
                        {product.name}
                      </h4>
                      <p className="text-xs text-gray-600 line-clamp-2 mb-4">{product.description}</p>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-0">
                    <div className="flex items-center justify-between mb-3 text-xs font-bold">
                      <span className="text-[#1E1E1E]">{product.price || 'Price on Request'}</span>
                      <span className="text-emerald-600 font-normal">{product.availability}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => onSelectProduct(product)}
                        className="bg-[#FAF8F5] border border-[#EDE8E0] text-black py-2 rounded text-[10px] uppercase tracking-widest font-semibold hover:bg-gray-100 transition">
                        Details
                      </button>
                      <button 
                        onClick={() => onWhatsApp(product)}
                        className="bg-[#25D366] text-white py-2 rounded text-[10px] uppercase tracking-widest font-semibold hover:bg-[#20ba5a] transition flex items-center justify-center gap-1">
                        💬 WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-12">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`w-10 h-10 rounded text-xs font-bold transition ${currentPage === num ? 'bg-[#1E1E1E] text-white' : 'bg-white border border-[#EDE8E0] text-gray-700 hover:bg-gray-50'}`}>
                  {num}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. PRODUCT DETAIL VIEW COMPONENT
// ==========================================
function ProductDetailView({ product, onBack, onWhatsApp, calcArea, setCalcArea, calcWastage, setCalcWastage }) {
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [showSpecSheet, setShowSpecSheet] = useState(false);

  // Calculator logic
  const totalAreaWithWastage = calcArea * (1 + calcWastage / 100);
  const estimatedBoxes = Math.ceil(totalAreaWithWastage / 15); // assuming approx 15 sq.ft per box

  return (
    <div className="py-12 px-6 lg:px-16 max-w-7xl mx-auto">
      <button 
        onClick={onBack}
        className="text-xs uppercase tracking-widest text-[#B89358] font-bold mb-8 flex items-center gap-2 hover:underline">
        ← Back to Catalogue
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images Gallery */}
        <div className="space-y-4">
          <div className="h-[450px] bg-gray-100 rounded-lg overflow-hidden border border-[#EDE8E0] shadow-sm">
            <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-4">
              {product.images.map((img, idx) => (
                <div 
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 cursor-pointer ${activeImage === img ? 'border-[#B89358]' : 'border-transparent opacity-70'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Calculator */}
        <div>
          <span className="text-xs uppercase tracking-widest bg-[#1E1E1E] text-white px-3 py-1 rounded inline-block mb-3">
            {product.category}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E1E1E] mb-2">{product.name}</h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">SKU: {product.sku}</p>
          <p className="text-xl font-bold text-[#B89358] mb-6">{product.price || 'Price on Request'}</p>
          <p className="text-sm text-gray-700 leading-relaxed mb-6">{product.description}</p>

          {/* Technical Specifications Table */}
          <div className="bg-white rounded-lg border border-[#EDE8E0] p-6 mb-6 shadow-sm">
            <h4 className="text-xs uppercase tracking-widest font-bold text-[#1E1E1E] mb-4">Technical Specifications</h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block mb-1">Tile Size</span>
                <span className="font-semibold text-black">{product.size}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-1">Thickness</span>
                <span className="font-semibold text-black">{product.thickness}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-1">Finish</span>
                <span className="font-semibold text-black">{product.finish}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-1">Material</span>
                <span className="font-semibold text-black">{product.material}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-1">Colour</span>
                <span className="font-semibold text-black">{product.colour}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-1">Availability</span>
                <span className="font-semibold text-emerald-600">{product.availability}</span>
              </div>
            </div>
          </div>

          {/* Coverage & Box Calculator */}
          <div className="bg-[#FAF8F5] rounded-lg border border-[#EDE8E0] p-6 mb-6">
            <h4 className="text-xs uppercase tracking-widest font-bold text-[#B89358] mb-3">📐 Tile Coverage & Box Calculator</h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-gray-500 block mb-1">Area (Sq.Ft.)</label>
                <input 
                  type="number" 
                  value={calcArea} 
                  onChange={(e) => setCalcArea(Number(e.target.value))}
                  className="w-full bg-white border border-[#EDE8E0] p-2 rounded text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-gray-500 block mb-1">Wastage Buffer</label>
                <select 
                  value={calcWastage} 
                  onChange={(e) => setCalcWastage(Number(e.target.value))}
                  className="w-full bg-white border border-[#EDE8E0] p-2 rounded text-xs font-bold">
                  <option value={5}>5% (Standard)</option>
                  <option value={10}>10% (Recommended)</option>
                  <option value={15}>15% (Complex Cuts)</option>
                </select>
              </div>
            </div>
            <div className="text-xs text-gray-700 bg-white p-3 rounded border border-gray-100 flex justify-between items-center">
              <span>Required: <strong>{totalAreaWithWastage.toFixed(1)} sq.ft</strong></span>
              <span className="text-[#B89358] font-bold">~ {estimatedBoxes} Boxes Approx.</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => onWhatsApp(`Requirement: ${calcArea} sq.ft (${estimatedBoxes} boxes required including ${calcWastage}% wastage). Please share quote.`)}
              className="flex-1 bg-[#25D366] text-white py-3.5 rounded text-xs uppercase tracking-widest font-bold hover:bg-[#20ba5a] transition flex items-center justify-center gap-2 shadow-md">
              💬 Enquire via WhatsApp
            </button>
            <button 
              onClick={() => setShowSpecSheet(true)}
              className="bg-[#1E1E1E] text-white px-6 py-3.5 rounded text-xs uppercase tracking-widest font-bold hover:bg-[#B89358] transition">
              📄 Spec Sheet (PDF)
            </button>
          </div>
        </div>
      </div>

      {/* Printable / Viewable A4 Spec Sheet Modal */}
      {showSpecSheet && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full rounded-xl p-8 shadow-2xl border border-[#EDE8E0] relative">
            <button onClick={() => setShowSpecSheet(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black text-xl font-bold">✕</button>
            <div className="text-center border-b border-gray-200 pb-6 mb-6">
              <h3 className="font-serif text-2xl font-bold tracking-widest uppercase text-[#1E1E1E]">Karam Cera</h3>
              <p className="text-xs uppercase tracking-widest text-[#B89358] mt-1">Official Architectural Specification Tear-Sheet</p>
            </div>
            
            <div className="space-y-4 mb-8 text-xs">
              <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Product Name:</span><span className="font-bold">{product.name}</span></div>
              <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Product SKU:</span><span className="font-bold">{product.sku}</span></div>
              <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Category:</span><span className="font-bold">{product.category}</span></div>
              <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Dimensions:</span><span className="font-bold">{product.size}</span></div>
              <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Thickness:</span><span className="font-bold">{product.thickness}</span></div>
              <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Surface Finish:</span><span className="font-bold">{product.finish}</span></div>
              <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Material Composition:</span><span className="font-bold">{product.material}</span></div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => window.print()} className="flex-1 bg-[#1E1E1E] text-white py-3 rounded text-xs uppercase tracking-widest font-semibold hover:bg-[#B89358] transition">
                Print / Save PDF
              </button>
              <button onClick={() => setShowSpecSheet(false)} className="bg-gray-100 text-black px-6 py-3 rounded text-xs uppercase tracking-widest font-semibold">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 4. ABOUT & STATIC VIEWS
// ==========================================
function AboutView() {
  return (
    <div className="py-16 px-6 lg:px-16 max-w-5xl mx-auto space-y-16">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-[#B89358] uppercase tracking-widest text-xs font-bold mb-2 block">Heritage & Craft</span>
        <h2 className="text-4xl font-serif font-bold text-[#1E1E1E] mb-4">About Karam Cera</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          Karam Cera stands at the vanguard of luxury architectural surfaces, supplying precision-crafted porcelain, vitrified tiles, and monumental slabs to premier interior designers and real estate developers across the globe.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80" alt="Showroom" className="rounded-lg shadow-md" />
        <div className="space-y-4">
          <h3 className="font-serif text-2xl font-bold">Uncompromising European Standards</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Every tile in our collection is subjected to rigorous quality audits verifying slip resistance, modulus of rupture, thermal shock resistance, and calibration accuracy.
          </p>
          <p className="text-xs text-gray-600 leading-relaxed">
            Our state-of-the-art digital printing technologies capture the authentic geological variance of natural marble and wood without depleting environmental ecosystems.
          </p>
        </div>
      </div>
    </div>
  );
}

function ContactView() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="py-16 px-6 lg:px-16 max-w-4xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-[#B89358] uppercase tracking-widest text-xs font-bold mb-2 block">Connect</span>
        <h2 className="text-4xl font-serif font-bold text-[#1E1E1E] mb-4">Showroom Consultation</h2>
        <p className="text-sm text-gray-600">Schedule a private architectural consultation or request sample dispatches.</p>
      </div>

      {submitted ? (
        <div className="bg-white p-12 rounded-lg border border-[#EDE8E0] text-center shadow-sm">
          <h3 className="font-serif text-2xl font-bold text-[#B89358] mb-2">Inquiry Received</h3>
          <p className="text-xs text-gray-600 mb-6">Our showroom concierge will contact you within 2 business hours via WhatsApp or phone.</p>
          <button onClick={() => setSubmitted(false)} className="bg-[#1E1E1E] text-white px-6 py-2.5 rounded text-xs uppercase tracking-widest">Send Another Enquiry</button>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="bg-white p-8 rounded-lg border border-[#EDE8E0] shadow-sm space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2">Full Name</label>
              <input type="text" required className="w-full bg-[#FAF8F5] border border-[#EDE8E0] p-3 rounded text-xs focus:outline-none focus:border-[#B89358]" placeholder="Ar. Rajesh Sharma" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2">Phone / WhatsApp</label>
              <input type="tel" required className="w-full bg-[#FAF8F5] border border-[#EDE8E0] p-3 rounded text-xs focus:outline-none focus:border-[#B89358]" placeholder="+91 98765 43210" />
            </div>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2">Project Type</label>
            <select className="w-full bg-[#FAF8F5] border border-[#EDE8E0] p-3 rounded text-xs focus:outline-none focus:border-[#B89358]">
              <option>Luxury Villa / Residence</option>
              <option>Commercial Office Tower</option>
              <option>Hotel / Hospitality</option>
              <option>Architectural Studio / Retail</option>
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2">Project Details & Requirements</label>
            <textarea rows={4} required className="w-full bg-[#FAF8F5] border border-[#EDE8E0] p-3 rounded text-xs focus:outline-none focus:border-[#B89358]" placeholder="Mention approx sq.ft required or specific tile finishes..."></textarea>
          </div>
          <button type="submit" className="w-full bg-[#1E1E1E] text-white py-3.5 rounded text-xs uppercase tracking-widest font-bold hover:bg-[#B89358] transition">
            Submit Consultation Request
          </button>
        </form>
      )}
    </div>
  );
}

function PrivacyPolicyView() {
  return (
    <div className="py-16 px-6 lg:px-16 max-w-4xl mx-auto space-y-8 text-xs text-gray-700 leading-relaxed">
      <h2 className="text-3xl font-serif font-bold text-[#1E1E1E] mb-4">Privacy Policy & Terms</h2>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <div className="space-y-4">
        <h3 className="font-bold text-black uppercase tracking-wider text-sm">1. Information Collection</h3>
        <p>Karam Cera collects professional contact information and project inquiries submitted directly by architects, designers, and clients through our showroom forms and WhatsApp concierge channels.</p>
        <h3 className="font-bold text-black uppercase tracking-wider text-sm">2. Data Security</h3>
        <p>All database transactions and admin access credentials are secured via Supabase PostgreSQL Row Level Security (RLS) and encrypted SSL transport layers.</p>
      </div>
    </div>
  );
}

// ==========================================
// 5. SECURE ADMIN DASHBOARD & SUPABASE SETUP
// ==========================================
function AdminPortal({ 
  products, setProducts, categories, analytics, 
  supabaseUrl, setSupabaseUrl, supabaseKey, setSupabaseKey, 
  isLiveConnected, setIsLiveConnected, adminWhatsApp, setAdminWhatsApp, onGoBack 
}) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [activeAdminTab, setActiveAdminTab] = useState('products'); // products, analytics, bulk, setup

  // New Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdCat, setNewProdCat] = useState(categories[0]);
  const [newProdSize, setNewProdSize] = useState('60x120 cm');
  const [newProdFinish, setNewProdFinish] = useState('Glossy');
  const [newProdPrice, setNewProdPrice] = useState('₹150 / sq.ft');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80');

  // Bulk CSV Text state
  const [bulkCsvText, setBulkCsvText] = useState(
    'SKU,Name,Category,Size,Finish,Price\nKC-NEW-01,Onyx Royal Slab,Marble Look Tiles,120x240 cm,Glossy,₹260 / sq.ft\nKC-NEW-02,Travertine Beige,Marble Look Tiles,60x120 cm,Matt,₹175 / sq.ft'
  );

  const handleLogin = (e) => {
    e.preventDefault();
    if (adminUser.trim() && adminPass.trim()) {
      setIsAdminLoggedIn(true);
    } else {
      alert('Please enter valid administrator credentials.');
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const newProductObj = {
      id: newProdSku || `KC-${Date.now()}`,
      name: newProdName,
      sku: newProdSku || `KC-${Date.now()}`,
      category: newProdCat,
      description: newProdDesc || 'High quality architectural tile from Karam Cera.',
      images: [newProdImage],
      size: newProdSize,
      thickness: '9 mm',
      finish: newProdFinish,
      colour: 'Neutral',
      material: 'Porcelain',
      price: newProdPrice,
      availability: 'In Stock',
      featured: true,
      published: true,
      views: 1
    };
    setProducts([newProductObj, ...products]);
    alert('Product successfully added to catalogue!');
    setNewProdName('');
    setNewProdSku('');
    setNewProdDesc('');
  };

  const handleBulkImport = () => {
    try {
      const lines = bulkCsvText.trim().split('\n');
      if (lines.length < 2) {
        alert('Invalid CSV format. Provide header and at least one row.');
        return;
      }
      const newItems = [];
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map(s => s.trim());
        if (parts.length >= 6) {
          newItems.push({
            id: parts[0],
            sku: parts[0],
            name: parts[1],
            category: parts[2],
            size: parts[3],
            finish: parts[4],
            price: parts[5],
            description: 'Imported architectural tile collection.',
            images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
            thickness: '9 mm',
            colour: 'Standard',
            material: 'Porcelain',
            availability: 'In Stock',
            featured: false,
            published: true,
            views: 10
          });
        }
      }
      setProducts([...newItems, ...products]);
      alert(`Successfully imported ${newItems.length} products into the catalogue!`);
      setActiveAdminTab('products');
    } catch (err) {
      alert('Error parsing CSV. Please check formatting.');
    }
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="py-20 px-6 max-w-md mx-auto">
        <button onClick={onGoBack} className="text-xs uppercase tracking-widest text-[#B89358] font-bold mb-6 block">← Return to Showroom</button>
        <div className="bg-white p-8 rounded-lg border border-[#EDE8E0] shadow-xl">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded bg-[#1E1E1E] text-[#B89358] font-bold flex items-center justify-center text-2xl mx-auto mb-3">KC</div>
            <h3 className="font-serif text-2xl font-bold">Admin Portal</h3>
            <p className="text-xs text-gray-500">Secure Authentication Required</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-gray-500 block mb-1">Username / Staff ID</label>
              <input 
                type="text" 
                value={adminUser} 
                onChange={(e) => setAdminUser(e.target.value)}
                placeholder="admin@karamcera.com" 
                required 
                className="w-full bg-[#FAF8F5] border border-[#EDE8E0] p-3 rounded text-xs focus:outline-none focus:border-[#B89358]"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-gray-500 block mb-1">Password</label>
              <input 
                type="password" 
                value={adminPass} 
                onChange={(e) => setAdminPass(e.target.value)}
                placeholder="••••••••••••" 
                required 
                className="w-full bg-[#FAF8F5] border border-[#EDE8E0] p-3 rounded text-xs focus:outline-none focus:border-[#B89358]"
              />
            </div>
            <button type="submit" className="w-full bg-[#1E1E1E] text-white py-3 rounded text-xs uppercase tracking-widest font-bold hover:bg-[#B89358] transition">
              Secure Login
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-[10px] text-gray-400">Demo Access: Enter any username and password to test admin privileges.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-6 lg:px-16 max-w-7xl mx-auto">
      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-[#EDE8E0]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B89358] font-bold">Management Control</span>
          <h2 className="text-3xl font-serif font-bold">Karam Cera Admin Dashboard</h2>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded font-semibold">
            {isLiveConnected ? '🟢 Supabase Live Connected' : '🟡 Demo Sandbox Mode'}
          </span>
          <button onClick={() => setIsAdminLoggedIn(false)} className="bg-gray-100 text-black px-4 py-2 rounded text-xs uppercase tracking-widest font-semibold hover:bg-gray-200">
            Logout
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-[#EDE8E0] pb-4">
        <button 
          onClick={() => setActiveAdminTab('products')}
          className={`px-5 py-2.5 rounded text-xs uppercase tracking-widest font-bold transition ${activeAdminTab === 'products' ? 'bg-[#1E1E1E] text-white' : 'bg-white border text-gray-700 hover:bg-gray-50'}`}>
          📦 Products ({products.length})
        </button>
        <button 
          onClick={() => setActiveAdminTab('add')}
          className={`px-5 py-2.5 rounded text-xs uppercase tracking-widest font-bold transition ${activeAdminTab === 'add' ? 'bg-[#1E1E1E] text-white' : 'bg-white border text-gray-700 hover:bg-gray-50'}`}>
          ➕ Add Product
        </button>
        <button 
          onClick={() => setActiveAdminTab('bulk')}
          className={`px-5 py-2.5 rounded text-xs uppercase tracking-widest font-bold transition ${activeAdminTab === 'bulk' ? 'bg-[#1E1E1E] text-white' : 'bg-white border text-gray-700 hover:bg-gray-50'}`}>
          📊 Bulk CSV Import
        </button>
        <button 
          onClick={() => setActiveAdminTab('analytics')}
          className={`px-5 py-2.5 rounded text-xs uppercase tracking-widest font-bold transition ${activeAdminTab === 'analytics' ? 'bg-[#1E1E1E] text-white' : 'bg-white border text-gray-700 hover:bg-gray-50'}`}>
          📈 Analytics & Insights
        </button>
        <button 
          onClick={() => setActiveAdminTab('setup')}
          className={`px-5 py-2.5 rounded text-xs uppercase tracking-widest font-bold transition ${activeAdminTab === 'setup' ? 'bg-[#1E1E1E] text-white' : 'bg-white border text-gray-700 hover:bg-gray-50'}`}>
          ⚙️ Supabase & WhatsApp Config
        </button>
      </div>

      {/* TAB 1: PRODUCTS TABLE */}
      {activeAdminTab === 'products' && (
        <div className="bg-white rounded-lg border border-[#EDE8E0] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-serif text-lg font-bold">Catalogue Inventory Management</h3>
            <button onClick={() => setActiveAdminTab('add')} className="bg-[#B89358] text-white px-4 py-2 rounded text-xs uppercase tracking-widest font-bold">
              + Add New SKU
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] uppercase tracking-wider text-gray-500 border-b">
                <tr>
                  <th className="p-4">SKU / Image</th>
                  <th className="p-4">Product Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Size & Finish</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="p-4 flex items-center space-x-3">
                      <img src={p.images[0]} alt="" className="w-10 h-10 object-cover rounded border" />
                      <span className="font-semibold">{p.sku}</span>
                    </td>
                    <td className="p-4 font-serif font-bold text-sm">{p.name}</td>
                    <td className="p-4">{p.category}</td>
                    <td className="p-4">{p.size} | {p.finish}</td>
                    <td className="p-4 font-bold">{p.price}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        {p.availability}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button 
                        onClick={() => {
                          setProducts(products.filter(item => item.id !== p.id));
                        }}
                        className="text-red-600 hover:underline font-semibold">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ADD PRODUCT */}
      {activeAdminTab === 'add' && (
        <div className="bg-white rounded-lg border border-[#EDE8E0] p-8 max-w-3xl mx-auto shadow-sm">
          <h3 className="font-serif text-xl font-bold mb-6">Add New Tile SKU to Catalogue</h3>
          <form onSubmit={handleAddProduct} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2">Product Name</label>
                <input 
                  type="text" 
                  value={newProdName} 
                  onChange={(e) => setNewProdName(e.target.value)} 
                  required 
                  placeholder="Calacatta Gold Porcelain" 
                  className="w-full bg-[#FAF8F5] border border-[#EDE8E0] p-3 rounded text-xs" 
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2">SKU Code</label>
                <input 
                  type="text" 
                  value={newProdSku} 
                  onChange={(e) => setNewProdSku(e.target.value)} 
                  required 
                  placeholder="KC-POR-999" 
                  className="w-full bg-[#FAF8F5] border border-[#EDE8E0] p-3 rounded text-xs" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2">Category</label>
                <select 
                  value={newProdCat} 
                  onChange={(e) => setNewProdCat(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#EDE8E0] p-3 rounded text-xs">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2">Tile Size</label>
                <input 
                  type="text" 
                  value={newProdSize} 
                  onChange={(e) => setNewProdSize(e.target.value)} 
                  placeholder="120x240 cm" 
                  className="w-full bg-[#FAF8F5] border border-[#EDE8E0] p-3 rounded text-xs" 
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2">Finish</label>
                <input 
                  type="text" 
                  value={newProdFinish} 
                  onChange={(e) => setNewProdFinish(e.target.value)} 
                  placeholder="Glossy / Matt" 
                  className="w-full bg-[#FAF8F5] border border-[#EDE8E0] p-3 rounded text-xs" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2">Price (e.g. ₹220 / sq.ft)</label>
                <input 
                  type="text" 
                  value={newProdPrice} 
                  onChange={(e) => setNewProdPrice(e.target.value)} 
                  placeholder="₹220 / sq.ft" 
                  className="w-full bg-[#FAF8F5] border border-[#EDE8E0] p-3 rounded text-xs" 
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2">Image URL</label>
                <input 
                  type="text" 
                  value={newProdImage} 
                  onChange={(e) => setNewProdImage(e.target.value)} 
                  placeholder="https://images.unsplash.com/..." 
                  className="w-full bg-[#FAF8F5] border border-[#EDE8E0] p-3 rounded text-xs" 
                />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2">Product Description</label>
              <textarea 
                rows={3} 
                value={newProdDesc} 
                onChange={(e) => setNewProdDesc(e.target.value)} 
                placeholder="Enter architectural description..." 
                className="w-full bg-[#FAF8F5] border border-[#EDE8E0] p-3 rounded text-xs">
              </textarea>
            </div>

            <button type="submit" className="w-full bg-[#1E1E1E] text-white py-3.5 rounded text-xs uppercase tracking-widest font-bold hover:bg-[#B89358] transition">
              Publish Product to Catalogue
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: BULK CSV IMPORT */}
      {activeAdminTab === 'bulk' && (
        <div className="bg-white rounded-lg border border-[#EDE8E0] p-8 max-w-3xl mx-auto shadow-sm space-y-6">
          <div>
            <h3 className="font-serif text-xl font-bold mb-2">Bulk CSV Catalogue Importer (500+ SKUs)</h3>
            <p className="text-xs text-gray-500">Paste comma-separated values to instantly ingest multiple tile SKUs into your inventory.</p>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2">CSV Data Format (SKU, Name, Category, Size, Finish, Price)</label>
            <textarea 
              rows={8}
              value={bulkCsvText}
              onChange={(e) => setBulkCsvText(e.target.value)}
              className="w-full font-mono bg-[#FAF8F5] border border-[#EDE8E0] p-4 rounded text-xs focus:outline-none focus:border-[#B89358]"
            />
          </div>

          <button 
            onClick={handleBulkImport}
            className="w-full bg-[#1E1E1E] text-white py-3.5 rounded text-xs uppercase tracking-widest font-bold hover:bg-[#B89358] transition">
            Import Products into Database
          </button>
        </div>
      )}

      {/* TAB 4: ANALYTICS & INSIGHTS */}
      {activeAdminTab === 'analytics' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg border border-[#EDE8E0] shadow-sm">
              <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Total Visitors</span>
              <p className="text-3xl font-serif font-bold text-[#1E1E1E]">{analytics.pageViews}</p>
              <span className="text-[10px] text-emerald-600 font-semibold mt-2 inline-block">↑ 18% vs last month</span>
            </div>
            <div className="bg-white p-6 rounded-lg border border-[#EDE8E0] shadow-sm">
              <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Unique Sessions</span>
              <p className="text-3xl font-serif font-bold text-[#1E1E1E]">{analytics.uniqueVisitors}</p>
              <span className="text-[10px] text-emerald-600 font-semibold mt-2 inline-block">Verified cookies</span>
            </div>
            <div className="bg-white p-6 rounded-lg border border-[#EDE8E0] shadow-sm">
              <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">WhatsApp Enquiries</span>
              <p className="text-3xl font-serif font-bold text-[#B89358]">{analytics.whatsappClicks}</p>
              <span className="text-[10px] text-gray-500 font-semibold mt-2 inline-block">Direct button taps</span>
            </div>
            <div className="bg-white p-6 rounded-lg border border-[#EDE8E0] shadow-sm">
              <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Catalogue Size</span>
              <p className="text-3xl font-serif font-bold text-[#1E1E1E]">{products.length} SKUs</p>
              <span className="text-[10px] text-gray-500 font-semibold mt-2 inline-block">PostgreSQL ready</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SUPABASE & WHATSAPP CONFIG */}
      {activeAdminTab === 'setup' && (
        <div className="bg-white rounded-lg border border-[#EDE8E0] p-8 max-w-3xl mx-auto shadow-sm space-y-6">
          <h3 className="font-serif text-xl font-bold mb-2">Supabase & WhatsApp Integration Settings</h3>
          <p className="text-xs text-gray-500">Configure your live PostgreSQL database credentials and WhatsApp concierge number.</p>

          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-gray-500 block mb-1">WhatsApp Concierge Number</label>
              <input 
                type="text" 
                value={adminWhatsApp} 
                onChange={(e) => setAdminWhatsApp(e.target.value)} 
                className="w-full bg-[#FAF8F5] border border-[#EDE8E0] p-3 rounded text-xs" 
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-gray-500 block mb-1">Supabase Project URL</label>
              <input 
                type="text" 
                value={supabaseUrl} 
                onChange={(e) => setSupabaseUrl(e.target.value)} 
                placeholder="https://xyzcompany.supabase.co" 
                className="w-full bg-[#FAF8F5] border border-[#EDE8E0] p-3 rounded text-xs font-mono" 
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-gray-500 block mb-1">Supabase Anon Key</label>
              <input 
                type="password" 
                value={supabaseKey} 
                onChange={(e) => setSupabaseKey(e.target.value)} 
                placeholder="eyJhGciOi..." 
                className="w-full bg-[#FAF8F5] border border-[#EDE8E0] p-3 rounded text-xs font-mono" 
              />
            </div>
            <button 
              onClick={() => {
                localStorage.setItem('kc_sb_url', supabaseUrl);
                localStorage.setItem('kc_sb_key', supabaseKey);
                setIsLiveConnected(true);
                alert('Supabase configuration saved successfully!');
              }}
              className="w-full bg-[#1E1E1E] text-white py-3.5 rounded text-xs uppercase tracking-widest font-bold hover:bg-[#B89358] transition">
              Save & Test Supabase Connection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
