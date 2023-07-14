<?php

    $id = $_GET['id'];
  
  $dsn = 'mysql:host=localhost;dbname=proyecto_manejo';
    $username = 'root';
    $password = '';
    try {
        $conexion = new PDO($dsn, $username, $password);
        $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sql = 'DELETE FROM TAREAS WHERE NOMBRE_GRUPO = "'.$id.'"';
        $statement = $conexion->prepare($sql);
        $statement->execute();
        echo "<script>window.location.href = '../index.html';</script>";
        exit();
    } catch (PDOException $e) {
        
        echo 'Error al borrar la tarea: ' . $e->getMessage();
            exit();
    }

?>
