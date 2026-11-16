AlGel v1.0 — ASEM Medya

1. Firebase Authentication > Settings > Authorized domains bölümüne GitHub Pages alan adınızı (kullaniciadi.github.io) ekleyin.
2. Firestore Rules kurallarının Publish ile yayınlandığını doğrulayın.
3. index.html ve manifest.webmanifest dosyalarını GitHub deposunun kök dizinine yükleyin.
4. GitHub > Settings > Pages > Deploy from a branch > main / (root) > Save.
5. GitHub Pages adresini açıp iki hesapla ayrı cihazlardan test edin.

Firestore yolu: shoppingLists/family/items/{otomatikBelgeID}
Kullanıcıların UID'leri Firestore kurallarında ve uygulamada sınırlandırılmıştır. Gerçek erişim güvenliğini Firestore Rules sağlar.
Şifreleri GitHub'a yüklemeyin. Firebase apiKey web uygulaması için genel yapılandırma bilgisidir.
