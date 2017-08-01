<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE HTML>
<html>
<head>
<link rel="stylesheet" type="text/css" href="/vendor/css/hxzq.css" />
<link rel="stylesheet" type="text/css" href="/vendor/css/bootstrap.min.css" />
<link rel="stylesheet" type="text/css" href="/vendor/font-awesome/css/font-awesome.min.css" />
<link rel="shortcut icon" href="/vendor/images/favicon.ico" />
<script type="text/javascript" src="/vendor/js/jquery-1.12.3.min.js"></script>
<title>登录</title>
<script type="text/javascript">
	function login() {
		var formParam = $("#loginForm").serialize();//序列化表格内容为字符串  
		$.ajax({
			type : 'post',
			url : '/login',
			data : formParam,
			cache : false,
			dataType : 'json',
			success : function(data) {
				if (data.msg != null) {
					$("#msg").html(data.msg);
					return;
				}
				var userid = data.crosstable[0].userid;
				var token = data.crosstable[0].token;
				$("#msg").html("登录成功");
				var host = data.crosstable[0].host;
				var port = data.crosstable[0].port;
				var loginurl = 'http://' + host + ':' + port
						+ '/system?userid=' + userid + '&token=' + token;
				window.location.href = loginurl;
			}
		});
	}
</script>
</head>
<body style="background: #efefef no-repeat center fixed;">
	<div id="cl-wrapper" class="login-container">
		<div class="middle-login">
			<div class="block-flat">
				<div class="header">
					<h3 class="text-center">华信数据中心数据分析系统</h3>
				</div>
				<form style="margin-bottom: 0px !important;" name="loginForm"
					id="loginForm" action="/login" method="post"
					class="form-horizontal">
					<div class="content">
						<div class="form-group">
							<div class="col-sm-12">
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-user"></i></span><input
										id="username" type="text" placeholder="Username"
										name="username" class="form-control">
								</div>
							</div>
						</div>
						<div class="form-group">
							<div class="col-sm-12">
								<div class="input-group">
									<span class="input-group-addon"><i class="fa fa-lock"></i></span><input
										id="password" type="password" placeholder="Password"
										name="password" class="form-control">
								</div>
							</div>
						</div>

					</div>
					<div class="col-sm-12" style='color: red; text-align: center;'
						id="msg"></div>
					<div class="foot">
						<button data-dismiss="modal" type="button" onclick="login()"
							class="btn btn-primary">登录</button>
						<button data-dismiss="modal" type="button" class="btn btn-primary"
							id="clear">重置</button>
					</div>

				</form>
			</div>
			<div class="text-center">
				<a href="#">Copyright © 2017 华信数据中心</a>
			</div>
		</div>
	</div>
	<div class="text-center" style="bottom:0px;position: absolute;width: 100%;">
		<div style="color: #E8E8E8; font-size: 8px; font-family: sans-serif; ">Developing for a Powerful BI System</div>
	</div>
</body>
</html>