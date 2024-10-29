import axios from "axios";

export const osmSearch = async (query) => {
    const url = `https://nominatim.openstreetmap.org/search`;

    try {
        const response = await axios.get(url, {
            params: {
                q: query,
                format: 'json',
                limit: 1
            },
            headers: {
                // Adiciona um User-Agent personalizado
                'User-Agent': 'GrowOn/1.0 (tenseioficial@gmail.com)'
            }
        });

        if (response.data.length > 0) {
            return response.data[0];
        } else {
            throw new Error("Local não encontrado.");
        }
    } catch (error) {
        console.error("Erro ao buscar dados do OpenStreetMap:", error);
        throw new Error("Erro ao buscar dados de localização.");
    }
};
