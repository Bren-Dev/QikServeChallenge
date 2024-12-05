import React, { useState } from "react";

interface ModifierItem {
    id: number;
    name: string;
    price: number;
}

interface Modifier {
    id: number;
    name: string;
    minChoices: number;
    maxChoices: number;
    items: ModifierItem[];
}

interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    modifiers?: Modifier[];
    images: { id: number; image: string }[];
}

interface ModalProps {
    item: MenuItem;
    onClose: () => void;
    onAddToCart: (item: any) => void;
}

const Modal: React.FC<ModalProps> = ({ item, onClose, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedOption, setSelectedOption] = useState<ModifierItem | null>(null);

    const handleIncrement = () => setQuantity((prev) => prev + 1);
    const handleDecrement = () => setQuantity((prev) => Math.max(1, prev - 1));

    const totalPrice = selectedOption
        ? (selectedOption.price * quantity).toFixed(2)
        : (item.price * quantity).toFixed(2);

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
            <div className="bg-white shadow-lg w-full max-w-[480px] rounded-lg overflow-hidden">
                <div className="relative">
                    {item.image && <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-auto"
                    />}
                    <button
                        className="absolute top-2 right-2 bg-gray-200 rounded-full p-1"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                <div className="p-4">
                    <h2 className="text-2xl font-bold">{item.name}</h2>
                    <p className="text-sm text-gray-600 mt-2">{item.description}</p>

                    {item.modifiers && item.modifiers.length > 0 && (
                        <div className="mt-4">
                            {item.modifiers.map((modifier) => (
                                <div key={modifier.id}>
                                    <h3 className="text-lg font-medium">{modifier.name}</h3>
                                    <div className="mt-2">
                                        {modifier.items.map((option) => (
                                            <label
                                                key={option.id}
                                                className="flex items-center space-x-2 mb-2"
                                            >
                                                <input
                                                    type="radio"
                                                    name={`modifier-${modifier.id}`}
                                                    value={option.id}
                                                    checked={selectedOption?.id === option.id}
                                                    onChange={() => setSelectedOption(option)}
                                                />
                                                <span>
                                                    {option.name} - R${option.price.toFixed(2)}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center justify-center w-full mt-4">
                        <div className="flex items-center space-x-2">
                            <button
                                className="px-3 py-1 bg-gray-200 rounded"
                                onClick={handleDecrement}
                            >
                                -
                            </button>
                            <span>{quantity}</span>
                            <button
                                className="px-3 py-1 bg-gray-200 rounded"
                                onClick={handleIncrement}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={() => onAddToCart(item)}
                        className="w-full bg-[#4F372F] mt-4 py-2 bg-brown-600 text-white rounded-full"
                        disabled={!selectedOption && item.modifiers && item.modifiers.length > 0}
                    >
                        Add to Order - R${totalPrice}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
