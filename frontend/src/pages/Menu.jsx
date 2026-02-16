import React, { useEffect, useState } from 'react';
import { fetchMenu } from '../services/api';
import MenuCard from '../components/MenuCard';
import { Search } from 'lucide-react';

const Menu = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [categories, setCategories] = useState(['All']);

    useEffect(() => {
        loadMenu();
    }, []);

    const loadMenu = async () => {
        try {
            const data = await fetchMenu();
            setMenuItems(data);

            // Extract unique categories
            const uniqueCategories = ['All', ...new Set(data.map(item => item.category))];
            setCategories(uniqueCategories);
        } catch (error) {
            console.error("Failed to fetch menu", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredItems = menuItems.filter(item => {
        const matchesCategory = filter === 'All' || item.category === filter;
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Menu</h1>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                {/* Categories */}
                <div className="flex flex-wrap gap-2 justify-center">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${filter === cat
                                    ? 'bg-orange-600 text-white shadow-md'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search items..."
                        className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems.length > 0 ? (
                        filteredItems.map(item => (
                            <MenuCard key={item.id} item={item} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No items found matching your criteria.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Menu;
