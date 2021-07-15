  // readyMode init
  function readyModeInit() {
    let loadFlag = false;
    pixiFlag = false;
    setTimeout(() => {
      $(".loadingBox").fadeIn(300, function () {
        let count = 0;
        let timer = setInterval(() => {
          if (count > 100) {
            clearInterval(timer);
            loadFlag = true;
            if (pixiFlag) {
              setTimeout(() => {
                $(".loadingBox").fadeOut(300, function () {
                  $(".readyMode").addClass("cur");
                });
              }, 800);
            }
            return
          }
          TweenMax.to($(".loadingBox-teamlogo")[0], 1, {
            width: 14 * count / 100 + 'rem'
          });
          TweenMax.to($(".loadingBox-lucia")[0], 1, {
            left: 14 * count / 100 + 'rem'
          });

          TweenMax.to($(".loadingBox-line")[0], 1, {
            width: 14 * count / 100 + 'rem'
          });
          count += 5;
        }, 300);
      });
    }, 300);



    let pixiStatus = true;
    let type = "WebGL";
    if (!PIXI.utils.isWebGLSupported()) {
      type = "canvas"
    }
    PIXI.utils.sayHello(type)

    // 主舞台
    let readyModeApp = new PIXI.Application({
      width: 2560,
      height: 1440,
      transparent: true,
      antialias: true,
      autoResize: true,
    });
    readyModeApp.renderer.view.style.position = "absolute";
    readyModeApp.renderer.view.style.display = "block";
    readyModeApp.renderer.view.style.zIndex = 2;
    readyModeApp.renderer.view.style.top = 0;
    let readyModeRenderer = readyModeApp.renderer;
    let readyMode = document.getElementById("readyMode")
    readyMode.appendChild(readyModeRenderer.view)
    scaleToWindow(readyModeApp.view);
    window.addEventListener("resize", function () {
      if (!pixiStatus) return
      scaleToWindow(readyModeApp.view);
    })

    // 全屏舞台
    let mouseApp = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      transparent: true,
      antialias: true,
      autoResize: true,
    });
    mouseApp.renderer.view.style.position = "absolute";
    mouseApp.renderer.view.style.display = "block";
    mouseApp.renderer.view.style.zIndex = 3;
    mouseApp.renderer.view.style.top = 0;
    mouseApp.renderer.view.style.pointerEvents = "none";
    mouseApp.renderer.autoResize = true;
    let mouseRenderer = mouseApp.renderer;
    let mouse = document.getElementById("readyMode")
    mouse.appendChild(mouseRenderer.view);
    window.addEventListener("resize", function () {
      if (!pixiStatus) return
      mouseApp.renderer.resize(window.innerWidth, window.innerHeight);
    })

    let requestLink = location.origin;

    let srcArr = [
      bgSrc,
      graySrc,
      lightSrc,
      startSrc,
      awaitSrc,
      videoSrc,
      particleSrc,
      threeDMapSrc,
      maskSrc
    ] = [
        requestLink + "/spriteSheet/bg3.png",
        requestLink + "/spriteSheet/screen-gray.png",
        requestLink + "/spriteSheet/screen-light.png",
        requestLink + "/spriteSheet/start-1.json",
        requestLink + "/spriteSheet/await-2.json",
        requestLink + "/spriteSheet/transitions.mp4",
        requestLink + "/spriteSheet/particle.png",
        requestLink + "/spriteSheet/bg3Map.png",
        requestLink + "/spriteSheet/mask.png"
      ];

    PIXI.loader.add(srcArr, { crossOrigin: true }).on("progress", loadProgressHandler)
      .load(setup);

    function loadProgressHandler(loader, resource) {
      // console.log(`${resource.url}: ${loader.progress}%`)
      if (Math.ceil(loader.progress) >= 100) {
        pixiFlag = true;
        if (loadFlag) {
          setTimeout(() => {
            $(".loadingBox").fadeOut(300, function () {
              $(".readyMode").addClass("cur");
            });
          }, 800);
        }
      }
    }

    function uploadToGPU(resourceName) {
      resourceName = resourceName + '_image'
      let texture = new PIXI.Texture.fromImage(resourceName)
      readyModeApp.renderer.bindTexture(texture)
    }

    function setup() {
      // 上传到GPU
      uploadToGPU(awaitSrc)
      uploadToGPU(startSrc)

      let readyModeContainer = new PIXI.Container();
      // 背景
      let bgSprite = new PIXI.Sprite(
        PIXI.loader.resources[bgSrc].texture
      );
      bgSprite.width = 2560;
      bgSprite.height = 1440;
      readyModeContainer.addChild(bgSprite);

      // faux3d
      let threeDMapSprite = new PIXI.Sprite(
        PIXI.loader.resources[threeDMapSrc].texture
      );
      threeDMapSprite.width = 2560;
      threeDMapSprite.height = 1440;
      const depthMapFilter = new PIXI.filters.DisplacementFilter(
        threeDMapSprite,
      );

      readyModeContainer.addChild(threeDMapSprite);
      readyModeContainer.filters = [depthMapFilter];

      depthMapFilter.scale.x = 2;
      depthMapFilter.scale.y = 2;


      $(".readyMode")[0].addEventListener("mousemove", function (ev) {
        let yAmount = ev.clientY / window.innerHeight - 0.5;
        let xAmount = ev.clientX / window.innerWidth - 0.5;
        TweenMax.to(depthMapFilter.scale, 2, {
          y: yAmount * 400,
          x: xAmount * 500,
          ease: "power3.out",
        });
      })


      // 屏幕闪烁
      let screenFrames = [PIXI.Texture.fromFrame(graySrc), PIXI.Texture.fromFrame(lightSrc)];
      let screenPixie = new PIXI.extras.AnimatedSprite(screenFrames);
      screenPixie.animationSpeed = 0.02;
      screenPixie.width = 351;
      screenPixie.height = 266;
      screenPixie.x = 1163;
      screenPixie.y = 742;
      readyModeContainer.addChild(screenPixie);
      screenPixie.loop = true;
      screenPixie.play();
      screenPixie.interactive = true;

      // 启动
      let startFrames = []
      for (let i = 0; i < 91; i += 2) {
        let texture
        if (i < 10) {
          texture = PIXI.Texture.fromFrame(`韩国官网动画-启动2_0000${i}.png`)
        } else {
          texture = PIXI.Texture.fromFrame(`韩国官网动画-启动2_000${i}.png`)
        }
        startFrames.push(texture)
      }
      let startPixie = new PIXI.extras.AnimatedSprite(startFrames);
      startPixie.animationSpeed = 1;
      startPixie.width = 550;
      startPixie.height = 700;
      startPixie.x = 1052;
      startPixie.y = 328;
      readyModeContainer.addChild(startPixie);
      startPixie.loop = false;
      startPixie.alpha = 0;

      let startReverseFrames = []
      for (let i = 90; i >= 0; i -= 2) {
        let texture
        if (i < 10) {
          texture = PIXI.Texture.fromFrame(`韩国官网动画-启动2_0000${i}.png`)
        } else {
          texture = PIXI.Texture.fromFrame(`韩国官网动画-启动2_000${i}.png`)
        }
        startReverseFrames.push(texture)
      }
      let startReversePixie = new PIXI.extras.AnimatedSprite(startReverseFrames);
      startReversePixie.animationSpeed = 1;
      startReversePixie.width = 550;
      startReversePixie.height = 700;
      startReversePixie.x = 1052;
      startReversePixie.y = 328;
      readyModeContainer.addChild(startReversePixie);
      startReversePixie.loop = false;
      startReversePixie.alpha = 0;

      // 待机
      let awaitFrames = []
      for (let i = 0; i < 161; i += 4) {
        let texture
        if (i < 10) {
          texture = PIXI.Texture.fromFrame(`韩国官网动画-待机2_0000${i}.png`)
        } else if (i >= 10 && i < 100) {
          texture = PIXI.Texture.fromFrame(`韩国官网动画-待机2_000${i}.png`)
        } else {
          texture = PIXI.Texture.fromFrame(`韩国官网动画-待机2_00${i}.png`)
        }
        awaitFrames.push(texture)
      }
      let awaitPixie = new PIXI.extras.AnimatedSprite(awaitFrames);
      awaitPixie.animationSpeed = 0.25;
      awaitPixie.width = 550;
      awaitPixie.height = 700;
      awaitPixie.x = 1052;
      awaitPixie.y = 328;
      readyModeContainer.addChild(awaitPixie);
      awaitPixie.loop = false;
      awaitPixie.alpha = 0;

      // 过场视频
      const video = document.createElement('video')
      video.crossOrigin = 'anonymous'
      video.preload = ''
      video.muted = 'muted'
      video.src = videoSrc

      // 手机交互
      let aniLock = false;
      let startLock = false;
      screenPixie.on('pointerover', function () {
        aniLock = true;
        screenPixie.gotoAndStop(1);
        startPixie.alpha = 1;
        startPixie.gotoAndPlay(0);
        startPixie.onComplete = function () {
          startLock = true;
          startPixie.alpha = 0;
          if (!aniLock) return;
          awaitPixie.alpha = 1;
          awaitPixie.gotoAndPlay(0);
          awaitPixie.loop = true;
        };
      }).on('pointerout', function () {
        aniLock = false;
        if (startLock) {
          awaitPixie.loop = false;
          awaitPixie.alpha = 0;
          startReversePixie.alpha = 1;
          startReversePixie.gotoAndPlay(0);
          startReversePixie.onComplete = function () {
            startLock = false;
            startReversePixie.alpha = 0;
            if (aniLock) return;
            screenPixie.gotoAndPlay(0);
          }
        } else {
          startPixie.onFrameChange = function () {
            awaitPixie.loop = false;
            awaitPixie.alpha = 0;
            startPixie.stop();
            startPixie.alpha = 0;
            startReversePixie.alpha = 1;
            startReversePixie.gotoAndPlay(startReversePixie.totalFrames - startPixie.currentFrame);
            startPixie.onFrameChange = function () { };
            startReversePixie.onComplete = function () {
              startLock = false;
              startReversePixie.alpha = 0;
              if (aniLock) return;
              screenPixie.gotoAndPlay(0);
            }
          };
        }
      }).on('pointerdown', function () {
        let videoSprite = new PIXI.Sprite(
          PIXI.Texture.from(video)
        )
        videoSprite.width = readyModeApp.screen.width;
        videoSprite.height = readyModeApp.screen.height;
        readyModeContainer.addChild(videoSprite);
        setTimeout(() => {
          readyModeApp.destroy(true);
          mouseApp.destroy(true);
          $(".readyMode").removeClass("cur");
          $(".refresh").show();
          pixiStatus = false;

        }, 1000);
      });

      // 鼠标拖尾
      let emitterContainer = new PIXI.particles.ParticleContainer();
      mouseApp.stage.addChild(emitterContainer);
      let emitter = new PIXI.particles.Emitter(
        emitterContainer,
        [PIXI.Texture.fromImage(particleSrc)],
        {
          "alpha": {
            "start": 1,
            "end": 0.36
          },
          "scale": {
            "start": 0.15,
            "end": 0.01,
            "minimumScaleMultiplier": 1
          },
          "color": {
            "start": "#8afcef",
            "end": "#d1ffe7"
          },
          "speed": {
            "start": 30,
            "end": 40,
            "minimumSpeedMultiplier": 1
          },
          "acceleration": {
            "x": 3,
            "y": 5
          },
          "maxSpeed": 0,
          "startRotation": {
            "min": 0,
            "max": 360
          },
          "noRotation": true,
          "rotationSpeed": {
            "min": 0,
            "max": 0
          },
          "lifetime": {
            "min": 0.2,
            "max": 0.8
          },
          "blendMode": "screen",
          "frequency": 0.01,
          "emitterLifetime": -0.1,
          "maxParticles": 100,
          "pos": {
            "x": 0,
            "y": 0
          },
          "addAtBack": true,
          "spawnType": "burst",
          "particlesPerWave": 1,
          "particleSpacing": 0,
          "angleStart": 0
        }
      );
      let elapsed = Date.now();
      emitter.emit = true;
      mouseApp.ticker.add((delta) => {
        let mouseposition = mouseApp.renderer.plugins.interaction.mouse.global;
        let now = Date.now();
        emitter.update((now - elapsed) * 0.001);
        elapsed = now;
        emitter.updateOwnerPos(mouseposition.x, mouseposition.y)
      });

      readyModeApp.stage.addChild(readyModeContainer);

      // 蒙版
      let maskSprite = new PIXI.Sprite(
        PIXI.loader.resources[maskSrc].texture
      );
      maskSprite.width = 2560;
      maskSprite.height = 1440;
      readyModeApp.stage.addChild(maskSprite);
    }
  }

  readyModeInit()