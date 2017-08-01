// AnyChat for Web SDK
/********************************************
 *				业务逻辑控制				*
 *******************************************/

//var mDefaultServerAddr = "demo.anychat.cn";		// 默认服务器地址
var mDefaultServerAddr = "192.168.20.251";
var mDefaultServerPort = 8096;			// 默认服务器端口号
var mServerId = 0;
var mSelfUserId = -1; 							// 本地用户ID
var mTargetUserId = -1;							// 目标用户ID（请求了对方的音视频）
var mRefreshVolumeTimer = -1; 					// 实时音量大小定时器
var mRefreshPluginTimer = -1;					// 检查插件是否安装完成定时器
var userObj=null;
var twoWayObj=null;
var progressBar=null;


// 日志记录类型，在日志信息栏内显示不同的颜色
var LOG_TYPE_NORMAL = 0;
var LOG_TYPE_API = 1;
var LOG_TYPE_EVENT = 2;
var LOG_TYPE_ERROR = 3;

// 通知类型，在文字消息栏内显示不同的颜色
var NOTIFY_TYPE_NORMAL = 0;
var NOTIFY_TYPE_SYSTEM = 1;
//录制类型
var record_type=0; //0服务器录制, 1本地录制
var record_id= 0; //0是对方，1是自己
var record_model=1; //
var changeID = -1;//1 画中画录制，0 并列录制
var format = 0;

var userCount = 0; //user online
var videoUrl = "";						//合并录像地址
var dwFlags = 307;


var debug=true;
function AddLog(message, type) {
  if(debug){
    var str='';
    switch (type){
      case "LOG_TYPE_API":str='API调用';break;
      case "LOG_TYPE_EVENT":str='回调事件';break;
      case "LOG_TYPE_ERROR":str='出错';break;
      default:str='日志';break;
    }
    console.log(str+":"+(new Date()).toLocaleString()+" "+message);
  }
}
//进度条
function Progress() {
  var p_value="",p_text="";
  var barIn=document.getElementById("barIn");
  var barText=document.getElementById("barText");
  var mask=document.getElementById("mask");
  var loading=document.getElementById("loading");
  var scrollHeight=document.documentElement.scrollHeight;
  var clientHeight=document.documentElement.clientHeight;
  var hei=(scrollHeight>clientHeight?scrollHeight+"px":clientHeight+"px");
  mask.style.height=hei;

  function p_close(){
    mask.className='mask hide';
    loading.className="loading hide";
  }
  return {
    setValue:function (value,text) {
      if(value){
        barIn.style.width=value+"%";
      }
      if(text){
        barText.innerHTML=text;
      }
      if(value*1==100){
        p_close();
      }
    },
    open:function () {
      mask.className='mask';
      loading.className="loading";
    },
    close:p_close
  }
}
//退出
function LoginOut(){
  //离开房间
  mSelfUserId = -1; 							// 本地用户ID
  mTargetUserId = -1;							// 目标用户ID（请求了对方的音视频）
  clearInterval(mRefreshVolumeTimer);
  clearInterval(mRefreshPluginTimer);
  clearInterval(progressBar);
  mRefreshVolumeTimer = null; 					// 实时音量大小定时器
  mRefreshPluginTimer = null;					// 检查插件是否安装完成定时器
  progressBar=null;
  userObj=null;
  twoWayObj=null;
  BRAC_LeaveRoom(-1);
  BRAC_Logout();

}


