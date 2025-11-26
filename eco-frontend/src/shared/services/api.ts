import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data.url;
};

export const createListing = async (listingData: any) => {
    const response = await api.post('/listings', listingData);
    return response.data;
};

export const getListings = async (restaurantId?: string) => {
    const url = restaurantId ? `/listings/restaurant/${restaurantId}` : '/listings';
    const response = await api.get(url);
    return response.data;
};

export const getRestaurants = async () => {
    const response = await api.get('/restaurants');
    return response.data;
};

export const getRestaurantById = async (id: string) => {
    const response = await api.get(`/restaurants/${id}`);
    return response.data;
};

export const getUser = async (userId: string) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
};

export default api;
