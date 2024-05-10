/**
 * VERSION: 1.0
 * DATE: 10-28-2015
 * AUTHOR: Richard Tolenaar
 * COMPANY: AREA23
 **/

/*
	This is an ISIscroller for banners.

	auto sets _autoScroll : true or false, defaults to true
*/

var ISIScroller = function(auto){
  var _isi;
  var _container;
  var _autoScroll = auto != undefined ? auto : true;
  var _scrollDelay;
  var _scrollDuration = 30;
  var _scrollTO;
  var _scrollSpeed;
  var _scrollerInt;
  var _scrollPoint;
  var _showISI = false;

  this.start = function(duration) {
    _isi = document.getElementById('ISICopy');
    _container = document.getElementById('ISIWrapper');
    if(window.location.host.toString().indexOf('.stage.') > -1 || window.location.host.toString().indexOf('localhost') > -1){
      if(window.location.hash.toString().indexOf('ISI') > -1){
        document.body.className += 'show-isi';
        _showISI = true;
      }
    }
    setScrollSpeed();
    if(_autoScroll) this.setScrollDelay(0);
    if (duration) {
      this.setScrollDuration(duration)
    } else {
      this.setScrollDuration(300)
    }
  }

  this.setScrollDelay = function(value){
    if(!_autoScroll) return;
    clearTimeout(_scrollTO);
    _scrollDelay = value * 1000;
    _scrollTO = setTimeout(startAutoScroll, _scrollDelay);
  }

  this.setScrollDuration = function(value){

    _scrollDuration = value;
    setScrollSpeed();
  }

  this.stop = function() {
    endISIScroll();
  }

  var doISIScroll = function(){
      if(_showISI){
        endISIScroll();
        return;
      }

      if(Math.abs(_scrollPoint - _container.scrollTop) > _scrollSpeed * 6){
        // console.log(Math.abs(_scrollPoint - _container.scrollTop) > _scrollSpeed * 4)
        endISIScroll();
      }
      if((_scrollPoint >= 0 && Math.abs(_scrollPoint) < _isi.clientHeight)){
        _container.scrollTop = _scrollPoint;
      } else if(_scrollPoint > _isi.clientHeight){
        _container.scrollTop = _isi.clientHeight;
        endISIScroll();
      }
    },

    endISIScroll = function(){
      clearTimeout(_scrollTO);
      clearInterval(_scrollerInt);
    },

    startAutoScroll = function(){
      clearInterval(_scrollerInt);
      _scrollerInt = setInterval(doAutoDownScroll, 100, _scrollSpeed);
      _isi.addEventListener("wheel", function() {
        endISIScroll();
      });
    },


    doAutoDownScroll = function(speed){
      if(Math.abs(_scrollPoint - parseInt(_isi.style.marginTop)) > speed)
        endISIScroll();
      if(!_scrollPoint) _scrollPoint = 0;
      _scrollPoint += speed;
      // doISIScroll(_scrollPoint);
      doISIScroll();

      // if(-_scrollPoint <= myScroll.maxScrollY) {
      // 	// console.log(myScroll.maxScrollY);
      // 	// console.log(-_scrollPoint)
      // 	myScroll.scrollTo(0, myScroll.maxScrollY);
      // 	endISIScroll()
      // } else {
      // 	myScroll.scrollTo(0, -_scrollPoint);	// added to handle iScroll
      // }


    },

    setScrollSpeed = function() {
      _scrollSpeed = ((_isi.clientHeight - _container.clientHeight)) / (_scrollDuration * 10);

    };
};
