# CLAUDE.md — Daldan Dala Geliştirme Kılavuzu

> Bu dosya Claude Code'un projeyi geliştirmesi için yazılmıştır.
> Tüm kararlar burada verilmiştir; kendi tasarım kararlarını ekleme.
> Önce bu dosyayı tamamen oku, sonra kod yaz.

---

## 1. Proje Özeti

**Daldan Dala** — Web tabanlı 2D dikey arcade oyunu.
Maymun, ekranda 5 sarmaşık arasında zıplayarak yukarı tırmanır.
Engeller ve muzlar yukarıdan aşağı akar; oyuncu refleks ve rota seçimiyle hayatta kalır.

**Stack:** Vite + TypeScript + HTML5 Canvas + LocalStorage  
**Hedef platform:** Web (desktop + mobile)  
**Mevcut durum:** MVP ve V1 sistemi tamamlanmış. Bu döküman V1 → V1.5 geçişini tarif eder.

---

## 2. Mevcut Sistemler (Dokunma)

Bu sistemler çalışıyor. Yeniden yazma. Sadece gerekiyorsa düzelt.

- Canvas tabanlı 5 lane oynanışı
- Klavye (1-5, A/D) + mobil (touchstart) input
- 6 muz tipi, 6+ engel tipi, lane-bazlı adil hitbox
- Kombo, Perfect Jump, yakın kaçış, boss ödülü
- 8 power-up
- Dev Yılan, Kartal, Goril Rakip, Örümcek Kraliçe boss dalgaları
- Lane sekansı / rota bonusu
- Son Tutuş (kurtarma hakkı)
- 5 bölgeli atmosfer akışı, bölge açma kaydı
- Boss sandık sistemi (bronz/gümüş/altın)
- Hikaye modu (5 chapter)
- Market, kalıcı upgrade, karakter seçimi, günlük görevler
- LocalStorage kayıt (muz, skor, upgrade, karakter, görev, bölge)

---

## 3. Görev Listesi (Bu Oturumda Yapılacak)

Her görevi sırayla tamamla. Bir sonrakine geç. Bozmadan ekle.

### Görev A — Combo Reset Mantığını Düzelt

**Sorun:** Combo şu an "1800ms hareketsizlikte" sıfırlanıyor. Bu oyunda çalışmaz çünkü oyuncu sürekli hareket etmek zorunda değildir; sarmaşıkta asılı kalmak meşru bir strateji.

**Yeni kural:**
```
Combo SADECE şu durumlarda sıfırlanır:
  - Ölümcül engele çarpınca (yılan, diken, kartal saldırısı, boss)
  - Çürük muz alınca
  - Kurtarma QTE'sini başaramazsan

Combo SIFIRLANMAZ:
  - Çok uzun bekleyince (zaman tabanlı decay kaldır)
  - Kurtarma QTE'sini başarıyla geçersen
  - Power-up kullanınca
```

**Dosyalar:** `src/systems/ComboSystem.ts`  
`GAME_CONFIG.combo.resetAfterMs` satırını sil veya 0 yap.  
ComboSystem içindeki time-decay bloğunu kaldır.  
Combo sıfırlama çağrısını sadece yukarıdaki 3 olaya bağla.

---

### Görev B — Lane Sekansını "Altın Yol" Moduna Çevir

**Sorun:** Şu anki sekans (3→1→4→2 gibi) oyuncuyu zorla bir sıraya sokuyor. Bu boss+engel+sekans üst üste gelince haksız hissettiriyor.

**Yeni mekanik — Altın Yol:**
- Sekans göstergesi çıktığında lane'ler yanıp sönmez, ipucu olarak ALTIN renkte hafifçe parlıyor.
- Oyuncu altın sırayı takip ETMEK ZORUNDA değil. İsterse normal oynuyor.
- Takip ederse bonus kazanıyor (kombo +2, altın muz spawn).
- Takip etmezse hiçbir ceza yok. Kombo kırılmıyor.

**Teknik değişiklik:**
```ts
// Eski: sekans başarısız = combo sıfırla
// Yeni: sekans başarısız = bonus yok, combo değişmez

interface SequenceBonus {
  lanesInOrder: LaneIndex[];      // Önerilen sıra
  currentStep: number;
  active: boolean;
  timeRemainingMs: number;        // Gösterim süresi
  onSuccess: () => void;          // bonus ver
  onExpire: () => void;           // sadece kapat, ceza yok
}
```

**Dosyalar:** `src/systems/ComboSystem.ts`, `src/ui/HUD.ts` (altın parlama efekti için)

---

### Görev C — Ölüm Sınıflandırmasını Düzelt

**Sorun:** Hangi engel anında öldürür, hangisi QTE tetikler belirsiz. Oyuncu haksız hissediyor.

