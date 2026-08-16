import { motion } from 'framer-motion';
import { X, ShoppingBag, Compass, ChevronRight, Info, Check } from 'lucide-react';
import type { BagItem } from '@/types';
import { buildAffiliateLink } from '@/data';
import { useLang, type Lang } from '@/i18n';

interface ItemDetailSheetProps {
  item: BagItem;
  showStoreLinks: boolean;
  onClose: () => void;
  onMarkReady: () => void;
}

const GROUP_LABELS: Record<string, Record<Lang, string>> = {
  shelter: { tr: 'Barınak', en: 'Shelter', fr: 'Abri', es: 'Refugio' },
  clothing: { tr: 'Giyim', en: 'Clothing', fr: 'Vêtements', es: 'Ropa' },
  kitchen: { tr: 'Mutfak', en: 'Kitchen', fr: 'Cuisine', es: 'Cocina' },
  other: { tr: 'Diğer', en: 'Other', fr: 'Autre', es: 'Otros' },
  shelter_pack: { tr: 'Barınma & Taşıma', en: 'Shelter & Pack', fr: 'Abri & Transport', es: 'Refugio y Transporte' },
  technical: { tr: 'Teknik', en: 'Technical', fr: 'Technique', es: 'Técnico' },
  electronics: { tr: 'Elektronik & Medya', en: 'Electronics & Media', fr: 'Électronique & Médias', es: 'Electrónica y Medios' },
  nutrition: { tr: 'Beslenme', en: 'Nutrition', fr: 'Nutrition', es: 'Nutrición' },
  safety: { tr: 'Güvenlik', en: 'Safety', fr: 'Sécurité', es: 'Seguridad' },
};

