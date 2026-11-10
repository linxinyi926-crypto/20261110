const PLAYER_FRAME_COUNT = 10; // 設定我方 stop 動畫的影格數量為十張。
const RUN_FRAME_COUNT = 6; // 設定我方 run 動畫的影格數量為六張。
const FIGHT_FRAME_COUNT = 10; // 設定我方 fight 動畫的影格數量為十張。
const PLAYER_SPRITE_WIDTH = 1095 / 10; // 依照我方精靈表寬度計算單格角色寬度。
const PLAYER_SPRITE_HEIGHT = 183; // 設定我方單格角色的原始高度。
const RUN_SPRITE_WIDTH = 1063 / 6; // 依照 run 圖片總寬度計算單格角色寬度。
const RUN_SPRITE_HEIGHT = 158; // 設定 run 單格角色的原始高度。
const FIGHT_SPRITE_WIDTH = 2215 / 10; // 依照 fight 圖片總寬度計算單格角色寬度。
const FIGHT_SPRITE_HEIGHT = 125; // 設定 fight 單格角色的原始高度。
const PLAYER_SCALE = 1.5; // 設定我方角色的顯示尺寸放大一點五倍。
const FRAME_INTERVAL = 100; // 設定動畫每隔一百毫秒切換一格。
const PLAYER_SPEED = 5; // 設定我方角色每畫格移動五個像素。
let playerFrames = []; // 建立陣列，用來存放我方的十張 stop 圖片。
let runFrames = []; // 建立陣列，用來存放我方的六張 run 圖片。
let fightFrames = []; // 建立陣列，用來存放我方的十張 fight 圖片。
let playerCenterX; // 宣告變數，用來記錄我方角色中心的水平位置。
let facingDirection = 1; // 設定角色初始面向右方。
let isAttacking = false; // 記錄目前是否正在播放攻擊動作。
let fightStartTime = 0; // 記錄攻擊動畫開始播放的時間。

function preload() { // 在畫布建立前預先載入所有角色圖片。
  for (let frame = 0; frame < PLAYER_FRAME_COUNT; frame++) { // 依序載入我方十張動畫影格。
    playerFrames.push(loadImage(`2/stop/${frame}.png`)); // 載入並保存我方目前這一格圖片。
  } // 結束我方圖片的載入迴圈。
  for (let frame = 0; frame < RUN_FRAME_COUNT; frame++) { // 依序載入我方六張跑步動畫影格。
    runFrames.push(loadImage(`2/run/${frame}.png`)); // 載入並保存我方目前這一格跑步圖片。
  } // 結束跑步圖片的載入迴圈。
  for (let frame = 0; frame < FIGHT_FRAME_COUNT; frame++) { // 依序載入我方十張攻擊動畫影格。
    fightFrames.push(loadImage(`2/fight/${frame}.png`)); // 載入並保存我方目前這一格攻擊圖片。
  } // 結束攻擊圖片的載入迴圈。
} // 結束圖片預載入函式。

function setup() { // 設定全螢幕畫布與圖片繪製模式。
  createCanvas(windowWidth, windowHeight); // 建立符合目前視窗大小的畫布。
  imageMode(CORNER); // 使用圖片左上角作為繪製座標，方便底部對齊。
  playerCenterX = (width * 2) / 3; // 將我方角色初始位置設定在畫面水平位置的三分之二處。
} // 結束畫布初始化函式。

