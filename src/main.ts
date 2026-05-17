import "./style.css";

type LaneIndex = 0 | 1 | 2 | 3 | 4;
type GameMode = "menu" | "playing" | "paused" | "gameOver" | "settings" | "characters";
type ObstacleType = "snake" | "thorn" | "coconut" | "beeSwarm" | "spiderWeb" | "eagleShadow";
type BananaType = "normal" | "gold" | "red" | "blue" | "purple" | "rotten";
type PowerUpType = "magnet" | "shield" | "slowTime" | "superJump" | "bananaFrenzy" | "eagleWard" | "bossShield";
type VineType = "normal" | "wet" | "gold" | "thorn" | "dark";
type CharacterId = "default" | "ninja" | "robot" | "pirate" | "king";
type UpgradeId = "jumpSpeed" | "bananaValue" | "powerDuration" | "startShield";
type ControlMode = "tapLane" | "laneButtons";
type RegionId = "jungleDay" | "rainForest" | "templeRuins" | "volcanicJungle" | "jungleNight";
type ChestTier = "bronze" | "silver" | "gold";
type ChapterId = "chapter1" | "chapter2" | "chapter3" | "chapter4" | "chapter5";
type MonkeyState = "climbing" | "jumping" | "slipping" | "stunned" | "falling" | "powered";

interface PointerInput {
  lane: LaneIndex;
  xRatio: number;
  yRatio: number;
}

interface Hitbox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface FallingThing {
  id: number;
  lane: LaneIndex;
  y: number;
  width: number;
  height: number;
  collected?: boolean;
}

interface Obstacle extends FallingThing {
  type: ObstacleType;
  warningY?: number;
  bossAttack?: boolean;
}

interface Banana extends FallingThing {
  type: BananaType;
}

interface PowerUpPickup extends FallingThing {
  type: PowerUpType;
}

interface ActivePowerUp {
  type: PowerUpType;
  timeLeft: number;
}

interface SequenceChallenge {
  lanes: LaneIndex[];
  current: number;
  timeLeft: number;
}

interface ChapterGoal {
  distance: number;
  bananas?: number;
  perfects?: number;
  bosses?: number;
  sequences?: number;
}

interface CharacterUnlockRule {
  score?: number;
  distance?: number;
  bananas?: number;
}

interface CampaignMission {
  title: string;
  text: string;
  region: RegionId;
  goal: {
    bananas?: number;
    distance?: number;
    score?: number;
  };
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  radius: number;
}

interface MonkeyTrail {
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  life: number;
  maxLife: number;
}

interface MonkeyPose {
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  reachX: number;
  reachY: number;
}

interface SaveData {
  version: number;
  highScore: number;
  totalBananas: number;
  maxDistance: number;
  selectedCharacterId: CharacterId;
  unlockedCharacterIds: CharacterId[];
  unlockedRegionIds: RegionId[];
  chests: Record<ChestTier, number>;
  openedChests: number;
  pendingPowerUps: PowerUpType[];
  story: {
    unlockedChapterIds: ChapterId[];
    completedChapterIds: ChapterId[];
    stars: Record<string, number>;
  };
  upgrades: Record<UpgradeId, number>;
  missions: {
    dailyDate: string;
    progress: Record<string, number>;
    claimedMissionIds: string[];
  };
  settings: {
    sfxVolume: number;
    vibration: boolean;
    controlMode: ControlMode;
    quality: "low" | "medium" | "high";
  };
}

const CONFIG = {
  lanes: 5,
  baseWidth: 390,
  baseHeight: 844,
  maxDpr: 1.5,
  monkeyYRatio: 0.7,
  monkeySize: 70,
  monkeyVisualSize: 92,
  monkeyGripAnchorX: 0.59,
  monkeyGripAnchorY: 0.48,
  vineVisualWidth: 38,
  vineCapRatio: 0.24,
  vineSegmentHeight: 260,
  vineTileOverlap: 12,
  baseJumpMs: 110,
  extraJumpMs: 35,
  baseSpeed: 172,
  speedGrowth: 1.35,
  maxSpeedBonus: 245,
  obstacleStartDelay: 2.1,
  bananaStartDelay: 0.65,
  nearMissDistance: 42,
  safeSpawnGap: 155,
  spawnY: -92,
  powerUpStartDelay: 8,
  bossDistanceStep: 500,
  bossMinCooldown: 90,
  rescueWindow: 0.5,
  powerBarCapacity: 100,
  powerBarSelectionWindow: 1.5,
  powerBarFill: {
    normalBanana: 2,
    goldBanana: 15,
    perfectJump: 8,
    nearMiss: 10,
    sequenceBonus: 20
  },
  deadlyLaneCooldown: 2,
  saveKey: "daldan_dala_save_v1"
} as const;

const ASSETS = {
  characters: {
    default: "/assets/images/generated/characters/monkey-default.png",
    ninja: "/assets/images/generated/characters/monkey-ninja.png",
    robot: "/assets/images/generated/characters/monkey-robot.png",
    pirate: "/assets/images/generated/characters/monkey-pirate.png",
    king: "/assets/images/generated/characters/monkey-king.png"
  },
  vines: {
    normal: "/assets/images/generated/vines/vine-normal.png",
    wet: "/assets/images/generated/vines/vine-wet.png",
    gold: "/assets/images/generated/vines/vine-gold.png",
    thorn: "/assets/images/generated/vines/vine-thorn.png",
    dark: "/assets/images/generated/vines/vine-dark.png"
  },
  obstacles: {
    snake: "/assets/images/generated/obstacles/snake.png",
    thorn: "/assets/images/generated/obstacles/thorn.png",
    coconut: "/assets/images/generated/obstacles/coconut.png",
    beeSwarm: "/assets/images/generated/obstacles/bee-swarm.png",
    spiderWeb: "/assets/images/generated/obstacles/spider-web.png",
    eagleShadow: "/assets/images/generated/obstacles/eagle-shadow.png"
  },
  bananas: {
    normal: "/assets/images/generated/bananas/banana-normal.png",
    gold: "/assets/images/generated/bananas/banana-gold.png",
    red: "/assets/images/generated/bananas/banana-red.png",
    blue: "/assets/images/generated/bananas/banana-blue.png",
    purple: "/assets/images/generated/bananas/banana-purple.png",
    rotten: "/assets/images/generated/bananas/banana-rotten.png"
  },
  powerUps: {
    magnet: "/assets/images/generated/powerups/magnet.png",
    shield: "/assets/images/generated/powerups/shield.png",
    slowTime: "/assets/images/generated/powerups/slow-time.png",
    superJump: "/assets/images/generated/powerups/super-jump.png",
    bananaFrenzy: "/assets/images/generated/powerups/banana-frenzy.png",
    eagleWard: "/assets/images/generated/powerups/eagle-ward.png",
    bossShield: "/assets/images/generated/powerups/boss-shield.png"
  },
  backgrounds: {
    day: "/assets/images/backgrounds/jungle-day.png",
    night: "/assets/images/backgrounds/jungle-night.png",
    temple: "/assets/images/backgrounds/temple-ruins.png",
    volcanic: "/assets/images/backgrounds/volcanic-jungle.png"
  },
  uiBanana: "/assets/images/generated/bananas/banana-normal.png"
} as const;

const DEFAULT_CLIMB_FRAMES = [
  "/assets/images/generated/characters/climb-default/frame-00.png",
  "/assets/images/generated/characters/climb-default/frame-01.png",
  "/assets/images/generated/characters/climb-default/frame-02.png",
  "/assets/images/generated/characters/climb-default/frame-03.png"
] as const;

const REGIONS: Array<{
  id: RegionId;
  name: string;
  startsAt: number;
  background: keyof typeof ASSETS.backgrounds;
  tint: string;
  accent: string;
}> = [
  { id: "jungleDay", name: "Muz Ormani", startsAt: 0, background: "day", tint: "rgba(3, 18, 14, 0.18)", accent: "#9df06f" },
  { id: "rainForest", name: "Yagmur Ormani", startsAt: 350, background: "day", tint: "rgba(20, 69, 68, 0.24)", accent: "#5ed7ff" },
  { id: "templeRuins", name: "Kayip Tapinak", startsAt: 700, background: "temple", tint: "rgba(60, 44, 18, 0.26)", accent: "#ffd95a" },
  { id: "volcanicJungle", name: "Volkan Agaclari", startsAt: 1100, background: "volcanic", tint: "rgba(87, 24, 15, 0.24)", accent: "#ff7f57" },
  { id: "jungleNight", name: "Gece Ormani", startsAt: 1500, background: "night", tint: "rgba(10, 16, 42, 0.28)", accent: "#d779ff" }
];

const CHARACTERS: Array<{ id: CharacterId; name: string; perk: string; unlock: CharacterUnlockRule }> = [
  { id: "default", name: "Klasik", perk: "Dengeli", unlock: {} },
  { id: "ninja", name: "Ninja", perk: "Daha hizli ziplama", unlock: { score: 350 } },
  { id: "robot", name: "Robot", perk: "Sabit tutunus", unlock: { distance: 250 } },
  { id: "pirate", name: "Korsan", perk: "Altin muz bonusu", unlock: { bananas: 150 } },
  { id: "king", name: "Kral", perk: "Rekor tacı", unlock: { score: 900, bananas: 300 } }
];

const CAMPAIGN_MISSIONS: CampaignMission[] = [
  { title: "Muz Yolu", text: "160 muz topla", region: "jungleDay", goal: { bananas: 160 } },
  { title: "Yağmur Sınırı", text: "650 metre ilerle", region: "rainForest", goal: { distance: 650 } },
  { title: "Tapınak Stoku", text: "240 muz daha topla ve 900 metreyi gör", region: "templeRuins", goal: { bananas: 240, distance: 900 } },
  { title: "Volkan Ritmi", text: "2400 skor yap", region: "volcanicJungle", goal: { score: 2400 } },
  { title: "Gece Tacı", text: "2200 metreye ulaş ve 520 muz taşı", region: "jungleNight", goal: { distance: 2200, bananas: 520 } }
];

const DAILY_MISSIONS = [
  { id: "collect_25", text: "25 muz topla", target: 25, reward: 35 },
  { id: "perfect_5", text: "5 Perfect yap", target: 5, reward: 45 },
  { id: "distance_300", text: "300 metre cik", target: 300, reward: 50 },
  { id: "boss_1", text: "1 boss atlat", target: 1, reward: 65 },
  { id: "sequence_2", text: "2 rota tamamla", target: 2, reward: 55 }
] as const;

const CHAPTERS: Array<{
  id: ChapterId;
  title: string;
  region: RegionId;
  intro: string;
  goal: ChapterGoal;
  reward: number;
}> = [
  {
    id: "chapter1",
    title: "Totemin Gecesi",
    region: "jungleDay",
    intro: "Altin Muz Totemi calindi; ormanin ilk isigi soluyor.",
    goal: { distance: 180, bananas: 12 },
    reward: 35
  },
  {
    id: "chapter2",
    title: "Yagmurun Sirri",
    region: "rainForest",
    intro: "Kaygan sarmaşiklar totemin ikinci izini sakliyor.",
    goal: { distance: 260, perfects: 3 },
    reward: 50
  },
  {
    id: "chapter3",
    title: "Tapinak Rotasi",
    region: "templeRuins",
    intro: "Eski taslar sadece dogru sirayi takip edeni gecirir.",
    goal: { distance: 340, sequences: 1 },
    reward: 65
  },
  {
    id: "chapter4",
    title: "Kartal Tepesi",
    region: "volcanicJungle",
    intro: "Golge buyuyor; totem parcasi yukaridaki yuvada.",
    goal: { distance: 520, bosses: 1 },
    reward: 90
  },
  {
    id: "chapter5",
    title: "Gece Kralligi",
    region: "jungleNight",
    intro: "Son parca karanlikta, ormanin kalbi yeniden atmayi bekliyor.",
    goal: { distance: 650, bananas: 35, bosses: 1 },
    reward: 130
  }
];

