import React from "react";
import { useReferralsTranslations } from "@/hooks/use-referrals-translations";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";
import { formatExactCurrency } from "@/lib/utils";

interface Testimonial {
  id: number;
  name: string;
  initial: string;
  role: string;
  content: string;
  stats: {
    referrals: number;
    earned: string;
  };
  rating: number;
}

const SuccessStories: React.FC = () => {
  const rt = useReferralsTranslations();
  
  // Definir testimonios de usuarios exitosos (estos son ficticios para ilustrar)
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Carlos M.",
      initial: "C",
      role: rt.enterpriseInvestor,
      content: "He referido a 15 colegas a WayBank y ahora estoy ganando un ingreso pasivo constante de sus actividades. ¡La comisión del 1% se acumula rápidamente cuando traes inversores activos!",
      stats: {
        referrals: 15,
        earned: "950.00"
      },
      rating: 5
    },
    {
      id: 2,
      name: "Mariana R.",
      initial: "M",
      role: rt.cryptoEnthusiast,
      content: "El programa de referidos me convirtió en defensora de WayBank. Mis amigos están felices con su impulso de APR del 1%, y estoy encantada con mi creciente flujo de ingresos pasivos.",
      stats: {
        referrals: 8,
        earned: "420.50"
      },
      rating: 5
    },
    {
      id: 3,
      name: "Alejandro T.",
      initial: "A",
      role: rt.financialAdvisor,
      content: "Como asesor financiero, recomiendo WayBank a mis clientes. El sistema de referidos es transparente y ambas partes se benefician. Es una relación ganar-ganar que sigue creciendo.",
      stats: {
        referrals: 23,
        earned: "1370.25"
      },
      rating: 4
    }
  ];
  
  // Función para renderizar estrellas de valoración
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={14}
        className={`${
          index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold">{rt.successStoryTitle}</h2>
        <p className="text-muted-foreground">
          {rt.successStoryDescription}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {testimonials.map((testimonial) => (
          <Card 
            key={testimonial.id} 
            className="overflow-hidden border-primary/10 transition-all duration-300 hover:shadow-md"
          >
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10 bg-primary/10 text-primary border border-primary/20">
                  <AvatarFallback>{testimonial.initial}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <div className="flex mt-1">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <Quote className="absolute -top-1 -left-1 h-4 w-4 text-primary/20" />
                <blockquote className="pl-4 pt-3 text-sm text-muted-foreground italic">
                  "{testimonial.content}"
                </blockquote>
              </div>
              
              <div className="bg-primary/5 rounded-lg p-3 border border-primary/10 mt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">{rt.referredUsers2}</p>
                    <p className="font-bold text-lg">{testimonial.stats.referrals}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{rt.totalEarned}</p>
                    <p className="font-bold text-lg">{formatExactCurrency(testimonial.stats.earned, "USD")}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="mt-8 border-primary/10 bg-gradient-to-br from-primary/5 to-background">
        <CardContent className="py-6 px-6 sm:px-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="md:flex-1">
              <h3 className="text-xl font-semibold mb-2">{rt.yourSuccessStoryAwaits}</h3>
              <p className="text-muted-foreground">
                {rt.joinCommunity}
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="bg-primary/10 text-primary w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                  <span className="text-sm">{rt.noLimitUsers}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary/10 text-primary w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                  <span className="text-sm">{rt.earningsGrow}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary/10 text-primary w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                  <span className="text-sm">{rt.passiveIncomeContinues}</span>
                </li>
              </ul>
            </div>
            
            <div className="flex-shrink-0 bg-primary/10 p-4 rounded-xl border border-primary/20">
              <div className="text-center px-4">
                <p className="text-lg font-bold mb-1">{rt.averageEarnings}</p>
                <div className="text-3xl font-bold text-primary">
                  {formatExactCurrency("750", "USD")}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {rt.perYearWithActive}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuccessStories;