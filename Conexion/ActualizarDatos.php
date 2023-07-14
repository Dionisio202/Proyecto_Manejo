<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $ID_TAREA = $_POST['idTarea'];
    $NOM_TAREA = $_POST['nombreTarea'];
    $FEC_INI = $_POST['fechaInicio'];
    $FEC_FIN = $_POST['fechaFinal'];
    $DESCRIPCION = $_POST['descripcion'];
    $ESTADO = $_POST['estado'];
    $RESPONSABLE = $_POST['responsableEdit'];


    $dsn = 'mysql:host=localhost;dbname=proyecto_manejo';
    $username = 'root';
    $password = '';
    try {
        $conexion = new PDO($dsn, $username, $password);
        $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sql = 'UPDATE TAREAS SET NOM_TAREA = ? , FEC_INI = ? , FEC_FIN = ? , DESCRIPCION = ? , ESTADO = ?, ASIGNADO_TAREA = ? WHERE ID_TAREA = ?';
        $statement = $conexion->prepare($sql);
        $statement->bindParam(1, $NOM_TAREA);
        $statement->bindParam(2, $FEC_INI);
        $statement->bindParam(3, $FEC_FIN);
        $statement->bindParam(4, $DESCRIPCION);
        $statement->bindParam(5, $ESTADO);
        $statement->bindParam(6, $RESPONSABLE);
        $statement->bindParam(7, $ID_TAREA);
        $statement->execute();
        
        echo "<script>window.location.href = '../index.html';</script>";
        exit();
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
}
?>