**Kesin liste:**

| Durum | Tepki |
|---|---|
| Yılan teması | Anında ölüm |
| Dikenli sarmaşığa iniş | Anında ölüm |
| Kartal saldırısı (gölge tam üstünde) | Anında ölüm |
| Boss saldırısı (uyarısız) | Anında ölüm |
| Kopan sarmaşıkta kalma (süre doldu) | **Kurtarma QTE** |
| Kaygan sarmaşıkta kayma | **Kurtarma QTE** |
| Örümcek ağına takılma | **Kurtarma QTE** |
| Hindistan cevizi kafasına düşme | **Kurtarma QTE** |
| Arı sürüsü (1. temas) | **Kurtarma QTE** (2. temas = ölüm) |

**Kurtarma QTE akışı (tam spec):**
```
1. Maymun "slipping" animasyonuna girer (çil fırtına efekti)
2. Ekranın ortasına "KURTAR! → [X]" yazısı çıkar (X = hedef lane)
3. Oyuncunun süresi: 500ms
4. Oyuncu doğru lane'e basarsa:
   - Maymun o lane'e zıplar
   - Combo KIRILMAZ
   - "Son Anda!" mesajı + near-miss skoru verilir
5. Süre dolarsa veya yanlış lane:
   - Maymun düşer
   - Combo sıfırlanır
   - Ölüm ekranı açılır
```

**Not:** `LastGrip` (Son Tutuş) power-up'ı varsa QTE başarısız olsa bile 1 kez affeder. Bu mantığı koru.

**Dosyalar:** `src/entities/Monkey.ts` (MonkeyState), `src/systems/CollisionSystem.ts`

---

### Görev D — Power-up Spawn'ını Güçlendir

**Sorun:** Power-up'lar rastgele çıkıyor, oyuncu güvenilir bir şekilde istediği power-up'ı deneyimlemiyor.

**Yeni sistem — Güç Çubuğu:**
```
Oyuncunun bir "power bar" doldurmak için combo yaparması gerekir.
Bar dolunca HUD'da parlıyor ve oyuncu bir power-up seçiyor.

Bar dolum kaynakları:
  - Her Normal muz: +2
  - Her Altın muz: +15
  - Perfect Jump: +8
  - Near Miss: +10
  - Sekans bonusu: +20

Bar kapasitesi: 100 puan
Bar dolunca:
  - HUD'da 3 power-up seçeneği göster (rastgele 3 tanesi)
  - Oyuncu 1.5 saniye içinde 1, 2, 3 tuşuna basar (veya mobilde dokunur)
  - Seçilmezse random biri verilir
  - Seçim yapılınca bar sıfırlanır ve power-up aktifleşir

Aynı anda max 2 power-up aktif kalabilir. (Bunu koru.)
```

**Config:**
```ts
// src/config/balanceConfig.ts içine ekle
powerBar: {
  capacity: 100,
  fillRates: {
    normalBanana: 2,
    goldBanana: 15,
    perfectJump: 8,
    nearMiss: 10,
    sequenceBonus: 20,
  },
  selectionWindowMs: 1500,
}
```

**Dosyalar:** `src/systems/PowerUpSystem.ts`, `src/ui/HUD.ts`

---

### Görev E — Boss Zamanlama Düzeltmesi

**Sorun:** Boss "500m VEYA 3 dakika" mantığı çelişiyor. Oyuncu bir turu çok yavaş yaparsa 3 dakikada boss gelip sürpriz öldürüyor.

**Yeni kural:**
```ts
// Boss sadece mesafeye göre gelir. Zamana göre gelmez.
// Ama minimum cooldown var (son boss'tan bu yana <90sn geçmediyse spawn etme)

const shouldSpawnBoss = (
  currentDistance: number,
  lastBossDistance: number,
  lastBossTimeElapsedSec: number
): boolean => {
  const distanceMet = currentDistance - lastBossDistance >= BOSS_INTERVAL_METERS;
  const cooldownMet = lastBossTimeElapsedSec >= 90;
  return distanceMet && cooldownMet;
};

// BOSS_INTERVAL_METERS = 500 (config'de tut)
```

**Boss sırası:** Dev Yılan → Kartal → Goril Rakip → Örümcek Kraliçe → tekrar (rotasyon devam eder)

**Dosyalar:** `src/systems/BossSystem.ts`

---

### Görev F — Spawn Sistemi Adilliği Güçlendir

**Sorun:** Arka arkaya aynı lane'e engel çıkabiliyor.

**Ekle:**
```ts
// SpawnSystem içine "son X saniyede hangi lane'lere engel çıktı" takip et
// Eğer bir lane son 2 saniyede 2 ölümcül engel aldıysa, bir daha engel verme

const recentDeadlyByLane: Map<LaneIndex, number> = new Map(); // lane → timestamp

function canSpawnDeadlyOnLane(lane: LaneIndex, nowMs: number): boolean {
  const lastMs = recentDeadlyByLane.get(lane) ?? 0;
  return nowMs - lastMs > 2000;
}
```

