(function($,root){
	var frameId;
	var dur;
	var lastPer = 0;
	var startTime;
	// 开始时间 进度条 总时间duration
	// 参数是无样式总时间
	function renderAllTime(time){
		// 给dur赋值，赋上总时间
		dur = time;
		// 总时间样式插入dom中
		// 定义time接收一个有样式时间
		time = formatTime(time);
		$('.all-time').html(time);
	}
	function formatTime(time){
		time = Math.round(time);
		// 获取分钟数
		var m = Math.floor(time/60);
		// 获取秒数
		var s = time % 60;
		m = m < 10 ? '0' + m : m;
		s = s < 10 ? '0' + s : s;
		// 返回总时间整分整秒的样式
		return m + ':' + s;
	}

	function start(p){
		lastPer = p == undefined ? lastPer : p;
		// 当前时间是距1970是多少毫秒
		// 第一个时间戳
		startTime = new Date().getTime();
		// 帧函数
		function frame(){
			// 第二个时间戳
			var curTime = new Date().getTime();
			// 单个时间段走的百分比，这个百分比不能小于0，不能大于1
			var per = lastPer + (curTime - startTime)/(dur
				*1000);
			if (per <= 1) {
				// 更新dom区域
				update(per);
			}else{
				// 延迟器取消
				cancelAnimationFrame(frameId);
			}
			// requestAnimationFrame更新的时间是16.7毫秒
			// 每16.7毫秒执行一次frame
			frameId = requestAnimationFrame(frame);
		}
		// frame执行一次
		frame();
	}

	function stop(){
		cancelAnimationFrame(frameId);
		var stopTime = new Date().getTime();
		lastPer = lastPer + (stopTime - startTime)/(dur*1000);
	}
	// 更新dom区域
	function update(per){
		// 时间 进度条运动
		var time = formatTime(dur*per);
		$('.cur-time').html(time);
		var perX = (per - 1)*100 + '%';
		$('.pro-top').css({
			'transform': 'translateX(' + perX + ')'
			})
	}

	root.pro = {
		renderAllTime:renderAllTime,
		start:start,
		stop:stop,
		update:update
	}
})(window.Zepto,window.player || (window.player = {} ))