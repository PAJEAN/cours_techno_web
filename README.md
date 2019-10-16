# API Twitter

Ce dépôt a pour objectif de vous guider dans la mise en place et l'utilisation de l'[API standard](https://developer.twitter.com/en/docs/basics/getting-started) de Twitter. Cette API permet notamment de poster et récupérer des tweets, de suivre, rechercher et obtenir des informations sur des utilisateurs ou bien de récupérer les tendances actuelles.

## Création d'une *Apps*

La création d'une *Apps* est obligatoire pour obtenir un ensemble de clés d'accès permettant de réaliser des requêtes sur les API de Twitter. Les instructions suivantes présentent le protocole pour créer une *Apps*.

* Créer un compte développeur [Twitter](https://developer.twitter.com/). Vous devez renseigner un ensemble de champs pour justifier l'utilisation de l'API.
* Créer une [*App*](https://developer.twitter.com/en/apps). Renseignez uniquement les champs requis (pour le champs Website URL vous pouvez par exemple renseigner l'adresse de votre compte Twitter).

![Application](images/create-app.png "Créer une application.")

* Lorsque votre *App* est créée vous avez accès à un ensemble de clés d'authentification: *API key* et  *API Secret*. Vous pouvez voir ces clés dans l'onglet **Keys and tokens** de votre *App*.

![Keys and tokens](images/keys-tokens.png "Clés et tokens.")

* Maintenant vous devez générer les clés d'accès suivantes: *Access token* et *Access token secret* (en *Read and Write* par défaut).

![Access token](images/access-token.png "Générer les clés d'accès.")

## Créer une requête pour récupérer des tweets

Il existe plusieurs points d'entrée selon les traitements ou les informations que vous voulez récupérer  (la liste de tous les points d'entrée est disponible à cette [adresse](https://developer.twitter.com/en/docs)). Concernant la recherche et la récupération de tweets, le point d'entrée se trouve à l'adresse suivante: https://api.twitter.com/1.1/search/tweets.json . La procédure pour réaliser une requête afin d'obtenir un retour JSON se trouve sur cette [page](https://developer.twitter.com/en/docs/tweets/search/api-reference/get-search-tweets). Cette dernière indique de réaliser la requête suivante par l'intermédiaire d'une commande cURL:

```
$ curl --request GET
 --url 'https://api.twitter.com/1.1/search/tweets.json?q=from%3Atwitterdev&result_type=mixed&count=2'
 --header 'authorization: OAuth oauth_consumer_key="consumer-key-for-app",
 oauth_nonce="generated-nonce", oauth_signature="generated-signature",
 oauth_signature_method="HMAC-SHA1", oauth_timestamp="generated-timestamp",
 oauth_token="access-token-for-authed-user", oauth_version="1.0"'
```

L'objectif est de retranscrire cette requête à partir d'un code PHP. Selon l'environnement de développement (serveur web) que vous avez, le module *php-curl* sera nécessaire. En effet, ce module vous permet de réaliser commandes cURL.

```
$feed = curl_init(); // Initialisation d'une session cURL.
curl_setopt_array($feed, $options); // Ajout des options, url et HTTP Header de la requête.
$json = curl_exec($feed); // Exécution de la requête.
curl_close($feed); // Fermeture de la session cURL.
echo $json; // Affichage du résultat de la requête.
```

La partie la plus compliquée ici est de renseigner les options (les détails à cette [adresse](https://developer.twitter.com/en/docs/basics/authentication/guides/authorizing-a-request)) de la requête et plus spécifiquement l'entête HTTP de la requête (*header*). Comme nous l'avons vu ci-dessus, l'entête doit contenir plusieurs informations:
* *oauth_consumer_key* correspond à votre *API key*.
* *oauth_nonce* correspond à un token (chaîne de caractères ou entier) unique à chacune de vos requêtes (*e.g.* le *timestamp*).
* *oauth_signature* correspond à une signature de sécurité pour permettre à Twitter de vérifier si la requête à été interceptée. Ce paramètre nécessite une procédure à part entière décrite à cette [adresse](https://developer.twitter.com/en/docs/basics/authentication/guides/creating-a-signature).
* *oauth_signature_method* est la manière d'obtenir la signature, ici la méthode HMAC-SHA1 est utilisée.
* *oauth_timestamp* correspond au *timestamp* que l'on peut obtenir sous PHP avec la fonction *time()*.
* *oauth_token* correspond à votre *Access token*.
* *oauth_version* est fixé à 1.0.

La création de la signature nécessite les étapes suivantes.

* Création de la chaîne à encrypter. La chaîne est constituée dans l'ordre: de la méthode utilisée pour la requête (ici *GET*), d'un esperluette (*&*), de l'url de base pour accéder à l'API (ici *https://api.twitter.com/1.1/search/tweets.json*), de nouveau d'un esperluette (*&*) puis dans l'**ordre alphabétique** l'ensemble des clés/valeurs: *oauth_consumer_key*, *oauth_nonce*, *oauth_signature_method*, *oauth_timestamp*, *oauth_token*, *oauth_version* et des paramètres de l'url (*e.g. count=2*) séparées par un esperluette (*&*). L'url et l'ensemble des clés/valeurs doivent être encodés avec la fonction *rawurlencode()* de PHP qui permet d'encoder (remplacement des caractères spéciaux *e.g.* & --> %26, @ --> %40) une chaîne en URL selon une norme donnée (RFC 3986). A noter que les esperluettes entre les clés/valeurs sont également encodés.

```
$base_info =
GET&https%3A%2F%2Fapi.twitter.com%2F1.1%2Fsearch%2Ftweets.json&count%3D2%26oauth_consumer_key%3Dxvz1evFS4wEEPTGEFPHBog%26oauth_nonce%3D1571229186%26oauth_signature_method%3DHMAC-SHA1%26oauth_timestamp%3D1571229186%26oauth_token%3D370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb%26oauth_version%3D1.0%26q%3Dfrom%253A%2540xSqueeZie
```

* Création d'une clé d'encryptage obtenue à partir de la concaténation de l'*API Secret* et de l'*Access token secret* avec un esperluette (*&*). A noter que si des caractères spéciaux apparaissent dans votre clé ou *token* il faut utiliser la fonction *rawurlencode()*.

```
$composite_key =
kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw&LswwdoUaIvS8ltyTt5jkRh4J50vUPVVHtR2YPi5kE
```

* Création de la signature à partir de la méthode HMAC-SHA1 qui crypte la chaîne de caractères à partir de la clé précédemment créée. Les fonctions *base64_encode()* et *hash_hmac()* de PHP sont exploitées.

```
$oauth_signature = base64_encode(hash_hmac('sha1', $base_info, $composite_key, true))
```

Lorsque vous avez généré votre signature, vous pouvez renseigner les options de la session cURL.

```
// Générer l'entête HTTP de la requête en fonction de vos informations (ici $header doit être un array()).
$header = array('Authorization: OAuth oauth_consumer_key="' . $oauth["oauth_consumer_key"] . '",  oauth_nonce="' . $oauth["oauth_nonce"] . '", oauth_signature="' . rawurlencode($oauth["oauth_signature"]) . '",  oauth_signature_method="HMAC-SHA1", oauth_timestamp="' . $oauth["oauth_timestamp"] . '", oauth_token="' . $oauth["oauth_token"] . '", oauth_version="' . $oauth["oauth_version"] . '"');

// La variable $url correspond à l'url de base de l'API.
$options = array(
    CURLOPT_HTTPHEADER => $header,
    CURLOPT_HEADER => false,
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10
);

// Si des paramètres GET ont été renseignés, on les encode puis on les rajoute à l'url de l'API.
if (count($params) > 0)
{
    $options[CURLOPT_URL] .= '?' . http_build_query($params, '', '&'); // Permet de traduire les caractères spéciaux.
}
```

Vous pouvez exploiter le fichier *index.php* présent sur ce dépôt. Pour aller plus loin (réaliser des requêtes *POST* ou gérer les erreurs) vous pouvez vous référer à ce [dépôt](https://github.com/J7mbo/twitter-api-php) et à la classe *TwitterAPIExchange.php*. Concernant les paramètres GET d'une requête vous pouvez vous référer à cette [page](https://developer.twitter.com/en/docs/tweets/search/api-reference/get-search-tweets) ou bien cette [page](https://developer.twitter.com/en/docs/tweets/search/guides/standard-operators).





