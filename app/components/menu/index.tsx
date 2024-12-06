'use client';

import { fetchMenuItems } from "@/app/redux/slices/menuSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MenuSection } from "@/app/redux/slices/menuSlice";
import { GoSearch } from "react-icons/go";
import { IoIosArrowDown } from "react-icons/io";
import Modal from "../modal/modal";
import { addToCart, decrementQuantity, incrementQuantity } from "@/app/redux/slices/cartSlice";
import { RootState } from "@/app/redux/store";
import CartModal from "../modal/cartModal";
import { BannerImage } from "../bannerImage";

const Menu = () => {

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [activeSectionId, setActiveSectionId] = useState<number>(242403);
    const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());
    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [isCartModalOpen, setIsCartModalOpen] = useState<boolean>(false);
    const dispatch = useDispatch();
    const { sections, status: menuStatus, error: menuError } = useSelector((state: RootState) => state.menu);
    const cart = useSelector((state: RootState) => state.cart);

    const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
    };

    const toggleCartModal = () => {
        setIsCartModalOpen(!isCartModalOpen);
    };

    useEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filterItems = (items: any[]) => {
        if (!searchTerm) return items;
        return items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    };

    const toggleSectionVisibility = (sectionId: number) => {
        setVisibleSections((prev) => {
            const newSections = new Set(prev);
            if (newSections.has(sectionId)) {
                newSections.delete(sectionId);
            } else {
                newSections.add(sectionId);
            }
            return newSections;
        });
    };

    const openModal = (item: any) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };


    useEffect(() => {
        dispatch(fetchMenuItems());
    }, [dispatch]);

    useEffect(() => {
        const initialVisibleSections = new Set(sections.map((section: MenuSection) => section.id));
        setVisibleSections(initialVisibleSections);
    }, [sections]);

    const handleAddToCart = (item: any) => {
        dispatch(addToCart({ ...item, quantity: 1 }));
        closeModal();
    };


    if (menuError) {
        return <p className="text-red-500">Erro ao carregar o menu: {menuError}</p>;
    }

    if (menuStatus === "loading") {
        return <p>Carregando menu...</p>;
    }
    console.log(cart)
    return (
        <div className="bg-white lg:bg-[#EEEEEE]">

            <BannerImage />
            <div className="w-full flex flex-col justify-center border-t-[5px] border-t-[white] border-solid items-center">
                <div className="w-full flex justify-center px-4">
                    <div className="border border-solid border-[#8A94A4] bg-white px-[12px] py-[10px] flex gap-[10px] items-center max-w-[1024px] w-full rounded-lg lg:shadow-md my-[6px]">
                        <GoSearch color="#8A94A4" className="w-[20px] h-[20px]" />
                        <input
                            type="text"
                            placeholder="Search menu items"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full bg-transparent focus:outline-none  placeholder:text-[#8A94A4] lg:placeholder:text-[#2C2C2C]"
                        />
                    </div>
                </div>
                <div className="lg:bg-[#F8F9FA] w-full max-w-[1024px] py-[32px] lg:px-[40px] flex gap-[24px]">
                    <div className="lg:max-w-[600px] w-full bg-white lg:shadow-[0px_2px_14px_0px_#00000024] py-[20px] px-[16px]">
                        <div className="mb-[56px]">
                            <div className="flex gap-[24px]">
                                {sections.map((section: MenuSection) => (
                                    <div
                                        key={section.id}
                                        onClick={() => setActiveSectionId(section.id)}
                                        className={`flex flex-col items-center cursor-pointer ${activeSectionId === section.id ? 'text-[#4F372F]' : 'text-[#8A94A4]'}`}
                                    >
                                        <div
                                            className={`border-2 border-solid rounded-full p-[2px] ${activeSectionId === section.id ? 'border-[#4F372F]' : 'border-transparent'}`}
                                        >
                                            <img
                                                src={section.images[0].image}
                                                alt=""
                                                className="w-[62px] h-[62px] lg:w-[74px] lg:h-[74px] rounded-full object-cover"
                                            />
                                        </div>
                                        <p className={`mt-[24px] mb-[8px] text-center font-semibold ${activeSectionId === section.id ? 'text-[#121212]' : 'text-[#8A94A4]'}`}>
                                            {section.name}
                                        </p>
                                        {activeSectionId === section.id && (
                                            <div className="mt-[4px] w-full h-[2px] bg-[#4F372F]" />
                                        )}
                                    </div>
                                ))}
                            </div>

                        </div>

                        {sections.map((section: MenuSection) => {
                            const isVisible = visibleSections.has(section.id);
                            return (
                                <div key={section.id}>
                                    <div className="flex items-center justify-between pb-[32px] cursor-pointer" onClick={() => toggleSectionVisibility(section.id)}>
                                        <p className="text-2xl font-medium leading-[28.13px] tracking-[0.5px] text-[#121212]">{section.name}</p>
                                        <IoIosArrowDown
                                            style={{
                                                width: '24px',
                                                height: '24px',
                                                transform: isVisible ? 'rotate(180deg)' : 'rotate(0deg)',
                                                transition: 'transform 0.3s ease',
                                            }}
                                        />
                                    </div>
                                    {isVisible && filterItems(section.items).map((item) => {
                                        const cartItem = cart.items.find((cartItem) => cartItem.id === item.id);
                                        const quantity = cartItem ? cartItem.quantity : 0;
                                        const uniqueKey = `${item.id}-${item.modifier?.id || 'no-modifier'}`;
                                        console.log('cartitem', cartItem, uniqueKey)
                                        return (
                                            <div
                                                key={uniqueKey}
                                                className="flex justify-between pb-[16px] cursor-pointer"
                                                onClick={() => openModal(item)}
                                            >
                                                <div>

                                                    <p className="text-[#121212] text-base font-medium leading-[18.75px]">
                                                        {quantity > 0 && <span className="text-sm bg-[#4F372F] text-white px-[5px] py-[2px] rounded-[4px]">{quantity}</span>}    {item.name}
                                                    </p>
                                                    <p className="text-base py-[6px] font-light leading-[18.75px] text-[#464646] truncate lg:max-w-[350px] max-w-[210px]">{item.description}</p>
                                                    <p className="text-base font-semibold leading-[18.75px] text-[#464646]">R${item.price.toFixed(2)}</p>
                                                </div>
                                                {item.image && (
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-[128px] h-[85px] rounded"
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}


                                </div>
                            );
                        })}
                        {isMobile &&
                            <div className="flex flex-col items-center space-y-4 ">
                                <button className="px-4 py-2 text-[#4F372F] font-bold text-sm text-brown-800 underline rounded-md bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brown-500 focus:ring-offset-2">
                                    View allergy information
                                </button>
                                <button onClick={() => setIsCartModalOpen(true)} className="px-6 py-3 bg-[#4F372F] text-white bg-brown-800 rounded-full font-medium text-sm flex items-center justify-center hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-brown-500 focus:ring-offset-2">
                                    Your basket <span className="mx-1">•</span> {cart.items.reduce((total, item) => total + item.quantity, 0)} item(s)
                                </button>
                            </div>}
                    </div>

                    <CartModal
                        isOpen={isCartModalOpen}
                        onClose={toggleCartModal}
                        cart={cart}
                    />

                    {!isMobile &&
                        <div className="shadow-[0px_2px_14px_0px_#00000026] w-[50%] h-[20%]  ">
                            <div className="bg-[#F8F9FA] py-[22px] px-[24px]">
                                <h2 className="text-2xl text-[#464646] font-medium leading-[28.13px] tracking-[0.5px]">Carrinho</h2>
                            </div>
                            <div className={`bg-white px-[24px] ${cart.total.toFixed(2) !== '0.00' ? "py-[17px]" : "py-[24px]"} `}>
                                {cart.total.toFixed(2) === '0.00' && <p>Seu carrinho está vazio</p>}
                                {cart.items.map((item, index) => (
                                    <div key={`${item.id}-${index}`}>
                                        <div className="flex justify-between">
                                            <p>{item.name}</p>
                                            <p className="font-semibold">R${item.price.toFixed(2)}</p>
                                        </div>
                                        {item.modifier && (
                                            <div className="text-sm text-gray-600">
                                                <p>Modifier: {item.modifier.name}</p>
                                                <p>Additional Price: R${item.modifier.price.toFixed(2)}</p>
                                            </div>
                                        )}
                                        <div className="flex gap-[6px] m-[8px]">
                                            <button
                                                className="text-[20px] font-bold bg-[#4F372F] rounded-full w-[20px] h-[20px] text-[#FFFFFF] flex items-center justify-center cursor-pointer"
                                                onClick={() => dispatch(decrementQuantity(item.id))}
                                            >
                                                -
                                            </button>
                                            <span className="text-base font-bold leading-[18.75px]">{item.quantity}</span>
                                            <button
                                                className="text-[20px] font-bold bg-[#4F372F] rounded-full w-[20px] h-[20px] text-[#FFFFFF] flex items-center justify-center cursor-pointer"
                                                onClick={() => dispatch(incrementQuantity(item.id))}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                ))}


                            </div>
                            {cart.total.toFixed(2) !== '0.00' &&
                                <div className="p-[16px] flex justify-between border-t-2 border-t-solid border-[#EEEEEE]"> <p>Total:  </p><p>R${cart.total.toFixed(2)}</p></div>
                            }
                        </div>}

                </div>
            </div>

            {isModalOpen && selectedItem && (
                <Modal item={selectedItem} onClose={closeModal} onAddToCart={handleAddToCart} />
            )}
        </div>
    );
};

export default Menu;
