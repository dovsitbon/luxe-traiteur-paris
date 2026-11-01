# LUXE TRAITEUR PARIS · Contenu du site (FR / EN)

Document de validation pour le client. Chaque ligne correspond à un texte du site ; la colonne de gauche indique où il apparaît.
Pour modifier un texte : `locales/fr.json` et `locales/en.json`, puis `npm run build` (ce fichier se régénère avec `npm run contenu`).

## Informations à demander au client

1. **Salle de réception** (story « Lieu & Location ») : nom, adresse, capacité assise et cocktail, équipements (piste, sono, parking, accès PMR, horaires de fin), photos HD. Emplacements marqués `À REMPLIR` sur l'accueil et la page Location de salles ; une photo de réception sert de visuel provisoire.
2. **Menus et formules** : exemples de menus, de pièces cocktail et de desserts (même sans prix publics), pour enrichir la page Mariages et la section « La table ».
3. **Mention halal** : le hashtag #traiteurparishalal apparaît sur Instagram. Rien n'est écrit sur le site tant que le client n'a pas confirmé la formulation (halal, certification, sans alcool…).
4. **Zones et frais de déplacement** : « partout en France » est annoncé ; préciser les conditions hors Île-de-France.
5. **Vrais avis clients** (story « Avis Clients ») : texte, prénom, type d'événement, date. Trois emplacements `À REMPLIR avec de vrais avis clients` attendent sur l'accueil. Aucun avis n'a été inventé.
6. **Mentions légales** : raison sociale, forme juridique, SIRET, adresse du siège, directeur de la publication.
7. **Médias en haute qualité** : seules les 12 publications visibles sans connexion sur Instagram ont pu être récupérées (logo + 11 reels + 1 photo). Les photos du site sont extraites des reels (qualité téléphone, montages avec effets). Demander les photos et vidéos originales, notamment : réceptions d'entreprise, baptêmes, anniversaires (filtres masqués tant qu'ils sont vides), stories à la une « Nos Événements » et « Décorations ».
8. **E-mail de contact** : pour activer l'envoi du devis par e-mail (Formspree ou équivalent), créer le formulaire puis définir `FORM_ENDPOINT` dans Vercel. Sans cela, seul l'envoi WhatsApp est proposé.
9. **Nom de domaine** : le site est prévu pour `luxe-traiteur-paris.vercel.app` ; définir `SITE_URL` si un domaine est acheté.

## Textes


### Référencement (titre et description Google)

| Emplacement | Français | English |
|---|---|---|
| meta.home.title | Traiteur haut de gamme à Paris, mariages \| Luxe Traiteur | Luxury Wedding & Event Caterer, Paris \| Luxe Traiteur |
| meta.home.description | Traiteur de luxe à Paris et en Île-de-France : mariages, baptêmes, cocktails et repas d'affaires. Buffets, décoration, service et location de salle. | Luxury catering in Paris and Île-de-France for weddings, christenings, cocktail parties and corporate events. Buffets, decor, staff and venue hire. |
| meta.mariages.title | Traiteur mariage Paris et Île-de-France \| Luxe Traiteur | Wedding Caterer in Paris & Île-de-France \| Luxe Traiteur |
| meta.mariages.description | Vin d'honneur, dîner assis ou buffet, pièce montée et desserts : Luxe Traiteur orchestre votre réception de mariage à Paris, en Île-de-France et partout en France. | Drinks reception, seated dinner or buffets, wedding cake and desserts: Luxe Traiteur runs your wedding reception in Paris, the Île-de-France region and across France. |
| meta.location.title | Location de salle de réception en Île-de-France \| Luxe Traiteur | Reception Venue Hire near Paris \| Luxe Traiteur |
| meta.location.description | Louez une salle de réception en Île-de-France avec traiteur, décoration et service compris. Mariages, baptêmes, anniversaires et soirées d'entreprise. | Hire a reception venue in the Paris region with catering, decor and service included. Weddings, christenings, birthdays and corporate evenings. |
| meta.realisations.title | Nos réceptions : mariages, cocktails, événements \| Luxe Traiteur | Our Receptions: Weddings, Cocktails, Events \| Luxe Traiteur |
| meta.realisations.description | Mariages, cocktails dînatoires, buffets et soirées d'entreprise réalisés par Luxe Traiteur à Paris et en Île-de-France. Photos et vidéos de nos réceptions. | Weddings, cocktail parties, buffets and corporate evenings catered by Luxe Traiteur in Paris and the Île-de-France region. Photos and videos of our receptions. |
| meta.devis.title | Demande de devis traiteur \| Luxe Traiteur Paris | Request a Catering Quote \| Luxe Traiteur Paris |
| meta.devis.description | Décrivez votre événement en deux minutes : date, lieu, nombre d'invités, prestations. Nous revenons vers vous avec un menu et un devis sur mesure. | Tell us about your event in two minutes: date, venue, guest count, services. We'll come back to you with a tailored menu and quote. |
| meta.legal.title | Mentions légales \| Luxe Traiteur Paris | Legal Notice \| Luxe Traiteur Paris |
| meta.legal.description | Mentions légales et politique de confidentialité du site Luxe Traiteur Paris. | Legal notice and privacy policy for the Luxe Traiteur Paris website. |