Ayrıca **her zaman en az 1 lane tamamen açık** olmalı. Engel üretmeden önce şunu kontrol et:
```ts
function hasSafeLane(activeLanes: Set<LaneIndex>): boolean {
  return [0, 1, 2, 3, 4].some(l => !activeLanes.has(l as LaneIndex));
}
// Eğer hasSafeLane false dönerse o frame engel spawn etme.
```

**Dosyalar:** `src/systems/SpawnSystem.ts`

---

### Görev G — HUD İyileştirmesi

Oyun içi HUD şunları göstermeli, hepsi canvas köşelerine yerleştirilmeli:

```
Sol üst:    Skor | Mesafe
Sağ üst:    Muz ikonu + sayı | Kombo çarpanı (x1...x8)
Sol alt:    Aktif power-up ikonları (süre barıyla)
Sağ alt:    Power bar dolum göstergesi
Orta üst:   Boss uyarısı (kırmızı yanıp sönen yazı)
Orta:       Perfect!, Kıl Payı! gibi geçici mesajlar (1sn görünür, fade out)
```

Mobilde alt butonlar (1-5 lane) HUD elementlerini kapatmamalı.  
Mobile kontrol: Alt kısımda 5 büyük dokunmatik buton. Canvas %80 yükseklikte bitsin, alt %20 butonlara ayrılsın.

**Dosyalar:** `src/ui/HUD.ts`, `src/ui/MobileLaneButtons.ts`

---

## 4. Kod Kalite Kuralları (Değiştirme)

- TypeScript strict mode açık.
- Magic number yok; tüm değerler `src/config/` altında.
- Input, entity'yi doğrudan değiştirmez; event üretir → sistem yakalar.
- Render ve update mantığı ayrı.
- LocalStorage erişimi sadece `SaveSystem` üzerinden.
- Her scene kendi event listener temizliğini yapar.
- Obstacle, banana, particle → object pool kullan.
- `new` çağrısı oyun loop içinde minimum.
- Delta time her harekete uygulanmalı: `pos += speed * delta`
- Delta clamp: `delta = Math.min(delta, 0.033)`

---

## 5. Klasör Yapısı (Mevcut)

```
src/
├── core/          Game, GameLoop, Renderer, InputManager, AudioManager, AssetLoader, EventBus
├── config/        gameConfig.ts, balanceConfig.ts, laneConfig.ts
├── entities/      Monkey, Vine, Obstacle, Banana, PowerUp, Boss, Particle
├── systems/       Spawn, Collision, Score, Combo, Mission, PowerUp, Boss, Difficulty, Save, Particle
├── scenes/        Boot, MainMenu, Game, Pause, GameOver, Shop, Missions, CharacterSelect
├── ui/            HUD, Button, Panel, Toast, MobileLaneButtons, ProgressBar
├── data/          characterData, obstacleData, bananaData, powerupData, regionData, missionData
├── types/         GameTypes, EntityTypes, SaveTypes, ConfigTypes
└── utils/         math, random, collision, easing, objectPool, responsive
```

---

## 6. Temel Tipler (Referans)

```ts
export type LaneIndex = 0 | 1 | 2 | 3 | 4;

export type MonkeyState =
  | "climbing" | "jumping" | "slipping" | "stunned" | "falling" | "powered";

export type DeathType = "instant" | "rescue_qte";

export interface Hitbox { x: number; y: number; width: number; height: number; }

export interface Entity {
  id: string;
  active: boolean;
  position: Vector2;
  lane: LaneIndex;
  update(delta: number): void;
  render(renderer: Renderer): void;
  getHitbox(): Hitbox;
}
```

---

## 7. Config Referansı

```ts
// src/config/gameConfig.ts
export const GAME_CONFIG = {
  canvas: { baseWidth: 390, baseHeight: 844, maxDPR: 2 },
  lanes: { count: 5, topPadding: 80, bottomPadding: 120 },
  monkey: {
    startLane: 2,
    baseJumpDurationMs: 110,
    extraJumpDurationPerLaneMs: 35,
    hitboxScaleX: 0.55,
    hitboxScaleY: 0.65,
  },
  speed: { base: 170, growthPerSecond: 1.4, maxBonus: 260 },
  spawn: { minSafeLanes: 1, obstacleStartDelayMs: 1800 },
  combo: { maxMultiplier: 8, nearMissDistancePx: 38 },
  boss: { intervalMeters: 500, minCooldownSec: 90 },
  rescue: { windowMs: 500 },
} as const;
```

---

