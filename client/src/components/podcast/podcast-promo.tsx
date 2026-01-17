import { Headphones, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useLanguage } from "@/context/language-context";
import { getPodcastTranslations } from "@/translations/podcast";

export default function PodcastPromo() {
  const { language } = useLanguage();
  const t = getPodcastTranslations(language);
  
  return (
    <div className="rounded-xl overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <div className="relative p-6 md:p-8">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary opacity-5 rounded-full filter blur-3xl translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500 opacity-5 rounded-full filter blur-3xl -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="relative grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
          {/* Icon/Badge */}
          <div className="hidden md:flex items-center justify-center md:col-span-1">
            <div className="w-24 h-24 rounded-full bg-indigo-950/70 flex items-center justify-center">
              <Headphones className="h-10 w-10 text-primary" />
            </div>
          </div>
          
          {/* Content */}
          <div className="md:col-span-3">
            <div className="flex items-center gap-2 mb-2">
              <Headphones className="h-4 w-4 text-primary md:hidden" />
              <span className="text-xs uppercase tracking-wider text-primary font-medium">{t.newEpisode}</span>
            </div>
            <h3 className="text-xl font-bold mb-2">{t.podcastTitle}</h3>
            <p className="text-muted-foreground mb-4">
              {t.podcastDescription}
            </p>
            <Button asChild variant="outline" className="gap-2">
              <Link href="/podcast">
                {t.listenNow} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          {/* Episode artwork */}
          <div className="hidden md:block md:col-span-1">
            <div className="aspect-square rounded-lg overflow-hidden border border-primary/20 bg-indigo-950/10 flex items-center justify-center shadow-md">
              <div className="text-sm text-center text-muted-foreground p-4">
                <span className="block font-bold text-foreground mb-1">{t.latestEpisode}</span>
                {t.everyThursday}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}