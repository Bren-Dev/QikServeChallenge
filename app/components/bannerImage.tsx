import { useEffect, useState } from "react";

export const BannerImage = () => {
    const [bannerImage, setBannerImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const fetchRestaurantDetails = async () => {
            try {
                const response = await fetch('/api/venue');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setBannerImage(data.webSettings.bannerImage);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('Ocorreu um erro inesperado.');
                }
                console.error('Erro ao buscar os detalhes do restaurante:', error);
            }
        };

        fetchRestaurantDetails();
    }, []);

    if (error) {
        return <p className="text-red-500">Erro ao carregar o banner: {error}</p>;
    }


    return (
        <div>
            {bannerImage ? (
                <img src={bannerImage} alt="Restaurant Banner" className="w-full h-[150px] lg:h-auto object-cover object-center" />
            ) : (
                <p>Carregando banner...</p>
            )}
        </div>
    )
}