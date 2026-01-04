import { useState, useCallback, useRef, useEffect } from 'react';
import ParticleBackground from '@/components/ParticleBackground';
import SlideCard from '@/components/SlideCard';
import TypewriterText from '@/components/TypewriterText';
import FormInput from '@/components/FormInput';
import FormTextarea from '@/components/FormTextarea';
import FormRadioGroup from '@/components/FormRadioGroup';
import FileUpload from '@/components/FileUpload';
import NavigationButtons from '@/components/NavigationButtons';
import ProgressIndicator from '@/components/ProgressIndicator';
import { Sparkles, Heart, Lock, PartyPopper } from 'lucide-react';
import { cn } from '@/lib/utils';

const DISCLAIMER_TEXT = `Please read carefully...

Go somewhere quiet and sit peacefully—preferably alone, away from unnecessary opinions, suspicious side-eyes, and over-curious humans.

Also, keep this very important rule in mind: until you receive your surprise, do not tell anyone about it. Not friends, not family, not that one person who knows everything. You may be disqualified… or who knows, kisi ki nazar lag jaye. We take emotional safety very seriously here.

This gift is just a small reminder of appreciation, gratitude, and the comfort of knowing that our connection is valued. No pressure, no expectations—just something thoughtful, sent with good intent, and a little excitement!`;

const REASON_OPTIONS = [
  { value: 'just_curious', label: 'Just curious' },
  { value: 'looked_interesting', label: 'Looked interesting' },
  { value: 'someone_told', label: 'Someone told me' },
  { value: 'love_surprises', label: 'I love surprises' },
  { value: 'timepass', label: 'Timepass' },
];