function upload() {
  fileId = BRAC_TransFile(mServerId, videoUrl, mTargetUserId, 0, 0);
  AddLog("进度条fileId:"+fileId);
  var bar=new Progress();
  bar.open();
  progressBar = setInterval(function() {
    var PROGRESS = BRAC_QueryTransTaskInfo(mSelfUserId, fileId, 1);
    if (PROGRESS > 5) {
      bar.setValue(PROGRESS,"文件上传中,上传进度:"+PROGRESS+"%");

//			GetID("uploadText").innerHTML = PROGRESS;
      if (PROGRESS == 100) {
        window.clearInterval(progressBar);
        bar.close();
      }
    }
  }, 100);
}
function RequestOtherUserVideo(userid) {
//    var userlist = GetID("room_div_userlist");
  // 获得用户列表中所有<a>标签
//    var userdivobj = userlist.getElementsByTagName("div");
//    for (var i = 0; i < userdivobj.length; i++) {
//        userdivobj[i].style.backgroundColor = "White";
//    }
  // 获取用户列表中所有<img>标签
//    var userimgobj = userlist.getElementsByTagName("img");
//    for (var j = 0; j < userimgobj.length; j++) {
//        if (userimgobj[j].getAttribute("class") == "MicrophoneTag") { // 该图片为 话筒 图片
//            userimgobj[j].src = "./images/advanceset/microphone_false.png";
//            userimgobj[j].onclick = ""; // 删除话筒按钮点击事件
//            userimgobj[j].style.cursor = "";
//        }
//    }
  //mTargetUserId = userid; 					//设置被点用户ID为全局变量
  // 判断是否需要关闭之前已请求的用户音视频数据
 // if (mTargetUserId != -1) {
   // BRAC_UserCameraControl(mTargetUserId, 0);
    //BRAC_UserSpeakControl(mTargetUserId, 0);
 // }
//    GetID(userid + "_MicrophoneTag").src = "./images/advanceset/microphone_true.png"; // 点亮话筒图片
//    GetID(userid + "_UserDiv").style.backgroundColor = "#E6E6E6"; //设置被点击<a>元素的字体颜色

 // mTargetUserId = userid; 					//设置被点用户ID为全局变量
 AddLog("打开对方视频,用户id:"+userid,"info");
  BRAC_UserCameraControl(mTargetUserId, 1); 		// 请求对方视频
  BRAC_UserSpeakControl(mTargetUserId, 1); 		// 请求对方语音
  // 设置远程视频显示位置
  var remote=document.getElementById("remote");
  BRAC_SetVideoPos(userid, remote, "ANYCHAT_VIDEO_REMOTE");
//    MicrophoneOnclick(userid); // 为当前视频会话用户话筒按钮添加点击事件
}
/********************************************
 *				事件回调部分				*
 *******************************************/

 // 异步消息通知，包括连接服务器、登录系统、进入房间等消息
function OnAnyChatNotifyMessage(dwNotifyMsg, wParam, lParam) {
	switch(dwNotifyMsg) {
		case WM_GV_CONNECT:			OnAnyChatConnect(wParam, lParam);			break;
		case WM_GV_LOGINSYSTEM:		OnAnyChatLoginSystem(wParam, lParam);		break;
		case WM_GV_ENTERROOM:		OnAnyChatEnterRoom(wParam, lParam);			break;
		case WM_GV_ONLINEUSER:		OnAnyChatRoomOnlineUser(wParam, lParam);	break;
		case WM_GV_USERATROOM:		OnAnyChatUserAtRoom(wParam, lParam);		break;
		case WM_GV_LINKCLOSE:		OnAnyChatLinkClose(wParam, lParam);			break;
		case WM_GV_MICSTATECHANGE:	OnAnyChatMicStateChange(wParam, lParam);	break;
		case WM_GV_CAMERASTATE:		OnAnyChatCameraStateChange(wParam, lParam);	break;
		case WM_GV_P2PCONNECTSTATE:	OnAnyChatP2PConnectState(wParam, lParam);	break;
		case WM_GV_PRIVATEREQUEST:	OnAnyChatPrivateRequest(wParam, lParam);	break;
		case WM_GV_PRIVATEECHO:		OnAnyChatPrivateEcho(wParam, lParam);		break;
		case WM_GV_PRIVATEEXIT:		OnAnyChatPrivateExit(wParam, lParam);		break;
		case WM_GV_USERINFOUPDATE:	OnAnyChatUserInfoUpdate(wParam, lParam);	break;
		case WM_GV_FRIENDSTATUS:	OnAnyChatFriendStatus(wParam, lParam);		break;
		default:
			break;
	}
}
// 日志记录类型，在日志信息栏内显示不同的颜色
var LOG_TYPE_NORMAL = 0;
var LOG_TYPE_API = 1;
var LOG_TYPE_EVENT = 2;
var LOG_TYPE_ERROR = 3;

// 收到文字消息
function OnAnyChatTextMessage(dwFromUserId, dwToUserId, bSecret, lpMsgBuf, dwLen) {
  AddLog("收到文字消息",LOG_TYPE_NORMAL);
	//DisplayTextMessage(dwFromUserId, lpMsgBuf);
}

// 收到透明通道传输数据
function OnAnyChatTransBuffer(dwUserId, lpBuf, dwLen) {
	//alert("收到:"+dwUserId+"用户发送过来的透明通道数据数据："+lpBuf);
}

