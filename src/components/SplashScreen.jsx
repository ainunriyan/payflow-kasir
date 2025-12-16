export default function SplashScreen() {
  return (
    <div className="w-screen h-screen bg-white flex flex-col items-center justify-center overflow-hidden">
      
      {/* Logo jatuh dari atas */}
      <img
        src="/logo1.png"
        className="w-48 animate-logoDrop"
      />

      {/* Text fade-in setelah logo selesai 1.2 detik */}
      <img
        src="/tekslogo.png"
        className="w-40 opacity-0 animate-textFadeIn"
      />
    </div>
  );
}
