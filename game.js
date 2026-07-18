const TILE = 70;
const COLS = 16;
const ROWS = 9;
const PLAY_W = COLS * TILE;
const PLAY_H = ROWS * TILE;
const UI_H = 170;
const WIDTH = PLAY_W;
const HEIGHT = PLAY_H + UI_H;

const colX = c => c * TILE + TILE / 2;
const rowY = r => r * TILE + TILE / 2;

const WAVES_PER_LEVEL = 5;
const WRECKER_ATTACK_RANGE = 100;
const SELL_REFUND_RATIO = 0.6;
const REACTION_COOLDOWN_MS = 1000;
const FREEZE_COOLDOWN_MS = 3000;
const POST_LEVEL_PAUSE_MS = 20000;
const SHIELD_DAMAGE_REDUCTION = 0.15;

const ZONE_PATH_MAX = TILE * 0.5;
const ZONE_BORDER_MAX = TILE * 1.45;
const ZONE_GRASS_MAX = TILE * 3.15;

const PALETTE = {
  sceneBg: 0xf5f1fa,
  tileBorder: 0xffd9ea,
  tileGrass: 0xd9f0ce,
  tileForest: 0xaed6a0,
  pathFill: 0xd6c0ea,
  pathStroke: 0xa98cc9,
  hudBg: 0xffffff,
  panelBg: 0xffffff,
  panelStroke: 0xd9c8ef,
  panelStrokeSelected: 0xffb877,
  overlay: 0x4a3a5c,
  textDark: '#4a3a5c',
  textMuted: '#8a76a8',
  textAccent: '#c97b2e',
};

const ELEMENT_COLORS = { hydro: 0x6fb8f5, cryo: 0xa8e0f5, pyro: 0xff9f6b, electro: 0xc2a3f0 };
const ELEMENT_ICON = { hydro: '💧', cryo: '❄️', pyro: '🔥', electro: '⚡' };

const ASSET_MANIFEST = {
  tiles: {
    border: 'assets/textures/border.png',
    grass:  'assets/textures/grass.png',
    forest: 'assets/textures/forest.png',
  },
  characters: {
    blade:   'assets/characters/blade.png',
    cryo:    'assets/characters/cryo.png',
    bomber:  'assets/characters/bomber.png',
    hydro:   'assets/characters/hydro.png',
    electro: 'assets/characters/electro.png',
  },
  mobs: {
    grunt:    'assets/mobs/grunt.png',
    runner:   'assets/mobs/runner.png',
    shielded: 'assets/mobs/shielded.png',
    wrecker:  'assets/mobs/wrecker.png',
  },
};

const ICON_MANIFEST = {
  elements: {
    hydro:   'assets/icons/elements/hydro.png',
    cryo:    'assets/icons/elements/cryo.png',
    pyro:    'assets/icons/elements/pyro.png',
    electro: 'assets/icons/elements/electro.png',
  },
  themes: {
    swift:    'assets/icons/themes/swift.png',
    armored:  'assets/icons/themes/armored.png',
    standard: 'assets/icons/themes/standard.png',
    swarm:    'assets/icons/themes/swarm.png',
    exotic:   'assets/icons/themes/exotic.png',
  },
  perks: {
    goldrush: 'assets/icons/perks/goldrush.png',
    sharp:    'assets/icons/perks/sharp.png',
    haste:    'assets/icons/perks/haste.png',
    walls:    'assets/icons/perks/walls.png',
    discount: 'assets/icons/perks/discount.png',
    swarm:    'assets/icons/perks/swarm.png',
  },
  ui: {
    sell: 'assets/icons/ui/sell.png',
  },
};

const ICON_EMOJI_FALLBACK = {
  elements: ELEMENT_ICON,
  ui: { sell: '🗑' },
};

const TOWER_TYPES = {
  blade:   { key:'blade',   name:'Клинок-тян',  cost:50,  range:150, fireRate:500,  damage:12, color:0xff8fae, proj:0xffd6e2, splash:0,  element:null },
  cryo:    { key:'cryo',    name:'Крио-тян',    cost:70,  range:130, fireRate:800,  damage:6,  color:0x8fd6ef, proj:0xd8f4ff, splash:0,  element:'cryo' },
  bomber:  { key:'bomber',  name:'Бомбер-тян',  cost:100, range:170, fireRate:1200, damage:15, color:0xffb877, proj:0xffe3c2, splash:70, element:'pyro' },
  hydro:   { key:'hydro',   name:'Гидро-тян',   cost:60,  range:140, fireRate:650,  damage:8,  color:0x7ec8ff, proj:0xd2ecff, splash:0,  element:'hydro' },
  electro: { key:'electro', name:'Электро-тян', cost:90,  range:150, fireRate:700,  damage:9,  color:0xc9aaf5, proj:0xe8dbff, splash:0,  element:'electro' },
};

const TOWER_MAX_HP = 150;

const ENEMY_TYPES = {
  grunt:    { name:'Марионетка', hpMult:1,    speedMult:1,    reward:1,   livesCost:1, color:0xa87fd9, ring:0xd9c2f0, radius:14 },
  runner:   { name:'Рывок',      hpMult:0.5,  speedMult:1.8,  reward:0.8, livesCost:1, color:0xe86fa0, ring:0xffc2dc, radius:11 },
  shielded: { name:'Щитовик',    hpMult:0.5,  speedMult:0.75, reward:1.6, livesCost:2, color:0x7a5fb8, ring:0xb8a8dc, radius:18, hasShield:true },
  wrecker:  { name:'Крушитель',  hpMult:1.3,  speedMult:0.85, reward:1.7, livesCost:1, color:0xe85f52, ring:0xffb0a8, radius:15, attacksTowers:true, attackDamage:10, attackRate:900 },
};

