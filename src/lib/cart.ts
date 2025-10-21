// Cart management utilities
export interface CartItem {
  id: number;
  name: string;
  price: number;
  size: string;
  image: string;
  quantity: number;
  total: number;
}

export const getCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  const cartStr = localStorage.getItem('palmport-cart');
  return cartStr ? JSON.parse(cartStr) : [];
};

export const saveCart = (cart: CartItem[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('palmport-cart', JSON.stringify(cart));
};

export const addToCart = (product: any, quantity: number) => {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.total = existingItem.price * existingItem.quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      size: product.size,
      image: product.image,
      quantity,
      total: product.price * quantity
    });
  }
  
  saveCart(cart);
  return cart;
};

export const clearCart = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('palmport-cart');
};