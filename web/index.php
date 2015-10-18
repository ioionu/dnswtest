<?php

require('../vendor/autoload.php');
require('../include/DataSource.php');

use Symfony\Component\HttpFoundation\Request;

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
$app->get('api1/hotels', function(Request $request) use($app) {
  $app['monolog']->addDebug('getting hotels');

  $apiServer=getenv('api_server');
  $apiKey = getenv('api_key');
  $apiRegion = getenv('api_region');
  $apiCats = getenv('api_cats');

  $page = $request->get('page');
  if(!isset($page)) {
    $page = 1;
  }
  $app['monolog']->addDebug("page:" . $page);


  $ds = new dnswtest\DataSource($apiServer, $apiKey, $apiRegion, $apiCats, $page);
  $products = $ds->getProducts();
  return $products;
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

$filename = __DIR__.preg_replace('#(\?.*)$#', '', $_SERVER['REQUEST_URI']);
if (php_sapi_name() === 'cli-server' && is_file($filename)) {
  return false;
}

$app->run();
