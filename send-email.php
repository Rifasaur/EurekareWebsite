<?php
error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json');

// Include PHPMailer core files
require 'PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
    exit;
}

$form_type = $_POST['form_type'] ?? '';

// ==========================================
// CENTRAL SMTP CONFIGURATION
// FIX: Move these credentials out of this file and into a config file that
//      sits outside your web root (e.g. /config/mailer_config.php), then load
//      it with: require_once '../../config/mailer_config.php';
//      This prevents credentials from being accidentally exposed if the server
//      ever serves .php files as plain text, or if this file ends up in a repo.
//
//      Example config file contents:
//          define('SMTP_HOST',     'smtp.gmail.com');
//          define('SMTP_USERNAME', 'hr.eurekare@gmail.com');
//          define('SMTP_PASSWORD', 'your-app-password-here');
//          define('SMTP_PORT',     587);
// ==========================================
$smtp_host     = 'smtp.gmail.com';
$smtp_username = 'hr.eurekare@gmail.com';
$smtp_password = 'fgep gulz qbsf bjbn';   // <-- Replace with config file reference
$smtp_port     = 587;
// ==========================================

// --- SHARED EMAIL STYLING TEMPLATE PARTS ---
$email_container_styles   = "max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.06); border: 1px solid #e8eef3; overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;";
$email_header_styles      = "background: linear-gradient(135deg, #0055a4 0%, #003b75 100%); color: #ffffff; padding: 35px 30px; text-align: left;";
$email_body_styles        = "padding: 35px 30px; background-color: #ffffff;";
$badge_styles             = "display: inline-block; padding: 6px 12px; background-color: rgba(255,255,255,0.15); border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;";
$section_title_styles     = "color: #0055a4; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #edf2f7; padding-bottom: 8px; margin: 0 0 15px 0;";
$section_title_next_styles = "color: #0055a4; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #edf2f7; padding-bottom: 8px; margin: 30px 0 15px 0;";
$table_styles             = "width: 100%; border-collapse: collapse; margin-bottom: 10px;";
$td_label_styles          = "padding: 12px 16px; font-weight: 600; color: #718096; border-bottom: 1px solid #edf2f7; width: 38%; font-size: 14px; background-color: #fcfdfe;";
$td_value_styles          = "padding: 12px 16px; border-bottom: 1px solid #edf2f7; color: #2d3748; font-size: 14px;";
$message_box_styles       = "background-color: #f7fafc; border-left: 4px solid #0055a4; padding: 20px; border-radius: 0 8px 8px 0; color: #4a5568; font-size: 14px; line-height: 1.6; margin-top: 10px; white-space: pre-line;";
$footer_styles            = "text-align: center; padding: 25px 30px; background-color: #f7fafc; border-top: 1px solid #edf2f7; font-size: 12px; color: #a0aec0; line-height: 1.5;";

