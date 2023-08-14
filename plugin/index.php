<?php
require_once("vendor/autoload.php");

use Handlebars\Handlebars;
use Handlebars\Loader\FilesystemLoader;

$cssPath = "/dist/main.css";

// echo css path
echo "<link rel='stylesheet' href=$cssPath>";

$partialsDir = __DIR__ . '/templates';

$loader = new FilesystemLoader($partialsDir, [ 'extension' => 'hbs' ]);

$handlebars = new Handlebars([
    'loader' => $loader,
    'partials_loader' => $loader
]);

$startRank = 1;

$data = "https://searchtest.arts.ac.uk/s/search.json?collection=ual-showcase&query=%21nullquery&start_rank=$startRank&num_ranks=10";

$context = file_get_contents($data);
$context = json_decode($context, true);


// pass in data from Funnelback collection
// set the current page number
// ssr prop configures whether to load initial payload on the server or client
// ssr => 'false' will fetch results on the client
$context = ['items' => $context['response']['resultPacket']['results'], 'page' => 1, "ssr" => 'true'];

echo $handlebars->render('BottomAlignedGrid', $context);

$jsPath = "/dist/bundle.js";

// echo js path
echo "<script src=$jsPath></script>";
