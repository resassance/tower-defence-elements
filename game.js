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

const ELEMENT_COLORS = { hydro: 0x4aa8ff, cryo: 0xbfe8ff, pyro: 0xff7a3f, electro: 0xc9a8ff };
const ELEMENT_ICON = { hydro: '💧', cryo: '❄️', pyro: '🔥', electro: '⚡' };

const TOWER_TYPES = {
  blade:   { key:'blade',   name:'Клинок-тян',  cost:50,  range:150, fireRate:500,  damage:12, color:0xff5f8f, proj:0xffc4d8, splash:0,  element:null },
  cryo:    { key:'cryo',    name:'Крио-тян',    cost:70,  range:130, fireRate:800,  damage:6,  color:0x5fc9ff, proj:0xb8ecff, splash:0,  element:'cryo' },
  bomber:  { key:'bomber',  name:'Бомбер-тян',  cost:100, range:170, fireRate:1200, damage:15, color:0xffb04d, proj:0xffe0a8, splash:70, element:'pyro' },
  hydro:   { key:'hydro',   name:'Гидро-тян',   cost:60,  range:140, fireRate:650,  damage:8,  color:0x4aa8ff, proj:0xa8d8ff, splash:0,  element:'hydro' },
  electro: { key:'electro', name:'Электро-тян', cost:90,  range:150, fireRate:700,  damage:9,  color:0xc9a8ff, proj:0xe0c8ff, splash:0,  element:'electro' },
};

const TOWER_MAX_HP = 150;

const ENEMY_TYPES = {
  grunt:   { name:'Марионетка', hpMult:1,    speedMult:1,    reward:1,   livesCost:1, color:0x8b3fd6, ring:0xd6a8ff, radius:14 },
  runner:  { name:'Рывок',      hpMult:0.5,  speedMult:1.8,  reward:0.8, livesCost:1, color:0xd63f8b, ring:0xffc0dd, radius:11 },
  tank:    { name:'Глыба',      hpMult:3.4,  speedMult:0.6,  reward:1.5, livesCost:2, color:0x4a3488, ring:0x9b82d6, radius:19 },
  wrecker: { name:'Крушитель',  hpMult:1.3,  speedMult:0.85, reward:1.7, livesCost:1, color:0xe6483f, ring:0xffb0a8, radius:15, attacksTowers:true, attackDamage:38, attackRate:850 },
};

const UI_LAYOUT = {
  cardW: 118, cardH: 108, cardGap: 10, cardStartX: 16, cardY: PLAY_H + 20,
  sellBtnX: 674, sellBtnW: 110, sellBtnH: 108, sellBtnY: PLAY_H + 20,
  waveBtnX: 810, waveBtnW: 294, waveBtnH: 60, waveBtnY: PLAY_H + UI_H / 2,
};

function pointSegDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const len2 = dx * dx + dy * dy || 1;
  let t = ((px - ax) * dx + (py - ay) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  const cx = ax + t * dx, cy = ay + t * dy;
  return Math.hypot(px - cx, py - cy);
}

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

