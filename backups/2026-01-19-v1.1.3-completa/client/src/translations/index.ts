// Sistema centralizado de traducciones
// Centralizado de todos los archivos de traducción
import { addLiquidityTranslations } from './add-liquidity';
import { algorithmTranslations } from './algorithm';
import { analyticsTranslations } from './analytics';
import { dashboardTranslations } from './dashboard';
import { howItWorksTranslations } from './how-it-works';
import { landingTranslations } from './landing';
import { legalTermsTranslations } from './legal-terms';
import { menuTranslations as importedMenuTranslations } from './menu';
import { nftsTranslations } from './nfts';
import { podcastTranslations } from './podcast';
import { positionsTranslations } from './positions';
import { 
  es as referralsEs, 
  en as referralsEn, 
  fr as referralsFr, 
  de as referralsDe,
  pt as referralsPt,
  it as referralsIt,
  zh as referralsZh,
  hi as referralsHi,
  ar as referralsAr,
  ru as referralsRu
} from './referrals';
import { settingsTranslations as importedSettingsTranslations } from './settings';
import { supportTranslations as importedSupportTranslations } from './support';
import { transfersTranslations } from './transfers';

// Lista de idiomas soportados
export const SUPPORTED_LANGUAGES = {
    es: 'Español',
    en: 'English',
    fr: 'Français',
    de: 'Deutsch',
    pt: 'Português',
    it: 'Italiano',
    zh: '中文',
    hi: 'हिन्दी',
    ar: 'العربية',
    ru: 'Русский'
};

export type Language = keyof typeof SUPPORTED_LANGUAGES;

// Construir objeto de traducciones para referrals
const referralsTranslations = {
  es: referralsEs,
  en: referralsEn,
  fr: referralsFr,
  de: referralsDe,
  pt: referralsPt,
  it: referralsIt,
  zh: referralsZh,
  hi: referralsHi,
  ar: referralsAr,
  ru: referralsRu
};

// Usar las importaciones para estos objetos de traducción
const menuTranslations = importedMenuTranslations;
const settingsTranslations = importedSettingsTranslations;
const supportTranslations = importedSupportTranslations;

// Objeto que contiene todas las traducciones
export const translations = {
  addLiquidity: addLiquidityTranslations,
  algorithm: algorithmTranslations,
  analytics: analyticsTranslations,
  dashboard: dashboardTranslations,
  howItWorks: howItWorksTranslations,
  landing: landingTranslations,
  legalTerms: legalTermsTranslations,
  menu: menuTranslations,
  nfts: nftsTranslations,
  podcast: podcastTranslations,
  positions: positionsTranslations,
  referrals: referralsTranslations,
  settings: settingsTranslations,
  support: supportTranslations,
  transfers: transfersTranslations,
};

// Función para verificar si faltan traducciones
export function checkMissingTranslations() {
  const missingTranslations: Record<string, Record<string, string[]>> = {};
  
  // Para cada sección de traducciones
  Object.entries(translations).forEach(([sectionName, section]) => {
    // Para cada idioma
    Object.keys(SUPPORTED_LANGUAGES).forEach(lang => {
      if (!section[lang as Language]) {
        if (!missingTranslations[sectionName]) {
          missingTranslations[sectionName] = {};
        }
        missingTranslations[sectionName][lang] = ['entire language missing'];
        return;
      }
      
      // Si es un idioma implementado, verifica cada clave
      const referenceLanguage = section['en']; // Usamos inglés como referencia
      if (referenceLanguage) {
        const missingKeys: string[] = [];
        
        Object.keys(referenceLanguage).forEach(key => {
          if (!(key in section[lang as Language])) {
            missingKeys.push(key);
          }
        });
        
        if (missingKeys.length > 0) {
          if (!missingTranslations[sectionName]) {
            missingTranslations[sectionName] = {};
          }
          missingTranslations[sectionName][lang] = missingKeys;
        }
      }
    });
  });
  
  return missingTranslations;
}

// Función para registrar y actualizar traducciones
export function registerTranslation(
  sectionName: string, 
  translations: Record<string, any>
) {
  (window as any).__translations = {
    ...(window as any).__translations || {},
    [sectionName]: translations
  };
  
  // Devuelve true si todas las traducciones están completas,
  // o false si hay alguna incompleta
  const missingTranslations = checkMissingTranslations();
  const hasMissing = Object.keys(missingTranslations).length > 0;
  return !hasMissing;
}

