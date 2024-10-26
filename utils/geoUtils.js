import { osmSearch } from "../datasource/osm.js";

export const getCityCords = async (cidade, estado) => {
    try {
        const query = `${cidade}, ${estado}`;
        const { lat, lon } = await osmSearch(query);
        return { lat, lon };
    } catch (error) {
        console.error("Erro na geocodificação:", error);
        return null;
    }
} 