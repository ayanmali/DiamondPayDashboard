import { CartItem } from "@/components/payment-links/new/payment-page/payment-link-preview";
import { AddedItem } from "@/pages/payment-links/new-payment-link";

export const calculateTotal = (addedItems: AddedItem[], cart: CartItem[]): number => {
    return addedItems.reduce((total, item) => {
        const cartItem = cart.find(c => c.addedItem.product.id === item.product.id);
        return total + (cartItem ? cartItem.quantity * item.price : 0);
    }, 0);
};

export const updateQuantity = (
    cart: CartItem[],
    setCart: (cart: CartItem[]) => void,
    addedItem: AddedItem,
    quantity: number
): void => {
    setCart(cart.map(item =>
        item.addedItem.product.id === addedItem.product.id ? { ...item, quantity } : item
    ));
};

export const removeProduct = (
    cart: CartItem[],
    setCart: (cart: CartItem[]) => void,
    addedItem: AddedItem
): void => {
    setCart(cart.filter(i => i.addedItem.product.id !== addedItem.product.id));
};

export const addProduct = (
    cart: CartItem[],
    setCart: (cart: CartItem[]) => void,
    addedItem: AddedItem
): void => {
    const existingItem = cart.find(item => item.addedItem.product.id === addedItem.product.id);
    if (existingItem) {
        updateQuantity(cart, setCart, addedItem, existingItem.quantity + 1);
    } else {
        setCart([...cart, { addedItem: addedItem, quantity: addedItem.quantity }]);
    }
};