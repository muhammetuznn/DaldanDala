# Daldan Dala

2D web tabanli maymun sarmasik oyunu.

## Kurulum

```bash
npm install
```

## Gelistirme

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Assetleri Ayiklama

Birlesik sprite sheet assetleri guncelledikten sonra:

```bash
npm run extract-assets
```

## Kontroller

- Sarmaşıklara dokun/tikla: o sarmaşığa atla
- `A/D` veya ok tuslari: Sag/sol gec
- `Space`: En yakin guvenli sarmasiga atla
- `P` veya `Esc`: Pause
- Mobil: Alt lane butonlari veya oyun alanina dokunma
- Ana menu: sarmaşıklara dokunarak basla, sag kenar ayarlar

## Hedef

Gorevleri sirayla tamamla, haritalari gec ve final hedefe ulas.

## Gorev Akisi

- Gorev 1: 50 muz topla.
- Gorev 2: Yagmur Ormani'nda 300 metre ilerle.
- Gorev 3: Tapinak bolgesinde 80 muz daha topla.
- Gorev 4: Volkan bolgesinde 900 skor yap.
- Final: Gece Ormani'nda 1200 metreye ulas ve 250 muz tasi.
- Final tamamlaninca oyun tebrik ekraniyla biter.

## Rekor ve Karakterler

- Yeni rekor kirinca +25 muz bonusu kazanirsin.
- Orta sarmaşik ana menuden karakter ekranini acar.
- Karakterler hedeflerle acilir: Ninja 350 skor, Robot 250m mesafe, Korsan 150 muz, Kral 900 skor + 300 muz.

## Mevcut Surum

Bu prototip sade bir arcade cekirdegindedir:

- 6 muz tipi: normal, altin, kirmizi, mavi, mor, curuk
- 6 engel tipi: yilan, diken, hindistan cevizi, ari surusu, orumcek agi, kartal golgesi
- Basit power-up etkileri: kalkan ve yavas zaman
- Combo, perfect jump ve riskli muz odulu
- 5 bolge akisi: Muz Ormani, Yagmur Ormani, Kayip Tapinak, Volkan Agaclari, Gece Ormani
- Ayarlar: ses, titresim, kontrol modu, grafik kalitesi
- LocalStorage ile rekor, toplam muz ve ayar kaydi
