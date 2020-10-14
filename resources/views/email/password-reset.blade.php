<!DOCTYPE html>
<html style="">
    <head>
        <title> PhotApp </title>
        <meta id="viewport" name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, viewport-fit=cover">
    </head>

    <body style="margin: 0 auto; width: 60%; color: #222; min-width: 310px;">
        <h2> Hello! ({{ $user->username }}) </h2>

        <p> You are receiving this email because we received a password reset request for your account. </p>

        <div style="margin: 0 auto; width: 40%">
            <a href="{{ $reset_link }}">
                <button style="width: 100%;
                    padding: 15px;
                    background: #62AA99;
                    cursor: pointer;
                    border: 1px solid #ccc;
                    color: #fff;
                    font-size: 14px;
                    font-weight: 600;
                    border-radius: 4px;
                    margin: 14px 0;">
                    Reset Password
                </button>
            </a>
        </div>

        <p> If you did not request a password reset, ignore this message. </p>
    </body>
</html>
