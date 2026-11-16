# AlGel v2.0 — Kurulum ve kullanım

## Dosyalar
- `index.html`: uygulama arayüzü
- `app.js`: Firebase bağlantısı ve işlevler
- `style.css`: açık/koyu tasarım
- `manifest.webmanifest`, `icon-192.png`, `icon-512.png`: iPhone ana ekran simgesi / PWA
- `sw.js`: uygulama dosyalarının çevrimdışı önbelleği
- `firestore.rules`: Firebase konsoluna ayrıca uygulanacak kurallar (GitHub'a yüklemek kuralları değiştirmez)

## Mevcut verileri koruma
v1.0 alışveriş ürünleri `shoppingLists/family/items` altında kalır. **Bu koleksiyonu silmeyin.** v2.0 varsayılan **Ortak aile listesi** olarak aynı yolu kullanır. Yeni listeler `shoppingLists/family/listMeta/{listId}/items` altında saklanır. Eski ürünler otomatik taşınmaz veya değiştirilmez. Önce Firebase'de yedek almanız önerilir.

## Adım adım
1. GitHub `ahmetyildirim-tr/AlGel` deposunun `main` dalına `index.html`, `app.js`, `style.css`, `sw.js`, `manifest.webmanifest`, `icon-192.png`, `icon-512.png` dosyalarını **aynı kök klasöre** yükleyin. Mevcut `index.html` dosyasını değiştirin.
2. Firebase Console → Firestore Database → Rules'a girin. `firestore.rules` dosyasının içeriğini kurallara yapıştırıp **Publish** seçin. Mevcut kuralların yerine geçer; mevcut verileri silmez. GitHub'a `firestore.rules` yüklemek tek başına yeterli değildir.
3. Firebase Authentication → Settings → Authorized domains içinde `ahmetyildirim-tr.github.io` alan adının izinli olduğunu doğrulayın.
4. GitHub Pages adresiniz `https://ahmetyildirim-tr.github.io/AlGel/` üzerinden uygulamayı açın. Değişiklikleri görmüyorsanız Safari'de sayfayı yenileyin; PWA eski sürümü gösteriyorsa uygulamayı kapatıp tekrar açın.
5. iPhone Safari → Paylaş → **Ana Ekrana Ekle** ile uygulamayı kurun.

## Özelliklerin kapsamı
- **Kategoriler**: Ürün eklerken kategori seçilir; ürünler kategoriye göre gruplanır.
- **Sık alınanlar**: Üründeki ☆ simgesine basın; yıldızlı ürünler sekmesinde görüntülenir. ↻ simgesi ürünü yeni satır olarak yeniden ekler.
- **Alışveriş geçmişi**: İşaretlenen ürünler *Alınanlar / Geçmiş* sekmesinde kalır; silerseniz kalıcı olarak kaybolur. Ayrı denetim günlüğü yoktur.
- **Miktar/birim/fiyat**: Birim fiyat girilir; toplam `miktar × birim fiyat` olarak hesaplanır. Miktar boşsa 1 kabul edilir. Eski v1 ürünlerinde fiyat bulunmadığından toplamda 0 sayılır.
- **Kim ekledi**: Yeni ürünlerde e-posta gösterilir; v1 ürünleri için eski kayıtlar kimlik e-postası içermeyebilir.
- **Bildirimler**: Tarayıcı izin veriyorsa **uygulama açık ve görünürken** başka üyenin eklediği ürünler için yerel bildirim gösterilir. Arka planda/uygulama kapalıyken gerçek push bildirimleri **yoktur**. Bunun için Firebase Cloud Messaging + güvenilir sunucu/Cloud Functions, APNs/Web Push kurulumu gerekir.
- **Kullanıcı yönetimi**: Ahmet yönetici UID'siyle yeni UID yetkilendirebilir veya dinamik üyeleri çıkarabilir. Yeni hesabın Firebase Authentication'da ayrıca oluşturulması gerekir. İlk iki sabit aile kullanıcısı bu ekrandan kaldırılamaz; gerekirse kod ve kurallar birlikte değiştirilir. Kullanıcı eklemek e-posta davetiyesi göndermez.
- **Çoklu liste**: Ek listeler açılabilir. Her liste tüm aile üyeleri tarafından görülebilir. Liste silme özelliği henüz yoktur.
- **Koyu mod**: Üstteki ◐ düğmesiyle değişir.
- **Çevrimdışı**: Uygulama dosyaları service worker ile, Firestore verileri desteklenen tarayıcılarda kalıcı önbellekle saklanır. İlk kurulum/giriş için internet gerekir. Çevrimdışı değişiklikler bağlantı gelince eşitlenir; cihaz/tarayıcı kısıtlarına göre değişebilir.
- **Arama**: Seçili listedeki ürünleri ada göre filtreler.

## Güvenlik ve önemli uyarılar
- Firebase web `apiKey` uygulama kodunda görünür; bu normaldir. Verilerin korunması **Firestore Security Rules** ile sağlanır.
- Üyelik yetkisi Firestore kurallarıyla sınırlandırılır. Üye eklemeden önce Firebase Authentication'da UID'yi doğrulayın.
- Dinamik üyeler için `members` koleksiyonu kullanılır; bu belgelerin yazılması yalnızca yöneticinin UID'sine açıktır.
- Bu sürüm istemci tabanlıdır. Tam arka plan push bildirimi, sunucu tabanlı denetim kaydı, hesap daveti, listeler için ayrı üyelik izinleri ve kurumsal düzeyde işlem denetimi içermez.
