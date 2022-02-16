<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <?php
        function getWordCloud ($api_options) {
            /** Request initialisation  **/
            $options = array(
                CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
                CURLOPT_POSTFIELDS => json_encode($api_options),
                CURLOPT_URL => 'https://quickchart.io/wordcloud',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT => 10,
                CURLOPT_POST => true
            );
            
            $feed = curl_init();
            curl_setopt_array($feed, $options);
            $json = curl_exec($feed);
            curl_close($feed);

            return $json;
        }

        function getBarChart ($x_labels, $y_label, $data) {
            return "https://quickchart.io/chart?c=
                {
                    type: 'bar',
                    data:
                        {
                            labels: ". str_replace('"', "'", json_encode($x_labels)) .",
                            datasets: [
                                {
                                    label: '" . $y_label . "',
                                    data : " . json_encode($data) . "
                                }
                            ]
                        }
                }";
        }
    ?>

    <?php
        $api_options = [
            'text' => "Françaises, Français, Mes chers compatriotes",
            'language' => 'fr',
            'removeStopwords' => true
        ];
        echo getWordCloud($api_options);
    ?>

    <img src="<?php echo getBarChart(['Q1', 'Q2', 'Q3', 'Q4'], 'Users', [30, 40, 50, 60]) ?>">

</body>
</html>