### Menu

| Emplacement | Français | English |
|---|---|---|
| nav.skip | Aller au contenu | Skip to content |
| nav.main | Navigation principale | Main navigation |
| nav.menu | Menu | Menu |
| nav.close | Fermer le menu | Close menu |
| nav.home | Accueil | Home |
| nav.services | Prestations | Services |
| nav.weddings | Mariages | Weddings |
| nav.venue | Location de salles | Venue hire |
| nav.work | Réalisations | Our work |
| nav.reviews | Avis | Reviews |
| nav.contact | Contact | Contact |
| nav.quote | Demander un devis | Request a quote |
| nav.langLabel | Langue du site | Site language |

### Écran d'ouverture

| Emplacement | Français | English |
|---|---|---|
| intro.brand | Luxe Traiteur | Luxe Traiteur |
| intro.tagline | L'excellence au service de vos réceptions | Excellence in the service of your receptions |
| intro.skip | Passer | Skip |

### Haut de page (vidéo)

| Emplacement | Français | English |
|---|---|---|
| hero.eyebrow | Traiteur haut de gamme · Paris | Luxury catering · Paris |
| hero.title | L'excellence au service de vos réceptions | Excellence in the service of your receptions |
| hero.sub | Mariages, baptêmes, cocktails et dîners d'affaires. La cuisine, la décoration et le service, pensés ensemble jusqu'au dernier détail. | Weddings, christenings, cocktail parties and business dinners. Food, decor and service, planned together down to the last detail. |
| hero.ctaQuote | Demander un devis | Request a quote |
| hero.ctaServices | Découvrir nos prestations | Explore our services |
| hero.scroll | Défiler | Scroll |

### Bandeau confiance

| Emplacement | Français | English |
|---|---|---|
| trust.0 | Traiteur premium | Premium caterer |
| trust.1 | Organisation millimétrée | Meticulous planning |
| trust.2 | Service irréprochable | Flawless service |
| trust.3 | Paris, Île-de-France et partout en France | Paris, Île-de-France and all of France |

### Nos prestations

