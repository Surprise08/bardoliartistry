import logo from '@/assets/logo.png';

const FixedLogo = () => {
  return (
    <div className="fixed top-4 left-4 z-50 pointer-events-none">
      <img 
        src={logo} 
        alt="Logo" 
        className="w-12 h-12 sm:w-14 sm:h-14 object-contain opacity-90 invert"
      />
    </div>
  );
};

export default FixedLogo;
