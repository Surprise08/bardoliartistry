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
import RotationPrompt from '@/components/RotationPrompt';
import { Lock, PartyPopper } from 'lucide-react';
import { cn } from '@/lib/utils';

const DISCLAIMER_TEXT = `PLEASE READ CAREFULLY...

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
    // Auto-skip video after 100ms if no video source
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
      case 3:
        if (!formData.name.trim()) newErrors.name = 'Please enter your name';
        break;
      case 4:
        if (!formData.contact.trim()) newErrors.contact = 'Please enter your contact';
        break;
      case 5:
        if (!formData.reason) newErrors.reason = 'Please select a reason';
        break;
      case 6:
        if (!formData.address.trim()) newErrors.address = 'Please enter your address';
        break;
      case 8:
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

      await fetch(
        'https://script.google.com/macros/s/AKfycby3PqtLaQ2aWsN4faW55lVkYzz_pxgk1vs3JalxOh8ZzS9dfS0NahXYnh_m4fFex-6D7Q/exec',
        {
          method: 'POST',
          body: submitData,
          mode: 'no-cors',
        }
      );

      setCurrentSlide(9);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateCurrentSlide]);

  const checkPassword = useCallback(() => {
    if (password === 'Nicetomeetyou') {
      setPasswordError('');
      setCurrentSlide(10);
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
          className="w-full h-full object-cover opacity-20"
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnd}
        >
          <source src="/clip.mp4" type="video/mp4" />
        </video>
        <button
          onClick={() => setShowVideo(false)}
          className="absolute bottom-8 right-8 px-6 py-3 rounded-lg bg-secondary/50 text-foreground/70 border border-border/30 font-body text-sm uppercase tracking-wider hover:bg-secondary/70 transition-colors"
        >
          Skip
        </button>
      </div>
    );
  }

  return (
    <>
      <RotationPrompt />
      
      <div className="landscape-only min-h-screen bg-background relative overflow-hidden">
        <ParticleBackground />

        <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8 sm:py-12">
          {currentSlide > 0 && currentSlide < 9 && currentSlide !== 1 && (
            <ProgressIndicator currentStep={currentSlide - 1} totalSteps={8} />
          )}

          {/* Slide 0: Welcome */}
          <SlideCard isActive={currentSlide === 0}>
            <div className="text-center space-y-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-normal text-foreground uppercase tracking-widest">
                Hello
              </h1>
              <p className="text-base text-muted-foreground font-body leading-relaxed max-w-md mx-auto">
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
              <h2 className="text-xl sm:text-2xl font-display font-normal text-foreground/90 text-center uppercase tracking-[0.3em] mb-8">
                Important Notice
              </h2>
              <div className="text-sm sm:text-base text-foreground/80 leading-relaxed max-h-[40vh] overflow-y-auto pr-4">
                <TypewriterText text={DISCLAIMER_TEXT} speed={20} />
              </div>
              <div className="flex justify-between pt-6 border-t border-border/20">
                <button
                  onClick={prevSlide}
                  className="px-6 py-3 text-sm font-body uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={nextSlide}
                  className="px-6 py-3 text-sm font-body uppercase tracking-wider bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors"
                >
                  I Understand
                </button>
              </div>
            </div>
          </SlideCard>

          {/* Slide 2: Smile */}
          <SlideCard isActive={currentSlide === 2}>
            <div className="text-center space-y-6">
              <h2 className="text-2xl sm:text-3xl font-display font-normal text-foreground uppercase tracking-widest">
                First Things First
              </h2>
              <p className="text-lg text-muted-foreground font-body">
                Take a moment and smile...
              </p>
              <NavigationButtons onPrev={prevSlide} onNext={nextSlide} />
            </div>
          </SlideCard>

          {/* Slide 3: Name */}
          <SlideCard isActive={currentSlide === 3}>
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-display font-normal text-foreground text-center uppercase tracking-widest">
                Your Name
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
              <h2 className="text-2xl sm:text-3xl font-display font-normal text-foreground text-center uppercase tracking-widest">
                Contact
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
              <h2 className="text-2xl sm:text-3xl font-display font-normal text-foreground text-center uppercase tracking-widest">
                Why Did You Scan?
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
              <h2 className="text-2xl sm:text-3xl font-display font-normal text-foreground text-center uppercase tracking-widest">
                Delivery Address
              </h2>
              <FormTextarea
                label="Address"
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
              <h2 className="text-2xl sm:text-3xl font-display font-normal text-foreground text-center uppercase tracking-widest">
                Message
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
              <h2 className="text-2xl sm:text-3xl font-display font-normal text-foreground text-center uppercase tracking-widest">
                Selfie
              </h2>
              <p className="text-sm text-muted-foreground text-center font-body">
                Upload a nice photo of yourself
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
              <div className="w-14 h-14 mx-auto rounded-full bg-secondary/30 border border-border/30 flex items-center justify-center">
                <Lock className="w-6 h-6 text-muted-foreground" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-normal text-foreground uppercase tracking-widest">
                Secret Password
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
                className="w-full py-3 rounded-lg bg-foreground text-background font-body font-medium uppercase tracking-wider hover:bg-foreground/90 transition-colors"
              >
                Unlock
              </button>
            </div>
          </SlideCard>

          {/* Slide 10: Reveal */}
          <SlideCard isActive={currentSlide === 10}>
            <div className="space-y-8 text-center py-8">
              <div className="w-20 h-20 mx-auto rounded-full bg-secondary/30 border border-accent/30 flex items-center justify-center glow-tiffany">
                <PartyPopper className="w-10 h-10 text-accent" />
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-normal text-foreground uppercase tracking-widest">
                Date Revealed
              </h2>
              <div className="inline-block px-8 py-4 rounded-lg bg-secondary/30 border border-accent/30">
                <p className="text-4xl sm:text-5xl lg:text-6xl font-display font-normal text-accent">
                  25/01/2026
                </p>
              </div>
              <p className="text-muted-foreground font-body max-w-md mx-auto">
                Mark this date. Something special awaits.
              </p>
            </div>
          </SlideCard>
        </main>
      </div>
    </>
  );
};

export default Index;
