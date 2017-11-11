window.onload=function(){
	//兼容PC与移动的事件
   	var touchEvents = {
        touchstart: "touchstart",
        touchmove: "touchmove",
        touchend: "touchend",
        touchleave:"ontouchcancel",
        /**
         * @desc:判断是否pc设备，若是pc，需要更改touch事件为鼠标事件，否则默认触摸事件
         */
        initTouchEvents: function () {
            if (IsPC()) {
	            this.touchstart = "mousedown";
		        this.touchmove = "mousemove";
	            this.touchend = "mouseup";
		        this.touchleave="mouseout";
		    }
		}
   	};
    touchEvents.initTouchEvents();
    
    
	var img=document.getElementById("indicator");//箭头图片
	var canvas=document.getElementById("canvas");
	var cobj=canvas.getContext("2d");
	var canvasL=$("#canvas").offset().left;
	canvasL-=$("body").offset().left;
	
	/*console.log(canvasL);*/
	img.style.top="15px";
	img.style.left=canvasL+135+"px";
	img.style.display="block";
	
	var flag=false;//鼠标是否按下
	//设置原点和半径参数
	var originx=150;
	var originy=150;
	var radius=100;
	drawClock();//绘制时钟
	
	function drawClock(){
		//放射性渐变色
		var colorobj=cobj.createRadialGradient(originx,originy,1,originx,originy,100);
		//渐变颜色设置
		colorobj.addColorStop(0,"#50c1e9");
		//colorobj.addColorStop(0.5,"#cfcfcf");
		colorobj.addColorStop(1,"#50c1e9");
		cobj.fillStyle=colorobj;
		//路径的粗细
		cobj.lineWidth=8;
		//边框样式
		cobj.strokeStyle=colorobj;
		//开始绘制
		cobj.beginPath();
		//绘制圆形表盘
		cobj.arc(originx,originy,radius,0,2*Math.PI,false);
		cobj.stroke();
		//填充颜色
		cobj.fill();
		//去掉阴影
		cobj.shadowColor="#888";
		cobj.shadowOffsetX=0;
		cobj.shadowOffsetY=0;
		cobj.shadowBlur=0;
		//调用画刻度函数
		drawMark();	
		//画圆
		cobj.beginPath();
		cobj.strokeStyle="#ffffff";
		/*外部圆*/
		cobj.arc(150,150,120,0,Math.PI*2,false);
		cobj.stroke();
	}
	
	var num=0;
	var startA=0;//开始角度
	var startE=0;//结束角度
	var indT=30;//圆上的点Y
	var indL=canvasL+150;//圆上点X
	var imgRot=0;//箭头旋转
	
	//鼠标按下事件
	img.addEventListener(touchEvents.touchstart,function(e){
		event.preventDefault();
		num=0;
		flag=true;//鼠标按下
	})
	
	/*移动端*/
	img.addEventListener(touchEvents.touchmove,function(){
		event.preventDefault();
		mouseM();//鼠标移动函数
	})
	img.addEventListener(touchEvents.touchend,function(){
		event.preventDefault();
		flag=false;
		num=0;
	    //倒计时
	    countDown()
	})
	
	var timeDownFlag=0;//记录是否开启倒计时
	//鼠标移动事件
	function mouseM(optionObj){
		if(timeDownFlag==1 && arguments.length==0){
			clearInterval(timeDown);//清除倒计时
		}
		if(flag){ 	
	    	if(arguments.length==0){
	    		var obj=mouse();
		 	}else{
		 		var obj=optionObj;
		 	}
	    	var mouseY=Math.abs(150-obj.p2);/*a*/
			var mouseX=Math.abs(obj.p1-150);/*b*/
		 	var angle=Math.atan(mouseY/mouseX);
	   		//二区域
	   		if(obj.p2<=150 && obj.p1>=150){
				indT=150-Math.sin(angle)*120;
		   		indL=Math.cos(angle)*120+150;
		   		startA=-Math.PI/2;
		   		startE=-angle;
		   		var timer=15-Math.floor(angle/(Math.PI*2)*60);
		   		if(num==1){
					cobj.clearRect(0,0,400,400);
					drawClock();
				}
		   		num=1;
		   		imgRot=90-angle*180/Math.PI;
		   	}
	    	//四区域
	    	if(obj.p2>= 150 && obj.p1>=150){
		   		indL=Math.cos(angle)*120+150;
	    		indT=Math.sin(angle)*120+150;
	    		startA=-Math.PI/2;
		   		startE=angle;
		   		var timer=15+Math.floor(angle/(Math.PI*2)*60);
		   		cobj.clearRect(0,0,400,400);
				drawClock();
				imgRot=angle*180/Math.PI+90;
	    	}
	    	//三区域
	    	if(obj.p2 >=150 && obj.p1<=150){
		    	indL=150-Math.cos(angle)*120;
	    		indT=150+Math.sin(angle)*120;
	    		startA=-Math.PI/2;
		    	startE=Math.PI-angle;
		    	var timer=45-Math.floor(angle/(Math.PI*2)*60);
		    	cobj.clearRect(0,0,400,400);
				drawClock();
				imgRot=270-angle*180/Math.PI;
	    	}
	    	//一区域
	    	if(obj.p2 <=150 && obj.p1<150){
	    		indL=150-Math.cos(angle)*120;
	    		indT=150-Math.sin(angle)*120;
		    	startA=-Math.PI/2;
		    	startE=angle-Math.PI;
		    	var timer=45+Math.floor(angle/(Math.PI*2)*60);
		    	cobj.clearRect(0,0,400,400);
				drawClock();
				imgRot=angle*180/Math.PI+270;
	    	}
	    	
	    	if(arguments.length==0){
		    	if(timer<10){
		    		timer="0"+timer;
		    	}
		    	$(".count-down-time").text("00:"+timer+":00");	
		    }
	    	cobj.beginPath();
	    	cobj.strokeStyle="#ffffff";
	    	cobj.lineWidth=3;
	    	cobj.arc(150,150,120,startA,startE,false);
	    	cobj.stroke();
	    	//调整图表位置
	    	img.style.top=(indT-15)+"px";
			img.style.left=(canvasL+indL-15)+"px";		    	
			img.style.webkitTransform = "rotate("+imgRot+"deg)";
			img.style.MozTransform = "rotate("+imgRot+"deg)";
			img.style.msTransform = "rotate("+imgRot+"deg)";
			img.style.OTransform  = "rotate("+imgRot+"deg)";
			img.style.transform = "rotate("+imgRot+"deg)";
	    	/*console.log(indT,indL)*/
	    }
	}
	
	
	//PC端移动与抬起
	canvas.addEventListener(touchEvents.touchmove,function(){
		event.preventDefault();
		mouseM();
	})
	canvas.addEventListener(touchEvents.touchend,function(){
		event.preventDefault();
		flag=false;
		num=0;
	    //倒计时
	    countDown();
	})
	
	
	//画刻度的函数
	function drawMark(){
		for(var i=0;i<60;i++){
			var angle=i*6*Math.PI/180;
			var radius1=radius-4;
			var lw=1;
			if(i%5==0){
				radius1=radius-8;
				lw=2;
			}
			cobj.strokeStyle="#ffffff"
			cobj.lineWidth=lw;
			cobj.beginPath();
			//刻度线长为8
			cobj.moveTo(originx+radius*Math.cos(angle),originy+radius*Math.sin(angle));
			cobj.lineTo(originx+(radius1-8)*Math.cos(angle),originy+(radius1-8)*Math.sin(angle));
			cobj.stroke();
		}	
	}
	
	
	 //获取鼠标点击坐标
	function mouse(){
		var canvasT=$("#canvas").offset().top;
		var canvasL=$("#canvas").offset().left;
		if (IsPC()) {
    		var touch=event || window.event;
    		var p1=touch.clientX;
    		var p2=touch.clientY;
    		p1=p1-canvasL;
    		p2=p2-canvasT;
    	}else{
    		var touch=event.targetTouches[0];
    		var p1=touch.pageX;
    		var p2=touch.pageY;
    		p1=p1-canvasL;
    		p2=p2-canvasT;
    	}
    	return {
    		p1:p1,
    		p2:p2
    	}
	}
	
	
	//判断是否是PC  用于适应PX与移动
    function IsPC(){
		var userAgentInfo = navigator.userAgent;
		var Agents = ["Android", "iPhone","SymbianOS", "Windows Phone","iPad", "iPod"];
		var flag = true;
		for (var v = 0; v < Agents.length; v++) {
			if (userAgentInfo.indexOf(Agents[v]) > 0) {
			    flag = false;
			    break;
			}
		}
		return flag;
	}
   function reset(){
    	cobj.clearRect(0,0,400,400);
		drawClock();	
		img.style.webkitTransform = "rotate(0deg)";
		img.style.MozTransform = "rotate(0deg)";
		img.style.msTransform = "rotate(0deg)";
		img.style.OTransform  = "rotate(0deg)";
		img.style.transform = "rotate(0deg)";
		img.style.top="15px";
		img.style.left=canvasL+135+"px";
   }
   
   //倒计时
   function countDown(){
   		var txt=$(".count-down-time").text();
		var timerArr=txt.split(":");
		var timer=parseInt(timerArr[1]);
		var count=timer*60;
	    //倒计时
	    timeDownFlag=1;
	    flag=true;
	    timeDown=setInterval(function(){
	    	count--;
	    	//console.log(count)
	    	if(count>=0){
	    		var sec=count%60;
	    		//秒旋转角度
	    		var roteS=sec*(1/60);
	    		
	    		if(sec<10){
	    			sec="0"+sec;
	    		}
	    		var mou=Math.floor(count/60);
	    		//分旋转角度
	    		var roteM=mou*6;
	    		
	    		if(mou<10){
	    			mou="0"+mou;
	    		}
	    		$(".count-down-time").text("00:"+mou+":"+sec);
	    		
	    		//计算
	    		var angle=roteS+roteM;
	    		//一区域
	    		if(angle<=90){
	    			var optionX=150+Math.cos((90-angle)*Math.PI/180)*100;
	    			var optionY=150-Math.sin((90-angle)*Math.PI/180)*100;
	    		}
	    		//二区域
	    		if(angle>90 && angle<=180){
	    			var optionX=150+Math.cos((angle-90)*Math.PI/180)*100;
	    			var optionY=150+Math.sin((angle-90)*Math.PI/180)*100;
	    		}
	    		//三区域
	    		if(angle>180 && angle<=270){
	    			var optionX=150-Math.cos((270-angle)*Math.PI/180)*100;
	    			var optionY=150+Math.sin((270-angle)*Math.PI/180)*100;
	    		}
	    		//四区域
	    		if(angle>270 && angle<=360){
	    			var optionX=150-Math.cos((angle-270)*Math.PI/180)*100;
	    			var optionY=150-Math.sin((angle-270)*Math.PI/180)*100;
	    		}
	    		//坐标对象
	    		var obj={
	    			p1:optionX,
	    			p2:optionY
	    		}
	    		//console.log(angle,obj)
	    		mouseM(obj);
	    	}else{
	    		clearInterval(timeDown);
	    		timeDownFlag=0;
	    	}
	    },1000)
   }
}

