import { useState } from "react";
import { IoClose } from "react-icons/io5";

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
    image: string
}

interface ModalProps {
    item: MenuItem;
    onClose: () => void;
    onAddToCart: (item: any) => void;
}

const Modal = ({ item, onClose, onAddToCart }: ModalProps) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedOption, setSelectedOption] = useState<ModifierItem | null>(null);

    const handleIncrement = () => setQuantity((prev) => prev + 1);
    const handleDecrement = () => setQuantity((prev) => Math.max(1, prev - 1));

    const totalPrice = selectedOption
        ? (selectedOption.price * quantity).toFixed(2)
        : (item.price * quantity).toFixed(2);

    return (
        <div className="fixed bottom-0 w-full lg:inset-0 flex justify-center items-center  bg-[#000000A6] bg-opacity-50 z-50 overflow-auto">
            <div className="bg-white shadow-lg w-full max-w-[480px] lg:max-h-[90%] overflow-auto">
                <div className="relative ">
                    {item.image && <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-auto shadow-[0px_1px_0px_0px_#EEEEEE]"
                    />}
                    <button
                        className="absolute top-2 right-2 w-[28px] h-[28px] bg-gray-200 rounded-full flex items-center justify-center p-1"
                        onClick={onClose}
                    >
                        <IoClose width={12} height={12} color="#4F372F" />
                    </button>
                </div>

                <div className="p-4">
                    <p className="text-2xl font-bold leading-[28.13px] text-[#121212]">{item.name}</p>
                    <p className="pt-[8px] text-base font-normal leading-[18.75px] tracking-[0.5px] text-[#464646]">{item.description}</p>

                    {item.modifiers && item.modifiers.length > 0 && (
                        <div className="mt-4">
                            {item.modifiers.map((modifier) => (
                                <div key={modifier.id}>
                                    <div className="py-[16px] bg-[#F8F9FA]">
                                        <p className="text-[#464646] text-base font-bold leading-[18.75px] tracking-[0.5px]">Choose your size</p>
                                        <p className="text-base font-normal leading-[18.75px] tracking-[0.5px] text-[#5F5F5F]">Select 1 option</p>
                                    </div>
                                    <div className="mt-2">
                                        {modifier.items.map((option) => (
                                            <label
                                                key={option.id}
                                                className="flex justify-between items-center space-x-2 mb-2"
                                            >
                                                <div>
                                                    <p className="text-[#121212] text-base font-medium leading-[18.75px]">{option.name}</p> <p className="text-[#464646] text-base font-normal leading-[18.75px]">R${option.price.toFixed(2)}</p>
                                                </div>
                                                <input
                                                    type="radio"
                                                    name={`modifier-${modifier.id}`}
                                                    value={option.id}
                                                    checked={selectedOption?.id === option.id}
                                                    onChange={() => setSelectedOption(option)}
                                                    className="w-[20px] h-[20px]"
                                                />

                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center justify-center w-full mt-4">
                        <div className="flex items-center gap-[22px] backdrop-blur">
                            <button
                                className={`text-[20px] font-bold ${quantity === 1 ? 'bg-[#DADADA]' : 'bg-[#4F372F]'} rounded-full w-[32px] h-[32px] text-[#FFFFFF] flex items-center justify-center`}
                                onClick={handleDecrement}
                                disabled={quantity === 1}
                            >
                                -
                            </button>
                            <span className="text-[#121212] text-2xl font-semibold leading-[28.64px]">{quantity}</span>
                            <button
                                className="text-[28px] font-bold  bg-[#4F372F] rounded-full w-[32px] h-[32px] text-[#FFFFFF] flex items-center justify-center"
                                onClick={handleIncrement}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={() =>
                            onAddToCart({
                                id: item.id,
                                name: item.name,
                                price: selectedOption ? selectedOption.price : item.price,
                                quantity,
                                description: item.description,
                                image: item.images?.[0]?.image,
                                modifier: selectedOption,
                            })
                        }
                        className="w-full bg-[#4F372F] mt-2 py-2 bg-brown-600 text-white rounded-full"
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
