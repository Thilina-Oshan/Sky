<?php

class Connect
{
    public $connection;

    public function __construct()
    {
        // Enable mysqli exception handling
        mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

        try {
            $this->connection = mysqli_connect('localhost', 'root', '', 'skylark_db');
        } catch (Exception $th) {
            die('Database connection failed: ' . $th->getMessage());
        }
    }

    public function insertProducts()
    {
        // Check if the form was submitted via POST and required field exists
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['productName']) && !empty($_POST['productName'])) {

            // 1. Sanitize and collect standard text inputs
            $sku              = !empty($_POST['productSku']) ? trim($_POST['productSku']) : NULL;
            $productName      = trim($_POST['productName']);
            $departmentId     = isset($_POST['productDepartment']) ? trim($_POST['productDepartment']) : '';
            $categoryId       = isset($_POST['productCategory']) ? trim($_POST['productCategory']) : '';
            $subcategoryCode  = isset($_POST['categoryIdSelect']) ? trim($_POST['categoryIdSelect']) : '';
            $description      = !empty($_POST['productDescription']) ? trim($_POST['productDescription']) : NULL;
            $price            = (float)$_POST['productPrice'];
            $stockQuantity    = (int)$_POST['productStock'];
            $availability     = isset($_POST['stockAvailability']) ? $_POST['stockAvailability'] : 'In Stock';
            $isBestseller     = isset($_POST['productBestSeller']) ? 1 : 0;

            // 2. Handle Product Sizes (Convert array from checkboxes to comma-separated string)
            $productSize = NULL;
            if (isset($_POST['productSizes']) && is_array($_POST['productSizes'])) {
                $productSize = implode(', ', array_map('trim', $_POST['productSizes']));
            }

            // 3. Handle Product Colors
            $productColor = !empty($_POST['productColors']) ? trim($_POST['productColors']) : NULL;

            // 4. Handle Image Path (File Upload OR External URL)
            $imageUrl = NULL;

            // Priority 1: Check if an image file was uploaded
            if (isset($_FILES['productImageFile']) && $_FILES['productImageFile']['error'] === UPLOAD_ERR_OK) {
                $fileTmpPath   = $_FILES['productImageFile']['tmp_name'];
                $fileName      = $_FILES['productImageFile']['name'];
                $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

                $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

                if (in_array($fileExtension, $allowedExtensions)) {
                    $uploadFileDir = '../uploads/products/';

                    if (!is_dir($uploadFileDir)) {
                        mkdir($uploadFileDir, 0755, true);
                    }

                    $newFileName = uniqid('prod_', true) . '.' . $fileExtension;
                    $destPath    = $uploadFileDir . $newFileName;

                    if (move_uploaded_file($fileTmpPath, $destPath)) {
                        $imageUrl = 'uploads/products/' . $newFileName;
                    }
                }
            }

            // Priority 2: Fallback to Image URL input if no file was uploaded
            if (empty($imageUrl) && !empty($_POST['productImageUrl'])) {
                $imageUrl = trim($_POST['productImageUrl']);
            }

            // 5. Check if SKU already exists
            if (!empty($sku)) {
                $checkSkuStmt = $this->connection->prepare("SELECT `sku` FROM `products` WHERE `sku` = ?");
                $checkSkuStmt->bind_param("s", $sku);
                $checkSkuStmt->execute();
                $skuResult = $checkSkuStmt->get_result();

                if ($skuResult->num_rows > 0) {
                    echo "<script>
                        alert('Error: SKU already exists in the database.');
                        window.history.back();
                      </script>";
                    exit();
                }
                $checkSkuStmt->close();
            }

            // 6. Insert Product into database using Prepared Statements
            $sql = "INSERT INTO `products` (
                    `sku`, `product_name`, `department_id`, `category_id`, `subcategory_code`, 
                    `description`, `price`, `stock_quantity`, `stock_availability`, `is_bestseller`, 
                    `product_size`, `product_color`, `image_url`
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

            $stmt = $this->connection->prepare($sql);

            if ($stmt) {
                $stmt->bind_param(
                    "ssssssdisisss",
                    $sku,
                    $productName,
                    $departmentId,
                    $categoryId,
                    $subcategoryCode,
                    $description,
                    $price,
                    $stockQuantity,
                    $availability,
                    $isBestseller,
                    $productSize,
                    $productColor,
                    $imageUrl
                );

                if ($stmt->execute()) {
                    echo "<script>
                        alert('Product added successfully!');
                        window.location.href = 'productaddform.php';
                      </script>";
                    exit();
                } else {
                    echo "<script>
                        alert('Error adding product: " . addslashes($stmt->error) . "');
                        window.history.back();
                      </script>";
                    exit();
                }

                $stmt->close();
            } else {
                echo "<script>
                    alert('Database error: Unable to prepare statement.');
                    window.history.back();
                  </script>";
                exit();
            }
        }
    }
}