const UI_LAYOUT = {
  cardW: 118, cardH: 108, cardGap: 10, cardStartX: 16, cardY: PLAY_H + 20,
  sellBtnX: 674, sellBtnW: 110, sellBtnH: 108, sellBtnY: PLAY_H + 20,
  waveBtnX: 810, waveBtnW: 294, waveBtnH: 60, waveBtnY: PLAY_H + UI_H / 2,
};

const PERKS = [
  { id:'goldrush',  name:'Золотая жила',    desc:'+40% золота за волны и убийства',            icon:'💰', apply:s=>{ s.mult.gold *= 1.4; } },
  { id:'sharp',     name:'Заточка клинков', desc:'+20% урона всех башен',                        icon:'⚔️', apply:s=>{ s.mult.damage *= 1.2; } },
  { id:'haste',     name:'Прилив сил',      desc:'+20% скорострельности башен',                  icon:'💨', apply:s=>{ s.mult.fireRate *= 1.2; } },
  { id:'walls',     name:'Крепкие стены',   desc:'+60 HP всем новым башням',                     icon:'🛡️', apply:s=>{ s.mult.towerHpBonus += 60; } },
  { id:'discount',  name:'Скидка мастера',  desc:'Башни дешевле на 15%',                         icon:'🏷️', apply:s=>{ s.mult.cost *= 0.85; s.refreshCostLabels(); } },
  { id:'swarm',     name:'Рой вместо силы', desc:'Врагов +30% числом, но у них -25% HP',         icon:'🐝', apply:s=>{ s.mult.enemyCount *= 1.3; s.mult.enemyHp *= 0.75; } },
];

const THEMES = [
  { id:'swift',    name:'Скоростной натиск',    desc:'Волна почти целиком состоит из быстрых Рывков.', icon:'❄️', reactionName:'Заморозка',            reactionKeys:['cryo_hydro'],              buffMult:1.6, enemyBias:{ runner:4, grunt:1 } },
  { id:'armored',  name:'Бронированный рубеж',  desc:'Много Щитовиков с защитным барьером.',            icon:'💥', reactionName:'Перегрузка',            reactionKeys:['electro_pyro'],            buffMult:1.6, enemyBias:{ shielded:4, grunt:1 } },
  { id:'standard', name:'Обычный натиск',       desc:'Стандартная пехота эфириалов.',                   icon:'🔗', reactionName:'Сверхпроводник',        reactionKeys:['cryo_electro'],            buffMult:1.7, enemyBias:{ grunt:5 } },
  { id:'swarm',    name:'Рой мелочи',           desc:'Огромное число слабых, но многочисленных мобов.', icon:'⚡', reactionName:'Наэлектризованность',   reactionKeys:['electro_hydro'],           buffMult:1.8, enemyBias:{ grunt:5, runner:2 }, countMult:1.4, hpMultLevel:0.7 },
  { id:'exotic',   name:'Экзотическая угроза',  desc:'Тяжёлая смешанная волна.',                        icon:'🔥', reactionName:'Вскипание и Плавление', reactionKeys:['hydro_pyro','cryo_pyro'],  buffMult:1.6, enemyBias:{ shielded:2, wrecker:2, grunt:2 } },
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
    if (newRow !== row) {
      row = newRow;
      path.push({ x: colX(col), y: rowY(row) });
    }
  }
  path.push({ x: PLAY_W + 40, y: rowY(row) });
  return path;
}

function isTransitionWave(waveNum) {
  return waveNum > 1 && (waveNum - 1) % WAVES_PER_LEVEL === 0;
}

function pointSegDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const len2 = dx * dx + dy * dy || 1;
  let t = ((px - ax) * dx + (py - ay) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  const cx = ax + t * dx, cy = ay + t * dy;
  return Math.hypot(px - cx, py - cy);
}

class TDScene extends Phaser.Scene {
  preload() {
    this.missingKeys = new Set();
    this.load.on('loaderror', file => this.missingKeys.add(file.key));
    Object.entries(ASSET_MANIFEST).forEach(([group, entries]) => {
      Object.entries(entries).forEach(([name, path]) => this.load.image(group + '_' + name, path));
    });
    Object.entries(ICON_MANIFEST).forEach(([group, entries]) => {
      Object.entries(entries).forEach(([name, path]) => this.load.image('icon_' + group + '_' + name, path));
    });
  }

  create() {
    this.buildPlaceholderTextures();

    this.gold = 150;
    this.lives = 15;
    this.wave = 0;
    this.level = 1;
    this.currentTheme = null;
    this.waveInProgress = false;
    this.spawnQueueList = [];
    this.spawnCooldown = 0;
    this.spawnInterval = 650;
    this.nextWaveCountdown = 4000;
    this.levelTransitionDone = false;
    this.awaitingPerkChoice = false;
    this.gameOver = false;
    this.sellMode = false;

    this.mult = { damage:1, gold:1, fireRate:1, towerHpBonus:0, cost:1, enemyCount:1, enemyHp:1 };

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

    this.rangePreview = this.add.circle(0, 0, 0, 0x8a6fd6, 0.10).setStrokeStyle(1, 0x8a6fd6, 0.5).setVisible(false);

    this.input.on('pointermove', pointer => {
      if (this.selectedType && !this.sellMode && pointer.y < PLAY_H) {
        const t = TOWER_TYPES[this.selectedType];
        this.rangePreview.setPosition(pointer.x, pointer.y).setRadius(t.range).setVisible(true);
      } else {
        this.rangePreview.setVisible(false);
      }
    });

    this.input.on('pointerdown', pointer => {
      if (pointer.y >= PLAY_H) return;
      if (this.gameOver || this.awaitingPerkChoice) return;
      const col = Math.floor(pointer.x / TILE);
      const row = Math.floor(pointer.y / TILE);
      if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return;
      if (this.sellMode) { this.trySellTower(row, col); return; }
      this.tryPlaceTower(row, col);
    });
  }

