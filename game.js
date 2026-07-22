const TILE = 64;
const TOWER_BODY = 44;
const RANGE_SCALE = TILE / 70;
const COLS = 11;
const ROWS = 6;
const PLAY_W = COLS * TILE;
const PLAY_H = ROWS * TILE;
const UI_H = 156;
const WIDTH = PLAY_W;
const HEIGHT = PLAY_H + UI_H;

const colX = c => c * TILE + TILE / 2;
const rowY = r => r * TILE + TILE / 2;

const WAVES_PER_LEVEL = 5;
const WRECKER_ATTACK_RANGE = 100 * RANGE_SCALE;
const SELL_REFUND_RATIO = 0.6;
const REACTION_COOLDOWN_MS = 1000;
const FREEZE_COOLDOWN_MS = 3000;
const POST_LEVEL_PAUSE_MS = 20000;
const SHIELD_DAMAGE_REDUCTION = 0.15;
const TOWER_MAX_LEVEL = 20;
const DRAG_THRESHOLD = 10;
const HUD_H = 60;
const MAX_TOWERS = 10;
const TOWER_TYPE_COOLDOWN_MS = 10000;

const ZONE_PATH_MAX = TILE * 0.5;
const ZONE_BORDER_MAX = TILE * 1.45;
const ZONE_GRASS_MAX = TILE * 3.15;
const TIER_PATH = 0, TIER_BORDER = 1, TIER_GRASS = 2, TIER_FOREST = 3;

const PALETTE = {
  sceneBg: 0xf3edfb,
  tileBorder: 0xffd2e6,
  tileGrass: 0xd7f0ca,
  tileForest: 0x9fce8f,
  tilePath: 0xe4c99a,
  pathFill: 0xd6c0ea,
  pathStroke: 0x9c7ecf,
  hudBg: 0xffffff,
  hudBgTop: 0xfffaf5,
  panelBg: 0xffffff,
  panelBgTop: 0xfff9f2,
  panelStroke: 0xd9c8ef,
  panelStrokeSelected: 0xff9f4d,
  textDark: '#4a3a5c',
  textMuted: '#8a76a8',
  textAccent: '#c97b2e',
  accentA: 0xb98be0,
  accentB: 0x7ea8f5,
  gold: 0x8f6bd6,
};

const ELEMENT_COLORS = { hydro: 0x6fb8f5, cryo: 0xa8e0f5, pyro: 0xff9f6b, electro: 0xc2a3f0 };
const ELEMENT_ICON = { hydro: '💧', cryo: '❄️', pyro: '🔥', electro: '⚡' };

const ASSET_MANIFEST = {
  tiles: { border: 'assets/textures/border.png', grass: 'assets/textures/grass.png', forest: 'assets/textures/forest.png', trail: 'assets/textures/trail.png' },
  masks: {
    edge_top: 'assets/textures/masks/edge_top.png', edge_right: 'assets/textures/masks/edge_right.png',
    edge_bottom: 'assets/textures/masks/edge_bottom.png', edge_left: 'assets/textures/masks/edge_left.png',
    corner_tl: 'assets/textures/masks/corner_tl.png', corner_tr: 'assets/textures/masks/corner_tr.png',
    corner_bl: 'assets/textures/masks/corner_bl.png', corner_br: 'assets/textures/masks/corner_br.png',
  },
  characters: { blade: 'assets/characters/blade.png', cryo: 'assets/characters/cryo.png', bomber: 'assets/characters/bomber.png', hydro: 'assets/characters/hydro.png', electro: 'assets/characters/electro.png' },
  mobs: { grunt: 'assets/mobs/grunt.png', runner: 'assets/mobs/runner.png', shielded: 'assets/mobs/shielded.png', wrecker: 'assets/mobs/wrecker.png' },
};

const ICON_MANIFEST = {
  elements: { hydro: 'assets/icons/elements/hydroicon.png', cryo: 'assets/icons/elements/cryoicon.png', pyro: 'assets/icons/elements/pyroicon.png', electro: 'assets/icons/elements/electroicon.png' },
  themes: { swift: 'assets/icons/themes/swift.png', armored: 'assets/icons/themes/armored.png', standard: 'assets/icons/themes/standart.png', swarm: 'assets/icons/themes/swarm.png', melt: 'assets/icons/themes/exotic.png', steam: 'assets/icons/themes/exotic.png' },
  perks: { goldrush: 'assets/icons/perks/goldrush.png', sharp: 'assets/icons/perks/sharp.png', haste: 'assets/icons/perks/haste.png', walls: 'assets/icons/perks/walls.png', discount: 'assets/icons/perks/discount.png', swarm: 'assets/icons/perks/swarm.png' },
  ui: { sell: 'assets/icons/ui/sell.png' },
};

const TOWER_TYPES = {
  blade:   { key:'blade',   name:'Клинок-тян',  cost:50,  range:140 * RANGE_SCALE, fireRate:650,  damage:11, color:0xff8fae, proj:0xffd6e2, splash:0,  element:null },
  cryo:    { key:'cryo',    name:'Крио-тян',    cost:70,  range:120 * RANGE_SCALE, fireRate:1050, damage:6,  color:0x8fd6ef, proj:0xd8f4ff, splash:0,  element:'cryo' },
  bomber:  { key:'bomber',  name:'Бомбер-тян',  cost:100, range:190 * RANGE_SCALE, fireRate:1700, damage:16, color:0xffb877, proj:0xffe3c2, splash:70 * RANGE_SCALE, element:'pyro' },
  hydro:   { key:'hydro',   name:'Гидро-тян',   cost:60,  range:150 * RANGE_SCALE, fireRate:900,  damage:9,  color:0x7ec8ff, proj:0xd2ecff, splash:0,  element:'hydro' },
  electro: { key:'electro', name:'Электро-тян', cost:90,  range:170 * RANGE_SCALE, fireRate:950,  damage:10, color:0xc9aaf5, proj:0xe8dbff, splash:0,  element:'electro' },
};

const TOWER_MAX_HP = 150;

const ENEMY_TYPES = {
  grunt:    { name:'Марионетка', hpMult:1,    speedMult:1,    reward:1,   livesCost:1, color:0xa87fd9, ring:0xd9c2f0, radius:13 },
  runner:   { name:'Рывок',      hpMult:0.5,  speedMult:1.7,  reward:0.8, livesCost:1, color:0xe86fa0, ring:0xffc2dc, radius:10 },
  shielded: { name:'Щитовик',    hpMult:0.5,  speedMult:0.7,  reward:1.6, livesCost:2, color:0x7a5fb8, ring:0xb8a8dc, radius:17, hasShield:true },
  wrecker:  { name:'Крушитель',  hpMult:1.3,  speedMult:0.8,  reward:1.7, livesCost:1, color:0xe85f52, ring:0xffb0a8, radius:14, attacksTowers:true, attackDamage:10, attackRate:900 },
};

const TOWER_MILESTONES = {
  blade: [
    { lvl:5,  name:'Боевой инстинкт',   desc:'+8% урона всем тян',            apply:s=>{ s.mult.damage *= 1.08; } },
    { lvl:10, name:'Быстрые руки',      desc:'+8% скорострельности всем тян', apply:s=>{ s.mult.fireRate *= 1.08; } },
    { lvl:15, name:'Смертельная точность', desc:'+10% урона всем тян',        apply:s=>{ s.mult.damage *= 1.10; } },
    { lvl:20, name:'Клинок судьбы',     desc:'+15% скорострельности всем тян', apply:s=>{ s.mult.fireRate *= 1.15; } },
  ],
  cryo: [
    { lvl:5,  name:'Ледяное дыхание', desc:'КД заморозки -20%',                    apply:s=>{ s.mult.freezeCooldown *= 0.8; } },
    { lvl:10, name:'Вечная мерзлота', desc:'Стихийные статусы держатся +25% дольше', apply:s=>{ s.mult.statusDuration *= 1.25; } },
    { lvl:15, name:'Ледяной шторм',   desc:'Радиус взрывных реакций +20%',          apply:s=>{ s.mult.reactionRadius *= 1.2; } },
    { lvl:20, name:'Абсолютный ноль', desc:'КД заморозки ещё -20%',                 apply:s=>{ s.mult.freezeCooldown *= 0.8; } },
  ],
  bomber: [
    { lvl:5,  name:'Больше пороха',    desc:'Радиус сплэша всех бомберов +20%', apply:s=>{ s.mult.splash *= 1.2; } },
    { lvl:10, name:'Термитная смесь',  desc:'Урон реакций +15%',                apply:s=>{ s.mult.reactionDamage *= 1.15; } },
    { lvl:15, name:'Цепная реакция',   desc:'Радиус взрывных реакций +20%',     apply:s=>{ s.mult.reactionRadius *= 1.2; } },
    { lvl:20, name:'Огненный шторм',   desc:'Урон реакций ещё +20%',            apply:s=>{ s.mult.reactionDamage *= 1.2; } },
  ],
  hydro: [
    { lvl:5,  name:'Течение',          desc:'КД реакций -15%',                       apply:s=>{ s.mult.reactionCooldown *= 0.85; } },
    { lvl:10, name:'Насыщенная влага', desc:'Стихийные статусы держатся +25% дольше', apply:s=>{ s.mult.statusDuration *= 1.25; } },
    { lvl:15, name:'Золотой поток',    desc:'+10% золота',                           apply:s=>{ s.mult.gold *= 1.1; } },
    { lvl:20, name:'Прилив',           desc:'КД реакций ещё -15%',                    apply:s=>{ s.mult.reactionCooldown *= 0.85; } },
  ],
  electro: [
    { lvl:5,  name:'Разряд',            desc:'+8% скорострельности всем тян', apply:s=>{ s.mult.fireRate *= 1.08; } },
    { lvl:10, name:'Высокое напряжение', desc:'Урон реакций +15%',               apply:s=>{ s.mult.reactionDamage *= 1.15; } },
    { lvl:15, name:'Электросеть',       desc:'Радиус взрывных реакций +20%',     apply:s=>{ s.mult.reactionRadius *= 1.2; } },
    { lvl:20, name:'Шторм молний',      desc:'+15% дальности всем тян',       apply:s=>{ s.mult.range *= 1.15; } },
  ],
};

const IS_MOBILE = typeof window !== 'undefined' && (window.innerWidth < 820 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent || ''));

const UI_LAYOUT = (() => {
  const marginX = IS_MOBILE ? 6 : 16;
  const gap = IS_MOBILE ? 6 : 10;
  const slots = 6;
  
  // На мобильных волна кнопка занимает отдельную строку, на десктопе - в ряду
  const useCompactLayout = IS_MOBILE;
  
  let cardW, cardH, cardStartX, cardY, sellBtnX, waveBtnX, waveBtnW, waveBtnH, waveBtnY;
  
  if (useCompactLayout) {
    // Компактный мобильный layout: карточки в одну линию, волна кнопка отдельно
    cardW = Math.round((PLAY_W - marginX * 2 - gap * 7) / 6);
    cardH = 100;
    cardStartX = marginX;
    cardY = PLAY_H + 10;
    sellBtnX = cardStartX + 5 * (cardW + gap);
    // Волна кнопка - отдельная строка справа
    waveBtnW = PLAY_W - sellBtnX - cardW - marginX;
    waveBtnX = sellBtnX + cardW + gap;
    waveBtnH = cardH;
    waveBtnY = cardY;
  } else {
    // Десктопный layout: всё в одном ряду (уменьшенная кнопка волны для освобождения места)
    waveBtnW = 160;
    cardW = Math.round((PLAY_W - marginX * 2 - waveBtnW - gap * slots) / slots);
    cardH = 116;
    cardStartX = marginX;
    cardY = PLAY_H + 16;
    sellBtnX = cardStartX + 5 * (cardW + gap);
    waveBtnX = sellBtnX + cardW + gap;
    waveBtnH = 76;
    waveBtnY = PLAY_H + UI_H / 2 + 10;
  }
  
  return {
    cardW, cardH, cardGap: gap, cardStartX, cardY,
    sellBtnX, sellBtnW: cardW, sellBtnH: cardH, sellBtnY: cardY,
    waveBtnX, waveBtnW, waveBtnH, waveBtnY,
    useCompactLayout,
  };
})();

