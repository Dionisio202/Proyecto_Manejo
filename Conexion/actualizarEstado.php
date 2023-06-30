<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    echo $data['id'] . ' ' . $data['estado'];

    $ID_TAREA = $data['id'];
    $EST_TAREA = $data['estado'];
    $dsn = 'mysql:host=localhost;dbname=proyecto_manejo';
    $username = 'root';
    $password = '';

    try {
        $conexion = new PDO($dsn, $username, $password);
        $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sql = " UPDATE TAREAS SET ESTADO = ? WHERE ID_TAREA = ? ";
        $statement = $conexion->prepare($sql);
        $statement->bindParam(1, $EST_TAREA);
        $statement->bindParam(2, $ID_TAREA);

        $statement->execute();

        echo 'La tarea se ha movido exitosamente.';
        exit();
    } catch (PDOException $e) {
        
        echo 'Error al mover la tarea: ' . $e->getMessage();
            exit();
    }
}
?>