| Emplacement | Français | English |
|---|---|---|
| services.kicker | Nos prestations | Our services |
| services.title | Une maison, toutes vos réceptions | One house for every kind of reception |
| services.intro | Du vin d'honneur pour trois cents invités au déjeuner d'affaires en petit comité, nous prenons en charge la table, le décor et le service. Vous recevez, nous nous occupons du reste. | From a drinks reception for three hundred guests to an intimate business lunch, we take care of the table, the setting and the service. You host; we handle the rest. |
| services.more | En savoir plus | Find out more |
| services.items.0.id | mariages | mariages |
| services.items.0.title | Mariages | Weddings |
| services.items.0.text | Vin d'honneur, dîner assis ou buffets, desserts et pièce montée : une réception complète, du premier verre au dernier café. | Drinks reception, seated dinner or buffets, desserts and wedding cake: a complete reception, from the first glass to the last coffee. |
| services.items.1.id | cocktails | cocktails |
| services.items.1.title | Cocktails et soirées | Cocktail parties |
| services.items.1.text | Pièces salées et sucrées, verrines, bar à jus et buffets dressés pour une soirée où l'on circule, on goûte et on se retrouve. | Savoury and sweet canapés, verrines, a fresh juice bar and dressed buffets, for an evening where guests mingle, taste and talk. |
| services.items.2.id | affaires | affaires |
| services.items.2.title | Repas d'affaires | Business events |
| services.items.2.text | Séminaires, lancements, déjeuners clients : une prestation ponctuelle, discrète et à l'heure, qui reflète l'image de votre entreprise. | Seminars, launches and client lunches: punctual, discreet catering that reflects the standing of your company. |
| services.items.3.id | familles | familles |
| services.items.3.title | Baptêmes et familles | Christenings and family |
| services.items.3.text | Baptêmes, fiançailles, anniversaires et brunchs : des moments de famille servis avec la même exigence qu'un grand mariage. | Christenings, engagements, birthdays and brunches: family occasions served with the same care as a grand wedding. |
| services.items.4.id | decoration | decoration |
| services.items.4.title | Décoration | Decor |
| services.items.4.text | Centres de table, art de la table, coin des mariés : nous habillons la salle pour qu'elle ressemble à votre événement. | Centrepieces, tableware and the couple's lounge: we dress the room so it feels like your event. |
| services.items.5.id | service | service |
| services.items.5.title | Service | Service |
| services.items.5.text | Maîtres d'hôtel et serveurs en tenue, mise en place, service à l'assiette ou au buffet, débarrassage : une équipe formée et coordonnée. | Uniformed head waiters and staff, set-up, plated or buffet service and clearing: a trained, well-coordinated team. |

### Mariages

| Emplacement | Français | English |
|---|---|---|
| weddings.kicker | Mariages | Weddings |
| weddings.title | Le jour J, chaque moment a sa table | On the day, every moment has its table |
| weddings.intro | Un mariage se reçoit en plusieurs temps. Nous construisons avec vous le déroulé, le menu et la mise en scène de chacun, pour que vos invités passent d'un moment à l'autre sans jamais attendre. | A wedding reception unfolds in stages. We plan the timeline, the menu and the setting of each one with you, so your guests move from one to the next without ever waiting. |
| weddings.steps.0.title | Le vin d'honneur | The drinks reception |
| weddings.steps.0.text | Pièces cocktail, ateliers et buffets dressés, bar à jus et rafraîchissements, servis pendant que les photos se font. | Canapés, food stations and dressed buffets, a fresh juice bar and soft drinks, served while the photos are taken. |
| weddings.steps.1.title | Le dîner | The dinner |
| weddings.steps.1.text | Service à l'assiette ou grands buffets, selon votre salle et votre nombre d'invités. Entrée, plat, fromages : le menu se compose avec vous. | Plated service or grand buffets, depending on your venue and guest count. Starter, main, cheese: the menu is built with you. |
| weddings.steps.2.title | Le dessert | Dessert |
| weddings.steps.2.text | Pièce montée, buffet de desserts, mignardises et café, pour terminer la soirée sur une belle table sucrée. | Wedding cake, a dessert buffet, petits fours and coffee, to close the evening on a beautiful sweet table. |
| weddings.cta | Préparer mon mariage | Plan my wedding |
| weddings.teaser | Découvrir la réception de mariage | See the wedding reception |
| weddings.videoLabel | Salle de mariage dressée, tables rondes et lustres | Wedding venue set with round tables and chandeliers |
| weddings.pageTitle | Traiteur de mariage à Paris et en Île-de-France | Wedding caterer in Paris and the Île-de-France region |
| weddings.pageIntro | Depuis le vin d'honneur jusqu'au dessert, nous prenons en charge la cuisine, la décoration de table et le service de votre mariage. Une seule maison, un seul interlocuteur, et une équipe qui connaît votre déroulé par cœur. | From the drinks reception to dessert, we handle the food, table decor and service for your wedding. One house, one point of contact, and a team that knows your timeline by heart. |
| weddings.includedTitle | Ce que nous prenons en charge | What we take care of |
| weddings.included.0 | Création d'un menu sur mesure, ajusté avec vous | A tailored menu, refined with you |
| weddings.included.1 | Buffets et pièces cocktail du vin d'honneur | Canapés and buffets for the drinks reception |
| weddings.included.2 | Dîner servi à l'assiette ou en buffets | Plated or buffet dinner |
| weddings.included.3 | Desserts, pièce montée et mignardises | Desserts, wedding cake and petits fours |
| weddings.included.4 | Art de la table, centres de table et coin des mariés | Tableware, centrepieces and the couple's lounge |
| weddings.included.5 | Maîtres d'hôtel, serveurs et coordination le jour J | Head waiters, staff and on-the-day coordination |
| weddings.galleryTitle | Quelques réceptions de mariage | A few of our wedding receptions |