// ==========================================
// INQUIRY FORM HANDLER
// ==========================================
if ($form_type === 'inquiry') {

    // FIX: Validate that required fields are actually present before trying to send.
    //      This gives the user a clear error message instead of sending a blank email.
    $facility_name       = trim($_POST['facility_name'] ?? '');
    $representative_name = trim($_POST['representative_name'] ?? '');
    $raw_contact_input   = trim($_POST['email_address'] ?? '');

    if (empty($facility_name) || empty($representative_name) || empty($raw_contact_input)) {
        echo json_encode(['status' => 'error', 'message' => 'Required fields are missing. Please fill in all required fields and try again.']);
        exit;
    }

    // ==========================================
    // CONFIGURATION: INPUT INQUIRY RECIPIENT EMAIL HERE
    // ==========================================
    $to_email = "renieboyabsalon@gmail.com";
    // ==========================================

    try {
        $mail = new PHPMailer(true);
        $mail->CharSet = 'UTF-8';

        // Server settings
        $mail->isSMTP();
        $mail->Host       = $smtp_host;
        $mail->SMTPAuth   = true;
        $mail->Username   = $smtp_username;
        $mail->Password   = $smtp_password;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = $smtp_port;

        // Recipients
        $mail->setFrom($smtp_username, 'Eurekare Inquiries');
        $mail->addAddress($to_email);

        // Form fields extraction
        $facility_name       = htmlspecialchars($facility_name);
        $estimated_patients  = htmlspecialchars($_POST['estimated_patients'] ?? 'Not Specified');
        $representative_name = htmlspecialchars($representative_name);
        $designation         = htmlspecialchars($_POST['designation'] ?? 'Not Specified');
        $facility_location   = htmlspecialchars($_POST['facility_location'] ?? 'Not Specified');
        $emr_requirements    = htmlspecialchars($_POST['emr_requirements'] ?? 'No specific requirements listed.');

        // --- CLASSIFICATION LOGIC ---
        $facility_type = trim($_POST['facility_type'] ?? 'Private');
        $public_sector = trim($_POST['facility_type_public'] ?? '');

        if (strcasecmp($facility_type, 'Public') === 0 || strcasecmp($public_sector, 'Yes') === 0) {
            $classification_display = "Public Sector";
        } else {
            $classification_display = "Private Sector";
        }

        // --- SPLIT COMBINED CONTACT/EMAIL INPUT ---
        $email_address  = 'Not Specified';
        $contact_number = 'Not Specified';

        if (!empty($raw_contact_input)) {
            $email_pattern = '/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/';

            if (preg_match($email_pattern, $raw_contact_input, $matches)) {
                $email_address = htmlspecialchars($matches[0]);

                $remainder   = str_replace($matches[0], '', $raw_contact_input);
                $clean_phone = trim(preg_replace('/[\/,\-\s\s+]+/', ' ', $remainder));

                if (!empty($clean_phone)) {
                    $contact_number = htmlspecialchars($clean_phone);
                }
            } else {
                // No email found — treat entire input as a phone number
                $contact_number = htmlspecialchars($raw_contact_input);
            }
        }

        // Allow explicit frontend overrides to take precedence if sent separately
        if (isset($_POST['contact_number']) && trim($_POST['contact_number']) !== '') {
            $contact_number = htmlspecialchars(trim($_POST['contact_number']));
        }

        $mail->isHTML(true);
        $mail->Subject = 'Partnership Inquiry: ' . $facility_name;

        $email_display_html = ($email_address !== 'Not Specified')
            ? "<a href='mailto:{$email_address}' style='color: #0055a4; text-decoration: none; font-weight: 500;'>{$email_address}</a>"
            : $email_address;

        $html_body = "
        <div style='background-color: #f5f7fa; padding: 10px; width: 100% !important; margin: 0;'>
            <div style='{$email_container_styles}'>
                <div style='{$email_header_styles}'>
                    <span style='{$badge_styles}'>Inquiry Entry</span>
                    <h2 style='margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;'>New Partnership Inquiry</h2>
                    <p style='margin: 6px 0 0 0; opacity: 0.85; font-size: 14px;'>Submitted via web portal documentation engine.</p>
                </div>

                <div style='{$email_body_styles}'>
                    <h3 style='{$section_title_styles}'>Facility Profile</h3>
                    <table style='{$table_styles}'>
                        <tr><td style='{$td_label_styles}'>Facility Name</td><td style='{$td_value_styles}'><strong>{$facility_name}</strong></td></tr>
                        <tr><td style='{$td_label_styles}'>Classification</td><td style='{$td_value_styles}'>{$classification_display}</td></tr>
                        <tr><td style='{$td_label_styles}'>Est. Daily Patients</td><td style='{$td_value_styles}'>{$estimated_patients}</td></tr>
                        <tr><td style='{$td_label_styles}'>Physical Address</td><td style='{$td_value_styles}'>{$facility_location}</td></tr>
                    </table>

                    <h3 style='{$section_title_next_styles}'>Contact Representative</h3>
                    <table style='{$table_styles}'>
                        <tr><td style='{$td_label_styles}'>Full Name</td><td style='{$td_value_styles}'>{$representative_name}</td></tr>
                        <tr><td style='{$td_label_styles}'>Designation / Role</td><td style='{$td_value_styles}'>{$designation}</td></tr>
                        <tr><td style='{$td_label_styles}'>Email Address</td><td style='{$td_value_styles}'>{$email_display_html}</td></tr>
                        <tr><td style='{$td_label_styles}'>Contact Number</td><td style='{$td_value_styles}'>{$contact_number}</td></tr>
                    </table>

                    <h3 style='{$section_title_next_styles}'>System Requirements</h3>
                    <div style='{$message_box_styles}'>{$emr_requirements}</div>
                </div>

                <div style='{$footer_styles}'>
                    <p style='margin: 0; font-weight: 600;'>Eurekare Corporation Administrative Hub</p>
                    <p style='margin: 4px 0 0 0;'>This is an automated operational pipeline transmission. Do not reply directly to this notification node.</p>
                </div>

            </div>
        </div>";

        $mail->Body    = $html_body;
        $mail->AltBody = "New Facility Inquiry:\nFacility Name: $facility_name\nEmail: $email_address\nPhone: $contact_number";

        $mail->send();
        echo json_encode(['status' => 'success', 'message' => 'Inquiry email sent successfully via SMTP!']);
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => "Mail could not be sent. Mailer Error: {$mail->ErrorInfo}"]);
    }
    exit;
}

