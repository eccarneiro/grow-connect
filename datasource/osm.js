import axios from "axios";

export const osmSearch = async (query) => {
    const url = `https://nominatim.openstreetmap.org/search`;
    const response = await axios.get(url, {
        params: {
            q: query,
            format: 'json',
            limit: 1
        },
    });

    if (response.data.length > 0) {
        return response.data[0];
    } else {
        throw new Error("Local não encontrado.");
    }
}