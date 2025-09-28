import axios from "axios";

const apiUrl = "https://crossover.proxy.rlwy.net/api";

export async function createTicket(ticket) {
  const response = await axios.post(`${apiUrl}/tickets`, ticket);
  return response.data;
}

export async function getTicket(id) {
  const response = await axios.get(`${apiUrl}/tickets/${id}`);
  return response.data;
}

export async function getAllTickets() {
  const response = await axios.get(`${apiUrl}/tickets`);
  return response.data;
}

export async function getUserTickets(userId) {
  const response = await axios.get(`${apiUrl}/tickets/user/${userId}`);
  return response.data;
}

export async function updateTicketStatus(id, status, assignedTo = null) {
  const response = await axios.put(
    `${apiUrl}/tickets/${id}/status?status=${status}${
      assignedTo ? `&assignedTo=${assignedTo}` : ""
    }`
  );
  return response.data;
}

export async function addAttachment(ticketId, attachment) {
  const response = await axios.post(
    `${apiUrl}/tickets/${ticketId}/attachments`,
    attachment
  );
  return response.data;
}

export async function getAttachments(ticketId) {
  const response = await axios.get(`${apiUrl}/tickets/${ticketId}/attachments`);
  return response.data;
}

export async function getAllUsers() {
  const response = await axios.get(`${apiUrl}/users`);
  return response.data;
}

export async function getUserById(id) {
  const response = await axios.get(`${apiUrl}/users/${id}`);
  return response.data;
}

export async function deleteTickets(ticketIds) {
  const response = await axios.delete(`${apiUrl}/tickets`, { data: ticketIds });
  return response.data;
}

export async function registerUser(userData) {
  const response = await axios.post(`${apiUrl}/auth/register`, userData);
  return response.data;
}

export async function loginUser(credentials) {
  const response = await axios.post(`${apiUrl}/auth/login`, credentials);
  return response.data;
}