// ==========================================
// APPLICATION FORM HANDLER
// ==========================================
if ($form_type === 'application') {

    // FIX: Validate required fields before attempting to send.
    $name     = trim($_POST['applicant_name'] ?? '');
    $email    = trim($_POST['applicant_email'] ?? '');
    $position = trim($_POST['position'] ?? '');

    if (empty($name) || empty($email) || empty($position)) {
        echo json_encode(['status' => 'error', 'message' => 'Required fields are missing. Please fill in your name, email, and position and try again.']);
        exit;
    }

    // FIX: Basic email format validation before sending.
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'error', 'message' => 'The email address you entered does not appear to be valid. Please check it and try again.']);
        exit;
    }

    // ==========================================
    // CONFIGURATION: INPUT HR RECIPIENT EMAIL HERE
    // ==========================================
    $to_email = "itsyeboigolteb@gmail.com";
    // ==========================================

    try {
        $mail = new PHPMailer(true);
        $mail->CharSet = 'UTF-8';

        // Server settings
        $mail->isSMTP();
        $mail->Host       = $smtp_host;
        $mail->SMTPAuth   = true;
        $mail->Username   = $smtp_username;
        $mail->Password   = $smtp_password;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = $smtp_port;

        // Recipients
        $mail->setFrom($smtp_username, 'Eurekare Careers');
        $mail->addAddress($to_email);

        // Form fields extraction
        $name         = htmlspecialchars($name);
        $email        = htmlspecialchars($email);
        $phone        = htmlspecialchars($_POST['applicant_phone'] ?? 'Not Provided');
        $position     = htmlspecialchars($position);
        $cover_letter = htmlspecialchars($_POST['cover_letter'] ?? 'No cover letter text or introduction note provided by candidate.');

        $mail->isHTML(true);
        $mail->Subject = 'Career Application: ' . $position . ' - ' . $name;

        $has_file = (isset($_FILES['resume']) && $_FILES['resume']['error'] == UPLOAD_ERR_OK);
        $file_status_html = $has_file
            ? "<span style='color: #00796b; background-color: #e6f4ea; padding: 4px 10px; border-radius: 12px; font-size: 13px; font-weight: 600;'>&#128206; Document Attached Safely</span>"
            : "<span style='color: #718096; background-color: #edf2f7; padding: 4px 10px; border-radius: 12px; font-size: 13px; font-style: italic;'>None Provided</span>";

        $html_body = "
        <div style='background-color: #f5f7fa; padding: 10px; width: 100% !important; margin: 0;'>
            <div style='{$email_container_styles}'>
                <div style='{$email_header_styles}'>
                    <span style='{$badge_styles}'>Candidate Portfolio</span>
                    <h2 style='margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;'>New Employment Application</h2>
                    <p style='margin: 6px 0 0 0; opacity: 0.85; font-size: 14px;'>Received through website dynamic recruitment portal.</p>
                </div>

                <div style='{$email_body_styles}'>
                    <table style='{$table_styles}'>
                        <tr><td style='{$td_label_styles}'>Contact Number</td><td style='{$td_value_styles}'>{$phone}</td></tr>
                        <tr><td style='{$td_label_styles}'>Resume / CV File</td><td style='{$td_value_styles}'>{$file_status_html}</td></tr>
                    </table>

                    <h3 style='{$section_title_next_styles}'>Cover Letter / Message</h3>
                    <div style='{$message_box_styles}'>{$cover_letter}</div>
                </div>

                <div style='{$footer_styles}'>
                    <p style='margin: 0; font-weight: 600;'>Eurekare Corporation Human Resources Department</p>
                    <p style='margin: 4px 0 0 0;'>This document archive entry was recorded on your dynamic workspace server pool.</p>
                </div>

            </div>
        </div>";

        $mail->Body    = $html_body;
        $mail->AltBody = "New Career Application:\nName: $name\nPosition: $position\nEmail: $email";

        if ($has_file) {
            $mail->addAttachment($_FILES['resume']['tmp_name'], $_FILES['resume']['name']);
        }

        $mail->send();
        echo json_encode(['status' => 'success', 'message' => 'Application email sent successfully via SMTP!']);
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => "Mail could not be sent. Mailer Error: {$mail->ErrorInfo}"]);
    }
    exit;
}

// Fallback: unknown or missing form_type
echo json_encode(['status' => 'error', 'message' => 'Unknown form type received. Please try again or contact support.']);
?>