class AssetStore {
  private readonly images = new Map<string, HTMLImageElement>();

  async load(): Promise<void> {
    const paths = new Set<string>();
    Object.values(ASSETS.characters).forEach((path) => paths.add(path));
    DEFAULT_CLIMB_FRAMES.forEach((path) => paths.add(path));
    paths.add(ASSETS.uiBanana);
    paths.add(ASSETS.backgrounds.day);
    paths.add(ASSETS.backgrounds.night);
    Object.values(ASSETS.vines).forEach((path) => paths.add(path));
    Object.values(ASSETS.obstacles).forEach((path) => paths.add(path));
    Object.values(ASSETS.bananas).forEach((path) => paths.add(path));
    Object.values(ASSETS.powerUps).forEach((path) => paths.add(path));
    Object.values(ASSETS.backgrounds).forEach((path) => paths.add(path));

    await Promise.all(
      [...paths].map(
        (path) =>
          new Promise<void>((resolve) => {
            const image = new Image();
            image.onload = () => {
              this.images.set(path, image);
              resolve();
            };
            image.onerror = () => resolve();
            image.src = path;
          })
      )
    );
  }

  get(path: string): HTMLImageElement | undefined {
    return this.images.get(path);
  }
}

class SaveSystem {
  load(): SaveData {
    try {
      const raw = localStorage.getItem(CONFIG.saveKey);
      if (!raw) return this.defaultSave();
      const parsed = JSON.parse(raw) as Partial<SaveData>;
      const defaults = this.defaultSave();
      const save = {
        ...defaults,
        highScore: Number(parsed.highScore) || 0,
        totalBananas: Number(parsed.totalBananas) || 0,
        maxDistance: Number(parsed.maxDistance) || 0,
        selectedCharacterId: this.asCharacterId(parsed.selectedCharacterId) ?? defaults.selectedCharacterId,
        unlockedCharacterIds: this.mergeCharacters(parsed.unlockedCharacterIds),
        unlockedRegionIds: this.mergeRegions(parsed.unlockedRegionIds),
        chests: { ...defaults.chests, ...(parsed.chests ?? {}) },
        openedChests: Number(parsed.openedChests) || 0,
        pendingPowerUps: this.mergePowerUps(parsed.pendingPowerUps),
        story: this.mergeStory(parsed.story),
        upgrades: { ...defaults.upgrades, ...(parsed.upgrades ?? {}) },
        missions: { ...defaults.missions, ...(parsed.missions ?? {}) },
        settings: { ...defaults.settings, ...(parsed.settings ?? {}) }
      };
      return this.refreshDailyMissions(save);
    } catch {
      return this.defaultSave();
    }
  }

  save(data: SaveData): void {
    localStorage.setItem(CONFIG.saveKey, JSON.stringify(data));
  }

  private defaultSave(): SaveData {
    return this.refreshDailyMissions({
      version: 2,
      highScore: 0,
      totalBananas: 0,
      maxDistance: 0,
      selectedCharacterId: "default",
      unlockedCharacterIds: ["default"],
      unlockedRegionIds: ["jungleDay"],
      chests: {
        bronze: 0,
        silver: 0,
        gold: 0
      },
      openedChests: 0,
      pendingPowerUps: [],
      story: {
        unlockedChapterIds: ["chapter1"],
        completedChapterIds: [],
        stars: {}
      },
      upgrades: {
        jumpSpeed: 0,
        bananaValue: 0,
        powerDuration: 0,
        startShield: 0
      },
      missions: {
        dailyDate: "",
        progress: {},
        claimedMissionIds: []
      },
      settings: {
        sfxVolume: 1,
        vibration: true,
        controlMode: "laneButtons",
        quality: "low"
      }
    });
  }

  private refreshDailyMissions(save: SaveData): SaveData {
    const today = new Date().toISOString().slice(0, 10);
    if (save.missions.dailyDate !== today) {
      save.missions = {
        dailyDate: today,
        progress: {},
        claimedMissionIds: []
      };
      for (const mission of DAILY_MISSIONS) {
        save.missions.progress[mission.id] = 0;
      }
    }
    return save;
  }

  private asCharacterId(value: unknown): CharacterId | undefined {
    return CHARACTERS.some((character) => character.id === value) ? (value as CharacterId) : undefined;
  }

  private mergeCharacters(value: unknown): CharacterId[] {
    if (!Array.isArray(value)) return ["default"];
    const ids = value.filter((id): id is CharacterId => CHARACTERS.some((character) => character.id === id));
    return Array.from(new Set<CharacterId>(["default", ...ids]));
  }

  private mergeRegions(value: unknown): RegionId[] {
    if (!Array.isArray(value)) return ["jungleDay"];
    const ids = value.filter((id): id is RegionId => REGIONS.some((region) => region.id === id));
    return Array.from(new Set<RegionId>(["jungleDay", ...ids]));
  }

  private mergePowerUps(value: unknown): PowerUpType[] {
    const allowed: PowerUpType[] = ["magnet", "shield", "slowTime", "superJump", "bananaFrenzy", "eagleWard", "bossShield"];
    if (!Array.isArray(value)) return [];
    return value.filter((id): id is PowerUpType => allowed.includes(id));
  }

  private mergeStory(value: unknown): SaveData["story"] {
    const raw = value as Partial<SaveData["story"]> | undefined;
    const chapterIds = CHAPTERS.map((chapter) => chapter.id);
    const unlocked = Array.isArray(raw?.unlockedChapterIds)
      ? raw.unlockedChapterIds.filter((id): id is ChapterId => chapterIds.includes(id as ChapterId))
      : [];
    const completed = Array.isArray(raw?.completedChapterIds)
      ? raw.completedChapterIds.filter((id): id is ChapterId => chapterIds.includes(id as ChapterId))
      : [];
    return {
      unlockedChapterIds: Array.from(new Set<ChapterId>(["chapter1", ...unlocked])),
      completedChapterIds: Array.from(new Set<ChapterId>(completed)),
      stars: { ...(raw?.stars ?? {}) }
    };
  }
}

class SoundSystem {
  private context?: AudioContext;
  private lastPlayed = new Map<string, number>();

  unlock(): void {
    if (!this.context) {
      this.context = new AudioContext();
    }
    void this.context.resume();
  }

  play(kind: "jump" | "banana" | "gold" | "hit" | "perfect" | "power"): void {
    const now = performance.now();
    const previous = this.lastPlayed.get(kind) ?? 0;
    if (now - previous < 45) return;
    this.lastPlayed.set(kind, now);

    if (!this.context) return;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    const frequencies = {
      jump: 360,
      banana: 520,
      gold: 760,
      hit: 120,
      perfect: 920,
      power: 680
    };
    oscillator.frequency.value = frequencies[kind];
    oscillator.type = kind === "hit" ? "sawtooth" : "triangle";
    gain.gain.setValueAtTime(0.0001, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.045, this.context.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.context.currentTime + 0.16);
    oscillator.connect(gain);
    gain.connect(this.context.destination);
    oscillator.start();
    oscillator.stop(this.context.currentTime + 0.17);
  }
}

class InputManager {
  private queuedLane?: LaneIndex;
  private queuedPointer?: PointerInput;
  private leftRequested = false;
  private rightRequested = false;
  private pauseRequested = false;
  private safeJumpRequested = false;
  private primaryRequested = false;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly sound: SoundSystem
  ) {
    window.addEventListener("keydown", this.onKeyDown);
    this.canvas.addEventListener("pointerdown", this.onPointerDown);
    this.canvas.addEventListener("touchstart", (event) => event.preventDefault(), { passive: false });
  }

  consumeLane(): LaneIndex | undefined {
    const lane = this.queuedLane;
    this.queuedLane = undefined;
    return lane;
  }

  consumePointer(): PointerInput | undefined {
    const pointer = this.queuedPointer;
    this.queuedPointer = undefined;
    return pointer;
  }

  consumeLeft(): boolean {
    const value = this.leftRequested;
    this.leftRequested = false;
    return value;
  }

  consumeRight(): boolean {
    const value = this.rightRequested;
    this.rightRequested = false;
    return value;
  }

  consumePause(): boolean {
    const value = this.pauseRequested;
    this.pauseRequested = false;
    return value;
  }

  consumeSafeJump(): boolean {
    const value = this.safeJumpRequested;
    this.safeJumpRequested = false;
    return value;
  }

  consumePrimary(): boolean {
    const value = this.primaryRequested;
    this.primaryRequested = false;
    return value;
  }

  private queueLane(lane: LaneIndex): void {
    this.sound.unlock();
    this.queuedLane = lane;
  }

  private queuePointer(pointer: PointerInput): void {
    this.sound.unlock();
    this.queuedPointer = pointer;
  }

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    this.sound.unlock();
    if (event.key >= "1" && event.key <= "5") {
      this.queueLane((Number(event.key) - 1) as LaneIndex);
      return;
    }
    if (event.key === "a" || event.key === "A" || event.key === "ArrowLeft") {
      this.leftRequested = true;
      return;
    }
    if (event.key === "d" || event.key === "D" || event.key === "ArrowRight") {
      this.rightRequested = true;
      return;
    }
    if (event.key === " " || event.key === "Enter") {
      this.safeJumpRequested = event.key === " ";
      this.primaryRequested = true;
      return;
    }
    if (event.key === "p" || event.key === "P" || event.key === "Escape") {
      this.pauseRequested = true;
    }
  };

  private readonly onPointerDown = (event: PointerEvent): void => {
    event.preventDefault();
    this.sound.unlock();
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const lane = Math.max(0, Math.min(4, Math.floor((x / rect.width) * CONFIG.lanes))) as LaneIndex;
    this.queuePointer({
      lane,
      xRatio: Math.max(0, Math.min(1, x / rect.width)),
      yRatio: Math.max(0, Math.min(1, y / rect.height))
    });
  };
}

class Game {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly assets = new AssetStore();
  private readonly saveSystem = new SaveSystem();
  private readonly sound = new SoundSystem();
  private readonly input: InputManager;
  private save = this.saveSystem.load();
  private mode: GameMode = "menu";
  private width: number = CONFIG.baseWidth;
  private height: number = CONFIG.baseHeight;
  private dpr = 1;
  private lastTime = 0;
  private nextId = 1;
  private elapsed = 0;
  private distance = 0;
  private score = 0;
  private runBananas = 0;
  private combo = 1;
  private bestCombo = 1;
  private perfects = 0;
  private rescuesLeft = 0;
  private sequencesCompleted = 0;
  private runMissionBananas = 0;
  private runMissionPerfects = 0;
  private regionMessageTimer = 0;
  private message = "";
  private messageTimer = 0;
  private achievementTitle = "";
  private achievementText = "";
  private achievementTimer = 0;
  private deathReason = "";
  private newRecord = false;
  private rewardMessage = "";
  private campaignMissionIndex = 0;
  private missionStartBananas = 0;
  private missionStartDistance = 0;
  private missionStartScore = 0;
  private campaignSuccess = false;
  private currentChapter?: (typeof CHAPTERS)[number];
  private shake = 0;
  private worldOffset = 0;
  private backgroundCache?: HTMLCanvasElement;
  private backgroundCacheKey = "";
  private vineTypes: VineType[] = ["normal", "normal", "gold", "normal", "wet"];
  private monkeyLane: LaneIndex = 2;
  private monkeyFromLane: LaneIndex = 2;
  private monkeyTargetLane: LaneIndex = 2;
  private monkeyState: MonkeyState = "climbing";
  private monkeyJumpT = 1;
  private monkeyJumpDuration = 0.14;
  private monkeyTrail: MonkeyTrail[] = [];
  private vineSnapLane?: LaneIndex;
  private vineSnapTimer = 0;
  private queuedJump?: LaneIndex;
  private obstacleTimer = 0;
  private bananaTimer = 0;
  private confusionTimer = 0;
  private bossActive = false;
  private bossesCleared = 0;
  private sequence?: SequenceChallenge;
  private powerBar = 0;
  private recentDeadlyByLane = new Map<LaneIndex, number[]>();
  private obstacles: Obstacle[] = [];
  private bananas: Banana[] = [];
  private powerUps: PowerUpPickup[] = [];
  private activePowerUps: ActivePowerUp[] = [];
  private particles: Particle[] = [];

