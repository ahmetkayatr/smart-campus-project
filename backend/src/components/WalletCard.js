import React from 'react';

const WalletCard = ({ balance, isScholarship }) => {
    return (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-2xl text-white shadow-lg mb-6">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-blue-100 text-sm font-medium">Mevcut Bakiye</p>
                    <h2 className="text-3xl font-bold mt-1 tracking-tight">
                        {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(balance)}
                    </h2>
                </div>
                {isScholarship && (
                    <span className="bg-green-400 text-green-900 text-xs font-bold px-3 py-1 rounded-full uppercase">
                        Burslu Hesap
                    </span>
                )}
            </div>
            <button className="mt-4 w-full bg-white/20 hover:bg-white/30 transition-colors py-2 rounded-lg text-sm font-semibold border border-white/30">
                Bakiye Yükle
            </button>
        </div>
    );
};

export default WalletCard;