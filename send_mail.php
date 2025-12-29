<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get JSON input
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    // Fallback if standard POST (form-data) is used
    if (json_last_error() !== JSON_ERROR_NONE) {
        $name = strip_tags(trim($_POST["name"] ?? ''));
        $email = filter_var(trim($_POST["email"] ?? ''), FILTER_SANITIZE_EMAIL);
        $phone = strip_tags(trim($_POST["phone"] ?? ''));
        $message = strip_tags(trim($_POST["message"] ?? ''));
    } else {
        $name = strip_tags(trim($data["name"] ?? ''));
        $email = filter_var(trim($data["email"] ?? ''), FILTER_SANITIZE_EMAIL);
        $phone = strip_tags(trim($data["phone"] ?? ''));
        $message = strip_tags(trim($data["message"] ?? ''));
    }

    // Validation
    if (empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Invalid input data."]);
        exit;
    }

    // Email Config
    $to = "phidelity@interfazer.com";
    $subject = "New Contact from $name (Phidelity Form)";
    
    $email_content = "Name: $name\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Phone: $phone\n\n";
    $email_content .= "Message:\n$message\n";

    $headers = "From: no-reply@interfazer.com\r\n"; // Sending from own domain is safer for spam
    $headers .= "Reply-To: $email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // Send
    if (mail($to, $subject, $email_content, $headers)) {
        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Message sent successfully."]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to send email."]);
    }
} else {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Method not allowed."]);
}
?>
