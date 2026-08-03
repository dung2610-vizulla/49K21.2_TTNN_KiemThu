import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { ChangePasswordPage } from "../../pages/ChangePasswordPage";

test.describe("Change Password Tests", () => {
    let login: LoginPage;
    let changePass: ChangePasswordPage;

    test.beforeEach(async ({ page }) => {
        login = new LoginPage(page);
        changePass = new ChangePasswordPage(page);

        await login.openLoginPage();
        await login.login("demo@gmail.com", "123456");
        await login.clickLoginButton();
        await changePass.openChangePasswordPage();
    });

    test("ChangePassword-002 - Old password is empty", async () => {
        await changePass.changePassword("", "intern2026@", "intern2026@");
        await changePass.verifyOldPasswordError("Old password is required.");
    });

    test("ChangePassword-003 - Incorrect Old password", async () => {
        await changePass.changePassword("testuserintern", "intern2026@", "intern2026@");
        await changePass.verifySummaryError("Old password doesn't match");
    });

    test("ChangePassword-004 - New password is empty", async () => {
        await changePass.changePassword("123456", "", "intern2026@");
        await changePass.verifyConfirmPasswordError("The new password and confirmation password do not match.");
    });

    // test("ChangePassword-005 - New password only spaces", async () => {
    //     await changePass.changePassword("123456", "      ", "intern2026@");
    //     await changePass.verifyConfirmPasswordError("The new password and confirmation password do not match.");
    // });

    test("ChangePassword-006 - New password less than 6 characters", async () => {
        await changePass.changePassword("123456", "tts", "tts");
        await changePass.verifyNewPasswordError("Password must meet the following rules: must have at least 6 characters and not greater than 64 characters");
    });

    test("ChangePassword-007 - New password more than 64 characters", async () => {
        const longPass = "A".repeat(65);
        await changePass.changePassword("123456", longPass, longPass);
        await changePass.verifyNewPasswordError("Password must meet the following rules: must have at least 6 characters and not greater than 64 characters");
    });

    test("ChangePassword-008 - Confirm password is empty", async () => {
        await changePass.changePassword("123456", "intern2026@", "");
        await changePass.verifyConfirmPasswordError("Password is required.");
    });

    // test("ChangePassword-009 - Confirm password only spaces", async () => {
    //     await changePass.changePassword("123456", "intern2026@", "     ");
    //     await changePass.verifyConfirmPasswordError("The new password and confirmation password do not match.");
    // });

    test("ChangePassword-010 - Confirm password does not match", async () => {
        await changePass.changePassword("123456", "internbinhdinh", "intern");
        await changePass.verifyConfirmPasswordError("The new password and confirmation password do not match.");
    });

    test("ChangePassword-011 - New password same as Old password", async () => {
        await changePass.changePassword("123456", "123456", "123456");
        await changePass.verifySummaryError("You entered the password that is the same as one of the last passwords you used. Please create a new password.");
    });

    test("ChangePassword-001 - Change Password successful", async () => {
        await changePass.changePassword(
            "123456",
            "TMAintern2026@123",
            "TMAintern2026@123"
        );
        await changePass.verifySuccessMessage();
    });

});