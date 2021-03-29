<?php
$host = "127.0.0.1";
$port = 5353;

// No Timeout
set_time_limit(0);

ob_implicit_flush();

// Create socket
$socket = socket_create(AF_INET, SOCK_STREAM, 0) or die("Could not create socket\n");

echo "Socket created.\n";

// Bind socket to host and port
$result = socket_bind($socket, $host, $port) or die("Could not bind to socket\n");

echo "Socket bind successfully.\n";

// Start listening - wait for the client to connect
$result = socket_listen($socket, 10) or die("Could not set up socket listener\n");

echo "Socket listening...\n";

class Worker extends Thread {
    private $connection;

    public function __construct($connection) {
        $this->connection = $connection;
    }

    public function run() {
        // Get the input and manipulate it
        $input = socket_read($this->connection, 1024) or die("Could not read input\n");

        echo "Client typed: $input. \n ";

        $output = strrev($input) . "\n";

        echo "Message to send back: $output\n";

        // Sent back the message
        socket_write($this->connection, $output, strlen ($output)) or die("Could not send response.\n");
    }
}

while(true) {
    // This socket is responsible for the communication with the client
    $connection = socket_accept($socket) or die("Could not accept incoming connection\n");

    // Display details about client
    if (socket_getpeername($connection , $address , $port)) {
        echo "Client $address : $port is now connected.";
    }

    $worker = new Worker($connection);
    $worker->start();
}

// Close connection
socket_close($connection);
socket_close($socket);

