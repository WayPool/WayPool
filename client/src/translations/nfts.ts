/**
 * Traducciones completas para la página NFTs
 * Sigue exactamente el mismo patrón que dashboard.ts y positions.ts
 * 100% de los textos traducidos a 9 idiomas
 */

export interface NFTsTranslations {
  // Header y título
  title: string;
  subtitle: string;
  pageDescription: string;
  
  // Botones principales
  refresh: string;
  filters: string;
  gridView: string;
  listView: string;
  
  // Filtros de red
  allNetworks: string;
  ethereum: string;
  polygon: string;
  unichain: string;
  
  // Switch y controles
  managedOnly: string;
  showAdvancedFilters: string;
  hideAdvancedFilters: string;
  
  // Pestañas de estado
  all: string;
  active: string;
  inRange: string;
  outOfRange: string;
  closed: string;
  listed: string;
  finalized: string;
  
  // Filtros avanzados
  statusFilter: string;
  versionFilter: string;
  tokenPair: string;
  feeLevel: string;
  valueRange: string;
  
  // Opciones de filtros
  selectStatus: string;
  selectVersion: string;
  selectTokenPair: string;
  selectFeeLevel: string;
  selectValueRange: string;
  
  // Valores de filtros
  v2: string;
  v3: string;
  v4: string;
  lowValue: string;
  mediumValue: string;
  highValue: string;
  zeroValue: string;
  
  // Estados de loading
  loading: string;
  loadingNFTs: string;
  noNFTsFound: string;
  connectWallet: string;
  connectWalletDescription: string;
  
  // Información de NFTs
  nftId: string;
  network: string;
  status: string;
  version: string;
  tokens: string;
  fee: string;
  value: string;
  estimatedValue: string;
  
  // Acciones
  viewDetails: string;
  manage: string;
  activate: string;
  deactivate: string;
  
  // Sorting
  sortBy: string;
  sortByTokenId: string;
  sortByValue: string;
  sortByStatus: string;
  sortByNetwork: string;
  ascending: string;
  descending: string;
  
  // Diálogos y modales
  nftDetails: string;
  nftDetailsTitle: string;
  close: string;
  save: string;
  cancel: string;
  
  // Mensajes de estado
  nftActivated: string;
  nftDeactivated: string;
  errorActivating: string;
  errorDeactivating: string;
  errorLoading: string;
  errorRefreshing: string;
  
  // Información detallada
  contractAddress: string;
  poolAddress: string;
  feeTier: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  
  // Admin específico
  adminPanel: string;
  adminActions: string;
  bulkActions: string;
  selectAll: string;
  clearSelection: string;
  
  // Contadores
  totalNFTs: string;
  activeNFTs: string;
  managedNFTs: string;
  unmanaged: string;
  
  // Tooltips y ayuda
  refreshTooltip: string;
  filtersTooltip: string;
  viewModeTooltip: string;
  networkTooltip: string;
  managedOnlyTooltip: string;
  
  // Errores específicos
  noPermission: string;
  networkError: string;
  apiError: string;
  
  // Success messages
  refreshSuccess: string;
  updateSuccess: string;
  
  // Placeholders
  searchPlaceholder: string;
  noResults: string;
  emptyState: string;
  
  // Links y navegación
  backToWallet: string;
  openInExplorer: string;
  viewOnUniswap: string;
}

// Español (idioma base)
export const es: NFTsTranslations = {
  // Header y título
  title: "NFTs de Uniswap",
  subtitle: "Administra tus NFTs de Uniswap y posiciones de liquidez",
  pageDescription: "Gestiona y monitorea todos tus NFTs de posiciones de liquidez de Uniswap",
  
  // Botones principales
  refresh: "Refrescar",
  filters: "Filtros",
  gridView: "Vista de grilla",
  listView: "Vista de lista",
  
  // Filtros de red
  allNetworks: "Todas",
  ethereum: "Ethereum",
  polygon: "Polygon",
  unichain: "Unichain",
  
  // Switch y controles
  managedOnly: "Solo administrados",
  showAdvancedFilters: "Mostrar filtros avanzados",
  hideAdvancedFilters: "Ocultar filtros avanzados",
  
  // Pestañas de estado
  all: "Todos",
  active: "Activos",
  inRange: "En rango",
  outOfRange: "Fuera de rango",
  closed: "Cerrados",
  listed: "Listados",
  finalized: "Finalizados",
  
  // Filtros avanzados
  statusFilter: "Estado",
  versionFilter: "Versión",
  tokenPair: "Par de tokens",
  feeLevel: "Nivel de comisión",
  valueRange: "Rango de valor",
  
  // Opciones de filtros
  selectStatus: "Seleccionar estado",
  selectVersion: "Seleccionar versión",
  selectTokenPair: "Seleccionar par",
  selectFeeLevel: "Seleccionar comisión",
  selectValueRange: "Seleccionar rango",
  
  // Valores de filtros
  v2: "V2",
  v3: "V3",
  v4: "V4",
  lowValue: "Valor bajo (< $1,000)",
  mediumValue: "Valor medio ($1,000 - $10,000)",
  highValue: "Valor alto (> $10,000)",
  zeroValue: "Sin valor",
  
  // Estados de loading
  loading: "Cargando...",
  loadingNFTs: "Cargando NFTs...",
  noNFTsFound: "No se encontraron NFTs",
  connectWallet: "Conectar billetera",
  connectWalletDescription: "Conecta tu billetera para ver tus NFTs de Uniswap",
  
  // Información de NFTs
  nftId: "ID del NFT",
  network: "Red",
  status: "Estado",
  version: "Versión",
  tokens: "Tokens",
  fee: "Comisión",
  value: "Valor",
  estimatedValue: "Valor estimado",
  
  // Acciones
  viewDetails: "Ver detalles",
  manage: "Administrar",
  activate: "Activar",
  deactivate: "Desactivar",
  
  // Sorting
  sortBy: "Ordenar por",
  sortByTokenId: "ID del token",
  sortByValue: "Valor",
  sortByStatus: "Estado",
  sortByNetwork: "Red",
  ascending: "Ascendente",
  descending: "Descendente",
  
  // Diálogos y modales
  nftDetails: "Detalles del NFT",
  nftDetailsTitle: "Información del NFT",
  close: "Cerrar",
  save: "Guardar",
  cancel: "Cancelar",
  
  // Mensajes de estado
  nftActivated: "NFT activado exitosamente",
  nftDeactivated: "NFT desactivado exitosamente",
  errorActivating: "Error al activar el NFT",
  errorDeactivating: "Error al desactivar el NFT",
  errorLoading: "Error al cargar los NFTs",
  errorRefreshing: "Error al refrescar los datos",
  
  // Información detallada
  contractAddress: "Dirección del contrato",
  poolAddress: "Dirección del pool",
  feeTier: "Nivel de comisión",
  imageUrl: "URL de imagen",
  createdAt: "Creado el",
  updatedAt: "Actualizado el",
  
  // Admin específico
  adminPanel: "Panel de administración",
  adminActions: "Acciones de administrador",
  bulkActions: "Acciones masivas",
  selectAll: "Seleccionar todo",
  clearSelection: "Limpiar selección",
  
  // Contadores
  totalNFTs: "NFTs totales",
  activeNFTs: "NFTs activos",
  managedNFTs: "NFTs administrados",
  unmanaged: "No administrados",
  
  // Tooltips y ayuda
  refreshTooltip: "Actualizar la lista de NFTs",
  filtersTooltip: "Mostrar opciones de filtrado",
  viewModeTooltip: "Cambiar modo de visualización",
  networkTooltip: "Filtrar por red blockchain",
  managedOnlyTooltip: "Mostrar solo NFTs administrados",
  
  // Errores específicos
  noPermission: "No tienes permisos para esta acción",
  networkError: "Error de conexión de red",
  apiError: "Error en la API",
  
  // Success messages
  refreshSuccess: "Datos actualizados correctamente",
  updateSuccess: "Cambios guardados exitosamente",
  
  // Placeholders
  searchPlaceholder: "Buscar NFTs...",
  noResults: "No se encontraron resultados",
  emptyState: "No hay NFTs para mostrar",
  
  // Links y navegación
  backToWallet: "Volver a la billetera",
  openInExplorer: "Abrir en explorador",
  viewOnUniswap: "Ver en Uniswap"
};

