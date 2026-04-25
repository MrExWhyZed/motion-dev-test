// Server component — purely decorative, no interactivity needed
export default function BackgroundGlow() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Base dark background */}
      <div className="absolute inset-0 bg-[#080808]" />

      {/* Primary purple radial glow — top center */}
      <div
        className="absolute top-[-20%] left-[50%] translate-x-[-50%] w-[900px] h-[700px] rounded-full opacity-20"
        style={{
          background:
            'radial-gradient(ellipse at center, #a855f7 0%, #7c3aed 30%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Pink accent glow — bottom right */}
      <div
        className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[500px] rounded-full opacity-15"
        style={{
          background:
            'radial-gradient(ellipse at center, #ec4899 0%, #be185d 40%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />

      {/* Soft blue diffusion — bottom left */}
      <div
        className="absolute bottom-[10%] left-[-10%] w-[500px] h-[400px] rounded-full opacity-10"
        style={{
          background:
            'radial-gradient(ellipse at center, #818cf8 0%, #4f46e5 40%, transparent 70%)',
          filter: 'blur(120px)',
        }}
      />

      {/* Center ambient glow — behind the form */}
      <div
        className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[700px] h-[700px] rounded-full opacity-[0.06]"
        style={{
          background:
            'radial-gradient(ellipse at center, #ffffff 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />
    </div>
  );
}