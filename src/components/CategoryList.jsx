import React, { useEffect } from 'react';
import useCategoriesStore from '../stores/CategoryStore';

const CategoryList = () => {
    const { categories, fetchCategories } = useCategoriesStore();

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Список категорий</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map(category => (
                    <li key={category.id} className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-xl transition-shadow">
                        <p className="text-lg font-medium text-gray-700">{category.name}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryList;
