import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Leaf, TrendingUp, Heart, Utensils, ChevronDown } from "lucide-react";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useEffect, useRef, useState } from "react";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'restaurant') {
        navigate('/restaurant/dashboard');
      } else {
        navigate('/deals');
      }
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-background overflow-hidden">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 sm:py-32 text-center relative overflow-hidden perspective-container">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-aurora" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-eco/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-aurora delay-1000" />
          <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-aurora delay-2000" />

          {/* Floating Orbs */}
          <div className="absolute top-20 right-1/3 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-float-delayed" />
          <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-eco/10 rounded-full blur-2xl animate-float" />
        </div>

        <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-block animate-in fade-in zoom-in duration-700 delay-200">
            <Badge
              variant="outline"
              className="px-6 py-2 text-sm font-medium rounded-full border-primary/20 bg-primary/5 text-primary backdrop-blur-sm hover:bg-primary/10 transition-all duration-300 hover:scale-105"
            >
              🌱 A Noble Cause for Smart Savings
            </Badge>
          </div>

          <h1 className="text-fluid-h1 font-heading font-extrabold leading-[1.1] tracking-tight text-foreground animate-in slide-up-fade duration-1000 delay-300">
            Premium Surplus.
            <br />
            <span className="text-gradient animate-shimmer bg-[length:200%_auto]">
              Unbeatable Prices.
            </span>
            <br />
            <span className="text-gradient-eco animate-shimmer bg-[length:200%_auto] [animation-delay:1s]">
              Zero Waste.
            </span>
          </h1>

          <p className="text-fluid-p text-muted-foreground max-w-3xl mx-auto px-4 leading-relaxed font-light animate-in slide-up-fade duration-1000 delay-500">
            Access high-quality surplus food from top restaurants and households.
            <span className="font-medium text-foreground"> It's not just leftovers—it's delicious food waiting to be enjoyed.</span>
            <br className="hidden sm:block" />
            Turn excess into opportunity and help the planet.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8 animate-in slide-up-fade duration-1000 delay-700">
            <Link to="/signup" className="w-full sm:w-auto">
              <MagneticButton variant="primary">
                Start Ordering Today
                <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1" />
              </MagneticButton>
            </Link>
            <Link to="/login?role=restaurant" className="w-full sm:w-auto">
              <MagneticButton variant="outline">
                List Your Surplus
              </MagneticButton>
            </Link>
          </div>
        </div>

      </section>

      {/* Value Proposition Section */}
      <section className="container mx-auto px-4 py-24 relative">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 animate-in slide-up-fade duration-1000">
          <h2 className="text-fluid-h2 font-heading font-bold tracking-tight">Why EcoBites?</h2>
          <p className="text-xl text-muted-foreground">
            We bridge the gap between surplus and savings, creating value for everyone.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Utensils className="h-8 w-8 text-primary" />}
            title="Quality Surplus"
            description="Perfectly good, high-quality food that simply wasn't sold. Never compromise on taste."
            delay={100}
          />
          <FeatureCard
            icon={<TrendingUp className="h-8 w-8 text-primary" />}
            title="Smart Analytics"
            description="Restaurants & households can analyze surplus trends to monetize excess and boost revenue."
            delay={200}
          />
          <FeatureCard
            icon={<Heart className="h-8 w-8 text-eco" />}
            title="A Noble Cause"
            description="Join a movement that values resources. Saving food means saving the environment."
            delay={300}
          />
          <FeatureCard
            icon={<Leaf className="h-8 w-8 text-primary" />}
            title="For Everyone"
            description="Whether you're a restaurant or a household with extra, turn your surplus into someone's meal."
            delay={400}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24 mb-12">
        <div className="glass-premium rounded-[2.5rem] p-10 sm:p-16 text-center space-y-8 relative overflow-hidden border-primary/10 gradient-border-hover">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-eco/5 pointer-events-none" />

          <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
            <h2 className="text-fluid-h2 font-heading font-bold tracking-tight text-foreground">
              Don't let good food go to waste.
            </h2>
            <p className="text-xl sm:text-2xl text-muted-foreground font-light">
              Join the community that's turning surplus into savings and sustainability.
            </p>
            <div className="pt-4">
              <Link to="/signup">
                <Button
                  size="lg"
                  className="text-lg px-12 h-16 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-foreground text-background hover:bg-foreground/90 btn-ripple glow-hover group"
                >
                  Start Ordering
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Magnetic Button Component
const MagneticButton = ({
  children,
  variant = "primary"
}: {
  children: React.ReactNode;
  variant?: "primary" | "outline";
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;

    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    setMousePosition({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <Button
      ref={btnRef}
      size="lg"
      variant={variant === "outline" ? "outline" : "default"}
      className={`
        w-full sm:w-auto text-lg px-10 h-16 rounded-2xl
        transition-all duration-300 btn-magnetic group
        ${variant === "primary"
          ? "shadow-premium hover:shadow-premium-hover bg-primary hover:bg-primary/90"
          : "border-2 hover:bg-secondary/50 hover:border-primary/20"
        }
      `}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(1.05)`,
      }}
    >
      {children}
    </Button>
  );
};

// Enhanced Feature Card with 3D Tilt
const FeatureCard = ({
  icon,
  title,
  description,
  delay
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateStyle, setRotateStyle] = useState({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setRotateStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`,
    });
  };

  const handleMouseLeave = () => {
    setRotateStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    });
  };

  return (
    <div
      ref={cardRef}
      className="glass-card p-8 rounded-3xl space-y-5 animate-in fade-in slide-in-from-bottom-8 fill-mode-backwards group h-full border border-border/50 gradient-border-hover tilt-card"
      style={{
        animationDelay: `${delay}ms`,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.3s ease-out, border 0.3s ease',
        ...rotateStyle,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="h-16 w-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-2 transition-all duration-500 group-hover:bg-primary/10 group-hover:rotate-3 glow-hover tilt-content">
        {icon}
      </div>
      <h3 className="text-2xl font-bold tracking-tight text-foreground tilt-content">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-lg tilt-content">{description}</p>
    </div>
  );
};

export default Index;