const ITEM_REASONS: Record<string, Record<Lang, string>> = {
  'camp-tent-3season': {
    tr: "Gece sıcaklığı 6°C'ye düşebileceği için 3 mevsim çadır, rüzgar ve hafif yağmura karşı korunma sağlar.",
    en: 'Night temperatures can drop to 6°C; a 3-season tent provides protection from wind and light rain.',
    fr: "Les températures nocturnes peuvent descendre à 6°C; une tente 3 saisons protège du vent et de la pluie légère.",
    es: 'Las temperaturas nocturnas pueden bajar a 6°C; una tienda de 3 estaciones protege del viento y lluvia ligera.',
  },
  'camp-sleeping-bag': {
    tr: 'Kaz tüyü dolgulu uyku tulumu, gece sıcaklıklarına karşı termal konforun anahtarıdır.',
    en: 'A down-filled sleeping bag is key for thermal comfort against night temperatures.',
    fr: 'Un sac de couchage en plume est essentiel pour le confort thermique nocturne.',
    es: 'Un saco de dormir de pluma es clave para el confort térmico nocturno.',
  },
  'camp-sleeping-pad': {
    tr: 'Yerden gelen soğuğu keser ve uyku konforunu artırır; şişme mat en iyi yalıtım/ağırlık oranını sunar.',
    en: 'Cuts ground cold and improves sleep comfort; inflatable pad offers the best insulation-to-weight ratio.',
    fr: "Coupe le froid du sol et améliore le confort; le matelas gonflable offre le meilleur ratio isolation/poids.",
    es: 'Corta el frío del suelo y mejora el confort; la colchoneta inflable ofrece el mejor ratio aislamiento/peso.',
  },
  'camp-merino-base': {
    tr: 'Merinos yün içlik, teri uzaklaştırır ve kokmaz; uzun yürüyüşlerde konforu korur.',
    en: 'Merino wool base layer wicks moisture and resists odor; maintains comfort on long hikes.',
    fr: 'Sous-vêtement mérinos évacue l\'humidité et ne sent pas; confort sur longues randonnées.',
    es: 'Ropa interior de merino evacúa humedad y no huele; confort en largas caminatas.',
  },
  'camp-light-down-jacket': {
    tr: 'Akşam serinliğinde ve sabah erken saatlerde vücut sıcaklığını korur.',
    en: 'Maintains body temperature during evening chill and early morning hours.',
    fr: 'Maintient la chaleur corporelle lors des fraîcheurs du soir et du matin.',
    es: 'Mantiene la temperatura corporal durante el frescor vespertino y matutino.',
  },
  'camp-rain-jacket': {
    tr: 'Beklenmeyen yağmurlarda hem seni hem de iç giysileri korur; nefes alabilir kumaş konfor sağlar.',
    en: 'Protects you and inner layers from unexpected rain; breathable fabric ensures comfort.',
    fr: 'Protège contre la pluie inattendue; tissu respirant pour le confort.',
    es: 'Protege contra lluvia inesperada; tela transpirable para comodidad.',
  },
  'camp-trekking-pants': {
    tr: 'Hızlı kuruyan kumaş, ıslakken bile rahat hareket özgürlüğü sunar.',
    en: 'Quick-drying fabric provides comfortable freedom of movement even when wet.',
    fr: 'Tissu séchage rapide, liberté de mouvement même mouillé.',
    es: 'Tela secado rápido, libertad de movimiento incluso mojado.',
  },
  'camp-neck-gaiter': {
    tr: 'Güneş, rüzgar ve toza karşı çok yönlü koruma; boyun, baş ve yüz için uyarlanabilir.',
    en: 'Versatile protection against sun, wind, and dust; adaptable for neck, head, and face.',
    fr: 'Protection polyvalente contre soleil, vent et poussière; adaptable au cou, tête et visage.',
    es: 'Protección versátil contra sol, viento y polvo; adaptable al cuello, cabeza y cara.',
  },
  'camp-trekking-poles': {
    tr: 'Diz yükünü azaltan, hafif karbon bastonlar; iniş ve çıkışta denge sağlar.',
    en: 'Carbon poles reduce knee load; provide balance on ascents and descents.',
    fr: 'Bâtons carbone réduisent la charge sur les genoux; équilibre en montée et descente.',
    es: 'Bastones de carbono reducen la carga en las rodillas; equilibrio en subidas y bajadas.',
  },
  'camp-titanium-pot': {
    tr: 'Ağırlık fark edilmez ama dayanıklılık yüksektir; uzun ömürlü mutfak çözümü.',
    en: 'Negligible weight but high durability; a long-lasting kitchen solution.',
    fr: 'Poids négligeable mais haute durabilité; solution cuisine longue durée.',
    es: 'Peso insignificante pero alta durabilidad; solución de cocina duradera.',
  },
  'camp-micro-stove': {
    tr: 'Sıcak yemek ve içecek, moral ve enerji için kritiktir; mikro ocağın ağırlığı ihmal edilebilir.',
    en: 'Hot food and drinks are critical for morale and energy; the micro stove\'s weight is negligible.',
    fr: 'Repas chauds critiques pour le moral; poids du réchaud négligeable.',
    es: 'Comida caliente crítica para la moral; peso del fogón insignificante.',
  },
  'camp-titanium-spork': {
    tr: 'Tek bir aletle hem yemek ye hem ağırlıktan tasarruf et.',
    en: 'Eat with a single utensil while saving weight.',
    fr: 'Manger avec un seul ustensile tout en économisant du poids.',
    es: 'Comer con un solo utensilio ahorrando peso.',
  },
  'camp-foldable-bottle': {
    tr: 'Suyu yanında taşımanın en hafif yolu; boşken cepte kaybolur.',
    en: 'The lightest way to carry water; disappears in a pocket when empty.',
    fr: 'La façon la plus légère de transporter de l\'eau; se plie dans une poche.',
    es: 'La forma más ligera de llevar agua; se pliega en un bolsillo.',
  },
  'camp-water-filter': {
    tr: 'Doğal su kaynaklarını güvenle kullanmak için bakteri ve parazit filtreli arıtıcı.',
    en: 'Purifier with bacteria and parasite filter to safely use natural water sources.',
    fr: 'Purificateur avec filtre à bactéries et parasites pour les sources naturelles.',
    es: 'Purificador con filtro de bacterias y parásitos para fuentes naturales.',
  },
  'camp-headlamp': {
    tr: 'Gece kamp kurulumu ve tuvalete gitme için eller serbest aydınlatma şarttır.',
    en: 'Hands-free lighting is essential for nighttime camp setup and bathroom trips.',
    fr: 'Éclairage mains libres essentiel pour l\'installation nocturne du camp.',
    es: 'Iluminación manos libres esencial para montar campamento de noche.',
  },
  'camp-powerbank': {
    tr: 'GPS, telefon ve kafa lambası şarjını güvence altına alır.',
    en: 'Ensures GPS, phone, and headlamp stay charged.',
    fr: 'Garantit la charge du GPS, téléphone et lampe frontale.',
    es: 'Garantiza la carga del GPS, teléfono y lámpara frontal.',
  },
  'camp-first-aid': {
    tr: 'Uzak doğada profesyonel yardım uzak olabilir; temel ilk yardımı yanında bulundur.',
    en: 'Professional help may be far in the wilderness; carry basic first aid.',
    fr: 'L\'aide professionnelle peut être loin; gardez une trousse de premiers secours.',
    es: 'La ayuda profesional puede estar lejos; lleva un botiquín básico.',
  },
  'camp-multi-tool': {
    tr: 'İpi kes, tencereyi aç, vidaları sık; tek bir küçük alet çok iş çözer.',
    en: 'Cut rope, open cans, tighten screws; a single small tool solves many tasks.',
    fr: 'Couper corde, ouvrir boîtes, serrer vis; un seul outil résout beaucoup.',
    es: 'Cortar cuerda, abrir latas, apretar tornillos; una sola herramienta resuelve mucho.',
  },
  'camp-map-compass': {
    tr: 'Su geçirmez topografik bölge haritası ve pusula; elektronik cihazlar başarısız olabilir.',
    en: 'Waterproof topographic map and compass; electronics can fail.',
    fr: 'Carte topographique imperméable et boussole; l\'électronique peut tomber en panne.',
    es: 'Mapa topográfico impermeable y brújula; la electrónica puede fallar.',
  },
  'camp-sunscreen': {
    tr: 'Yüksek koruma faktörü, spor tipi güneş kremi; yüksek irtifada UV çok daha güçlüdür.',
    en: 'High protection factor sport sunscreen; UV is much stronger at altitude.',
    fr: 'Crème solaire sport à facteur élevé; UV beaucoup plus forts en altitude.',
    es: 'Protector solar deportivo de factor alto; UV mucho más fuerte en altitud.',
  },
  'camp-insect-repellent': {
    tr: 'Uzun süre etkili, doğa için uygun sinek kovucu.',
    en: 'Long-lasting, outdoor-grade insect repellent.',
    fr: 'Répulsif longue durée, adapté au plein air.',
    es: 'Repelente de larga duración, apto para exteriores.',
  },
  'camp-trash-bag': {
    tr: 'Doğada iz bırakmamak için atık taşıma torbası.',
    en: 'Waste carry bag for leave-no-trace camping.',
    fr: 'Sac pour transporter les déchets, sans laisser de trace.',
    es: 'Bolsa para residuos, sin dejar rastro.',
  },
  'mtn-4season-tent': {
    tr: 'Yüksek irtifada rüzgar dayanımı için şarttır; 4 mevsim çadır fırtına koşullarında hayati koruma sağlar.',
    en: 'Essential for wind resistance at altitude; 4-season tent provides vital storm protection.',
    fr: 'Essentiel pour la résistance au vent en altitude; tente 4 saisons vitale en tempête.',
    es: 'Esencial para resistencia al viento en altitud; tienda 4 estaciones vital en tormentas.',
  },
  'mtn-expedition-suit': {
    tr: '-15°C ve altında vücut ısısını korur; ekspedisyon sınıfı tulum hipotermiye karşı son bariyerdir.',
    en: 'Maintains body heat at -15°C and below; expedition-grade bag is the last barrier against hypothermia.',
    fr: 'Maintient la chaleur à -15°C et moins; sac d\'expédition est la dernière barrière contre l\'hypothermie.',
    es: 'Mantiene el calor a -15°C y menos; saco de expedición es la última barrera contra la hipotermia.',
  },
  'mtn-sleeping-pad-combo': {
    tr: "Kar ve buz üzerinde yalıtım hayati önem taşır; çift katman R-value'yu yükseltir.",
    en: 'Insulation is critical on snow and ice; dual layers increase R-value.',
    fr: "L'isolation est critique sur neige et glace; double couche augmente la valeur R.",
    es: 'El aislamiento es crítico en nieve y hielo; doble capa aumenta el valor R.',
  },
  'mtn-expedition-pack': {
    tr: 'Ağır yükü uzun mesafelerde ergonomik taşımak için ekspedisyon çantası zorunludur.',
    en: 'An expedition pack is mandatory for carrying heavy loads over long distances ergonomically.',
    fr: 'Un sac d\'expédition est obligatoire pour porter de lourdes charges sur de longues distances.',
    es: 'Una mochila de expedición es obligatoria para cargas pesadas en largas distancias.',
  },
  'mtn-ice-axe': {
    tr: 'Kazma, kar ve buzda kendini emniyete almanın ve tırmanışın temel aracıdır.',
    en: 'An ice axe is the fundamental tool for self-arrest and climbing on snow and ice.',
    fr: 'Le piolet est l\'outil fondamental pour l\'auto-assurance et l\'escalade sur neige et glace.',
    es: 'El piolet es la herramienta fundamental para autoasegurarse y escalar en nieve y hielo.',
  },
  'mtn-crampons': {
    tr: 'Buzlu zeminde kaymayı tamamen engeller; kramponsuz buzulla geçiş son derece risklidir.',
    en: 'Completely prevents slipping on ice; crossing glaciers without crampons is extremely risky.',
    fr: 'Empêche complètement de glisser sur la glace; traverser un glacier sans crampons est très risqué.',
    es: 'Evita completamente resbalar en hielo; cruzar glaciares sin crampones es muy arriesgado.',
  },
  'mtn-climbing-helmet': {
    tr: 'Düşen taş ve buz parçalarına karşı kafanı korur; sertifikalı kask hayat kurtarır.',
    en: 'Protects your head from falling rocks and ice; a certified helmet saves lives.',
    fr: 'Protège la tête contre les chutes de pierres et de glace; un casque certifié sauve des vies.',
    es: 'Protege la cabeza contra caídas de rocas y hielo; un casco certificado salva vidas.',
  },
  'mtn-harness': {
    tr: 'İpe bağlanmanın güvenli yolu; emniyet kemeri tırmanışta hayati öneme sahiptir.',
    en: 'The safe way to tie into a rope; a harness is vital in climbing.',
    fr: 'Le moyen sûr de s\'attacher à une corde; le harnais est vital en escalade.',
    es: 'La forma segura de atarse a una cuerda; el arnés es vital en escalada.',
  },
  'mtn-carabiner-prusik': {
    tr: 'Emniyet sistemini kurar; HMS karabina ve prusik, ip tırmanışının temel bileşenleridir.',
    en: 'Builds the belay system; HMS carabiner and prusik are fundamental to rope climbing.',
    fr: 'Construit le système d\'assurage; mousqueton HMS et prusik sont fondamentaux.',
    es: 'Construye el sistema de aseguramiento; mosquetón HMS y prusik son fundamentales.',
  },
  'mtn-mountaineering-boots': {
    tr: 'Krampon uyumlu, yalıtımlı bot donma riskini azaltır ve teknik tırmanışa izin verir.',
    en: 'Crampon-compatible, insulated boots reduce frostbite risk and allow technical climbing.',
    fr: 'Bottes compatibles crampons et isolées réduisent le risque d\'engelure.',
    es: 'Botas compatibles con crampones y aisladas reducen el riesgo de congelación.',
  },
  'mtn-climbing-rope': {
    tr: 'Dinamik, tekil 60m tırmanış ipi; emniyet sisteminin omurgasıdır.',
    en: 'Dynamic, single 60m climbing rope; the backbone of the belay system.',
    fr: 'Corde dynamique simple de 60m; la colonne vertébrale du système d\'assurage.',
    es: 'Cuerda dinámica simple de 60m; la columna vertebral del sistema de aseguramiento.',
  },
  'mtn-hardshell-jacket': {
    tr: 'Yüksek irtifada rüzgar ve kar yağışına karşı en dış katman; su ve rüzgar geçirmezlik şarttır.',
    en: 'The outermost layer against wind and snow at altitude; waterproof and windproof are essential.',
    fr: 'La couche externe contre le vent et la neige; imperméabilité et coupe-vent essentiels.',
    es: 'La capa externa contra viento y nieve; impermeable y cortaviento esenciales.',
  },
  'mtn-hardshell-pants': {
    tr: 'Bacakları rüzgar ve ıslaklıktan korur; kar derinliğinde giysi ıslanması hipotermi riskidir.',
    en: 'Protects legs from wind and wet; clothing getting wet in deep snow is a hypothermia risk.',
    fr: 'Protège les jambes du vent et de l\'humidité; vêtements mouillés dans la neige = hypothermie.',
    es: 'Protege las piernas del viento y humedad; ropa mojada en nieve = riesgo de hipotermia.',
  },
  'mtn-expedition-parka': {
    tr: 'Dinlenme ve zirve saatlerinde ekstra sıcaklık; ekspedisyon parkası soğukta hayati önem taşır.',
    en: 'Extra warmth during rest and summit pushes; an expedition parka is vital in the cold.',
    fr: 'Chaleur supplémentaire au repos et au sommet; la parka d\'expédition est vitale.',
    es: 'Calor extra en descanso y cima; la parka de expedición es vital.',
  },
  'mtn-glacier-glasses': {
    tr: 'Kar körlüğü riskini kategori 4 lensle engeller; yüksek irtifada UV çok daha güçlüdür.',
    en: 'Prevents snow blindness with category 4 lenses; UV is much stronger at altitude.',
    fr: 'Prévient la cécité des neiges avec des lunettes catégorie 4; UV plus forts en altitude.',
    es: 'Previene la ceguera de la nieve con lentes categoría 4; UV más fuertes en altitud.',
  },
  'mtn-gaiters': {
    tr: 'Kar ve taşların bot içine girmesini engeller; ayak kuru kalır, donma riski azalır.',
    en: 'Prevents snow and debris from entering boots; feet stay dry, frostbite risk decreases.',
    fr: 'Empêche neige et débris d\'entrer dans les bottes; pieds secs, moins de risque d\'engelure.',
    es: 'Evita que nieve y escombros entren en las botas; pies secos, menos riesgo de congelación.',
  },
  'mtn-insulated-gloves': {
    tr: 'Su geçirmez, yüksek yalıtımlı dağcılık eldiveni; el parmaklarında donma riskini önler.',
    en: 'Waterproof, high-insulation gloves; prevent frostbite in fingers.',
    fr: 'Gants imperméables et très isolants; préviennent l\'engelure des doigts.',
    es: 'Guantes impermeables y muy aislantes; previenen la congelación de los dedos.',
  },
  'mtn-balaclava': {
    tr: 'Yüzü rüzgardan ve soğuktan koruyan balaclava; donma riskini ciddi şekilde azaltır.',
    en: 'Balaclava protecting the face from wind and cold; significantly reduces frostbite risk.',
    fr: 'Balaclava protégeant le visage du vent et du froid; réduit le risque d\'engelure.',
    es: 'Balaclava que protege la cara del viento y frío; reduce el riesgo de congelación.',
  },
  'mtn-solar-panel': {
    tr: 'Uzun ekspedisyonlarda elektronik cihazları şarj eder; güneş enerjisi ağırlık kazandırır.',
    en: 'Charges electronics on long expeditions; solar saves weight.',
    fr: 'Charge les appareils sur de longues expéditions; le solaire économise du poids.',
    es: 'Carga dispositivos en expediciones largas; el solar ahorra peso.',
  },
  'mtn-action-camera': {
    tr: 'Eller serbest çekim için göğüs askısı; tırmanış sırasında anı kaydetmenin en hafif yolu.',
    en: 'Chest mount for hands-free filming; the lightest way to record during a climb.',
    fr: 'Harnais torse pour filmer mains libres; le plus léger pour enregistrer en escalade.',
    es: 'Arnés de pecho para grabar manos libres; la forma más ligera de grabar al escalar.',
  },
  'mtn-gps-watch': {
    tr: 'Fırtınada pusula ve GPS tek başına güvenilir navigasyon aracıdır.',
    en: 'In a storm, a GPS watch is the sole reliable navigation tool.',
    fr: 'Dans une tempête, une montre GPS est le seul outil de navigation fiable.',
    es: 'En una tormenta, un reloj GPS es la única herramienta de navegación confiable.',
  },
  'mtn-headlamp': {
    tr: 'Sabah tırmanışları için hayati; soğuğa dayanıklı batarya uzun ömürlü aydınlatma sağlar.',
    en: 'Vital for dawn ascents; cold-resistant battery provides long-lasting light.',
    fr: 'Vital pour les ascensions à l\'aube; batterie résistante au froid.',
    es: 'Vital para ascensos al amanecer; batería resistente al frío.',
  },
  'mtn-powerbank': {
    tr: 'Soğuğa dayanıklı, yüksek kapasiteli powerbank; uzun ekspedisyonlarda güvenlik marjı.',
    en: 'Cold-resistant, high-capacity power bank; safety margin on long expeditions.',
    fr: 'Batterie résistante au froid, haute capacité; marge de sécurité en expédition.',
    es: 'Batería resistente al frío, alta capacidad; margen de seguridad en expedición.',
  },
  'mtn-thermos': {
    tr: 'Zirve gününde sıcak içecek, hem moral hem de iç ısıyı korur.',
    en: 'Hot drinks on summit day maintain both morale and core temperature.',
    fr: 'Boissons chaudes au sommet maintiennent le moral et la température interne.',
    es: 'Bebidas calientes en la cima mantienen la moral y la temperatura interna.',
  },
  'mtn-dehydrated-food': {
    tr: 'Hafif ve besleyici; sıcak suyla hızlı hazırlanır, ağırlık/kalori oranı en iyisidir.',
    en: 'Lightweight and nutritious; quick to prepare with hot water, best weight-to-calorie ratio.',
    fr: 'Léger et nutritif; préparation rapide à l\'eau chaude, meilleur ratio poids/calories.',
    es: 'Ligero y nutritivo; preparación rápida con agua caliente, mejor ratio peso/calorías.',
  },
  'mtn-energy-gels': {
    tr: 'Tırmanış sırasında hızlı enerji; düşük ağırlıkla yüksek kalori sağlar.',
    en: 'Quick energy during climbs; high calories at low weight.',
    fr: 'Énergie rapide pendant l\'escalade; calories élevées, poids faible.',
    es: 'Energía rápida durante escalada; calorías altas, peso bajo.',
  },
  'mtn-bivy': {
    tr: 'Acil durumda hayat kurtarır; beklenmedik fırtınada son sığınak olarak yansıtıcı bivy şarttır.',
    en: 'Saves lives in emergencies; a reflective bivy is the last shelter in an unexpected storm.',
    fr: 'Sauve des vies en urgence; un bivy réfléchissant est le dernier abri en tempête.',
    es: 'Salva vidas en emergencias; un bivy reflectante es el último refugio en tormenta.',
  },
  'mtn-first-aid': {
    tr: 'Dağcılık için kapsamlı ilk yardım çantası; yüksek irtifada yardım uzak olabilir.',
    en: 'Comprehensive first aid kit for mountaineering; help may be far at altitude.',
    fr: 'Trousse de secours complète pour l\'alpinisme; l\'aide peut être loin en altitude.',
    es: 'Botiquín completo para montañismo; la ayuda puede estar lejos en altitud.',
  },
  'mtn-compass-gps': {
    tr: 'Yedek pusula ve el GPS cihazı; elektronik cihazlar başarısız olabilir.',
    en: 'Backup compass and handheld GPS; electronic devices can fail.',
    fr: 'Boussole de secours et GPS portatif; l\'électronique peut tomber en panne.',
    es: 'Brújula de respaldo y GPS portátil; la electrónica puede fallar.',
  },
  'mtn-whistle': {
    tr: 'Sinyal verme ve yardım çağırma için düdük; ses menzili görüş mesafesinden uzaktır.',
    en: 'Whistle for signaling and calling for help; sound range exceeds visual range.',
    fr: 'Sifflet pour signaler et appeler à l\'aide; la portée du son dépasse la vue.',
    es: 'Silbato para señalizar y pedir ayuda; el alcance del sonido supera la vista.',
  },
};

