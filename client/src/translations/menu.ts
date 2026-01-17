/**
 * Traducciones para la navegación y menús del dashboard
 */

import { Language } from "@/context/language-context";
import { useLanguage } from "@/context/language-context";

// Interfaz para las traducciones de menús
export interface MenuTranslations {
  // Menú principal
  dashboard: string;
  myPositions: string;
  myNFTs: string;
  transfers: string;
  addLiquidity: string;
  analytics: string;
  pools: string;
  invoices: string;
  referrals: string;
  settings: string;
  support: string;
  superAdmin: string;
  
  // Footer y controles
  darkMode: string;
  network: string;
}

// Traducciones en Español
const es: MenuTranslations = {
  dashboard: "Panel",
  myPositions: "Mis Posiciones",
  myNFTs: "Mis NFTs",
  transfers: "Transferencias",
  addLiquidity: "Añadir Liquidez",
  analytics: "Analítica",
  pools: "Pools",
  invoices: "Facturas",
  referrals: "Referidos",
  settings: "Ajustes",
  support: "Soporte",
  superAdmin: "SuperAdmin",
  
  darkMode: "Modo Oscuro",
  network: "Red"
};

// Traducciones en Inglés
const en: MenuTranslations = {
  dashboard: "Dashboard",
  myPositions: "My Positions",
  myNFTs: "My NFTs",
  transfers: "Transfers",
  addLiquidity: "Add Liquidity",
  analytics: "Analytics",
  pools: "Pools",
  invoices: "Invoices",
  referrals: "Referrals",
  settings: "Settings",
  support: "Support",
  superAdmin: "SuperAdmin",
  
  darkMode: "Dark Mode",
  network: "Network"
};

// Traducciones en Italiano
const it: MenuTranslations = {
  dashboard: "Pannello",
  myPositions: "Le Mie Posizioni",
  myNFTs: "I Miei NFT",
  transfers: "Trasferimenti",
  addLiquidity: "Aggiungi Liquidità",
  analytics: "Analisi",
  pools: "Pool",
  invoices: "Fatture",
  referrals: "Referral",
  settings: "Impostazioni",
  support: "Supporto",
  superAdmin: "SuperAdmin",
  
  darkMode: "Modalità Scura",
  network: "Rete"
};

// Traducciones en Portugués
const pt: MenuTranslations = {
  dashboard: "Painel",
  myPositions: "Minhas Posições",
  myNFTs: "Meus NFTs",
  transfers: "Transferências",
  addLiquidity: "Adicionar Liquidez",
  analytics: "Analíticas",
  pools: "Pools",
  invoices: "Faturas",
  referrals: "Indicações",
  settings: "Configurações",
  support: "Suporte",
  superAdmin: "SuperAdmin",
  
  darkMode: "Modo Escuro",
  network: "Rede"
};

// Traducciones en Alemán
const de: MenuTranslations = {
  dashboard: "Dashboard",
  myPositions: "Meine Positionen",
  myNFTs: "Meine NFTs",
  transfers: "Überweisungen",
  addLiquidity: "Liquidität Hinzufügen",
  analytics: "Analytik",
  pools: "Pools",
  invoices: "Rechnungen",
  referrals: "Empfehlungen",
  settings: "Einstellungen",
  support: "Support",
  superAdmin: "SuperAdmin",
  
  darkMode: "Dunkelmodus",
  network: "Netzwerk"
};

// Traducciones en Francés
const fr: MenuTranslations = {
  dashboard: "Tableau de Bord",
  myPositions: "Mes Positions",
  myNFTs: "Mes NFT",
  transfers: "Transferts",
  addLiquidity: "Ajouter Liquidité",
  analytics: "Analytiques",
  pools: "Pools",
  invoices: "Factures",
  referrals: "Parrainages",
  settings: "Paramètres",
  support: "Support",
  superAdmin: "SuperAdmin",
  
  darkMode: "Mode Sombre",
  network: "Réseau"
};

// Traducciones en Hindi
const hi: MenuTranslations = {
  dashboard: "डैशबोर्ड",
  myPositions: "मेरी स्थितियां",
  myNFTs: "मेरे NFT",
  transfers: "स्थानांतरण",
  addLiquidity: "तरलता जोड़ें",
  analytics: "विश्लेषण",
  pools: "पूल",
  invoices: "चालान",
  referrals: "रेफरल",
  settings: "सेटिंग्स",
  support: "सहायता",
  superAdmin: "सुपरएडमिन",
  
  darkMode: "डार्क मोड",
  network: "नेटवर्क"
};

// Traducciones en Chino (Simplificado)
const zh: MenuTranslations = {
  dashboard: "仪表板",
  myPositions: "我的持仓",
  myNFTs: "我的NFT",
  transfers: "转账",
  addLiquidity: "添加流动性",
  analytics: "分析",
  pools: "资金池",
  invoices: "发票",
  referrals: "推荐",
  settings: "设置",
  support: "支持",
  superAdmin: "超级管理员",
  
  darkMode: "深色模式",
  network: "网络"
};

// Traducciones en Árabe
const ar: MenuTranslations = {
  dashboard: "لوحة التحكم",
  myPositions: "مراكزي",
  myNFTs: "رموز NFT الخاصة بي",
  transfers: "التحويلات",
  addLiquidity: "إضافة سيولة",
  analytics: "التحليلات",
  pools: "المجمعات",
  invoices: "الفواتير",
  referrals: "الإحالات",
  settings: "الإعدادات",
  support: "الدعم",
  superAdmin: "المشرف الأعلى",
  
  darkMode: "الوضع المظلم",
  network: "الشبكة"
};

// Traducciones en Ruso
const ru: MenuTranslations = {
  dashboard: "Панель",
  myPositions: "Мои Позиции",
  myNFTs: "Мои NFT",
  transfers: "Переводы",
  addLiquidity: "Добавить Ликвидность",
  analytics: "Аналитика",
  pools: "Пулы",
  invoices: "Счета",
  referrals: "Рефералы",
  settings: "Настройки",
  support: "Поддержка",
  superAdmin: "СуперАдмин",
  
  darkMode: "Темный Режим",
  network: "Сеть"
};

// Recopilación de todas las traducciones
const translations: Record<Language, MenuTranslations> = {
  es,
  en,
  it,
  pt,
  de,
  fr,
  hi,
  zh,
  ar,
  ru
};

// Exportación del objeto translations completo para usar en el sistema centralizado
export const menuTranslations = {
  es,
  en,
  it,
  pt,
  de,
  fr,
  hi,
  zh,
  ar,
  ru
};

// Hook para obtener las traducciones del menú
export function useMenuTranslations() {
  // Obtener idioma actual del contexto
  const { language } = useLanguage();
  
  // Obtener las traducciones para el idioma actual o usar inglés como respaldo
  const currentTranslations = translations[language] || translations.en;
  
  // Retornar traducciones
  return currentTranslations;
}