  constructor(private readonly canvas: HTMLCanvasElement) {
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas context olusturulamadi.");
    this.ctx = context;
    this.input = new InputManager(canvas, this.sound);
    window.addEventListener("resize", () => this.resize());
    this.resize();
  }

  async start(): Promise<void> {
    await this.assets.load();
    this.resetRun();
    requestAnimationFrame(this.tick);
  }

  private readonly tick = (time: number): void => {
    const delta = this.lastTime === 0 ? 0 : Math.min((time - this.lastTime) / 1000, 0.033);
    this.lastTime = time;
    this.handleInput();
    this.update(delta);
    this.render();
    requestAnimationFrame(this.tick);
  };

  private resize(): void {
    const maxWidth = Math.min(window.innerWidth, 520);
    this.width = Math.max(320, maxWidth);
    this.height = Math.max(560, window.innerHeight);
    const mobileDprCap = window.innerWidth <= 720 ? 1.25 : CONFIG.maxDpr;
    this.dpr = Math.min(window.devicePixelRatio || 1, mobileDprCap);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.backgroundCache = undefined;
    this.backgroundCacheKey = "";
  }

  private resetRun(chapter?: (typeof CHAPTERS)[number]): void {
    this.elapsed = 0;
    this.distance = 0;
    this.score = 0;
    this.runBananas = 0;
    this.combo = 1;
    this.bestCombo = 1;
    this.perfects = 0;
    this.rescuesLeft = 1;
    this.sequencesCompleted = 0;
    this.runMissionBananas = 0;
    this.runMissionPerfects = 0;
    this.regionMessageTimer = 0;
    this.message = "";
    this.messageTimer = 0;
    this.achievementTitle = "";
    this.achievementText = "";
    this.achievementTimer = 0;
    this.deathReason = "";
    this.newRecord = false;
    this.rewardMessage = "";
    this.campaignMissionIndex = 0;
    this.missionStartBananas = 0;
    this.missionStartDistance = 0;
    this.missionStartScore = 0;
    this.campaignSuccess = false;
    this.currentChapter = chapter;
    this.shake = 0;
    this.worldOffset = 0;
    this.monkeyLane = 2;
    this.monkeyFromLane = 2;
    this.monkeyTargetLane = 2;
    this.monkeyState = "climbing";
    this.monkeyJumpT = 1;
    this.monkeyTrail = [];
    this.vineSnapLane = undefined;
    this.vineSnapTimer = 0;
    this.queuedJump = undefined;
    this.obstacleTimer = CONFIG.obstacleStartDelay;
    this.bananaTimer = CONFIG.bananaStartDelay;
    this.confusionTimer = 0;
    this.bossActive = false;
    this.bossesCleared = 0;
    this.sequence = undefined;
    this.powerBar = 0;
    this.recentDeadlyByLane.clear();
    this.obstacles = [];
    this.bananas = [];
    this.powerUps = [];
    this.activePowerUps = [];
    if (this.save.upgrades.startShield > 0) {
      this.activePowerUps.push({ type: "shield", timeLeft: 7 + this.save.upgrades.powerDuration });
    }
    if (this.save.pendingPowerUps.length > 0) {
      for (const powerUp of this.save.pendingPowerUps.splice(0, 2)) {
        this.activatePowerUp(powerUp);
      }
      this.saveSystem.save(this.save);
    }
    this.particles = [];
    this.refreshVines();
  }

  private handleInput(): void {
    if (this.input.consumePause()) {
      if (this.mode === "playing") this.mode = "paused";
      else if (this.mode === "paused") this.mode = "playing";
    }

    const pointerInput = this.input.consumePointer();
    const laneInput = pointerInput?.lane ?? this.input.consumeLane();
    const primary = this.input.consumePrimary();

    if (this.mode === "menu") {
      if (pointerInput || laneInput !== undefined || primary) {
        this.handleMenuInput(pointerInput, laneInput, primary);
        return;
      }
      return;
    }

    if (this.mode === "settings" || this.mode === "characters") {
      if (laneInput !== undefined) this.handleMetaLane(laneInput);
      if (primary) this.mode = "menu";
      return;
    }

    if (this.mode === "gameOver") {
      if (laneInput === 4) {
        this.mode = "menu";
        return;
      }
      if (primary || laneInput !== undefined) {
        this.resetRun();
        this.mode = "playing";
      }
      return;
    }

    if (this.mode !== "playing") return;

    if (this.input.consumeSafeJump()) {
      this.requestJump(this.findSafestLane());
    }

    if (this.input.consumeLeft()) {
      this.requestJump(Math.max(0, this.monkeyTargetLane - 1) as LaneIndex);
    }

    if (this.input.consumeRight()) {
      this.requestJump(Math.min(4, this.monkeyTargetLane + 1) as LaneIndex);
    }

    if (laneInput !== undefined) {
      this.requestJump(laneInput);
    }
  }

  private handleMenuInput(pointer: PointerInput | undefined, lane: LaneIndex | undefined, primary: boolean): void {
    if (primary) {
      this.startCampaignRun();
      return;
    }

    if (pointer) {
      if (pointer.yRatio <= 0.15 && pointer.xRatio >= 0.74) {
        this.mode = "settings";
        return;
      }
      if (pointer.yRatio >= 0.35 && pointer.yRatio <= 0.68) {
        this.selectOrUnlockCharacter(pointer.lane);
        return;
      }
      if (pointer.yRatio >= 0.72) {
        this.startCampaignRun();
        return;
      }
      return;
    }

    if (lane !== undefined) {
      this.selectOrUnlockCharacter(lane);
      return;
    }
  }

  private startCampaignRun(): void {
    this.resetRun();
    this.mode = "playing";
  }

  private handleMetaLane(lane: LaneIndex): void {
    if (lane === 4) {
      this.mode = "menu";
      return;
    }
    if (this.mode === "settings") {
      this.toggleSetting(lane);
    } else if (this.mode === "characters") {
      this.selectOrUnlockCharacter(lane);
    }
  }

  private selectOrUnlockCharacter(lane: LaneIndex): void {
    const character = CHARACTERS[lane];
    if (!character) return;
    if (this.save.unlockedCharacterIds.includes(character.id)) {
      this.save.selectedCharacterId = character.id;
      this.saveSystem.save(this.save);
      this.flash(`${character.name} secildi`);
      return;
    }
    if (!this.isCharacterUnlockMet(character.unlock)) {
      this.flash(this.getCharacterRequirementText(character.unlock));
      return;
    }
    this.save.unlockedCharacterIds.push(character.id);
    this.save.selectedCharacterId = character.id;
    this.saveSystem.save(this.save);
    this.celebrate("Yeni karakter!", `${character.name} artik ormanda`, "#ffe675");
  }

  private toggleSetting(lane: LaneIndex): void {
    if (lane === 0) {
      this.save.settings.sfxVolume = this.save.settings.sfxVolume > 0 ? 0 : 1;
      this.flash(this.save.settings.sfxVolume > 0 ? "Ses acik" : "Ses kapali");
    } else if (lane === 1) {
      this.save.settings.vibration = !this.save.settings.vibration;
      this.flash(this.save.settings.vibration ? "Titresim acik" : "Titresim kapali");
    } else if (lane === 2) {
      this.save.settings.quality =
        this.save.settings.quality === "low" ? "medium" : this.save.settings.quality === "medium" ? "high" : "low";
      this.flash(`Kalite ${this.save.settings.quality}`);
    }
    this.saveSystem.save(this.save);
  }

  private flash(text: string): void {
    this.message = text;
    this.messageTimer = 1.1;
  }

  private celebrate(title: string, text: string, color = "#ffe675"): void {
    this.achievementTitle = title;
    this.achievementText = text;
    this.achievementTimer = 2.4;
    this.message = title;
    this.messageTimer = 1.2;
    this.addParticles(this.getMonkeyX(), this.getMonkeyY() - 50, 44, color);
    this.sound.play("perfect");
  }

  private requestJump(lane: LaneIndex): void {
    if (this.confusionTimer > 0) {
      lane = (4 - lane) as LaneIndex;
    }
    if (lane === this.monkeyTargetLane && this.monkeyJumpT >= 1) return;
    if (this.monkeyJumpT < 1) {
      this.queuedJump = lane;
      return;
    }
    const distance = Math.abs(lane - this.monkeyLane);
    if (distance === 0) return;
    this.monkeyFromLane = this.monkeyLane;
    this.monkeyTargetLane = lane;
    this.monkeyState = "jumping";
    this.monkeyJumpT = 0;
    this.vineSnapLane = this.monkeyLane;
    this.vineSnapTimer = 0.18;
    this.monkeyTrail = [];
    const characterBonus = this.save.selectedCharacterId === "ninja" ? 18 : 0;
    const upgradeBonus = this.save.upgrades.jumpSpeed * 8;
    const superJumpBonus = this.hasPowerUp("superJump") ? 42 : 0;
    this.monkeyJumpDuration = Math.max(0.055, (CONFIG.baseJumpMs + distance * CONFIG.extraJumpMs - characterBonus - upgradeBonus - superJumpBonus) / 1000);
    this.sound.play("jump");
    this.addParticles(this.getLaneX(this.monkeyLane), this.getMonkeyY() + 18, 8, "#f4cf59");
    if (this.isNearDanger(this.monkeyLane)) {
      this.awardPerfect("Kil Payi!");
    }
  }

  private update(delta: number): void {
    this.updateParticles(delta);
    this.updateMonkeyTrail(delta);
    if (this.messageTimer > 0) this.messageTimer -= delta;
    if (this.achievementTimer > 0) this.achievementTimer -= delta;
    if (this.regionMessageTimer > 0) this.regionMessageTimer -= delta;
    if (this.vineSnapTimer > 0) this.vineSnapTimer = Math.max(0, this.vineSnapTimer - delta);
    if (this.shake > 0) this.shake = Math.max(0, this.shake - delta * 18);
    if (this.mode !== "playing") return;

    this.elapsed += delta;
    this.updatePowerUps(delta);
    if (this.confusionTimer > 0) this.confusionTimer = Math.max(0, this.confusionTimer - delta);
    this.bossActive = false;
    this.sequence = undefined;
    const speed = this.getSpeed() * (this.hasPowerUp("slowTime") ? 0.62 : 1);
    this.distance += speed * delta * 0.06;
    this.score += speed * delta * 0.11 * this.combo;
    const vineStep = CONFIG.vineSegmentHeight - CONFIG.vineTileOverlap;
    this.worldOffset = (this.worldOffset + speed * delta) % vineStep;
    this.unlockReachedRegions();

    this.updateMonkey(delta);
    this.updateSpawns(delta);
    this.moveObjects(delta, speed);
    this.applyMagnet(delta);
    this.checkCollisions();
    this.checkCampaignMission();
    this.currentChapter = undefined;
    this.refreshVines();
  }

  private updatePowerUps(delta: number): void {
    for (const powerUp of this.activePowerUps) {
      powerUp.timeLeft -= delta;
    }
    this.activePowerUps = this.activePowerUps.filter((powerUp) => powerUp.timeLeft > 0);
  }

  private hasPowerUp(type: PowerUpType): boolean {
    return this.activePowerUps.some((powerUp) => powerUp.type === type);
  }

