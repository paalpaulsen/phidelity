<?php
// save_events.php
// Receives JSON data via POST and writes it to ../data/event_data.js

header('Content-Type: application/json');

// Allow CORS (optional, depending on hosting setup, but good for dev)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo JSON_encode(['error' => 'Method Not Allowed']);
    exit;
}

$input = file_get_contents('php://input');
$events = JSON_decode($input, true);

if (JSON_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo JSON_encode(['error' => 'Invalid JSON']);
    exit;
}

// Format as JS file content
$fileContent = "window.EVENTS_DATA = " . JSON_encode($events, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . ";";
$filePath = __DIR__ . '/../data/event_data.js';

// Check if directory is writable
if (!is_writable(dirname($filePath))) {
    http_response_code(500);
    echo JSON_encode(['error' => 'Data directory is not writable. Perms: ' . substr(sprintf('%o', fileperms(dirname($filePath))), -4)]);
    exit;
}

if (file_put_contents($filePath, $fileContent) === false) {
    http_response_code(500);
    echo JSON_encode(['error' => 'Failed to write file. Last error: ' . error_get_last()['message']]);
} else {
    echo JSON_encode(['success' => true]);
}
?>