// Inglés
export const en: NFTsTranslations = {
  // Header y título
  title: "Uniswap NFTs",
  subtitle: "Manage your Uniswap NFTs and liquidity positions",
  pageDescription: "Manage and monitor all your Uniswap liquidity position NFTs",
  
  // Botones principales
  refresh: "Refresh",
  filters: "Filters",
  gridView: "Grid view",
  listView: "List view",
  
  // Filtros de red
  allNetworks: "All",
  ethereum: "Ethereum",
  polygon: "Polygon",
  unichain: "Unichain",
  
  // Switch y controles
  managedOnly: "Managed only",
  showAdvancedFilters: "Show advanced filters",
  hideAdvancedFilters: "Hide advanced filters",
  
  // Pestañas de estado
  all: "All",
  active: "Active",
  inRange: "In range",
  outOfRange: "Out of range",
  closed: "Closed",
  listed: "Listed",
  finalized: "Finalized",
  
  // Filtros avanzados
  status: "Status",
  version: "Version",
  tokenPair: "Token pair",
  feeLevel: "Fee level",
  valueRange: "Value range",
  
  // Opciones de filtros
  selectStatus: "Select status",
  selectVersion: "Select version",
  selectTokenPair: "Select pair",
  selectFeeLevel: "Select fee",
  selectValueRange: "Select range",
  
  // Valores de filtros
  v2: "V2",
  v3: "V3",
  v4: "V4",
  lowValue: "Low value (< $1,000)",
  mediumValue: "Medium value ($1,000 - $10,000)",
  highValue: "High value (> $10,000)",
  zeroValue: "No value",
  
  // Estados de loading
  loading: "Loading...",
  loadingNFTs: "Loading NFTs...",
  noNFTsFound: "No NFTs found",
  connectWallet: "Connect wallet",
  connectWalletDescription: "Connect your wallet to view your Uniswap NFTs",
  
  // Información de NFTs
  nftId: "NFT ID",
  network: "Network",
  tokens: "Tokens",
  fee: "Fee",
  value: "Value",
  estimatedValue: "Estimated value",
  
  // Acciones
  viewDetails: "View details",
  manage: "Manage",
  activate: "Activate",
  deactivate: "Deactivate",
  
  // Sorting
  sortBy: "Sort by",
  sortByTokenId: "Token ID",
  sortByValue: "Value",
  sortByStatus: "Status",
  sortByNetwork: "Network",
  ascending: "Ascending",
  descending: "Descending",
  
  // Diálogos y modales
  nftDetails: "NFT Details",
  nftDetailsTitle: "NFT Information",
  close: "Close",
  save: "Save",
  cancel: "Cancel",
  
  // Mensajes de estado
  nftActivated: "NFT activated successfully",
  nftDeactivated: "NFT deactivated successfully",
  errorActivating: "Error activating NFT",
  errorDeactivating: "Error deactivating NFT",
  errorLoading: "Error loading NFTs",
  errorRefreshing: "Error refreshing data",
  
  // Información detallada
  contractAddress: "Contract address",
  poolAddress: "Pool address",
  feeTier: "Fee tier",
  imageUrl: "Image URL",
  createdAt: "Created at",
  updatedAt: "Updated at",
  
  // Admin específico
  adminPanel: "Admin panel",
  adminActions: "Admin actions",
  bulkActions: "Bulk actions",
  selectAll: "Select all",
  clearSelection: "Clear selection",
  
  // Contadores
  totalNFTs: "Total NFTs",
  activeNFTs: "Active NFTs",
  managedNFTs: "Managed NFTs",
  unmanaged: "Unmanaged",
  
  // Tooltips y ayuda
  refreshTooltip: "Refresh NFT list",
  filtersTooltip: "Show filter options",
  viewModeTooltip: "Change view mode",
  networkTooltip: "Filter by blockchain network",
  managedOnlyTooltip: "Show only managed NFTs",
  
  // Errores específicos
  noPermission: "You don't have permission for this action",
  networkError: "Network connection error",
  apiError: "API error",
  
  // Success messages
  refreshSuccess: "Data updated successfully",
  updateSuccess: "Changes saved successfully",
  
  // Placeholders
  searchPlaceholder: "Search NFTs...",
  noResults: "No results found",
  emptyState: "No NFTs to display",
  
  // Links y navegación
  backToWallet: "Back to wallet",
  openInExplorer: "Open in explorer",
  viewOnUniswap: "View on Uniswap"
};