### La table

| Emplacement | Français | English |
|---|---|---|
| table.kicker | La table | The table |
| table.title | L'élégance se cache dans les détails | Elegance lies in the details |
| table.intro | Pièces cocktail, buffets et desserts : une cuisine généreuse, dressée avec soin et pensée pour être belle autant que bonne. Nos menus sont composés sur mesure, c'est pourquoi nous ne publions pas de tarifs. | Canapés, buffets and desserts: generous food, carefully presented, made to look as good as it tastes. Every menu is tailored, which is why we don't publish prices. |
| table.cta | Composer mon menu | Build my menu |

### Location de salles

| Emplacement | Français | English |
|---|---|---|
| venue.kicker | Lieu et location | Venue hire |
| venue.title | Une salle pour recevoir, le traiteur en plus | A room to host in, with the caterer included |
| venue.intro | Vous n'avez pas encore de lieu ? Nous mettons à votre disposition une salle de réception en Île-de-France, avec la cuisine, la décoration et le service dans la même prestation. | No venue yet? We offer a reception venue in the Paris region, with food, decor and service in a single package. |
| venue.facts.0.label | Capacité | Capacity |
| venue.facts.0.value | À préciser | To be confirmed |
| venue.facts.1.label | Adresse | Address |
| venue.facts.1.value | Île-de-France, à préciser | Île-de-France, to be confirmed |
| venue.facts.2.label | Formats | Events |
| venue.facts.2.value | Mariage, baptême, anniversaire, soirée d'entreprise | Weddings, christenings, birthdays, corporate evenings |
| venue.equipmentTitle | Équipements | Facilities |
| venue.equipment.0 | Liste à compléter avec le client | List to be completed with the client |
| venue.equipment.1 | Cuisine de préparation pour notre équipe | Prep kitchen for our team |
| venue.equipment.2 | Tables, chaises et art de la table fournis | Tables, chairs and tableware provided |
| venue.cta | Visiter ou réserver la salle | Visit or book the venue |
| venue.ctaMsg | Bonjour, je souhaite visiter ou réserver votre salle de réception. Date envisagée :  | Hello, I would like to visit or book your reception venue. Planned date:  |
| venue.more | Voir la salle | See the venue |
| venue.note | Photos, nom et capacité de la salle à venir. | Venue photos, name and capacity coming soon. |
| venue.pageTitle | Location de salle de réception en Île-de-France | Reception venue hire near Paris |
| venue.pageIntro | Recevoir dans un lieu pensé pour la réception, avec une équipe qui le connaît : c'est ce que nous proposons avec notre salle. Le traiteur, la décoration et le service sont compris dans la même demande de devis. | Host in a room designed for receptions, with a team that knows it well. Catering, decor and service are all covered by the same quote. |
| venue.whyTitle | Pourquoi réserver la salle avec le traiteur | Why book the venue with the caterer |
| venue.why.0.title | Un seul interlocuteur | One point of contact |
| venue.why.0.text | Le lieu, la cuisine, le décor et le service sont coordonnés par la même équipe. | Venue, food, decor and service are coordinated by the same team. |
| venue.why.1.title | Une équipe qui connaît le lieu | A team that knows the room |
| venue.why.1.text | Mise en place, circulation du service, horaires : tout est rodé. | Set-up, service flow, timings: everything runs like clockwork. |
| venue.why.2.title | Un devis global | One quote |
| venue.why.2.text | Vous savez dès le départ ce que comprend votre réception. | You know from the start exactly what your reception includes. |

### Réalisations