  private activatePowerUp(type: PowerUpType): void {
    const durations: Record<PowerUpType, number> = {
      magnet: 8 + this.save.upgrades.powerDuration,
      shield: 10 + this.save.upgrades.powerDuration,
      slowTime: 5 + this.save.upgrades.powerDuration * 0.6,
      superJump: 9 + this.save.upgrades.powerDuration * 0.8,
      bananaFrenzy: 7 + this.save.upgrades.powerDuration * 0.7,
      eagleWard: 14 + this.save.upgrades.powerDuration,
      bossShield: 16 + this.save.upgrades.powerDuration
    };
    const existing = this.activePowerUps.find((powerUp) => powerUp.type === type);
    if (existing) existing.timeLeft = durations[type];
    else {
      if (this.activePowerUps.length >= 2) {
        this.activePowerUps.sort((a, b) => a.timeLeft - b.timeLeft);
        this.activePowerUps.shift();
      }
      this.activePowerUps.push({ type, timeLeft: durations[type] });
    }
    this.message = this.getPowerUpLabel(type);
    this.messageTimer = 1;
    this.sound.play("power");
    if (type === "shield") this.addParticles(this.getMonkeyX(), this.getMonkeyY(), 22, "#8fd4ff");
  }

  private getPowerUpLabel(type: PowerUpType): string {
    if (type === "magnet") return "Miknatis!";
    if (type === "shield") return "Kalkan!";
    if (type === "slowTime") return "Yavas Zaman!";
    if (type === "superJump") return "Super Zipla!";
    if (type === "bananaFrenzy") return "Muz Deliligi!";
    if (type === "eagleWard") return "Kartal Kovucu!";
    return "Kalkan!";
  }

  private getPowerUpShortLabel(type: PowerUpType): string {
    if (type === "magnet") return "Miknatis";
    if (type === "shield") return "Kalkan";
    if (type === "slowTime") return "Yavas";
    if (type === "superJump") return "Super";
    if (type === "bananaFrenzy") return "Muz+";
    if (type === "eagleWard") return "Kartal";
    return "Kalkan";
  }

  private addPowerBar(amount: number): void {
    const wasReady = this.powerBar >= CONFIG.powerBarCapacity;
    this.powerBar = Math.min(CONFIG.powerBarCapacity, this.powerBar + amount);
    if (!wasReady && this.powerBar >= CONFIG.powerBarCapacity) {
      this.celebrate("Guc doldu!", "Ozel hamle hazir", "#5ed7ff");
    }
  }

  private unlockReachedRegions(): void {
    const region = this.getCurrentRegion();
    if (this.save.unlockedRegionIds.includes(region.id)) return;
    this.save.unlockedRegionIds.push(region.id);
    this.saveSystem.save(this.save);
    this.regionMessageTimer = 2.4;
    this.celebrate("Yeni bolge!", `${region.name} acildi`, region.accent);
  }

  private updateMonkey(delta: number): void {
    if (this.monkeyJumpT < 1) {
      this.monkeyJumpT = Math.min(1, this.monkeyJumpT + delta / this.monkeyJumpDuration);
      this.addMonkeyTrail();
      if (this.monkeyJumpT >= 1) {
        this.monkeyLane = this.monkeyTargetLane;
        this.vineSnapLane = this.monkeyLane;
        this.vineSnapTimer = 0.26;
        this.addParticles(this.getLaneX(this.monkeyLane), this.getMonkeyY() + 24, 7, "#9df06f");
        this.monkeyState = "climbing";
        this.handleVineLanding();
        if (this.queuedJump !== undefined) {
          const lane = this.queuedJump;
          this.queuedJump = undefined;
          this.requestJump(lane);
        }
      }
    }
  }

  private updateMonkeyTrail(delta: number): void {
    for (const trail of this.monkeyTrail) {
      trail.life -= delta;
    }
    this.monkeyTrail = this.monkeyTrail.filter((trail) => trail.life > 0);
  }

  private addMonkeyTrail(): void {
    if (window.innerWidth <= 720) return;
    if (this.save.settings.quality === "low") return;
    if (this.monkeyTrail.length > 5) this.monkeyTrail.shift();
    const pose = this.getMonkeyPose();
    this.monkeyTrail.push({
      x: pose.x,
      y: pose.y,
      rotation: pose.rotation,
      scaleX: pose.scaleX,
      scaleY: pose.scaleY,
      life: 0.18,
      maxLife: 0.18
    });
  }

  private updateSpawns(delta: number): void {
    this.obstacleTimer -= delta;
    this.bananaTimer -= delta;
    if (this.obstacleTimer <= 0) {
      this.spawnObstacle();
      this.obstacleTimer = Math.max(0.48, 1.14 - this.elapsed * 0.004 - Math.random() * 0.25);
    }
    if (this.bananaTimer <= 0) {
      this.spawnBanana();
      this.bananaTimer = Math.max(0.32, 0.68 - this.elapsed * 0.0015 + Math.random() * 0.18);
    }
  }

  private moveObjects(delta: number, speed: number): void {
    const movement = speed * delta;
    for (const obstacle of this.obstacles) obstacle.y += movement;
    for (const banana of this.bananas) banana.y += movement;
    for (const powerUp of this.powerUps) powerUp.y += movement;
    this.obstacles = this.obstacles.filter((obstacle) => obstacle.y < this.height + 130);
    this.bananas = this.bananas.filter((banana) => banana.y < this.height + 90 && !banana.collected);
    this.powerUps = this.powerUps.filter((powerUp) => powerUp.y < this.height + 90 && !powerUp.collected);
  }

  private applyMagnet(delta: number): void {
    if (!this.hasPowerUp("magnet")) return;
    const monkeyX = this.getMonkeyX();
    const monkeyY = this.getMonkeyY();
    for (const banana of this.bananas) {
      if (banana.collected) continue;
      const dx = monkeyX - this.getLaneX(banana.lane);
      const dy = monkeyY - banana.y;
      if (Math.abs(dx) > this.width * 0.34 || Math.abs(dy) > 230) continue;
      banana.y += Math.sign(dy) * Math.min(Math.abs(dy), 260 * delta);
      if (Math.abs(dx) < 54 && Math.abs(dy) < 58) {
        banana.lane = this.monkeyLane;
      }
    }
  }

  private spawnObstacle(): void {
    const roll = Math.random();
    const type = this.pickObstacleType(roll);
    const lane = this.pickObstacleLane(type);
    if (lane === undefined) return;
    const size = this.getObstacleSize(type);
    const dimensions = this.getObstacleDimensions(type, size);
    this.obstacles.push({
      id: this.nextId,
      lane,
      y: CONFIG.spawnY - Math.random() * 90,
      width: dimensions.width,
      height: dimensions.height,
      type,
      warningY: type === "coconut" ? 36 : undefined
    });
    this.rememberDeadlySpawn(lane, type);
    this.nextId += 1;
  }

  private pickObstacleType(roll: number): ObstacleType {
    if (this.elapsed < 20) return roll < 0.72 ? "snake" : "thorn";
    if (this.elapsed < 55) return roll < 0.34 ? "snake" : roll < 0.58 ? "thorn" : roll < 0.82 ? "coconut" : "beeSwarm";
    if (roll < 0.28) return "snake";
    if (roll < 0.48) return "thorn";
    if (roll < 0.65) return "coconut";
    if (roll < 0.8) return "beeSwarm";
    if (roll < 0.92) return "spiderWeb";
    return "eagleShadow";
  }

  private getObstacleSize(type: ObstacleType): number {
    if (type === "snake") return 92;
    if (type === "thorn") return 62;
    if (type === "coconut") return 68;
    if (type === "beeSwarm") return 84;
    if (type === "spiderWeb") return 74;
    if (type === "eagleShadow") return 92;
    return 74;
  }

  private getObstacleDimensions(type: ObstacleType, size: number): { width: number; height: number } {
    if (type === "snake") return { width: Math.round(size * 0.68), height: Math.round(size * 1.28) };
    if (type === "thorn") return { width: Math.round(size * 1.16), height: Math.round(size * 2.08) };
    if (type === "beeSwarm") return { width: Math.round(size * 1.08), height: Math.round(size * 0.92) };
    return { width: size, height: size };
  }

