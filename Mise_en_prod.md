## Android

Modifier la `versionCode` et `versionName` dans `src-capacitor/android/app/build.graddle`

```
yarn capacitor:build:android // build les assets (et un apk mais inutile ici)
yarn capacitor:release:android // build un bundle à partir des assets
```

Déposer le fichier `session.aab` sur la console google play, ne pas oublier de changer les notes de release

Modifier la `versionCode` sur le git

## iOS

Modifier la `BundleInfoDictionnaryVersion`, `CFBundleVersion` (même valeur que `BundleInfoDictionnaryVersion`) et `BundleShortVersionString` dans `src-capacitor/ios/App/App/Info.plist`

```
yarn capacitor:build:ios
```

Cliquer sur `App` en haut de Xcode et sélectionner `Build > Any iOS Device`, puis sélectionner `Product > Archive`

Une fois la nouvelle fenêtre ouverte (automatiquement), cliquer sur la dernière archive (éventuellement supprimer les anciennes) et sur `Distribute App`

Cliquer sur `Next` sans changer les paramètres, puis sur `Upload`

Attendre un temps aléatoire qu'Apple fasse des choses inconnues, puis se rendre sur l'appStoreConnect > My Apps > Session > Bouton bleu `+` à côté de `iOS App` > donner le numéro de version (string) > donner les notes de release et sélectionner l'archive qui a été validée par Apple

Enfin, cliquer sur `Save` et `Add for review` en haut à droite de la page

Modifier la `versionCode` sur le git