interface FormData {
  name: string;
  contact: string;
  reason: string;
  address: string;
  message: string;
  selfie: File | null;
}

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showVideo, setShowVideo] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    contact: '',
    reason: '',
    address: '',
    message: '',
    selfie: null,
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showShake, setShowShake] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const totalSlides = 11;

  useEffect(() => {
    // Auto-skip video after 3 seconds if no video source or skip immediately
    const timer = setTimeout(() => {
      setShowVideo(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleVideoEnd = () => {
    setShowVideo(false);
  };

  const updateFormData = useCallback((field: keyof FormData, value: string | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const validateCurrentSlide = useCallback(() => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    switch (currentSlide) {
      case 3: // Name
        if (!formData.name.trim()) newErrors.name = 'Please enter your name';
        break;
      case 4: // Contact
        if (!formData.contact.trim()) newErrors.contact = 'Please enter your contact';
        break;
      case 5: // Reason
        if (!formData.reason) newErrors.reason = 'Please select a reason';
        break;
      case 6: // Address
        if (!formData.address.trim()) newErrors.address = 'Please enter your address';
        break;
      case 8: // Selfie
        if (!formData.selfie) {
          setErrors({ selfie: 'Please upload a selfie' as any });
          return false;
        }
        break;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors as any);
      return false;
    }
    return true;
  }, [currentSlide, formData]);

  const nextSlide = useCallback(() => {
    if (!validateCurrentSlide()) return;
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  }, [currentSlide, validateCurrentSlide]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  }, [currentSlide]);

  const handleSubmit = useCallback(async () => {
    if (!validateCurrentSlide()) return;
    
    setIsSubmitting(true);
    
    try {
      // Convert file to base64
      const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      };

      const selfieBase64 = formData.selfie ? await fileToBase64(formData.selfie) : '';

      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('contact', formData.contact);
      submitData.append('reason', formData.reason);
      submitData.append('address', formData.address);
      submitData.append('message', formData.message);
      submitData.append('selfie', selfieBase64);

      // Submit to Google Apps Script
      await fetch(
        'https://script.google.com/macros/s/AKfycby3PqtLaQ2aWsN4faW55lVkYzz_pxgk1vs3JalxOh8ZzS9dfS0NahXYnh_m4fFex-6D7Q/exec',
        {
          method: 'POST',
          body: submitData,
          mode: 'no-cors',
        }
      );

      setCurrentSlide(9); // Go to password slide
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateCurrentSlide]);

  const checkPassword = useCallback(() => {
    if (password === 'Nicetomeetyou') {
      setPasswordError('');
      setCurrentSlide(10); // Go to reveal slide
    } else {
      setPasswordError('Incorrect password. Try again!');
      setShowShake(true);
      setTimeout(() => setShowShake(false), 400);
    }
  }, [password]);

  if (showVideo) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <video
          ref={videoRef}
          className="w-full h-full object-cover opacity-30"
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnd}
        >
          <source src="/clip.mp4" type="video/mp4" />
        </video>
        <button
          onClick={() => setShowVideo(false)}
          className="absolute bottom-8 right-8 px-6 py-3 rounded-full bg-primary/20 text-primary border border-primary/30 font-body text-sm hover:bg-primary/30 transition-colors"
        >
          Skip Intro
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ParticleBackground />
      
      {/* Space gradient overlays */}
      <div className="fixed inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/8 via-transparent to-transparent pointer-events-none" />

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8 sm:py-12">
        {currentSlide > 0 && currentSlide < 9 && (
          <ProgressIndicator currentStep={currentSlide - 1} totalSteps={8} />
        )}

        {/* Slide 0: Welcome */}
        <SlideCard isActive={currentSlide === 0}>
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-foreground">
              Hello There
            </h1>
            <p className="text-lg text-muted-foreground font-body leading-relaxed max-w-md mx-auto">
              Hi Aditya, welcome! If you're seeing this, congratulations—you are officially part of my close friends list.
            </p>
            <NavigationButtons
              onNext={nextSlide}
              showPrev={false}
              nextLabel="Begin"
            />
          </div>
        </SlideCard>

        {/* Slide 1: Disclaimer (CRT style) */}
        <SlideCard isActive={currentSlide === 1} variant="crt">
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-display font-semibold text-primary text-center mb-8">
              Important Notice
            </h2>
            <div className="text-sm sm:text-base text-foreground/90 leading-relaxed">
              <TypewriterText text={DISCLAIMER_TEXT} speed={25} />
            </div>
            <NavigationButtons onPrev={prevSlide} onNext={nextSlide} />
          </div>
        </SlideCard>

        {/* Slide 2: Smile */}
        <SlideCard isActive={currentSlide === 2}>
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
              <Heart className="w-10 h-10 text-primary animate-pulse" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-semibold text-foreground">
              First Things First
            </h2>
            <p className="text-lg text-muted-foreground font-body">
              Take a moment and smile... 😊
            </p>
            <NavigationButtons onPrev={prevSlide} onNext={nextSlide} />
          </div>
        </SlideCard>

        {/* Slide 3: Name */}
        <SlideCard isActive={currentSlide === 3}>
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-display font-semibold text-foreground text-center">
              What's Your Name?
            </h2>
            <FormInput
              label="Full Name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => updateFormData('name', e.target.value)}
              error={errors.name as string}
            />
            <NavigationButtons onPrev={prevSlide} onNext={nextSlide} />
          </div>
        </SlideCard>

        {/* Slide 4: Contact */}
        <SlideCard isActive={currentSlide === 4}>
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-display font-semibold text-foreground text-center">
              How Can We Reach You?
            </h2>
            <FormInput
              label="Phone or Email"
              placeholder="Your contact info"
              value={formData.contact}
              onChange={(e) => updateFormData('contact', e.target.value)}
              error={errors.contact as string}
            />
            <NavigationButtons onPrev={prevSlide} onNext={nextSlide} />
          </div>
        </SlideCard>

        {/* Slide 5: Reason */}
        <SlideCard isActive={currentSlide === 5}>
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-display font-semibold text-foreground text-center">
              Why Did You Scan This?
            </h2>
            <FormRadioGroup
              options={REASON_OPTIONS}
              value={formData.reason}
              onChange={(value) => updateFormData('reason', value)}
              error={errors.reason as string}
            />
            <NavigationButtons onPrev={prevSlide} onNext={nextSlide} />
          </div>
        </SlideCard>

        {/* Slide 6: Address */}
        <SlideCard isActive={currentSlide === 6}>
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-display font-semibold text-foreground text-center">
              Where Should We Send It?
            </h2>
            <FormTextarea
              label="Delivery Address"
              placeholder="Enter your full address"
              value={formData.address}
              onChange={(e) => updateFormData('address', e.target.value)}
              error={errors.address as string}
            />
            <NavigationButtons onPrev={prevSlide} onNext={nextSlide} />
          </div>
        </SlideCard>

        {/* Slide 7: Message */}
        <SlideCard isActive={currentSlide === 7}>
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-display font-semibold text-foreground text-center">
              Leave a Message
            </h2>
            <p className="text-sm text-muted-foreground text-center font-body">
              Optional: Share anything you'd like to say
            </p>
            <FormTextarea
              placeholder="Your message (optional)"
              value={formData.message}
              onChange={(e) => updateFormData('message', e.target.value)}
            />
            <NavigationButtons onPrev={prevSlide} onNext={nextSlide} />
          </div>
        </SlideCard>

        {/* Slide 8: Selfie Upload */}
        <SlideCard isActive={currentSlide === 8}>
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-display font-semibold text-foreground text-center">
              One Last Thing
            </h2>
            <p className="text-sm text-muted-foreground text-center font-body">
              Upload a nice selfie of yourself
            </p>
            <FileUpload
              value={formData.selfie}
              onChange={(file) => setFormData(prev => ({ ...prev, selfie: file }))}
              error={typeof errors.selfie === 'string' ? errors.selfie : undefined}
            />
            <NavigationButtons
              onPrev={prevSlide}
              onSubmit={handleSubmit}
              showNext={false}
              showSubmit
              isLoading={isSubmitting}
            />
          </div>
        </SlideCard>

        {/* Slide 9: Password */}
        <SlideCard isActive={currentSlide === 9}>
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-semibold text-foreground">
              Enter the Secret Password
            </h2>
            <p className="text-sm text-muted-foreground font-body">
              You'll receive the password soon
            </p>
            <div className={cn(showShake && "animate-shake")}>
              <FormInput
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError('');
                }}
                error={passwordError}
              />
            </div>
            <button
              onClick={checkPassword}
              className="w-full py-3 rounded-full bg-primary text-primary-foreground font-body font-medium hover:bg-primary/90 transition-colors glow-star"
            >
              Unlock
            </button>
          </div>
        </SlideCard>

        {/* Slide 10: Reveal */}
        <SlideCard isActive={currentSlide === 10}>
          <div className="space-y-8 text-center py-8">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center animate-pulse-glow">
              <PartyPopper className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-gradient">
              Surprise Date Revealed!
            </h2>
            <div className="inline-block px-8 py-4 rounded-2xl bg-primary/10 border border-primary/30">
              <p className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-primary">
                25/01/2026
              </p>
            </div>
            <p className="text-muted-foreground font-body max-w-md mx-auto">
              Mark this date! Something special awaits you.
            </p>
          </div>
        </SlideCard>
      </main>
    </div>
  );
};

export default Index;