| Emplacement | Français | English |
|---|---|---|
| work.kicker | Réalisations | Our work |
| work.title | Nos dernières réceptions | Our latest receptions |
| work.intro | Mariages en grande salle, cocktails, buffets de desserts et soirées : un aperçu de ce que nous avons servi ces derniers mois. | Weddings in grand ballrooms, cocktail parties, dessert buffets and evening events: a glimpse of what we've served in recent months. |
| work.all | Tout | All |
| work.filters.mariages | Mariages | Weddings |
| work.filters.cocktails | Cocktails | Cocktails |
| work.filters.entreprises | Entreprises | Corporate |
| work.filters.baptemes | Baptêmes | Christenings |
| work.filters.anniversaires | Anniversaires | Birthdays |
| work.empty | Les photos de cette catégorie arrivent bientôt. En attendant, retrouvez nos dernières réceptions sur Instagram. | Photos for this category are on their way. In the meantime, see our latest receptions on Instagram. |
| work.seeAll | Voir toutes les réalisations | See all our work |
| work.instagram | Suivre @luxetraiteurparis | Follow @luxetraiteurparis |
| work.open | Agrandir | Enlarge |
| work.close | Fermer | Close |
| work.prev | Précédent | Previous |
| work.next | Suivant | Next |
| work.video | Vidéo | Video |
| work.pageTitle | Nos réceptions à Paris et en Île-de-France | Our receptions in Paris and the Île-de-France region |

### Notre savoir-faire

| Emplacement | Français | English |
|---|---|---|
| craft.kicker | Notre savoir-faire | Our craft |
| craft.title | Chaque service est millimétré, chaque saveur maîtrisée | Every service precisely timed, every flavour mastered |
| craft.paragraphs.0 | Une belle réception ne doit rien au hasard. Avant le jour J, nous calons avec vous le déroulé minute par minute, le nombre de pièces par invité, le placement des buffets et le rôle de chaque membre de l'équipe. | A beautiful reception leaves nothing to chance. Before the day, we set the timeline with you minute by minute, the number of canapés per guest, where the buffets go and what each member of the team will do. |
| craft.paragraphs.1 | En cuisine, tout est préparé et dressé par nos soins. En salle, nos maîtres d'hôtel connaissent le menu, les allergies signalées et les moments clés de la soirée. Vous n'avez à penser qu'à vos invités. | Everything is prepared and plated by our own kitchen. In the room, our head waiters know the menu, any allergies you've flagged and the key moments of the evening. All you have to think about is your guests. |
| craft.points.0.title | Organisation | Planning |
| craft.points.0.text | Un déroulé écrit, validé avec vous, partagé avec toute l'équipe. | A written timeline, approved by you and shared with the whole team. |
| craft.points.1.title | Service | Service |
| craft.points.1.text | Des maîtres d'hôtel en tenue, attentifs et discrets. | Uniformed head waiters, attentive and discreet. |
| craft.points.2.title | Saveurs | Flavour |
| craft.points.2.text | Des menus composés sur mesure, généreux et soignés. | Tailored menus, generous and carefully made. |
| craft.aside | L'art de cuisiner… ou de se défendre contre le beurre fondu. | The art of cooking… or of defending yourself against melted butter. |
| craft.videoLabel | En cuisine, le dressage des desserts avant le service | In the kitchen, plating desserts before service |

### Comment ça marche

| Emplacement | Français | English |
|---|---|---|
| steps.kicker | Comment ça marche | How it works |
| steps.title | Trois étapes, et nous nous occupons du reste | Three steps, and we take care of the rest |
| steps.items.0.title | Vous nous parlez de votre événement | Tell us about your event |
| steps.items.0.text | Date, lieu, nombre d'invités, envies : quelques minutes au téléphone, sur WhatsApp ou via le formulaire. | Date, venue, guest count, what you have in mind: a few minutes by phone, on WhatsApp or through the form. |
| steps.items.1.title | Nous vous proposons un menu et un devis | We send you a menu and a quote |
| steps.items.1.text | Une proposition sur mesure, que nous ajustons ensemble jusqu'à ce qu'elle vous ressemble. | A tailored proposal, which we refine together until it feels right. |
| steps.items.2.title | Le jour J, nous nous occupons de tout | On the day, we handle everything |
| steps.items.2.text | Installation, cuisine, service et débarrassage. Vous profitez de votre réception. | Set-up, cooking, service and clearing. You enjoy your reception. |