// Herramienta para devolver palabras comunes traducidas
export const commonWords = {
  es: {
    loading: 'Cargando',
    error: 'Error',
    success: 'Éxito',
    save: 'Guardar',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    back: 'Volver',
    next: 'Siguiente',
    yes: 'Sí',
    no: 'No',
    search: 'Buscar',
    filter: 'Filtrar',
    all: 'Todos',
    none: 'Ninguno',
    edit: 'Editar',
    delete: 'Eliminar',
    add: 'Añadir',
    create: 'Crear',
    update: 'Actualizar',
    details: 'Detalles',
    more: 'Más',
    less: 'Menos',
    view: 'Ver',
    close: 'Cerrar',
    open: 'Abrir',
  },
  en: {
    loading: 'Loading',
    error: 'Error',
    success: 'Success',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    yes: 'Yes',
    no: 'No',
    search: 'Search',
    filter: 'Filter',
    all: 'All',
    none: 'None',
    edit: 'Edit',
    delete: 'Delete',
    add: 'Add',
    create: 'Create',
    update: 'Update',
    details: 'Details',
    more: 'More',
    less: 'Less',
    view: 'View',
    close: 'Close',
    open: 'Open',
  },
  fr: {
    loading: 'Chargement',
    error: 'Erreur',
    success: 'Succès',
    save: 'Enregistrer',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    back: 'Retour',
    next: 'Suivant',
    yes: 'Oui',
    no: 'Non',
    search: 'Rechercher',
    filter: 'Filtrer',
    all: 'Tous',
    none: 'Aucun',
    edit: 'Modifier',
    delete: 'Supprimer',
    add: 'Ajouter',
    create: 'Créer',
    update: 'Mettre à jour',
    details: 'Détails',
    more: 'Plus',
    less: 'Moins',
    view: 'Voir',
    close: 'Fermer',
    open: 'Ouvrir',
  },
  de: {
    loading: 'Wird geladen',
    error: 'Fehler',
    success: 'Erfolg',
    save: 'Speichern',
    cancel: 'Abbrechen',
    confirm: 'Bestätigen',
    back: 'Zurück',
    next: 'Weiter',
    yes: 'Ja',
    no: 'Nein',
    search: 'Suchen',
    filter: 'Filtern',
    all: 'Alle',
    none: 'Keine',
    edit: 'Bearbeiten',
    delete: 'Löschen',
    add: 'Hinzufügen',
    create: 'Erstellen',
    update: 'Aktualisieren',
    details: 'Details',
    more: 'Mehr',
    less: 'Weniger',
    view: 'Ansehen',
    close: 'Schließen',
    open: 'Öffnen',
  },
  pt:{
    loading: 'Carregando',
    error: 'Erro',
    success: 'Sucesso',
    save: 'Salvar',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    back: 'Voltar',
    next: 'Próximo',
    yes: 'Sim',
    no: 'Não',
    search: 'Buscar',
    filter: 'Filtrar',
    all: 'Todos',
    none: 'Nenhum',
    edit: 'Editar',
    delete: 'Excluir',
    add: 'Adicionar',
    create: 'Criar',
    update: 'Atualizar',
    details: 'Detalhes',
    more: 'Mais',
    less: 'Menos',
    view: 'Ver',
    close: 'Fechar',
    open: 'Abrir'
  },
  ru: {
    loading: 'Загрузка',
    error: 'Ошибка',
    success: 'Успех',
    save: 'Сохранить',
    cancel: 'Отмена',
    confirm: 'Подтвердить',
    back: 'Назад',
    next: 'Далее',
    yes: 'Да',
    no: 'Нет',
    search: 'Поиск',
    filter: 'Фильтр',
    all: 'Все',
    none: 'Ничего',
    edit: 'Редактировать',
    delete: 'Удалить',
    add: 'Добавить',
    create: 'Создать',
    update: 'Обновить',
    details: 'Подробнее',
    more: 'Больше',
    less: 'Меньше',
    view: 'Просмотр',
    close: 'Закрыть',
    open: 'Открыть',
  },
  zh: {
    loading: '加载中',
    error: '错误',
    success: '成功',
    save: '保存',
    cancel: '取消',
    confirm: '确认',
    back: '返回',
    next: '下一步',
    yes: '是',
    no: '否',
    search: '搜索',
    filter: '筛选',
    all: '所有',
    none: '无',
    edit: '编辑',
    delete: '删除',
    add: '添加',
    create: '创建',
    update: '更新',
    details: '详情',
    more: '更多',
    less: '更少',
    view: '查看',
    close: '关闭',
    open: '打开',
  },
  hi: {
    loading: 'लोड हो रहा है',
    error: 'त्रुटि',
    success: 'सफलता',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    confirm: 'पुष्टि करें',
    back: 'वापस',
    next: 'अगला',
    yes: 'हाँ',
    no: 'नहीं',
    search: 'खोजें',
    filter: 'फ़िल्टर करें',
    all: 'सभी',
    none: 'कोई नहीं',
    edit: 'संपादित करें',
    delete: 'मिटाएँ',
    add: 'जोड़ें',
    create: 'बनाएँ',
    update: 'अपडेट करें',
    details: 'विवरण',
    more: 'अधिक',
    less: 'कम',
    view: 'देखें',
    close: 'बंद करें',
    open: 'खोलें',
  },
  ar: {
    loading: 'جار التحميل',
    error: 'خطأ',
    success: 'نجاح',
    save: 'حفظ',
    cancel: 'إلغاء',
    confirm: 'تأكيد',
    back: 'رجوع',
    next: 'التالي',
    yes: 'نعم',
    no: 'لا',
    search: 'بحث',
    filter: 'تصفية',
    all: 'الكل',
    none: 'لا شيء',
    edit: 'تعديل',
    delete: 'حذف',
    add: 'إضافة',
    create: 'إنشاء',
    update: 'تحديث',
    details: 'تفاصيل',
    more: 'المزيد',
    less: 'أقل',
    view: 'عرض',
    close: 'إغلاق',
    open: 'فتح',
  },
  it: {
    loading: 'Caricamento',
    error: 'Errore',
    success: 'Successo',
    save: 'Salva',
    cancel: 'Annulla',
    confirm: 'Conferma',
    back: 'Indietro',
    next: 'Avanti',
    yes: 'Sì',
    no: 'No',
    search: 'Cerca',
    filter: 'Filtra',
    all: 'Tutti',
    none: 'Nessuno',
    edit: 'Modifica',
    delete: 'Elimina',
    add: 'Aggiungi',
    create: 'Crea',
    update: 'Aggiorna',
    details: 'Dettagli',
    more: 'Altro',
    less: 'Meno',
    view: 'Visualizza',
    close: 'Chiudi',
    open: 'Apri',
  },
};