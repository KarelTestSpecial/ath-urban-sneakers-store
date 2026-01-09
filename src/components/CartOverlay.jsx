import React, { useState } from 'react';
import { useCart } from './CartContext';

const CartOverlay = () => {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartTotal, cartCount, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSent, setIsSent] = useState(false);

  if (!isCartOpen) return null;

  const handleCheckout = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const customerData = Object.fromEntries(formData.entries());

    // Formatteer de winkelwagen inhoud voor de e-mail
    const orderDetails = cart.map(item => `- ${item.name} (${item.quantity}x) - €${(item.price * item.quantity).toFixed(2)}`).join('\n');
    
    const body = {
      ...customerData,
      bestelling: orderDetails,
      totaalbedrag: `€${cartTotal.toFixed(2)}`,
      _subject: `Nieuwe bestelling van ${customerData.naam}`
    };

    try {
      // We gebruiken Formspree als backend (vereist alleen een e-mailadres in de config later)
      // Voor nu sturen we het naar een placeholder, je kunt dit later koppelen aan je eigen Formspree ID
      const response = await fetch('https://formspree.io/f/{{FORMSPREE_ID}}', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        setIsSent(true);
        setTimeout(() => {
          clearCart();
          setIsCartOpen(false);
          setIsSent(false);
          setIsCheckingOut(false);
        }, 3000);
      }
    } catch (error) {
      alert("Er ging iets mis bij het verzenden. Probeer het later opnieuw.");
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] overflow-hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity" onClick={() => setIsCartOpen(false)} />

      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md animate-slide-in">
          <div className="flex h-full flex-col bg-white shadow-2xl overflow-hidden rounded-l-3xl">
            
            <div className="flex items-center justify-between px-8 py-10 border-b border-slate-50">
              <h2 className="text-3xl font-black uppercase tracking-tighter text-black">
                {isCheckingOut ? 'Gegevens' : 'Winkelmand'} <span className="text-slate-300 ml-2">{cartCount}</span>
              </h2>
              <button onClick={() => { setIsCartOpen(false); setIsCheckingOut(false); }} className="p-3 hover:bg-slate-100 rounded-full transition-all">
                <span className="text-xl">✕</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
              {isSent ? (
                <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in">
                  <span className="text-6xl mb-4">🎉</span>
                  <h3 className="text-2xl font-black mb-2">Bedankt voor je bestelling!</h3>
                  <p className="text-slate-500">We hebben je aanvraag ontvangen en nemen zo snel mogelijk contact met je op.</p>
                </div>
              ) : isCheckingOut ? (
                <form id="checkout-form" onSubmit={handleCheckout} className="space-y-6 animate-fade-in">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Naam</label>
                    <input name="naam" required className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-xl focus:border-black outline-none transition-all" placeholder="Je volledige naam" />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">E-mailadres</label>
                    <input name="email" type="email" required className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-xl focus:border-black outline-none transition-all" placeholder="je@email.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Adres (voor bezorging)</label>
                    <textarea name="adres" required rows="3" className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-xl focus:border-black outline-none transition-all" placeholder="Straat, huisnummer, postcode, stad"></textarea>
                  </div>
                  <div className="p-6 bg-blue-50 rounded-2xl">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Samenvatting</p>
                    <p className="text-xl font-black">Totaal: €{cartTotal.toFixed(2)}</p>
                  </div>
                </form>
              ) : (
                <div className="space-y-8">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 py-20">
                      <span className="text-8xl mb-6 opacity-20">🛒</span>
                      <p className="font-bold text-lg uppercase tracking-widest text-slate-400">Je mandje is leeg</p>
                    </div>
                  ) : (
                    cart.map(item => (
                      <div key={item.id} className="flex items-center gap-6 group">
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-50 border border-slate-100">
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-black text-lg text-slate-900 leading-tight uppercase tracking-tight">{item.name}</h3>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center bg-slate-100 rounded-xl p-1">
                              <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all font-bold">-</button>
                              <span className="w-8 text-center text-sm font-black">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all font-bold">+</button>
                            </div>
                            <p className="font-black text-black">€{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {cart.length > 0 && !isSent && (
              <div className="px-8 py-10 bg-slate-50 border-t border-slate-100">
                {!isCheckingOut ? (
                  <>
                    <div className="flex justify-between text-slate-900 mb-8">
                      <p className="text-xl font-black uppercase tracking-tighter">Totaal</p>
                      <p className="text-3xl font-black tracking-tighter">€{cartTotal.toFixed(2)}</p>
                    </div>
                    <button 
                      onClick={() => setIsCheckingOut(true)}
                      className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-blue-600 transition-all duration-500 shadow-2xl shadow-black/20"
                    >
                      Bestelling Plaatsen
                    </button>
                  </>
                ) : (
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setIsCheckingOut(false)}
                      className="flex-1 bg-white border-2 border-slate-100 text-slate-400 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:text-black transition-all"
                    >
                      Terug
                    </button>
                    <button 
                      form="checkout-form"
                      type="submit"
                      className="flex-[2] bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-black transition-all duration-500 shadow-2xl shadow-blue-600/20"
                    >
                      Bevestigen
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartOverlay;