// Francés
export const fr: NFTsTranslations = {
  // Header y título
  title: "NFTs Uniswap",
  subtitle: "Gérez vos NFTs Uniswap et positions de liquidité",
  pageDescription: "Gérez et surveillez tous vos NFTs de positions de liquidité Uniswap",
  
  // Botones principales
  refresh: "Actualiser",
  filters: "Filtres",
  gridView: "Vue grille",
  listView: "Vue liste",
  
  // Filtros de red
  allNetworks: "Tous",
  ethereum: "Ethereum",
  polygon: "Polygon",
  unichain: "Unichain",
  
  // Switch y controles
  managedOnly: "Gérés uniquement",
  showAdvancedFilters: "Afficher les filtres avancés",
  hideAdvancedFilters: "Masquer les filtres avancés",
  
  // Pestañas de estado
  all: "Tous",
  active: "Actifs",
  inRange: "Dans la gamme",
  outOfRange: "Hors gamme",
  closed: "Fermés",
  listed: "Listés",
  finalized: "Finalisés",
  
  // Filtros avanzados
  status: "Statut",
  version: "Version",
  tokenPair: "Paire de tokens",
  feeLevel: "Niveau de commission",
  valueRange: "Gamme de valeur",
  
  // Opciones de filtros
  selectStatus: "Sélectionner le statut",
  selectVersion: "Sélectionner la version",
  selectTokenPair: "Sélectionner la paire",
  selectFeeLevel: "Sélectionner la commission",
  selectValueRange: "Sélectionner la gamme",
  
  // Valores de filtros
  v2: "V2",
  v3: "V3",
  v4: "V4",
  lowValue: "Valeur faible (< 1 000 $)",
  mediumValue: "Valeur moyenne (1 000 $ - 10 000 $)",
  highValue: "Valeur élevée (> 10 000 $)",
  zeroValue: "Aucune valeur",
  
  // Estados de loading
  loading: "Chargement...",
  loadingNFTs: "Chargement des NFTs...",
  noNFTsFound: "Aucun NFT trouvé",
  connectWallet: "Connecter le portefeuille",
  connectWalletDescription: "Connectez votre portefeuille pour voir vos NFTs Uniswap",
  
  // Información de NFTs
  nftId: "ID du NFT",
  network: "Réseau",
  tokens: "Tokens",
  fee: "Commission",
  value: "Valeur",
  estimatedValue: "Valeur estimée",
  
  // Acciones
  viewDetails: "Voir les détails",
  manage: "Gérer",
  activate: "Activer",
  deactivate: "Désactiver",
  
  // Sorting
  sortBy: "Trier par",
  sortByTokenId: "ID du token",
  sortByValue: "Valeur",
  sortByStatus: "Statut",
  sortByNetwork: "Réseau",
  ascending: "Croissant",
  descending: "Décroissant",
  
  // Diálogos y modales
  nftDetails: "Détails du NFT",
  nftDetailsTitle: "Informations du NFT",
  close: "Fermer",
  save: "Enregistrer",
  cancel: "Annuler",
  
  // Mensajes de estado
  nftActivated: "NFT activé avec succès",
  nftDeactivated: "NFT désactivé avec succès",
  errorActivating: "Erreur lors de l'activation du NFT",
  errorDeactivating: "Erreur lors de la désactivation du NFT",
  errorLoading: "Erreur lors du chargement des NFTs",
  errorRefreshing: "Erreur lors de l'actualisation des données",
  
  // Información detallada
  contractAddress: "Adresse du contrat",
  poolAddress: "Adresse du pool",
  feeTier: "Niveau de commission",
  imageUrl: "URL de l'image",
  createdAt: "Créé le",
  updatedAt: "Mis à jour le",
  
  // Admin específico
  adminPanel: "Panneau d'administration",
  adminActions: "Actions d'administrateur",
  bulkActions: "Actions en masse",
  selectAll: "Tout sélectionner",
  clearSelection: "Effacer la sélection",
  
  // Contadores
  totalNFTs: "NFTs totaux",
  activeNFTs: "NFTs actifs",
  managedNFTs: "NFTs gérés",
  unmanaged: "Non gérés",
  
  // Tooltips y ayuda
  refreshTooltip: "Actualiser la liste des NFTs",
  filtersTooltip: "Afficher les options de filtrage",
  viewModeTooltip: "Changer le mode d'affichage",
  networkTooltip: "Filtrer par réseau blockchain",
  managedOnlyTooltip: "Afficher uniquement les NFTs gérés",
  
  // Errores específicos
  noPermission: "Vous n'avez pas la permission pour cette action",
  networkError: "Erreur de connexion réseau",
  apiError: "Erreur API",
  
  // Success messages
  refreshSuccess: "Données mises à jour avec succès",
  updateSuccess: "Modifications enregistrées avec succès",
  
  // Placeholders
  searchPlaceholder: "Rechercher des NFTs...",
  noResults: "Aucun résultat trouvé",
  emptyState: "Aucun NFT à afficher",
  
  // Links y navegación
  backToWallet: "Retour au portefeuille",
  openInExplorer: "Ouvrir dans l'explorateur",
  viewOnUniswap: "Voir sur Uniswap"
};