// 收到透明通道（扩展）传输数据
function OnAnyChatTransBufferEx(dwUserId, lpBuf, dwLen, wParam, lParam, dwTaskId) {
	//alert("收到:"+dwUserId+"用户发送过来的扩展透明通道数据数据："+lpBuf);
}

// 文件传输完成通知
function OnAnyChatTransFile(dwUserId, lpFileName, lpTempFilePath, dwFileLength, wParam, lParam, dwTaskId) {

	alert("收到文件:"+dwUserId+"用户发送过来的文件："+"接收路径在："+lpTempFilePath);
}

// 系统音量改变通知
function OnAnyChatVolumeChange(device, dwCurrentVolume) {

}

// 收到服务器发送的SDK Filter数据
function OnAnyChatSDKFilterData(lpBuf, dwLen) {

}

// 收到录像或拍照完成事件
function OnAnyChatRecordSnapShot(dwUserId, lpFileName, dwParam, bRecordType) {
    AddLog("触发事件:OnAnyChatRecordSnapShot;文件保存路径:"+lpFileName,LOG_TYPE_NORMAL);
    AddLog("收到录像或拍照完成事件,用户id:"+mTargetUserId,"info");
		if(bRecordType==0){
			var picUrl = lpFileName;
      AddLog("拍照完毕,准备上传!文件保存路径:"+picUrl,LOG_TYPE_NORMAL);
      BRAC_TransFile(mServerId, picUrl, mTargetUserId, 0, 0);
		}else if(bRecordType==1){
			videoUrl = lpFileName;
      AddLog("录像完毕,准备上传!文件保存路径:"+videoUrl,LOG_TYPE_NORMAL);
			upload();
		}
	}
function OnAnyChatRecordSnapShotEx(dwUserId, lpFileName, dwElapse, dwFlags, dwParam, lpUserStr) {
	console.log(dwUserId+"ex");
}




/********************************************
 *		AnyChat SDK核心业务流程				*
 *******************************************/

// 客户端连接服务器，bSuccess表示是否连接成功，errorcode表示出错代码
function OnAnyChatConnect(bSuccess, errorcode) {
	  AddLog("OnAnyChatConnect(errorcode=" + errorcode + ")", LOG_TYPE_EVENT);
    let self=window.logicObj,{me}=self.state;
    AddLog("BRAC_Login(emp"+me.id+","+me.password+", 0)","info");
    if (errorcode == 0) {
      let rs = BRAC_Login("emp"+me.id, me.password, 0);
    }
    else {
      let {alert}=self.state;
      alert.type="danger";
      alert.text="服务器连接失败";
      alert.show=true;
      self.setState({loading:false,alert:alert});
    }
}

// 客户端登录系统，dwUserId表示自己的用户ID号，errorcode表示登录结果：0 成功，否则为出错代码，参考出错代码定义
function OnAnyChatLoginSystem(dwUserId, errorcode) {
  let self=window.logicObj;
  self.setState({loading:false});
	AddLog("OnAnyChatLoginSystem(userid=" + dwUserId + ", errorcode=" + errorcode + ")", LOG_TYPE_EVENT);
    if (errorcode == 0) {
		  mSelfUserId = dwUserId;
      var rs=BRAC_EnterRoom(self.state.customer.roomid, "", 0);
    } else {
      let {alert}=self.state;
      alert.type="danger";
      alert.text="登录失败";
      alert.show=true;
      self.setState({loading:false,alert:alert});
    }

}

