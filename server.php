<?php
sleep(3);
// echo $_SERVER['REMOTE_ADDR'];


$userCart = $_POST['cart'];
$userName = $_POST['nameCustomer'];
$userTel = $_POST['phoneCustomer'];
$today = date("mdy.gi");
echo $userCart;

$file = file_get_contents('./db/' . $userName . '.' . $userTel . '.' . $today . '.json');
unset($file);

$taskList[] = array('cart' => $userCart);
file_put_contents('./db/' . $userName . '__' . $userTel . '__' . $today . '.json', $userCart);
unset($taskList);