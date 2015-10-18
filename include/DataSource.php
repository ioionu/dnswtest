<?php
namespace dnswtest;

require('../vendor/autoload.php');

class DataSource
{
  public $apiServer;
  public $apiKey;
  public $apiRegion;
  public $apiCat;
  public $pageSize=10;
  public $page=1;
  public $rawData;
  public $data;
  public $sourceEncoding = 'UTF-16LE';

  public function __construct($apiServer, $apiKey, $apiRegion, $apiCats, $page=1) {
    $this->apiServer = $apiServer;
    $this->apiKey = $apiKey;
    $this->apiRegion = $apiRegion;
    $this->apiCats = $apiCats;
    $this->page = $page;
    $this->load();
  }

  public function pageSize($pageSize=null) {
    if($pageSize == null) {
      return $this->pageSize;
    } elseif (gettype($pageSize == 'integer')) {
      $this->pageSize = $pageSize;
    }
  }

  public function load() {
    $apiParams = ['query' => [
      'key' => $this->apiKey,
      'rg' => $this->apiRegion,
      'size' => $this->pageSize,
      'pge' => $this->page,
      'cats' => $this->apiCats,
      'out' => 'json'
    ]];

    $apiClient = new \GuzzleHttp\Client(['timeout'  => 4.0]);
    try {
      $apiResponse = $apiClient->request(
        'GET',
        $this->apiServer,
        $apiParams
      );
    } catch (Exception $e) {
      echo $e->getRequest();
      if ($e->hasResponse()) {
        echo $e->getResponse();
      }
    }
    $apiBody = $apiResponse->getBody(true);
    $this->rawData = $apiBody;
    $this->parse();
  }

  private function parse() {
    //source data is UTF-16LE which will choke json_decode
    $apiBodyUTF8 = iconv($this->sourceEncoding, 'UTF-8', $this->rawData);
    $this->data = json_decode($apiBodyUTF8);
  }

  public function getProducts() {
    $json = json_encode($this->data);
    return $json;
  }
}
