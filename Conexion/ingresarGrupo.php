<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $grupo = $_POST['grupo'];
    $nombreArray = $_POST['nombre'];
    $emailArray  = $_POST['email'];

    $dsn = 'mysql:host=localhost;dbname=proyecto_manejo';
    $username = 'root';
    $password = '';

    try {
        $conexion = new PDO($dsn, $username, $password);

        $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sql = " INSERT INTO grupotareas VALUES (?, NULL)";
        $statement = $conexion->prepare($sql);
        $statement->bindParam(1, $grupo);

        $statement->execute();

        echo 'Exito';

        $sql = " INSERT INTO integrante VALUES (null,?, ?,?)";
  

        for ($i=0; $i < count($emailArray); $i++) {

            $statement = $conexion->prepare($sql);
            $statement->bindParam(1, $nombreArray[$i]);
            $statement->bindParam(2, $emailArray[$i]);
            $statement->bindParam(3, $grupo);
            $statement->execute();

        }


        exit();
    } catch (PDOException $e) {
        
        echo 'Error al mover la tarea: ' . $e->getMessage();
            exit();
    }

 foreach ($nombreArray as $key => $value) {

    echo $value;
    # code...
 }



}
?>