// Alemán
export const de: NFTsTranslations = {
  // Header y título
  title: "Uniswap NFTs",
  subtitle: "Verwalten Sie Ihre Uniswap NFTs und Liquiditätspositionen",
  pageDescription: "Verwalten und überwachen Sie alle Ihre Uniswap Liquiditätspositions-NFTs",
  
  // Botones principales
  refresh: "Aktualisieren",
  filters: "Filter",
  gridView: "Rasteransicht",
  listView: "Listenansicht",
  
  // Filtros de red
  allNetworks: "Alle",
  ethereum: "Ethereum",
  polygon: "Polygon",
  unichain: "Unichain",
  
  // Switch y controles
  managedOnly: "Nur verwaltete",
  showAdvancedFilters: "Erweiterte Filter anzeigen",
  hideAdvancedFilters: "Erweiterte Filter ausblenden",
  
  // Pestañas de estado
  all: "Alle",
  active: "Aktiv",
  inRange: "Im Bereich",
  outOfRange: "Außerhalb des Bereichs",
  closed: "Geschlossen",
  listed: "Gelistet",
  finalized: "Abgeschlossen",
  
  // Filtros avanzados
  status: "Status",
  version: "Version",
  tokenPair: "Token-Paar",
  feeLevel: "Gebührenniveau",
  valueRange: "Wertbereich",
  
  // Opciones de filtros
  selectStatus: "Status auswählen",
  selectVersion: "Version auswählen",
  selectTokenPair: "Paar auswählen",
  selectFeeLevel: "Gebühr auswählen",
  selectValueRange: "Bereich auswählen",
  
  // Valores de filtros
  v2: "V2",
  v3: "V3",
  v4: "V4",
  lowValue: "Niedriger Wert (< 1.000 $)",
  mediumValue: "Mittlerer Wert (1.000 $ - 10.000 $)",
  highValue: "Hoher Wert (> 10.000 $)",
  zeroValue: "Kein Wert",
  
  // Estados de loading
  loading: "Laden...",
  loadingNFTs: "NFTs werden geladen...",
  noNFTsFound: "Keine NFTs gefunden",
  connectWallet: "Wallet verbinden",
  connectWalletDescription: "Verbinden Sie Ihr Wallet, um Ihre Uniswap NFTs zu sehen",
  
  // Información de NFTs
  nftId: "NFT ID",
  network: "Netzwerk",
  tokens: "Token",
  fee: "Gebühr",
  value: "Wert",
  estimatedValue: "Geschätzter Wert",
  
  // Acciones
  viewDetails: "Details anzeigen",
  manage: "Verwalten",
  activate: "Aktivieren",
  deactivate: "Deaktivieren",
  
  // Sorting
  sortBy: "Sortieren nach",
  sortByTokenId: "Token ID",
  sortByValue: "Wert",
  sortByStatus: "Status",
  sortByNetwork: "Netzwerk",
  ascending: "Aufsteigend",
  descending: "Absteigend",
  
  // Diálogos y modales
  nftDetails: "NFT Details",
  nftDetailsTitle: "NFT Informationen",
  close: "Schließen",
  save: "Speichern",
  cancel: "Abbrechen",
  
  // Mensajes de estado
  nftActivated: "NFT erfolgreich aktiviert",
  nftDeactivated: "NFT erfolgreich deaktiviert",
  errorActivating: "Fehler beim Aktivieren des NFT",
  errorDeactivating: "Fehler beim Deaktivieren des NFT",
  errorLoading: "Fehler beim Laden der NFTs",
  errorRefreshing: "Fehler beim Aktualisieren der Daten",
  
  // Información detallada
  contractAddress: "Vertragsadresse",
  poolAddress: "Pool-Adresse",
  feeTier: "Gebührenstufe",
  imageUrl: "Bild-URL",
  createdAt: "Erstellt am",
  updatedAt: "Aktualisiert am",
  
  // Admin específico
  adminPanel: "Admin-Panel",
  adminActions: "Admin-Aktionen",
  bulkActions: "Massenaktionen",
  selectAll: "Alle auswählen",
  clearSelection: "Auswahl löschen",
  
  // Contadores
  totalNFTs: "NFTs gesamt",
  activeNFTs: "Aktive NFTs",
  managedNFTs: "Verwaltete NFTs",
  unmanaged: "Nicht verwaltet",
  
  // Tooltips y ayuda
  refreshTooltip: "NFT-Liste aktualisieren",
  filtersTooltip: "Filteroptionen anzeigen",
  viewModeTooltip: "Ansichtsmodus ändern",
  networkTooltip: "Nach Blockchain-Netzwerk filtern",
  managedOnlyTooltip: "Nur verwaltete NFTs anzeigen",
  
  // Errores específicos
  noPermission: "Sie haben keine Berechtigung für diese Aktion",
  networkError: "Netzwerkverbindungsfehler",
  apiError: "API-Fehler",
  
  // Success messages
  refreshSuccess: "Daten erfolgreich aktualisiert",
  updateSuccess: "Änderungen erfolgreich gespeichert",
  
  // Placeholders
  searchPlaceholder: "NFTs suchen...",
  noResults: "Keine Ergebnisse gefunden",
  emptyState: "Keine NFTs zum Anzeigen",
  
  // Links y navegación
  backToWallet: "Zurück zum Wallet",
  openInExplorer: "Im Explorer öffnen",
  viewOnUniswap: "Auf Uniswap anzeigen"
};

// Chino
export const zh: NFTsTranslations = {
  // Header y título
  title: "Uniswap NFTs",
  subtitle: "管理您的 Uniswap NFTs 和流动性头寸",
  pageDescription: "管理和监控您所有的 Uniswap 流动性头寸 NFTs",
  
  // Botones principales
  refresh: "刷新",
  filters: "筛选器",
  gridView: "网格视图",
  listView: "列表视图",
  
  // Filtros de red
  allNetworks: "全部",
  ethereum: "以太坊",
  polygon: "Polygon",
  unichain: "Unichain",
  
  // Switch y controles
  managedOnly: "仅显示已管理",
  showAdvancedFilters: "显示高级筛选器",
  hideAdvancedFilters: "隐藏高级筛选器",
  
  // Pestañas de estado
  all: "全部",
  active: "活跃",
  inRange: "范围内",
  outOfRange: "超出范围",
  closed: "已关闭",
  listed: "已列出",
  finalized: "已完成",
  
  // Filtros avanzados
  status: "状态",
  version: "版本",
  tokenPair: "代币对",
  feeLevel: "费用等级",
  valueRange: "价值范围",
  
  // Opciones de filtros
  selectStatus: "选择状态",
  selectVersion: "选择版本",
  selectTokenPair: "选择代币对",
  selectFeeLevel: "选择费用",
  selectValueRange: "选择范围",
  
  // Valores de filtros
  v2: "V2",
  v3: "V3",
  v4: "V4",
  lowValue: "低价值 (< $1,000)",
  mediumValue: "中等价值 ($1,000 - $10,000)",
  highValue: "高价值 (> $10,000)",
  zeroValue: "无价值",
  
  // Estados de loading
  loading: "加载中...",
  loadingNFTs: "加载 NFTs...",
  noNFTsFound: "未找到 NFTs",
  connectWallet: "连接钱包",
  connectWalletDescription: "连接您的钱包以查看您的 Uniswap NFTs",
  
  // Información de NFTs
  nftId: "NFT ID",
  network: "网络",
  tokens: "代币",
  fee: "费用",
  value: "价值",
  estimatedValue: "估计价值",
  
  // Acciones
  viewDetails: "查看详情",
  manage: "管理",
  activate: "激活",
  deactivate: "停用",
  
  // Sorting
  sortBy: "排序方式",
  sortByTokenId: "代币 ID",
  sortByValue: "价值",
  sortByStatus: "状态",
  sortByNetwork: "网络",
  ascending: "升序",
  descending: "降序",
  
  // Diálogos y modales
  nftDetails: "NFT 详情",
  nftDetailsTitle: "NFT 信息",
  close: "关闭",
  save: "保存",
  cancel: "取消",
  
  // Mensajes de estado
  nftActivated: "NFT 激活成功",
  nftDeactivated: "NFT 停用成功",
  errorActivating: "激活 NFT 时出错",
  errorDeactivating: "停用 NFT 时出错",
  errorLoading: "加载 NFTs 时出错",
  errorRefreshing: "刷新数据时出错",
  
  // Información detallada
  contractAddress: "合约地址",
  poolAddress: "池地址",
  feeTier: "费用层级",
  imageUrl: "图片 URL",
  createdAt: "创建时间",
  updatedAt: "更新时间",
  
  // Admin específico
  adminPanel: "管理面板",
  adminActions: "管理员操作",
  bulkActions: "批量操作",
  selectAll: "全选",
  clearSelection: "清除选择",
  
  // Contadores
  totalNFTs: "总 NFTs",
  activeNFTs: "活跃 NFTs",
  managedNFTs: "已管理 NFTs",
  unmanaged: "未管理",
  
  // Tooltips y ayuda
  refreshTooltip: "刷新 NFT 列表",
  filtersTooltip: "显示筛选选项",
  viewModeTooltip: "更改视图模式",
  networkTooltip: "按区块链网络筛选",
  managedOnlyTooltip: "仅显示已管理的 NFTs",
  
  // Errores específicos
  noPermission: "您没有此操作的权限",
  networkError: "网络连接错误",
  apiError: "API 错误",
  
  // Success messages
  refreshSuccess: "数据更新成功",
  updateSuccess: "更改保存成功",
  
  // Placeholders
  searchPlaceholder: "搜索 NFTs...",
  noResults: "未找到结果",
  emptyState: "没有 NFTs 可显示",
  
  // Links y navegación
  backToWallet: "返回钱包",
  openInExplorer: "在浏览器中打开",
  viewOnUniswap: "在 Uniswap 上查看"
};

