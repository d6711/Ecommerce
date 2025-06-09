function templateVerifyOtp(name, otp) {
    return `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác Minh Email</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            background-color: #f4f4f4; 
            margin: 0; 
            padding: 0; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            min-height: 100vh; 
        }
        .container { 
            background-color: #ffffff; 
            padding: 40px 30px; 
            border-radius: 12px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.1); 
            max-width: 500px; 
            text-align: center; 
        }
        h2 { 
            color: #333; 
            font-size: 28px; 
            margin-bottom: 20px; 
        }
        p { 
            color: #555; 
            line-height: 1.6; 
            margin-bottom: 20px; 
        }
        .otp { 
            font-size: 36px; 
            font-weight: bold; 
            color: #2b6cb0; 
            background-color: #e9f1fc; 
            padding: 15px 30px; 
            border-radius: 8px; 
            display: inline-block; 
            margin: 20px 0; 
            letter-spacing: 3px; 
        }
        .btn { 
            display: inline-block; 
            background-color: #2b6cb0; 
            color: #ffffff; 
            padding: 12px 25px; 
            border-radius: 8px; 
            text-decoration: none; 
            font-weight: bold; 
            margin-top: 20px; 
        }
        .footer { 
            font-size: 12px; 
            color: #888; 
            margin-top: 30px; 
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Chào mừng, ${name}!</h2>
        <p>Chúng tôi rất vui khi bạn tham gia cùng chúng tôi. Vui lòng sử dụng mã OTP dưới đây để xác minh địa chỉ email của bạn:</p>
        <div class="otp">${otp}</div>
        <p>Nếu bạn không yêu cầu điều này, hãy bỏ qua email này một cách an toàn.</p>
        <p class="footer">&copy; 2025 DEV6711. Mọi quyền được bảo lưu.</p>
    </div>
</body>
</html>`
}

function templateVerifyLink(name, verifyLink) {
    return `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác Minh Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .container {
            background-color: #ffffff;
            padding: 40px 30px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            max-width: 500px;
            text-align: center;
        }
        h2 {
            color: #333;
            font-size: 28px;
            margin-bottom: 20px;
        }
        p {
            color: #555;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        .btn {
            display: inline-block;
            background-color: #2b6cb0;
            color: #ffffff !important;
            padding: 12px 25px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            margin-top: 20px;
        }
        .footer {
            font-size: 12px;
            color: #888;
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Chào mừng, ${name}!</h2>
        <p>Vui lòng nhấn vào nút bên dưới để xác minh địa chỉ email của bạn:</p>
        <a href="${verifyLink}" class="btn">Xác minh Email</a>
        <p>Nếu bạn không yêu cầu điều này, bạn có thể bỏ qua email này một cách an toàn.</p>
        <p class="footer">&copy; 2025 DEV6711. Mọi quyền được bảo lưu.</p>
    </div>
</body>
</html>`
}

module.exports = {
    templateVerifyOtp,
    templateVerifyLink
}
