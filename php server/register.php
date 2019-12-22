<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if(!isset($_POST)) die();

session_start();

$response = [];

$con = mysqli_connect('localhost','root','','user_info');

$username = mysqli_real_escape_string($con, $_POST['username']);
$password = mysqli_real_escape_string($con, $_POST['password']);
$gender = mysqli_real_escape_string($con, $_POST['gender']);
$email = mysqli_real_escape_string($con, $_POST['email']);

$query = "INSERT INTO `loginappp_userinfo` (username,password,email,gender) VALUES ('$username','$password','$email','$gender')";

$result = mysqli_query($con, $query);

if(mysqli_insert_id($con) > 0) {
	$response['status'] = 'loggedin';
	$response['user'] = $username;
	$response['id'] = md5(uniqid());
	$_SESSION['id'] = $response['id'];
	$_SESSION['user'] = $username;
} else {
	$response['status'] = 'error';
}

echo json_encode($response);

?>