// Português
export const pt: NFTsTranslations = {
  // Header y título
  title: "NFTs Uniswap",
  subtitle: "Gerencie seus NFTs Uniswap e posições de liquidez",
  pageDescription: "Gerencie e monitore todos os seus NFTs de posições de liquidez Uniswap",
  
  // Botones principales
  refresh: "Atualizar",
  filters: "Filtros",
  gridView: "Visualização em grade",
  listView: "Visualização em lista",
  
  // Filtros de red
  allNetworks: "Todas",
  ethereum: "Ethereum",
  polygon: "Polygon",
  unichain: "Unichain",
  
  // Switch y controles
  managedOnly: "Apenas gerenciados",
  showAdvancedFilters: "Mostrar filtros avançados",
  hideAdvancedFilters: "Ocultar filtros avançados",
  
  // Pestañas de estado
  all: "Todos",
  active: "Ativos",
  inRange: "No intervalo",
  outOfRange: "Fora do intervalo",
  closed: "Fechados",
  listed: "Listados",
  finalized: "Finalizados",
  
  // Filtros avanzados
  status: "Status",
  version: "Versão",
  tokenPair: "Par de tokens",
  feeLevel: "Nível de taxa",
  valueRange: "Faixa de valor",
  
  // Opciones de filtros
  selectStatus: "Selecionar status",
  selectVersion: "Selecionar versão",
  selectTokenPair: "Selecionar par",
  selectFeeLevel: "Selecionar taxa",
  selectValueRange: "Selecionar faixa",
  
  // Valores de filtros
  v2: "V2",
  v3: "V3",
  v4: "V4",
  lowValue: "Valor baixo (< $1.000)",
  mediumValue: "Valor médio ($1.000 - $10.000)",
  highValue: "Valor alto (> $10.000)",
  zeroValue: "Sem valor",
  
  // Estados de loading
  loading: "Carregando...",
  loadingNFTs: "Carregando NFTs...",
  noNFTsFound: "Nenhum NFT encontrado",
  connectWallet: "Conectar carteira",
  connectWalletDescription: "Conecte sua carteira para ver seus NFTs Uniswap",
  
  // Información de NFTs
  nftId: "ID do NFT",
  network: "Rede",
  tokens: "Tokens",
  fee: "Taxa",
  value: "Valor",
  estimatedValue: "Valor estimado",
  
  // Acciones
  viewDetails: "Ver detalhes",
  manage: "Gerenciar",
  activate: "Ativar",
  deactivate: "Desativar",
  
  // Sorting
  sortBy: "Ordenar por",
  sortByTokenId: "ID do token",
  sortByValue: "Valor",
  sortByStatus: "Status",
  sortByNetwork: "Rede",
  ascending: "Crescente",
  descending: "Decrescente",
  
  // Diálogos y modales
  nftDetails: "Detalhes do NFT",
  nftDetailsTitle: "Informações do NFT",
  close: "Fechar",
  save: "Salvar",
  cancel: "Cancelar",
  
  // Mensajes de estado
  nftActivated: "NFT ativado com sucesso",
  nftDeactivated: "NFT desativado com sucesso",
  errorActivating: "Erro ao ativar NFT",
  errorDeactivating: "Erro ao desativar NFT",
  errorLoading: "Erro ao carregar NFTs",
  errorRefreshing: "Erro ao atualizar dados",
  
  // Información detallada
  contractAddress: "Endereço do contrato",
  poolAddress: "Endereço da pool",
  feeTier: "Nível de taxa",
  imageUrl: "URL da imagem",
  createdAt: "Criado em",
  updatedAt: "Atualizado em",
  
  // Admin específico
  adminPanel: "Painel de administração",
  adminActions: "Ações de administrador",
  bulkActions: "Ações em massa",
  selectAll: "Selecionar tudo",
  clearSelection: "Limpar seleção",
  
  // Contadores
  totalNFTs: "NFTs totais",
  activeNFTs: "NFTs ativos",
  managedNFTs: "NFTs gerenciados",
  unmanaged: "Não gerenciados",
  
  // Tooltips y ayuda
  refreshTooltip: "Atualizar lista de NFTs",
  filtersTooltip: "Mostrar opções de filtro",
  viewModeTooltip: "Alterar modo de visualização",
  networkTooltip: "Filtrar por rede blockchain",
  managedOnlyTooltip: "Mostrar apenas NFTs gerenciados",
  
  // Errores específicos
  noPermission: "Você não tem permissão para esta ação",
  networkError: "Erro de conexão de rede",
  apiError: "Erro da API",
  
  // Success messages
  refreshSuccess: "Dados atualizados com sucesso",
  updateSuccess: "Alterações salvas com sucesso",
  
  // Placeholders
  searchPlaceholder: "Buscar NFTs...",
  noResults: "Nenhum resultado encontrado",
  emptyState: "Nenhum NFT para exibir",
  
  // Links y navegación
  backToWallet: "Voltar à carteira",
  openInExplorer: "Abrir no explorador",
  viewOnUniswap: "Ver no Uniswap"
};