export function ItemDetailSheet({
  item,
  showStoreLinks,
  onClose,
  onMarkReady,
}: ItemDetailSheetProps) {
  const { t, lang } = useLang();
  const Icon = item.icon;
  const isReady = item.status === 'ready';
  const groupLabel = GROUP_LABELS[item.group]?.[lang] || item.group;
  const reason = ITEM_REASONS[item.id]?.[lang] || item.description[lang];

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[55] bg-forest-950/70 backdrop-blur-sm"
      />

      {/* Bottom sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        className="fixed bottom-0 left-0 right-0 z-[56] mx-auto max-w-md rounded-t-3xl bg-forest-900 border-t border-forest-700"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1.5 w-10 rounded-full bg-forest-600" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 flex h-8 w-8 items-center justify-center rounded-lg text-rock-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="px-5 pb-8 pt-2">
          {/* Item image */}
          <div className="relative h-40 w-full overflow-hidden rounded-2xl mb-4">
            <img
              src={item.image}
              alt={item.name[lang]}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ember-500/80 backdrop-blur-sm">
                <Icon className="h-4 w-4 text-white" />
              </div>
              <span className="text-[10px] uppercase tracking-wider text-rock-200 font-medium px-2 py-0.5 rounded-full bg-forest-950/60 backdrop-blur-sm">
                {groupLabel}
              </span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-white mb-1">{item.name[lang]}</h2>
          {item.essential && (
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-ember-500/90 text-white mb-3">
              {t.essential}
            </span>
          )}

          {/* Description */}
          <p className="text-sm text-rock-300 leading-relaxed mb-4">
            {item.description[lang]}
          </p>

          {/* Conditional content */}
          {showStoreLinks ? (
            <div className="space-y-2.5">
              <a
                href={buildAffiliateLink(item.searchName, 'hepsiburada')}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3.5 w-full rounded-2xl bg-forest-800/40 backdrop-blur-md border border-forest-700/60 px-4 py-3.5 transition-all duration-300 hover:bg-forest-800/70 hover:border-ember-500/30 active:scale-[0.98]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ember-500/10 border border-ember-500/20 transition-colors group-hover:bg-ember-500/20">
                  <ShoppingBag className="h-5 w-5 text-ember-400" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-semibold text-white">{t.obtain}</p>
                  <p className="text-xs text-rock-400 leading-snug mt-0.5">
                    {t.obtainSubtext}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-rock-500 group-hover:text-ember-400 group-hover:translate-x-0.5 transition-all shrink-0" />
              </a>
              <a
                href={buildAffiliateLink(item.searchName, 'amazon')}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3.5 w-full rounded-2xl bg-forest-800/40 backdrop-blur-md border border-forest-700/60 px-4 py-3.5 transition-all duration-300 hover:bg-forest-800/70 hover:border-ember-500/30 active:scale-[0.98]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ember-500/10 border border-ember-500/20 transition-colors group-hover:bg-ember-500/20">
                  <Compass className="h-5 w-5 text-ember-400" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-semibold text-white">
                    {t.recommendedGear}
                  </p>
                  <p className="text-xs text-rock-400 leading-snug mt-0.5">
                    {t.recommendedSubtext}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-rock-500 group-hover:text-ember-400 group-hover:translate-x-0.5 transition-all shrink-0" />
              </a>
            </div>
          ) : (
            <div className="flex items-start gap-3 rounded-2xl bg-forest-800/60 border border-forest-700 p-4">
              <Info className="h-5 w-5 text-ember-400 shrink-0 mt-0.5" />
              <p className="text-sm text-rock-300 leading-relaxed">{reason}</p>
            </div>
          )}

          {/* Mark as ready button */}
          {!isReady && (
            <button
              onClick={onMarkReady}
              className="mt-4 flex items-center justify-center gap-2 w-full rounded-2xl bg-success-500/15 border border-success-500/30 px-4 py-3 text-success-400 hover:bg-success-500/25 transition-colors"
            >
              <Check className="h-4 w-4" />
              <span className="text-sm font-semibold">{t.markReady}</span>
            </button>
          )}
        </div>
      </motion.div>
    </>
  );
}
