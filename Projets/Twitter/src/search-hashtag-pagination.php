<?php
    require_once('config.php');
    $tweets = empty($_POST['tweets']) ? [] : json_decode($_POST['tweets'], true);
    $COUNT = 5;
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
    <?php
        function twitterRequest($url, $getfield, $settings) {
            $twitter = new TwitterAPIExchange($settings);
            $json = $twitter->setGetfield($getfield)
                ->buildOauth($url, 'GET')
                ->performRequest();
            return json_decode($json, true);
        }

        // Classic search from text input (first form).
        if (isset($_POST['hashtag'])) {
            $url = 'https://api.twitter.com/1.1/search/tweets.json';
            $getfield = '?q=#' . $_POST['hashtag'] . '+-filter:retweets&count=' . $COUNT . '&result_type=recent';
            
            $req = twitterRequest($url, $getfield, $settings);
            if (isset($req['statuses'])) {
                $tweets = $req['statuses'];
                $search_metadata = $req['search_metadata'];
            }
        }

        // Next page (second form).
        if (isset($_POST['next_results'])) {
            $next_results = json_decode($_POST['next_results'], true);
            // https://developer.twitter.com/en/docs/twitter-api/v1/tweets/timelines/guides/working-with-timelines
            $lower_id = INF;
            
            for($i = 0; $i < count($tweets); $i++) {
                if ($tweets[$i]['id'] < $lower_id) {
                    $lower_id = $tweets[$i]['id'];
                }
            }

            $url = 'https://api.twitter.com/1.1/search/tweets.json';
            $getfield = '?max_id='. ($lower_id - 1) .'&q=' . urldecode($next_results['query']) . '&count=' . $COUNT . '&result_type=recent';

            $req = twitterRequest($url, $getfield, $settings);
            if (isset($req['statuses'])) {
                $tweets = array_merge($tweets, $req['statuses']);
                $search_metadata = $req['search_metadata'];
            }
        }
    ?>

    <form action="search-hashtag-pagination.php" method="POST">
        <input type="text" placeholder="Entrer un hashtag..." value="" name="hashtag">
        <button>Go !</button>
    </form>
    
    <form action="search-hashtag-pagination.php" method="POST">
        <textarea name="tweets" style="display: none"><?php echo json_encode($tweets) ?></textarea>
    <?php
        if (!empty($tweets)) {
            /* Récupération de la description des Tweets */
            echo '<ul>';
            for($i = 0; $i < count($tweets); $i++) {
                echo '<li>' . $tweets[$i]['text'] . " " . $tweets[$i]['id'] . '</li>';
            }
            echo '</ul>';
        }

        if (isset($search_metadata) && array_key_exists('next_results', $search_metadata)) {
            echo '<textarea style="display: none" name="next_results">' . json_encode($search_metadata) . '</textarea>';
            echo '<button>Plus de résultats...</button>';
        }
        
    ?>
    </form>
</body>
</html>