### Avis clients

| Emplacement | Français | English |
|---|---|---|
| reviews.kicker | Avis clients | Client reviews |
| reviews.title | Ils nous ont confié leur réception | They trusted us with their reception |
| reviews.intro | Les avis de nos clients sont rassemblés dans nos stories à la une sur Instagram. Ils seront bientôt publiés ici. | Our clients' reviews are gathered in our Instagram story highlights. They will be published here soon. |
| reviews.placeholder | Avis client à venir | Client review coming soon |
| reviews.cta | Lire les avis sur Instagram | Read the reviews on Instagram |

### Demande de devis

| Emplacement | Français | English |
|---|---|---|
| quote.kicker | Demande de devis | Request a quote |
| quote.title | Parlez-nous de votre réception | Tell us about your reception |
| quote.intro | Deux minutes suffisent. Nous revenons vers vous rapidement avec une première proposition. | It takes two minutes. We'll come back to you quickly with a first proposal. |
| quote.progress | Étape {n} sur {total} | Step {n} of {total} |
| quote.back | Retour | Back |
| quote.next | Continuer | Continue |
| quote.submit | Envoyer sur WhatsApp | Send via WhatsApp |
| quote.email | Envoyer plutôt par e-mail | Send by email instead |
| quote.required | Merci de remplir ce champ. | Please fill in this field. |
| quote.sent | Merci, votre demande est envoyée. Nous vous recontactons rapidement. | Thank you, your request has been sent. We'll be in touch shortly. |
| quote.error | L'envoi n'a pas fonctionné. Écrivez-nous directement sur WhatsApp ou au 06 26 82 55 46. | Sending didn't work. Message us directly on WhatsApp or call +33 6 26 82 55 46. |
| quote.privacy | Vos coordonnées servent uniquement à vous répondre. | Your details are only used to reply to you. |
| quote.steps.event | Votre événement | Your event |
| quote.steps.details | Date et lieu | Date and venue |
| quote.steps.guests | Invités et budget | Guests and budget |
| quote.steps.services | Prestations | Services |
| quote.steps.contact | Vos coordonnées | Your details |
| quote.fields.type | Type d'événement | Type of event |
| quote.fields.types.0 | Mariage | Wedding |
| quote.fields.types.1 | Baptême | Christening |
| quote.fields.types.2 | Cocktail ou soirée | Cocktail party or evening |
| quote.fields.types.3 | Repas d'affaires | Business event |
| quote.fields.types.4 | Anniversaire ou brunch | Birthday or brunch |
| quote.fields.types.5 | Autre | Other |
| quote.fields.date | Date de l'événement | Event date |
| quote.fields.dateUnknown | Date pas encore fixée | Date not set yet |
| quote.fields.place | Lieu | Venue |
| quote.fields.placeOptions.0 | J'ai déjà un lieu | I already have a venue |
| quote.fields.placeOptions.1 | Je cherche une salle | I'm looking for a venue |
| quote.fields.address | Ville ou nom du lieu | Town or venue name |
| quote.fields.addressHint | Par exemple : Paris 8e, Château de… | For example: Paris 8th, Château de… |
| quote.fields.guests | Nombre d'invités | Number of guests |
| quote.fields.budget | Budget indicatif | Approximate budget |
| quote.fields.budgets.0 | Moins de 5 000 € | Under €5,000 |
| quote.fields.budgets.1 | 5 000 à 10 000 € | €5,000 to €10,000 |
| quote.fields.budgets.2 | 10 000 à 20 000 € | €10,000 to €20,000 |
| quote.fields.budgets.3 | Plus de 20 000 € | Over €20,000 |
| quote.fields.budgets.4 | Je ne sais pas encore | Not sure yet |
| quote.fields.services | Prestations souhaitées | Services required |
| quote.fields.serviceOptions.0 | Vin d'honneur ou cocktail | Drinks reception or cocktail |
| quote.fields.serviceOptions.1 | Dîner | Dinner |
| quote.fields.serviceOptions.2 | Buffets | Buffets |
| quote.fields.serviceOptions.3 | Desserts et pièce montée | Desserts and wedding cake |
| quote.fields.serviceOptions.4 | Décoration | Decor |
| quote.fields.serviceOptions.5 | Maîtres d'hôtel et serveurs | Head waiters and staff |
| quote.fields.serviceOptions.6 | Location de salle | Venue hire |
| quote.fields.message | Précisions (facultatif) | Anything else (optional) |
| quote.fields.messageHint | Thème, régimes particuliers, déroulé envisagé… | Theme, dietary requirements, planned timeline… |
| quote.fields.name | Nom et prénom | Full name |
| quote.fields.phone | Téléphone | Phone |
| quote.fields.emailField | E-mail | Email |
| quote.wa.hello | Bonjour Luxe Traiteur, je souhaite un devis. | Hello Luxe Traiteur, I would like a quote. |
| quote.wa.type | Événement | Event |
| quote.wa.date | Date | Date |
| quote.wa.place | Lieu | Venue |
| quote.wa.guests | Invités | Guests |
| quote.wa.budget | Budget | Budget |
| quote.wa.services | Prestations | Services |
| quote.wa.message | Précisions | Details |
| quote.wa.contact | Contact | Contact |
| quote.waOpened | WhatsApp s'ouvre avec votre demande déjà rédigée : il ne reste qu'à l'envoyer. | WhatsApp is opening with your request already written: just press send. |

