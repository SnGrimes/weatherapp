<?php
if (! function_exists ('curl_version')) {
    exit ("Enable cURL in PHP");
}

$userLat = $_POST["lat"];
$userLong = $_POST["long"];
$dataSet = $_POST["dataset"];

if($dataSet == 1) {
    $url = 'https://api.openweathermap.org/data/2.5/weather?lat=' . $userLat .'&lon=' . $userLong . 'API ID';
}
else{
    $url = 'https://api.openweathermap.org/data/2.5/forecast?lat=' . $userLat .'&lon=' . $userLong . 'API ID';
}

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

$output = curl_exec($ch);
if(curl_errno ($ch)) {
    echo curl_error($ch);
    curl_close($ch);
    exit();
}

echo $output;
curl_close($ch);

?>