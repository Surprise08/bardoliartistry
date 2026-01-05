import logo from '@/assets/logo.jpg';

const FixedLogo = () => {
  return (
    <div className="fixed top-4 left-4 z-50 pointer-events-none">
      <img 
        src={logo} 
        alt="Logo" 
        className="w-12 h-12 sm:w-14 sm:h-14 object-contain opacity-80 brightness-150 contrast-125 saturate-0"
        style={{ filter: 'brightness(1.5) contrast(1.2) saturate(0)' }}
      />
    </div>
  );
};

export default FixedLogo;
