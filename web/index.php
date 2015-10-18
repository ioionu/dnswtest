<?php

require('../vendor/autoload.php');

$app = new Silex\Application();
$app['debug'] = true;

// Register the monolog logging service
$app->register(new Silex\Provider\MonologServiceProvider(), array(
  'monolog.logfile' => 'php://stderr',
));

// Register view rendering
$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__.'/views',
));

// Our web handlers
$app->get('api1/hotels', function() use($app) {
  $app['monolog']->addDebug('getting hotels');

  $apiServer = getenv('api_server');
  $apiKey = getenv('api_key');
  $apiRegion = getenv('api_region');
  $apiParams = ['query' => [
    'key' => $apiKey,
    'rg' => $apiRegion,
  ]];
  $app['monolog']->addDebug("params" . $apiServer);

  //http://atlas.atdw.com.au/productsearchservice.svc/products?key=_KEY_&rg=_REGIONID_
  $apiClient = new GuzzleHttp\Client();
  $apiResponse = $apiClient->request(
    'GET',
    $apiServer,
    $apiParams
  );
  $apiBody = $apiResponse->getBody(true);
  $xml = simplexml_load_string($apiBody);
  #$json = json_decode($apiBody);
  $app['monolog']->addDebug($xml);

  $hotels = array('hello' => 'world', 'times' => getenv('TIMES'));
  return json_encode($xml);
});


$app->get('/', function() use($app) {
  $app['monolog']->addDebug('logging output.');
  $client = new GuzzleHttp\Client();
  $response = $client->request('GET', "https://qrng.anu.edu.au/API/jsonI.php?length=10&type=uint8");
  //$request = $client->get('/API/jsonI.php?length=10&type=uint8');
  //$response = $request->send();
  $body = $response->getBody(true);
  $app['monolog']->addDebug($body);


  return $app['twig']->render('index.twig', array('yo' => "yo!"));
});

$app->run();
