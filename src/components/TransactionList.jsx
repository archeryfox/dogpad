import React, { useEffect } from 'react';
import {useTransactionsStore} from '../stores/TransactionStore.js';

const TransactionList = () => {
    const { transactions, fetchTransactions } = useTransactionsStore();

    useEffect(() => {
        fetchTransactions();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Список транзакций</h2>
            <ul className="space-y-4">
                {transactions?.map(transaction => (
                    <li key={transaction.id} className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                        <div className="flex justify-between items-center">
                            <p className="text-lg font-semibold text-gray-800">ID: {transaction.id}</p>
                            <p className={`text-lg font-semibold ${transaction.status === 'completed' ? 'text-green-600' : 'text-red-600'}`}>
                                {transaction.status === 'completed' ? 'Завершена' : 'Не завершена'}
                            </p>
                        </div>
                        <p className="text-blue-600 text-xl font-semibold mt-2">Сумма: {transaction.amount} ₽</p>
                        <p className="text-gray-700 mt-1">Дата: {new Date(transaction.date).toLocaleDateString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TransactionList;
