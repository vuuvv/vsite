
$(function() {
	function fBodyVericalAlign(){
		var nBodyHeight = 572;
		var nClientHeight = document.documentElement.clientHeight;
		if(nClientHeight >= nBodyHeight + 2){
			var nDis = (nClientHeight - nBodyHeight)/2;
			document.body.style.paddingTop = nDis + 'px';
		}else{
			document.body.style.paddingTop = '0px';
		}
	} 
	fBodyVericalAlign();
});
