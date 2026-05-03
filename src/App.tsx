import { useEffect, useRef, useState } from "react";

const collections = [
  {
    name: "T-shirts",
    image: "/images/product-tee.jpg",
    copy: "Oversized cuts, washed black cotton, graphics built for late nights.",
  },
  {
    name: "Hoodies",
    image: "/images/product-hoodie.jpg",
    copy: "Heavyweight fleece with dropped shoulders and electric green details.",
  },
  {
    name: "Jackets",
    image: "/images/product-jacket.jpg",
    copy: "Technical layers for concrete weather and after-hours movement.",
  },
  {
    name: "Jeans",
    image: "/images/product-jeans.jpg",
    copy: "Wide-leg denim, stacked hems, black rinses, no compromise.",
  },
];

const products = [
  { name: "Void Box Tee", price: "$82", tag: "Heavy cotton", image: "/images/product-tee.jpg" },
  { name: "Signal Hoodie", price: "$168", tag: "Neon cord", image: "/images/product-hoodie.jpg" },
  { name: "Night Shift Jacket", price: "$248", tag: "Water resistant", image: "/images/product-jacket.jpg" },
  { name: "Blackout Denim", price: "$190", tag: "Wide leg", image: "/images/product-jeans.jpg" },
];

type Product = (typeof products)[number];
type CartItem = Product & { quantity: number };

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCollectionName, setActiveCollectionName] = useState<string | null>(null);
  const [activeProductName, setActiveProductName] = useState<string | null>(null);
  const collectionCardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const productCardRefs = useRef<(HTMLElement | null)[]>([]);
  const [route, setRoute] = useState<"home" | "login">(() =>
    window.location.hash.startsWith("#/login") ? "login" : "home",
  );

  useEffect(() => {
    const syncRoute = () => {
      setRoute(window.location.hash.startsWith("#/login") ? "login" : "home");
    };

    window.addEventListener("hashchange", syncRoute);
    return () => window.removeEventListener("hashchange", syncRoute);
  }, []);

  useEffect(() => {
    const closeOnDesktop = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", closeOnDesktop);
    return () => window.removeEventListener("resize", closeOnDesktop);
  }, []);

  useEffect(() => {
    if (route !== "home") {
      return;
    }

    const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    if (!isTouchDevice) {
      setActiveCollectionName(null);
      setActiveProductName(null);
      return;
    }

    const findFullyVisibleCard = (visibilityMap: Map<string, number>) => {
      let selectedCard: string | null = null;
      let highestRatio = 0.98;

      visibilityMap.forEach((ratio, cardName) => {
        if (ratio >= highestRatio) {
          selectedCard = cardName;
          highestRatio = ratio;
        }
      });

      return selectedCard;
    };

    const observerOptions = {
      threshold: [0, 0.25, 0.5, 0.75, 0.9, 0.98, 1],
    };

    const collectionVisibility = new Map<string, number>();
    const productVisibility = new Map<string, number>();

    const collectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const cardName = (entry.target as HTMLElement).dataset.cardName;
        if (!cardName) {
          return;
        }
        collectionVisibility.set(cardName, entry.isIntersecting ? entry.intersectionRatio : 0);
      });

      setActiveCollectionName(findFullyVisibleCard(collectionVisibility));
    }, observerOptions);

    const productObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const cardName = (entry.target as HTMLElement).dataset.cardName;
        if (!cardName) {
          return;
        }
        productVisibility.set(cardName, entry.isIntersecting ? entry.intersectionRatio : 0);
      });

      setActiveProductName(findFullyVisibleCard(productVisibility));
    }, observerOptions);

    collectionCardRefs.current.forEach((card) => {
      if (card) {
        collectionObserver.observe(card);
      }
    });

    productCardRefs.current.forEach((card) => {
      if (card) {
        productObserver.observe(card);
      }
    });

    return () => {
      collectionObserver.disconnect();
      productObserver.disconnect();
    };
  }, [route]);

  const totalItems = cartItems.reduce((count, item) => count + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + Number(item.price.replace("$", "")) * item.quantity,
    0,
  );

  const handleQuickAdd = (product: Product) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.name === product.name);
      if (!existingItem) {
        return [...currentItems, { ...product, quantity: 1 }];
      }

      return currentItems.map((item) =>
        item.name === product.name ? { ...item, quantity: item.quantity + 1 } : item,
      );
    });
  };

  const handleRemoveItem = (productName: string) => {
    setCartItems((currentItems) => currentItems.filter((item) => item.name !== productName));
  };

  if (route === "login") {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#050505] text-zinc-100 selection:bg-[#b8ff19] selection:text-black">
        <img
          src="/images/hero-streetwear.jpg"
          alt="Dark city fashion backdrop"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-35"
        />
        <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(0,0,0,0.95)_0%,rgba(0,0,0,0.88)_45%,rgba(0,0,0,0.82)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(184,255,25,0.22),transparent_30%)]" />

        <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/45 backdrop-blur-md">
          <nav className="mx-auto flex max-w-[1800px] items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
            <a href="#top" className="font-display text-xl uppercase tracking-[-0.04em] text-white">
              Noir<span className="text-[#b8ff19]">//</span>Volt
            </a>
            <a className="neon-outline px-5 py-2 text-xs font-black uppercase tracking-[0.18em]" href="#">
              Back Home
            </a>
          </nav>
        </header>

        <section className="relative z-10 mx-auto flex min-h-screen max-w-[1800px] items-center px-5 pt-24 pb-10 sm:px-8 lg:px-10">
          <div className="grid w-full gap-10 lg:grid-cols-[1fr_0.92fr] lg:items-center">
            <div>
              <p className="mb-4 w-fit border border-[#b8ff19] px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-[#b8ff19]">
                Member Access
              </p>
              <h1 className="font-display headline-stroke text-5xl uppercase leading-[0.8] tracking-[-0.08em] sm:text-7xl lg:text-[7.2rem]">
                Login to the signal
              </h1>
              <p className="mt-6 max-w-xl text-sm font-semibold uppercase leading-relaxed tracking-[0.08em] text-zinc-300 sm:text-base">
                Enter your account to unlock early drop updates, order tracking, and priority release windows.
              </p>
            </div>

            <div className="border border-[#b8ff19]/70 bg-black/80 p-6 backdrop-blur-md sm:p-8">
              <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-zinc-300" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@domain.com"
                    className="w-full border border-white/20 bg-black/70 px-4 py-3 text-sm font-semibold tracking-[0.04em] text-white outline-none transition placeholder:text-zinc-500 focus:border-[#b8ff19]"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-zinc-300" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    className="w-full border border-white/20 bg-black/70 px-4 py-3 text-sm font-semibold tracking-[0.04em] text-white outline-none transition placeholder:text-zinc-500 focus:border-[#b8ff19]"
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">
                    <input type="checkbox" className="h-4 w-4 accent-[#b8ff19]" />
                    Remember me
                  </label>
                  <a href="#inquire" className="text-xs font-black uppercase tracking-[0.16em] text-[#b8ff19] transition hover:text-white">
                    Need access?
                  </a>
                </div>
                <button type="submit" className="neon-fill w-full px-6 py-3 text-xs font-black uppercase tracking-[0.18em]">
                  Login
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-zinc-100 selection:bg-[#b8ff19] selection:text-black">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/45 backdrop-blur-md">
        <nav className="mx-auto flex max-w-[1800px] items-center justify-between px-4 py-4 sm:px-8 lg:px-10 max-[380px]:px-3">
          <a href="#top" className="font-display text-lg uppercase tracking-[-0.04em] text-white max-[380px]:text-base">
            Noir<span className="text-[#b8ff19]">//</span>Volt
          </a>
          <div className="hidden items-center gap-8 text-xs font-black uppercase tracking-[0.22em] text-zinc-300 md:flex">
            <a className="transition hover:text-[#b8ff19]" href="#top">Home</a>
            <a className="transition hover:text-[#b8ff19]" href="#collections">Collections</a>
            <a className="transition hover:text-[#b8ff19]" href="#shop">Shop</a>
            <a className="transition hover:text-[#b8ff19]" href="#about">About</a>
            <a className="transition hover:text-[#b8ff19]" href="#inquire">Inquire</a>
          </div>
          <div className="flex flex-nowrap items-center gap-3 max-[380px]:gap-2">
            <button
              type="button"
              onClick={() => setIsCartOpen((isOpen) => !isOpen)}
              className="hidden neon-outline px-4 py-2 text-xs font-black uppercase tracking-[0.18em] md:inline-flex"
            >
              Cart ({totalItems})
            </button>
            <a className="neon-fill whitespace-nowrap px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] max-[380px]:px-3 max-[380px]:text-[10px]" href="#/login">
              Login
            </a>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className="inline-flex h-9 w-9 items-center justify-center border border-[#b8ff19] text-[#b8ff19] transition hover:bg-[#b8ff19] hover:text-black max-[380px]:h-8 max-[380px]:w-8 md:hidden"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-shortcuts"
            >
              <span className="relative block h-3.5 w-4">
                <span className={`absolute left-0 top-0 block h-[2px] w-4 bg-current transition ${isMobileMenuOpen ? "translate-y-[6px] rotate-45" : ""}`} />
                <span className={`absolute left-0 top-[6px] block h-[2px] w-4 bg-current transition ${isMobileMenuOpen ? "opacity-0" : ""}`} />
                <span className={`absolute left-0 top-3 block h-[2px] w-4 bg-current transition ${isMobileMenuOpen ? "-translate-y-[6px] -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </nav>
        {isMobileMenuOpen && (
          <div id="mobile-shortcuts" className="border-t border-white/10 bg-black/90 px-5 py-4 sm:px-8 md:hidden">
            <div className="flex flex-col gap-3 text-xs font-black uppercase tracking-[0.18em] text-zinc-200">
              <a className="transition hover:text-[#b8ff19]" href="#top" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
              <a className="transition hover:text-[#b8ff19]" href="#collections" onClick={() => setIsMobileMenuOpen(false)}>Collections</a>
              <a className="transition hover:text-[#b8ff19]" href="#shop" onClick={() => setIsMobileMenuOpen(false)}>Shop</a>
              <a className="transition hover:text-[#b8ff19]" href="#about" onClick={() => setIsMobileMenuOpen(false)}>About</a>
              <a className="transition hover:text-[#b8ff19]" href="#inquire" onClick={() => setIsMobileMenuOpen(false)}>Inquire</a>
            </div>
          </div>
        )}
      </header>
      {isCartOpen && (
        <div
          className="fixed inset-0 z-[70] bg-black/55"
          onClick={() => setIsCartOpen(false)}
          aria-hidden="true"
        >
          <aside
            className="absolute right-5 top-20 w-[calc(100%-2.5rem)] max-w-sm border border-[#b8ff19]/70 bg-black/95 p-4 backdrop-blur sm:right-8 lg:right-10"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            <div className="mb-3 flex items-center justify-between border-b border-white/15 pb-3">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b8ff19]">Cart</p>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="text-xs font-black uppercase tracking-[0.18em] text-zinc-300 transition hover:text-[#b8ff19]"
              >
                Close
              </button>
            </div>
            {cartItems.length === 0 ? (
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">Your cart is empty.</p>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.name} className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
                    <div>
                      <p className="text-sm font-black uppercase tracking-[-0.02em] text-white">{item.name}</p>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                        Qty {item.quantity} / {item.price}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.name)}
                      className="text-xs font-black uppercase tracking-[0.18em] text-zinc-300 transition hover:text-[#b8ff19]"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-1">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-300">Total</p>
                  <p className="text-base font-black text-[#b8ff19]">${totalPrice}</p>
                </div>
              </div>
            )}
          </aside>
        </div>
      )}

      <section id="top" className="hero-grid relative min-h-screen overflow-hidden bg-black lg:h-screen">
        <img
          src="/images/hero-streetwear.jpg"
          alt="Model wearing oversized black streetwear in a neon-lit urban underpass"
          className="hero-image absolute inset-0 h-full w-full object-cover object-[58%_center] opacity-75"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.95)_0%,rgba(0,0,0,0.75)_40%,rgba(0,0,0,0.45)_70%,rgba(0,0,0,0.30)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_72%,rgba(184,255,25,0.22),transparent_30%),linear-gradient(180deg,transparent_70%,#050505_100%)]" />
        <div className="relative z-10 mx-auto grid min-h-screen max-w-[1800px] px-5 pb-12 pt-28 sm:px-8 lg:h-full lg:grid-cols-[1fr_0.55fr] lg:gap-10 lg:px-10 lg:pt-24 lg:pb-8">
          <div className="flex flex-col justify-end max-[767px]:pb-14">
            <p className="reveal-up mb-4 font-display headline-stroke text-4xl uppercase leading-[0.78] tracking-[-0.08em] text-white sm:text-6xl lg:text-7xl">
              Noir<span className="text-[#b8ff19]">//</span>Volt
            </p>
            <h1 className="reveal-up max-w-6xl font-display headline-stroke text-[14vw] uppercase leading-[0.78] tracking-[-0.095em] text-white delay-100 sm:text-[11.5vw] lg:text-[8.8vw]">
              We're not
              <br />
              just fashion,
              <br />
              we're culture
            </h1>
            <div className="reveal-up mt-8 flex max-w-3xl flex-col gap-5 delay-200 sm:flex-row sm:items-end sm:justify-between lg:flex-col lg:items-start lg:justify-start">
              <p className="max-w-xl text-sm font-semibold uppercase leading-relaxed tracking-[0.08em] text-zinc-200 max-[380px]:text-xs sm:text-base">
                Limited-run streetwear made for warehouse nights, subway platforms, and the ones who set the temperature.
              </p>
              <div className="grid w-full max-w-[340px] grid-cols-2 gap-3 sm:max-w-none sm:w-auto lg:flex">
                <a className="neon-fill w-full justify-center px-3 py-3 text-[11px] font-black uppercase tracking-[0.16em] sm:px-6 sm:text-xs lg:w-[168px] lg:tracking-[0.18em]" href="#/login">
                  Shop Now
                </a>
                <a className="neon-outline w-full justify-center px-3 py-3 text-[11px] font-black uppercase tracking-[0.16em] sm:px-6 sm:text-xs lg:w-[168px] lg:tracking-[0.18em]" href="#inquire">
                  Inquire Now
                </a>
              </div>
            </div>
          </div>
          <aside className="hidden lg:flex lg:flex-col lg:justify-start">
            <div className="ml-auto w-full max-w-[560px] lg:mr-6">
              <div className="relative overflow-hidden border border-white/15 bg-black/50">
                <img
                  src="/images/hero-portrait.png"
                  alt="Streetwear portrait"
                  className="h-[calc(100vh-10rem)] max-h-[820px] w-full object-cover object-top opacity-90"
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.5)_100%)]" />
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section id="collections" className="mx-auto max-w-[1800px] px-5 pt-8 pb-20 sm:px-8 lg:px-10 lg:pt-12 lg:pb-28">
        <div className="mb-10 grid gap-6 lg:grid-cols-[0.92fr_1fr] lg:items-end">
          <h2 className="font-display headline-stroke text-5xl uppercase leading-[0.82] tracking-[-0.07em] sm:text-7xl lg:text-[6.2rem]">
            Featured collections
          </h2>
          <p className="max-w-xl justify-self-start text-base font-semibold uppercase leading-relaxed tracking-[0.06em] text-zinc-400 lg:justify-self-end">
            Four uniforms. One code. Built in black, sharpened with volt green.
          </p>
        </div>

        <div className="collection-wall grid gap-px bg-white/10 md:grid-cols-2 lg:grid-cols-4">
          {collections.map((collection, index) => (
            <a
              key={collection.name}
              href="#shop"
              ref={(element) => {
                collectionCardRefs.current[index] = element;
              }}
              data-card-name={collection.name}
              className={`collection-panel group relative min-h-[430px] overflow-hidden bg-zinc-950 p-5 ${index % 2 === 1 ? "lg:translate-y-12" : ""} ${activeCollectionName === collection.name ? "is-active" : ""}`}
            >
              <img
                src={collection.image}
                alt={`${collection.name} collection editorial look`}
                className="collection-image absolute inset-0 h-full w-full object-cover opacity-55 grayscale transition duration-700 group-hover:scale-105 group-hover:opacity-80 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
              <div className="relative z-10 flex h-full flex-col justify-between">
                <span className="w-fit border border-[#b8ff19] px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-[#b8ff19]">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="font-display text-5xl uppercase leading-[0.78] tracking-[-0.07em] text-white sm:text-6xl">
                    {collection.name}
                  </h3>
                  <p className="mt-4 max-w-xs text-xs font-bold uppercase leading-relaxed tracking-[0.08em] text-zinc-300">
                    {collection.copy}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section id="shop" className="mx-auto max-w-[1800px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="font-display text-5xl uppercase leading-[0.82] tracking-[-0.07em] sm:text-7xl lg:text-[6.2rem]">
            Shop the signal
          </h2>
          <a className="neon-outline w-fit px-6 py-3 text-sm font-black uppercase tracking-[0.18em]" href="#top">
            Back To Top
          </a>
        </div>

        <div className="grid gap-px bg-white/10 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product, index) => (
            <article
              key={product.name}
              ref={(element) => {
                productCardRefs.current[index] = element;
              }}
              data-card-name={product.name}
              className={`product-tile group bg-[#080808] ${activeProductName === product.name ? "is-active" : ""}`}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-zinc-950">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
                />
                <div className="scanline absolute inset-0 opacity-0 transition group-hover:opacity-100" />
                <button
                  type="button"
                  onClick={() => handleQuickAdd(product)}
                  className="quick-add-btn absolute bottom-4 left-4 right-4 translate-y-3 border border-[#b8ff19] bg-black/80 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-[#b8ff19] opacity-0 backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                >
                  Quick Add
                </button>
              </div>
              <div className="flex items-start justify-between gap-5 p-5">
                <div>
                  <h3 className="text-base font-black uppercase tracking-[-0.02em] text-white">{product.name}</h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">{product.tag}</p>
                </div>
                <p className="text-base font-black text-[#b8ff19]">{product.price}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section id="about" className="border-y border-white/10 bg-[#070707]">
        <div className="mx-auto grid min-h-screen max-w-[1800px] content-center gap-8 px-5 py-24 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
          <div>
            <p className="mb-4 w-fit border border-[#b8ff19] px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-[#b8ff19]">
              About
            </p>
            <h2 className="font-display headline-stroke text-5xl uppercase leading-[0.82] tracking-[-0.07em] text-white sm:text-7xl lg:text-[7.5rem]">
              Built for after-hours culture
            </h2>
          </div>
          <div className="space-y-7 self-end">
            <p className="text-sm font-semibold uppercase leading-relaxed tracking-[0.08em] text-zinc-300 sm:text-base">
              Noir//Volt is an independent streetwear house focused on limited runs, heavy fabrics, and silhouettes shaped by city movement.
            </p>
            <p className="text-sm font-semibold uppercase leading-relaxed tracking-[0.08em] text-zinc-400 sm:text-base">
              Every drop is designed as a short statement: black foundations, neon signal, and no unnecessary noise.
            </p>
            <p className="text-sm font-semibold uppercase leading-relaxed tracking-[0.08em] text-zinc-400 sm:text-base">
              Our process starts with utility-first pattern work, then pushes volume and proportion until each piece performs in motion as well as in still frames.
            </p>
            <p className="text-sm font-semibold uppercase leading-relaxed tracking-[0.08em] text-zinc-500 sm:text-base">
              We release in controlled batches to protect quality, reduce waste, and keep each capsule specific to a moment, not mass production.
            </p>
            <div className="grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-3">
              <div className="border border-white/15 bg-black/45 p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Founded</p>
                <p className="mt-2 text-sm font-black uppercase tracking-[0.08em] text-[#b8ff19]">2026</p>
              </div>
              <div className="border border-white/15 bg-black/45 p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Core Drop</p>
                <p className="mt-2 text-sm font-black uppercase tracking-[0.08em] text-[#b8ff19]">12 pieces</p>
              </div>
              <div className="border border-white/15 bg-black/45 p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Production</p>
                <p className="mt-2 text-sm font-black uppercase tracking-[0.08em] text-[#b8ff19]">Small batch</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="inquire" className="mx-auto max-w-[1800px] px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
        <div className="grid gap-8 border border-white/15 bg-black/60 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end lg:p-10">
          <div>
            <p className="mb-4 w-fit bg-[#b8ff19] px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-black">
              Inquire
            </p>
            <h2 className="font-display text-5xl uppercase leading-[0.82] tracking-[-0.07em] text-white sm:text-7xl lg:text-[7.5rem]">
              Request drop access
            </h2>
            <p className="mt-6 max-w-2xl text-sm font-semibold uppercase leading-relaxed tracking-[0.08em] text-zinc-300 sm:text-base">
              For early release notices, collaboration requests, or wholesale inquiries, contact the studio and we will reply with current availability.
            </p>
          </div>
          <div className="space-y-3 text-xs font-black uppercase tracking-[0.18em] text-zinc-300 lg:text-right">
            <p>contact@noirvolt.studio</p>
            <p>+1 (212) 555-0198</p>
            <a
              className="neon-outline inline-flex w-fit px-6 py-3 text-xs font-black uppercase tracking-[0.18em]"
              href="https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox?compose=DmwnWrRvwThvJfgNzflMXWFZRwqNgtwfCJHTKRkJmNgqZPlnlwPGdwRHMthrCRknxnkDDLXFZGPb"
              target="_blank"
              rel="noreferrer"
            >
              Send Inquiry
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#030303] px-5 py-10 text-xs font-black uppercase tracking-[0.18em] text-zinc-500 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-[1800px] gap-6 md:grid-cols-3 md:items-end">
          <p>Noir//Volt streetwear culture house</p>
          <div className="flex gap-5 md:justify-center">
            <a href="#top" className="transition hover:text-[#b8ff19]">Home</a>
            <a href="#collections" className="transition hover:text-[#b8ff19]">Collections</a>
            <a href="#shop" className="transition hover:text-[#b8ff19]">Shop</a>
            <a href="#inquire" className="transition hover:text-[#b8ff19]">Inquire</a>
          </div>
          <p className="text-[#b8ff19] md:text-right">Black uniform / neon signal</p>
        </div>
      </footer>
    </main>
  );
}
