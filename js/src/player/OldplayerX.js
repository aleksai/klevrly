/**
 * @author airaguha
 */

/*
 * Example JS Chromeless Player
 * http://code.google.com/apis/youtube/chromeless_example_1.html
 * 
 * IFrame Player
 * http://code.google.com/apis/youtube/iframe_api_reference.html
 */

  //Load player api asynchronously.
	var tag = document.createElement('script');
	tag.src = "http://www.youtube.com/player_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	var done = false;
	var player;
	function onYouTubePlayerAPIReady() {
	    player = new YT.Player('player', {
	      height: '200',
	      width: '250',
	      wmode: 'transparent',
	      playerVars: { 'autoplay': 0, 'controls': 0, 'autohide':2, 'color':'white' },
	      events: {
	        'onReady': onPlayerReady,
	        'onStateChange': onPlayerStateChange,
	        'onError':onPlayerError
	      }
	      
	    });
	    //setInterval(onPlayerTimer,250);
	}
	
	var iCount = 0;
	function onPlayerTimer()
	{
		iCount++;
		var str = getCurrentTime() + " / " + getDuration();
		$("#player_current_time").html(str);
		
		var progress_percent = Math.round(player.getCurrentTime()/player.getDuration()*100);
		if(progress_percent >=0)
		{
			$("#progress_slider").slider('value', progress_percent);
			
		}
		
		
		var loading_percent = Math.round(getBytesLoaded()/getBytesTotal()*100);
		if(loading_percent>=0)
		{
			$("#loading_slider").slider('value', loading_percent);
		}
		
	}
	
	function onPlayerReady(evt) 
	{
        console.log('player ready');
        loadVideo();
	    /*player.setPlaybackQuality("large");
	    $("#volume_slider").slider('value', player.getVolume());
	    lastVolume = getVolume();
	    if(isIpad)
	    {
	    	$("#player").show();
	    	
	    }*/
	}
	
	var ERROR_NO_PLAYBACK = 101;
	var ERROR_NO_PLAYBACK2 = 150;
	function onPlayerError(evt)
	{
        console.log('Player Error: ' + evt.data);
		/*if(evt.data == ERROR_NO_PLAYBACK || evt.data == ERROR_NO_PLAYBACK2)
		{
			//alert("error - embed disabled - " + evt.data);
			playNextYoutubeMatch();
		}*/
		
	}
	
	function onPlayerStateChange(evt) 
	{
		
	    /*if (evt.data == YT.PlayerState.PLAYING && !done)
	    {
	       	$("#player").show();
	        $("#player_error").html("Playing");
	        
			$("#btn_player_play").removeClass("btn_player_paused");
			$("#btn_player_play").addClass("btn_player_playing");
				
			if(appCollapsed)
			{
				//expandApp();
			}
	    }
	    else if (evt.data == YT.PlayerState.PAUSED) 
	    {
	    	$("#player_error").html("Paused");
			
			$("#btn_player_play").removeClass("btn_player_playing");
			$("#btn_player_play").addClass("btn_player_paused");
			
	    }
	    else if(evt.data == YT.PlayerState.BUFFERING)
	    {
	    	$("#player_error").html("Buffering");
	    	 $("#player_wrapper").show();
	    }
	    else if(evt.data == 0)
	    {
	    	$("#btn_player_play").removeClass("btn_player_playing");
			$("#btn_player_play").addClass("btn_player_paused");
			
	    	if(playlistCount>0)
	    	{
	    		playlistNext();
	    	}
	    	
	    }
	    else
	    {
	    	//alert(evt.data)
	    	//$("#player_error").html(evt.data);
	    }*/
	    
	    
	}
	
	function stopVideo() 
	{
	    player.stopVideo();
	}
	
	function pauseVideo() 
	{
	    player.pauseVideo();
	}
	
	function playVideo() 
	{
	    player.playVideo();
	}
	
	 function loadVideo() 
	 {
	    player.loadVideoById("Wb5VOQexMBU");
	    player.playVideo();
	}
	
	function loadVideo2() {
	    player.loadVideoById("FlsBObg-1BQ");
	    player.playVideo();
	}
	
	function loadNewVideo(id, title, artistName, startSeconds) {
	  if (player) 
	  {
	  	
	    player.loadVideoById(id, parseInt(startSeconds));
	    
	    if(artistName == null)
	    {
	    	artistName = "";
	    }
	    
	    updatePlayerTrackInfo(title,artistName);
	    
	   /* var titlelink = "<div class='player_title_wrapper'><a class='vid_info'  href='javascript:loadNewVideo(\""+ id +"\")'>"+title+"</a></div>";
	    
	    var artist = "";
	    if(artistName!=null)
	    {
	    	artist = "<a class='artist_info' href='#/artist/"+ artistName + "/" +"'>"+ artistName +"</a>"
	    }
		
			//alert(title + " by " + artist)		
		$("#player_info").html(titlelink + artist);*/
	    
				
	  }
	}
	
	function resetPlayer()
	{
		//var str = getCurrentTime() + " / " + getDuration();
		//$("#player_current_time").html(str);
	}
	
	
	function loadNewTrack(id, startSeconds) {
	  //alert("trying: " + id);
	  if (player) 
	  {
	  	resetPlayer();
	    player.loadVideoById(id, parseInt(startSeconds));
	  }
	}
	
	var videoMatches;	//array of playable vdieos
	var currentVidIndex = 0;
	function playfromYouTube(vidArray)
	{
		videoMatches = vidArray;
		currentVidIndex = 0;
		loadNewTrack(videoMatches[currentVidIndex]);
	}
	
	function playNextYoutubeMatch()
	{
		currentVidIndex++;
		
		if(videoMatches && videoMatches.length >= currentVidIndex)
		{
			loadNewTrack(videoMatches[currentVidIndex]);
		}
		
	}
	
	function togglePlay()
	{
		if(player)
		{
			var state = player.getPlayerState();
			if(state!=YT.PlayerState.PLAYING)
			{
				player.playVideo();
				
				//$("#btn_player_play").removeClass("btn_player_play");
				//$("#btn_player_play").addClass("btn_player_pause");
			}
			else if(state==YT.PlayerState.PLAYING)
			{
				player.pauseVideo();
				//$("#btn_player_play").removeClass("btn_player_pause");
				//$("#btn_player_play").addClass("btn_player_play");
			}
		}
		
	}
	
	function updateplayerInfo() {
		
		var percentComplete=0;
		
		var state = player.getPlayerState();
		if(state==YT.PlayerState.PLAYING)
		{
			if(getBytesLoaded()!=0 && getBytesTotal()!=0)
			{
				percentComplete = Math.round(getBytesLoaded()/getBytesTotal()*100);
				
			}
			
			
			$("#debug").html(percentComplete + " %");
			
			if(percentComplete < 100)
			{
				//$("#player_current_time").html(getCurrentTime());
				//$("#player_total_time").html(getDuration());
				
				var bytlesLoaded = addCommas(getBytesTotal());
				updateHTML("bytespercent", percentComplete + "%");
				updateHTML("bytesloaded", addCommas(getBytesLoaded()));
				updateHTML("bytestotal",bytlesLoaded );
				//updateHTML("videoduration", getDuration());
				//updateHTML("player_current_time", getCurrentTime());
				updateHTML("startbytes", getStartBytes());
				  //updateHTML("volume", getVolume());
			}
		}
		
		
	
	
	
	}
	
	function setVolume(val)
	{
		if(player)
		{
			player.setVolume(val)
		}
		
	}
	
	function getVolume()
	{
		if(player)
		{
			return player.getVolume();
		}
		
	}
	
	var lastVolume;
	function toggleMute()
	{
		/*if(getVolume()==0)
		{
			setVolume(lastVolume);
			$("#volume_slider").slider('value', lastVolume);
		}
		else
		{
			setVolume(0);
			$("#volume_slider").slider('value', 0);
			lastVolume = getVolume();
		}*/
		
		setVolume(0);
		$("#volume_slider").slider('value', 0);
	}
	
	function formatSeconds(secondsIn)
	{
		var minStr = "00";
		var secStr = "00";
			
		if(secondsIn!=null && secondsIn!= 00)
		{
			var secInt = parseInt(secondsIn);
			var minStr = "";
			var secStr = "";
			
			var min = Math.floor(secInt/60);
			var secs = secInt % 60;
			
			if(min==0)
			{
				minStr = "00";
			}
			else if(min<10)
			{
				minStr = "0" + min;
			}
			else
			{
				minStr = min;
			}
			
			if(secs == 0)
			{
				secStr = "00";
			}
			else if(secs<10)
			{
				secStr = "0" + secs;
			}
			else
			{
				secStr = secs;
			}
		}
		
		return minStr + ":" + secStr;
	}
	
	
	function updateHTML(elmId, value) 
	{
	  document.getElementById(elmId).innerHTML = value;
	}
	
	function getDuration() 
	{
	  if (player) 
	  {
	    return formatSeconds(player.getDuration());
	  }
	}
	
	function getCurrentTime() 
	{
	  if (player) 
	  {
	    return formatSeconds(player.getCurrentTime());
	  }
	}
	
	 function getBytesLoaded() 
	 {
	  if (player) 
	  {
	    return Math.round(player.getVideoBytesLoaded()/1000000*10)/10 ;
	  }
	}
	
	function getBytesTotal() 
	{
	  if (player) {
	    return Math.round(player.getVideoBytesTotal()/1000000*10)/10;
	  }
	}
	
	function getStartBytes() 
	{
	  if (player) {
	    return player.getVideoStartBytes();
	  }
	}
	
	function seekTo(seconds) {
	  if (player) {
	    player.seekTo(seconds, true);
	  }
	}		
	
	function seekToPercent(val)
	{
		var secs = Math.round(val/100* player.getDuration());
		seekTo(secs);
	}	
		
