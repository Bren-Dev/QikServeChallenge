'use client'

import React, { useState } from "react";

const Navbar = () => {
    const [active, setActive] = useState("menu");
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { id: "menu", label: "Menu" },
        { id: "entrar", label: "Entrar" },
        { id: "contato", label: "Contato" },
    ];

    return (
        <nav className="bg-[#4E3629] text-white">
            <div className="flex items-center justify-between px-4 py-4 md:hidden">
                <div></div>
                <p className="text-lg font-bold ">{navItems.find(item => item.id === active)?.label}</p>

                <button
                    className="block md:hidden"
                    onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <div className="space-y-2">
                        <div className="w-6 h-0.5 bg-white"></div>
                        <div className="w-6 h-0.5 bg-white"></div>
                        <div className="w-6 h-0.5 bg-white"></div>
                    </div>
                </button>
            </div>

            <ul
                className={`${isMobileMenuOpen ? "block" : "hidden"
                    } md:flex md:justify-center md:space-x-8 relative`}
            >
                {navItems.map((item) => (
                    <li
                        key={item.id}
                        className={`relative cursor-pointer flex items-center justify-center py-[14px] w-[232px] ${active === item.id ? "font-bold" : "font-normal"
                            }`}
                        onClick={() => {
                            setActive(item.id);
                            setMobileMenuOpen(false);
                        }}
                    >
                        <span className="text-xl font-normal leading-[23.44px] uppercase">
                            {item.label}
                        </span>
                        {active === item.id && (
                            <div
                                className="absolute bottom-0 left-0 w-full h-[5px] bg-white transition-all duration-300"
                            ></div>
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Navbar;
