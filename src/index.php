<?php
    require_once('config.php');
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body> 

    <h1> Les tweets de MonsieurDream </h1>
    

    <?php

    /* Récupérer les Tweets & réponses d'un compte (période maximale de 7jours). */
    $json = getTweets($settings, "monsieurdream");

    /* Vérifier que la requête s'est bien déroulée et si des Tweets ont été récupérés */
    if(isset($json["statuses"]) && count($json["statuses"]) > 0){
        /* Récupération de la description des Tweets */
        foreach($json["statuses"] as $key => $value){
            echo "- " . $json["statuses"][$key]["text"] . " / " . $json["statuses"][$key]["retweet_count"] . "<br>";
        }
    }

    $url = "https://api.twitter.com/1.1/search/tweets.json";
    $getfield = $json["search_metadata"]["next_results"];
    $requestMethod = "GET";

    $twitter = new TwitterAPIExchange($settings);
    $json = $twitter->setGetfield($getfield)
        ->buildOauth($url, $requestMethod)
        ->performRequest();

    $json = json_decode($json, true);

    if(isset($json["statuses"]) && count($json["statuses"]) > 0){
        /* Récupération de la description des Tweets */
        foreach($json["statuses"] as $key => $value){
            echo "- " . $json["statuses"][$key]["text"] . " / " . $json["statuses"][$key]["retweet_count"] . "<br>";
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

</body>
</html>