## 8. Örnek Utility Fonksiyonlar

```ts
// Lane X pozisyonu
export function getLaneX(lane: number, canvasWidth: number): number {
  const padding = canvasWidth * 0.08;
  const usable = canvasWidth - padding * 2;
  return padding + lane * (usable / 4);
}

// AABB çarpışma
export function intersects(a: Hitbox, b: Hitbox): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x &&
         a.y < b.y + b.height && a.y + a.height > b.y;
}

// Object pool
export class ObjectPool<T> {
  private pool: T[] = [];
  constructor(private create: () => T, private reset: (item: T) => void) {}
  acquire(): T { return this.pool.pop() ?? this.create(); }
  release(item: T): void { this.reset(item); this.pool.push(item); }
}

// Game loop
export class GameLoop {
  private running = false;
  private last = 0;
  constructor(private update: (dt: number) => void, private render: () => void) {}
  start() { this.running = true; this.last = performance.now(); requestAnimationFrame(this.tick); }
  stop() { this.running = false; }
  private tick = (t: number) => {
    if (!this.running) return;
    const dt = Math.min((t - this.last) / 1000, 0.033);
    this.last = t;
    this.update(dt);
    this.render();
    requestAnimationFrame(this.tick);
  };
}
```

---

## 9. Zorluk Eğrisi (Spawn Kuralları)

```
0–30sn:    Normal sarmaşık. Yılan + diken. Bol güvenli lane. Muz çok.
30–90sn:   Arı, hindistan cevizi ekle. Islak sarmaşık başlar. Altın muz çıkar.
90–180sn:  Kartal gölgesi, kopan sarmaşık. Sekans (Altın Yol) başlar.
180sn+:    Boss. Bukalemun, karanlık sarmaşık. Özel olaylar (fırtına, gece).
```

Her zaman en az 1 lane güvenli olmalı. (Görev F)

---

## 10. Özel Olaylar (Spawn Kuralları)

| Olay | Başlama | Süre | Kural |
|---|---|---|---|
| Muz Yağmuru | 90sn+ | 8sn | Muz spawn x3, engel azalır |
| Tropik Fırtına | 120sn+ | 10sn | Sarmaşıklar sallanır, kaygan etki artar |
| Gece Çöküyor | 180sn+ | 12sn | Görüş azalır, karanlık sarmaşık artar |
| Kartal Alarmı | 150sn+ | 8sn | Kartal gölgesi sıklığı x2 |

- Aynı anda max 1 büyük olay aktif.
- İlk 60sn'de hiçbir olay çıkmaz.
- Olay başlamadan 2sn önce görsel+ses uyarısı ver.

---

## 11. Test Kontrol Listesi

Her görevi bitirince şunu kontrol et:

**Görev A — Combo:**
- [ ] Yılan çarptı → combo 0
- [ ] 5 saniye hiç hareket etmeden bekle → combo KORUNUYOR
- [ ] Çürük muz al → combo 0

**Görev B — Altın Yol:**
- [ ] Sekans göstergesi çıktı, yanlış lane'e gittim → combo kırılmadı
- [ ] Sekans göstergesi çıktı, doğru sırayı izledim → altın muz ve +2 combo geldi

**Görev C — Ölüm:**
- [ ] Kaygan sarmaşıkta kayma → QTE çıktı, 500ms pencere
- [ ] Yılana çarptım → anında düşüş, QTE yok
- [ ] QTE'yi başardım → maymun o lane'e geçti, combo korundu

**Görev D — Power bar:**
- [ ] Muz topladım → bar doldu (görsel)
- [ ] Bar %100 → 3 power-up seçeneği HUD'da göründü
- [ ] 1.5sn içinde seçmedim → random biri aktifleşti

**Görev E — Boss:**
- [ ] 500m doldu, son boss'tan 90sn geçti → boss geldi
- [ ] 500m doldu ama 90sn geçmedi → boss gelmedi

**Görev F — Spawn:**
- [ ] Aynı lane'e 2sn içinde 2 ölümcül engel çıkmadı
- [ ] 5 lane hepsi engelli → bir engel spawn edilmedi

**Görev G — HUD:**
- [ ] Skor, mesafe, muz, kombo görünüyor
- [ ] Power bar sağ altta dolum gösteriyor
- [ ] Mobil butonlar HUD'u kapatmıyor

---

## 12. Yapma

- Mevcut çalışan sistemleri yeniden yazma.
- Kendi denge kararlarını ekleme; değerler zaten config'de.
- Görev listesi dışında yeni özellik ekleme.
- `any` kullanma.
- Magic number kullanma.
- Oyun loop içinde `new` kullanma (pool kullan).
- Scene değişiminde event listener temizlemeyi unutma.

---

*Bu dökümanı değiştirme. Sadece kodu değiştir.*