  txt(x, y, str, style = {}) {
    const merged = Object.assign({ fontFamily: 'Arial', fontSize: '16px', color: PALETTE.textDark, padding: { top: 8, bottom: 8, left: 4, right: 4 } }, style);
    return this.add.text(x, y, str, merged);
  }

  addIcon(x, y, category, name, emojiFallback, size) {
    const key = 'icon_' + category + '_' + name;
    if (this.textures.exists(key) && !this.missingKeys.has(key)) {
      return this.add.image(x, y, key).setDisplaySize(size, size);
    }
    return this.txt(x, y, emojiFallback, { fontSize: Math.round(size * 0.85) + 'px' }).setOrigin(0.5);
  }

  needsPlaceholder(key) {
    return !this.textures.exists(key) || this.missingKeys.has(key);
  }

  buildPlaceholderTextures() {
    const makeTile = (key, color) => {
      if (!this.needsPlaceholder(key)) return;
      const g = this.add.graphics();
      g.fillStyle(color, 1).fillRect(0, 0, TILE, TILE);
      g.lineStyle(1, 0x000000, 0.08).strokeRect(0, 0, TILE, TILE);
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

    makeTile('tiles_border', PALETTE.tileBorder);
    makeTile('tiles_grass', PALETTE.tileGrass);
    makeTile('tiles_forest', PALETTE.tileForest);

    Object.keys(TOWER_TYPES).forEach(key => makeSquare('characters_' + key, TOWER_TYPES[key].color, 46));
    Object.keys(ENEMY_TYPES).forEach(key => makeCircle('mobs_' + key, ENEMY_TYPES[key].color, ENEMY_TYPES[key].ring, ENEMY_TYPES[key].radius * 2));
  }

  zoneAt(r, c) {
    const cx = colX(c), cy = rowY(r);
    let minDist = Infinity;
    for (let i = 0; i < this.PATH.length - 1; i++) {
      const d = pointSegDist(cx, cy, this.PATH[i].x, this.PATH[i].y, this.PATH[i + 1].x, this.PATH[i + 1].y);
      if (d < minDist) minDist = d;
    }
    if (minDist < ZONE_PATH_MAX) return { buildable: false, tex: 'grass' };
    if (minDist < ZONE_BORDER_MAX) return { buildable: true, tex: 'border' };
    if (minDist < ZONE_GRASS_MAX) return { buildable: false, tex: 'grass' };
    return { buildable: false, tex: 'forest' };
  }

  recomputeBuildable() {
    this.buildable = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
    this.tileTex = Array.from({ length: ROWS }, () => Array(COLS).fill('forest'));
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const zone = this.zoneAt(r, c);
        this.buildable[r][c] = zone.buildable;
        this.tileTex[r][c] = zone.tex;
      }
    }
    this.occupied = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
  }

  drawLevelBackground() {
    this.tileImages.forEach(img => img.destroy());
    this.tileImages = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const img = this.add.image(colX(c), rowY(r), 'tiles_' + this.tileTex[r][c]).setDisplaySize(TILE, TILE).setDepth(-100);
        this.tileImages.push(img);
      }
    }
    const g = this.add.graphics().setDepth(-50);
    g.lineStyle(9, PALETTE.pathFill, 0.9);
    for (let i = 0; i < this.PATH.length - 1; i++) g.lineBetween(this.PATH[i].x, this.PATH[i].y, this.PATH[i + 1].x, this.PATH[i + 1].y);
    g.lineStyle(2, PALETTE.pathStroke, 1);
    for (let i = 0; i < this.PATH.length - 1; i++) g.lineBetween(this.PATH[i].x, this.PATH[i].y, this.PATH[i + 1].x, this.PATH[i + 1].y);
    this.tileImages.push(g);
  }

  drawStaticUI() {
    const g2 = this.add.graphics();
    g2.fillStyle(PALETTE.hudBg, 1).fillRect(0, PLAY_H, WIDTH, UI_H);
    g2.lineStyle(2, PALETTE.panelStroke, 1).lineBetween(0, PLAY_H, WIDTH, PLAY_H);
  }

  drawTopHud() {
    const g = this.add.graphics();
    g.fillStyle(0xffffff, 0.75).fillRect(0, 0, PLAY_W, 36);
    const style = { fontFamily: 'Arial', fontSize: '17px', color: PALETTE.textDark };
    this.goldText = this.txt(14, 6, '', style);
    this.livesText = this.txt(230, 6, '', style);
    this.waveText = this.txt(400, 6, '', style);
    this.levelText = this.txt(600, 6, '', style);
    this.themeBuffText = this.txt(790, 7, '', { fontFamily: 'Arial', fontSize: '14px', color: PALETTE.textAccent });
  }

  effectiveCost(key) {
    return Math.max(10, Math.round(TOWER_TYPES[key].cost * this.mult.cost));
  }

  refreshCostLabels() {
    Object.keys(this.costTexts).forEach(key => this.costTexts[key].setText('💰 ' + this.effectiveCost(key)));
  }

  drawCardPanel(gfx, x, y, w, h, highlighted) {
    gfx.clear();
    gfx.fillStyle(PALETTE.panelBg, 1);
    gfx.fillRoundedRect(x, y, w, h, 14);
    gfx.lineStyle(2, highlighted ? PALETTE.panelStrokeSelected : PALETTE.panelStroke, 1);
    gfx.strokeRoundedRect(x, y, w, h, 14);
  }

  drawBottomUI() {
    this.towerButtons = {};
    const keys = Object.keys(TOWER_TYPES);
    keys.forEach((key, i) => {
      const t = TOWER_TYPES[key];
      const bx = UI_LAYOUT.cardStartX + i * (UI_LAYOUT.cardW + UI_LAYOUT.cardGap);
      const by = UI_LAYOUT.cardY;
      const bw = UI_LAYOUT.cardW, bh = UI_LAYOUT.cardH;

      const gfx = this.add.graphics();
      this.drawCardPanel(gfx, bx, by, bw, bh, false);
      const zone = this.add.zone(bx, by, bw, bh).setOrigin(0, 0).setInteractive({ useHandCursor: true });

      this.add.image(bx + bw / 2, by + 30, 'characters_' + key).setDisplaySize(36, 36);
      if (t.element) this.addIcon(bx + bw - 18, by + 14, 'elements', t.element, ELEMENT_ICON[t.element], 18);
      this.txt(bx + bw / 2, by + 56, t.name, { fontFamily: 'Arial', fontSize: '13px', color: PALETTE.textDark }).setOrigin(0.5, 0);
      this.costTexts[key] = this.txt(bx + bw / 2, by + 80, '💰 ' + this.effectiveCost(key), { fontFamily: 'Arial', fontSize: '13px', color: PALETTE.textAccent }).setOrigin(0.5, 0);

      zone.on('pointerdown', () => {
        if (this.awaitingPerkChoice) return;
        this.sellMode = false;
        this.drawCardPanel(this.sellGfx, UI_LAYOUT.sellBtnX, UI_LAYOUT.sellBtnY, UI_LAYOUT.sellBtnW, UI_LAYOUT.sellBtnH, false);
        this.selectedType = (this.selectedType === key) ? null : key;
        this.refreshButtonHighlight();
      });
      this.towerButtons[key] = gfx;
    });

    this.sellGfx = this.add.graphics();
    this.drawCardPanel(this.sellGfx, UI_LAYOUT.sellBtnX, UI_LAYOUT.sellBtnY, UI_LAYOUT.sellBtnW, UI_LAYOUT.sellBtnH, false);
    const sellZone = this.add.zone(UI_LAYOUT.sellBtnX, UI_LAYOUT.sellBtnY, UI_LAYOUT.sellBtnW, UI_LAYOUT.sellBtnH).setOrigin(0, 0).setInteractive({ useHandCursor: true });
    this.addIcon(UI_LAYOUT.sellBtnX + 26, UI_LAYOUT.sellBtnY + 32, 'ui', 'sell', '🗑', 30);
    this.txt(UI_LAYOUT.sellBtnX + 12, UI_LAYOUT.sellBtnY + 66, 'Продать\n(60%)', { fontFamily: 'Arial', fontSize: '12px', color: PALETTE.textDark });
    sellZone.on('pointerdown', () => {
      if (this.awaitingPerkChoice) return;
      this.sellMode = !this.sellMode;
      if (this.sellMode) { this.selectedType = null; this.refreshButtonHighlight(); }
      this.drawCardPanel(this.sellGfx, UI_LAYOUT.sellBtnX, UI_LAYOUT.sellBtnY, UI_LAYOUT.sellBtnW, UI_LAYOUT.sellBtnH, this.sellMode);
    });

    const wbx = UI_LAYOUT.waveBtnX, wby = UI_LAYOUT.waveBtnY - UI_LAYOUT.waveBtnH / 2;
    this.waveGfx = this.add.graphics();
    this.waveGfx.fillStyle(0xe4d8f7, 1).fillRoundedRect(wbx, wby, UI_LAYOUT.waveBtnW, UI_LAYOUT.waveBtnH, 16);
    this.waveGfx.lineStyle(2, 0xb79ae0, 1).strokeRoundedRect(wbx, wby, UI_LAYOUT.waveBtnW, UI_LAYOUT.waveBtnH, 16);
    const waveZone = this.add.zone(wbx, wby, UI_LAYOUT.waveBtnW, UI_LAYOUT.waveBtnH).setOrigin(0, 0).setInteractive({ useHandCursor: true });
    this.waveButtonText = this.txt(UI_LAYOUT.waveBtnX + UI_LAYOUT.waveBtnW / 2, UI_LAYOUT.waveBtnY, '', { fontFamily: 'Arial', fontSize: '16px', color: PALETTE.textDark }).setOrigin(0.5);
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
    this.goldText.setText('💰 ' + this.gold);
    this.livesText.setText('❤ ' + this.lives);
    this.waveText.setText('🌊 ' + this.wave);
    this.levelText.setText('🗺 Ур.' + this.level);
    this.themeBuffText.setText(this.currentTheme ? (this.currentTheme.icon + ' ' + this.currentTheme.reactionName + ' ×' + this.currentTheme.buffMult) : '');
  }

  showFloatText(x, y, text, color) {
    const t = this.txt(x, y, text, { fontFamily: 'Arial', fontSize: '13px', color }).setOrigin(0.5).setDepth(500);
    this.tweens.add({ targets: t, y: y - 34, alpha: 0, duration: 750, onComplete: () => t.destroy() });
  }

  showBanner(title, subtitle) {
    const t1 = this.txt(WIDTH / 2, PLAY_H / 2 - 20, title, { fontFamily: 'Arial', fontSize: '40px', color: PALETTE.textAccent }).setOrigin(0.5).setDepth(1000);
    const targets = [t1];
    if (subtitle) {
      const t2 = this.txt(WIDTH / 2, PLAY_H / 2 + 34, subtitle, { fontFamily: 'Arial', fontSize: '18px', color: PALETTE.textDark, align: 'center', wordWrap: { width: PLAY_W - 160 } }).setOrigin(0.5).setDepth(1000);
      targets.push(t2);
    }
    this.tweens.add({ targets, alpha: { from: 1, to: 0 }, delay: 1500, duration: 900, onComplete: () => targets.forEach(t => t.destroy()) });
  }

  openModalWindow(w, h, depthBase) {
    const overlay = [];
    const dim = this.add.rectangle(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 0x2a2038, 0.45).setDepth(depthBase);
    overlay.push(dim);
    const x = WIDTH / 2 - w / 2, y = PLAY_H / 2 - h / 2;
    const g = this.add.graphics().setDepth(depthBase + 1);
    g.fillStyle(0xfffdfb, 1).fillRoundedRect(x, y, w, h, 22);
    g.lineStyle(3, PALETTE.panelStroke, 1).strokeRoundedRect(x, y, w, h, 22);
    overlay.push(g);
    return { overlay, x, y, w, h };
  }

  showThemeWarning(theme, onDone) {
    const modal = this.openModalWindow(760, 380, 3000);
    const { overlay, x, y, w } = modal;
    const cx = x + w / 2;

    const icon = this.addIcon(cx, y + 66, 'themes', theme.id, theme.icon, 56);
    const title = this.txt(cx, y + 118, 'Тематический уровень: ' + theme.name, { fontFamily: 'Arial', fontSize: '24px', color: PALETTE.textAccent }).setOrigin(0.5).setDepth(3002);
    const desc = this.txt(cx, y + 168, theme.desc, { fontFamily: 'Arial', fontSize: '15px', color: PALETTE.textDark, align: 'center', wordWrap: { width: w - 100 } }).setOrigin(0.5, 0).setDepth(3002);
    const buff = this.txt(cx, y + 232, 'Бафф уровня: ' + theme.reactionName + ' сильнее в ' + theme.buffMult + ' раза', { fontFamily: 'Arial', fontSize: '16px', color: '#3f8fae' }).setOrigin(0.5).setDepth(3002);
    overlay.push(icon, title, desc, buff);

    const bw = 200, bh = 50, bx = cx - bw / 2, by = y + w * 0 + 280;
    const btnG = this.add.graphics().setDepth(3002);
    btnG.fillStyle(0xe4d8f7, 1).fillRoundedRect(bx, by, bw, bh, 14);
    btnG.lineStyle(2, 0xb79ae0, 1).strokeRoundedRect(bx, by, bw, bh, 14);
    const btnZone = this.add.zone(bx, by, bw, bh).setOrigin(0, 0).setInteractive({ useHandCursor: true }).setDepth(3003);
    const btnText = this.txt(cx, by + bh / 2, 'Понятно', { fontFamily: 'Arial', fontSize: '17px', color: PALETTE.textDark }).setOrigin(0.5).setDepth(3003);
    overlay.push(btnG, btnZone, btnText);

    btnZone.on('pointerdown', () => { overlay.forEach(o => o.destroy()); onDone(); });
  }

  showPerkChoice(onDone) {
    const modal = this.openModalWindow(940, 400, 3000);
    const { overlay, x, y, w } = modal;
    const cx = x + w / 2;
    const title = this.txt(cx, y + 40, 'Выбери улучшение', { fontFamily: 'Arial', fontSize: '28px', color: PALETTE.textAccent }).setOrigin(0.5).setDepth(3002);
    overlay.push(title);

    const shuffled = Phaser.Utils.Array.Shuffle([...PERKS]);
    const choices = shuffled.slice(0, 3);
    const cardW = 260, cardH = 240, gap = 30;
    const totalW = choices.length * cardW + (choices.length - 1) * gap;
    const startX = cx - totalW / 2;
    const cardY = y + 90;

    choices.forEach((perk, i) => {
      const bx = startX + i * (cardW + gap);
      const g = this.add.graphics().setDepth(3002);
      g.fillStyle(0xf6f0fb, 1).fillRoundedRect(bx, cardY, cardW, cardH, 16);
      g.lineStyle(2, PALETTE.panelStroke, 1).strokeRoundedRect(bx, cardY, cardW, cardH, 16);
      const zone = this.add.zone(bx, cardY, cardW, cardH).setOrigin(0, 0).setInteractive({ useHandCursor: true }).setDepth(3003);
      const icon = this.addIcon(bx + cardW / 2, cardY + 54, 'perks', perk.id, perk.icon, 46);
      const name = this.txt(bx + cardW / 2, cardY + 108, perk.name, { fontFamily: 'Arial', fontSize: '17px', color: PALETTE.textDark }).setOrigin(0.5).setDepth(3003);
      const desc = this.txt(bx + cardW / 2, cardY + 152, perk.desc, { fontFamily: 'Arial', fontSize: '13px', color: PALETTE.textMuted, align: 'center', wordWrap: { width: cardW - 30 } }).setOrigin(0.5, 0).setDepth(3003);
      overlay.push(g, zone, icon, name, desc);

      zone.on('pointerover', () => { g.clear(); g.fillStyle(0xf6f0fb, 1).fillRoundedRect(bx, cardY, cardW, cardH, 16); g.lineStyle(2, PALETTE.panelStrokeSelected, 1).strokeRoundedRect(bx, cardY, cardW, cardH, 16); });
      zone.on('pointerout', () => { g.clear(); g.fillStyle(0xf6f0fb, 1).fillRoundedRect(bx, cardY, cardW, cardH, 16); g.lineStyle(2, PALETTE.panelStroke, 1).strokeRoundedRect(bx, cardY, cardW, cardH, 16); });
      zone.on('pointerdown', () => {
        perk.apply(this);
        overlay.forEach(o => o.destroy());
        onDone();
      });
    });
  }

  tryPlaceTower(row, col) {
    if (!this.selectedType) return;
    if (!this.buildable[row][col] || this.occupied[row][col]) return;
    const t = TOWER_TYPES[this.selectedType];
    const cost = this.effectiveCost(this.selectedType);
    if (this.gold < cost) return;

    this.gold -= cost;
    this.occupied[row][col] = true;

    const cx = colX(col), cy = rowY(row);
    const outline = this.add.rectangle(cx, cy, 46, 46, 0xffffff, 0).setStrokeStyle(2, 0xffffff, 0.9);
    const body = this.add.image(cx, cy, 'characters_' + this.selectedType).setDisplaySize(46, 46);
    const maxHp = TOWER_MAX_HP + this.mult.towerHpBonus;
    const hpBg = this.add.rectangle(cx, cy + 30, 34, 5, 0xffffff, 0.6).setOrigin(0.5);
    const hpFg = this.add.rectangle(cx - 17, cy + 30, 34, 5, 0x6fbf6f).setOrigin(0, 0.5);
    this.towers.push({ type: t, x: cx, y: cy, row, col, lastFired: -99999, body, outline, hp: maxHp, maxHp, hpBg, hpFg });
    this.updateUIText();
  }

  trySellTower(row, col) {
    const tower = this.towers.find(t => t.row === row && t.col === col);
    if (!tower) return;
    const refund = Math.floor(tower.type.cost * SELL_REFUND_RATIO);
    this.gold += refund;
    this.showFloatText(tower.x, tower.y - 30, '+' + refund + '💰', '#c97b2e');
    this.destroyTower(tower);
    this.updateUIText();
  }

  destroyTower(tower) {
    tower.body.destroy(); tower.outline.destroy(); tower.hpBg.destroy(); tower.hpFg.destroy();
    this.occupied[tower.row][tower.col] = false;
    this.towers = this.towers.filter(t => t !== tower);
    for (const e of this.enemies) if (e.attackTarget === tower) e.attackTarget = null;
  }

  composeWave(wave) {
    const unlocked = ['grunt'];
    if (wave >= 3) unlocked.push('runner');
    if (wave >= 5) unlocked.push('shielded');
    if (wave >= 7) unlocked.push('wrecker');

    let pool = unlocked;
    if (this.currentTheme && this.currentTheme.enemyBias) {
      const biasPool = [];
      Object.entries(this.currentTheme.enemyBias).forEach(([key, weight]) => {
        if (unlocked.includes(key)) for (let i = 0; i < weight; i++) biasPool.push(key);
      });
      if (biasPool.length > 0) pool = biasPool;
    }

    const countMultTheme = (this.currentTheme && this.currentTheme.countMult) || 1;
    const baseCount = 6 + Math.floor(wave * 1.4);
    const count = Math.max(1, Math.round(baseCount * this.mult.enemyCount * countMultTheme));

    const list = [];
    for (let i = 0; i < count; i++) {
      const key = pool[Phaser.Math.Between(0, pool.length - 1)];
      list.push({ typeKey: key, isBoss: false });
    }
    if (wave % WAVES_PER_LEVEL === 0) list.push({ typeKey: 'shielded', isBoss: true });
    return list;
  }

  transitionLevel(nextWaveNum) {
    this.level = Math.ceil(nextWaveNum / WAVES_PER_LEVEL);
    let refund = 0;
    for (const t of [...this.towers]) {
      refund += Math.floor(t.type.cost * SELL_REFUND_RATIO);
      this.destroyTower(t);
    }
    this.gold += refund;
    this.PATH = generatePath();
    this.recomputeBuildable();
    this.currentTheme = this.level >= 2 ? THEMES[(this.level - 2) % THEMES.length] : null;
    this.drawLevelBackground();
    this.showBanner('Уровень ' + this.level, refund > 0 ? ('Карта сменилась. Башни проданы: +' + refund + '💰') : 'Карта сменилась');
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
      const goToPerks = () => {
        this.showPerkChoice(() => {
          this.awaitingPerkChoice = false;
          this.nextWaveCountdown = POST_LEVEL_PAUSE_MS;
        });
      };
      if (this.currentTheme) this.showThemeWarning(this.currentTheme, goToPerks);
      else goToPerks();
      return;
    }
    this.levelTransitionDone = false;
    this.actuallyStartWave(nextWaveNum);
  }

  statsFor(typeKey, wave, isBoss) {
    const t = ENEMY_TYPES[typeKey];
    const baseHp = 30 * Math.pow(1.16, wave - 1);
    const baseSpeed = 65 + Math.min(45, wave * 2.5);
    const themeHpMult = (this.currentTheme && this.currentTheme.hpMultLevel) || 1;
    let hp = baseHp * t.hpMult * this.mult.enemyHp * themeHpMult;
    let speed = baseSpeed * t.speedMult;
    let reward = Math.round((5 + Math.floor(wave / 2)) * t.reward * this.mult.gold);
    let livesCost = t.livesCost;
    if (isBoss) { hp *= 5; speed *= 0.85; reward *= 4; livesCost *= 2; }
    return { hp: Math.round(hp), speed, reward, livesCost };
  }

  spawnEnemy(item) {
    const t = ENEMY_TYPES[item.typeKey];
    const s = this.statsFor(item.typeKey, this.wave, item.isBoss);
    const radius = item.isBoss ? t.radius * 1.7 : t.radius;
    const start = this.PATH[0];
    const body = this.add.image(start.x, start.y, 'mobs_' + item.typeKey).setDisplaySize(radius * 2, radius * 2);
    const barW = radius * 2;
    const hpBg = this.add.rectangle(start.x, start.y - radius - 8, barW, 5, 0xffffff, 0.6).setOrigin(0.5);
    const hpFg = this.add.rectangle(start.x - barW / 2, start.y - radius - 8, barW, 5, 0x6fbf6f).setOrigin(0, 0.5);
    const bossRing = item.isBoss ? this.add.circle(start.x, start.y, radius + 5, 0xffffff, 0).setStrokeStyle(3, 0xf0b429) : null;
    const statusRing = this.add.circle(start.x, start.y, radius + 4, 0xffffff, 0).setStrokeStyle(3, 0xffffff).setVisible(false);
    const shieldRing = t.hasShield ? this.add.circle(start.x, start.y, radius + 7, 0xffffff, 0.12).setStrokeStyle(3, 0xd6cbe8) : null;

    this.enemies.push({
      x: start.x, y: start.y, hp: s.hp, maxHp: s.hp, speed: s.speed, reward: s.reward, livesCost: s.livesCost,
      radius, barW, wpIndex: 1, body, hpBg, hpFg, bossRing, statusRing, shieldRing,
      slowMult: 1, slowUntil: 0, frozenVisualSet: false,
      type: t, typeKey: item.typeKey, isBoss: item.isBoss,
      attackTarget: null, attackTimer: 0, attackWarned: false,
      elementStatus: null, elementUntil: 0, lastReactionTime: -Infinity, lastFreezeTime: -Infinity,
      shieldActive: !!t.hasShield,
    });
  }

  findTarget(tower) {
    let best = null, bestProgress = -1;
    for (const e of this.enemies) {
      const d = Phaser.Math.Distance.Between(tower.x, tower.y, e.x, e.y);
      if (d <= tower.type.range && e.wpIndex > bestProgress) { bestProgress = e.wpIndex; best = e; }
    }
    return best;
  }

  fireProjectile(tower, target) {
    const p = this.add.circle(tower.x, tower.y, 5, tower.type.proj);
    this.projectiles.push({ x: tower.x, y: tower.y, target, type: tower.type, body: p, speed: 420 });
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
    enemy.body.destroy(); enemy.hpBg.destroy(); enemy.hpFg.destroy();
    if (enemy.bossRing) enemy.bossRing.destroy();
    if (enemy.statusRing) enemy.statusRing.destroy();
    if (enemy.shieldRing) enemy.shieldRing.destroy();
  }

  killEnemy(enemy) {
    this.gold += enemy.reward;
    this.destroyEnemyVisuals(enemy);
    this.enemies = this.enemies.filter(e => e !== enemy);
    this.updateUIText();
  }

  enemyReachedEnd(enemy) {
    this.lives -= enemy.livesCost;
    this.destroyEnemyVisuals(enemy);
    this.enemies = this.enemies.filter(e => e !== enemy);
    this.updateUIText();
    if (this.lives <= 0) this.triggerGameOver();
  }

  applyElementStatus(enemy, el, baseDamage, time) {
    if (!el || !this.enemies.includes(enemy)) return;

    if (!enemy.elementStatus) {
      enemy.elementStatus = el;
      enemy.elementUntil = time + 3000;
      enemy.statusRing.setStrokeStyle(3, ELEMENT_COLORS[el]).setVisible(true);
      if (el === 'cryo') { enemy.slowMult = 0.55; enemy.slowUntil = Math.max(enemy.slowUntil, time + 1200); }
      return;
    }
    if (enemy.elementStatus === el) {
      enemy.elementUntil = time + 3000;
      if (el === 'cryo') { enemy.slowMult = 0.55; enemy.slowUntil = Math.max(enemy.slowUntil, time + 1200); }
      return;
    }

    const oldEl = enemy.elementStatus;

    if (time - enemy.lastReactionTime < REACTION_COOLDOWN_MS) {
      enemy.elementStatus = el;
      enemy.elementUntil = time + 3000;
      enemy.statusRing.setStrokeStyle(3, ELEMENT_COLORS[el]).setVisible(true);
      return;
    }

    enemy.elementStatus = null;
    enemy.statusRing.setVisible(false);
    enemy.lastReactionTime = time;
    this.resolveReaction(enemy, oldEl, el, baseDamage, time);
  }

  resolveReaction(enemy, elA, elB, baseDamage, time) {
    const key = [elA, elB].sort().join('_');
    const themed = !!(this.currentTheme && this.currentTheme.reactionKeys.includes(key));
    const buff = themed ? this.currentTheme.buffMult : 1;

    switch (key) {
      case 'cryo_hydro':
        if (themed) {
          const radius = 100;
          for (const e2 of [...this.enemies]) {
            const d = Phaser.Math.Distance.Between(enemy.x, enemy.y, e2.x, e2.y);
            if (d <= radius) { e2.slowMult = 0; e2.slowUntil = time + 1600 * buff; e2.lastFreezeTime = time; }
          }
          this.showFloatText(enemy.x, enemy.y - 30, 'Ледяной взрыв!', '#3f8fae');
        } else if (time - enemy.lastFreezeTime >= FREEZE_COOLDOWN_MS) {
          enemy.slowMult = 0; enemy.slowUntil = time + 1600; enemy.lastFreezeTime = time;
          this.showFloatText(enemy.x, enemy.y - 30, 'Заморозка!', '#3f8fae');
        } else {
          enemy.slowMult = 0.55; enemy.slowUntil = Math.max(enemy.slowUntil, time + 1000);
          this.showFloatText(enemy.x, enemy.y - 30, 'Заморозка на КД', '#7fa8c0');
        }
        break;
      case 'hydro_pyro':
        this.dealDamage(enemy, Math.round(baseDamage * buff));
        this.showFloatText(enemy.x, enemy.y - 30, 'Вскипание!', '#e08040');
        break;
      case 'cryo_pyro':
        this.dealDamage(enemy, Math.round(baseDamage * buff));
        this.showFloatText(enemy.x, enemy.y - 30, 'Плавление!', '#e0973f');
        break;
      case 'electro_hydro':
        this.dealDamage(enemy, Math.round(baseDamage * 0.6 * buff));
        for (const e2 of [...this.enemies]) {
          if (e2 === enemy) continue;
          const d = Phaser.Math.Distance.Between(enemy.x, enemy.y, e2.x, e2.y);
          if (d <= 90 && e2.elementStatus === 'hydro') this.dealDamage(e2, Math.round(baseDamage * 0.6 * buff));
        }
        this.showFloatText(enemy.x, enemy.y - 30, 'Наэлектризовано!', '#8a6fc9');
        break;
      case 'cryo_electro':
        for (const e2 of [...this.enemies]) {
          const d = Phaser.Math.Distance.Between(enemy.x, enemy.y, e2.x, e2.y);
          if (d <= 80) this.dealDamage(e2, Math.round(baseDamage * 0.8 * buff), true);
        }
        this.showFloatText(enemy.x, enemy.y - 30, 'Сверхпроводник!', '#8a6fc9');
        break;
      case 'electro_pyro':
        for (const e2 of [...this.enemies]) {
          const d = Phaser.Math.Distance.Between(enemy.x, enemy.y, e2.x, e2.y);
          if (d <= 110) this.dealDamage(e2, Math.round(baseDamage * 1.3 * buff), true);
        }
        this.showFloatText(enemy.x, enemy.y - 30, 'Перегрузка!', '#d9553f');
        break;
    }
  }

  triggerGameOver() {
    this.gameOver = true;
    this.add.rectangle(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 0x2a2038, 0.55).setDepth(4000);
    const w = 420, h = 220, x = WIDTH / 2 - w / 2, y = HEIGHT / 2 - h / 2;
    const g = this.add.graphics().setDepth(4001);
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

  update(time, delta) {
    if (this.gameOver) return;
    const dt = delta / 1000;

    if (this.awaitingPerkChoice) {
      this.waveButtonText.setText('Выбери улучшение...');
    } else if (!this.waveInProgress) {
      this.nextWaveCountdown -= delta;
      const sec = Math.max(0, Math.ceil(this.nextWaveCountdown / 1000));
      const nextIsTransition = isTransitionWave(this.wave + 1) && !this.levelTransitionDone;
      this.waveButtonText.setText(nextIsTransition ? ('Новый уровень через ' + sec + 'с') : ('Волна ' + (this.wave + 1) + ' через ' + sec + 'с'));
      if (this.nextWaveCountdown <= 0) this.startWave();
    } else {
      this.waveButtonText.setText('Волна ' + this.wave + ' идёт...');
    }

    if (this.awaitingPerkChoice) return;

    if (this.waveInProgress && this.spawnQueueList.length > 0) {
      this.spawnCooldown -= delta;
      if (this.spawnCooldown <= 0) {
        this.spawnEnemy(this.spawnQueueList.shift());
        this.spawnCooldown = this.spawnInterval;
      }
    }
    if (this.waveInProgress && this.spawnQueueList.length === 0 && this.enemies.length === 0) {
      this.waveInProgress = false;
      this.gold += Math.round((20 + this.wave * 2) * this.mult.gold);
      this.nextWaveCountdown = isTransitionWave(this.wave + 1) ? 1500 : 3500;
      this.updateUIText();
    }

    for (const e of [...this.enemies]) {
      if (e.elementStatus && time > e.elementUntil) { e.elementStatus = null; e.statusRing.setVisible(false); }

      if (e.type.attacksTowers) {
        if (!e.attackTarget || !this.towers.includes(e.attackTarget)) {
          e.attackTarget = null;
          for (const t of this.towers) {
            if (Phaser.Math.Distance.Between(e.x, e.y, t.x, t.y) <= WRECKER_ATTACK_RANGE) { e.attackTarget = t; break; }
          }
          if (e.attackTarget && !e.attackWarned) { this.showFloatText(e.x, e.y - 30, 'Крушитель атакует башню!', '#d9553f'); e.attackWarned = true; }
        }
        if (e.attackTarget) {
          e.attackTimer -= delta;
          if (e.attackTimer <= 0) {
            const tower = e.attackTarget;
            tower.hp -= e.type.attackDamage;
            const ratio = Math.max(0, tower.hp / tower.maxHp);
            tower.hpFg.width = 34 * ratio;
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
      } else {
        e.x += dx / dist * step; e.y += dy / dist * step;
      }
      e.body.setPosition(e.x, e.y);
      e.hpBg.setPosition(e.x, e.y - e.radius - 8);
      e.hpFg.setPosition(e.x - e.barW / 2, e.y - e.radius - 8);
      if (e.bossRing) e.bossRing.setPosition(e.x, e.y);
      if (e.statusRing) e.statusRing.setPosition(e.x, e.y);
      if (e.shieldRing) e.shieldRing.setPosition(e.x, e.y);
    }

    for (const t of this.towers) {
      const effInterval = t.type.fireRate / this.mult.fireRate;
      if (time - t.lastFired >= effInterval) {
        const target = this.findTarget(t);
        if (target) { this.fireProjectile(t, target); t.lastFired = time; }
      }
    }

    for (const p of [...this.projectiles]) {
      if (!this.enemies.includes(p.target)) {
        p.body.destroy();
        this.projectiles = this.projectiles.filter(x => x !== p);
        continue;
      }
      const dx = p.target.x - p.x, dy = p.target.y - p.y;
      const dist = Math.hypot(dx, dy);
      const step = p.speed * dt;
      if (dist <= step) {
        const effDamage = Math.round(p.type.damage * this.mult.damage);
        const dealHit = (enemy) => {
          this.applyDamage(enemy, effDamage);
          if (p.type.element) this.applyElementStatus(enemy, p.type.element, effDamage, time);
          if (this.enemies.includes(enemy) && enemy.hp <= 0) this.killEnemy(enemy);
        };
        if (p.type.splash > 0) {
          for (const e of [...this.enemies]) {
            const d = Phaser.Math.Distance.Between(p.target.x, p.target.y, e.x, e.y);
            if (d <= p.type.splash) dealHit(e);
          }
        } else {
          dealHit(p.target);
        }
        p.body.destroy();
        this.projectiles = this.projectiles.filter(x => x !== p);
      } else {
        p.x += dx / dist * step; p.y += dy / dist * step;
        p.body.setPosition(p.x, p.y);
      }
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  parent: 'game-container',
  backgroundColor: '#f5f1fa',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: WIDTH,
    height: HEIGHT,
  },
  scene: TDScene,
};

new Phaser.Game(config);