const UI_SCALE = IS_MOBILE ? 1.35 : 1.15;

const PERKS = [
  { id:'goldrush',  name:'Золотая жила',    desc:'+40% золота за волны и убийства',            icon:'💰', apply:s=>{ s.mult.gold *= 1.4; } },
  { id:'sharp',     name:'Заточка клинков', desc:'+20% урона всех тян',                        icon:'⚔️', apply:s=>{ s.mult.damage *= 1.2; } },
  { id:'haste',     name:'Прилив сил',      desc:'+20% скорострельности тян',                  icon:'💨', apply:s=>{ s.mult.fireRate *= 1.2; } },
  { id:'walls',     name:'Крепкие стены',   desc:'+60 HP всем новым тян',                     icon:'🛡️', apply:s=>{ s.mult.towerHpBonus += 60; } },
  { id:'discount',  name:'Скидка мастера',  desc:'Тян дешевле на 15%',                         icon:'🏷️', apply:s=>{ s.mult.cost *= 0.85; s.refreshCostLabels(); } },
  { id:'swarm',     name:'Рой вместо силы', desc:'Врагов +30% числом, но у них -25% HP',         icon:'🐝', apply:s=>{ s.mult.enemyCount *= 1.3; s.mult.enemyHp *= 0.75; } },
];

const THEMES = [
  { id:'swift',    name:'Скоростной натиск',    desc:'Волна почти целиком состоит из быстрых Рывков.', icon:'❄️', reactionName:'Заморозка',            reactionKeys:['cryo_hydro'],              buffMult:1.6, enemyBias:{ runner:4, grunt:1 } },
  { id:'armored',  name:'Бронированный рубеж',  desc:'Много Щитовиков с защитным барьером.',            icon:'💥', reactionName:'Перегрузка',            reactionKeys:['electro_pyro'],            buffMult:1.6, enemyBias:{ shielded:4, grunt:1 } },
  { id:'standard', name:'Обычный натиск',       desc:'Стандартная пехота эфириалов.',                   icon:'🔗', reactionName:'Сверхпроводник',        reactionKeys:['cryo_electro'],            buffMult:1.7, enemyBias:{ grunt:5 } },
  { id:'swarm',    name:'Рой мелочи',           desc:'Огромное число слабых, но многочисленных мобов.', icon:'⚡', reactionName:'Наэлектризованность',   reactionKeys:['electro_hydro'],           buffMult:1.8, enemyBias:{ grunt:5, runner:2 }, countMult:1.4, hpMultLevel:0.7 },
  { id:'melt',     name:'Ледяной пожар',        desc:'Огонь и лёд сталкиваются — эфириалы то леденеют, то тают.', icon:'🧊', reactionName:'Таяние', reactionKeys:['cryo_pyro'],  buffMult:1.7, enemyBias:{ shielded:3, grunt:3 } },
  { id:'steam',    name:'Паровой прорыв',       desc:'Влажная волна легко превращается в обжигающий пар.',      icon:'💨', reactionName:'Пар',    reactionKeys:['hydro_pyro'], buffMult:1.7, enemyBias:{ wrecker:2, runner:2, grunt:2 } },
];

function generatePath() {
  const path = [];
  let col = 0;
  let row = Phaser.Math.Between(2, ROWS - 3);
  path.push({ x: -40, y: rowY(row) });
  path.push({ x: colX(col), y: rowY(row) });
  while (col < COLS - 1) {
    const runLen = Phaser.Math.Between(2, 4);
    col = Math.min(COLS - 1, col + runLen);
    path.push({ x: colX(col), y: rowY(row) });
    if (col >= COLS - 1) break;
    const dir = Phaser.Math.Between(0, 1) === 0 ? -1 : 1;
    const newRow = Phaser.Math.Clamp(row + dir * Phaser.Math.Between(1, 3), 1, ROWS - 2);
    if (newRow !== row) { row = newRow; path.push({ x: colX(col), y: rowY(row) }); }
  }
  path.push({ x: PLAY_W + 40, y: rowY(row) });
  return path;
}

function isTransitionWave(waveNum) { return waveNum > 1 && (waveNum - 1) % WAVES_PER_LEVEL === 0; }

function pointSegDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const len2 = dx * dx + dy * dy || 1;
  let t = ((px - ax) * dx + (py - ay) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  const cx = ax + t * dx, cy = ay + t * dy;
  return Math.hypot(px - cx, py - cy);
}

function themeAffectedElements(theme) {
  const set = new Set();
  theme.reactionKeys.forEach(key => key.split('_').forEach(el => set.add(el)));
  return [...set];
}

class TDScene extends Phaser.Scene {
  preload() {
    this.missingKeys = new Set();
    this.load.on('loaderror', file => this.missingKeys.add(file.key));
    Object.entries(ASSET_MANIFEST).forEach(([group, entries]) => Object.entries(entries).forEach(([name, path]) => this.load.image(group + '_' + name, path)));
    Object.entries(ICON_MANIFEST).forEach(([group, entries]) => Object.entries(entries).forEach(([name, path]) => this.load.image('icon_' + group + '_' + name, path)));
    
    // Отключаем сглаживание для всех текстур при загрузке
    this.textures.on('add', (texture) => {
      if (texture && texture.baseTexture) {
        texture.baseTexture.setFilter(Phaser.Textures.FilterMode.NEAREST);
      }
    });
  }

  create() {
    this.buildPlaceholderTextures();

    ['characters', 'mobs'].forEach(group => {
      Object.keys(ASSET_MANIFEST[group]).forEach(name => {
        const key = group + '_' + name;
        if (this.textures.exists(key)) this.textures.get(key).setFilter(Phaser.Textures.FilterMode.NEAREST);
      });
    });

    this.gold = 150;
    this.lives = 15;
    this.wave = 0;
    this.level = 1;
    this.currentTheme = null;
    this.waveInProgress = false;
    this.spawnQueueList = [];
    this.spawnCooldown = 0;
    this.spawnInterval = 750;
    this.nextWaveCountdown = 4000;
    this.levelTransitionDone = false;
    this.awaitingPerkChoice = false;
    this.gameOver = false;
    this.sellMode = false;
    this.dragState = null;
    this.typeCooldownUntil = {};

    this.mult = {
      damage: 1, gold: 1, fireRate: 1, towerHpBonus: 0, cost: 1, enemyCount: 1, enemyHp: 1,
      range: 1, splash: 1, reactionDamage: 1, reactionRadius: 1, freezeCooldown: 1, reactionCooldown: 1, statusDuration: 1,
    };

    this.towers = [];
    this.enemies = [];
    this.projectiles = [];
    this.selectedType = null;
    this.costTexts = {};
    this.tileImages = [];

    this.PATH = generatePath();
    this.recomputeBuildable();

    this.cameras.main.setBackgroundColor(PALETTE.sceneBg);
    this.drawLevelBackground();
    this.drawStaticUI();
    this.drawTopHud();
    this.drawBottomUI();

    if (typeof Bridge !== 'undefined') { Bridge.notifyGameReady(); Bridge.gameplayStart(); }

    this.rangePreview = this.add.circle(0, 0, 0, 0x8a6fd6, 0.10).setStrokeStyle(1, 0x8a6fd6, 0.5).setVisible(false);

    this.input.on('pointermove', pointer => {
      if (this.dragState) {
        const dist = Phaser.Math.Distance.Between(this.dragState.startX, this.dragState.startY, pointer.x, pointer.y);
        if (!this.dragState.ghost && dist > DRAG_THRESHOLD) {
          this.dragState.ghost = this.add.image(pointer.x, pointer.y, 'characters_' + this.dragState.key).setDisplaySize(TOWER_BODY, TOWER_BODY).setAlpha(0.8).setDepth(2000);
          this.selectedType = this.dragState.key;
          this.refreshButtonHighlight();
        }
        if (this.dragState.ghost) this.dragState.ghost.setPosition(pointer.x, pointer.y);
      }
      if (this.selectedType && !this.sellMode && pointer.y < PLAY_H) {
        const t = TOWER_TYPES[this.selectedType];
        this.rangePreview.setPosition(pointer.x, pointer.y).setRadius(this.effectiveRange(t, 1)).setVisible(true);
      } else {
        this.rangePreview.setVisible(false);
      }
    });

    this.input.on('pointerup', pointer => {
      if (!this.dragState) return;
      const { key, ghost, wasSelected } = this.dragState;
      const wasDragging = !!ghost;
      if (ghost) ghost.destroy();
      this.dragState = null;
      if (this.gameOver || this.awaitingPerkChoice) { this.selectedType = null; this.refreshButtonHighlight(); return; }

      if (wasDragging) {
        if (pointer.y < PLAY_H) {
          const col = Math.floor(pointer.x / TILE), row = Math.floor(pointer.y / TILE);
          if (col >= 0 && col < COLS && row >= 0 && row < ROWS) {
            if (this.occupied[row][col]) this.tryUpgradeTower(row, col);
            else this.tryPlaceTower(row, col);
          }
        }
        this.selectedType = null;
        this.refreshButtonHighlight();
      } else {
        this.selectedType = wasSelected ? null : key;
        this.refreshButtonHighlight();
      }
    });

    this.input.on('pointerdown', pointer => {
      if (pointer.y >= PLAY_H) return;
      if (this.gameOver || this.awaitingPerkChoice || this.dragState) return;
      const col = Math.floor(pointer.x / TILE);
      const row = Math.floor(pointer.y / TILE);
      if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return;
      if (this.sellMode) { this.trySellTower(row, col); return; }
      if (this.occupied[row][col]) { this.tryUpgradeTower(row, col); return; }
      this.tryPlaceTower(row, col);
    });
  }

  txt(x, y, str, style = {}) {
    const merged = Object.assign({ fontFamily: 'Arial', fontSize: '16px', color: PALETTE.textDark, padding: { top: 8, bottom: 8, left: 4, right: 4 } }, style);
    const base = parseFloat(merged.fontSize);
    if (!Number.isNaN(base)) merged.fontSize = Math.round(base * UI_SCALE) + 'px';
    return this.add.text(x, y, str, merged);
  }

  addIcon(x, y, category, name, emojiFallback, size) {
    const key = 'icon_' + category + '_' + name;
    const s = size * UI_SCALE;
    if (this.textures.exists(key) && !this.missingKeys.has(key)) return this.add.image(x, y, key).setDisplaySize(s, s);
    return this.txt(x, y, emojiFallback, { fontSize: Math.round(size * 0.85) + 'px' }).setOrigin(0.5);
  }

