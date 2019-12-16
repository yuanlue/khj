import Phaser from 'phaser';
// import $ from 'jquery';

// window.$ = $;
// var radio = screen.width*2 / 750
var radio = $(window).height()*2 / 1448
var wradio = screen.width*2 / 750
if( $(window).height()*2 > 1448){
  radio = 1;
}

// obj用于全局挂载对象

document.addEventListener('DOMContentLoaded', () => {
  // var game = new Phaser.Game(up_height, up_width, Phaser.AUTO, 'game');

   game = new Phaser.Game({
    type: Phaser.AUTO,
    banner: false,
    parent: 'game-wrap',
    dom: { createContainer: true },
    width: $(window).width()*2,
    height: $(window).height()*2,
    backgroundColor: 0xFF7C60,
    scale: {
      mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [LoadScene, GameScene, PassScene, OverScene]
  });
  // game.config.backgroundColor = '#FFFFFF'
  // game.stage.backgroundColor = "#ffffff"
  gameConfig = {
    cX: game.config.width / 2,
    cY: game.config.height / 2,
    cW: game.config.width,
    cH: game.config.height,
    gameover: false,
    isInit: true,
    handleRnd: () => Phaser.Math.FloatBetween(0.01, 0.05),
    speed: 1,
    limitSpeed: 6, 
    speedStep: 0.02,
    minBothAngle: 15,
    initY: game.config.height - 88,
    diffTime: 300,
    blood: 3,
    countdown: 30
  };
});

// 加载场景
class LoadScene extends Phaser.Scene {
  constructor() {
    super('loadScene');
  }

  preload() {
    // 初始化游戏参数
    obj = { ...gameConfig };
    this.load.setCORS('anonymous')
   

    // console.log(this.scene.backgroundColor = "#ffffff")
    this.load.image('bg', 'http://cdn.yskj.howlab.cn/images/vanke/kh/bg.png?3');
    this.load.image('gamepass', 'http://cdn.yskj.howlab.cn/images/vanke/kh/gamepass.png');
    this.load.image('pre_img','http://cdn.yskj.howlab.cn/images/vanke/kh/pre_img.png');
    this.load.image('bottom','http://cdn.yskj.howlab.cn/images/vanke/kh/bottom.png?1');
    this.load.image('suc','http://cdn.yskj.howlab.cn/images/vanke/kh/suc.png');
    this.load.image('fail','http://cdn.yskj.howlab.cn/images/vanke/kh/fail.png');

    this.load.image('over','http://cdn.yskj.howlab.cn/images/vanke/kh/over.png');
    this.load.image('logo','http://cdn.yskj.howlab.cn/images/vanke/kh/logo.png?1');
    this.load.image('over_icon','http://cdn.yskj.howlab.cn/images/vanke/kh/over_icon.png');

    this.load.image('player','http://cdn.yskj.howlab.cn/images/vanke/kh/player.png');
    this.load.image('start','http://cdn.yskj.howlab.cn/images/vanke/kh/start.png');
    this.load.image('target','http://cdn.yskj.howlab.cn/images/vanke/kh/target1.png');
    this.load.image('black','http://cdn.yskj.howlab.cn/images/vanke/kh/black.jpg');
    this.load.image('oneg','http://cdn.yskj.howlab.cn/images/vanke/kh/1.png');
    this.load.image('twog','http://cdn.yskj.howlab.cn/images/vanke/kh/2.png');
    this.load.image('threeg','http://cdn.yskj.howlab.cn/images/vanke/kh/3.png');
    this.load.image('btn2','http://cdn.yskj.howlab.cn/images/vanke/kh/btn2.png');
    this.load.image('btn3','http://cdn.yskj.howlab.cn/images/vanke/kh/btn3.png');

    this.load.image('confirm','http://cdn.yskj.howlab.cn/images/vanke/kh/confirm.png');
    this.load.image('confirm2','http://cdn.yskj.howlab.cn/images/vanke/kh/confirm2.png');
    this.load.image('confirm3','http://cdn.yskj.howlab.cn/images/vanke/kh/confirm3.png');

    this.load.spritesheet('blood','http://cdn.yskj.howlab.cn/images/vanke/kh/blood.png', { frameWidth: 53, frameHeight: 49 });
    this.load.spritesheet('btn','http://cdn.yskj.howlab.cn/images/vanke/kh/btn.png', { frameWidth: 273, frameHeight: 83 });
    this.load.spritesheet('clip','http://cdn.yskj.howlab.cn/images/vanke/kh/clip1.png', { frameWidth: 99, frameHeight: 60 });
   
    // this.load.spritesheet('target','http://cdn.yskj.howlab.cn/images/vanke/kh/target1.png'), { frameWidth: 230, frameHeight: 230 });

    this.load.bitmapFont('flappyFont', 'http://cdn.yskj.howlab.cn/images/vanke/kh/fonts/flappy.png', 'http://cdn.yskj.howlab.cn/images/vanke/kh/fonts/flappy.fnt');

    this.load.audio('bgm', 'http://cdn.yskj.howlab.cn/images/vanke/kh/audio/bgm.mp3');

    this.load.audio('brokenAudio', 'http://cdn.yskj.howlab.cn/images/vanke/kh/audio/broken.mp3');
    this.load.audio('collideAudio', 'http://cdn.yskj.howlab.cn/images/vanke/kh/audio/collide.mp3');
    this.load.audio('throwAudio', 'http://cdn.yskj.howlab.cn/images/vanke/kh/audio/throw.mp3');

    // 加载进度
    // let loadText = this.add.text(obj.cX, obj.cY, ['0%', 'Loading'], { font: '28px arial', align: 'center' }).setOrigin(0.5);
    // let loadingImg = this.add.sprite(obj.cX,obj.cY, 'target');
    this.load.on('progress', (res) => {
      // var loadingImg = this.add.sprite(obj.cX,obj.cY, 'target');
      $('.progress_l span').width(`${parseInt(res * 100)}%`)
      // loadText.setText([`${parseInt(res * 100)}%`, 'Loading'])
    });

    this.load.on('complete', () => {
      $('.loading').hide()
      var com = 1;
      var t= this
          
    
        var bg = this.add.sprite(obj.cX, obj.cY, 'bg');
      console.log(bg)
      bg.scale = wradio
      var pre_img = this.add.sprite(0,0, 'pre_img');
      pre_img.x = obj.cX 
      pre_img.y = 220*radio + pre_img.height/2
      pre_img.setScale(0.8 * radio)

      this.tweens.add({
        targets: [pre_img],
        scale:radio,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeOut',
        duration: 600,
        onComplete: () => {
          
        }
      });
      var logo = this.add.sprite(108, 48*wradio, 'logo');
      logo.setScale(radio)
      // var bottom = this.add.sprite(obj.cX, obj.cH - 40, 'bottom');

      // 添加开始游戏按钮和事件
      let btn = this.add.sprite(obj.cX, 422*radio, 'start', 0).setInteractive();
      btn.setScale(radio)
      var t = this

      btn.on('pointerdown', () => {        
       if(is_success == 0){
         //未通关
         t.scene.start('gameScene');

       }else{
         //已通关
        t.scene.start('gameScene');

       }
       
      })
      btn.y = game.config.height - btn.height/2 - 90

      
      
     
      // let btn = this.add.sprite(obj.cX, 422, 'btn', 0).setInteractive();
      // btn.on('pointerdown', () => this.scene.start('gameScene'));
    });
  }
}

// 游戏场景
class GameScene extends Phaser.Scene {
  constructor() {
    super('gameScene');
  }

  create() {
    // 初始化游戏参数
    obj = { ...gameConfig };

    // 添加背景
    // this.add.sprite(obj.cX, obj.cY, 'bg');
    // 添加血
    console.log( gameArchive.level)
   
   
   console.log(this.bgm)
    var bg = this.add.sprite(obj.cX, obj.cY, 'bg');
    bg.scale = wradio
    this._bloods = this.add.group();
    [...''.padEnd(obj.blood)].forEach((item, index) => {
      let which = Number(index >= gameArchive.blood);
      this._bloods.create(index * 73 + 20, 20, 'blood', which).setOrigin(0);
    });

    // 添加倒计时
    this._countdownText = this.add.bitmapText(obj.cW - 20, 20, 'flappyFont', obj.countdown, 60).setOrigin(1, 0);

    // 添加clip
    var num 
    if(gameArchive.level == 1 &&  gameArchive.blood == 3){
      num = 6
      this.bgm = this.sound.add('bgm');

      if(!this.bgm.isPlaying){
        this.bgm.setLoop(true)
        this.bgm.play()
       
      }
    } 
    if(gameArchive.level == 1){
      num = 6
    }
    if(gameArchive.level == 2){
      num = 10
    }
    if(gameArchive.level == 3){
      num = 14
    }
    this._clips = this.add.group();
    console.log(num);
    [...''.padEnd(num)].forEach((item, index) => this._clips.create(obj.cW - 20, obj.cH - 20 - index * 34, 'clip', 0).setOrigin(1));
    let items = this._clips.getChildren();
    console.log(items)
    items.forEach((item)=>{
      item.setFrame(1);
    })
   
    // 添加target
    let which = gameArchive.level - 1;
    this._target = this.add.sprite(obj.cX, 440*radio , 'target')
    this._target.setScale(wradio)
    this._target.setDepth(3)
    // this._targetLeft = this.add.sprite(obj.cX - 55, 220, 'target-left', which).setVisible(false);
    // this._targetRight = this.add.sprite(obj.cX + 55, 220, 'target-right', which).setVisible(false);

    // 创建player池
    this._players = this.add.group();
    // 添加player
    this._player = this.add.sprite(obj.cX, obj.initY, 'player');
    this._player.setScale(wradio)
    //弹窗

    this.black = this.add.sprite(0, 0, 'black').setInteractive()
    this.black.scaleX = 750
    this.black.scaleY = 6
    this.black.setDepth(5)
    this.black.alpha = 0.8
    this.black.setVisible(false)
    this.confirm = this.add.sprite(obj.cX, obj.cH-this._player.height - 50, 'confirm');
    this.confirm.setDepth(6)
    this.confirm.setVisible(false)
    this.confirm2 = this.add.sprite(obj.cX, obj.cH-this._player.height - 50, 'confirm2');
    this.confirm2.setDepth(6)
    this.confirm2.setVisible(false)
    this.confirm3 = this.add.sprite(obj.cX, obj.cH-this._player.height - 50, 'confirm3');
    this.confirm3.setDepth(6)
    this.confirm3.setVisible(false)
    this.oneg = this.add.sprite(obj.cX, obj.cY-200, 'oneg');
    this.oneg.setDepth(5)
    this.oneg.setVisible(false)
    /**
     * 第一关文字
     */
    let oneText = this.add.text(obj.cX, obj.cY+40, ['万科·翡翠国宾 提示您','连闯三关即可获得万科为您准备的大牌口红'], 
    { font: '24px arial', align: 'center',
    shadowColor:"#F7B500",
    shadowFill:"#F7B500",shadowOffsetX:10,shadowOffsetY:10,shadowStroke:true, }).setOrigin(0.5);
    oneText.setLineSpacing(20)
    oneText.setDepth(5)
    oneText.setVisible(false)
    //第二关
    if(gameArchive.level == 1){
      this.oneg = this.add.sprite(obj.cX, obj.cY-200, 'oneg');
      this.oneg.setDepth(5)
      this.oneg.setVisible(true)
      this.scene.pause()
      oneText.setVisible(true)
      this.black.setVisible(true)
      setTimeout(() => {
        this.scene.resume()
        oneText.setVisible(false)
        this.oneg.setVisible(false)
        this.black.setVisible(false)
        if(ts){
          this.scene.pause();
          $('.opa').show()
          this.black.setVisible(true)
          this.confirm.setVisible(true)
      
      }
      }, 3000);
    }
    var t = this
    $('.opa').click(function(){
      console.log(ts)
      if(ts){
        if(t.confirm.visible == true){
          t.confirm.setVisible(false)
          t.confirm2.setVisible(true)
        }else if(t.confirm2.visible == true){
          t.confirm2.setVisible(false)
          t.confirm3.setVisible(true)
        }else if(t.confirm3.visible == true){
          t.scene.resume()
           $('.opa').hide()
          ts = false
          t.oneg.setVisible(false)
          t.confirm3.setVisible(false)
          t.black.setVisible(false)
        }
      }
    })
    //第三关
    if(gameArchive.level == 2){
      var twoText = this.add.text(obj.cX, obj.cY+40, ['万科·金域华府(咸阳) 提示您','您已成功闯过第一关','来万科城市展厅，嗨玩更多'], 
      { font: '24px arial', align: 'center',
      shadowColor:"#F7B500",
      shadowFill:"#F7B500",shadowOffsetX:10,shadowOffsetY:10,shadowStroke:true, }).setOrigin(0.5);
      twoText.setLineSpacing(20)
      twoText.setDepth(5)
      twoText.setVisible(false)
      this.twog = this.add.sprite(obj.cX, obj.cY-200, 'twog');
      this.twog.setDepth(5)
      this.twog.setVisible(true)
      this.scene.pause()
      twoText.setVisible(true)
      this.black.setVisible(true)
      setTimeout(() => {
        this.scene.resume()
        twoText.setVisible(false)
        this.twog.setVisible(false)
        this.black.setVisible(false)
      }, 3000);
    }
    if(gameArchive.level == 3){
      var threeText = this.add.text(obj.cX, obj.cY+40, ['万科·金域国际 提示您','最后一关，相信你的实力','来金域国际，拿更多现场福利'], 
      { font: '24px arial', align: 'center',
      shadowColor:"#F7B500",
      shadowFill:"#F7B500",shadowOffsetX:10,shadowOffsetY:10,shadowStroke:true, }).setOrigin(0.5);
      threeText.setLineSpacing(20)
      threeText.setDepth(5)
      threeText.setVisible(false)
      this.threeg = this.add.sprite(obj.cX, obj.cY-200, 'threeg');
      this.threeg.setDepth(5)
      this.threeg.setVisible(true)
      this.scene.pause()
      threeText.setVisible(true)
      this.black.setVisible(true)
      setTimeout(() => {
        this.scene.resume()
        threeText.setVisible(false)
        this.threeg.setVisible(false)
        this.black.setVisible(false)
      }, 3000);
    }
 
    /**
     * 文字结束
     */

    // 最后一次触发时间
    this._lastTime = 0;

    // 倒计时初始化
    this._countdownTime = +new Date();

    // 是否开启过关动画
    this._isAnim = false;

    // 添加点击事件
    this.input.on('pointerdown', () => {
      let now = +new Date();
      if (obj.isInit && !obj.gameover && now - this._lastTime > obj.diffTime) {
        obj.isInit = false;
        this.sound.play('throwAudio');

        this.tweens.add({
          targets: [this._player],
          y: this._target.y + this._target.width / 2,
          duration: 150,
          onComplete: () => {
            let isHit = false;
            this._lastTime = now;

            this._players.getChildren().forEach(item => {
              if (Math.abs(Phaser.Math.Angle.ShortestBetween(this._target.angle, item._angle)) < obj.minBothAngle) {
                isHit = true;
              }
            });

            // 碰撞判断
            if (!isHit) {
              let temp = this.add.sprite(this._player.x, this._player.y, 'player');
              temp._angle = this._target.angle;
              this._players.add(temp);

              // 同步clips
              let items = this._clips.getChildren();
              let index = items.length - this._players.getChildren().length;
        
              items[index].setFrame(0);

              if (!index) {
                if (++gameArchive.level > obj.blood) {
                  gameArchive.pass = true;
                } else {
                  this.sound.play('brokenAudio');
                  this._isAnim = true;
                  this._target.destroy();
                  this._player.destroy();
                  this.scene.start('gameScene');
                }
              } else {
                // 准备下一把武器
                this._player.y = obj.initY;
                obj.isInit = true;
              }
            } else {
              this.sound.play('collideAudio');
              this.tweens.add({
                targets: [this._player],
                y: obj.cH * 1.5,
                rotation: 6,
                ease: 'Sine.easeOut',
                duration: 1000,
                onComplete: () => {
                  // 同步存档
                  if (--gameArchive.blood > 0) {
                    this.scene.start('gameScene');
                  }
                }
              });
            }
          }
        });
      }
    });
  }

  update() {
    if (obj.gameover || this._isAnim) {
      return;
    }

    let now = +new Date();

    if (obj.countdown === 0) {
      if (--gameArchive.blood > 0) {
        this.scene.start('gameScene');
      }
    } else {
      if (now > this._countdownTime + 1000) {
        this._countdownTime = now;
        this._countdownText.setText(--obj.countdown);
      }
    }

    // 成功判断
    if (gameArchive.pass) {
      let threeText = this.add.text(obj.cX, obj.cY+40, ['万科·汇智中心 提示您','恭喜您闯关成功获得万科为您准备的大牌口红','点击“查看奖品”查看领取信息'], 
      { font: '24px arial', align: 'center',
      shadowColor:"#F7B500",
      shadowFill:"#F7B500",shadowOffsetX:10,shadowOffsetY:10,shadowStroke:true, }).setOrigin(0.5);
      threeText.setLineSpacing(20)
      threeText.setDepth(5)
      threeText.setVisible(false)
      this.suc = this.add.sprite(obj.cX, obj.cY-200, 'suc');
      this.suc.setDepth(5)
      this.suc.setVisible(true)
      this.scene.pause()
      threeText.setVisible(true)
      this.black.setVisible(true)
      setTimeout(() => {
        obj.gameover = true;
        this.tweens.pauseAll();
        this.sound.pauseAll();
        var t = this
          //已经通过
          t.scene.start('passScene');
          return 
        
      }, 2000);
     
    }

    // 失败判断
    if (gameArchive.blood < 1) {
      var fail_text
      if(gameArchive.level == 1){
         fail_text = this.add.text(obj.cX, obj.cY+40, ['真遗憾，没能拿到口红呢','来 万科城·如园 参与更多互动 '], 
        { font: '24px arial', align: 'center',
        shadowColor:"#F7B500",
        shadowFill:"#F7B500",shadowOffsetX:10,shadowOffsetY:10,shadowStroke:true, }).setOrigin(0.5);
      }
      if(gameArchive.level == 2){
         fail_text = this.add.text(obj.cX, obj.cY+40, ['真可惜，再来一次一定可以的','快用分享家赚更多赏金吧'], 
        { font: '24px arial', align: 'center',
        shadowColor:"#F7B500",
        shadowFill:"#F7B500",shadowOffsetX:10,shadowOffsetY:10,shadowStroke:true, }).setOrigin(0.5);
      }
      if(gameArchive.level == 3){
        fail_text = this.add.text(obj.cX, obj.cY+40, ['好可惜，就差一点能拿到口红了','来 万科·大都会 抢专属福利折扣吧'], 
        { font: '24px arial', align: 'center',
        shadowColor:"#F7B500",
        shadowFill:"#F7B500",shadowOffsetX:10,shadowOffsetY:10,shadowStroke:true, }).setOrigin(0.5);
      }
      fail_text.setLineSpacing(20)
      fail_text.setDepth(5)
      fail_text.setVisible(false)
      this.suc = this.add.sprite(obj.cX, obj.cY-140, 'fail');
      this.suc.setDepth(5)
      this.suc.setVisible(true)
      this.scene.pause()
      fail_text.setVisible(true)
      this.black.setVisible(true)

      setTimeout(() => {
        obj.gameover = true;
        this.tweens.pauseAll();
        this.sound.pauseAll();
        
        this.scene.start('passScene');
      }, 3000);
     
    }

    this._target.angle += obj.speed;
    this._players.getChildren().forEach(item => {
      item.angle += obj.speed;
      let rad = Phaser.Math.DegToRad(item.angle + 90);
      item.x = this._target.x + (this._target.width / 2) * Math.cos(rad);
      item.y = this._target.y + (this._target.width / 2) * Math.sin(rad);
    });

    // 速度变化控制
    obj.speed += obj.speedStep * gameArchive.level;
    if (obj.speed >= obj.limitSpeed) {
      obj.speedStep = -obj.handleRnd();
    } else if (obj.speed <= -obj.limitSpeed) {
      obj.speedStep = obj.handleRnd();
    }
  }
}

// 成功场景
class PassScene extends Phaser.Scene {
  constructor() {
    super('passScene');
  }

  create() {

    var bg = this.add.sprite(obj.cX, obj.cY, 'bg');
    bg.scale = wradio
    var logo = this.add.sprite(108, 48*wradio, 'logo');
    logo.setScale(radio)
    var bottom = this.add.sprite(obj.cX, obj.cH - 40, 'bottom');
    var overIcon = this.add.sprite(obj.cW - 70, 68, 'over_icon');
    var over = this.add.sprite(0,0, 'over');
    over.x = obj.cX 
    over.y = 220*radio + over.height/2
    bottom.setScale(radio)
    over.setScale(radio)
    let btn = this.add.sprite(obj.cX/2, obj.cH-196, 'btn3', 1).setInteractive();
    let btn2 = this.add.sprite(obj.cW-obj.cX/2, obj.cH-196, 'btn2', 1).setInteractive();
    btn.setScale(radio)
    btn2.setScale(radio)
    var t = this
    
   
    $('.hb').click(function () {
      $('.pop_share').hide()
        $.ajax({
          type: "POST",
          url: "/vanke/AjaxGameCount.html?state=4brterij1o1g",
          dataType: "json",
          data: {
            openid: info.openid,
          },
          success: function (res) {
            if (res.ret == 0) {

              game_num = res.data.count;
              is_success = res.data.passed;
              if (game_num > 0 || res.data.passed == '1') {
                $.ajax({
                  type: "POST",
                  url: "/vanke/AjaxSubGameKh.html?state=4brterij1o1g",
                  dataType: "json",
                  data: {
                    openid: info.openid,
                  },
                  success: function (res) {
                    if (res.ret == 0) {

                      gameArchive = { level: 1, blood: 3, pass: false };
                      $('#again').hide()
                      $('#jp').hide()
                      t.scene.start('gameScene');

                    }
                  }
                })

              }

            }

          }
        })
    })
    $('#return').click(function(){
      $.ajax({
        type: "POST",
        url: "/vanke/AjaxAddGameKh.html?state=4brterij1o1g",
        dataType: "json",
        data: {
          openid: info.openid,
          type: 1,
  
        },
        success: function (res) {
          if (res.ret == 0) {
            $(document).dialog({
              type: 'notice',
              infoText: '游戏次数+1',
              autoClose: 2500
            });
            game_num++;
          }
          $('.read').hide()
          $.ajax({
            type: "POST",
            url: "/vanke/AjaxGameCount.html?state=4brterij1o1g",
            dataType: "json",
            data: {
              openid: info.openid,
            },
            success: function (res) {
              if (res.ret == 0) {
  
                game_num = res.data.count;
                is_success = res.data.passed;
                if (game_num > 0 || res.data.passed == '1') {
                  $.ajax({
                    type: "POST",
                    url: "/vanke/AjaxSubGameKh.html?state=4brterij1o1g",
                    dataType: "json",
                    data: {
                      openid: info.openid,
                    },
                    success: function (res) {
                      if (res.ret == 0) {
                        $('#again').hide()
                        $('#jp').hide()
                        gameArchive = { level: 1, blood: 3, pass: false };
                        t.scene.start('gameScene');
  
                      }
                    }
                  })
  
                }
  
              }
  
            }
          })
  
  
        }
      })
  
    
  })
    //
    btn2.on('pointerdown', () => {
      console.log(is_success)
      $.ajax({
        type: "POST",
        url: "/vanke/AjaxGameCount.html?state=4brterij1o1g",
        dataType:"json",
        data: {
            openid:info.openid,             
        },
        success: function(res){
          if(res.ret == 0){
         
           game_num = res.data.count;
           is_success = res.data.passed;
           if(is_success == '1' ){
             
             $('#jp .cz').show()
             $('#jp .ncz').hide()
           }else
           {
            $('#jp .cz').hide()
            $('#jp .ncz').show()
           }
          
          }else{

            //没有剩余次数
            $('#jp .cz').hide()
            $('#jp .ncz').show()
          }
          $('#jp').fadeIn()
           }
     })
    
     
      // console.log(1)
      // // 重置存档
      // gameArchive = { level: 1, blood: 3, pass: false };
      // this.scene.start('gameScene');
    });
    btn.on('pointerdown', () => {
      // $(document).dialog({
      //   type: 'notice',
      //   infoText: '游戏已经结束，敬请关注万科双十一嗨购节其他活动',
      //   autoClose: 2500
      // });
      gameArchive = { level: 1, blood: 3, pass: false };
      this.scene.start('gameScene');
      console.log(2)
    //   var t = this
    //   $.ajax({
    //     type: "POST",
    //     url: "/vanke/AjaxGameCount.html?state=4brterij1o1g",
    //     dataType:"json",
    //     data: {
    //         openid:info.openid,             
    //     },
    //     success: function(res){
    //       if(res.ret == 0){
         
    //        game_num = res.data.count;
    //        is_success = res.data.passed;
    //        if(game_num>0 && res.data.passed == 0 ){
    //         $.ajax({
    //           type: "POST",
    //           url: "/vanke/AjaxSubGameKh.html?state=4brterij1o1g",
    //           dataType:"json",
    //           data: {
    //               openid:info.openid,             
    //           },
    //           success: function(res){
    //             if(res.ret == 0){
                  
    //               gameArchive = { level: 1, blood: 3, pass: false };
    //               t.scene.start('gameScene');
    //             }
    //              }
    //        })
           
    //        }
    //        if(res.data.passed == '1'){
    //         gameArchive = { level: 1, blood: 3, pass: false };
    //         t.scene.start('gameScene');
    //        }
    //        if(game_num<=0 && res.data.passed == 0){
    //         $('#again').fadeIn()
    //        }
           
    //       }else{

    //         //没有剩余次数
    //         $('#again').fadeIn()
    //       }

    //        }
    //  })
     
      
    })
  }
}

// 失败场景
class OverScene extends Phaser.Scene {
  constructor() {
    super('overScene');
  }

  create() {
    this.add.sprite(obj.cX, obj.cY, 'bg');
    this.add.sprite(obj.cX, obj.cY, 'gameover');

    let btn = this.add.sprite(obj.cX, 422, 'btn', 1).setInteractive();
    btn.on('pointerdown', () => {
      // 重置存档
      gameArchive = { level: 1, blood: 3, pass: false };
      this.scene.start('gameScene');
    });
  }
}
