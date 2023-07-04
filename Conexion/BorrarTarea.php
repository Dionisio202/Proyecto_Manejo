<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    

    $ID_TAREA = $data['id'];
    $dsn = 'mysql:host=localhost;dbname=proyecto_manejo';
    $username = 'root';
    $password = '';

    try {
        $conexion = new PDO($dsn, $username, $password);
        $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sql = 'DELETE FROM TAREAS WHERE ID_TAREA = ?';
        $statement = $conexion->prepare($sql);
        $statement->bindParam(1, $ID_TAREA);
        $statement->execute();

        echo 'La tarea se ha borrado exitosamente.';
        exit();
    } catch (PDOException $e) {
        
        echo 'Error al borrar la tarea: ' . $e->getMessage();
            exit();
    }
}
?>