function draw() { // 每一畫格重新繪製背景與動畫角色。
  background(135, 206, 235); // 使用天空藍作為畫布背景顏色。
  const rightPressed = keyIsDown(RIGHT_ARROW); // 檢查目前是否按住鍵盤右方向鍵。
  const leftPressed = keyIsDown(LEFT_ARROW); // 檢查目前是否按住鍵盤左方向鍵。
  const isRunning = rightPressed || leftPressed; // 判斷目前是否正在按住任一方向鍵。
  if (rightPressed && !leftPressed) { // 只按右鍵時往畫面右方移動。
    playerCenterX += PLAYER_SPEED; // 將角色水平位置向右增加。
    facingDirection = 1; // 設定角色面向右方。
  } else if (leftPressed && !rightPressed) { // 只按左鍵時往畫面左方移動。
    playerCenterX -= PLAYER_SPEED; // 將角色水平位置向左減少。
    facingDirection = -1; // 設定角色面向左方。
  } // 結束方向鍵移動判斷。
  const isFighting = isAttacking && millis() - fightStartTime < FIGHT_FRAME_COUNT * FRAME_INTERVAL; // 判斷攻擊動畫是否仍在播放時間內。
  if (isAttacking && !isFighting) { // 攻擊動畫播放完畢時結束攻擊狀態。
    isAttacking = false; // 清除攻擊狀態以便回到跑步或待機動畫。
  } // 結束攻擊動畫完成判斷。
  const basePlayerWidth = isFighting ? FIGHT_SPRITE_WIDTH : isRunning ? RUN_SPRITE_WIDTH : PLAYER_SPRITE_WIDTH; // 依照角色動作選擇原始影格寬度。
  const basePlayerHeight = isFighting ? FIGHT_SPRITE_HEIGHT : isRunning ? RUN_SPRITE_HEIGHT : PLAYER_SPRITE_HEIGHT; // 依照角色動作選擇原始影格高度。
  const playerWidth = basePlayerWidth * PLAYER_SCALE; // 計算我方角色放大後的顯示寬度。
  const playerHeight = basePlayerHeight * PLAYER_SCALE; // 計算我方角色放大後的顯示高度。
  playerCenterX = constrain(playerCenterX, playerWidth / 2, width - playerWidth / 2); // 限制角色移動範圍，避免超出畫布左右邊界。
  const animationFrame = isFighting ? min(floor((millis() - fightStartTime) / FRAME_INTERVAL), FIGHT_FRAME_COUNT - 1) : floor(millis() / FRAME_INTERVAL) % (isRunning ? RUN_FRAME_COUNT : PLAYER_FRAME_COUNT); // 計算攻擊、跑步或待機的目前影格。
  const currentFrame = isFighting ? fightFrames[animationFrame] : isRunning ? runFrames[animationFrame] : playerFrames[animationFrame]; // 依照目前動作選擇要繪製的圖片。
  const playerY = height - playerHeight; // 計算我方角色貼齊畫面底端時的上方座標。
  push(); // 暫存畫布設定以便只翻轉角色圖片。
  translate(playerCenterX, playerY); // 將座標原點移至角色左上方的水平中心位置。
  scale(facingDirection, 1); // 面向左方時水平翻轉角色圖片。
  image(currentFrame, -playerWidth / 2, 0, playerWidth, playerHeight); // 繪製放大並依方向轉向的角色動畫影格。
  pop(); // 還原畫布設定以免影響後續繪製。
} // 結束每畫格繪製函式。

function keyPressed() { // 接收鍵盤按鍵並觸發攻擊動作。
  if (key === ' ' && !isAttacking) { // 按下空白鍵且目前沒有攻擊時開始播放攻擊動畫。
    isAttacking = true; // 設定角色進入攻擊動作狀態。
    fightStartTime = millis(); // 記錄攻擊動畫的起始時間。
  } // 結束空白鍵攻擊判斷。
  if (key === ' ') { // 空白鍵按下時避免頁面執行預設的捲動行為。
    return false; // 阻止瀏覽器因空白鍵而捲動頁面。
  } // 結束空白鍵預設行為處理。
} // 結束鍵盤按鍵處理函式。

function windowResized() { // 在瀏覽器視窗大小改變時更新畫布尺寸。
  resizeCanvas(windowWidth, windowHeight); // 讓畫布持續填滿整個瀏覽器視窗。
} // 結束視窗尺寸更新函式。
