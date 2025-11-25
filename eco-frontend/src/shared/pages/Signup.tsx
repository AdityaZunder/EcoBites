import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/shared/contexts/AuthContext';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Card } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { ThemeToggle } from '@/shared/components/ThemeToggle';
import { Leaf, Loader2 } from 'lucide-react';
import { UserRole } from '@/shared/types';

const Signup = () => {
  const navigate = useNavigate();
  const { user, signup, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(user.role === 'restaurant' ? '/restaurant/dashboard' : '/deals');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await signup(email, password, name, role);
    } catch (error) {
      // Error handled by context
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full gradient-eco flex items-center justify-center">
              <Leaf className="h-6 w-6 text-eco-foreground" />
            </div>
            <h1 className="text-2xl font-bold">EcoBites</h1>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="w-full max-w-md p-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Get Started</h2>
            <p className="text-muted-foreground">Create your account</p>
          </div>

          <Tabs value={role} onValueChange={(v) => setRole(v as UserRole)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="user">User Account</TabsTrigger>
              <TabsTrigger value="restaurant">Restaurant Account</TabsTrigger>
            </TabsList>

            <TabsContent value="user" className="space-y-4">
              <SignupForm
                email={email}
                password={password}
                name={name}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onNameChange={setName}
                onSubmit={handleSubmit}
                isSubmitting={submitting}
                namePlaceholder="Your name"
              />
            </TabsContent>

            <TabsContent value="restaurant" className="space-y-4">
              <SignupForm
                email={email}
                password={password}
                name={name}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onNameChange={setName}
                onSubmit={handleSubmit}
                isSubmitting={submitting}
                namePlaceholder="Restaurant name"
              />
            </TabsContent>
          </Tabs>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

const SignupForm = ({
  email,
  password,
  name,
  onEmailChange,
  onPasswordChange,
  onNameChange,
  onSubmit,
  isSubmitting,
  namePlaceholder,
}: {
  email: string;
  password: string;
  name: string;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onNameChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  namePlaceholder: string;
}) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="name">Name</Label>
      <Input
        id="name"
        type="text"
        placeholder={namePlaceholder}
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        required
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        required
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="password">Password</Label>
      <Input
        id="password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        required
        minLength={6}
      />
    </div>

    <Button type="submit" className="w-full" disabled={isSubmitting}>
      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Create Account
    </Button>
  </form>
);

export default Signup;
