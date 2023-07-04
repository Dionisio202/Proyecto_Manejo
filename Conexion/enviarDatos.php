<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $ID_TAREA = NULL;
    $NOM_TAREA = $_POST['nombreTarea'];
    $FEC_INI = $_POST['fechaInicio'];
    $FEC_FIN = $_POST['fechaFinal'];
    $DESCRIPCION = $_POST['descripcion'];
    $ESTADO = 'PHA';
    $dsn = 'mysql:host=localhost;dbname=proyecto_manejo';
    $username = 'root';
    $password = '';
    try {
        $conexion = new PDO($dsn, $username, $password);
        $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sql = 'INSERT INTO TAREAS VALUES (?,?,?,?,?,?)';
        $statement = $conexion->prepare($sql);
        $statement->bindParam(1, $ID_TAREA);
        $statement->bindParam(2, $NOM_TAREA);
        $statement->bindParam(3, $FEC_INI);
        $statement->bindParam(4, $FEC_FIN);
        $statement->bindParam(5, $DESCRIPCION);
        $statement->bindParam(6, $ESTADO);
        $statement->execute();
        echo "<script>window.location.href = '../index.html';</script>";
        exit();
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
}
?>