// Hindi
export const hi: NFTsTranslations = {
  // Header y título
  title: "Uniswap NFTs",
  subtitle: "अपने Uniswap NFTs और तरलता पोजीशन प्रबंधित करें",
  pageDescription: "अपने सभी Uniswap तरलता पोजीशन NFTs को प्रबंधित और मॉनिटर करें",
  
  // Botones principales
  refresh: "ताज़ा करें",
  filters: "फ़िल्टर",
  gridView: "ग्रिड दृश्य",
  listView: "सूची दृश्य",
  
  // Filtros de red
  allNetworks: "सभी",
  ethereum: "Ethereum",
  polygon: "Polygon",
  unichain: "Unichain",
  
  // Switch y controles
  managedOnly: "केवल प्रबंधित",
  showAdvancedFilters: "उन्नत फ़िल्टर दिखाएं",
  hideAdvancedFilters: "उन्नत फ़िल्टर छुपाएं",
  
  // Pestañas de estado
  all: "सभी",
  active: "सक्रिय",
  inRange: "रेंज में",
  outOfRange: "रेंज के बाहर",
  closed: "बंद",
  listed: "सूचीबद्ध",
  finalized: "अंतिम",
  
  // Filtros avanzados
  status: "स्थिति",
  version: "संस्करण",
  tokenPair: "टोकन जोड़ी",
  feeLevel: "शुल्क स्तर",
  valueRange: "मूल्य सीमा",
  
  // Opciones de filtros
  selectStatus: "स्थिति चुनें",
  selectVersion: "संस्करण चुनें",
  selectTokenPair: "जोड़ी चुनें",
  selectFeeLevel: "शुल्क चुनें",
  selectValueRange: "सीमा चुनें",
  
  // Valores de filtros
  v2: "V2",
  v3: "V3",
  v4: "V4",
  lowValue: "कम मूल्य (< $1,000)",
  mediumValue: "मध्यम मूल्य ($1,000 - $10,000)",
  highValue: "उच्च मूल्य (> $10,000)",
  zeroValue: "कोई मूल्य नहीं",
  
  // Estados de loading
  loading: "लोड हो रहा है...",
  loadingNFTs: "NFTs लोड हो रहे हैं...",
  noNFTsFound: "कोई NFTs नहीं मिले",
  connectWallet: "वॉलेट कनेक्ट करें",
  connectWalletDescription: "अपने Uniswap NFTs देखने के लिए अपना वॉलेट कनेक्ट करें",
  
  // Información de NFTs
  nftId: "NFT ID",
  network: "नेटवर्क",
  tokens: "टोकन",
  fee: "शुल्क",
  value: "मूल्य",
  estimatedValue: "अनुमानित मूल्य",
  
  // Acciones
  viewDetails: "विवरण देखें",
  manage: "प्रबंधित करें",
  activate: "सक्रिय करें",
  deactivate: "निष्क्रिय करें",
  
  // Sorting
  sortBy: "इसके आधार पर क्रमबद्ध करें",
  sortByTokenId: "टोकन ID",
  sortByValue: "मूल्य",
  sortByStatus: "स्थिति",
  sortByNetwork: "नेटवर्क",
  ascending: "आरोही",
  descending: "अवरोही",
  
  // Diálogos y modales
  nftDetails: "NFT विवरण",
  nftDetailsTitle: "NFT जानकारी",
  close: "बंद करें",
  save: "सहेजें",
  cancel: "रद्द करें",
  
  // Mensajes de estado
  nftActivated: "NFT सफलतापूर्वक सक्रिय",
  nftDeactivated: "NFT सफलतापूर्वक निष्क्रिय",
  errorActivating: "NFT सक्रिय करने में त्रुटि",
  errorDeactivating: "NFT निष्क्रिय करने में त्रुटि",
  errorLoading: "NFTs लोड करने में त्रुटि",
  errorRefreshing: "डेटा ताज़ा करने में त्रुटि",
  
  // Información detallada
  contractAddress: "कॉन्ट्रैक्ट पता",
  poolAddress: "पूल पता",
  feeTier: "शुल्क स्तर",
  imageUrl: "छवि URL",
  createdAt: "बनाया गया",
  updatedAt: "अपडेट किया गया",
  
  // Admin específico
  adminPanel: "एडमिन पैनल",
  adminActions: "एडमिन क्रियाएं",
  bulkActions: "थोक क्रियाएं",
  selectAll: "सभी चुनें",
  clearSelection: "चयन साफ़ करें",
  
  // Contadores
  totalNFTs: "कुल NFTs",
  activeNFTs: "सक्रिय NFTs",
  managedNFTs: "प्रबंधित NFTs",
  unmanaged: "अप्रबंधित",
  
  // Tooltips y ayuda
  refreshTooltip: "NFT सूची ताज़ा करें",
  filtersTooltip: "फ़िल्टर विकल्प दिखाएं",
  viewModeTooltip: "दृश्य मोड बदलें",
  networkTooltip: "ब्लॉकचेन नेटवर्क द्वारा फ़िल्टर करें",
  managedOnlyTooltip: "केवल प्रबंधित NFTs दिखाएं",
  
  // Errores específicos
  noPermission: "आपके पास इस क्रिया की अनुमति नहीं है",
  networkError: "नेटवर्क कनेक्शन त्रुटि",
  apiError: "API त्रुटि",
  
  // Success messages
  refreshSuccess: "डेटा सफलतापूर्वक अपडेट",
  updateSuccess: "परिवर्तन सफलतापूर्वक सहेजे गए",
  
  // Placeholders
  searchPlaceholder: "NFTs खोजें...",
  noResults: "कोई परिणाम नहीं मिले",
  emptyState: "दिखाने के लिए कोई NFTs नहीं",
  
  // Links y navegación
  backToWallet: "वॉलेट पर वापस जाएं",
  openInExplorer: "एक्सप्लोरर में खोलें",
  viewOnUniswap: "Uniswap पर देखें"
};
// Russian
export const ru: NFTsTranslations = {
  // Header y título
  title: "Uniswap NFT",
  subtitle: "Управляйте своими Uniswap NFT и позициями ликвидности",
  pageDescription: "Управляйте и отслеживайте все свои NFT позиций ликвидности Uniswap",
  
  // Botones principales
  refresh: "Обновить",
  filters: "Фильтры",
  gridView: "Вид сеткой",
  listView: "Вид списком",
  
  // Filtros de red
  allNetworks: "Все",
  ethereum: "Ethereum",
  polygon: "Polygon",
  unichain: "Unichain", // Assuming this is a specific chain name and not to be translated
  
  // Switch y controles
  managedOnly: "Только управляемые",
  showAdvancedFilters: "Показать расширенные фильтры",
  hideAdvancedFilters: "Скрыть расширенные фильтры",
  
  // Pestañas de estado
  all: "Все",
  active: "Активные",
  inRange: "В диапазоне",
  outOfRange: "Вне диапазона",
  closed: "Закрытые",
  listed: "Выставленные",
  finalized: "Завершенные",
  
  // Filtros avanzados
  status: "Статус",
  version: "Версия",
  tokenPair: "Пара токенов",
  feeLevel: "Уровень комиссии",
  valueRange: "Диапазон стоимости",
  
  // Opciones de filtros
  selectStatus: "Выбрать статус",
  selectVersion: "Выбрать версию",
  selectTokenPair: "Выбрать пару",
  selectFeeLevel: "Выбрать комиссию",
  selectValueRange: "Выбрать диапазон",
  
  // Valores de filtros
  v2: "V2",
  v3: "V3",
  v4: "V4",
  lowValue: "Низкая стоимость (< $1,000)",
  mediumValue: "Средняя стоимость ($1,000 - $10,000)",
  highValue: "Высокая стоимость (> $10,000)",
  zeroValue: "Нет стоимости",
  
  // Estados de loading
  loading: "Загрузка...",
  loadingNFTs: "Загрузка NFT...",
  noNFTsFound: "NFT не найдены",
  connectWallet: "Подключить кошелек",
  connectWalletDescription: "Подключите свой кошелек, чтобы просмотреть свои Uniswap NFT",
  
  // Información de NFTs
  nftId: "ID NFT",
  network: "Сеть",
  tokens: "Токены",
  fee: "Комиссия",
  value: "Стоимость",
  estimatedValue: "Примерная стоимость",
  
  // Acciones
  viewDetails: "Посмотреть детали",
  manage: "Управлять",
  activate: "Активировать",
  deactivate: "Деактивировать",
  
  // Sorting
  sortBy: "Сортировать по",
  sortByTokenId: "ID токена",
  sortByValue: "Стоимость",
  sortByStatus: "Статус",
  sortByNetwork: "Сеть",
  ascending: "По возрастанию",
  descending: "По убыванию",
  
  // Diálogos y modales
  nftDetails: "Детали NFT",
  nftDetailsTitle: "Информация об NFT",
  close: "Закрыть",
  save: "Сохранить",
  cancel: "Отмена",
  
  // Mensajes de estado
  nftActivated: "NFT успешно активирован",
  nftDeactivated: "NFT успешно деактивирован",
  errorActivating: "Ошибка активации NFT",
  errorDeactivating: "Ошибка деактивации NFT",
  errorLoading: "Ошибка загрузки NFT",
  errorRefreshing: "Ошибка обновления данных",
  
  // Información detallada
  contractAddress: "Адрес контракта",
  poolAddress: "Адрес пула",
  feeTier: "Уровень комиссии",
  imageUrl: "URL изображения",
  createdAt: "Создано",
  updatedAt: "Обновлено",
  
  // Admin específico
  adminPanel: "Панель администратора",
  adminActions: "Действия администратора",
  bulkActions: "Массовые действия",
  selectAll: "Выбрать все",
  clearSelection: "Очистить выбор",
  
  // Contadores
  totalNFTs: "Всего NFT",
  activeNFTs: "Активные NFT",
  managedNFTs: "Управляемые NFT",
  unmanaged: "Неуправляемые",
  
  // Tooltips y ayuda
  refreshTooltip: "Обновить список NFT",
  filtersTooltip: "Показать параметры фильтрации",
  viewModeTooltip: "Изменить режим просмотра",
  networkTooltip: "Фильтровать по блокчейн-сети",
  managedOnlyTooltip: "Показывать только управляемые NFT",
  
  // Errores específicos
  noPermission: "У вас нет разрешения на это действие",
  networkError: "Ошибка сетевого соединения",
  apiError: "Ошибка API",
  
  // Success messages
  refreshSuccess: "Данные успешно обновлены",
  updateSuccess: "Изменения успешно сохранены",
  
  // Placeholders
  searchPlaceholder: "Поиск NFT...",
  noResults: "Результаты не найдены",
  emptyState: "Нет NFT для отображения",
  
  // Links y navegación
  backToWallet: "Назад к кошельку",
  openInExplorer: "Открыть в эксплорере",
  viewOnUniswap: "Посмотреть на Uniswap"
};
// Árabe
export const ar: NFTsTranslations = {
  // Header y título
  title: "Uniswap NFTs",
  subtitle: "إدارة NFTs Uniswap الخاصة بك ومراكز السيولة",
  pageDescription: "إدارة ومراقبة جميع NFTs مراكز سيولة Uniswap الخاصة بك",
  
  // Botones principales
  refresh: "تحديث",
  filters: "المرشحات",
  gridView: "عرض الشبكة",
  listView: "عرض القائمة",
  
  // Filtros de red
  allNetworks: "جميع الشبكات",
  ethereum: "Ethereum",
  polygon: "Polygon",
  unichain: "Unichain",
  
  // Switch y controles
  managedOnly: "المُدارة فقط",
  showAdvancedFilters: "إظهار المرشحات المتقدمة",
  hideAdvancedFilters: "إخفاء المرشحات المتقدمة",
  
  // Pestañas de estado
  all: "الكل",
  active: "نشط",
  inRange: "في النطاق",
  outOfRange: "خارج النطاق",
  closed: "مغلق",
  listed: "مدرج",
  finalized: "منتهي",
  
  // Filtros avanzados
  status: "الحالة",
  version: "الإصدار",
  tokenPair: "زوج الرموز",
  feeLevel: "مستوى الرسوم",
  valueRange: "نطاق القيمة",
  
  // Opciones de filtros
  selectStatus: "اختر الحالة",
  selectVersion: "اختر الإصدار",
  selectTokenPair: "اختر الزوج",
  selectFeeLevel: "اختر الرسوم",
  selectValueRange: "اختر النطاق",
  
  // Valores de filtros
  v2: "V2",
  v3: "V3",
  v4: "V4",
  lowValue: "قيمة منخفضة (< $1,000)",
  mediumValue: "قيمة متوسطة ($1,000 - $10,000)",
  highValue: "قيمة عالية (> $10,000)",
  zeroValue: "بدون قيمة",
  
  // Estados de loading
  loading: "جاري التحميل...",
  loadingNFTs: "جاري تحميل NFTs...",
  noNFTsFound: "لم يتم العثور على NFTs",
  connectWallet: "ربط المحفظة",
  connectWalletDescription: "اربط محفظتك لعرض NFTs Uniswap الخاصة بك",
  
  // Información de NFTs
  nftId: "معرف NFT",
  network: "الشبكة",
  tokens: "الرموز",
  fee: "الرسوم",
  value: "القيمة",
  estimatedValue: "القيمة المقدرة",
  
  // Acciones
  viewDetails: "عرض التفاصيل",
  manage: "إدارة",
  activate: "تفعيل",
  deactivate: "إلغاء التفعيل",
  
  // Sorting
  sortBy: "ترتيب حسب",
  sortByTokenId: "معرف الرمز",
  sortByValue: "القيمة",
  sortByStatus: "الحالة",
  sortByNetwork: "الشبكة",
  ascending: "تصاعدي",
  descending: "تنازلي",
  
  // Diálogos y modales
  nftDetails: "تفاصيل NFT",
  nftDetailsTitle: "معلومات NFT",
  close: "إغلاق",
  save: "حفظ",
  cancel: "إلغاء",
  
  // Mensajes de estado
  nftActivated: "تم تفعيل NFT بنجاح",
  nftDeactivated: "تم إلغاء تفعيل NFT بنجاح",
  errorActivating: "خطأ في تفعيل NFT",
  errorDeactivating: "خطأ في إلغاء تفعيل NFT",
  errorLoading: "خطأ في تحميل NFTs",
  errorRefreshing: "خطأ في تحديث البيانات",
  
  // Información detallada
  contractAddress: "عنوان العقد",
  poolAddress: "عنوان التجمع",
  feeTier: "مستوى الرسوم",
  imageUrl: "رابط الصورة",
  createdAt: "تم الإنشاء في",
  updatedAt: "تم التحديث في",
  
  // Admin específico
  adminPanel: "لوحة الإدارة",
  adminActions: "إجراءات المدير",
  bulkActions: "إجراءات مجمعة",
  selectAll: "تحديد الكل",
  clearSelection: "مسح التحديد",
  
  // Contadores
  totalNFTs: "إجمالي NFTs",
  activeNFTs: "NFTs نشطة",
  managedNFTs: "NFTs مُدارة",
  unmanaged: "غير مُدارة",
  
  // Tooltips y ayuda
  refreshTooltip: "تحديث قائمة NFT",
  filtersTooltip: "إظهار خيارات المرشح",
  viewModeTooltip: "تغيير وضع العرض",
  networkTooltip: "تصفية حسب شبكة البلوك تشين",
  managedOnlyTooltip: "إظهار NFTs المُدارة فقط",
  
  // Errores específicos
  noPermission: "ليس لديك إذن لهذا الإجراء",
  networkError: "خطأ في اتصال الشبكة",
  apiError: "خطأ في API",
  
  // Success messages
  refreshSuccess: "تم تحديث البيانات بنجاح",
  updateSuccess: "تم حفظ التغييرات بنجاح",
  
  // Placeholders
  searchPlaceholder: "البحث عن NFTs...",
  noResults: "لم يتم العثور على نتائج",
  emptyState: "لا توجد NFTs للعرض",
  
  // Links y navegación
  backToWallet: "العودة إلى المحفظة",
  openInExplorer: "فتح في المستكشف",
  viewOnUniswap: "عرض على Uniswap"
};