  private pickObstacleLane(type: ObstacleType): LaneIndex | undefined {
    const candidates = ([0, 1, 2, 3, 4] as LaneIndex[]).filter(
      (lane) => this.laneHasSpawnRoom(lane) && (!this.isDeadlyObstacle(type) || this.canSpawnDeadlyOnLane(lane, this.elapsed))
    );
    const safeCandidates = candidates.filter((lane) => this.wouldKeepSafePath(lane as LaneIndex));
    const pool = safeCandidates.length > 0 ? safeCandidates : candidates;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  private laneHasSpawnRoom(lane: LaneIndex): boolean {
    return !this.obstacles.some((obstacle) => obstacle.lane === lane && obstacle.y < CONFIG.safeSpawnGap);
  }

  private wouldKeepSafePath(blockedLane: LaneIndex): boolean {
    const dangerNearTop = new Set<number>([blockedLane]);
    for (const obstacle of this.obstacles) {
      if (obstacle.y > -80 && obstacle.y < this.height * 0.44) {
        dangerNearTop.add(obstacle.lane);
      }
    }
    return dangerNearTop.size <= 4;
  }

  private canSpawnDeadlyOnLane(lane: LaneIndex, nowSec: number): boolean {
    const recent = (this.recentDeadlyByLane.get(lane) ?? []).filter((time) => nowSec - time <= CONFIG.deadlyLaneCooldown);
    this.recentDeadlyByLane.set(lane, recent);
    return recent.length < 2;
  }

  private rememberDeadlySpawn(lane: LaneIndex, type: ObstacleType): void {
    if (!this.isDeadlyObstacle(type)) return;
    const recent = (this.recentDeadlyByLane.get(lane) ?? []).filter((time) => this.elapsed - time <= CONFIG.deadlyLaneCooldown);
    recent.push(this.elapsed);
    this.recentDeadlyByLane.set(lane, recent);
  }

  private isDeadlyObstacle(type: ObstacleType): boolean {
    return type === "snake" || type === "thorn" || type === "eagleShadow";
  }

  private spawnBanana(): void {
    const lane = Math.floor(Math.random() * 5) as LaneIndex;
    const riskBonus = this.obstacles.some((obstacle) => obstacle.lane === lane && obstacle.y > 45 && obstacle.y < this.height * 0.62);
    const type = this.pickBananaType(riskBonus);
    this.bananas.push({
      id: this.nextId,
      lane,
      y: CONFIG.spawnY - Math.random() * 120,
      width: type === "gold" || type === "red" || type === "blue" || type === "purple" ? 46 : 40,
      height: type === "gold" || type === "red" || type === "blue" || type === "purple" ? 46 : 40,
      type
    });
    this.nextId += 1;
  }

  private pickBananaType(riskBonus: boolean): BananaType {
    const roll = Math.random();
    if (riskBonus && roll < 0.48) return "gold";
    if (this.elapsed > 25 && roll < 0.1) return "red";
    if (this.elapsed > 35 && roll < 0.17) return "blue";
    if (this.elapsed > 45 && roll < 0.23) return "purple";
    if (this.elapsed > 55 && roll < 0.29) return "rotten";
    if (riskBonus || roll < 0.13) return "gold";
    return "normal";
  }

  private checkCollisions(): void {
    const monkey = this.getMonkeyHitbox();
    for (const banana of this.bananas) {
      if (!banana.collected && banana.lane === this.monkeyLane && intersects(monkey, this.getThingHitbox(banana, 0.7))) {
        banana.collected = true;
        const reward = this.getBananaReward(banana.type);
        const isGold = banana.type === "gold";
        const isSpecial = banana.type !== "normal";
        const value = reward.currency;
        const scoreValue = this.hasPowerUp("bananaFrenzy") ? Math.floor(reward.score * 1.8) : reward.score;
        const characterBonus = banana.type === "gold" && this.save.selectedCharacterId === "pirate" ? 2 : 0;
        const frenzyBonus = this.hasPowerUp("bananaFrenzy") && banana.type !== "rotten" ? 1 : 0;
        const currencyValue = value + this.save.upgrades.bananaValue + characterBonus + frenzyBonus;
        this.runBananas += currencyValue;
        this.runMissionBananas += currencyValue;
        this.score += scoreValue * this.combo;
        if (banana.type === "normal") this.addPowerBar(CONFIG.powerBarFill.normalBanana);
        if (banana.type === "gold") this.addPowerBar(CONFIG.powerBarFill.goldBanana);
        this.sound.play(isGold ? "gold" : "banana");
        this.addParticles(this.getLaneX(banana.lane), banana.y, isSpecial ? 16 : 9, this.getBananaColor(banana.type));
        if (isGold) this.awardPerfect("Muz Delisi!");
        if (banana.type === "red") this.awardPerfect("Alev Combo!");
        if (banana.type === "blue") this.activatePowerUp("slowTime");
        if (banana.type === "purple") this.activatePowerUp("shield");
        if (banana.type === "rotten") {
          this.confusionTimer = 1.4;
          this.resetCombo();
          this.message = "Curuk Muz!";
          this.messageTimer = 0.9;
        }
      }
    }

    for (const powerUp of this.powerUps) {
      if (!powerUp.collected && powerUp.lane === this.monkeyLane && intersects(monkey, this.getThingHitbox(powerUp, 0.74))) {
        powerUp.collected = true;
        this.activatePowerUp(powerUp.type);
        this.score += 80 * this.combo;
      }
    }

    for (const obstacle of this.obstacles) {
      if (obstacle.lane !== this.monkeyLane) continue;
      if (!intersects(monkey, this.getThingHitbox(obstacle, 0.62))) continue;
      if (this.resolveObstacleWithPowerUp(obstacle.type)) {
        obstacle.collected = true;
        this.obstacles = this.obstacles.filter((item) => item.id !== obstacle.id);
        return;
      }
      this.resetCombo();
      this.endRun(this.getDeathReason(obstacle.type));
      return;
    }
  }

  private getBananaReward(type: BananaType): { score: number; currency: number } {
    if (type === "gold") return { score: 100, currency: 10 };
    if (type === "red") return { score: 55, currency: 2 };
    if (type === "blue") return { score: 35, currency: 2 };
    if (type === "purple") return { score: 45, currency: 3 };
    if (type === "rotten") return { score: -30, currency: 0 };
    return { score: 18, currency: 1 };
  }

  private getBananaColor(type: BananaType): string {
    if (type === "gold") return "#ffd95a";
    if (type === "red") return "#ff6b3d";
    if (type === "blue") return "#5ed7ff";
    if (type === "purple") return "#d779ff";
    if (type === "rotten") return "#9bc35b";
    return "#fff18f";
  }

  private resolveObstacleWithPowerUp(type: ObstacleType): boolean {
    if (type === "eagleShadow") {
      const eagleWard = this.activePowerUps.find((powerUp) => powerUp.type === "eagleWard");
      if (eagleWard) {
        eagleWard.timeLeft = 0;
        this.score += 140 * this.combo;
        this.awardPerfect("Kartal Kacti!");
        return true;
      }
    }

    if (this.bossActive) {
      const bossShield = this.activePowerUps.find((powerUp) => powerUp.type === "bossShield");
      if (bossShield) {
        bossShield.timeLeft = 0;
        this.score += 180 * this.combo;
        this.message = "Kalkan!";
        this.messageTimer = 1;
        this.shake = 0.45;
        this.addParticles(this.getMonkeyX(), this.getMonkeyY(), 30, "#ffcf7b");
        return true;
      }
    }

    const shield = this.activePowerUps.find((powerUp) => powerUp.type === "shield");
    if (!shield) return false;
    shield.timeLeft = 0;
    this.score += 120 * this.combo;
    this.message = "Kalkan Kirdi!";
    this.messageTimer = 1;
    this.shake = 0.55;
    this.sound.play("power");
    this.addParticles(this.getMonkeyX(), this.getMonkeyY(), 28, "#8fd4ff");
    return true;
  }

  private handleVineLanding(): void {
    return;
  }

  private resetCombo(): void {
    this.combo = 1;
  }

  private endRun(reason: string): void {
    this.deathReason = reason;
    this.mode = "gameOver";
    this.shake = 1;
    this.sound.play("hit");
    this.addParticles(this.getLaneX(this.monkeyLane), this.getMonkeyY(), 24, "#ff6f61");
    const finalScore = Math.floor(this.score);
    this.newRecord = finalScore > this.save.highScore;
    if (this.newRecord) {
      this.runBananas += 25;
      this.rewardMessage = "Yeni Rekor! +25 muz";
      this.addParticles(this.getMonkeyX(), this.getMonkeyY() - 40, 44, "#ffe675");
      this.sound.play("perfect");
    } else {
      this.rewardMessage = "";
    }
    this.save.highScore = Math.max(this.save.highScore, finalScore);
    this.save.totalBananas += this.runBananas;
    this.save.maxDistance = Math.max(this.save.maxDistance, Math.floor(this.distance));
    const unlocked = this.unlockEligibleCharacters();
    if (unlocked.length > 0) {
      this.rewardMessage = this.rewardMessage ? `${this.rewardMessage}  ${unlocked.join(", ")} acildi` : `${unlocked.join(", ")} acildi`;
    }
    this.applyMissionProgress();
    this.saveSystem.save(this.save);
  }

  private checkCampaignMission(): void {
    const mission = CAMPAIGN_MISSIONS[this.campaignMissionIndex];
    if (!mission || this.mode !== "playing") return;
    if (!this.isCampaignMissionComplete(mission)) return;
    this.completeCampaignMission();
  }

  private isCampaignMissionComplete(mission: CampaignMission): boolean {
    const goal = mission.goal;
    if (goal.bananas !== undefined && this.runBananas - this.missionStartBananas < goal.bananas) return false;
    if (goal.distance !== undefined && this.distance - this.missionStartDistance < goal.distance) return false;
    if (goal.score !== undefined && Math.floor(this.score - this.missionStartScore) < goal.score) return false;
    return true;
  }

  private completeCampaignMission(): void {
    const mission = CAMPAIGN_MISSIONS[this.campaignMissionIndex];
    if (!mission) return;
    this.score += 250 * (this.campaignMissionIndex + 1);
    this.runBananas += 15 + this.campaignMissionIndex * 5;
    const accent = REGIONS.find((region) => region.id === mission.region)?.accent ?? "#ffe675";
    this.celebrate("Gorev tamam!", `${mission.title} odulu alindi`, accent);
    this.campaignMissionIndex += 1;
    if (this.campaignMissionIndex >= CAMPAIGN_MISSIONS.length) {
      this.completeCampaign();
      return;
    }
    this.missionStartBananas = this.runBananas;
    this.missionStartDistance = this.distance;
    this.missionStartScore = this.score;
    const nextMission = CAMPAIGN_MISSIONS[this.campaignMissionIndex];
    this.achievementText = `Siradaki: ${nextMission.title} - ${nextMission.text}`;
    this.achievementTimer = Math.max(this.achievementTimer, 2.6);
    this.regionMessageTimer = 2.6;
    this.shake = 0.45;
  }

  private completeCampaign(): void {
    this.campaignSuccess = true;
    this.deathReason = "Ormani kurtardin!";
    this.mode = "gameOver";
    this.rewardMessage = "Tebrikler! Butun gorevler tamamlandi";
    this.runBananas += 75;
    const finalScore = Math.floor(this.score + 1200);
    this.score = finalScore;
    this.newRecord = finalScore > this.save.highScore;
    this.save.highScore = Math.max(this.save.highScore, finalScore);
    this.save.totalBananas += this.runBananas;
    this.save.maxDistance = Math.max(this.save.maxDistance, Math.floor(this.distance));
    const unlocked = this.unlockEligibleCharacters();
    if (unlocked.length > 0) this.rewardMessage = `${this.rewardMessage}  ${unlocked.join(", ")} acildi`;
    this.applyMissionProgress();
    this.saveSystem.save(this.save);
    this.shake = 0.7;
    this.celebrate("Orman kurtuldu!", "Butun harita gorevleri bitti", "#ffe675");
  }

  private getCurrentCampaignMission(): CampaignMission {
    return CAMPAIGN_MISSIONS[Math.min(this.campaignMissionIndex, CAMPAIGN_MISSIONS.length - 1)] ?? CAMPAIGN_MISSIONS[0];
  }

  private getCampaignProgress(mission = this.getCurrentCampaignMission()): { text: string; ratio: number } {
    const parts: string[] = [];
    const ratios: number[] = [];
    if (mission.goal.bananas !== undefined) {
      const value = Math.max(0, this.runBananas - this.missionStartBananas);
      parts.push(`Muz ${Math.min(value, mission.goal.bananas)}/${mission.goal.bananas}`);
      ratios.push(value / mission.goal.bananas);
    }
    if (mission.goal.distance !== undefined) {
      const value = Math.max(0, Math.floor(this.distance - this.missionStartDistance));
      parts.push(`${Math.min(value, mission.goal.distance)}/${mission.goal.distance}m`);
      ratios.push(value / mission.goal.distance);
    }
    if (mission.goal.score !== undefined) {
      const value = Math.max(0, Math.floor(this.score - this.missionStartScore));
      parts.push(`Skor ${Math.min(value, mission.goal.score)}/${mission.goal.score}`);
      ratios.push(value / mission.goal.score);
    }
    return {
      text: parts.join("  "),
      ratio: Math.max(0, Math.min(1, Math.min(...ratios)))
    };
  }

  private unlockEligibleCharacters(): string[] {
    const unlockedNames: string[] = [];
    for (const character of CHARACTERS) {
      if (this.save.unlockedCharacterIds.includes(character.id)) continue;
      if (!this.isCharacterUnlockMet(character.unlock)) continue;
      this.save.unlockedCharacterIds.push(character.id);
      unlockedNames.push(character.name);
    }
    return unlockedNames;
  }

  private isCharacterUnlockMet(rule: CharacterUnlockRule): boolean {
    if (rule.score !== undefined && this.save.highScore < rule.score) return false;
    if (rule.distance !== undefined && this.save.maxDistance < rule.distance) return false;
    if (rule.bananas !== undefined && this.save.totalBananas < rule.bananas) return false;
    return true;
  }

  private getCharacterRequirementText(rule: CharacterUnlockRule): string {
    const parts: string[] = [];
    if (rule.score !== undefined) parts.push(`${rule.score} skor`);
    if (rule.distance !== undefined) parts.push(`${rule.distance}m mesafe`);
    if (rule.bananas !== undefined) parts.push(`${rule.bananas} muz`);
    return parts.length > 0 ? parts.join(" + ") : "Acik";
  }

  private applyMissionProgress(): void {
    this.save.missions.progress.collect_25 = Math.max(this.save.missions.progress.collect_25 ?? 0, this.runMissionBananas);
    this.save.missions.progress.perfect_5 = Math.max(this.save.missions.progress.perfect_5 ?? 0, this.runMissionPerfects);
    this.save.missions.progress.distance_300 = Math.max(this.save.missions.progress.distance_300 ?? 0, Math.floor(this.distance));
    this.save.missions.progress.boss_1 = Math.max(this.save.missions.progress.boss_1 ?? 0, this.bossesCleared);
    this.save.missions.progress.sequence_2 = Math.max(this.save.missions.progress.sequence_2 ?? 0, this.sequencesCompleted);
  }

  private getDeathReason(type: ObstacleType): string {
    if (type === "snake") return "Yilanla tokalasilmaz.";
    if (type === "thorn") return "Sarmasik seni sevmedi.";
    if (type === "coconut") return "Hindistan cevizi kafaya geldi.";
    if (type === "beeSwarm") return "Ari surusu sinirliymis.";
    if (type === "spiderWeb") return "Agda biraz fazla kaldin.";
    return "Kartal seni kargoya verdi.";
  }

  private awardPerfect(text: string): void {
    this.combo = Math.min(8, this.combo + 1);
    this.bestCombo = Math.max(this.bestCombo, this.combo);
    this.perfects += 1;
    this.runMissionPerfects += 1;
    this.score += 55 * this.combo;
    this.message = text;
    this.messageTimer = 0.9;
    this.addPowerBar(text === "Kil Payi!" ? CONFIG.powerBarFill.nearMiss : CONFIG.powerBarFill.perfectJump);
    this.sound.play("perfect");
  }

  private isNearDanger(lane: LaneIndex): boolean {
    const monkeyY = this.getMonkeyY();
    return this.obstacles.some((obstacle) => obstacle.lane === lane && obstacle.y > monkeyY - 90 && obstacle.y < monkeyY + CONFIG.nearMissDistance);
  }

  private isLaneDangerous(lane: LaneIndex): boolean {
    const monkeyY = this.getMonkeyY();
    return this.obstacles.some((obstacle) => obstacle.lane === lane && obstacle.y > 70 && obstacle.y < monkeyY + 24);
  }

  private findSafestLane(): LaneIndex {
    let bestLane = this.monkeyTargetLane;
    let bestScore = -Infinity;
    for (let lane = 0; lane < 5; lane += 1) {
      let laneScore = -Math.abs(lane - this.monkeyTargetLane) * 12;
      for (const obstacle of this.obstacles) {
        if (obstacle.lane !== lane) continue;
        const gap = Math.abs(obstacle.y - this.getMonkeyY());
        if (gap < 160) laneScore -= 260 - gap;
      }
      const nearbyGold = this.bananas.some((banana) => banana.lane === lane && banana.type === "gold" && banana.y > 100 && banana.y < this.height * 0.78);
      if (nearbyGold) laneScore += 22;
      if (laneScore > bestScore) {
        bestScore = laneScore;
        bestLane = lane as LaneIndex;
      }
    }
    return bestLane;
  }

  private refreshVines(): void {
    this.vineTypes = this.vineTypes.map(() => "normal");
  }

  private updateParticles(delta: number): void {
    for (const particle of this.particles) {
      particle.life -= delta;
      particle.x += particle.vx * delta;
      particle.y += particle.vy * delta;
      particle.vy += 160 * delta;
    }
    this.particles = this.particles.filter((particle) => particle.life > 0);
  }

  private addParticles(x: number, y: number, count: number, color: string): void {
    const maxParticles = this.save.settings.quality === "low" ? 18 : this.save.settings.quality === "medium" ? 36 : 56;
    const budget = maxParticles - this.particles.length;
    const actualCount = Math.max(0, Math.min(count, budget));
    for (let i = 0; i < actualCount; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 45 + Math.random() * 150;
      const life = 0.28 + Math.random() * 0.42;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 35,
        life,
        maxLife: life,
        color,
        radius: 2 + Math.random() * 3.5
      });
    }
  }

  private render(): void {
    const ctx = this.ctx;
    ctx.save();
    const shakeX = this.shake > 0 ? (Math.random() - 0.5) * this.shake * 12 : 0;
    const shakeY = this.shake > 0 ? (Math.random() - 0.5) * this.shake * 12 : 0;
    ctx.translate(shakeX, shakeY);
    this.drawBackground();
    this.drawVines();
    this.drawObjects();
    this.drawMonkey();
    this.drawParticles();
    this.drawHud();
    if (this.mode === "menu") this.drawMenu();
    if (this.mode === "paused") this.drawPause();
    if (this.mode === "gameOver") this.drawGameOver();
    if (this.mode === "settings") this.drawSettings();
    if (this.mode === "characters") this.drawCharacters();
    ctx.restore();
  }

  private drawBackground(): void {
    const ctx = this.ctx;
    const region = this.getCurrentRegion();
    const cached = this.getBackgroundCache(region);
    if (cached) {
      ctx.drawImage(cached, 0, 0);
    } else {
      const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
      gradient.addColorStop(0, "#235a43");
      gradient.addColorStop(1, "#091714");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, this.width, this.height);
    }
    ctx.fillStyle = region.tint;
    ctx.fillRect(0, 0, this.width, this.height);
  }

  private getCurrentRegion(): (typeof REGIONS)[number] {
    if (this.mode === "playing" || this.mode === "gameOver") {
      const mission = this.getCurrentCampaignMission();
      return REGIONS.find((region) => region.id === mission.region) ?? REGIONS[0];
    }
    if (this.currentChapter) {
      return REGIONS.find((region) => region.id === this.currentChapter?.region) ?? REGIONS[0];
    }
    let current = REGIONS[0];
    for (const region of REGIONS) {
      if (this.distance >= region.startsAt) current = region;
    }
    return current;
  }

  private getBackgroundCache(region: (typeof REGIONS)[number]): HTMLCanvasElement | undefined {
    const image = this.assets.get(ASSETS.backgrounds[region.background]);
    if (!image) return undefined;

    const key = `${region.id}:${this.width}x${this.height}`;
    if (this.backgroundCache && this.backgroundCacheKey === key) {
      return this.backgroundCache;
    }

    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(this.width);
    canvas.height = Math.ceil(this.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const scale = Math.max(this.width / image.width, this.height / image.height);
    const drawW = image.width * scale;
    const drawH = image.height * scale;
    const x = (this.width - drawW) / 2;
    const y = (this.height - drawH) / 2;
    ctx.drawImage(image, x, y, drawW, drawH);

    this.backgroundCache = canvas;
    this.backgroundCacheKey = key;
    return canvas;
  }

  private drawVines(): void {
    const ctx = this.ctx;
    for (let lane = 0; lane < 5; lane += 1) {
      const x = this.getLaneX(lane as LaneIndex);
      const type = this.vineTypes[lane] ?? "normal";
      const image = this.assets.get(ASSETS.vines[type]);
      const snap = this.getVineSnapOffset(lane as LaneIndex);
      const sway = (type === "wet" ? Math.sin(this.elapsed * 2.4 + lane) * 3 : 0) + snap;
      if (this.sequence?.lanes.includes(lane as LaneIndex)) {
        ctx.save();
        ctx.globalAlpha = 0.12 + Math.sin(this.elapsed * 5 + lane) * 0.04;
        ctx.fillStyle = "#ffd95a";
        roundRect(ctx, x - CONFIG.vineVisualWidth / 2 - 6, 108, CONFIG.vineVisualWidth + 12, this.height - 230, 8);
        ctx.fill();
        ctx.restore();
      }
      if (this.isLaneDangerous(lane as LaneIndex)) {
        ctx.save();
        ctx.globalAlpha = 0.22 + Math.sin(this.elapsed * 12) * 0.08;
        ctx.fillStyle = "#ff7f57";
        roundRect(ctx, x - CONFIG.vineVisualWidth / 2 - 5, 112, CONFIG.vineVisualWidth + 10, this.height - 220, 8);
        ctx.fill();
        ctx.restore();
      }
      if (image) {
        this.drawHybridVine(image, x + sway);
      } else {
        ctx.strokeStyle = type === "gold" ? "#e8ba3c" : "#65a45f";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(x + sway, -40);
        ctx.lineTo(x - sway, this.height + 40);
        ctx.stroke();
      }
    }
  }

  private drawHybridVine(image: HTMLImageElement, centerX: number): void {
    const ctx = this.ctx;
    const sourceWidth = image.naturalWidth || image.width;
    const sourceHeight = image.naturalHeight || image.height;
    const sourceCap = Math.max(1, Math.floor(sourceHeight * CONFIG.vineCapRatio));
    const sourceMiddleHeight = Math.max(1, sourceHeight - sourceCap * 2);
    const drawX = centerX - CONFIG.vineVisualWidth / 2;
    const step = CONFIG.vineSegmentHeight - CONFIG.vineTileOverlap;
    const offset = this.worldOffset % step;

    for (let y = -CONFIG.vineSegmentHeight + offset; y < this.height + CONFIG.vineSegmentHeight; y += step) {
      ctx.drawImage(
        image,
        0,
        sourceCap,
        sourceWidth,
        sourceMiddleHeight,
        drawX,
        y,
        CONFIG.vineVisualWidth,
        CONFIG.vineSegmentHeight
      );
    }
  }

  private drawObjects(): void {
    for (const banana of this.bananas) {
      const image = this.assets.get(ASSETS.bananas[banana.type]);
      this.drawImageOrCircle(image, this.getLaneX(banana.lane), banana.y, banana.width, banana.height, this.getBananaColor(banana.type));
    }

    for (const powerUp of this.powerUps) {
      const image = this.assets.get(ASSETS.powerUps[powerUp.type]);
      this.drawImageOrCircle(image, this.getLaneX(powerUp.lane), powerUp.y, powerUp.width, powerUp.height, "#8fd4ff");
    }

    for (const obstacle of this.obstacles) {
      if ((obstacle.type === "coconut" || obstacle.type === "eagleShadow") && obstacle.y < 110) {
        this.drawWarning(obstacle);
      }
      const image = this.assets.get(ASSETS.obstacles[obstacle.type]);
      const color = this.getObstacleColor(obstacle.type);
      this.drawImageOrCircle(image, this.getLaneX(obstacle.lane), obstacle.y, obstacle.width, obstacle.height, color);
    }
  }

  private getObstacleColor(type: ObstacleType): string {
    if (type === "snake") return "#6fd17c";
    if (type === "thorn") return "#d25353";
    if (type === "beeSwarm") return "#f0c03d";
    if (type === "spiderWeb") return "#e6edf2";
    if (type === "eagleShadow") return "#1f1d23";
    return "#916443";
  }

  private drawWarning(obstacle: Obstacle): void {
    const ctx = this.ctx;
    const x = this.getLaneX(obstacle.lane);
    ctx.save();
    ctx.globalAlpha = 0.58 + Math.sin(this.elapsed * 14) * 0.18;
    ctx.fillStyle = "#ffdf5e";
    ctx.beginPath();
    ctx.ellipse(x, obstacle.warningY ?? 36, 24, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  private drawMonkey(): void {
    const image = this.getMonkeyImage();
    const pose = this.getMonkeyPose();
    const size = CONFIG.monkeyVisualSize;
    this.drawMonkeyTrail(image, size);
    this.drawReachLine(pose);
    this.ctx.save();
    this.ctx.translate(pose.x, pose.y);
    const slippingTilt = this.monkeyState === "slipping" ? Math.sin(this.elapsed * 44) * 0.16 : 0;
    this.ctx.rotate(pose.rotation + slippingTilt);
    this.ctx.scale(pose.scaleX, pose.scaleY);
    if (image) {
      const anchorX = CONFIG.monkeyGripAnchorX;
      const anchorY = CONFIG.monkeyGripAnchorY;
      this.ctx.drawImage(image, -size * anchorX, -size * anchorY, size, size);
    } else {
      this.ctx.fillStyle = "#d88c40";
      this.ctx.beginPath();
      this.ctx.arc(0, 0, size * 0.34, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.restore();
  }

  private getMonkeyImage(): HTMLImageElement | undefined {
    if (this.save.selectedCharacterId === "default" && this.monkeyState === "climbing" && this.mode === "playing") {
      const frameIndex = Math.floor(this.elapsed * 6) % DEFAULT_CLIMB_FRAMES.length;
      return this.assets.get(DEFAULT_CLIMB_FRAMES[frameIndex] ?? DEFAULT_CLIMB_FRAMES[0]);
    }
    return this.assets.get(ASSETS.characters[this.save.selectedCharacterId]);
  }

  private drawMonkeyTrail(image: HTMLImageElement | undefined, size: number): void {
    if (this.monkeyTrail.length === 0) return;
    const ctx = this.ctx;
    for (const trail of this.monkeyTrail) {
      const alpha = Math.max(0, trail.life / trail.maxLife) * 0.22;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(trail.x, trail.y);
      ctx.rotate(trail.rotation);
      ctx.scale(trail.scaleX, trail.scaleY);
      if (image) {
        const anchorX = CONFIG.monkeyGripAnchorX;
        const anchorY = CONFIG.monkeyGripAnchorY;
        ctx.drawImage(image, -size * anchorX, -size * anchorY, size, size);
      } else {
        ctx.fillStyle = "#f4cf59";
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.28, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  private drawReachLine(pose: MonkeyPose): void {
    if (this.monkeyJumpT >= 1) return;
    const ctx = this.ctx;
    const alpha = Math.sin(this.monkeyJumpT * Math.PI) * 0.58;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = "#f5d26d";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(pose.x, pose.y - 12);
    ctx.quadraticCurveTo((pose.x + pose.reachX) / 2, pose.y - 42, pose.reachX, pose.reachY);
    ctx.stroke();
    ctx.restore();
  }

  private drawParticles(): void {
    const ctx = this.ctx;
    for (const particle of this.particles) {
      const alpha = Math.max(0, particle.life / particle.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  private drawHud(): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = "rgba(5, 21, 17, 0.58)";
    roundRect(ctx, 14, 78, 118, 52, 8);
    roundRect(ctx, this.width - 132, 78, 118, 52, 8);
    ctx.fill();
    ctx.fillStyle = "#fff6cb";
    ctx.font = "800 16px Inter, sans-serif";
    ctx.fillText(`${Math.floor(this.score)}`, 26, 102);
    ctx.font = "700 13px Inter, sans-serif";
    ctx.fillStyle = "#bdebc1";
    ctx.fillText(`${Math.floor(this.distance)} m`, 26, 124);
    ctx.textAlign = "right";
    ctx.fillStyle = "#ffe36c";
    ctx.fillText(`Muz ${this.runBananas}`, this.width - 26, 102);
    ctx.fillStyle = "#f6a95b";
    ctx.fillText(`x${this.combo}`, this.width - 26, 124);
    ctx.textAlign = "center";
    if (this.mode === "playing") {
      this.drawMissionHud();
    }
    if (this.achievementTimer > 0) {
      this.drawAchievementToast();
    }
    if (this.messageTimer > 0) {
      const alpha = Math.min(1, this.messageTimer);
      ctx.globalAlpha = alpha;
      ctx.font = "900 24px Inter, sans-serif";
      ctx.fillStyle = "#ffe675";
      ctx.fillText(this.message, this.width / 2, 166);
      ctx.globalAlpha = 1;
    }
    if (this.activePowerUps.length > 0) {
      ctx.textAlign = "left";
      ctx.font = "800 11px Inter, sans-serif";
      let x = 28;
      for (const powerUp of this.activePowerUps) {
        ctx.fillStyle = "rgba(5, 21, 17, 0.62)";
        roundRect(ctx, x - 6, this.height - 82, 82, 34, 8);
        ctx.fill();
        ctx.fillStyle = "#d9f7e2";
        ctx.fillText(this.getPowerUpShortLabel(powerUp.type), x, this.height - 62);
        ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
        roundRect(ctx, x, this.height - 57, 64, 5, 3);
        ctx.fill();
        ctx.fillStyle = "#8fd4ff";
        roundRect(ctx, x, this.height - 57, 64 * Math.min(1, powerUp.timeLeft / 16), 5, 3);
        ctx.fill();
        x += 90;
      }
    }
    this.drawPowerBar();
    if (this.rescuesLeft > 0 && this.distance >= 70) {
      ctx.textAlign = "right";
      ctx.font = "800 12px Inter, sans-serif";
      ctx.fillStyle = "#ffe675";
      ctx.fillText("Son Tutunus hazir", this.width - 24, 154);
    }
    if (this.regionMessageTimer > 0) {
      ctx.textAlign = "center";
      ctx.font = "900 18px Inter, sans-serif";
      ctx.fillStyle = this.getCurrentRegion().accent;
      ctx.fillText(this.getCurrentRegion().name, this.width / 2, 198);
    }
    ctx.restore();
  }

  private drawMissionHud(): void {
    const mission = this.getCurrentCampaignMission();
    const progress = this.getCampaignProgress(mission);
    const ctx = this.ctx;
    const width = Math.min(this.width - 28, 340);
    const x = (this.width - width) / 2;
    const y = 12;
    ctx.save();
    ctx.fillStyle = "rgba(5, 21, 17, 0.78)";
    roundRect(ctx, x, y, width, 58, 8);
    ctx.fill();
    ctx.fillStyle = this.getCurrentRegion().accent;
    ctx.font = "900 12px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`GOREV ${this.campaignMissionIndex + 1}/${CAMPAIGN_MISSIONS.length} - ${mission.title}`, this.width / 2, y + 18);
    ctx.fillStyle = "#fff6cb";
    ctx.font = "800 11px Inter, sans-serif";
    ctx.fillText(`${mission.text}   ${progress.text}`, this.width / 2, y + 36);
    ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
    roundRect(ctx, x + 14, y + 44, width - 28, 7, 3);
    ctx.fill();
    ctx.fillStyle = this.getCurrentRegion().accent;
    roundRect(ctx, x + 14, y + 44, (width - 28) * progress.ratio, 7, 3);
    ctx.fill();
    ctx.restore();
  }

  private drawAchievementToast(): void {
    const ctx = this.ctx;
    const alpha = Math.min(1, this.achievementTimer / 0.35);
    const width = Math.min(this.width - 42, 310);
    const x = (this.width - width) / 2;
    const y = 138;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgba(14, 43, 31, 0.9)";
    roundRect(ctx, x, y, width, 62, 8);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 230, 117, 0.72)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffe675";
    ctx.font = "900 17px Inter, sans-serif";
    ctx.fillText(this.achievementTitle, this.width / 2, y + 25);
    ctx.fillStyle = "#e9f9d4";
    ctx.font = "800 12px Inter, sans-serif";
    ctx.fillText(this.achievementText, this.width / 2, y + 45);
    ctx.restore();
  }

  private drawPowerBar(): void {
    const ctx = this.ctx;
    const barWidth = 118;
    const x = this.width - barWidth - 24;
    const y = this.height - 76;
    const ratio = this.powerBar / CONFIG.powerBarCapacity;
    ctx.save();
    ctx.fillStyle = "rgba(5, 21, 17, 0.64)";
    roundRect(ctx, x - 8, y - 20, barWidth + 16, 44, 8);
    ctx.fill();
    ctx.textAlign = "left";
    ctx.font = "900 11px Inter, sans-serif";
    ctx.fillStyle = ratio >= 1 ? "#ffe675" : "#d9f7e2";
    ctx.fillText("GUC", x, y - 5);
    ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
    roundRect(ctx, x, y + 2, barWidth, 10, 5);
    ctx.fill();
    ctx.fillStyle = ratio >= 1 ? "#ffe675" : "#5ed7ff";
    roundRect(ctx, x, y + 2, barWidth * ratio, 10, 5);
    ctx.fill();
    ctx.restore();
  }

  private drawMenu(): void {
    const ctx = this.ctx;
    const selected = CHARACTERS.find((character) => character.id === this.save.selectedCharacterId) ?? CHARACTERS[0];
    const selectedImage = this.assets.get(ASSETS.characters[selected.id]);
    ctx.save();
    const canopy = ctx.createLinearGradient(0, 0, 0, this.height);
    canopy.addColorStop(0, "rgba(2, 28, 17, 0.2)");
    canopy.addColorStop(0.58, "rgba(4, 36, 24, 0.48)");
    canopy.addColorStop(1, "rgba(1, 12, 9, 0.82)");
    ctx.fillStyle = canopy;
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.globalAlpha = 0.36;
    for (let i = 0; i < 9; i += 1) {
      const x = (i * 71 + Math.sin(this.elapsed + i) * 18) % (this.width + 80) - 40;
      const y = 22 + (i % 4) * 38;
      ctx.fillStyle = i % 2 === 0 ? "#2f8c52" : "#176d44";
      ctx.beginPath();
      ctx.ellipse(x, y, 54, 18, -0.35 + i * 0.08, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    ctx.fillStyle = "rgba(5, 21, 17, 0.58)";
    roundRect(ctx, 18, 18, 126, 42, 8);
    roundRect(ctx, this.width - 88, 18, 70, 42, 8);
    ctx.fill();
    ctx.textAlign = "left";
    ctx.fillStyle = "#ffe36c";
    ctx.font = "900 13px Inter, sans-serif";
    ctx.fillText(`Muz ${this.save.totalBananas}`, 30, 44);
    ctx.textAlign = "center";
    ctx.fillStyle = "#d9f7e2";
    ctx.font = "900 12px Inter, sans-serif";
    ctx.fillText("Ayar", this.width - 53, 44);

    ctx.textAlign = "center";
    ctx.fillStyle = "#fff4ba";
    ctx.font = "900 42px Inter, sans-serif";
    ctx.fillText("Maymun Rush", this.width / 2, this.height * 0.16);
    ctx.font = "800 14px Inter, sans-serif";
    ctx.fillStyle = "#d9f7d3";
    ctx.fillText(`Ilk hedef: ${CAMPAIGN_MISSIONS[0].text}`, this.width / 2, this.height * 0.2);

    ctx.fillStyle = "rgba(5, 21, 17, 0.54)";
    roundRect(ctx, this.width / 2 - 86, this.height * 0.23, 172, 142, 8);
    ctx.fill();
    if (selectedImage) ctx.drawImage(selectedImage, this.width / 2 - 50, this.height * 0.24, 100, 100);
    ctx.fillStyle = "#ffe675";
    ctx.font = "900 18px Inter, sans-serif";
    ctx.fillText(selected.name, this.width / 2, this.height * 0.23 + 120);
    ctx.fillStyle = "#bdebc1";
    ctx.font = "800 12px Inter, sans-serif";
    ctx.fillText(selected.perk, this.width / 2, this.height * 0.23 + 137);

    const selectorTop = this.height * 0.42;
    const cardGap = 6;
    const cardWidth = (this.width - 32 - cardGap * 4) / 5;
    for (let i = 0; i < CHARACTERS.length; i += 1) {
      const character = CHARACTERS[i];
      const x = 16 + i * (cardWidth + cardGap);
      const unlocked = this.save.unlockedCharacterIds.includes(character.id);
      const ready = this.isCharacterUnlockMet(character.unlock);
      const isSelected = character.id === this.save.selectedCharacterId;
      ctx.fillStyle = isSelected ? "rgba(232, 178, 50, 0.42)" : "rgba(5, 21, 17, 0.7)";
      roundRect(ctx, x, selectorTop, cardWidth, 102, 8);
      ctx.fill();
      ctx.strokeStyle = isSelected ? "#ffe675" : unlocked ? "rgba(157, 240, 111, 0.5)" : "rgba(255, 255, 255, 0.16)";
      ctx.lineWidth = isSelected ? 2 : 1;
      ctx.stroke();
      const image = this.assets.get(ASSETS.characters[character.id]);
      if (image) ctx.drawImage(image, x + cardWidth / 2 - 25, selectorTop + 8, 50, 50);
      ctx.fillStyle = unlocked ? "#fff6cb" : ready ? "#ffe675" : "#9aac9f";
      ctx.font = "900 10px Inter, sans-serif";
      ctx.fillText(character.name, x + cardWidth / 2, selectorTop + 74);
      ctx.fillStyle = isSelected ? "#ffe675" : unlocked ? "#9df06f" : ready ? "#ffe675" : "#ff9a7c";
      ctx.font = "800 9px Inter, sans-serif";
      ctx.fillText(isSelected ? "Secili" : unlocked ? "Sec" : ready ? "Ac" : "Kilitli", x + cardWidth / 2, selectorTop + 91);
    }

    if (this.messageTimer > 0) {
      ctx.fillStyle = "#ffe675";
      ctx.font = "900 18px Inter, sans-serif";
      ctx.fillText(this.message, this.width / 2, selectorTop + 132);
    }

    this.drawPanelButton("Tirmanisa Basla", this.height * 0.78);
    ctx.fillStyle = "#d9f7e2";
    ctx.font = "800 13px Inter, sans-serif";
    ctx.fillText(`En iyi skor ${this.save.highScore}   En uzak ${this.save.maxDistance}m`, this.width / 2, this.height * 0.86);
    ctx.fillStyle = "#9df06f";
    ctx.fillText("Karakter kartina dokun, sonra basla", this.width / 2, this.height * 0.9);
    ctx.restore();
  }

  private drawCharacters(): void {
    this.drawOverlay();
    const ctx = this.ctx;
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff4ba";
    ctx.font = "900 34px Inter, sans-serif";
    ctx.fillText("Karakterler", this.width / 2, 72);
    ctx.font = "800 13px Inter, sans-serif";
    ctx.fillStyle = "#d9f7d3";
    ctx.fillText("Sarmasiga dokun: sec veya ac", this.width / 2, 98);

    const top = 134;
    const cardHeight = 74;
    const gap = 10;
    for (let i = 0; i < CHARACTERS.length; i += 1) {
      const character = CHARACTERS[i];
      const y = top + i * (cardHeight + gap);
      const unlocked = this.save.unlockedCharacterIds.includes(character.id);
      const selected = this.save.selectedCharacterId === character.id;
      const ready = this.isCharacterUnlockMet(character.unlock);
      ctx.fillStyle = selected ? "rgba(232, 178, 50, 0.34)" : "rgba(5, 21, 17, 0.72)";
      roundRect(ctx, 22, y, this.width - 44, cardHeight, 8);
      ctx.fill();
      ctx.strokeStyle = selected ? "#ffe675" : unlocked ? "rgba(157, 240, 111, 0.55)" : "rgba(255, 255, 255, 0.12)";
      ctx.lineWidth = selected ? 2 : 1;
      ctx.stroke();

      const image = this.assets.get(ASSETS.characters[character.id]);
      if (image) ctx.drawImage(image, 34, y + 7, 58, 58);
      ctx.textAlign = "left";
      ctx.fillStyle = unlocked ? "#fff6cb" : ready ? "#ffe675" : "#8ea99a";
      ctx.font = "900 15px Inter, sans-serif";
      ctx.fillText(character.name, 104, y + 25);
      ctx.fillStyle = "#bdebc1";
      ctx.font = "700 11px Inter, sans-serif";
      ctx.fillText(character.perk, 104, y + 43);
      ctx.fillStyle = unlocked ? "#9df06f" : ready ? "#ffe675" : "#ff9a7c";
      ctx.font = "800 11px Inter, sans-serif";
      const status = selected ? "Secili" : unlocked ? "Sec" : ready ? "Ac" : this.getCharacterRequirementText(character.unlock);
      ctx.fillText(status, 104, y + 61);
      ctx.textAlign = "right";
      ctx.fillStyle = "#d9f7e2";
      ctx.font = "900 14px Inter, sans-serif";
      ctx.fillText(String(i + 1), this.width - 38, y + 43);
    }

    ctx.textAlign = "center";
    ctx.fillStyle = "#c8ead1";
    ctx.font = "800 13px Inter, sans-serif";
    ctx.fillText("Sag kenar geri", this.width / 2, this.height - 80);
    if (this.messageTimer > 0) {
      ctx.fillStyle = "#ffe675";
      ctx.font = "900 20px Inter, sans-serif";
      ctx.fillText(this.message, this.width / 2, this.height - 116);
    }
  }

  private drawSettings(): void {
    this.drawOverlay();
    const ctx = this.ctx;
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff4ba";
    ctx.font = "900 34px Inter, sans-serif";
    ctx.fillText("Ayarlar", this.width / 2, 96);
    this.drawListScreen(
      [
        `Ses Efekti - ${this.save.settings.sfxVolume > 0 ? "acik" : "kapali"}`,
        `Titresim - ${this.save.settings.vibration ? "acik" : "kapali"}`,
        `Grafik - ${this.save.settings.quality}`
      ],
      "Sarmasiklara dokun   sag kenar geri"
    );
  }

  private drawListScreen(lines: string[], footer: string): void {
    const ctx = this.ctx;
    ctx.textAlign = "left";
    ctx.font = "800 14px Inter, sans-serif";
    let y = 176;
    for (const line of lines) {
      ctx.fillStyle = "rgba(5, 21, 17, 0.68)";
      roundRect(ctx, 24, y - 25, this.width - 48, 42, 8);
      ctx.fill();
      ctx.fillStyle = "#e9f9d4";
      ctx.fillText(line, 38, y);
      y += 54;
    }
    ctx.textAlign = "center";
    ctx.fillStyle = "#c8ead1";
    ctx.font = "800 14px Inter, sans-serif";
    ctx.fillText(footer, this.width / 2, this.height - 98);
    if (this.messageTimer > 0) {
      ctx.fillStyle = "#ffe675";
      ctx.font = "900 22px Inter, sans-serif";
      ctx.fillText(this.message, this.width / 2, this.height - 140);
    }
  }

  private drawPause(): void {
    this.drawOverlay();
    const ctx = this.ctx;
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff4ba";
    ctx.font = "900 34px Inter, sans-serif";
    ctx.fillText("Duraklatildi", this.width / 2, this.height * 0.38);
    this.drawPanelButton("Devam", this.height * 0.47);
  }

  private drawGameOver(): void {
    this.drawOverlay();
    const ctx = this.ctx;
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff4ba";
    ctx.font = "900 34px Inter, sans-serif";
    ctx.fillText(this.campaignSuccess ? "Tebrikler!" : "Dustun!", this.width / 2, this.height * 0.24);
    ctx.font = "800 17px Inter, sans-serif";
    ctx.fillStyle = "#ffcf7b";
    ctx.fillText(this.deathReason, this.width / 2, this.height * 0.29);
    if (this.campaignSuccess) {
      ctx.fillStyle = "#9df06f";
      ctx.font = "900 23px Inter, sans-serif";
      ctx.fillText("TUM GOREVLER TAMAMLANDI", this.width / 2, this.height * 0.34);
    } else if (this.newRecord) {
      ctx.fillStyle = "#ffe675";
      ctx.font = "900 24px Inter, sans-serif";
      ctx.fillText("YENI REKOR!", this.width / 2, this.height * 0.34);
    }
    ctx.fillStyle = "#e9f9d4";
    ctx.font = "800 20px Inter, sans-serif";
    ctx.fillText(`Skor ${Math.floor(this.score)}`, this.width / 2, this.height * 0.39);
    ctx.font = "700 15px Inter, sans-serif";
    ctx.fillText(`Mesafe ${Math.floor(this.distance)} m`, this.width / 2, this.height * 0.44);
    ctx.fillText(`Muz ${this.runBananas}   Perfect ${this.perfects}   x${this.bestCombo}`, this.width / 2, this.height * 0.48);
    ctx.fillStyle = "#ffe283";
    ctx.fillText(`Rekor ${this.save.highScore}`, this.width / 2, this.height * 0.53);
    if (this.rewardMessage) {
      ctx.fillStyle = "#9df06f";
      ctx.fillText(this.rewardMessage, this.width / 2, this.height * 0.57);
    }
    ctx.fillStyle = "#c8ead1";
    ctx.fillText("Herhangi bir tusa bas", this.width / 2, this.height * 0.62);
    this.drawPanelButton("Tekrar Oyna", this.height * 0.66);
  }

  private drawOverlay(): void {
    const ctx = this.ctx;
    ctx.fillStyle = "rgba(5, 15, 12, 0.68)";
    ctx.fillRect(0, 0, this.width, this.height);
  }

  private drawPanelButton(label: string, centerY: number): void {
    const ctx = this.ctx;
    const x = this.width / 2 - 92;
    const y = centerY - 26;
    const w = 184;
    const h = 52;
    ctx.fillStyle = "#e4a83f";
    roundRect(ctx, x, y, w, h, 8);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#1b271d";
    ctx.font = "900 19px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(label, this.width / 2, centerY + 7);
  }

  private drawImageOrCircle(image: HTMLImageElement | undefined, x: number, y: number, width: number, height: number, color: string): void {
    if (image) {
      this.ctx.drawImage(image, x - width / 2, y - height / 2, width, height);
      return;
    }
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, Math.max(width, height) / 2, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private getSpeed(): number {
    return CONFIG.baseSpeed + Math.min(CONFIG.maxSpeedBonus, this.elapsed * CONFIG.speedGrowth);
  }

  private getLaneX(lane: LaneIndex): number {
    const padding = this.width * 0.1;
    const usable = this.width - padding * 2;
    return padding + (usable / 4) * lane;
  }

  private getMonkeyY(): number {
    return this.height * CONFIG.monkeyYRatio;
  }

  private getMonkeyX(): number {
    return this.getMonkeyPose().x;
  }

  private getMonkeyPose(): MonkeyPose {
    const baseY = this.getMonkeyY();
    if (this.monkeyJumpT >= 1) {
      return {
        x: this.getLaneX(this.monkeyLane),
        y: baseY + Math.sin(this.elapsed * 9) * 2,
        rotation: Math.sin(this.elapsed * 4.5) * 0.025,
        scaleX: 1,
        scaleY: 1,
        reachX: this.getLaneX(this.monkeyLane),
        reachY: baseY - 28
      };
    }

    const t = this.monkeyJumpT;
    const eased = easeInOutCubic(t);
    const start = this.getLaneX(this.monkeyFromLane);
    const end = this.getLaneX(this.monkeyTargetLane);
    const direction = Math.sign(this.monkeyTargetLane - this.monkeyFromLane);
    const laneDistance = Math.abs(this.monkeyTargetLane - this.monkeyFromLane);
    const anticipation = t < 0.16 ? (1 - t / 0.16) * 9 : 0;
    const landing = t > 0.86 ? ((t - 0.86) / 0.14) * 7 : 0;
    const arc = Math.sin(t * Math.PI) * (44 + laneDistance * 8);
    const stretch = Math.sin(t * Math.PI);
    const squashStart = t < 0.18 ? (1 - t / 0.18) * 0.14 : 0;
    const squashLand = t > 0.82 ? ((t - 0.82) / 0.18) * 0.18 : 0;
    const x = start + (end - start) * eased;
    return {
      x,
      y: baseY - arc + anticipation + landing,
      rotation: direction * (0.42 * Math.sin(t * Math.PI) + 0.12 * t),
      scaleX: 1 + squashStart + squashLand - stretch * 0.06,
      scaleY: 1 - squashStart - squashLand + stretch * 0.12,
      reachX: end,
      reachY: baseY - 32 + Math.sin(t * Math.PI) * 8
    };
  }

  private getVineSnapOffset(lane: LaneIndex): number {
    if (this.vineSnapLane !== lane || this.vineSnapTimer <= 0) return 0;
    const life = this.vineSnapTimer / 0.26;
    const direction = lane === this.monkeyTargetLane ? Math.sign(this.monkeyTargetLane - this.monkeyFromLane || 1) : -Math.sign(this.monkeyTargetLane - this.monkeyFromLane || 1);
    return Math.sin(life * Math.PI * 3) * life * 7 * direction;
  }

  private getMonkeyHitbox(): Hitbox {
    const w = CONFIG.monkeySize * 0.5;
    const h = CONFIG.monkeySize * 0.58;
    return {
      x: this.getMonkeyX() - w / 2,
      y: this.getMonkeyY() - h / 2,
      width: w,
      height: h
    };
  }

  private getThingHitbox(thing: FallingThing, scale: number): Hitbox {
    const width = thing.width * scale;
    const height = thing.height * scale;
    return {
      x: this.getLaneX(thing.lane) - width / 2,
      y: thing.y - height / 2,
      width,
      height
    };
  }
}

function intersects(a: Hitbox, b: Hitbox): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number): void {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

const canvas = document.querySelector<HTMLCanvasElement>("#game");
if (!canvas) throw new Error("Canvas bulunamadi.");

const game = new Game(canvas);
void game.start();
