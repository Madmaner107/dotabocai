$(document).ready(function(){
	var rankTitle = $('.J_rank_title').find('li');
	var rankList = $('.J_rank_list');
	rankTitle.on('click',function(){
		var _this = $(this);
		var _index = _this.index();
		_this.addClass('current').siblings().removeClass('current');
		rankList.eq(_index+1).addClass('show').siblings().removeClass('show');
	});

	var upToTop = $('.J_up');
	upToTop.on('click',function(){
		$('body,html').animate({
			scrollTop:0
		},100);
	});

	var qrcode = $('.J_qr');
	qrcode.on('click',qrCtrl);
	$('body').on('click',function () {
		if(qrcode.hasClass('qr-active')){
			qrcode.removeClass('qr-active');
		}
	});

	function qrCtrl(e){
		e.stopPropagation();
		if(qrcode.hasClass('qr-active')){
			qrcode.removeClass('qr-active');
		}else{
			qrcode.addClass('qr-active');
			$('.J_qr_detail').addClass('fadeInRight');
		}
	}

	//点击免登陆试玩 弹窗
	$('.J_try').on('click',function(){
		$('.mask').addClass('show');
		$('.popup-demo').addClass('show');
	}); 
	$('.icon-close').on('click',function(){
		$('.mask').removeClass('show');
		$('.popup-demo').removeClass('show');
	})

	//向上跑马灯
	var train = $('.J_train');
	var top = 0;
	setInterval(function(){
		if(top == -180){
			top = 0;
			train.find('li').last().after(train.find('li').first());
		}
		train.css('margin-top',top-=1)
	},50);
});