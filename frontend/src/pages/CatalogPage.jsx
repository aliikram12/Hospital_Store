import React, { useState, useEffect } from 'react';
import {
  Filter,
  SlidersHorizontal,
  Grid3X3,
  List,
  RotateCcw,
  Search,
  Check,
  Building2,
  PackageX
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { getCategoryIcon, formatPrice } from '../utils/helpers';

export default function CatalogPage({
  categories = [],
  initialCategory = null,
  initialSearch = '',
  onNavigate
}) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || '');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [searchKeyword, setSearchKeyword] = useState(initialSearch || '');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Sync initialCategory or initialSearch if passed
  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
    if (initialSearch) setSearchKeyword(initialSearch);
  }, [initialCategory, initialSearch]);

  // Load brands once
  useEffect(() => {
    fetch('/api/products/brands')
      .then((r) => r.json())
      .then((data) => setBrands(data))
      .catch((e) => console.error(e));
  }, []);

  // Fetch products with active filters
  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory) params.append('category', selectedCategory);
    if (selectedBrand) params.append('brand', selectedBrand);
    if (searchKeyword) params.append('search', searchKeyword);
    if (minPrice) params.append('min_price', minPrice);
    if (maxPrice) params.append('max_price', maxPrice);
    if (inStockOnly) params.append('in_stock_only', 'true');
    if (sortBy) params.append('sort_by', sortBy);

    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setTotalCount(data.total || 0);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [selectedCategory, selectedBrand, searchKeyword, minPrice, maxPrice, inStockOnly, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    setSearchKeyword('');
    setSortBy('featured');
  };

  const activeCategoryObj = categories.find((c) => c.slug === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Category Banner if filtered */}
      {activeCategoryObj && (
        <div className="bg-gradient-to-r from-sky-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-sky-800/40">
          <div className="relative z-10 max-w-xl">
            <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">
              Hospital Department Catalog
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              {activeCategoryObj.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              {activeCategoryObj.description}
            </p>
          </div>
        </div>
      )}

      {/* Main Layout: Sidebar Filters + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Filters Sidebar */}
        <aside className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-6 lg:sticky lg:top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-sky-600" />
              <h3 className="text-sm font-bold text-slate-900">Filter Equipment</h3>
            </div>
            <button
              onClick={handleResetFilters}
              className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Department / Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Department
            </label>
            <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                  selectedCategory === ''
                    ? 'bg-sky-50 text-sky-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>All Departments</span>
                {selectedCategory === '' && <Check className="w-3.5 h-3.5 text-sky-600" />}
              </button>

              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.slug)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                    selectedCategory === c.slug
                      ? 'bg-sky-50 text-sky-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{c.name}</span>
                  <span className="text-[10px] text-slate-400">({c.product_count || 0})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Manufacturer / Brand Filter */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Manufacturer / Brand
            </label>
            <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedBrand('')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                  selectedBrand === ''
                    ? 'bg-sky-50 text-sky-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>All Brands</span>
                {selectedBrand === '' && <Check className="w-3.5 h-3.5 text-sky-600" />}
              </button>

              {brands.map((b) => (
                <button
                  key={b}
                  onClick={() => setSelectedBrand(b)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                    selectedBrand === b
                      ? 'bg-sky-50 text-sky-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{b}</span>
                  {selectedBrand === b && <Check className="w-3.5 h-3.5 text-sky-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Price Range (₹)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min ₹"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 outline-none focus:border-sky-500"
              />
              <input
                type="number"
                placeholder="Max ₹"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* In Stock Toggle */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">In Stock Devices Only</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-600"></div>
            </label>
          </div>
        </aside>

        {/* Products Column */}
        <main className="lg:col-span-3 space-y-4">
          {/* Top Control Bar */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p className="text-xs text-slate-500">
                Showing <span className="font-bold text-slate-900">{products.length}</span> of{' '}
                <span className="font-bold text-slate-900">{totalCount}</span> certified medical devices
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-semibold outline-none focus:border-sky-500"
                >
                  <option value="featured">Featured / Best Match</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Latest Models</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 ${viewMode === 'grid' ? 'bg-sky-600 text-white' : 'text-slate-500 hover:text-slate-900'}`}
                  title="Grid View"
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 ${viewMode === 'list' ? 'bg-sky-600 text-white' : 'text-slate-500 hover:text-slate-900'}`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Product Grid / List */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-white rounded-2xl border border-slate-200 p-4 animate-pulse space-y-4">
                  <div className="h-44 bg-slate-200 rounded-xl" />
                  <div className="h-4 bg-slate-200 rounded w-2/3" />
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
                  : 'space-y-4'
              }
            >
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={(p) => onNavigate('product-detail', { productId: p.id, slug: p.slug })}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <PackageX className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No medical devices match your criteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your price range, choosing another department, or clearing your brand filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-2 px-5 py-2.5 bg-sky-600 text-white font-bold text-xs rounded-xl shadow transition-all hover:bg-sky-700"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

