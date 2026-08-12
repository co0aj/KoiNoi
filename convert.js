const fs = require('fs');
const path = require('path');

// 1. Cấu hình thư mục đầu vào và file đầu ra
const INPUT_DIR = path.join(__dirname, 'images'); // Thư mục chứa ảnh
const OUTPUT_FILE = path.join(__dirname, 'imagesData.js'); // File JS đầu ra

// Bản ánh xạ định dạng file sang MIME type
const MIME_TYPES = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.gif': 'image/gif'
};

function convertImagesToBase64() {
    if (!fs.existsSync(INPUT_DIR)) {
        console.error(`Thư mục "${INPUT_DIR}" không tồn tại. Hãy tạo thư mục và bỏ ảnh vào!`);
        return;
    }

    const files = fs.readdirSync(INPUT_DIR);
    const resultData = {};

    files.forEach(file => {
        const ext = path.extname(file).toLowerCase();
        const mime = MIME_TYPES[ext];

        if (mime) {
            const filePath = path.join(INPUT_DIR, file);
            // Đọc file dưới dạng Buffer
            const fileBuffer = fs.readFileSync(filePath);
            // Chuyển sang Base64
            const base64Str = fileBuffer.toString('base64');
            
            // Đặt tên key theo tên file (bỏ phần mở rộng)
            const keyName = path.basename(file, ext);
            
            // Lưu chuỗi Data URI hoàn chỉnh
            resultData[keyName] = `data:${mime};base64,${base64Str}`;
            console.log(`Đã chuyển đổi: ${file} -> Key: "${keyName}"`);
        }
    });

    // Xuất ra file JS chứa biến global `IMAGE_DATA`
    const content = `// File tự động tạo - Không sửa tay\nconst IMAGE_DATA = ${JSON.stringify(resultData, null, 2)};\n`;
    fs.writeFileSync(OUTPUT_FILE, content, 'utf8');

    console.log(`\n HOÀN TẤT! Đã lưu dữ liệu vào file: ${OUTPUT_FILE}`);
}

convertImagesToBase64();