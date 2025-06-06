# Questions

## English Questions

- Number of wedding cake tiers?
  - Under 2 | Over 2
- First dance length?
  - Below 3 minutes | Over 3 minutes
- Will the first dance be on an Ed Sheeran's song?
  - Yes | No
- When will first dance take place?
  - Before dinner | After dinner
- Will Mary toss her bouquet?
  - Yes | No
- Will Mary wear a party dress on the dancefloor?
  - Yes | No
- Length of Best man's speech?
  - Under 4 minutes | Over 4 minutes
- Length of Maid of Honour's speech?
  - Under 4 minutes | Over 4 minutes
- How many people cry while giving their toasts?
  - Under 2 | Over 2

## French Questions

- Nombre d'étages du gâteau de mariage?
  - Moins de 2 | Plus de 2
- Durée de la première danse?
  - Moins de 3 minutes | Plus de 3 minutes
- La première danse sera-t-elle sur une chanson d'Ed Sheeran ?
  - Oui | Non
- Quand aura lieu la première danse?
  - Avant le dîner | Après le dîner
- Mary lancera-t-elle son bouquet?
  - Oui | Non
- Mary portera-t-elle une robe de soirée sur la piste de danse?
  - Oui | Non
- Durée du discours du garçon d'honneur?
  - Moins de 4 minutes | Plus de 4 minutes
- Durée du discours de la demoiselle d'honneur?
  - Moins de 4 minutes | Plus de 4 minutes
- Combien de personnes pleureront en faisant leurs toasts?
  - Moins de 2 | Plus de 2

# Feature Flags

These feature flags are needed in the `features` table to make the application work properly.

```tsx
const FEATURE_CREATE_QUESTION = "admin:questions:create";
const FEATURE_DELETE_QUESTION = "admin:questions:delete";
const FEATURE_UPDATE_QUESTION = "admin:questions:update";
const FEATURE_PLAY_GAME = "public:game:view";
const FEATURE_SHOW_LOGIN_ICON_NAVBAR = "public:navbar:login";
const FEATURE_SHOW_SEARING_CHART = "public:page:seating";
```