// 客户端进入房间，dwRoomId表示所进入房间的ID号，errorcode表示是否进入房间：0成功进入，否则为出错代码
function OnAnyChatEnterRoom(dwRoomId, errorcode) {
    let self=window.logicObj;
    self.setState({loading:false});
	  AddLog("OnAnyChatEnterRoom(roomid=" + dwRoomId + ", errorcode=" + errorcode + ")", LOG_TYPE_EVENT);
    if (errorcode == 0) {
      var href=window.location.href;
      self.toVideo();
      if(href.lastIndexOf("/TwoWayVideo")!==25){

      }
      AddLog("进入房间了", LOG_TYPE_EVENT);
		  //ShowNotifyMessage("Welcome use AnyChat, successfully enter the room:" + dwRoomId, NOTIFY_TYPE_SYSTEM);
      var localVideo=document.getElementById("local");
      var remoteVideo=document.getElementById("remote");
      var localVolume=document.getElementById("local_volume");
      var remoteVolume=document.getElementById("remote_volume");
      // 设置本地视频显示位置
      BRAC_SetVideoPos(mSelfUserId, localVideo, "ANYCHAT_VIDEO_LOCAL");
      // 设置远程视频显示位置（没有关联到用户，只是占位置）
      BRAC_SetVideoPos(0, remoteVideo, "ANYCHAT_VIDEO_REMOTE");
      //RoomUserListControl(mSelfUserId, true);		// 将自己插入用户列表
      BRAC_UserCameraControl(mSelfUserId, 1);  // 打开本地视频
      BRAC_UserSpeakControl(mSelfUserId, 1); 		// 打开本地语音
      clearInterval(mRefreshVolumeTimer);
      mRefreshVolumeTimer = setInterval(function () {
        localVolume.style.width = BRAC_QueryUserStateInt(mSelfUserId, BRAC_USERSTATE_SPEAKVOLUME)  + "%";
        if(mTargetUserId != -1)
          remoteVolume.style.width = BRAC_QueryUserStateInt(mTargetUserId, BRAC_USERSTATE_SPEAKVOLUME) + "%";
			  else
          remoteVolume.style.width = "0";
      }, 100);
    } else {
      let {alert}=self.state;
      alert.type="danger";
      alert.text="进入房间失败";
      alert.show=true;
      self.setState({loading:false,alert:alert});
    }


	//var tag=BRAC_RECORD_FLAGS_VIDEO+BRAC_RECORD_FLAGS_AUDIO+BRAC_RECORD_FLAGS_MIXVIDEO+BRAC_RECORD_FLAGS_MIXAUDIO+BRAC_RECORD_FLAGS_STEREO;
	//setTimeout(BRAC_StreamRecordCtrl(-1,1,tag,0), 5000);
}

// 收到当前房间的在线用户信息，进入房间后触发一次，dwUserCount表示在线用户数（包含自己），dwRoomId表示房间ID
function OnAnyChatRoomOnlineUser(dwUserCount, dwRoomId) {
	AddLog("OnAnyChatRoomOnlineUser(count=" + dwUserCount + ", roomid=" + dwRoomId + ")", LOG_TYPE_EVENT);
	userCount = dwUserCount;
	if(userCount > 2){
		LoginOut();
		alert("在线人数超过2人");
		return;
	}
  AddLog("BRAC_GetOnlineUser()","info")
	var useridlist = BRAC_GetOnlineUser();
	// 请求其中一个用户的音视频
	for (var k=0; k<useridlist.length; k++) {
		if(useridlist[k] == mSelfUserId)
			continue;
    AddLog("OnAnyChatRoomOnlineUser--请求打开对方视频:"+useridlist[k],"info");
		RequestOtherUserVideo(useridlist[k]);
		break;
	}

}

// 用户进入（离开）房间，dwUserId表示用户ID号，bEnterRoom表示该用户是进入（1）或离开（0）房间
function OnAnyChatUserAtRoom(dwUserId, bEnterRoom) {
	AddLog("OnAnyChatUserAtRoom(userid=" + dwUserId + ", benter=" + bEnterRoom + ")", LOG_TYPE_EVENT);
  let self=window.logicObj;
	//RoomUserListControl(dwUserId, bEnterRoom ? true : false);
    if (bEnterRoom == 1) {
		  AddLog(BRAC_GetUserName(dwUserId) +"&nbsp;enter room!", NOTIFY_TYPE_NORMAL);
      RequestOtherUserVideo(dwUserId);
    }else {
      BRAC_StreamRecordCtrl(mSelfUserId, 0, dwFlags, 123456);
    	//意外中断
      if(twoWayObj){
        twoWayObj.stopTime();
      }
    	LoginOut();
    	alert("用户异常中断!",2000);

		AddLog(BRAC_GetUserName(dwUserId) +"&nbsp;leave room!", NOTIFY_TYPE_NORMAL);
        if (dwUserId == mTargetUserId) {			// 当前被请求的用户离开房间，默认请求房间中其它用户的音视频
			var bRequestOtherUser = false;
			var useridlist = BRAC_GetOnlineUser();
			for (var k=0; k<useridlist.length; k++) {
				if(useridlist[k] == mSelfUserId)
				continue;
				RequestOtherUserVideo(useridlist[k]);
				bRequestOtherUser = true;
				break;
			}
			if(!bRequestOtherUser) {				// 如果没有其它用户在线，则清除状态
				mTargetUserId = -1;
        var remoteVideo=document.getElementById("remote");
				BRAC_SetVideoPos(0, remoteVideo, "ANYCHAT_VIDEO_REMOTE");
			}
		}
    }
//    DisplayScroll("room_div_userlist");
}

