<?php

/* Importer la librairie TwitterAPIExchange.php */
require_once('TwitterAPIExchange.php');
/* Renseigner vos clés d'accés */
$settings = array(
    "oauth_access_token" => "YOUR_OAUTH_ACCESS_TOKEN",
    "oauth_access_token_secret" => "YOUR_OAUTH_ACCESS_TOKEN_SECRET",
    "consumer_key" => "YOUR_CONSUMER_KEY",
    "consumer_secret" => "YOUR_CONSUMER_SECRET"
);

/* Récupérer les Tweets & réponses d'un compte (période maximale de 7jours). */
$json = getTweets($settings, "MonsieurDream");

/* Vérifier que la requête s'est bien déroulée et si des Tweets ont été récupérés */
if(isset($json["statuses"]) && count($json["statuses"]) > 0){
    /* Récupération de la description des Tweets */
    foreach($json["statuses"] as $key => $value){
        echo $json["statuses"][$key]["text"] . "<br>";
    }
}

?>
