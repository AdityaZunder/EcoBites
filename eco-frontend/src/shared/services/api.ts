import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Uploads an image file to the server.
 * @param file - The image file to upload.
 * @returns The URL of the uploaded image.
 */
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

/**
 * Creates a new listing for a restaurant.
 * @param listingData - The data for the new listing.
 * @returns The created listing object.
 */
export const createListing = async (listingData: any) => {
    const response = await api.post('/listings', listingData);
    return response.data;
};

/**
 * Fetches listings. If a restaurantId is provided, fetches listings for that restaurant.
 * Otherwise, fetches all listings.
 * @param restaurantId - Optional ID of the restaurant to filter listings by.
 * @returns An array of listings.
 */
export const getListings = async (restaurantId?: string) => {
    const url = restaurantId ? `/listings/restaurant/${restaurantId}` : '/listings';
    const response = await api.get(url);
    return response.data;
};

/**
 * Fetches all restaurants.
 * @returns An array of restaurant objects.
 */
export const getRestaurants = async () => {
    const response = await api.get('/restaurants');
    return response.data;
};

/**
 * Fetches a specific restaurant by its ID.
 * @param id - The ID of the restaurant.
 * @returns The restaurant object.
 */
export const getRestaurantById = async (id: string) => {
    const response = await api.get(`/restaurants/${id}`);
    return response.data;
};

/**
 * Fetches a restaurant associated with a specific user ID.
 * @param userId - The ID of the user.
 * @returns The restaurant object associated with the user.
 */
export const getRestaurantByUserId = async (userId: string) => {
    const response = await api.get(`/restaurants/user/${userId}`);
    return response.data;
};

/**
 * Fetches a user by their ID.
 * @param userId - The ID of the user.
 * @returns The user object.
 */
export const getUser = async (userId: string) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
};

/**
 * Fetches all orders for a specific restaurant.
 * @param restaurantId - The ID of the restaurant.
 * @returns An array of orders for the restaurant.
 */
export const getOrdersByRestaurant = async (restaurantId: string) => {
    const response = await api.get(`/orders/restaurant/${restaurantId}`);
    return response.data;
};

/**
 * Updates the status of an order.
 * @param orderId - The ID of the order.
 * @param status - The new status.
 * @returns The updated order object.
 */
export const updateOrderStatus = async (orderId: string, status: string) => {
    const response = await api.put(`/orders/${orderId}/status`, { status });
    return response.data;
};

export default api;
