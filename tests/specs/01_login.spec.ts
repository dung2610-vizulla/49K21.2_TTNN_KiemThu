import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";

test.describe("Login Page Tests", () => {
    let login: LoginPage;

    // Mật khẩu hiện tại của account (bạn nhớ đổi đúng mật khẩu đang dùng)
    const EMAIL = "demo@gmail.com";
    const PASSWORD = "123456";

    test.beforeEach(async ({ page }) => {
        await page.context().clearCookies();
        login = new LoginPage(page);
        await login.openLoginPage();
    });
    test("Login-001 - Log in successfully", async () => {
        await login.login(EMAIL, PASSWORD);
        await login.clickLoginButton();
        await login.verifyLoginSuccess();
    });
    test("Login-002 - Email is empty", async () => {
        await login.login("", PASSWORD);
        await login.clickLoginButton();
        await login.verifyEmailError("Please enter your email");
    });
    test("Login-003 - Email is not registered", async () => {
        await login.login("demogood@gmail.com", PASSWORD);
        await login.clickLoginButton();
        await login.verifySummaryError("Login was unsuccessful. Please correct the errors and try again.");
        await login.verifySummaryError("No customer account found");
    });

    // test("Login-004 - Email is not in correct format (missing @)", async () => {
    //     await login.login("demogmail.com", PASSWORD);
    //     // await login.disableBrowserValidation();
    //     // await login.blurEmail();
    //     await login.clickLoginButton();
    //     await login.verifyEmailError("Please enter a valid email address.");
    // });

    test("Login-005 - Email is not in correct format (missing .com)", async () => {
        await login.login("demo@gmail", PASSWORD);
        await login.disableBrowserValidation();
        await login.blurEmail();
        await login.clickLoginButton();
        await login.verifyEmailError("Wrong email");
    });

    // test("Login-006 - Email contains spaces", async () => {
    //     await login.login("demo   @gmail.com", PASSWORD);
    //     // await login.disableBrowserValidation();
    //     // await login.blurEmail();
    //     await login.clickLoginButton();
    //     await login.verifyEmailError("Please enter a valid email address.");
    // });

    // test("Login-007 - Email contains invalid characters", async () => {
    //     await login.login("@#$demo@gmail.com", PASSWORD);
    //     // await login.disableBrowserValidation();
    //     // await login.blurEmail();
    //     await login.clickLoginButton();
    //     await login.verifyEmailError("Please enter a valid email address.");
    // });
    test("Login-008 - Password is empty", async () => {
        await login.login(EMAIL, "");
        await login.clickLoginButton();
        await login.verifySummaryError("Login was unsuccessful. Please correct the errors and try again.");
        await login.verifySummaryError("The credentials provided are incorrect");
    });

    test("Login-009 - Password is incorrect", async () => {
        await login.login(EMAIL, "123456789");
        await login.clickLoginButton();
        await login.verifySummaryError("Login was unsuccessful. Please correct the errors and try again.");
        await login.verifySummaryError("The credentials provided are incorrect");
    });

    // test("Login-010 - Email and password are empty", async () => {
    //     await login.login("", "");
    //     await login.clickLoginButton();
    //     await login.verifyEmailError("Please enter your email");
    // });
    // test("Login-011 - Enter invalid password multiple times", async () => {
    //     const invalidPassword = "1111111111";

    //     for (let i = 1; i <= 4; i++) {
    //         await login.fillEmail(EMAIL);
    //         await login.fillPassword(invalidPassword);
    //         await login.clickLoginButton();
    //         await login.verifySummaryError("Your account has been locked out. Please contact our store owner.");
    //     }
    // });
    // test("Login-012 - Login successfully with Remember me checked", async () => {
    //     await login.fillEmail(EMAIL);
    //     await login.fillPassword(PASSWORD);
    //     await login.tickRememberMe();
    //     await login.clickLoginButton();
    //     await login.verifyLoginSuccess();
    // });
    // test("ForgotPassword-013 - Navigate to Forgot Password page and verify message", async () => {
    //     await login.openLoginPage();

    //     await login.goToForgotPasswordPage();

    //     await login.verifyForgotPasswordMessage();
    // });

    // test("Login-014 - Verify show password", async () => {
    //     await login.fillPassword("123456");

    //     await login.verifyPasswordIsMasked();

    //     await login.clickShowPassword();

    //     await login.verifyPasswordIsVisible();
    // });

    // test("Login-015 - Verify that Enter key works", async () => {
    //     await login.fillEmail(EMAIL);
    //     await login.fillPassword(PASSWORD);

    //     await login.pressEnterToLogin();

    //     await login.verifyLoginSuccess();
    // });

    // test("Login-016 - Login successfully after registration", async () => {
    //     await login.login(EMAIL, PASSWORD);
    //     await login.clickLoginButton();
    //     await login.verifyLoginSuccess();
    // });

    // test("Login-017 - Verify that password is masked", async () => {
    //     await login.fillEmail(EMAIL);
    //     await login.fillPassword(PASSWORD);

    //     await login.verifyPasswordIsMasked();
    // });
});