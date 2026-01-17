import React, { useEffect } from 'react';
import { useLanguage } from '@/context/language-context';
import { APP_NAME } from '@/utils/app-config';

interface MetaTagsProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  structuredData?: object;
  alternateLanguages?: Record<string, string>;
}

const languageToLocale: Record<string, string> = {
  en: 'en_US',
  es: 'es_ES',
  fr: 'fr_FR',
  de: 'de_DE',
  it: 'it_IT',
  pt: 'pt_BR',
  ar: 'ar_AE',
  hi: 'hi_IN',
  zh: 'zh_CN'
};

const MetaTags: React.FC<MetaTagsProps> = ({
  title,
  description,
  canonical = '',
  ogImage = '/opengraph-image.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  structuredData,
  alternateLanguages = {}
}) => {
  const { language } = useLanguage();
  const locale = languageToLocale[language] || 'en_US';
  const domain = 'waybank.finance'; // Updated domain to match new brand
  const fullCanonical = canonical ? `https://${domain}${canonical}` : `https://${domain}`;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `https://${domain}${ogImage}`;

  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Helper function to create or update meta tags
    const setMetaTag = (name: string, content: string, property = false) => {
      let meta = document.querySelector(property ? `meta[property="${name}"]` : `meta[name="${name}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };
    
    // Helper function to create or update link tags
    const setLinkTag = (rel: string, href: string, hrefLang?: string) => {
      let selector = `link[rel="${rel}"]`;
      if (hrefLang) {
        selector += `[hrefLang="${hrefLang}"]`;
      }
      
      let link = document.querySelector(selector);
      
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        if (hrefLang) {
          link.setAttribute('hrefLang', hrefLang);
        }
        document.head.appendChild(link);
      }
      
      link.setAttribute('href', href);
    };
    
    // Set basic meta tags
    setMetaTag('description', description);
    setMetaTag('language', language);
    setMetaTag('content-language', language, false);
    // Add a version tag to force cache refresh in production
    setMetaTag('version', new Date().toISOString().split('T')[0]);
    
    // Set OpenGraph tags
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:image', fullOgImage, true);
    setMetaTag('og:url', fullCanonical, true);
    setMetaTag('og:type', ogType, true);
    setMetaTag('og:site_name', APP_NAME, true);
    setMetaTag('og:locale', locale, true);
    
    // Set Twitter Card tags
    setMetaTag('twitter:card', twitterCard);
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', fullOgImage);
    setMetaTag('twitter:site', '@WayBank'); // Updated Twitter handle
    
    // Set canonical URL
    setLinkTag('canonical', fullCanonical);
    
    // Set hreflang tags for language alternatives
    Object.entries(alternateLanguages).forEach(([lang, url]) => {
      const fullUrl = url.startsWith('http') ? url : `https://${domain}${url}`;
      setLinkTag('alternate', fullUrl, lang);
    });
    
    // Set default language tag
    setLinkTag('alternate', `https://${domain}`, 'x-default');
    
    // Set JSON-LD structured data
    if (structuredData) {
      let script = document.querySelector('script[type="application/ld+json"]');
      
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      
      script.textContent = JSON.stringify(structuredData);
    }
    
    // Cleanup function to remove structured data if component unmounts
    return () => {
      if (structuredData) {
        try {
          const script = document.querySelector('script[type="application/ld+json"]');
          // Verificamos que el script exista y que sea hijo de document.head
          if (script && script.parentNode === document.head) {
            document.head.removeChild(script);
          }
        } catch (error) {
          console.warn('[MetaTags] Error al limpiar structured data:', error);
        }
      }
    };
  }, [title, description, canonical, ogImage, ogType, twitterCard, structuredData, alternateLanguages, language]);

  // This component doesn't render anything visible
  return null;
};

export default MetaTags;