### Contact

| Emplacement | Français | English |
|---|---|---|
| contact.kicker | Contact | Contact |
| contact.title | Une date en tête ? | Have a date in mind? |
| contact.text | Appelez-nous ou écrivez-nous sur WhatsApp. Nous vous répondons rapidement. | Call us or message us on WhatsApp. We'll get back to you quickly. |
| contact.phone | Téléphone | Phone |
| contact.whatsapp | WhatsApp | WhatsApp |
| contact.instagram | Instagram | Instagram |
| contact.zone | Zone d'intervention | Where we work |
| contact.zoneText | Paris, Île-de-France et partout en France | Paris, Île-de-France and all of France |
| contact.waMsg | Bonjour Luxe Traiteur, je souhaite des informations pour une réception. | Hello Luxe Traiteur, I'd like some information about a reception. |

### Pied de page

| Emplacement | Français | English |
|---|---|---|
| footer.signature | L'excellence au service de vos réceptions | Excellence in the service of your receptions |
| footer.list | Mariages · Baptêmes · Événements · Traiteur · Décoration · Service | Weddings · Christenings · Events · Catering · Decor · Service |
| footer.nav | Le site | Site |
| footer.legal | Mentions légales | Legal notice |
| footer.rights | Tous droits réservés. | All rights reserved. |
| footer.credit | Photos et vidéos : réceptions Luxe Traiteur. | Photos and videos: Luxe Traiteur receptions. |

### Bouton WhatsApp

| Emplacement | Français | English |
|---|---|---|
| fab | Écrire sur WhatsApp | Message us on WhatsApp |

### Vidéos

| Emplacement | Français | English |
|---|---|---|
| video.pause | Mettre les vidéos en pause | Pause the videos |
| video.play | Relancer les vidéos | Play the videos |

### Mentions légales

