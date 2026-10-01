export default function WhatsAppChat() {
  const whatsappUrl =
    "https://wa.me/966573166799?text=Hi%2C%20I%20need%20help%20with%20UKJobAlert.";

  return (
    <div className="fixed bottom-5 right-5 z-[80] sm:bottom-6 sm:right-6">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with UKJobAlert on WhatsApp"
        title="Chat with us on WhatsApp"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/25 sm:h-16 sm:w-16"
      >
        <span
          aria-hidden="true"
          className="absolute inset-[4px] -z-10 rounded-full bg-[#25D366]/35 motion-safe:animate-ping"
        />
        <span
          aria-hidden="true"
          className="absolute inset-[-3px] -z-10 rounded-full border border-[#25D366]/25"
        />

        <img
          src="/whatsapp.svg"
          alt=""
          aria-hidden="true"
          width="64"
          height="64"
          className="h-full w-full object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.18)]"
        />

        <span className="pointer-events-none absolute right-[calc(100%+12px)] hidden whitespace-nowrap rounded-md bg-[#07182d] px-3 py-2 text-xs font-bold text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 sm:block">
          Chat with us
        </span>
      </a>
    </div>
  );
}
