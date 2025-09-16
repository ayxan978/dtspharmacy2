<?php
$id = $_POST['id'];
$newPrice = $_POST['price'];

$file = 'products.json';
$products = json_decode(file_get_contents($file), true);

foreach ($products as &$product) {
    if ($product['id'] == $id) {
        $product['price'] = $newPrice;
    }
}

file_put_contents($file, json_encode($products, JSON_PRETTY_PRINT));
echo "OK";
?>
