// Base URL — reads from Vite env variable if set, falls back to /api
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Submit a shop order to the backend.
 */
export const submitOrder = async (payload) => {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Order failed. Please try again.');
  return data;
};

/**
 * Submit a contact form message to the backend.
 */
export const submitContactMessage = async (payload) => {
  const res = await fetch(`${BASE_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Could not send message. Please try again.');
  return data;
};

/**
 * Submit an anonymous mystery note. No sender info is collected.
 */
export const submitMysteryNote = async (message) => {
  const res = await fetch(`${BASE_URL}/mystery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Could not send mystery note. Please try again.');
  return data;
};

/**
 * Submit feedback to leadership.
 */
export const submitFeedback = async (message) => {
  const res = await fetch(`${BASE_URL}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Could not send feedback. Please try again.');
  return data;
};
