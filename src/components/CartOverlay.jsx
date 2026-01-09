import React from 'react';
import { useCart } from './CartContext';

const CartOverlay = () => {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] overflow-hidden">
      {/* Donkere Backdrop met blur */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-500 ease-in-out" 
        onClick={() => setIsCartOpen(false)} 
      />

      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md transform transition duration-500 ease-in-out sm:duration-700 animate-slide-in">
          <div className="flex h-full flex-col bg-white shadow-2xl overflow-hidden rounded-l-3xl">
            
            {/* Header met dikke zwarte titel */}
            <div className="flex items-center justify-between px-8 py-10 border-b border-slate-50">
              <h2 className="text-3xl font-black uppercase tracking-tighter text-black">
                Winkelmand <span className="text-slate-300 ml-2">{cartCount}</span>
              </h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="group p-3 hover:bg-black rounded-full transition-all duration-300"
              >
                <span className="text-xl group-hover:text-white transition-colors">✕</span>
              </button>
            </div>

            {/* Producten Lijst */}
            <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-300">
                  <div className="text-8xl mb-6 opacity-20">🛒</div>
                  <p className="font-bold text-lg uppercase tracking-widest text-slate-400">Je mandje is leeg</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="mt-6 text-black font-black underline decoration-2 underline-offset-4 hover:text-blue-600 transition-colors"
                  >
                    Ga shoppen
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center gap-6 group animate-fade-in">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-50 border border-slate-100 group-hover:scale-105 transition-transform duration-300">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between items-start">
                          <h3 className="font-black text-lg text-slate-900 leading-tight uppercase tracking-tight">{item.name}</h3>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-slate-300 hover:text-red-500 transition-colors text-xs"
                          >
                            Verwijder
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center bg-slate-100 rounded-xl p-1">
                            <button 
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all font-bold"
                            >-</button>
                            <span className="w-8 text-center text-sm font-black">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all font-bold"
                            >+</button>
                          </div>
                          <p className="font-black text-black">€{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer met Totaal en Checkout */}
            {cart.length > 0 && (
              <div className="px-8 py-10 bg-slate-50 border-t border-slate-100">
                <div className="space-y-2 mb-8">
                    <div className="flex justify-between text-slate-400 font-bold text-xs uppercase tracking-widest">
                        <p>Verzending</p>
                        <p>Gratis</p>
                    </div>
                    <div className="flex justify-between text-slate-900">
                        <p className="text-xl font-black uppercase tracking-tighter">Totaal</p>
                        <p className="text-3xl font-black tracking-tighter">€{cartTotal.toFixed(2)}</p>
                    </div>
                </div>
                <button 
                  className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-blue-600 transition-all duration-500 shadow-2xl shadow-black/20 active:scale-[0.98] flex items-center justify-center gap-3"
                  onClick={() => alert('Je wordt nu doorgeleid naar de beveiligde betaalomgeving...')}
                >
                  Nu Afrekenen <span>→</span>
                </button>
                <div className="mt-6 flex justify-center gap-4 grayscale opacity-30">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" alt="Paypal" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4" alt="Mastercard" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartOverlay;