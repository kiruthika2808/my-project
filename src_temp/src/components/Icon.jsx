export default function Icon({ name, className = "h-5 w-5" }) {
  const paths = {
    search: "M21 21l-4.35-4.35M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z",
    heart: "M20.8 4.6a5.2 5.2 0 0 0-7.4 0L12 6l-1.4-1.4a5.2 5.2 0 1 0-7.4 7.4L12 20.8l8.8-8.8a5.2 5.2 0 0 0 0-7.4Z",
    cart: "M6.5 6h14l-1.5 8.5H8L6.5 6ZM6.5 6 5.8 3H3M9 19.2h.01M18 19.2h.01",
    user: "M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z",
    menu: "M4 7h16M4 12h16M4 17h16",
    close: "M6 18 18 6M6 6l12 12",
    arrow: "M5 12h14M13 5l7 7-7 7",
  };

  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d={paths[name]} />
    </svg>
  );
}
