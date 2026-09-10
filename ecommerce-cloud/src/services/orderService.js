import { supabase } from '../lib/supabaseClient.js';

/**
 * Records a completed Razorpay payment: an `orders` row, its `order_items`
 * lines snapshotted from the cart, and a `payments` row. Called only after
 * Razorpay has already reported success — this just persists the result.
 */
export async function createOrder({ userId, lines, subtotal, shipping, razorpayPaymentId }) {
  const { data: orderNumber, error: numberError } = await supabase.rpc('generate_order_number');
  if (numberError) return { data: null, error: numberError };

  const shippingCost = shipping.cost ?? 0;
  const totalAmount = subtotal + shippingCost;

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      user_id: userId,
      subtotal,
      shipping: shippingCost,
      total_amount: totalAmount,
      payment_method: 'razorpay',
      payment_status: 'paid',
      order_status: 'processing',
      shipping_name: shipping.name,
      shipping_email: shipping.email,
      shipping_phone: shipping.phone,
      shipping_address: shipping.address,
    })
    .select()
    .single();

  if (orderError) return { data: null, error: orderError };

  const orderItems = lines.map((line) => ({
    order_id: order.id,
    product_id: line.product_id,
    product_name: line.name,
    product_image: line.image_url,
    size: line.size,
    color: line.color,
    quantity: line.quantity,
    price: line.price,
    subtotal: line.price * line.quantity,
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
  if (itemsError) return { data: null, error: itemsError };

  const { error: paymentError } = await supabase.from('payments').insert({
    order_id: order.id,
    payment_method: 'razorpay',
    transaction_id: razorpayPaymentId,
    amount: totalAmount,
    status: 'paid',
  });
  if (paymentError) return { data: null, error: paymentError };

  return { data: order, error: null };
}
