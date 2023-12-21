# Sujan Sapkota (Studentennummer)

> Duid aan welke vakken je volgt en vermeld voor deze vakken de link naar jouw GitHub repository. In het geval je slechts één vak volgt, verwijder alle inhoud omtrent het andere vak uit dit document.
> Lees <https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet> om te weten hoe een Markdown-bestand opgemaakt moet worden.
> Verwijder alle instructies (lijnen die starten met >).

- [x] Front-end Web Development
  - <https://github.com/Web-IV/2324-frontendweb-sujansapkota2>
  - <https://fwd-movie-app.onrender.com/>
- [x] Web Services: GITHUB URL
  - <https://github.com/Web-IV/2324-webservices-sujansapkota2>
  - <https://be-movie-app-0bry.onrender.com>

**Logingegevens**

- Gebruikersnaam/e-mailadres: janadmin@gmail.com
- Wachtwoord: verydifficult

- Gebruikersnaam/e-mailadres: januser@gmail.com
- Wachtwoord: verydifficult

## Projectbeschrijving

> Omschrijf hier duidelijk waarover jouw project gaat. Voeg een domeinmodel (of EERD) toe om jouw entiteiten te verduidelijken.

## Screenshots

> Voeg enkele (nuttige!) screenshots toe die tonen wat de app doet.
> Dit is weinig zinvol indien je enkel Web Services volgt, verwijder dan deze sectie.

## API calls

> Maak hier een oplijsting van alle API cals in jouw applicatie. Groepeer dit per entiteit. Hieronder een voorbeeld.
> Dit is weinig zinvol indien je enkel Front-end Web Development volgt, verwijder dan deze sectie.
> Indien je als extra Swagger koos, dan voeg je hier een link toe naar jouw online documentatie. Swagger geeft nl. exact (en nog veel meer) wat je hieronder moet schrijven.

### Gebruikers

- `GET /api/users`: alle gebruikers ophalen
- `GET /api/users/:id`: gebruiker met een bepaald id ophalen
- `GET  /api/users/:userId/movies/:movieId/reviews`: geef alle reviews van een bepaalde(met id) gebruiker voor een bepaalde movie (met id)
- `POST /api/users/login` logt de gebruiker in
- `POST /api/users/register` regristeert de gebruiker
-

### Movies

- `GET /api/movies`: alle movies ophalen
- `GET /api/movies/:id`: movie met een bepaald id ophalen
- `GET /api/movies/genres`: alle genres die bij movies kunnen horen ophalen
- `GET /api/movies/:id/genres`: alle genres die bij een movie met bepaald id horen ophalen
- `GET /api/movies/:id/reviews`: alle reviews die bij een bepaald movie horen ophalen
- `GET /api/movies/:id/review`: haal review voor een movie met bepaald id
- `GET /api/movies/:id/rating`: haal rating voor een movie met bepaald id
- `POST /api/movies/`: movie toevoegen
- `DELETE /api/movies/:id` movie met een bepaald id verwijderen

### Reviews

- `GET /api/reviews`: alle reviews ophalen (voor ingelogd gebruiker)
- `GET /api/reviews/:id`: haal een review met een bepaald id
- `POST /api/reviews/`: review toevoegen
- `PUT /api/reviews/:id` review met een bepaald id updaten
- `DELETE /api/reviews/:id` review met een bepaald id verwijderen

## Behaalde minimumvereisten

> Duid per vak aan welke minimumvereisten je denkt behaald te hebben

### Front-end Web Development

- **componenten**

  - [x] heeft meerdere componenten - dom & slim (naast login/register)
  - [x] applicatie is voldoende complex
  - [x] definieert constanten (variabelen, functies en componenten) buiten de component
  - [x] minstens één form met meerdere velden met validatie (naast login/register)
  - [x] login systeem
        <br />

- **routing**

  - [x] heeft minstens 2 pagina's (naast login/register)
  - [x] routes worden afgeschermd met authenticatie en autorisatie
        <br />

- **state-management**

  - [x] meerdere API calls (naast login/register)
  - [x] degelijke foutmeldingen indien API-call faalt
  - [x] gebruikt useState enkel voor lokale state
  - [x] gebruikt gepast state management voor globale state - indien van toepassing
        <br />

- **hooks**

  - [x] gebruikt de hooks op de juiste manier
        <br />

- **varia**

  - [x] een aantal niet-triviale e2e testen
  - [x] minstens één extra technologie
  - [x] maakt gebruik van de laatste ES-features (async/await, object destructuring, spread operator...)
  - [x] duidelijke en volledige README.md
  - [x] volledig en tijdig ingediend dossier en voldoende commits

### Web Services

- **datalaag**

  - [x] voldoende complex (meer dan één tabel, 2 een-op-veel of veel-op-veel relaties)
  - [x] één module beheert de connectie + connectie wordt gesloten bij sluiten server
  - [x] heeft migraties - indien van toepassing
  - [x] heeft seeds
        <br />

- **repositorylaag**

  - [x] definieert één repository per entiteit (niet voor tussentabellen) - indien van toepassing
  - [x] mapt OO-rijke data naar relationele tabellen en vice versa - indien van toepassing
        <br />

- **servicelaag met een zekere complexiteit**

  - [x] bevat alle domeinlogica
  - [x] bevat geen SQL-queries of databank-gerelateerde code
        <br />

- **REST-laag**

  - [x] meerdere routes met invoervalidatie
  - [x] degelijke foutboodschappen
  - [x] volgt de conventies van een RESTful API
  - [x] bevat geen domeinlogica
  - [x] geen API calls voor entiteiten die geen zin hebben zonder hun ouder (bvb tussentabellen)
  - [x] degelijke authorisatie/authenticatie op alle routes
        <br />

- **algemeen**

  - [x] er is een minimum aan logging voorzien
  - [x] een aantal niet-triviale integratietesten (min. 1 controller >=80% coverage)
  - [x] minstens één extra technologie
  - [x] maakt gebruik van de laatste ES-features (async/await, object destructuring, spread operator...)
  - [x] duidelijke en volledige README.md
  - [x] volledig en tijdig ingediend dossier en voldoende commits

## Projectstructuur

### Front-end Web Development

> Hoe heb je jouw applicatie gestructureerd (mappen, design patterns, hiërarchie van componenten, state...)?

### Web Services

> Hoe heb je jouw applicatie gestructureerd (mappen, design patterns...)?

## Extra technologie

### Front-end Web Development

#### CHAKRA UI

> Wat is de extra technologie? Hoe werkt het? Voeg een link naar het npm package toe!

<https://www.npmjs.com/package/@chakra-ui/react>

### Web Services

#### PRISMA

<https://www.npmjs.com/package/prisma>

Prisma is een ORM

> Wat is de extra technologie? Hoe werkt het? Voeg een link naar het npm package toe!

## Testresultaten

### Front-end Web Development

> Schrijf hier een korte oplijsting en beschrijving van de geschreven testen

### Web Services

> Schrijf hier een korte oplijsting en beschrijving van de geschreven testen + voeg een screenshot van de coverage en uitvoering toe

Ik heb ervoor gekozen om `/api/movies` endpoint te teste (100% coverage rest-serive-repo)

## Gekende bugs

### Front-end Web Development

### Web Services

## Wat is er verbeterd/aangepast?

> Deze sectie is enkel voor 2e zittijd, verwijder deze in 1e zittijd.

### Front-end Web Development

- Dit en dat

### Web Services

- Oh en dit ook
