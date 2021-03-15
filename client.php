<?php
$host = "127.0.0.1";
$port = 5353;
$message = "Reverse me!!! \n";

echo "Message to send: $message \n";

// No Timeout
set_time_limit(0);

// Create socket to connect
$socket = socket_create(AF_INET, SOCK_STREAM, 0) or die("Could not create socket\n");

echo "Socket created.\n";

// Connect to the server socket
$result = socket_connect($socket, $host, $port) or die("Could not connect to server\n");

echo "Connection established.\n";

socket_write($socket, $message, strlen($message)) or die("Could not send data to server\n");

echo "Message sent.\n";

// Get server response
$result = socket_read($socket, 1024) or die("Could not read server response\n");

echo "Response: " . $result;

// Close socket
socket_close($socket);