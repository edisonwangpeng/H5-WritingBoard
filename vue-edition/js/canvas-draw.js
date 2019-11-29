/**
 * 四六级精听--模拟练习
 **/

var vm = new Vue({
    el: '#root',
    template: `
        <div class="main" >
         
          <div class="canvasbox" >
            <div class="operate-box"  >
              <!-- 开启canvas后  操作区域  start-->
              <div class="canvas-operate-box" v-show="hiddenStartCanvas">
                <div @click="closeCanvas">关闭</div>
                <div>
                  <span class="clear-button" @click="clearButton">清屏</span>
                  <span @click="finishCanvas">完成</span>
                </div>       
              </div>
              <!-- 开启canvas后  操作区域  end-->

              <!-- 未开启canvas  操作区域  start-->
              <div class="operate-title-box" v-show="!hiddenStartCanvas"> 
                <span >文章阅读</span>
                <img src="img/start-canvas.png" class="start-canvas" v-show="!hiddenStartCanvas"  @click="creatCanvas"/>
              </div>
              <!-- 未开启canvas  操作区域  end-->
            </div>
          </div>
          <!-- 文章区域  start-->
          <div class="textContentbox">
            {{textContent}}
          </div>
          <!-- 文章区域  end-->
          <div class="page-button" v-show="hiddenStartCanvas">
            <img src="img/top.png" @click="pageUp"/>
            <img src="img/bottom.png" @click="pageDown"/>
          </div>        
          
        </div>
        `,
    data: {
        hiddenStartCanvas: false, //隐藏开始画板
        textContent: "", //文章内容
        isDown: false, //可否使用画笔
        canvasTop: 0, //画板距上面的距离
        canvasLeft: 0, //画板距左面的距离
        points: [], //画板里所有点的数组
        beginPoint: null, //下笔时第一个点
        articleHeight: 0, //文章数据高度
        articleWidth: 0, //文章数据宽度
        firstCanvas: true, //第一次生成canvas
    },

    methods: {
        // 生成画板
        creatCanvas: function() {
            this.hiddenStartCanvas = true;
            // 画板存在时，禁止滑动翻页
            this.preventTouchmove();
            this.articleHeight = document.getElementsByClassName("textContentbox")[0].clientHeight;
            this.articleWidth = document.getElementsByClassName("textContentbox")[0].clientWidth;
            //判断
            if (this.firstCanvas == true) {
                let board = document.createElement("canvas");
                document.getElementsByClassName("main")[0].appendChild(board); //获取画板
                ctx = board.getContext("2d"); //创建画布对象
                board.id = "board"; //画板id
                document.getElementById("board").width = this.articleWidth; //画板宽
                document.getElementById("board").height = this.articleHeight; //画板高
                this.canvasLeft = board.offsetLeft;
                this.canvasTop = document.getElementsByClassName("operate-box")[0].clientHeight; //获取画布的top值
                document.getElementById("board").style.top = 1 + "rem"
                ctx.strokeStyle = "#ff9648"; //画笔颜色
                ctx.lineCap = "round"; //设置线条的结束端点样式
                ctx.lineJion = "round"; //设置两条线相交时，所创建的拐角类型
                ctx.lineWidth = 5.0; //画笔粗细
            }
            let board = document.getElementById("board");
            board.addEventListener("touchstart", this.down, false);
            board.addEventListener("touchmove", this.move, false);
            board.addEventListener("touchend", this.up, false);
        },
        //获取当前触碰点
        getPos: function(e) {
            let canvasLeft = this.canvasLeft;
            let canvasTop = this.canvasTop;
            let X = e.pageX - canvasLeft;
            let Y = e.pageY - canvasTop;
            return {
                x: X,
                y: Y
            }
        },
        //画板画笔触屏函数
        down: function(e) {
            if (this.hiddenStartCanvas == true) {
                this.isDown = true;
                if (e.targetTouches.length == 1) {
                    let touch = e.targetTouches[0];
                    const { x, y } = this.getPos(touch);
                    this.points.push({ x, y });
                    this.beginPoint = { x, y }
                }
            } else {
                return false
            }

        },
        //画板画笔触屏移动函数
        move: function(e) {
            var isDown = this.isDown;
            if (isDown) {
                if (e.targetTouches.length == 1) {
                    let touchs = e.targetTouches[0];
                    const { x, y } = this.getPos(touchs);
                    this.points.push({ x, y });
                    if (this.points.length > 3) {
                        const lastTwoPoints = this.points.slice(-2);
                        const controlPoint = lastTwoPoints[0];
                        const endPoint = {
                            x: (lastTwoPoints[0].x + lastTwoPoints[1].x) / 2,
                            y: (lastTwoPoints[0].y + lastTwoPoints[1].y) / 2,
                        }
                        this.drawLine(this.beginPoint, controlPoint, endPoint);
                        this.beginPoint = endPoint;
                    }
                }
            }
        },
        //画板画笔移开函数
        up: function(e) {
            const { x, y } = this.getPos(e.changedTouches[0]);
            this.points.push({ x, y });
            if (this.points.length > 3) {
                const lastTwoPoints = this.points.slice(-2);
                const controlPoint = lastTwoPoints[0];
                const endPoint = lastTwoPoints[1];
                this.drawLine(this.beginPoint, controlPoint, endPoint);
            }
            this.beginPoint = null;
            this.isDown = false;
            this.points = [];
        },
        //画板生成线条函数
        drawLine: function(beginPoint, controlPoint, endPoint) {
            ctx.beginPath();
            ctx.moveTo(beginPoint.x, beginPoint.y);
            ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, endPoint.x, endPoint.y);
            ctx.stroke();
            ctx.closePath();
        },
        // 获取富文本
        getQuestionFn: function() {
            this.textContent = "《You Have Only One Life》" +
                "There are moments in life when you miss someone so much that you just want to pick them from your dreams and hug them for real! Dream what you want to dream;go where you want to go;be what you want to be,because you have only one life and one chance to do all the things you want to do.May you have enough happiness to make you sweet,enough trials to make you strong,enough sorrow to keep you human,enough hope to make you happy? Always put yourself in others’shoes.If you feel that it hurts you,it probably hurts the other person, too.The happiest of people don’t necessarily have the best of everything;they just make the most of everything that comes along their way.Happiness lies for those who cry,those who hurt, those who have searched,and those who have tried,for only they can appreciate the importance of people.who have touched their lives.Love begins with a smile,grows with a kiss and ends with a tear.The brightest future will always be based on a forgotten past, you can’t go on well in lifeuntil you let go of your past failures and heartaches.When you were born,you were crying and everyone around you was smiling.Live your life so that when you die,you're the one who is smiling and everyone around you is crying.Please send this message to those people who mean something to you,to those who have touched your life in one way or another,to those who make you smile when you really need it,to those that make you see the brighter side of things when you are really down,to those who you want to let them know that you appreciate their friendship.And if you don’t, don’t worry,nothing bad will happen to you,you will just miss out on the opportunity to brighten someone’s day with this message."

        },

        //清除画板内容
        clearButton: function() {
            ctx.clearRect(0, 0, this.articleWidth, this.articleHeight);
        },
        //关闭画板
        closeCanvas: function() {
            this.hiddenStartCanvas = false;
            this.isDown = false;
            this.firstCanvas = true;
            this.allowTouchmove();
            document.getElementsByClassName("main")[0].removeChild(document.getElementById("board"));
        },
        //完成画板
        finishCanvas: function() {
            this.hiddenStartCanvas = false;
            this.isDown = false;
            this.firstCanvas = false;
            this.allowTouchmove();

        },
        //防止下拉
        preventTouchmove: function() {
            bodyScr = function bodyScroll(event) {
                event.preventDefault();
            }
            document.body.addEventListener('touchmove', bodyScr, { passive: false });

        },
        //允许下拉
        allowTouchmove: function() {
            document.body.removeEventListener('touchmove', bodyScr, { passive: false });

        },
        //向上翻页
        pageUp: function() {
            document.documentElement.scrollTop -= 500
            document.body.scrollTop -= 500
        },
        // 向下翻页
        pageDown: function() {
            document.documentElement.scrollTop += 500
            document.body.scrollTop += 500
        },
        init: function() {
            this.getQuestionFn();
        }

    },
    mounted: function() {
        this.$nextTick(function() {
            vm.init();


        });
    },


})