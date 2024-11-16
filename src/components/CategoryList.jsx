// src/components/CategoryList.jsx
import { useEffect, useState } from 'react';
import { api, routes } from '../stores/axios.js';

const CategoryList = ({ onCategoryChange }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get(routes.categories);
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="category-filter">
            <label className="text-lg font-semibold">Фильтр по категории:</label>
            <select
                onChange={(e) => onCategoryChange(e.target.value-0 || null)}
                className="ml-2 p-2 border rounded-md"
            >
                <option value="">Все категории</option>
                {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CategoryList;