class TDScene extends Phaser.Scene {
  create() {
    this.gold = 150;
    this.lives = 15;
    this.wave = 0;
    this.level = 1;
    this.waveInProgress = false;
    this.spawnQueueList = [];
    this.spawnCooldown = 0;
    this.spawnInterval = 650;
    this.nextWaveCountdown = 4000;
    this.pendingLevelTransition = false;
    this.gameOver = false;
    this.sellMode = false;

    this.towers = [];
    this.enemies = [];
    this.projectiles = [];
    this.selectedType = null;

    this.PATH = generatePath();
    this.recomputeBuildable();

    this.levelGfx = null;
    this.drawLevelBackground();
    this.drawStaticUI();
    this.drawTopHud();
    this.drawBottomUI();

    this.rangePreview = this.add.circle(0, 0, 0, 0xffffff, 0.08).setStrokeStyle(1, 0xffffff, 0.4).setVisible(false);

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
      if (this.gameOver) return;
      const col = Math.floor(pointer.x / TILE);
      const row = Math.floor(pointer.y / TILE);
      if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return;
      if (this.sellMode) { this.trySellTower(row, col); return; }
      this.tryPlaceTower(row, col);
    });
  }

  recomputeBuildable() {
    this.buildable = Array.from({ length: ROWS }, () => Array(COLS).fill(true));
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cx = colX(c), cy = rowY(r);
        let minDist = Infinity;
        for (let i = 0; i < this.PATH.length - 1; i++) {
          const d = pointSegDist(cx, cy, this.PATH[i].x, this.PATH[i].y, this.PATH[i + 1].x, this.PATH[i + 1].y);
          if (d < minDist) minDist = d;
        }
        this.buildable[r][c] = minDist > TILE * 0.62;
      }
    }
    this.occupied = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
  }

  drawLevelBackground() {
    if (this.levelGfx) this.levelGfx.destroy();
    const g = this.add.graphics();
    g.fillStyle(0x150c22, 1).fillRect(0, 0, PLAY_W, PLAY_H);
    g.lineStyle(1, 0x2a1b3d, 1);
    for (let c = 0; c <= COLS; c++) g.lineBetween(c * TILE, 0, c * TILE, PLAY_H);
    for (let r = 0; r <= ROWS; r++) g.lineBetween(0, r * TILE, PLAY_W, r * TILE);
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!this.buildable[r][c]) g.fillStyle(0x3a1030, 0.55).fillRect(c * TILE, r * TILE, TILE, TILE);
      }
    }
    g.lineStyle(7, 0x5a3f7a, 1);
    for (let i = 0; i < this.PATH.length - 1; i++) g.lineBetween(this.PATH[i].x, this.PATH[i].y, this.PATH[i + 1].x, this.PATH[i + 1].y);
    g.lineStyle(2, 0x9b6fd6, 1);
    for (let i = 0; i < this.PATH.length - 1; i++) g.lineBetween(this.PATH[i].x, this.PATH[i].y, this.PATH[i + 1].x, this.PATH[i + 1].y);
    g.setDepth(-100);
    this.levelGfx = g;
  }

  drawStaticUI() {
    const g2 = this.add.graphics();
    g2.fillStyle(0x1c1228, 1).fillRect(0, PLAY_H, WIDTH, UI_H);
    g2.lineStyle(2, 0x3a2a55, 1).lineBetween(0, PLAY_H, WIDTH, PLAY_H);
  }

  drawTopHud() {
    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.35).fillRect(0, 0, PLAY_W, 36);
    const style = { fontFamily: 'Arial', fontSize: '17px', color: '#f0e6ff' };
    this.goldText = this.add.text(14, 8, '', style);
    this.livesText = this.add.text(260, 8, '', style);
    this.waveText = this.add.text(460, 8, '', style);
    this.levelText = this.add.text(700, 8, '', style);
  }

  drawBottomUI() {
    this.towerButtons = {};
    const keys = Object.keys(TOWER_TYPES);
    keys.forEach((key, i) => {
      const t = TOWER_TYPES[key];
      const bx = UI_LAYOUT.cardStartX + i * (UI_LAYOUT.cardW + UI_LAYOUT.cardGap);
      const by = UI_LAYOUT.cardY;
      const bw = UI_LAYOUT.cardW, bh = UI_LAYOUT.cardH;

      const rect = this.add.rectangle(bx, by, bw, bh, 0x241735).setOrigin(0, 0).setStrokeStyle(2, 0x4a3468);
      rect.setInteractive({ useHandCursor: true });
      this.add.rectangle(bx + 26, by + 26, 30, 30, t.color).setOrigin(0.5);
      if (t.element) this.add.text(bx + 46, by + 12, ELEMENT_ICON[t.element], { fontSize: '16px' });
      this.add.text(bx + 8, by + 50, t.name, { fontFamily: 'Arial', fontSize: '13px', color: '#f0e6ff' });
      this.add.text(bx + 8, by + 72, '💰 ' + t.cost, { fontFamily: 'Arial', fontSize: '13px', color: '#ffd76a' });

      rect.on('pointerdown', () => {
        this.sellMode = false;
        this.sellButton.setStrokeStyle(2, 0x4a3468);
        this.selectedType = (this.selectedType === key) ? null : key;
        this.refreshButtonHighlight();
      });
      this.towerButtons[key] = rect;
    });

    const sb = this.add.rectangle(UI_LAYOUT.sellBtnX, UI_LAYOUT.sellBtnY, UI_LAYOUT.sellBtnW, UI_LAYOUT.sellBtnH, 0x241735)
      .setOrigin(0, 0).setStrokeStyle(2, 0x4a3468).setInteractive({ useHandCursor: true });
    this.add.text(UI_LAYOUT.sellBtnX + 12, UI_LAYOUT.sellBtnY + 20, '🗑', { fontSize: '30px' });
    this.add.text(UI_LAYOUT.sellBtnX + 12, UI_LAYOUT.sellBtnY + 66, 'Продать\n(60%)', { fontFamily: 'Arial', fontSize: '12px', color: '#f0e6ff' });
    sb.on('pointerdown', () => {
      this.sellMode = !this.sellMode;
      if (this.sellMode) { this.selectedType = null; this.refreshButtonHighlight(); }
      sb.setStrokeStyle(2, this.sellMode ? 0xff6f6f : 0x4a3468);
    });
    this.sellButton = sb;

    const wb = this.add.rectangle(UI_LAYOUT.waveBtnX, UI_LAYOUT.waveBtnY, UI_LAYOUT.waveBtnW, UI_LAYOUT.waveBtnH, 0x3a2a6b)
      .setOrigin(0, 0.5).setStrokeStyle(2, 0x8a6fd6).setInteractive({ useHandCursor: true });
    this.waveButtonText = this.add.text(
      UI_LAYOUT.waveBtnX + UI_LAYOUT.waveBtnW / 2, UI_LAYOUT.waveBtnY, '',
      { fontFamily: 'Arial', fontSize: '16px', color: '#ffffff' }
    ).setOrigin(0.5);
    wb.on('pointerdown', () => { if (!this.waveInProgress) this.startWave(); });
    this.waveButton = wb;

    this.updateUIText();
  }

  refreshButtonHighlight() {
    Object.keys(this.towerButtons).forEach(key => {
      this.towerButtons[key].setStrokeStyle(2, key === this.selectedType ? 0xffe07a : 0x4a3468);
    });
  }

  updateUIText() {
    this.goldText.setText('💰 ' + this.gold);
    this.livesText.setText('❤ ' + this.lives);
    this.waveText.setText('🌊 Волна ' + this.wave);
    this.levelText.setText('🗺 Уровень ' + this.level);
  }

  showFloatText(x, y, text, color) {
    const t = this.add.text(x, y, text, { fontFamily: 'Arial', fontSize: '13px', color }).setOrigin(0.5).setDepth(500);
    this.tweens.add({ targets: t, y: y - 34, alpha: 0, duration: 750, onComplete: () => t.destroy() });
  }

  showBanner(title, subtitle) {
    const t1 = this.add.text(WIDTH / 2, PLAY_H / 2 - 20, title, { fontFamily: 'Arial', fontSize: '42px', color: '#ffe07a' }).setOrigin(0.5).setDepth(1000);
    const targets = [t1];
    let t2 = null;
    if (subtitle) {
      t2 = this.add.text(WIDTH / 2, PLAY_H / 2 + 32, subtitle, { fontFamily: 'Arial', fontSize: '18px', color: '#f0e6ff' }).setOrigin(0.5).setDepth(1000);
      targets.push(t2);
    }
    this.tweens.add({ targets, alpha: { from: 1, to: 0 }, delay: 1500, duration: 900, onComplete: () => targets.forEach(t => t.destroy()) });
  }

  tryPlaceTower(row, col) {
    if (!this.selectedType) return;
    if (!this.buildable[row][col] || this.occupied[row][col]) return;
    const t = TOWER_TYPES[this.selectedType];
    if (this.gold < t.cost) return;

    this.gold -= t.cost;
    this.occupied[row][col] = true;

    const cx = colX(col), cy = rowY(row);
    const body = this.add.rectangle(cx, cy, 46, 46, t.color).setStrokeStyle(2, 0xffffff);
    const hpBg = this.add.rectangle(cx, cy + 30, 34, 5, 0x000000).setOrigin(0.5);
    const hpFg = this.add.rectangle(cx - 17, cy + 30, 34, 5, 0x4ade5a).setOrigin(0, 0.5);
    this.towers.push({
      type: t, x: cx, y: cy, row, col, lastFired: -99999, body,
      hp: TOWER_MAX_HP, maxHp: TOWER_MAX_HP, hpBg, hpFg,
    });
    this.updateUIText();
  }

  trySellTower(row, col) {
    const tower = this.towers.find(t => t.row === row && t.col === col);
    if (!tower) return;
    const refund = Math.floor(tower.type.cost * SELL_REFUND_RATIO);
    this.gold += refund;
    this.showFloatText(tower.x, tower.y - 30, '+' + refund + '💰', '#ffd76a');
    this.destroyTower(tower);
    this.updateUIText();
  }

  destroyTower(tower) {
    tower.body.destroy(); tower.hpBg.destroy(); tower.hpFg.destroy();
    this.occupied[tower.row][tower.col] = false;
    this.towers = this.towers.filter(t => t !== tower);
    for (const e of this.enemies) if (e.attackTarget === tower) e.attackTarget = null;
  }

  composeWave(wave) {
    const count = 6 + Math.floor(wave * 1.4);
    const pool = ['grunt'];
    if (wave >= 3) pool.push('runner');
    if (wave >= 5) pool.push('tank');
    if (wave >= 7) pool.push('wrecker');
    const list = [];
    for (let i = 0; i < count; i++) {
      const key = pool[Phaser.Math.Between(0, pool.length - 1)];
      list.push({ typeKey: key, isBoss: false });
    }
    if (wave % WAVES_PER_LEVEL === 0) list.push({ typeKey: 'tank', isBoss: true });
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
    this.drawLevelBackground();
    this.showBanner('Уровень ' + this.level, refund > 0 ? ('Карта сменилась. Башни проданы: +' + refund + '💰') : 'Карта сменилась');
  }

  startWave() {
    if (this.waveInProgress || this.gameOver) return;
    const nextWaveNum = this.wave + 1;
    if (isTransitionWave(nextWaveNum)) this.transitionLevel(nextWaveNum);
    this.wave = nextWaveNum;
    this.waveInProgress = true;
    this.spawnQueueList = this.composeWave(this.wave);
    this.spawnCooldown = 0;
    this.updateUIText();
  }

  statsFor(typeKey, wave, isBoss) {
    const t = ENEMY_TYPES[typeKey];
    const baseHp = 30 * Math.pow(1.16, wave - 1);
    const baseSpeed = 65 + Math.min(45, wave * 2.5);
    let hp = baseHp * t.hpMult;
    let speed = baseSpeed * t.speedMult;
    let reward = Math.round((5 + Math.floor(wave / 2)) * t.reward);
    let livesCost = t.livesCost;
    if (isBoss) { hp *= 5; speed *= 0.85; reward *= 4; livesCost *= 2; }
    return { hp: Math.round(hp), speed, reward, livesCost };
  }

  spawnEnemy(item) {
    const t = ENEMY_TYPES[item.typeKey];
    const s = this.statsFor(item.typeKey, this.wave, item.isBoss);
    const radius = item.isBoss ? t.radius * 1.7 : t.radius;
    const start = this.PATH[0];
    const body = this.add.circle(start.x, start.y, radius, t.color).setStrokeStyle(item.isBoss ? 3 : 2, item.isBoss ? 0xffe07a : t.ring);
    const barW = radius * 2;
    const hpBg = this.add.rectangle(start.x, start.y - radius - 8, barW, 5, 0x000000).setOrigin(0.5);
    const hpFg = this.add.rectangle(start.x - barW / 2, start.y - radius - 8, barW, 5, 0x4ade5a).setOrigin(0, 0.5);
    this.enemies.push({
      x: start.x, y: start.y, hp: s.hp, maxHp: s.hp, speed: s.speed, reward: s.reward, livesCost: s.livesCost,
      radius, barW, wpIndex: 1, body, hpBg, hpFg, slowMult: 1, slowUntil: 0, frozenVisualSet: false,
      type: t, typeKey: item.typeKey, isBoss: item.isBoss,
      attackTarget: null, attackTimer: 0, attackWarned: false,
      elementStatus: null, elementUntil: 0,
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

  applyDamage(enemy, dmg) {
    enemy.hp -= dmg;
    if (enemy.hp <= 0) return;
    const ratio = Math.max(0, enemy.hp / enemy.maxHp);
    enemy.hpFg.width = enemy.barW * ratio;
    enemy.hpFg.fillColor = ratio > 0.5 ? 0x4ade5a : (ratio > 0.25 ? 0xf5c14b : 0xe6483f);
  }

  dealDamage(enemy, dmg) {
    if (!this.enemies.includes(enemy)) return;
    this.applyDamage(enemy, dmg);
    if (enemy.hp <= 0) this.killEnemy(enemy);
  }

  killEnemy(enemy) {
    this.gold += enemy.reward;
    enemy.body.destroy(); enemy.hpBg.destroy(); enemy.hpFg.destroy();
    this.enemies = this.enemies.filter(e => e !== enemy);
    this.updateUIText();
  }

  enemyReachedEnd(enemy) {
    this.lives -= enemy.livesCost;
    enemy.body.destroy(); enemy.hpBg.destroy(); enemy.hpFg.destroy();
    this.enemies = this.enemies.filter(e => e !== enemy);
    this.updateUIText();
    if (this.lives <= 0) this.triggerGameOver();
  }

  applyElementStatus(enemy, el, baseDamage, time) {
    if (!el || !this.enemies.includes(enemy)) return;
    if (!enemy.elementStatus) {
      enemy.elementStatus = el;
      enemy.elementUntil = time + 3000;
      enemy.body.setStrokeStyle(3, ELEMENT_COLORS[el]);
      if (el === 'cryo') { enemy.slowMult = 0.55; enemy.slowUntil = Math.max(enemy.slowUntil, time + 1200); }
      return;
    }
    if (enemy.elementStatus === el) {
      enemy.elementUntil = time + 3000;
      if (el === 'cryo') { enemy.slowMult = 0.55; enemy.slowUntil = Math.max(enemy.slowUntil, time + 1200); }
      return;
    }
    const oldEl = enemy.elementStatus;
    enemy.elementStatus = null;
    enemy.body.setStrokeStyle(2, enemy.type.ring);
    this.resolveReaction(enemy, oldEl, el, baseDamage, time);
  }

  resolveReaction(enemy, elA, elB, baseDamage, time) {
    const key = [elA, elB].sort().join('_');
    switch (key) {
      case 'cryo_hydro':
        enemy.slowMult = 0; enemy.slowUntil = time + 1600;
        this.showFloatText(enemy.x, enemy.y - 30, 'Заморозка!', '#9fe8ff');
        break;
      case 'hydro_pyro':
        this.dealDamage(enemy, baseDamage);
        this.showFloatText(enemy.x, enemy.y - 30, 'Вскипание x2!', '#ff9a5a');
        break;
      case 'cryo_pyro':
        this.dealDamage(enemy, baseDamage);
        this.showFloatText(enemy.x, enemy.y - 30, 'Плавление x2!', '#ffb347');
        break;
      case 'electro_hydro':
        this.dealDamage(enemy, Math.round(baseDamage * 0.6));
        for (const e2 of [...this.enemies]) {
          if (e2 === enemy) continue;
          const d = Phaser.Math.Distance.Between(enemy.x, enemy.y, e2.x, e2.y);
          if (d <= 90 && e2.elementStatus === 'hydro') this.dealDamage(e2, Math.round(baseDamage * 0.6));
        }
        this.showFloatText(enemy.x, enemy.y - 30, 'Наэлектризовано!', '#c9a8ff');
        break;
      case 'cryo_electro':
        for (const e2 of [...this.enemies]) {
          const d = Phaser.Math.Distance.Between(enemy.x, enemy.y, e2.x, e2.y);
          if (d <= 80) this.dealDamage(e2, Math.round(baseDamage * 0.8));
        }
        this.showFloatText(enemy.x, enemy.y - 30, 'Сверхпроводник!', '#b0a8ff');
        break;
      case 'electro_pyro':
        for (const e2 of [...this.enemies]) {
          const d = Phaser.Math.Distance.Between(enemy.x, enemy.y, e2.x, e2.y);
          if (d <= 110) this.dealDamage(e2, Math.round(baseDamage * 1.3));
        }
        this.showFloatText(enemy.x, enemy.y - 30, 'Перегрузка!', '#ff5f3f');
        break;
    }
  }

  triggerGameOver() {
    this.gameOver = true;
    this.add.rectangle(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 0x000000, 0.75).setDepth(2000);
    this.add.text(WIDTH / 2, HEIGHT / 2 - 40, 'Игра окончена', { fontFamily: 'Arial', fontSize: '36px', color: '#ff6f6f' }).setOrigin(0.5).setDepth(2001);
    this.add.text(WIDTH / 2, HEIGHT / 2, 'Ты продержался до волны ' + this.wave + ' (уровень ' + this.level + ')', { fontFamily: 'Arial', fontSize: '18px', color: '#f0e6ff' }).setOrigin(0.5).setDepth(2001);
    const btn = this.add.rectangle(WIDTH / 2, HEIGHT / 2 + 54, 170, 46, 0x3a2a6b).setStrokeStyle(2, 0x8a6fd6).setInteractive({ useHandCursor: true }).setDepth(2001);
    this.add.text(WIDTH / 2, HEIGHT / 2 + 54, 'Заново', { fontFamily: 'Arial', fontSize: '17px', color: '#ffffff' }).setOrigin(0.5).setDepth(2002);
    btn.on('pointerdown', () => this.scene.restart());
  }

  update(time, delta) {
    if (this.gameOver) return;
    const dt = delta / 1000;

    if (!this.waveInProgress) {
      this.pendingLevelTransition = isTransitionWave(this.wave + 1);
      this.nextWaveCountdown -= delta;
      const sec = Math.max(0, Math.ceil(this.nextWaveCountdown / 1000));
      this.waveButtonText.setText(this.pendingLevelTransition ? ('Новый уровень через ' + sec + 'с') : ('Волна ' + (this.wave + 1) + ' через ' + sec + 'с'));
      if (this.nextWaveCountdown <= 0) this.startWave();
    } else {
      this.waveButtonText.setText('Волна ' + this.wave + ' идёт...');
    }

    if (this.waveInProgress && this.spawnQueueList.length > 0) {
      this.spawnCooldown -= delta;
      if (this.spawnCooldown <= 0) {
        this.spawnEnemy(this.spawnQueueList.shift());
        this.spawnCooldown = this.spawnInterval;
      }
    }
    if (this.waveInProgress && this.spawnQueueList.length === 0 && this.enemies.length === 0) {
      this.waveInProgress = false;
      this.gold += 20 + this.wave * 2;
      this.nextWaveCountdown = isTransitionWave(this.wave + 1) ? 6000 : 3500;
      this.updateUIText();
    }

    for (const e of [...this.enemies]) {
      if (e.elementStatus && time > e.elementUntil) {
        e.elementStatus = null;
        e.body.setStrokeStyle(2, e.type.ring);
      }

      if (e.type.attacksTowers) {
        if (!e.attackTarget || !this.towers.includes(e.attackTarget)) {
          e.attackTarget = null;
          for (const t of this.towers) {
            if (Phaser.Math.Distance.Between(e.x, e.y, t.x, t.y) <= WRECKER_ATTACK_RANGE) { e.attackTarget = t; break; }
          }
          if (e.attackTarget && !e.attackWarned) {
            this.showFloatText(e.x, e.y - 30, 'Крушитель атакует башню!', '#ff8a7a');
            e.attackWarned = true;
          }
        }
        if (e.attackTarget) {
          e.attackTimer -= delta;
          if (e.attackTimer <= 0) {
            const tower = e.attackTarget;
            tower.hp -= e.type.attackDamage;
            const ratio = Math.max(0, tower.hp / tower.maxHp);
            tower.hpFg.width = 34 * ratio;
            tower.hpFg.fillColor = ratio > 0.5 ? 0x4ade5a : (ratio > 0.25 ? 0xf5c14b : 0xe6483f);
            this.showFloatText(tower.x, tower.y - 34, '-' + e.type.attackDamage, '#ff6f6f');
            this.tweens.add({ targets: tower.body, alpha: 0.35, duration: 110, yoyo: true });
            e.attackTimer = e.type.attackRate;
            if (tower.hp <= 0) { this.destroyTower(tower); e.attackTarget = null; }
          }
          continue;
        }
      }

      const isFrozen = time < e.slowUntil && e.slowMult === 0;
      if (isFrozen && !e.frozenVisualSet) { e.body.setFillStyle(0xbfe8ff); e.frozenVisualSet = true; }
      if (!isFrozen && e.frozenVisualSet) { e.body.setFillStyle(e.type.color); e.frozenVisualSet = false; }

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
    }

    for (const t of this.towers) {
      if (time - t.lastFired >= t.type.fireRate) {
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
        const dealHit = (enemy) => {
          this.applyDamage(enemy, p.type.damage);
          if (p.type.element) this.applyElementStatus(enemy, p.type.element, p.type.damage, time);
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
  backgroundColor: '#0d0715',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: WIDTH,
    height: HEIGHT,
  },
  scene: TDScene,
};

new Phaser.Game(config);