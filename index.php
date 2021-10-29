<?php

/* Importer la librairie TwitterAPIExchange.php */
require_once('TwitterAPIExchange.php');
/* Renseigner vos clés d'accés */
$settings = array(
    "oauth_access_token" => "",
    "oauth_access_token_secret" => "",
    "consumer_key" => "",
    "consumer_secret" => ""
);

?>

<h1> Les tweets de MonsieurDream </h1>

<?php

/* Récupérer les Tweets & réponses d'un compte (période maximale de 7jours). */
$json = getTweets($settings, "monsieurdream");

/* Vérifier que la requête s'est bien déroulée et si des Tweets ont été récupérés */
if(isset($json["statuses"]) && count($json["statuses"]) > 0){
    /* Récupération de la description des Tweets */
    foreach($json["statuses"] as $key => $value){
        echo "- " . $json["statuses"][$key]["text"] . "<br>";
    }
}

?>

<h1> Les hashtags #fromage ou #vin des comptes @mondialfromage ou @FromagesAOPAuv </h1>

<?php

$json = getHashtags($settings, "vin");

if(isset($json["statuses"]) && count($json["statuses"]) > 0){
    /* Récupération de la description des Tweets */
    foreach($json["statuses"] as $key => $value){
        echo "- " . $json["statuses"][$key]["full_text"] . "<br>";
    }
}

?>

<h1> Les tendances à Paris </h1>

<?php

$json = getTrends($settings, "615702");

if(count($json) > 0 && isset($json[0]["trends"])){
    /* Récupération de la description des Tweets */
    foreach($json[0]["trends"] as $value){
        echo "- " . $value["name"] . "<br>";
    }
}

?>