// 网络连接已关闭，该消息只有在客户端连接服务器成功之后，网络异常中断之时触发，reason表示连接断开的原因
function OnAnyChatLinkClose(reason, errorcode) {
	AddLog("OnAnyChatLinkClose(reason=" + reason + ", errorcode=" + errorcode + ")", LOG_TYPE_EVENT);
  let self=window.logicObj,{alert}=self.state;
  self.setState({loading:false});
  BRAC_StreamRecordCtrl(mSelfUserId, 0, dwFlags, 123456);
  if(twoWayObj){
    twoWayObj.stopTime();
    twoWayObj.toHome();
  }

	LoginOut();
  alert.type="danger";
  alert.text="与服务器连接中断";
  alert.show=true;
	setTimeout(function () {
    self.setState({alert:alert});
  },2000);

//	reset();
//	server add log
//	log(getTimeStr()+":[" + userId + "]OnAnyChatLinkClose(reason=" + reason + ", errorcode=" + errorcode + ")");
}

// 用户的音频设备状态变化消息，dwUserId表示用户ID号，State表示该用户是否已打开音频采集设备（0：关闭，1：打开）
function OnAnyChatMicStateChange(dwUserId, State) {

}

// 用户摄像头状态发生变化，dwUserId表示用户ID号，State表示摄像头的当前状态（0：没有摄像头，1：有摄像头但没有打开，2：打开）
function OnAnyChatCameraStateChange(dwUserId, State) {
    if (State == 0) GetID(dwUserId + "_CameraTag").src = "";
//    if (State == 1) GetID(dwUserId + "_CameraTag").src = "./images/advanceset/camera_false.png";
//    if (State == 2) GetID(dwUserId + "_CameraTag").src = "./images/advanceset/camera_true.png";
}

// 本地用户与其它用户的P2P网络连接状态发生变化，dwUserId表示其它用户ID号，State表示本地用户与其它用户的当前P2P网络连接状态（0：没有连接，1：仅TCP连接，2：仅UDP连接，3：TCP与UDP连接）
function OnAnyChatP2PConnectState(dwUserId, State) {

}

// 用户发起私聊请求，dwUserId表示发起者的用户ID号，dwRequestId表示私聊请求编号，标识该请求
function OnAnyChatPrivateRequest(dwUserId, dwRequestId) {

}

// 用户回复私聊请求，dwUserId表示回复者的用户ID号，errorcode为出错代码
function OnAnyChatPrivateEcho(dwUserId, errorcode) {

}

// 用户退出私聊，dwUserId表示退出者的用户ID号，errorcode为出错代码
function OnAnyChatPrivateExit(dwUserId, errorcode) {

}

// 视频通话消息通知回调函数
function OnAnyChatVideoCallEvent(dwEventType, dwUserId, dwErrorCode, dwFlags, dwParam, szUserStr) {
	AddLog("OnAnyChatVideoCallEvent(dwEventType=" + dwEventType + ", dwUserId=" + dwUserId + ", dwErrorCode=" + dwErrorCode + ", dwFlags=" + dwFlags + ", dwParam=" + dwParam + ", szUserStr=" + szUserStr + ")", LOG_TYPE_EVENT);

}

// 用户信息更新通知，dwUserId表示用户ID号，dwType表示更新类别
function OnAnyChatUserInfoUpdate(dwUserId, dwType) {
	AddLog("OnAnyChatUserInfoUpdate(dwUserId=" + dwUserId + ", dwType=" + dwType + ")", LOG_TYPE_EVENT);
}

// 好友在线状态变化，dwUserId表示好友用户ID号，dwStatus表示用户的当前活动状态：0 离线， 1 上线
function OnAnyChatFriendStatus(dwUserId, dwStatus) {
	AddLog("OnAnyChatFriendStatus(dwUserId=" + dwUserId + ", dwStatus=" + dwStatus + ")", LOG_TYPE_EVENT);

}