/*function updateHTML(elmId, value) {
  document.getElementById(elmId).innerHTML = value;
}

function setplayerState(newState) {
  updateHTML("playerstate", newState);
}

function onYouTubePlayerReady(playerId) {
  player = document.getElementById("myplayer");
  setInterval(updateplayerInfo, 250);
  updateplayerInfo();
  player.addEventListener("onStateChange", "onplayerStateChange");
  player.addEventListener("onError", "onPlayerError");
  //cueNewVideo("u1zgFlCw8Aw");
}

var PLAYER_STATE_PLAYING = 1;
var PLAYER_STATE_PAUSED = 2;
var PLAYER_STATE_BUFFERING = 3;
var PLAYER_STATE_CUED = 5;
var PLAYER_STATE_ENDED = -1;

function onplayerStateChange(newState) 
{
  setplayerState(newState);
  if(newState == PLAYER_STATE_PLAYING)
  {
  		$("#btn_player_play").removeClass("btn_player_play");
		$("#btn_player_play").addClass("btn_player_pause");
  }
  else if(newState == PLAYER_STATE_PAUSED)
  {
  		$("#btn_player_play").removeClass("btn_player_pause");
		$("#btn_player_play").addClass("btn_player_play");
  }
  else if(newState == PLAYER_STATE_ENDED)
  {
  		//$("#btn_player_play").removeClass("btn_player_pause");
		//$("#btn_player_play").addClass("btn_player_play");
  }
  
}

function onPlayerError(errorCode) 
{
	var error_string;
	if(errorCode == 150 || errorCode == 101)
	{
		error_string = "Embedding is not allowed for this video.";
	}
	else if(errorCode == 100)
	{
		error_string = "Video not found. It might have been removed by it's owner";
	}
	else if(errorCode == 2)
	{
		errorCode = "The video provided is invalid.";
	}
	else
	{
		error_string = "Error: " + errorCode; 
	}
	
	$("#player_error").html(error_string);
	$("#player_error").fadeIn().delay(2000).fadeOut();
  //alert("An error occured: " + errorCode);
}

function updateplayerInfo() {
  updateHTML("bytesloaded", getBytesLoaded());
  updateHTML("bytestotal", getBytesTotal());
  updateHTML("videoduration", getDuration());
  updateHTML("videotime", getCurrentTime());
  updateHTML("startbytes", getStartBytes());
  updateHTML("volume", getVolume());
}

// functions for the api calls
function loadNewVideo(id, startSeconds) {
  if (player) {
    player.loadVideoById(id, parseInt(startSeconds));
  }
}

function cueNewVideo(id, startSeconds) {
  if (player) {
    player.cueVideoById(id, startSeconds);
  }
}

function togglePlay()
{
	if(player)
	{
		var state = getPlayerState();
		if(state!=1)
		{
			player.playVideo();
			//$("#btn_player_play").removeClass("btn_player_play");
			//$("#btn_player_play").addClass("btn_player_pause");
		}
		else if(state==1)
		{
			player.pauseVideo();
			//$("#btn_player_play").removeClass("btn_player_pause");
			//$("#btn_player_play").addClass("btn_player_play");
		}
	}
	
}

function play() {
  if (player) {
    player.playVideo();
  }
}

function pause() {
  if (player) {
    player.pauseVideo();
  }
}

function stop() {
  if (player) {
    player.stopVideo();
  }
}

function getPlayerState() {
  if (player) {
    return player.getPlayerState();
  }
}

function seekTo(seconds) {
  if (player) {
    player.seekTo(seconds, true);
  }
}

function getBytesLoaded() {
  if (player) {
    return player.getVideoBytesLoaded();
  }
}

function getBytesTotal() {
  if (player) {
    return player.getVideoBytesTotal();
  }
}

function getCurrentTime() {
  if (player) {
    return player.getCurrentTime();
  }
}

function getDuration() {
  if (player) {
    return player.getDuration();
  }
}

function getStartBytes() {
  if (player) {
    return player.getVideoStartBytes();
  }
}

function mute() {
  if (player) {
    player.mute();
  }
}

function unMute() {
  if (player) {
    player.unMute();
  }
}

function getEmbedCode() {
  alert(player.getVideoEmbedCode());
}

function getVideoUrl() {
  alert(player.getVideoUrl());
}

function setVolume(newVolume) {
  if (player) {
    player.setVolume(newVolume);
  }
}

function getVolume() {
  if (player) {
    return player.getVolume();
  }
}

function clearVideo() {
  if (player) {
    player.clearVideo();
  }
}        */