  needsPlaceholder(key) { return !this.textures.exists(key) || this.missingKeys.has(key); }

  buildPlaceholderTextures() {
    const makeTile = (key, color) => {
      if (!this.needsPlaceholder(key)) return;
      const g = this.add.graphics();
      g.fillStyle(color, 1).fillRect(0, 0, TILE, TILE);
      g.generateTexture(key, TILE, TILE);
      g.destroy();
    };
    const makeSquare = (key, color, size) => {
      if (!this.needsPlaceholder(key)) return;
      const g = this.add.graphics();
      g.fillStyle(color, 1).fillRoundedRect(0, 0, size, size, 8);
      g.lineStyle(2, 0xffffff, 0.9).strokeRoundedRect(1, 1, size - 2, size - 2, 8);
      g.generateTexture(key, size, size);
      g.destroy();
    };
    const makeCircle = (key, color, ring, size) => {
      if (!this.needsPlaceholder(key)) return;
      const r = size / 2;
      const g = this.add.graphics();
      g.fillStyle(color, 1).fillCircle(r, r, r);
      g.lineStyle(3, ring, 1).strokeCircle(r, r, r - 2);
      g.generateTexture(key, size, size);
      g.destroy();
    };
    const makeEdgeMask = (key, side) => {
      if (!this.needsPlaceholder(key)) return;
      const g = this.add.graphics();
      const fade = TILE * 0.3;
      const steps = 36;
      for (let i = 0; i < steps; i++) {
        const d0 = (i / steps) * fade, d1 = ((i + 1) / steps) * fade;
        const alpha = Math.pow(1 - i / (steps - 1), 1.4);
        const size = d1 - d0 + 1;
        let rx, ry, rw, rh;
        if (side === 'bottom') { rw = TILE; rh = size; rx = 0; ry = TILE - d1; }
        else if (side === 'top') { rw = TILE; rh = size; rx = 0; ry = d0; }
        else if (side === 'left') { rh = TILE; rw = size; rx = d0; ry = 0; }
        else { rh = TILE; rw = size; rx = TILE - d1; ry = 0; }
        g.fillStyle(0xffffff, alpha).fillRect(rx, ry, rw, rh);
      }
      g.generateTexture(key, TILE, TILE);
      g.destroy();
    };
    const makeCornerMask = (key, corner) => {
      if (!this.needsPlaceholder(key)) return;
      const g = this.add.graphics();
      const cx = corner.includes('l') ? 0 : TILE;
      const cy = corner.includes('t') ? 0 : TILE;
      const maxR = TILE * 0.34;
      const steps = 40;
      for (let i = 0; i < steps; i++) {
        const r0 = (i / steps) * maxR, r1 = ((i + 1) / steps) * maxR;
        const rMid = (r0 + r1) / 2;
        const thickness = r1 - r0 + 1.5;
        const alpha = Math.pow(1 - i / (steps - 1), 1.4);
        g.lineStyle(thickness, 0xffffff, alpha);
        g.strokeCircle(cx, cy, rMid);
      }
      g.generateTexture(key, TILE, TILE);
      g.destroy();
    };

    makeTile('tiles_border', PALETTE.tileBorder);
    makeTile('tiles_grass', PALETTE.tileGrass);
    makeTile('tiles_forest', PALETTE.tileForest);
    makeTile('tiles_trail', PALETTE.tilePath);
    ['top', 'right', 'bottom', 'left'].forEach(side => makeEdgeMask('masks_edge_' + side, side));
    ['tl', 'tr', 'bl', 'br'].forEach(corner => makeCornerMask('masks_corner_' + corner, corner));
    Object.keys(TOWER_TYPES).forEach(key => makeSquare('characters_' + key, TOWER_TYPES[key].color, TOWER_BODY));
    Object.keys(ENEMY_TYPES).forEach(key => makeCircle('mobs_' + key, ENEMY_TYPES[key].color, ENEMY_TYPES[key].ring, ENEMY_TYPES[key].radius * 2));
  }

  zoneAt(r, c) {
    const cx = colX(c), cy = rowY(r);
    let minDist = Infinity;
    for (let i = 0; i < this.PATH.length - 1; i++) {
      const d = pointSegDist(cx, cy, this.PATH[i].x, this.PATH[i].y, this.PATH[i + 1].x, this.PATH[i + 1].y);
      if (d < minDist) minDist = d;
    }
    if (minDist < ZONE_PATH_MAX) return { buildable: false, tier: TIER_PATH };
    if (minDist < ZONE_BORDER_MAX) return { buildable: true, tier: TIER_BORDER };
    if (minDist < ZONE_GRASS_MAX) return { buildable: false, tier: TIER_GRASS };
    return { buildable: false, tier: TIER_FOREST };
  }

