import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Stethoscope, Droplets, FileText, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AddressAutocomplete } from '@/components/AddressAutocomplete';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [address, setAddress] = useState('');
  const [zipcode, setZipcode] = useState('');
  // Patient-specific fields
  const [bloodGroup, setBloodGroup] = useState('');
  const [pastProblems, setPastProblems] = useState('');
  // Doctor-specific fields
  const [specialization, setSpecialization] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast({ title: 'Welcome back!', description: 'You have successfully logged in.' });
        navigate('/dashboard');
      } else {
        const metadata = {
          firstName,
          lastName,
          role,
          zipcode,
          ...(role === 'patient' 
            ? { bloodGroup, pastProblems }
            : { specialization, yearsExperience: parseInt(yearsExperience) || 0 }
          ),
        };
        const { error } = await signUp(email, password, metadata);
        if (error) throw error;
        toast({ 
          title: 'Welcome!', 
          description: 'Your account has been created successfully.' 
        });
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <img src="/assets/logo.jpeg" alt="InstaMed Logo" className="w-10 h-10 rounded-xl object-contain" />
            <span className="text-2xl font-bold text-foreground">InstaMed</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-muted-foreground mb-8">
            {isLogin
              ? 'Sign in to access your health dashboard'
              : 'Start your journey to better healthcare'}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <>
                {/* Role Selection */}
                <div className="space-y-3">
                  <Label>I am signing up as a</Label>
                  <RadioGroup
                    value={role}
                    onValueChange={(value) => setRole(value as 'patient' | 'doctor')}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="relative">
                      <RadioGroupItem
                        value="patient"
                        id="patient"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="patient"
                        className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer transition-colors"
                      >
                        <User className="w-6 h-6" />
                        <span className="font-medium">Patient</span>
                      </Label>
                    </div>
                    <div className="relative">
                      <RadioGroupItem
                        value="doctor"
                        id="doctor"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="doctor"
                        className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer transition-colors"
                      >
                        <Stethoscope className="w-6 h-6" />
                        <span className="font-medium">Doctor</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="pl-10"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="pl-10"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                </div>

                {/* Address with Zipcode autocomplete */}
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <AddressAutocomplete
                    value={address}
                    onChange={setAddress}
                    onZipcodeChange={setZipcode}
                    placeholder="Start typing your address..."
                    required={!isLogin}
                  />
                  {zipcode && (
                    <p className="text-xs text-muted-foreground">
                      Zipcode detected: <span className="font-medium text-foreground">{zipcode}</span>
                    </p>
                  )}
                </div>

                {/* Patient-specific fields */}
                {role === 'patient' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="bloodGroup">Blood Group</Label>
                      <Select value={bloodGroup} onValueChange={setBloodGroup}>
                        <SelectTrigger className="w-full">
                          <div className="flex items-center gap-2">
                            <Droplets className="w-4 h-4 text-muted-foreground" />
                            <SelectValue placeholder="Select blood group" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pastProblems">Past Medical Problems</Label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Textarea
                          id="pastProblems"
                          placeholder="Describe any past medical conditions, surgeries, or ongoing treatments..."
                          value={pastProblems}
                          onChange={(e) => setPastProblems(e.target.value)}
                          className="pl-10 min-h-[80px]"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Doctor-specific fields */}
                {role === 'doctor' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Area of Profession</Label>
                      <Select value={specialization} onValueChange={setSpecialization}>
                        <SelectTrigger className="w-full">
                          <div className="flex items-center gap-2">
                            <Stethoscope className="w-4 h-4 text-muted-foreground" />
                            <SelectValue placeholder="Select specialization" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="General Practice">General Practice</SelectItem>
                          <SelectItem value="Cardiology">Cardiology</SelectItem>
                          <SelectItem value="Dermatology">Dermatology</SelectItem>
                          <SelectItem value="Neurology">Neurology</SelectItem>
                          <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                          <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                          <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                          <SelectItem value="Gynecology">Gynecology</SelectItem>
                          <SelectItem value="Ophthalmology">Ophthalmology</SelectItem>
                          <SelectItem value="ENT">ENT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="yearsExperience">Work Experience (Years)</Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="yearsExperience"
                          type="number"
                          min="0"
                          placeholder="5"
                          value={yearsExperience}
                          onChange={(e) => setYearsExperience(e.target.value)}
                          className="pl-10"
                          required={role === 'doctor'}
                        />
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign in' : 'Create account'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Toggle */}
          <p className="text-center mt-6 text-muted-foreground">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-medium hover:underline"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </motion.div>
      </div>

      {/* Right side - Illustration */}
      <div className="hidden lg:flex flex-1 bg-primary/5 items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-lg text-center"
        >
          <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            <img src="/assets/logo.jpeg" alt="InstaMed Logo" className="w-24 h-24 object-contain" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Your Health, Our Priority
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Connect with qualified doctors, book appointments, and manage your health records - all in one place.
          </p>
          
          {/* Features list */}
          <div className="mt-8 space-y-4 text-left">
            {[
              'Video consultations from anywhere',
              '24/7 access to your health records',
              'Easy appointment scheduling',
              'Secure and private'
            ].map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                  <svg className="w-3 h-3 text-accent-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-foreground">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
