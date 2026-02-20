import api from "./axios";

export const getOrders = () => api.get("/orders");

export const createOrder = (order) => api.post("/orders/create", order);

export const updateOrder = (id, data) => api.put(`/orders/update/${id}`, data);

export const deleteOrder = (id) => api.delete(`/orders/delete/${id}`);

export const markDelivered = (id) => api.post(`/orders/${id}/delivered`);

export const markPaid = (id) => api.post(`/orders/${id}/paid`);
