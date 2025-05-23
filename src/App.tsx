import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import RecipePage from './pages/Recipes'
import RecipeDetail from './pages/RecipeDetail'
import AddRecipe from './pages/AddRecipe'
import Login from './pages/Login'

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-dark flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, signOut } = useAuth();

  return (
    <Router>
      <a href="#main-content" className="skip-to-main-content">
        Skip to main content
      </a>
      
      {/* Mobile Header */}
      <header className="fixed w-full bg-primary-dark shadow-sm z-50">
        <div className="px-4 h-16 flex items-center justify-between md:hidden">
          <button 
            className="text-white/90 p-2 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <span className="sr-only">Menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex items-center">
            <Link to="/" className="text-xl font-semibold text-white">Pick Up Plants</Link>
          </div>

          {user ? (
            <button
              onClick={signOut}
              className="p-2 text-white/90 hover:text-white"
              aria-label="Sign out"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          ) : (
            <Link to="/login" className="p-2 text-white/90 hover:text-white">
              Sign In
            </Link>
          )}
        </div>

        {/* Desktop Header */}
        <nav className="hidden md:block">
          <div className="max-w-7xl mx-auto px-4 h-20">
            <div className="h-full flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <Link to="/" className="text-2xl font-semibold text-white">Pick Up Plants</Link>
                <div className="hidden md:flex space-x-6">
                  <Link to="/recipes" className="text-white/80 hover:text-white transition-colors">Recipes</Link>
                  <Link to="/nutrition" className="text-white/80 hover:text-white transition-colors">Nutrition</Link>
                  <Link to="/lifestyle" className="text-white/80 hover:text-white transition-colors">Lifestyle</Link>
                  <Link to="/about" className="text-white/80 hover:text-white transition-colors">About</Link>
                </div>
              </div>
              {user ? (
                <button
                  onClick={signOut}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Sign Out
                </button>
              ) : (
                <Link to="/login" className="text-white/80 hover:text-white transition-colors">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-primary-dark border-t border-white/10`}>
          <div className="px-4 py-2">
            <div className="flex flex-col space-y-3">
              <Link to="/recipes" className="text-white/80 hover:text-white py-2">Recipes</Link>
              <Link to="/nutrition" className="text-white/80 hover:text-white py-2">Nutrition</Link>
              <Link to="/lifestyle" className="text-white/80 hover:text-white py-2">Lifestyle</Link>
              <Link to="/about" className="text-white/80 hover:text-white py-2">About</Link>
            </div>
          </div>
        </div>
      </header>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/recipes" element={
          <ProtectedRoute>
            <RecipePage />
          </ProtectedRoute>
        } />
        <Route path="/recipe/:id" element={
          <ProtectedRoute>
            <RecipeDetail />
          </ProtectedRoute>
        } />
        <Route path="/recipe/new" element={
          <ProtectedRoute>
            <AddRecipe />
          </ProtectedRoute>
        } />
        <Route path="/" element={
          <ProtectedRoute>
            <main id="main-content" className="pt-16 md:pt-20 bg-primary-dark">
              {/* Hero Section with Search */}
              <section className="relative bg-gradient-to-b from-primary to-primary-dark px-4 py-12 md:py-24">
                <div className="max-w-7xl mx-auto text-center">
                  <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white text-shadow">
                    Find Your Perfect Plant-Based Recipe
                  </h2>
                  <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                    Discover delicious, nutritious recipes that make plant-based living easy and enjoyable
                  </p>
                  
                  {/* Search Bar */}
                  <div className="max-w-2xl mx-auto relative">
                    <input
                      type="search"
                      placeholder="Search recipes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-6 py-4 text-lg rounded-full border-2 border-white/30 
                        bg-white/20 text-white placeholder-white/70
                        focus:border-white focus:ring-2 focus:ring-white/50 focus:bg-white/30
                        transition-all backdrop-blur-sm"
                      aria-label="Search recipes"
                    />
                    <button 
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                      aria-label="Submit search"
                    >
                      <svg className="h-6 w-6 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>

                  {/* Popular Categories */}
                  <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                    <a href="#breakfast" className="bg-white/20 backdrop-blur-sm p-6 rounded-lg hover:bg-white/30 transition-all border border-white/30 group">
                      <span className="block text-xl font-medium text-white group-hover:text-white/90">Breakfast</span>
                    </a>
                    <a href="#lunch" className="bg-white/20 backdrop-blur-sm p-6 rounded-lg hover:bg-white/30 transition-all border border-white/30 group">
                      <span className="block text-xl font-medium text-white group-hover:text-white/90">Lunch</span>
                    </a>
                    <a href="#dinner" className="bg-white/20 backdrop-blur-sm p-6 rounded-lg hover:bg-white/30 transition-all border border-white/30 group">
                      <span className="block text-xl font-medium text-white group-hover:text-white/90">Dinner</span>
                    </a>
                    <a href="#snacks" className="bg-white/20 backdrop-blur-sm p-6 rounded-lg hover:bg-white/30 transition-all border border-white/30 group">
                      <span className="block text-xl font-medium text-white group-hover:text-white/90">Snacks</span>
                    </a>
                  </div>
                </div>
              </section>

              {/* Featured Recipes */}
              <section className="py-12 md:py-20 px-4 bg-primary-dark">
                <div className="max-w-7xl mx-auto">
                  <h3 className="text-2xl md:text-3xl font-bold mb-8 text-white">Featured Recipes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((item) => (
                      <article key={item} className="group">
                        <div className="aspect-w-16 aspect-h-9 bg-primary rounded-lg overflow-hidden mb-4">
                          <div className="w-full h-full bg-primary-light/20"></div>
                        </div>
                        <h4 className="text-lg font-medium text-white group-hover:text-white/90 transition-colors">
                          Delicious Recipe {item}
                        </h4>
                        <p className="text-white/70 mt-2">Quick • Easy • Nutritious</p>
                      </article>
                    ))}
                  </div>
                </div>
              </section>
            </main>
          </ProtectedRoute>
        } />
      </Routes>

      <footer className="bg-primary-dark text-white py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h4 className="text-xl font-semibold mb-4">Pick Up Plants</h4>
              <p className="text-white/70 max-w-md">
                Empowering you to thrive on a plant-based diet with delicious recipes and practical tips.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#recipes" className="text-white/70 hover:text-white transition-colors">Recipes</a></li>
                <li><a href="#nutrition" className="text-white/70 hover:text-white transition-colors">Nutrition</a></li>
                <li><a href="#lifestyle" className="text-white/70 hover:text-white transition-colors">Lifestyle</a></li>
                <li><a href="#about" className="text-white/70 hover:text-white transition-colors">About</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <p className="text-white/70 mb-4">Stay updated with our latest recipes and tips!</p>
              <button className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-light transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </footer>
    </Router>
  )
}

function AppWithAuth() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export { AppWithAuth };
