<?php

$dato = $_GET['id'];


$dsn = 'mysql:host=localhost;dbname=proyecto_manejo';
$username = 'root';
$password = '';
try {
    $conexion = new PDO($dsn, $username, $password);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $sql = 'SELECT * FROM integrante WHERE GRUPO = "'.$dato.'"';
    $statement = $conexion->prepare($sql);
    $statement->execute();
    $resultados = array();
    while ($fila = $statement->fetch(PDO::FETCH_ASSOC)) {
        $resultados[] = $fila;
    }   
    $datosJson = json_encode($resultados);
    echo $datosJson;
    exit();
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>