| Emplacement | Français | English |
|---|---|---|
| legalPage.title | Mentions légales | Legal notice |
| legalPage.sections.0.h | Éditeur du site | Publisher |
| legalPage.sections.0.p | Luxe Traiteur Paris. Raison sociale, forme juridique, SIRET et adresse du siège : à compléter. Téléphone : 06 26 82 55 46. | Luxe Traiteur Paris. Company name, legal form, SIRET number and registered address: to be completed. Phone: +33 6 26 82 55 46. |
| legalPage.sections.1.h | Hébergement | Hosting |
| legalPage.sections.1.p | Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis. | Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, United States. |
| legalPage.sections.2.h | Propriété intellectuelle | Intellectual property |
| legalPage.sections.2.p | Les textes, photos, vidéos et le logo de ce site appartiennent à Luxe Traiteur Paris. Toute reproduction sans autorisation est interdite. | The text, photos, videos and logo on this site belong to Luxe Traiteur Paris. Reproduction without permission is prohibited. |
| legalPage.sections.3.h | Données personnelles | Personal data |
| legalPage.sections.3.p | Les informations envoyées par le formulaire de devis (nom, téléphone, e-mail, détails de l'événement) servent uniquement à répondre à votre demande. Elles ne sont ni revendues ni utilisées à d'autres fins. Vous pouvez demander leur suppression à tout moment par téléphone ou WhatsApp. | Information sent through the quote form (name, phone, email, event details) is used only to answer your request. It is never sold or used for any other purpose. You can ask for it to be deleted at any time by phone or WhatsApp. |
| legalPage.sections.4.h | Cookies | Cookies |
| legalPage.sections.4.p | Ce site n'utilise pas de cookies publicitaires ni de mesure d'audience. Votre choix de langue est seulement mémorisé dans votre navigateur. | This site uses no advertising or analytics cookies. Your language choice is simply remembered in your browser. |

### Descriptions des photos (texte alternatif)

| Emplacement | Français | English |
|---|---|---|
| media.mariages/salle-tables-rondes | Salle de mariage dressée, tables rondes et chaises dorées sous les lustres | Wedding ballroom set with round tables and gold chairs beneath chandeliers |
| media.mariages/table-honneur-fleurs | Table d'honneur fleurie et bougies dans une galerie à arcades | Top table with flowers and candles in an arcaded gallery |
| media.mariages/vin-honneur-palmiers | Vin d'honneur servi sous les arcades, invités autour du buffet | Drinks reception under the arcades, guests around the buffet |
| media.mariages/soiree-salle-comble | Soirée de mariage, invités réunis dans la grande salle | Wedding evening, guests gathered in the ballroom |
| media.mariages/salle-centre-de-table | Centres de table de roses blanches et couverts dressés | White rose centrepieces and laid tables |
| media.mariages/soiree-guirlandes | Soirée dansante sous les guirlandes lumineuses | Dancing beneath strings of fairy lights |
| media.buffets-et-plats/buffet-lustres | Buffet de viennoiseries salées et pièces cocktail sous les lustres | Buffet of savoury pastries and canapés beneath chandeliers |
| media.buffets-et-plats/buffet-desserts-bougies | Buffet de desserts aux chandelles | Candlelit dessert buffet |
| media.buffets-et-plats/buffet-invites | Invités au buffet pendant la réception | Guests at the buffet during the reception |
| media.buffets-et-plats/grand-buffet-salle | Grand buffet dressé sur toute la longueur de la salle | A grand buffet running the length of the room |
| media.buffets-et-plats/desserts-roses | Pâtisseries et donuts sur présentoirs | Pastries and doughnuts on stands |
| media.cocktails/bar-a-jus | Bar à jus de fruits frais et fontaines | Fresh fruit juice bar with dispensers |
| media.cocktails/canapes | Canapés et sandwichs pour le cocktail | Canapés and finger sandwiches for the cocktail |
| media.cocktails/buffet-colore | Buffet cocktail fleuri, verrines colorées | Cocktail buffet with flowers and colourful verrines |
| media.cocktails/macarons | Macarons sur présentoir de verre | Macarons on a glass stand |
| media.cocktails/mini-burgers | Mini-burgers et pièces cocktail chaudes | Mini burgers and hot canapés |
| media.cocktails/plateau-sushis | Plateaux de sushis et makis | Platters of sushi and maki |
| media.cocktails/sushis-presentation | Barque de sushis présentée sur le buffet | Sushi boat presented on the buffet |
| media.cocktails/verrines-jus | Verrines et jus servis au vin d'honneur | Verrines and juices served at the drinks reception |
| media.decoration/coin-maries | Coin des mariés, banquette, voilages et lanternes | The couple's lounge with sofa, drapes and lanterns |
| media.decoration/assiette-serviette-noire | Assiette dressée, serviette noire et bijou de serviette | Laid plate with black napkin and jewelled ring |
| media.service-et-coulisses/maitre-hotel-plateaux | Maître d'hôtel en tenue servant les assiettes | Uniformed head waiter carrying plates |
| media.service-et-coulisses/chef-dressage | Le chef dresse le buffet de desserts | The chef dressing the dessert buffet |
| media.service-et-coulisses/brigade-verrines | La brigade prépare les verrines avant le service | The kitchen team preparing verrines before service |
| media.service-et-coulisses/organisation-equipe | Briefing de l'équipe avant la réception | Team briefing before the reception |
