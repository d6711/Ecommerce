function templateEmailVerify(name, otp) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
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
        <h2>Welcome, ${name}!</h2>
        <p>We're excited to have you join us. Use the OTP below to verify your email address:</p>
        <div class="otp">${otp}</div>
        <p>If you didn't make this request, you can safely ignore this email.</p>
        <p class="footer">&copy; 2025 DEV6711. All rights reserved.</p>
    </div>
</body>
</html>`
}

function templateResetPassword(name, newPassword) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
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
        .password { 
            font-size: 28px; 
            font-weight: bold; 
            color: #d9534f; 
            background-color: #fbe9e7; 
            padding: 12px 25px; 
            border-radius: 8px; 
            display: inline-block; 
            margin: 20px 0; 
            letter-spacing: 2px; 
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
        <h2>Hello, ${name}</h2>
        <p>We've received a request to reset your password. Here is your new password:</p>
        <div class="password">${newPassword}</div>
        <p>For security reasons, please log in and change this password as soon as possible.</p>
        <p>If you didn't request a password reset, please contact our support team immediately.</p>
        <p class="footer">&copy; 2025 DEV6711. All rights reserved.</p>
    </div>
</body>
</html>`
}

module.exports = {
    templateEmailVerify,
    templateResetPassword
}