<?php

$oauth_access_token = "YOUR_OAUTH_ACCESS_TOKEN";
$oauth_access_token_secret = "YOUR_OAUTH_ACCESS_TOKEN_SECRET";
$consumer_key = "YOUR_CONSUMER_KEY";
$consumer_secret = "YOUR_CONSUMER_SECRET";

$url = "https://api.twitter.com/1.1/search/tweets.json";
$params = array(
    "q" => "from:@xSqueeZie",
    "count" => "2"
);

/*****************************************************
                    Signature
*****************************************************/

/* https://developer.twitter.com/en/docs/basics/authentication/guides/creating-a-signature */
/** Collecting parameters & Creating the signature base string **/

function buildBaseString($baseURI, $method, $params)
{
    $return = array();
    ksort($params);

    foreach($params as $key => $value)
    {
        $return[] = rawurlencode($key) . '=' . rawurlencode($value);
    }

    return $method . "&" . rawurlencode($baseURI) . '&' . rawurlencode(implode('&', $return));
}

$oauth = array(
    "oauth_consumer_key" => $consumer_key,
    "oauth_nonce" => time(),
    "oauth_signature_method" => "HMAC-SHA1",
    "oauth_token" => $oauth_access_token,
    "oauth_timestamp" => time(),
    "oauth_version" => "1.0"
);

if (count($params) > 0){

    foreach($params as $key => $value)
    {
        if (isset($value))
        {
            $oauth[$key] = urldecode($value);
        }
    }
}

$method = 'GET';
$base_info = buildBaseString($url, $method, $oauth);

/** Getting a signing key **/
$composite_key = rawurlencode($consumer_secret) . '&' . rawurlencode($oauth_access_token_secret);

/** Calculating the signature **/
$oauth_signature = base64_encode(hash_hmac('sha1', $base_info, $composite_key, true));
$oauth["oauth_signature"] = $oauth_signature;

/*****************************************************
                    cURL
*****************************************************/
/* https://developer.twitter.com/en/docs/tweets/search/api-reference/get-search-tweets */
/* https://developer.twitter.com/en/docs/basics/authentication/guides/authorizing-a-request */

$header = array('Authorization: OAuth oauth_consumer_key="' . $oauth["oauth_consumer_key"] . '",  oauth_nonce="' . $oauth["oauth_nonce"] . '", oauth_signature="' . rawurlencode($oauth["oauth_signature"]) . '",  oauth_signature_method="HMAC-SHA1", oauth_timestamp="' . $oauth["oauth_timestamp"] . '", oauth_token="' . $oauth["oauth_token"] . '", oauth_version="' . $oauth["oauth_version"] . '"');

/** Request initialisation  **/
$options = array(
    CURLOPT_HTTPHEADER => $header,
    CURLOPT_HEADER => false,
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10
);

if (count($params) > 0)
{
    $options[CURLOPT_URL] .= '?' . http_build_query($params, '', '&'); // Permet de traduire les caractères spéciaux.
}

$feed = curl_init();
curl_setopt_array($feed, $options);
$json = curl_exec($feed);
curl_close($feed);
echo $json;

?>