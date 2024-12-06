import React from "react";
import { useDispatch } from "react-redux";
import { decrementQuantity, incrementQuantity } from "@/app/redux/slices/cartSlice";

interface CartModalProps {
    isOpen: boolean;
    onClose: () => void;
    cart: {
        items: Array<{ id: number; name: string; price: number; quantity: number }>;
        total: number;
    };
}


const CartModal = ({ isOpen, onClose, cart }: CartModalProps) => {
    const dispatch = useDispatch();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center h-full z-50">
            <div className="bg-white w-full h-full">
                <div className="border-b-[#DADADA] border-b border-solid px-6 flex justify-between items-center py-[23px]">
                    <div></div>
                    <p className="text-xl font-semibold">Basket</p>
                    <button
                        className="text-3xl text-[#4F372F]"
                        onClick={onClose}
                    >
                        &times;
                    </button>
                </div>
                <div className="px-6 py-[25px]">
                    {cart.items.length > 0 ? (
                        cart.items.map((item) => (
                            <div key={item.id} className="mb-4">
                                <div className="flex justify-between">
                                    <p>{item.name}</p>
                                    <p className="font-semibold">R${item.price.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center mt-2">
                                    <button
                                        className="w-[20px] h-[20px] bg-[#4F372F] text-white rounded-full flex justify-center items-center"
                                        onClick={() => dispatch(decrementQuantity(item.id))}
                                    >
                                        -
                                    </button>
                                    <span className="mx-4">{item.quantity}</span>
                                    <button
                                        className="w-[20px] h-[20px] bg-[#4F372F] text-white rounded-full flex justify-center items-center"
                                        onClick={() => dispatch(incrementQuantity(item.id))}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Seu carrinho está vazio.</p>
                    )}
                </div>
                <div className="mt-4 border-t pt-4 px-6 ">
                    <div className="flex justify-between">
                        <p>Total:</p>
                        <p>R${cart.total.toFixed(2)}</p>
                    </div>
                    <button className="w-full bg-[#4F372F] text-white py-2 rounded-full mt-4">
                        Checkout now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartModal;
