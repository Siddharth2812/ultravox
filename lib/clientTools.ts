import { ClientToolImplementation } from 'ultravox-client';
import { FinancialProfileData } from './types';

// Client-implemented tool for Order Details
export const updateOrderTool: ClientToolImplementation = (parameters) => {
  const { ...orderData } = parameters;
  console.debug("Received order details update:", orderData.orderDetailsData);

  if (typeof window !== "undefined") {
    const event = new CustomEvent("orderDetailsUpdated", {
      detail: orderData.orderDetailsData,
    });
    window.dispatchEvent(event);
  }

  return "Updated the order details.";
};

export const updateFinancialProfileTool: ClientToolImplementation = (parameters) => {
  const { profileData } = parameters;
  console.debug("Received financial profile update:", profileData);

  if (typeof window !== "undefined") {
    const event = new CustomEvent("financialProfileUpdated", {
      detail: profileData
    });
    window.dispatchEvent(event);
  }

  return "Updated the financial profile.";
};