// Italiano
export const it: NFTsTranslations = {
  // Header y título
  title: "NFT Uniswap",
  subtitle: "Gestisci i tuoi NFT Uniswap e le posizioni di liquidità",
  pageDescription: "Gestisci e monitora tutti i tuoi NFT delle posizioni di liquidità Uniswap",
  
  // Botones principales
  refresh: "Aggiorna",
  filters: "Filtri",
  gridView: "Vista griglia",
  listView: "Vista lista",
  
  // Filtros de red
  allNetworks: "Tutte",
  ethereum: "Ethereum",
  polygon: "Polygon",
  unichain: "Unichain",
  
  // Switch y controles
  managedOnly: "Solo gestiti",
  showAdvancedFilters: "Mostra filtri avanzati",
  hideAdvancedFilters: "Nascondi filtri avanzati",
  
  // Pestañas de estado
  all: "Tutti",
  active: "Attivi",
  inRange: "Nel range",
  outOfRange: "Fuori range",
  closed: "Chiusi",
  listed: "In lista",
  finalized: "Finalizzati",
  
  // Filtros avanzados
  status: "Stato",
  version: "Versione",
  tokenPair: "Coppia di token",
  feeLevel: "Livello commissioni",
  valueRange: "Range di valore",
  
  // Opciones de filtros
  selectStatus: "Seleziona stato",
  selectVersion: "Seleziona versione",
  selectTokenPair: "Seleziona coppia",
  selectFeeLevel: "Seleziona commissioni",
  selectValueRange: "Seleziona range",
  
  // Valores de filtros
  v2: "V2",
  v3: "V3",
  v4: "V4",
  lowValue: "Valore basso (< $1.000)",
  mediumValue: "Valore medio ($1.000 - $10.000)",
  highValue: "Valore alto (> $10.000)",
  zeroValue: "Nessun valore",
  
  // Estados de loading
  loading: "Caricamento...",
  loadingNFTs: "Caricamento NFT...",
  noNFTsFound: "Nessun NFT trovato",
  connectWallet: "Connetti wallet",
  connectWalletDescription: "Connetti il tuo wallet per vedere i tuoi NFT Uniswap",
  
  // Información de NFTs
  nftId: "ID NFT",
  network: "Rete",
  tokens: "Token",
  fee: "Commissioni",
  value: "Valore",
  estimatedValue: "Valore stimato",
  
  // Acciones
  viewDetails: "Visualizza dettagli",
  manage: "Gestisci",
  activate: "Attiva",
  deactivate: "Disattiva",
  
  // Sorting
  sortBy: "Ordina per",
  sortByTokenId: "ID Token",
  sortByValue: "Valore",
  sortByStatus: "Stato",
  sortByNetwork: "Rete",
  ascending: "Crescente",
  descending: "Decrescente",
  
  // Diálogos y modales
  nftDetails: "Dettagli NFT",
  nftDetailsTitle: "Informazioni NFT",
  close: "Chiudi",
  save: "Salva",
  cancel: "Annulla",
  
  // Mensajes de estado
  nftActivated: "NFT attivato con successo",
  nftDeactivated: "NFT disattivato con successo",
  errorActivating: "Errore nell'attivazione NFT",
  errorDeactivating: "Errore nella disattivazione NFT",
  errorLoading: "Errore nel caricamento NFT",
  errorRefreshing: "Errore nell'aggiornamento dati",
  
  // Información detallada
  contractAddress: "Indirizzo contratto",
  poolAddress: "Indirizzo pool",
  feeTier: "Livello commissioni",
  imageUrl: "URL immagine",
  createdAt: "Creato il",
  updatedAt: "Aggiornato il",
  
  // Admin específico
  adminPanel: "Pannello admin",
  adminActions: "Azioni admin",
  bulkActions: "Azioni di massa",
  selectAll: "Seleziona tutto",
  clearSelection: "Cancella selezione",
  
  // Contadores
  totalNFTs: "NFT totali",
  activeNFTs: "NFT attivi",
  managedNFTs: "NFT gestiti",
  unmanaged: "Non gestiti",
  
  // Tooltips y ayuda
  refreshTooltip: "Aggiorna lista NFT",
  filtersTooltip: "Mostra opzioni filtro",
  viewModeTooltip: "Cambia modalità visualizzazione",
  networkTooltip: "Filtra per rete blockchain",
  managedOnlyTooltip: "Mostra solo NFT gestiti",
  
  // Errores específicos
  noPermission: "Non hai il permesso per questa azione",
  networkError: "Errore di connessione di rete",
  apiError: "Errore API",
  
  // Success messages
  refreshSuccess: "Dati aggiornati con successo",
  updateSuccess: "Modifiche salvate con successo",
  
  // Placeholders
  searchPlaceholder: "Cerca NFT...",
  noResults: "Nessun risultato trovato",
  emptyState: "Nessun NFT da mostrare",
  
  // Links y navegación
  backToWallet: "Torna al wallet",
  openInExplorer: "Apri nell'explorer",
  viewOnUniswap: "Visualizza su Uniswap"
};


// Objeto principal de traducciones
export const nftsTranslations = {
  es,
  en,
  fr,
  de,
  zh,
  pt,
  hi,
  ar,
  it,
  ru
};