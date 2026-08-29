import { siteConfig } from "@/config/site";

export function generateWhatsAppLink({ mode, cartItems, customerInfo }) {
  const phone = siteConfig.whatsappNumber;
  let message = `*नवीन क्रयादेशः / New Order - ${siteConfig.name}*\n`;
  message += `*Mode:* ${mode.toUpperCase()}\n\n`;

  if (mode === "b2b") {
    message += `*Business Details:*\n`;
    message += `• Name: ${customerInfo.name}\n`;
    message += `• Business: ${customerInfo.businessName}\n`;
    message += `• GSTIN: ${customerInfo.gstin || 'N/A'}\n\n`;
  }

  message += `*Items:*\n`;
  let total = 0;

  cartItems.forEach((item, index) => {
    const price = mode === "b2b" ? (item.priceB2B || item.pricePerMeterB2B) : (item.priceB2C || item.pricePerMeterB2C);
    const qty = item.selectedQty || item.selectedMeters || 1;
    const subtotal = price * qty;
    total += subtotal;

    message += `${index + 1}. *${item.name}*\n`;
    if (item.selectedSize) message += `   Size: ${item.selectedSize}\n`;
    if (item.selectedMeters) message += `   Length: ${item.selectedMeters} Meters\n`;
    message += `   Qty: ${qty} x ₹${price} = ₹${subtotal}\n`;
  });

  message += `\n*Total Estimated Amount:* ₹${total}`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}