  recomputeBuildable() {
    this.buildable = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
    this.tileTier = Array.from({ length: ROWS }, () => Array(COLS).fill(TIER_FOREST));
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const zone = this.zoneAt(r, c);
        this.buildable[r][c] = zone.buildable;
        this.tileTier[r][c] = zone.tier;
      }
    }
    this.occupied = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
  }

  tierAt(r, c, fallback) {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return fallback;
    return this.tileTier[r][c];
  }

  bakeLevelBackground() {
    const srcImg = key => this.textures.get(key).getSourceImage();
    const makeCanvas = () => {
      const c = document.createElement('canvas');
      c.width = PLAY_W; c.height = PLAY_H;
      const ctx = c.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      return { c, ctx };
    };

    const REPEAT = 2;
    const drawTileTexture = (ctx, key, x, y) => {
      const sub = TILE / REPEAT;
      for (let dy = 0; dy < REPEAT; dy++) for (let dx = 0; dx < REPEAT; dx++) ctx.drawImage(srcImg(key), x + dx * sub, y + dy * sub, sub, sub);
    };

    const EDGE = { top: [-1, 0], right: [0, 1], bottom: [1, 0], left: [0, -1] };
    const CORNER = {
      tl: { d: [-1, -1], adj: ['top', 'left'] }, tr: { d: [-1, 1], adj: ['top', 'right'] },
      bl: { d: [1, -1], adj: ['bottom', 'left'] }, br: { d: [1, 1], adj: ['bottom', 'right'] },
    };

    const forestL = makeCanvas();
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) drawTileTexture(forestL.ctx, 'tiles_forest', c * TILE, r * TILE);

    const paintLayer = (texKey, isActive, isSameTier, edgeFallback) => {
      const layer = makeCanvas();
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (!isActive(this.tileTier[r][c])) continue;
          const x = c * TILE, y = r * TILE;
          drawTileTexture(layer.ctx, texKey, x, y);
          const edgeDiffers = {};
          const eraseMask = maskKey => {
            layer.ctx.globalCompositeOperation = 'destination-out';
            layer.ctx.drawImage(srcImg(maskKey), x, y, TILE, TILE);
            layer.ctx.globalCompositeOperation = 'source-over';
          };
          Object.entries(EDGE).forEach(([side, [dr, dc]]) => {
            const differs = !isSameTier(this.tierAt(r + dr, c + dc, edgeFallback));
            edgeDiffers[side] = differs;
            if (differs) eraseMask('masks_edge_' + side);
          });
          Object.entries(CORNER).forEach(([corner, info]) => {
            const [dr, dc] = info.d;
            if (!info.adj.every(side => !edgeDiffers[side])) return;
            const diagDiffers = !isSameTier(this.tierAt(r + dr, c + dc, edgeFallback));
            if (diagDiffers) eraseMask('masks_corner_' + corner);
          });
        }
      }
      return layer;
    };

    const grassL = paintLayer('tiles_grass', tier => tier <= TIER_GRASS, tier => tier <= TIER_GRASS, TIER_GRASS);
    const borderL = paintLayer('tiles_border', tier => tier === TIER_BORDER, tier => tier === TIER_BORDER, TIER_BORDER);
    const pathL = paintLayer('tiles_trail', tier => tier === TIER_PATH, tier => tier === TIER_PATH, TIER_PATH);

    const final = makeCanvas();
    final.ctx.drawImage(forestL.c, 0, 0);
    final.ctx.drawImage(grassL.c, 0, 0);
    final.ctx.drawImage(borderL.c, 0, 0);
    final.ctx.drawImage(pathL.c, 0, 0);

    const key = 'baked_level_bg';
    if (this.textures.exists(key)) this.textures.remove(key);
    this.textures.addCanvas(key, final.c);
    return key;
  }

  refreshBuildableMarkers() {
    if (this.buildableGfx) this.buildableGfx.destroy();
    const g = this.add.graphics().setDepth(-40);
    const inset = 8;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!this.buildable[r][c] || this.occupied[r][c]) continue;
        const x = c * TILE + inset, y = r * TILE + inset, s = TILE - inset * 2;
        g.fillStyle(0xffffff, 0.14).fillRoundedRect(x, y, s, s, 12);
        g.lineStyle(2, 0xffffff, 0.32).strokeRoundedRect(x, y, s, s, 12);
      }
    }
    this.buildableGfx = g;
  }

  drawLevelBackground() {
    this.tileImages.forEach(img => img.destroy());
    this.tileImages = [];

    const bgKey = this.bakeLevelBackground();
    this.tileImages.push(this.add.image(0, 0, bgKey).setOrigin(0, 0).setDepth(-102));

    const vignette = this.add.graphics().setDepth(-60);
    const vSteps = 18;
    for (let i = 0; i < vSteps; i++) {
      const t = i / (vSteps - 1);
      const inset = t * 46;
      vignette.lineStyle(4, 0x5a3f7a, 0.028 * (1 - t)).strokeRect(inset, inset, PLAY_W - inset * 2, PLAY_H - inset * 2);
    }
    this.tileImages.push(vignette);
    this.refreshBuildableMarkers();

  }

  drawStaticUI() {
    const g2 = this.add.graphics();
    g2.fillGradientStyle(0xfffaf5, 0xfffaf5, PALETTE.hudBg, PALETTE.hudBg, 1);
    g2.fillRect(0, PLAY_H, WIDTH, UI_H);
    g2.fillStyle(PALETTE.accentA, 0.4).fillRect(0, PLAY_H, WIDTH, 3);
    g2.lineStyle(2, PALETTE.panelStroke, 1).lineBetween(0, PLAY_H + 3, WIDTH, PLAY_H + 3);
  }

  drawTopHud() {
    const HUD_DEPTH = 300;
    const chipY = 10, chipH = HUD_H - 20;
    const marginX = 12, gapC = 6;
    // Уменьшенные размеры плиток для предотвращения наезжания
    const leftDefs = [
      { key: 'gold', w: 90 }, { key: 'lives', w: 82 }, { key: 'wave', w: 82 }, { key: 'level', w: 82 },
    ];
    let cursorX = marginX;
    const chips = leftDefs.map(d => { const c = { key: d.key, x: cursorX, w: d.w }; cursorX += d.w + gapC; return c; });
    const towersW = 110;
    const towersX = PLAY_W - marginX - towersW;
    chips.push({ key: 'towers', x: towersX, w: towersW });
    this.tooltipContent = {
      gold: 'Золото — трать на новых тян и их прокачку.',
      lives: 'Жизни. Если эфириал доходит до конца пути — теряется жизнь. 0 жизней = поражение.',
      wave: 'Текущая волна врагов в этом уровне (всего ' + WAVES_PER_LEVEL + ' волн на уровень).',
      level: 'Номер уровня. Каждые ' + WAVES_PER_LEVEL + ' волн карта меняется и можно выбрать улучшение.',
      towers: 'Сколько тян размещено. Лимит на поле: ' + MAX_TOWERS + '. КД между установкой тян одного типа: 10с.',
    };

    const bg = this.add.graphics().setDepth(HUD_DEPTH);
    bg.fillGradientStyle(PALETTE.hudBgTop, PALETTE.hudBgTop, 0xffffff, 0xffffff, 0.96);
    bg.fillRect(0, 0, PLAY_W, HUD_H);
    bg.fillStyle(PALETTE.accentA, 0.35).fillRect(0, HUD_H - 3, PLAY_W, 3);
    bg.fillStyle(0x000000, 0.05).fillRect(0, HUD_H, PLAY_W, 3);

    this.hudTexts = {};
    chips.forEach(chip => {
      const g = this.add.graphics().setDepth(HUD_DEPTH);
      this.panelShadow(g, chip.x, chipY, chip.w, chipH, 12);
      g.fillStyle(0xf6f0fb, 1).fillRoundedRect(chip.x, chipY, chip.w, chipH, 12);
      g.lineStyle(1.5, PALETTE.panelStroke, 1).strokeRoundedRect(chip.x, chipY, chip.w, chipH, 12);
      this.hudTexts[chip.key] = this.txt(chip.x + chip.w / 2, chipY + chipH / 2, '', { fontFamily: 'Arial', fontSize: '17px', color: PALETTE.textDark, align: 'center', wordWrap: { width: chip.w - 8 } }).setOrigin(0.5, 0.5).setDepth(HUD_DEPTH + 1);
      const zone = this.add.zone(chip.x, chipY, chip.w, chipH).setOrigin(0, 0).setInteractive({ useHandCursor: true }).setDepth(HUD_DEPTH + 2);
      zone.on('pointerover', () => this.showTooltip(chip.x + chip.w / 2, chipY + chipH + 8, this.tooltipContent[chip.key]));
      zone.on('pointerout', () => this.hideTooltip());
    });

    this.themeChipX = cursorX; this.themeChipY = chipY; this.themeChipW = Math.max(160, towersX - gapC - cursorX); this.themeChipH = chipH;
    this.themeChipGfx = this.add.graphics().setDepth(HUD_DEPTH);
    this.themeBuffText = this.txt(this.themeChipX + 16, chipY + chipH / 2, '', { fontFamily: 'Arial', fontSize: '15px', color: PALETTE.textAccent }).setOrigin(0, 0.5).setDepth(HUD_DEPTH + 1);
    this.themeChipZone = this.add.zone(this.themeChipX, chipY, this.themeChipW, chipH).setOrigin(0, 0).setDepth(HUD_DEPTH + 2);
    this.themeChipZone.on('pointerover', () => {
      if (!this.currentTheme) return;
      this.showTooltip(this.themeChipX + this.themeChipW / 2, chipY + chipH + 8,
        'Уровень усиливает реакцию «' + this.currentTheme.reactionName + '» (×' + this.currentTheme.buffMult + ') и увеличивает дальность башен нужной стихии.');
    });
    this.themeChipZone.on('pointerout', () => this.hideTooltip());

    this.tooltipGfx = this.add.graphics().setDepth(HUD_DEPTH + 10).setVisible(false);
    this.tooltipText = this.txt(0, 0, '', { fontFamily: 'Arial', fontSize: '13px', color: '#ffffff', wordWrap: { width: 260 } }).setDepth(HUD_DEPTH + 11).setVisible(false);
  }

  showTooltip(cx, y, text) {
    this.tooltipText.setText(text);
    const w = Math.min(280, this.tooltipText.width + 24);
    this.tooltipText.setWordWrapWidth(w - 24);
    const h = this.tooltipText.height + 20;
    let tx = Phaser.Math.Clamp(cx - w / 2, 8, PLAY_W - w - 8);
    this.tooltipGfx.clear();
    this.tooltipGfx.fillStyle(0x2a2038, 0.95).fillRoundedRect(tx, y, w, h, 10);
    this.tooltipGfx.setVisible(true);
    this.tooltipText.setPosition(tx + 12, y + 10).setVisible(true);
  }

  hideTooltip() { this.tooltipGfx.setVisible(false); this.tooltipText.setVisible(false); }

  effectiveCost(key) { return Math.max(10, Math.round(TOWER_TYPES[key].cost * this.mult.cost)); }
  refreshCostLabels() { Object.keys(this.costTexts).forEach(key => this.costTexts[key].setText('💰 ' + this.effectiveCost(key))); }

  effectiveRange(type, level) {
    const lvlMult = 1 + (level - 1) * 0.02;
    const themeMult = (type.element && this.currentTheme && themeAffectedElements(this.currentTheme).includes(type.element))
      ? 1 + (this.currentTheme.buffMult - 1) * 0.5 : 1;
    return type.range * lvlMult * this.mult.range * themeMult;
  }
  upgradeCost(tower) { return Math.round(tower.type.cost * (0.5 + tower.level * 0.45)); }

  panelShadow(gfx, x, y, w, h, radius) {
    gfx.fillStyle(0x000000, 0.10).fillRoundedRect(x + 3, y + 5, w, h, radius);
    gfx.fillStyle(0x000000, 0.06).fillRoundedRect(x + 1.5, y + 2.5, w, h, radius);
  }

  drawCardPanel(gfx, x, y, w, h, highlighted) {
    gfx.clear();
    this.panelShadow(gfx, x, y, w, h, 14);
    if (highlighted) {
      gfx.fillGradientStyle(0xfff3e4, 0xfff3e4, 0xffe2c2, 0xffe2c2, 1);
    } else {
      gfx.fillGradientStyle(PALETTE.panelBgTop, PALETTE.panelBgTop, PALETTE.panelBg, PALETTE.panelBg, 1);
    }
    gfx.fillRoundedRect(x, y, w, h, 14);
    gfx.lineStyle(highlighted ? 2.5 : 2, highlighted ? PALETTE.panelStrokeSelected : PALETTE.panelStroke, 1).strokeRoundedRect(x, y, w, h, 14);
    if (highlighted) gfx.lineStyle(6, PALETTE.panelStrokeSelected, 0.18).strokeRoundedRect(x - 2, y - 2, w + 4, h + 4, 16);
    gfx.fillStyle(0xffffff, 0.45).fillRoundedRect(x + 3, y + 3, w - 6, Math.min(h * 0.32, 26), 10);
  }

  drawSellPanel(active) {
    const gfx = this.sellGfx;
    const { sellBtnX: x, sellBtnY: y, sellBtnW: w, sellBtnH: h } = UI_LAYOUT;
    gfx.clear();
    this.panelShadow(gfx, x, y, w, h, 14);
    // Бледно-красный цвет для кнопки продажи
    if (active) {
      gfx.fillGradientStyle(0xffe0d8, 0xffe0d8, 0xffccc4, 0xffccc4, 1);
    } else {
      gfx.fillGradientStyle(0xfff0ec, 0xfff0ec, 0xffe8e4, 0xffe8e4, 1);
    }
    gfx.fillRoundedRect(x, y, w, h, 14);
    gfx.lineStyle(active ? 2.5 : 2, active ? 0xc98070 : 0xf0c0b8, 1).strokeRoundedRect(x, y, w, h, 14);
    gfx.fillStyle(0xffffff, 0.45).fillRoundedRect(x + 3, y + 3, w - 6, Math.min(h * 0.32, 26), 10);
  }

  drawBottomUI() {
    this.towerButtons = {};
    this.cooldownGfx = {};
    this.cooldownText = {};
    const keys = Object.keys(TOWER_TYPES);
    keys.forEach((key, i) => {
      const t = TOWER_TYPES[key];
      const bx = UI_LAYOUT.cardStartX + i * (UI_LAYOUT.cardW + UI_LAYOUT.cardGap);
      const by = UI_LAYOUT.cardY;
      const bw = UI_LAYOUT.cardW, bh = UI_LAYOUT.cardH;

      const gfx = this.add.graphics();
      this.drawCardPanel(gfx, bx, by, bw, bh, false);
      const zone = this.add.zone(bx, by, bw, bh).setOrigin(0, 0).setInteractive({ useHandCursor: true });

      this.add.image(bx + bw / 2, by + 34, 'characters_' + key).setDisplaySize(48, 48);
      if (t.element) this.addIcon(bx + bw - 18, by + 14, 'elements', t.element, ELEMENT_ICON[t.element], 18);
      this.txt(bx + bw / 2, by + 62, t.name, { fontFamily: 'Arial', fontSize: '13px', color: PALETTE.textDark }).setOrigin(0.5, 0);
      this.costTexts[key] = this.txt(bx + bw / 2, by + 86, '💰 ' + this.effectiveCost(key), { fontFamily: 'Arial', fontSize: '13px', color: PALETTE.textAccent }).setOrigin(0.5, 0);

      const cdGfx = this.add.graphics().setDepth(60).setVisible(false);
      const cdText = this.txt(bx + bw / 2, by + bh / 2, '', { fontFamily: 'Arial', fontSize: '20px', color: '#ffffff' }).setOrigin(0.5).setDepth(61).setVisible(false);
      this.cooldownGfx[key] = { gfx: cdGfx, x: bx, y: by, w: bw, h: bh };
      this.cooldownText[key] = cdText;

      zone.on('pointerdown', pointer => {
        if (this.awaitingPerkChoice) return;
        if ((this.typeCooldownUntil[key] || 0) > this.time.now) return;
        this.sellMode = false;
        this.drawSellPanel(false);
        this.dragState = { key, startX: pointer.x, startY: pointer.y, wasSelected: this.selectedType === key, ghost: null };
      });
      zone.on('pointerover', () => { if (this.selectedType !== key) { this.drawCardPanel(gfx, bx, by, bw, bh, false); gfx.lineStyle(2, PALETTE.accentA, 0.9).strokeRoundedRect(bx, by, bw, bh, 14); } });
      zone.on('pointerout', () => this.refreshButtonHighlight());
      this.towerButtons[key] = gfx;
    });

    this.sellGfx = this.add.graphics();
    this.drawSellPanel(false);
    const sellZone = this.add.zone(UI_LAYOUT.sellBtnX, UI_LAYOUT.sellBtnY, UI_LAYOUT.sellBtnW, UI_LAYOUT.sellBtnH).setOrigin(0, 0).setInteractive({ useHandCursor: true });
    this.addIcon(UI_LAYOUT.sellBtnX + UI_LAYOUT.sellBtnW / 2, UI_LAYOUT.sellBtnY + 22, 'ui', 'sell', '🗑', 30);
    // Двухстрочный текст для продажи - внутри кнопки
    this.txt(UI_LAYOUT.sellBtnX + UI_LAYOUT.sellBtnW / 2, UI_LAYOUT.sellBtnY + 36, 'Продать', { fontFamily: 'Arial', fontSize: '11px', color: PALETTE.textDark, align: 'center' }).setOrigin(0.5, 1);
    this.txt(UI_LAYOUT.sellBtnX + UI_LAYOUT.sellBtnW / 2, UI_LAYOUT.sellBtnY + 48, '60%', { fontFamily: 'Arial', fontSize: '10px', color: PALETTE.textMuted, align: 'center' }).setOrigin(0.5, 0);
    sellZone.on('pointerdown', () => {
      if (this.awaitingPerkChoice) return;
      this.sellMode = !this.sellMode;
      if (this.sellMode) { this.selectedType = null; this.refreshButtonHighlight(); }
      this.drawSellPanel(this.sellMode);
    });

    const wbx = UI_LAYOUT.waveBtnX, wby = UI_LAYOUT.waveBtnY - UI_LAYOUT.waveBtnH / 2;
    this.waveGfx = this.add.graphics();
    this.panelShadow(this.waveGfx, wbx, wby, UI_LAYOUT.waveBtnW, UI_LAYOUT.waveBtnH, 16);
    this.waveGfx.fillGradientStyle(0xe9dffa, 0xe9dffa, 0xd8c4f2, 0xd8c4f2, 1);
    this.waveGfx.fillRoundedRect(wbx, wby, UI_LAYOUT.waveBtnW, UI_LAYOUT.waveBtnH, 16);
    this.waveGfx.lineStyle(2, 0xb79ae0, 1).strokeRoundedRect(wbx, wby, UI_LAYOUT.waveBtnW, UI_LAYOUT.waveBtnH, 16);
    this.waveGfx.fillStyle(0xffffff, 0.45).fillRoundedRect(wbx + 3, wby + 3, UI_LAYOUT.waveBtnW - 6, 12, 10);
    const waveZone = this.add.zone(wbx, wby, UI_LAYOUT.waveBtnW, UI_LAYOUT.waveBtnH).setOrigin(0, 0).setInteractive({ useHandCursor: true });
    // Двухстрочный текст для кнопки волны
    this.waveButtonText = this.txt(UI_LAYOUT.waveBtnX + UI_LAYOUT.waveBtnW / 2, UI_LAYOUT.waveBtnY - 8, '', { fontFamily: 'Arial', fontSize: '15px', color: PALETTE.textDark, align: 'center' }).setOrigin(0.5, 1);
    this.waveCountdownText = this.txt(UI_LAYOUT.waveBtnX + UI_LAYOUT.waveBtnW / 2, UI_LAYOUT.waveBtnY + 10, '', { fontFamily: 'Arial', fontSize: '13px', color: PALETTE.textMuted, align: 'center' }).setOrigin(0.5, 0);
    waveZone.on('pointerdown', () => { if (!this.waveInProgress && !this.awaitingPerkChoice) this.startWave(); });

    this.updateUIText();
  }

  refreshButtonHighlight() {
    const keys = Object.keys(TOWER_TYPES);
    keys.forEach((key, i) => {
      const bx = UI_LAYOUT.cardStartX + i * (UI_LAYOUT.cardW + UI_LAYOUT.cardGap);
      this.drawCardPanel(this.towerButtons[key], bx, UI_LAYOUT.cardY, UI_LAYOUT.cardW, UI_LAYOUT.cardH, key === this.selectedType);
    });
  }

  updateUIText() {
    this.hudTexts.gold.setText('💰 ' + this.gold);
    this.hudTexts.lives.setText('❤ ' + this.lives);
    this.hudTexts.wave.setText('🌊 ' + this.wave);
    this.hudTexts.level.setText('🗺 Ур.' + this.level);
    this.hudTexts.towers.setText('🏗 Тян: ' + this.towers.length + '/' + MAX_TOWERS);
    if (this.currentTheme) {
      this.themeBuffText.setText(this.currentTheme.icon + ' ' + this.currentTheme.reactionName + ' ×' + this.currentTheme.buffMult);
      this.themeChipGfx.clear();
      this.panelShadow(this.themeChipGfx, this.themeChipX, this.themeChipY, this.themeChipW, this.themeChipH, 12);
      this.themeChipGfx.fillStyle(0xfff3e0, 1).fillRoundedRect(this.themeChipX, this.themeChipY, this.themeChipW, this.themeChipH, 12);
      this.themeChipGfx.lineStyle(1.5, 0xf0c98a, 1).strokeRoundedRect(this.themeChipX, this.themeChipY, this.themeChipW, this.themeChipH, 12);
      this.themeChipZone.setInteractive({ useHandCursor: true });
    } else {
      this.themeBuffText.setText('');
      this.themeChipGfx.clear();
      this.themeChipZone.disableInteractive();
    }
    if (this.towers) this.towers.forEach(t => this.refreshUpgradeBadge(t));
  }

  createUpgradeBadge(tower) {
    tower.upgBg = this.add.graphics();
    tower.upgLabel = this.txt(0, 0, '', { fontFamily: 'Arial', fontSize: '11px', color: '#ffffff', padding: { top: 1, bottom: 1, left: 2, right: 2 } }).setOrigin(0.5);
    this.refreshUpgradeBadge(tower);
  }

  refreshUpgradeBadge(tower) {
    if (!tower.upgBg) return;
    const bx = tower.x + 16, by = tower.y - 28;
    const w = 34, h = 18;
    const maxed = tower.level >= TOWER_MAX_LEVEL;
    const cost = maxed ? 0 : this.upgradeCost(tower);
    const affordable = !maxed && this.gold >= cost;
    tower.upgBg.clear();
    tower.upgBg.fillStyle(maxed ? 0xbfb3d6 : (affordable ? 0x6fbf6f : 0xd9a8a0), 0.95);
    tower.upgBg.fillRoundedRect(bx - w / 2, by - h / 2, w, h, 6);
    tower.upgBg.lineStyle(1, 0xffffff, 0.85).strokeRoundedRect(bx - w / 2, by - h / 2, w, h, 6);
    tower.upgLabel.setText(maxed ? 'MAX' : ('▲' + cost)).setPosition(bx, by);
  }

  showFloatText(x, y, text, color) {
    const t = this.txt(x, y, text, { fontFamily: 'Arial', fontSize: '13px', color }).setOrigin(0.5).setDepth(500);
    this.tweens.add({ targets: t, y: y - 34, alpha: 0, duration: 750, onComplete: () => t.destroy() });
  }

  showBanner(title, subtitle) {
    const w = Math.min(PLAY_W - 80, 520);
    const h = subtitle ? 148 : 92;
    const x = WIDTH / 2 - w / 2, y = PLAY_H / 2 - h / 2;
    const depthBase = 1000;

    const gfx = this.add.graphics().setDepth(depthBase);
    this.panelShadow(gfx, x, y, w, h, 20);
    gfx.fillGradientStyle(PALETTE.panelBgTop, PALETTE.panelBgTop, PALETTE.panelBg, PALETTE.panelBg, 1);
    gfx.fillRoundedRect(x, y, w, h, 20);
    gfx.lineStyle(3, PALETTE.accentA, 1).strokeRoundedRect(x, y, w, h, 20);

    const t1 = this.txt(WIDTH / 2, y + (subtitle ? 44 : h / 2), title, { fontFamily: 'Arial', fontSize: '30px', color: PALETTE.textAccent }).setOrigin(0.5).setDepth(depthBase + 1);
    const targets = [gfx, t1];
    if (subtitle) {
      const t2 = this.txt(WIDTH / 2, y + 92, subtitle, { fontFamily: 'Arial', fontSize: '16px', color: PALETTE.textDark, align: 'center', wordWrap: { width: w - 60 } }).setOrigin(0.5, 0).setDepth(depthBase + 1);
      targets.push(t2);
    }
    targets.forEach(o => o.setAlpha(0));
    this.tweens.add({ targets, alpha: 1, duration: 220, ease: 'Sine.easeOut' });
    this.tweens.add({ targets, alpha: 0, delay: 2200, duration: 700, onComplete: () => targets.forEach(o => o.destroy()) });
  }

  openModalWindow(w, h, depthBase) {
    const overlay = [];
    const dim = this.add.rectangle(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 0x2a2038, 0.45).setDepth(depthBase);
    overlay.push(dim);
    const x = WIDTH / 2 - w / 2, y = PLAY_H / 2 - h / 2;
    const g = this.add.graphics().setDepth(depthBase + 1);
    g.fillStyle(0x000000, 0.12).fillRoundedRect(x + 5, y + 8, w, h, 22);
    g.fillStyle(0x000000, 0.07).fillRoundedRect(x + 2, y + 3, w, h, 22);
    g.fillStyle(0xfffdfb, 1).fillRoundedRect(x, y, w, h, 22);
    g.lineStyle(3, PALETTE.panelStroke, 1).strokeRoundedRect(x, y, w, h, 22);
    overlay.push(g);
    return { overlay, x, y, w, h };
  }

  showThemeWarning(theme, onDone) {
    const modal = this.openModalWindow(520, 360, 3000);
    const { overlay, x, y, w } = modal;
    const cx = x + w / 2;
    const icon = this.addIcon(cx, y + 66, 'themes', theme.id, theme.icon, 56);
    const title = this.txt(cx, y + 118, 'Тематический уровень: ' + theme.name, { fontFamily: 'Arial', fontSize: '24px', color: PALETTE.textAccent }).setOrigin(0.5).setDepth(3002);
    const desc = this.txt(cx, y + 168, theme.desc, { fontFamily: 'Arial', fontSize: '15px', color: PALETTE.textDark, align: 'center', wordWrap: { width: w - 100 } }).setOrigin(0.5, 0).setDepth(3002);
    const buff = this.txt(cx, y + 232, 'Бафф уровня: ' + theme.reactionName + ' сильнее в ' + theme.buffMult + ' раза (+дальность тян этой стихии)', { fontFamily: 'Arial', fontSize: '14px', color: '#3f8fae', align: 'center', wordWrap: { width: w - 100 } }).setOrigin(0.5, 0).setDepth(3002);
    overlay.push(icon, title, desc, buff);

    const elements = themeAffectedElements(theme);
    const elIconSize = 34, elGap = 12;
    const elStartX = cx - (elements.length * elIconSize + (elements.length - 1) * elGap) / 2 + elIconSize / 2;
    elements.forEach((el, i) => {
      const elIcon = this.addIcon(elStartX + i * (elIconSize + elGap), y + 270, 'elements', el, ELEMENT_ICON[el], elIconSize);
      overlay.push(elIcon);
    });

    const bw = 200, bh = 50, bx = cx - bw / 2, by = y + 330;
    const btnG = this.add.graphics().setDepth(3002);
    btnG.fillStyle(0xe4d8f7, 1).fillRoundedRect(bx, by, bw, bh, 14);
    btnG.lineStyle(2, 0xb79ae0, 1).strokeRoundedRect(bx, by, bw, bh, 14);
    const btnZone = this.add.zone(bx, by, bw, bh).setOrigin(0, 0).setInteractive({ useHandCursor: true }).setDepth(3003);
    const btnText = this.txt(cx, by + bh / 2, 'Понятно', { fontFamily: 'Arial', fontSize: '17px', color: PALETTE.textDark }).setOrigin(0.5).setDepth(3003);
    overlay.push(btnG, btnZone, btnText);
    btnZone.on('pointerdown', () => { overlay.forEach(o => o.destroy()); onDone(); });
  }

  showPerkChoice(onDone) {
    const modal = this.openModalWindow(640, 360, 3000);
    const { overlay, x, y, w } = modal;
    const cx = x + w / 2;
    const title = this.txt(cx, y + 30, 'Выбери улучшение', { fontFamily: 'Arial', fontSize: '22px', color: PALETTE.textAccent }).setOrigin(0.5).setDepth(3002);
    overlay.push(title);

    const shuffled = Phaser.Utils.Array.Shuffle([...PERKS]);
    const choices = shuffled.slice(0, 3);
    const cardW = 180, cardH = 200, gap = 16;
    const totalW = choices.length * cardW + (choices.length - 1) * gap;
    const startX = cx - totalW / 2;
    const cardY = y + 90;

    choices.forEach((perk, i) => {
      const bx = startX + i * (cardW + gap);
      const g = this.add.graphics().setDepth(3002);
      g.fillStyle(0xf6f0fb, 1).fillRoundedRect(bx, cardY, cardW, cardH, 16);
      g.lineStyle(2, PALETTE.panelStroke, 1).strokeRoundedRect(bx, cardY, cardW, cardH, 16);
      const zone = this.add.zone(bx, cardY, cardW, cardH).setOrigin(0, 0).setInteractive({ useHandCursor: true }).setDepth(3003);
      const icon = this.addIcon(bx + cardW / 2, cardY + 40, 'perks', perk.id, perk.icon, 36);
      const name = this.txt(bx + cardW / 2, cardY + 78, perk.name, { fontFamily: 'Arial', fontSize: '14px', color: PALETTE.textDark }).setOrigin(0.5).setDepth(3003);
      const desc = this.txt(bx + cardW / 2, cardY + 112, perk.desc, { fontFamily: 'Arial', fontSize: '11px', color: PALETTE.textMuted, align: 'center', wordWrap: { width: cardW - 16 } }).setOrigin(0.5, 0).setDepth(3003);
      overlay.push(g, zone, icon, name, desc);

      zone.on('pointerover', () => { g.clear(); g.fillStyle(0xf6f0fb, 1).fillRoundedRect(bx, cardY, cardW, cardH, 16); g.lineStyle(2, PALETTE.panelStrokeSelected, 1).strokeRoundedRect(bx, cardY, cardW, cardH, 16); });
      zone.on('pointerout', () => { g.clear(); g.fillStyle(0xf6f0fb, 1).fillRoundedRect(bx, cardY, cardW, cardH, 16); g.lineStyle(2, PALETTE.panelStroke, 1).strokeRoundedRect(bx, cardY, cardW, cardH, 16); });
      zone.on('pointerdown', () => { perk.apply(this); overlay.forEach(o => o.destroy()); onDone(); });
    });
  }

  tryPlaceTower(row, col) {
    if (!this.selectedType) return;
    if (!this.buildable[row][col] || this.occupied[row][col]) return;
    if (this.towers.length >= MAX_TOWERS) { this.showFloatText(colX(col), rowY(row) - 20, 'Лимит тян: ' + MAX_TOWERS, '#d9553f'); return; }
    const cdLeft = (this.typeCooldownUntil[this.selectedType] || 0) - this.time.now;
    if (cdLeft > 0) { this.showFloatText(colX(col), rowY(row) - 20, 'КД: ' + Math.ceil(cdLeft / 1000) + 'с', '#d9553f'); return; }
    const t = TOWER_TYPES[this.selectedType];
    const cost = this.effectiveCost(this.selectedType);
    if (this.gold < cost) { this.showFloatText(colX(col), rowY(row) - 20, 'Не хватает золота', '#d9553f'); return; }

    this.gold -= cost;
    this.occupied[row][col] = true;
    this.typeCooldownUntil[this.selectedType] = this.time.now + TOWER_TYPE_COOLDOWN_MS;

    const cx = colX(col), cy = rowY(row);
    const shadow = this.add.ellipse(cx, cy + 27, 55, 19, 0x2a1f3a, 0.16);
    const body = this.add.image(cx, cy, 'characters_' + this.selectedType).setDisplaySize(TOWER_BODY, TOWER_BODY);
    const maxHp = TOWER_MAX_HP + this.mult.towerHpBonus;
    const hpBg = this.add.rectangle(cx, cy + 41, 46, 6, 0xffffff, 0.6).setOrigin(0.5);
    const hpFg = this.add.rectangle(cx - 23, cy + 41, 46, 6, 0x6fbf6f).setOrigin(0, 0.5);
    const levelText = this.txt(cx, cy + 27, 'Ур.1', { fontFamily: 'Arial', fontSize: '11px', color: '#ffffff', padding: { top: 2, bottom: 2, left: 2, right: 2 } }).setOrigin(0.5).setDepth(50);
    this.towers.push({
      type: t, x: cx, y: cy, row, col, lastFired: -99999, body, shadow, hp: maxHp, maxHp, hpBg, hpFg,
      level: 1, levelText, milestonesApplied: new Set(), baseScaleX: body.scaleX, baseScaleY: body.scaleY,
    });
    this.createUpgradeBadge(this.towers[this.towers.length - 1]);
    this.refreshBuildableMarkers();
    this.updateUIText();
  }

  tryUpgradeTower(row, col) {
    const tower = this.towers.find(t => t.row === row && t.col === col);
    if (!tower) return;
    if (tower.level >= TOWER_MAX_LEVEL) { this.showFloatText(tower.x, tower.y - 30, 'Макс. уровень', PALETTE.textMuted); return; }
    const cost = this.upgradeCost(tower);
    if (this.gold < cost) { this.showFloatText(tower.x, tower.y - 30, 'Нужно 💰' + cost, '#d9553f'); return; }

    this.gold -= cost;
    tower.level += 1;
    this.showFloatText(tower.x, tower.y - 30, 'Ур. ' + tower.level, '#3f8fae');
    tower.levelText.setText('Ур.' + tower.level);
    const scale = 1 + Math.min(0.35, (tower.level - 1) * 0.018);
    tower.body.setDisplaySize(TOWER_BODY * scale, TOWER_BODY * scale);
    tower.baseScaleX = tower.body.scaleX;
    tower.baseScaleY = tower.body.scaleY;

    const milestone = (TOWER_MILESTONES[tower.type.key] || []).find(m => m.lvl === tower.level);
    if (milestone && !tower.milestonesApplied.has(tower.level)) {
      tower.milestonesApplied.add(tower.level);
      milestone.apply(this);
      this.refreshCostLabels();
      this.showBanner(tower.type.name + ' · Ур.' + tower.level, milestone.name + ': ' + milestone.desc);
    }
    this.refreshUpgradeBadge(tower);
    this.updateUIText();
  }

  trySellTower(row, col) {
    const tower = this.towers.find(t => t.row === row && t.col === col);
    if (!tower) return;
    const refund = Math.floor(tower.type.cost * SELL_REFUND_RATIO * (1 + (tower.level - 1) * 0.15));
    this.gold += refund;
    this.showFloatText(tower.x, tower.y - 30, '+' + refund + '💰', '#c97b2e');
    this.destroyTower(tower);
    this.updateUIText();
  }

  destroyTower(tower) {
    tower.body.destroy(); tower.hpBg.destroy(); tower.hpFg.destroy(); tower.levelText.destroy();
    if (tower.shadow) tower.shadow.destroy();
    if (tower.upgBg) tower.upgBg.destroy();
    if (tower.upgLabel) tower.upgLabel.destroy();
    this.occupied[tower.row][tower.col] = false;
    this.towers = this.towers.filter(t => t !== tower);
    for (const e of this.enemies) if (e.attackTarget === tower) e.attackTarget = null;
    this.refreshBuildableMarkers();
  }

  composeWave(wave) {
    const unlocked = ['grunt'];
    if (wave >= 3) unlocked.push('runner');
    if (wave >= 5) unlocked.push('shielded');
    if (wave >= 7) unlocked.push('wrecker');

    let pool = unlocked;
    if (this.currentTheme && this.currentTheme.enemyBias) {
      const biasPool = [];
      Object.entries(this.currentTheme.enemyBias).forEach(([key, weight]) => { if (unlocked.includes(key)) for (let i = 0; i < weight; i++) biasPool.push(key); });
      if (biasPool.length > 0) pool = biasPool;
    }

    const countMultTheme = (this.currentTheme && this.currentTheme.countMult) || 1;
    const baseCount = 6 + Math.floor(wave * 1.3);
    const count = Math.max(1, Math.round(baseCount * this.mult.enemyCount * countMultTheme));

    const list = [];
    for (let i = 0; i < count; i++) { const key = pool[Phaser.Math.Between(0, pool.length - 1)]; list.push({ typeKey: key, isBoss: false }); }
    if (wave % WAVES_PER_LEVEL === 0) list.push({ typeKey: 'shielded', isBoss: true });
    return list;
  }

  transitionLevel(nextWaveNum) {
    this.level = Math.ceil(nextWaveNum / WAVES_PER_LEVEL);
    let refund = 0;
    for (const t of [...this.towers]) { refund += Math.floor(t.type.cost * SELL_REFUND_RATIO); this.destroyTower(t); }
    this.gold += refund;
    this.PATH = generatePath();
    this.recomputeBuildable();
    this.currentTheme = this.level >= 2 ? THEMES[(this.level - 2) % THEMES.length] : null;
    this.drawLevelBackground();
    this.showBanner('Уровень ' + this.level, refund > 0 ? ('Карта сменилась. Тян продано: +' + refund + '💰') : 'Карта сменилась');
    this.updateUIText();
  }

  actuallyStartWave(waveNum) {
    this.wave = waveNum;
    this.waveInProgress = true;
    this.spawnQueueList = this.composeWave(this.wave);
    this.spawnCooldown = 0;
    this.updateUIText();
  }

  startWave() {
    if (this.waveInProgress || this.gameOver || this.awaitingPerkChoice) return;
    const nextWaveNum = this.wave + 1;
    if (isTransitionWave(nextWaveNum) && !this.levelTransitionDone) {
      this.transitionLevel(nextWaveNum);
      this.levelTransitionDone = true;
      this.awaitingPerkChoice = true;
      const goToPerks = () => { this.showPerkChoice(() => { this.awaitingPerkChoice = false; this.nextWaveCountdown = POST_LEVEL_PAUSE_MS; }); };
      if (this.currentTheme) this.showThemeWarning(this.currentTheme, goToPerks);
      else goToPerks();
      return;
    }
    this.levelTransitionDone = false;
    this.actuallyStartWave(nextWaveNum);
  }

  statsFor(typeKey, wave, isBoss) {
    const t = ENEMY_TYPES[typeKey];
    const baseHp = 26 * Math.pow(1.12, wave - 1) * Math.pow(1.15, this.level - 1);
    const baseSpeed = (48 + Math.min(28, wave * 1.8)) * (TILE / 70);
    const themeHpMult = (this.currentTheme && this.currentTheme.hpMultLevel) || 1;
    let hp = baseHp * t.hpMult * this.mult.enemyHp * themeHpMult;
    let speed = baseSpeed * t.speedMult;
    let reward = Math.round((5 + Math.floor(wave / 2) + this.level * 2) * t.reward * this.mult.gold);
    let livesCost = t.livesCost;
    if (isBoss) { hp *= 4; speed *= 0.85; reward *= 4; livesCost *= 2; }
    return { hp: Math.round(hp), speed, reward, livesCost };
  }

  spawnEnemy(item) {
    const t = ENEMY_TYPES[item.typeKey];
    const s = this.statsFor(item.typeKey, this.wave, item.isBoss);
    const radius = item.isBoss ? t.radius * 1.7 : t.radius;
    const start = this.PATH[0];
    const shadow = this.add.ellipse(start.x, start.y + radius * 0.7, radius * 1.7, radius * 0.6, 0x2a1f3a, 0.16);
    const body = this.add.image(start.x, start.y, 'mobs_' + item.typeKey).setDisplaySize(radius * 2, radius * 2);
    const barW = radius * 2;
    const hpBg = this.add.rectangle(start.x, start.y - radius - 8, barW, 5, 0xffffff, 0.6).setOrigin(0.5);
    const hpFg = this.add.rectangle(start.x - barW / 2, start.y - radius - 8, barW, 5, 0x6fbf6f).setOrigin(0, 0.5);
    const bossRing = item.isBoss ? this.add.circle(start.x, start.y, radius + 5, 0xffffff, 0).setStrokeStyle(3, 0xf0b429) : null;
    const statusRing = this.add.circle(start.x, start.y, radius + 4, 0xffffff, 0).setStrokeStyle(3, 0xffffff).setVisible(false);
    // statusOverlay использует blend mode ADD чтобы эффект был виден только поверх непрозрачных пикселей спрайта
    const statusOverlay = this.add.circle(start.x, start.y, radius, 0xffffff, 0).setBlendMode(Phaser.BlendModes.ADD).setVisible(false);
    const shieldRing = t.hasShield ? this.add.circle(start.x, start.y, radius + 7, 0xffffff, 0.12).setStrokeStyle(3, 0xd6cbe8) : null;

    this.enemies.push({
      x: start.x, y: start.y, hp: s.hp, maxHp: s.hp, speed: s.speed, reward: s.reward, livesCost: s.livesCost,
      radius, barW, wpIndex: 1, body, shadow, hpBg, hpFg, bossRing, statusRing, statusOverlay, shieldRing,
      slowMult: 1, slowUntil: 0, frozenVisualSet: false,
      type: t, typeKey: item.typeKey, isBoss: item.isBoss,
      attackTarget: null, attackTimer: 0, attackWarned: false,
      elementStatus: null, elementUntil: 0, lastReactionTime: -Infinity, lastFreezeTime: -Infinity,
      shieldActive: !!t.hasShield, statusBlinkTween: null, bobPhase: Math.random() * Math.PI * 2,
    });
  }

  inField(e) { return e.x >= 0 && e.x <= PLAY_W && e.y >= 0 && e.y <= PLAY_H; }

  findTarget(tower) {
    let best = null, bestProgress = -1;
    const range = this.effectiveRange(tower.type, tower.level);
    for (const e of this.enemies) {
      if (!this.inField(e)) continue;
      const d = Phaser.Math.Distance.Between(tower.x, tower.y, e.x, e.y);
      if (d <= range && e.wpIndex > bestProgress) { bestProgress = e.wpIndex; best = e; }
    }
    return best;
  }

  fireProjectile(tower, target) {
    const p = this.add.circle(tower.x, tower.y, 5, tower.type.proj);
    const lvlDmgMult = 1 + (tower.level - 1) * 0.08;
    this.projectiles.push({ x: tower.x, y: tower.y, target, type: tower.type, body: p, speed: 420 * RANGE_SCALE, lvlDmgMult });
  }

  attackPulse(tower) {
    const body = tower.body;
    const bx = tower.baseScaleX, by = tower.baseScaleY;
    this.tweens.killTweensOf(body);
    body.setScale(bx, by);
    this.tweens.add({
      targets: body,
      scaleX: bx * 0.84,
      scaleY: by * 1.16,
      duration: 100,
      ease: 'Sine.easeOut',
      yoyo: true,
      onComplete: () => body.setScale(bx, by),
    });
  }

  computeIncomingDamage(enemy, dmg, isExplosion) {
    if (enemy.shieldActive) {
      if (isExplosion) { enemy.shieldActive = false; if (enemy.shieldRing) enemy.shieldRing.setVisible(false); return dmg; }
      return Math.max(1, Math.round(dmg * SHIELD_DAMAGE_REDUCTION));
    }
    return dmg;
  }

  applyDamage(enemy, dmg, isExplosion = false) {
    const finalDmg = this.computeIncomingDamage(enemy, dmg, isExplosion);
    enemy.hp -= finalDmg;
    if (enemy.hp <= 0) return;
    const ratio = Math.max(0, enemy.hp / enemy.maxHp);
    enemy.hpFg.width = enemy.barW * ratio;
    enemy.hpFg.fillColor = ratio > 0.5 ? 0x6fbf6f : (ratio > 0.25 ? 0xf0c14b : 0xe6685f);
  }

  dealDamage(enemy, dmg, isExplosion = false) {
    if (!this.enemies.includes(enemy)) return;
    this.applyDamage(enemy, dmg, isExplosion);
    if (enemy.hp <= 0) this.killEnemy(enemy);
  }

  destroyEnemyVisuals(enemy) {
    if (enemy.statusBlinkTween) enemy.statusBlinkTween.stop();
    enemy.body.destroy(); enemy.hpBg.destroy(); enemy.hpFg.destroy();
    if (enemy.shadow) enemy.shadow.destroy();
    if (enemy.bossRing) enemy.bossRing.destroy();
    if (enemy.statusRing) enemy.statusRing.destroy();
    if (enemy.statusOverlay) enemy.statusOverlay.destroy();
    if (enemy.shieldRing) enemy.shieldRing.destroy();
  }

  killEnemy(enemy) { this.gold += enemy.reward; this.destroyEnemyVisuals(enemy); this.enemies = this.enemies.filter(e => e !== enemy); this.updateUIText(); }

  enemyReachedEnd(enemy) {
    this.lives -= enemy.livesCost;
    this.destroyEnemyVisuals(enemy);
    this.enemies = this.enemies.filter(e => e !== enemy);
    this.updateUIText();
    if (this.lives <= 0) this.triggerGameOver();
  }

  startStatusBlink(enemy, el) {
    this.stopStatusBlink(enemy);
    const color = ELEMENT_COLORS[el];
    enemy.statusRing.setStrokeStyle(3, color).setVisible(true);

    // Мигание с использованием ADD blend mode - эффект виден только поверх непрозрачных пикселей спрайта
    const state = { t: 0 };
    enemy.statusBlinkTween = this.tweens.add({
      targets: state,
      t: 1,
      duration: 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      onUpdate: () => {
        if (!enemy.statusOverlay || !enemy.body) return;
        // Мигаем заливкой от 0.1 до 0.35 alpha (слегка заметно)
        const alpha = 0.1 + state.t * 0.25;
        enemy.statusOverlay.setFillStyle(color, alpha).setVisible(true);
      },
    });
  }

  stopStatusBlink(enemy) {
    if (enemy.statusBlinkTween) {
      enemy.statusBlinkTween.remove();
      enemy.statusBlinkTween = null;
    }

    if (enemy.statusRing) {
      enemy.statusRing.setVisible(false);
    }

    if (enemy.statusOverlay) {
      enemy.statusOverlay.setVisible(false);
    }
  }

  applyElementStatus(enemy, el, baseDamage, time) {
    if (!el || !this.enemies.includes(enemy)) return;
    const statusDur = 3000 * this.mult.statusDuration;

    if (!enemy.elementStatus) {
      enemy.elementStatus = el; enemy.elementUntil = time + statusDur;
      this.startStatusBlink(enemy, el);
      if (el === 'cryo') { enemy.slowMult = 0.55; enemy.slowUntil = Math.max(enemy.slowUntil, time + 1200 * this.mult.statusDuration); }
      return;
    }
    if (enemy.elementStatus === el) {
      enemy.elementUntil = time + statusDur;
      if (el === 'cryo') { enemy.slowMult = 0.55; enemy.slowUntil = Math.max(enemy.slowUntil, time + 1200 * this.mult.statusDuration); }
      return;
    }

    const oldEl = enemy.elementStatus;
    if (time - enemy.lastReactionTime < REACTION_COOLDOWN_MS * this.mult.reactionCooldown) {
      enemy.elementStatus = el; enemy.elementUntil = time + statusDur;
      this.startStatusBlink(enemy, el);
      return;
    }

    enemy.elementStatus = null;
    this.stopStatusBlink(enemy);
    enemy.lastReactionTime = time;
    this.resolveReaction(enemy, oldEl, el, baseDamage, time);
  }

  resolveReaction(enemy, elA, elB, baseDamage, time) {
    const key = [elA, elB].sort().join('_');
    const themed = !!(this.currentTheme && this.currentTheme.reactionKeys.includes(key));
    const themeBuff = themed ? this.currentTheme.buffMult : 1;
    const dmgMult = themeBuff * this.mult.reactionDamage;
    const radiusMult = this.mult.reactionRadius;

    switch (key) {
      case 'cryo_hydro': {
        const freezeCd = FREEZE_COOLDOWN_MS * this.mult.freezeCooldown;
        if (themed) {
          const radius = 100 * RANGE_SCALE * radiusMult;
          for (const e2 of [...this.enemies]) {
            const d = Phaser.Math.Distance.Between(enemy.x, enemy.y, e2.x, e2.y);
            if (d <= radius) { e2.slowMult = 0; e2.slowUntil = time + 1600 * themeBuff * this.mult.statusDuration; e2.lastFreezeTime = time; }
          }
          this.showFloatText(enemy.x, enemy.y - 30, 'Ледяной взрыв!', '#3f8fae');
        } else if (time - enemy.lastFreezeTime >= freezeCd) {
          enemy.slowMult = 0; enemy.slowUntil = time + 1600 * this.mult.statusDuration; enemy.lastFreezeTime = time;
          this.showFloatText(enemy.x, enemy.y - 30, 'Заморозка!', '#3f8fae');
        } else {
          enemy.slowMult = 0.55; enemy.slowUntil = Math.max(enemy.slowUntil, time + 1000);
          this.showFloatText(enemy.x, enemy.y - 30, 'Заморозка на КД', '#7fa8c0');
        }
        break;
      }
      case 'hydro_pyro':
        this.dealDamage(enemy, Math.round(baseDamage * dmgMult));
        this.showFloatText(enemy.x, enemy.y - 30, 'Пар!', '#e08040');
        break;
      case 'cryo_pyro':
        this.dealDamage(enemy, Math.round(baseDamage * dmgMult));
        this.showFloatText(enemy.x, enemy.y - 30, 'Таяние!', '#e0973f');
        break;
      case 'electro_hydro': {
        const radius = 90 * RANGE_SCALE * radiusMult;
        this.dealDamage(enemy, Math.round(baseDamage * 0.6 * dmgMult));
        for (const e2 of [...this.enemies]) {
          if (e2 === enemy) continue;
          const d = Phaser.Math.Distance.Between(enemy.x, enemy.y, e2.x, e2.y);
          if (d <= radius && e2.elementStatus === 'hydro' && this.inField(e2)) this.dealDamage(e2, Math.round(baseDamage * 0.6 * dmgMult));
        }
        this.showFloatText(enemy.x, enemy.y - 30, 'Наэлектризовано!', '#8a6fc9');
        break;
      }
      case 'cryo_electro': {
        const radius = 80 * RANGE_SCALE * radiusMult;
        for (const e2 of [...this.enemies]) {
          const d = Phaser.Math.Distance.Between(enemy.x, enemy.y, e2.x, e2.y);
          if (d <= radius && this.inField(e2)) this.dealDamage(e2, Math.round(baseDamage * 0.8 * dmgMult), true);
        }
        this.showFloatText(enemy.x, enemy.y - 30, 'Сверхпроводник!', '#8a6fc9');
        break;
      }
      case 'electro_pyro': {
        const radius = 110 * RANGE_SCALE * radiusMult;
        for (const e2 of [...this.enemies]) {
          const d = Phaser.Math.Distance.Between(enemy.x, enemy.y, e2.x, e2.y);
          if (d <= radius && this.inField(e2)) {
            const dmg = Math.round(baseDamage * 1.0 * dmgMult);
            this.dealDamage(e2, dmg, true);
          }
        }
        this.showFloatText(enemy.x, enemy.y - 30, 'Перегрузка!', '#d9553f');
        break;
      }
    }
  }

  triggerGameOver() {
    this.gameOver = true;
    if (typeof Bridge !== 'undefined') Bridge.gameplayStop();
    this.add.rectangle(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 0x2a2038, 0.55).setDepth(4000);
    const w = 420, h = 220, x = WIDTH / 2 - w / 2, y = HEIGHT / 2 - h / 2;
    const g = this.add.graphics().setDepth(4001);
    g.fillStyle(0x000000, 0.15).fillRoundedRect(x + 5, y + 8, w, h, 22);
    g.fillStyle(0xfffdfb, 1).fillRoundedRect(x, y, w, h, 22);
    g.lineStyle(3, PALETTE.panelStroke, 1).strokeRoundedRect(x, y, w, h, 22);
    this.txt(WIDTH / 2, y + 46, 'Игра окончена', { fontFamily: 'Arial', fontSize: '30px', color: '#d9553f' }).setOrigin(0.5).setDepth(4002);
    this.txt(WIDTH / 2, y + 96, 'Волна ' + this.wave + ' · уровень ' + this.level, { fontFamily: 'Arial', fontSize: '16px', color: PALETTE.textDark }).setOrigin(0.5).setDepth(4002);
    const bw = 170, bh = 46, bx = WIDTH / 2 - bw / 2, by = y + h - 74;
    const btnG = this.add.graphics().setDepth(4002);
    btnG.fillStyle(0xe4d8f7, 1).fillRoundedRect(bx, by, bw, bh, 14);
    btnG.lineStyle(2, 0xb79ae0, 1).strokeRoundedRect(bx, by, bw, bh, 14);
    const btnZone = this.add.zone(bx, by, bw, bh).setOrigin(0, 0).setInteractive({ useHandCursor: true }).setDepth(4003);
    this.txt(WIDTH / 2, by + bh / 2, 'Заново', { fontFamily: 'Arial', fontSize: '17px', color: PALETTE.textDark }).setOrigin(0.5).setDepth(4003);
    btnZone.on('pointerdown', () => this.scene.restart());
  }

  updateCooldownVisuals(time) {
    if (!this.cooldownGfx) return;
    Object.keys(this.cooldownGfx).forEach(key => {
      const { gfx, x, y, w, h } = this.cooldownGfx[key];
      const left = (this.typeCooldownUntil[key] || 0) - time;
      const txt = this.cooldownText[key];
      if (left > 0) {
        gfx.clear();
        gfx.fillStyle(0x2a2038, 0.55).fillRoundedRect(x, y, w, h, 14);
        gfx.setVisible(true);
        txt.setText(Math.ceil(left / 1000) + 'с').setVisible(true);
      } else {
        gfx.setVisible(false);
        txt.setVisible(false);
      }
    });
  }

  update(time, delta) {
    this.updateCooldownVisuals(time);
    if (this.gameOver) return;
    const dt = delta / 1000;

    if (this.awaitingPerkChoice) {
      this.waveButtonText.setText('Выбор...');
      this.waveCountdownText.setText('');
    } else if (!this.waveInProgress) {
      this.nextWaveCountdown -= delta;
      const sec = Math.max(0, Math.ceil(this.nextWaveCountdown / 1000));
      const nextIsTransition = isTransitionWave(this.wave + 1) && !this.levelTransitionDone;
      if (nextIsTransition) {
        this.waveButtonText.setText('Новый ур.');
        this.waveCountdownText.setText(sec + ' сек...');
      } else {
        this.waveButtonText.setText('Волна ' + (this.wave + 1));
        this.waveCountdownText.setText(sec + ' сек...');
      }
      if (this.nextWaveCountdown <= 0) this.startWave();
    } else {
      this.waveButtonText.setText('Волна ' + this.wave);
      this.waveCountdownText.setText('идёт...');
    }

    if (this.awaitingPerkChoice) return;

    if (this.waveInProgress && this.spawnQueueList.length > 0) {
      this.spawnCooldown -= delta;
      if (this.spawnCooldown <= 0) { this.spawnEnemy(this.spawnQueueList.shift()); this.spawnCooldown = this.spawnInterval; }
    }
    if (this.waveInProgress && this.spawnQueueList.length === 0 && this.enemies.length === 0) {
      this.waveInProgress = false;
      this.gold += Math.round((20 + this.wave * 2 + this.level * 5) * this.mult.gold);
      this.nextWaveCountdown = isTransitionWave(this.wave + 1) ? 1500 : 3500;
      this.updateUIText();
    }

    for (const e of [...this.enemies]) {
      if (e.elementStatus && time > e.elementUntil) { e.elementStatus = null; this.stopStatusBlink(e); }

      if (e.type.attacksTowers) {
        if (!e.attackTarget || !this.towers.includes(e.attackTarget)) {
          e.attackTarget = null;
          for (const t of this.towers) {
            if (Phaser.Math.Distance.Between(e.x, e.y, t.x, t.y) <= WRECKER_ATTACK_RANGE) { e.attackTarget = t; break; }
          }
          if (e.attackTarget && !e.attackWarned) { this.showFloatText(e.x, e.y - 30, 'Крушитель атакует тян!', '#d9553f'); e.attackWarned = true; }
        }
        if (e.attackTarget) {
          e.attackTimer -= delta;
          if (e.attackTimer <= 0) {
            const tower = e.attackTarget;
            tower.hp -= e.type.attackDamage;
            const ratio = Math.max(0, tower.hp / tower.maxHp);
            tower.hpFg.width = 46 * ratio;
            tower.hpFg.fillColor = ratio > 0.5 ? 0x6fbf6f : (ratio > 0.25 ? 0xf0c14b : 0xe6685f);
            this.showFloatText(tower.x, tower.y - 34, '-' + e.type.attackDamage, '#d9553f');
            this.tweens.add({ targets: tower.body, alpha: 0.35, duration: 110, yoyo: true });
            e.attackTimer = e.type.attackRate;
            if (tower.hp <= 0) { this.destroyTower(tower); e.attackTarget = null; }
          }
          continue;
        }
      }

      const isFrozen = time < e.slowUntil && e.slowMult === 0;
      if (isFrozen && !e.frozenVisualSet) { e.body.setTint(0xbfe8ff); e.frozenVisualSet = true; }
      if (!isFrozen && e.frozenVisualSet) { e.body.clearTint(); e.frozenVisualSet = false; }

      const slow = (time < e.slowUntil) ? e.slowMult : 1;
      const target = this.PATH[e.wpIndex];
      if (!target) { this.enemyReachedEnd(e); continue; }
      const dx = target.x - e.x, dy = target.y - e.y;
      const dist = Math.hypot(dx, dy);
      const step = e.speed * slow * dt;
      if (dist <= step) {
        e.x = target.x; e.y = target.y; e.wpIndex += 1;
        if (e.wpIndex >= this.PATH.length) { this.enemyReachedEnd(e); continue; }
      } else { e.x += dx / dist * step; e.y += dy / dist * step; }
      e.body.setPosition(e.x, e.y + Math.sin(time / 260 + e.bobPhase) * Math.min(3, e.radius * 0.18));
      if (e.shadow) e.shadow.setPosition(e.x, e.y + e.radius * 0.7);
      e.hpBg.setPosition(e.x, e.y - e.radius - 8);
      e.hpFg.setPosition(e.x - e.barW / 2, e.y - e.radius - 8);
      if (e.bossRing) e.bossRing.setPosition(e.x, e.y);
      if (e.statusRing) e.statusRing.setPosition(e.x, e.y);
      if (e.statusOverlay) e.statusOverlay.setPosition(e.x, e.y);
      if (e.shieldRing) e.shieldRing.setPosition(e.x, e.y);
    }

    for (const t of this.towers) {
      const speedMult = this.mult.fireRate * (1 + (t.level - 1) * 0.04);
      const effInterval = t.type.fireRate / speedMult;
      if (time - t.lastFired >= effInterval) {
        const target = this.findTarget(t);
        if (target) { this.fireProjectile(t, target); t.lastFired = time; this.attackPulse(t); }
      }
    }

    for (const p of [...this.projectiles]) {
      if (!this.enemies.includes(p.target)) { p.body.destroy(); this.projectiles = this.projectiles.filter(x => x !== p); continue; }
      const dx = p.target.x - p.x, dy = p.target.y - p.y;
      const dist = Math.hypot(dx, dy);
      const step = p.speed * dt;
      if (dist <= step) {
        const effDamage = Math.round(p.type.damage * this.mult.damage * p.lvlDmgMult);
        const effSplash = p.type.splash * this.mult.splash;
        const dealHit = (enemy) => {
          this.applyDamage(enemy, effDamage);
          if (p.type.element) this.applyElementStatus(enemy, p.type.element, effDamage, time);
          if (this.enemies.includes(enemy) && enemy.hp <= 0) this.killEnemy(enemy);
        };
        if (effSplash > 0) {
          for (const e of [...this.enemies]) {
            if (!this.inField(e)) continue;
            const d = Phaser.Math.Distance.Between(p.target.x, p.target.y, e.x, e.y);
            if (d <= effSplash) dealHit(e);
          }
        } else if (this.inField(p.target)) { dealHit(p.target); }
        p.body.destroy();
        this.projectiles = this.projectiles.filter(x => x !== p);
      } else { p.x += dx / dist * step; p.y += dy / dist * step; p.body.setPosition(p.x, p.y); }
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  parent: 'game-container',
  backgroundColor: '#f5f1fa',
  render: { antialias: false, pixelArt: false, roundPixels: false },
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: WIDTH, height: HEIGHT },
  scene: TDScene,
};

let activeGame = null;
let activeScene = null;

function pauseGame() {
  if (activeScene && activeScene.scene.isActive()) activeScene.scene.pause();
  if (activeScene && activeScene.sound) activeScene.sound.pauseAll();
}
function resumeGame() {
  if (activeScene && activeScene.scene.isPaused()) activeScene.scene.resume();
  if (activeScene && activeScene.sound) activeScene.sound.resumeAll();
  Bridge.gameplayStart();
}

if (typeof Bridge !== 'undefined') {
  Bridge.init({ onPause: pauseGame, onResume: resumeGame }).then(() => {
    activeGame = new Phaser.Game(config);
    activeGame.events.once('ready', () => {
      activeScene = activeGame.scene.getScene('TDScene');
      Bridge.gameplayStart();
    });
  });
} else {
  console.warn('Bridge не найден, запускаю игру напрямую без платформенного SDK.');
  activeGame = new Phaser.Game(config);
  activeGame.events.once('ready', () => { activeScene = activeGame.scene.getScene('TDScene'); });
}
