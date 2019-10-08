var root = window.player;
var len;
var dataList;
var audio = root.audioManager;
var control;
var timer;
// 数据请求
function getData(url){
	$.ajax({
		type:'GET',
		url:url,
		success:function(data){
			console.log(data);
			len = data.length;
			dataList = data;
			control = new root.controlIndex(len);
			root.render(data[0]);
			root.pro.renderAllTime(data[0].duration);
			audio.getAudio(data[0].audio);
			bindEvent();
			bindTouch();

		},
		error:function(){
			console.log('error');
		}

	})
}
// 绑定事件
function bindEvent(){
	$('body').on('play:change',function(e,index){
		audio.getAudio(dataList[index].audio);
		root.render(dataList[index]);
		if (audio.status == 'play') {
			audio.play();
			root.pro.start();
			rotated(0);
		}
		$('.img-box').attr('data-deg',0);
		$('.img-box').css({
			'transform' : 'rotateZ(' + 0 + 'deg)',
			'transition' : 'none'
		});
		// 渲染时间
		root.pro.renderAllTime(dataList[index].duration);
	})
	$('.prev').on('click',function(){
		var i =control.prev();
		$('body').trigger('play:change',i);
		// 切歌时清零
		root.pro.start(0);
		if (audio.status == 'pause') {
			audio.pause();
			root.pro.stop();
		}
	})

	$('.next').on('click',function(){
		var i =control.next();
		$('body').trigger('play:change',i);
		// 切歌时清零
		root.pro.start(0);
		if (audio.status == 'pause') {
			audio.pause();
			root.pro.stop();
		}
	})

	$('.play').on('click',function(e){
		if (audio.status == 'pause') {
			audio.play();
			root.pro.start()
			var deg = $('.img-box').attr('data-deg');
			rotated(deg);
		} else {
			audio.pause();
			root.pro.stop()
			clearInterval(timer);
		}
		$('.play').toggleClass('playing');
		
	})
}
// 背景图片旋转
function rotated(deg){
	clearInterval(timer);
	deg = +deg;
	timer = setInterval(function(){
		deg += 2;
		$('.img-box').attr('data-deg',deg);
		$('.img-box').css({
			'transform' : 'rotateZ(' + deg + 'deg)',
			'transition' : 'all 0.5s ease'
		})
	},200);
}
function bindTouch(){
	var $spot = $('.spot');
	var offset = $('.pro-bottom').offset();
	var left = offset.left;
	var width = offset.width;
	// 触摸开始
	$spot.on('touchstart',function(){
		// 播放停止
		root.pro.stop();
		// 触摸移动
	}).on('touchmove',function(e){
		console.log(e);
		var x = e.changedTouches[0].clientX;
		var per = (x - left)/width;
		if (per >= 0 && per <= 1) {
			// 更新进度条
			root.pro.update(per);
		}
		// 触摸结束
	}).on('touchend',function(e){
		var x = e.changedTouches[0].clientX;
		var per = (x - left) / width;
		// 播歌 currentTime pro.start(per);
		if (per >= 0 && per <= 1) {
			var curTime = per * dataList[control.index].duration;
			audio.playTo(curTime);
			audio.play();
			root.pro.start(per);
			audio.status = 'play';
			$('.play').addClass('playing');
		}
	})
}
getData('../mock/data.json');