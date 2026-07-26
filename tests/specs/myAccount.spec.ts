import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { MyAccountPage } from "../../pages/MyAccountPage";

test.describe("My Account - Customer Info & Addresses", () => {
    let login: LoginPage;
    let myAccount: MyAccountPage;

    test.beforeEach(async ({ page }) => {
        // Chỉ cần clearCookies là đủ
        await page.context().clearCookies();

        login = new LoginPage(page);
        myAccount = new MyAccountPage(page);

        // Login lại mỗi test để đảm bảo trạng thái sạch
        await login.openLoginPage();
        await login.login("demo@gmail.com", "1234567");
        await login.clickLoginButton();
        await expect(page.locator("a.ico-logout")).toBeVisible({ timeout: 10000 });
    });

    test.afterEach(async ({ page }) => {
        try {
            // Đóng notification nếu đang hiện
            const closeBtn = page.locator("#bar-notification .close");
            if (await closeBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
                await closeBtn.click({ force: true });
            }

            // Chỉ clear cookies
            await page.context().clearCookies();
        } catch (e) {
            // Bỏ qua lỗi trong afterEach
            console.log("afterEach cleanup error (ignored)");
        }
    });

    // ========== Customer Info ==========
    test("MyAccount-001 - Update Customer info successfully", async () => {
        await myAccount.openCustomerInfo();
        await myAccount.fillCustomerInfo({
            firstName: "Test",
            lastName: "Intern",
            //email: "testuserintern07@gmail.com"
        });
        await myAccount.clickSaveInfo();
        await myAccount.verifySuccessMessage("The customer info has been updated successfully.");
    });

    test("MyAccount-002 - First name is empty", async () => {
        await myAccount.openCustomerInfo();
        await myAccount.fillCustomerInfo({ firstName: "" });
        await myAccount.clickSaveInfo();
        await myAccount.verifyFirstNameError("First name is required.");
    });

    test("MyAccount-003 - First name exceeds maximum length", async () => {
        await myAccount.openCustomerInfo();
        await myAccount.fillCustomerInfo({ firstName: "a".repeat(801) });
        await myAccount.clickSaveInfo();
        await myAccount.verifyFirstNameError("First name must not exceed 800 characters.");
    });

    test("MyAccount-004 - Only spaces in First name", async () => {
        await myAccount.openCustomerInfo();
        await myAccount.fillCustomerInfo({
            firstName: "   ",
            lastName: "Intern"
        });
        await myAccount.clickSaveInfo();
        await myAccount.verifyFirstNameError("First name is required.");
    });

    test("MyAccount-005 - Last name is empty", async () => {
        await myAccount.openCustomerInfo();
        await myAccount.fillCustomerInfo({ lastName: "" });
        await myAccount.clickSaveInfo();
        await myAccount.verifyLastNameError("Last name is required.");
    });

    test("MyAccount-006 - Last name exceeds maximum length", async () => {
        await myAccount.openCustomerInfo();
        await myAccount.fillCustomerInfo({ lastName: "a".repeat(801) });
        await myAccount.clickSaveInfo();
        await myAccount.verifyFirstNameError("Last name must not exceed 800 characters.");
    });

    test("MyAccount-008 - Email is empty", async () => {
        await myAccount.openCustomerInfo();
        await myAccount.fillCustomerInfo({ email: "" });
        await myAccount.clickSaveInfo();
        await myAccount.verifyEmailError("Email is required.");
    });

    test("MyAccount-009 - Duplicate email", async () => {
        await myAccount.openCustomerInfo();
        await myAccount.fillCustomerInfo({ email: "testuserintern09@gmail.com" });
        await myAccount.clickSaveInfo();
        await myAccount.verifySummaryError("The email address is already in use");
    });

    test("MyAccount-010 - Email invalid format", async () => {
        await myAccount.openCustomerInfo();
        await myAccount.fillCustomerInfo({ email: "testuserintern01" });
        await myAccount.clickSaveInfo();
        await myAccount.verifyEmailError("Please enter a valid email address.");
    });

    test("MyAccount-011 - Email without @ symbol", async () => {
        await myAccount.openCustomerInfo();
        await myAccount.fillCustomerInfo({ email: "testuserintern01gamil.com" });
        await myAccount.clickSaveInfo();
        await myAccount.verifyEmailError("Please enter a valid email address.");
    });

    test("MyAccount-012 - Email without domain", async () => {
        await myAccount.openCustomerInfo();
        await myAccount.fillCustomerInfo({ email: "testuserintern01@gmail" });
        await myAccount.clickSaveInfo();
        await myAccount.verifyEmailError("Wrong email");
    });

    test("MyAccount-013 - Email containing unsupported special characters.", async () => {
        await myAccount.openCustomerInfo();
        await myAccount.fillCustomerInfo({ email: "testuserintern01$@#@gmail.com" });
        await myAccount.clickSaveInfo();
        await myAccount.verifyEmailError("Please enter a valid email address.");
        // In ra để kiểm tra
        const errorText = await myAccount.page.locator('[data-valmsg-for="Email"]').textContent();
        console.log("Actual error message:", errorText);

        await myAccount.verifyEmailError("Please enter a valid email address.");
    });

    test("MyAccount-014 - Company name exceeds maximum length", async () => {
        await myAccount.openCustomerInfo();

        await myAccount.fillCustomerInfo({ company: "a".repeat(801) });

        await myAccount.clickSaveInfo();
        await expect(myAccount.page.locator('[data-valmsg-for="Company"]'))
            .toContainText("Company name must not exceed 800 characters.");
    });

    // ========== Add Address ==========
    test("MyAccount-015 - Add Address successfully", async () => {
        await myAccount.openAddresses();
        await myAccount.clickAddNewAddress();

        await myAccount.fillAddress({
            firstName: "Tester",
            lastName: "Intern",
            email: "testuserintern01@gmail.com",
            country: "Vietnam",
            stateProvince: "Đà Nẵng",
            city: "Đà Nẵng",
            address1: "Mỹ An",
            zip: "55000",
            phone: "0333654781"
        });

        await myAccount.clickSaveAddress();
        await myAccount.verifySuccessMessage("The new address has been added successfully.");
    });

    test("MyAccount-016 - Address First name is empty", async () => {
        await myAccount.openAddresses();
        await myAccount.clickAddNewAddress();
        await myAccount.fillAddress({ firstName: "" });
        await myAccount.clickSaveAddress();
        await expect(myAccount.page.locator('[data-valmsg-for="Address.FirstName"]')).toContainText("First name is required.");
    });

    test("MyAccount-017 - Input only spaces in First name", async () => {
        await myAccount.openAddresses();
        await myAccount.clickAddNewAddress();
        await myAccount.fillAddress({
            firstName: "   ",
            lastName: "Intern",
            email: "testuserintern01@gmail.com",
            country: "Vietnam",
            stateProvince: "Đà Nẵng",
            city: "Đà Nẵng",
            address1: "Mỹ An",
            zip: "55000",
            phone: "12456789"
        });
        await myAccount.clickSaveAddress();
        await expect(myAccount.page.locator('[data-valmsg-for="Address.FirstName"]')).toContainText("First name is required.");
    });

    test("MyAccount-018 - Address Last name is empty", async () => {
        await myAccount.openAddresses();
        await myAccount.clickAddNewAddress();
        await myAccount.fillAddress({ lastName: "" });
        await myAccount.clickSaveAddress();
        await expect(myAccount.page.locator('[data-valmsg-for="Address.LastName"]')).toContainText("Last name is required.");
    });

    test("MyAccount-019 - Input only spaces in Last name", async () => {
        await myAccount.openAddresses();
        await myAccount.clickAddNewAddress();
        await myAccount.fillAddress({
            firstName: "Tester",
            lastName: "  ",
            email: "testuserintern01@gmail.com",
            country: "Vietnam",
            stateProvince: "Đà Nẵng",
            city: "Đà Nẵng",
            address1: "Mỹ An",
            zip: "55000",
            phone: "12456789"
        });
        await myAccount.clickSaveAddress();
        await expect(myAccount.page.locator('[data-valmsg-for="Address.LastName"]')).toContainText("Last name is required.");
    });

    test("MyAccount-020 - Address Email is empty", async () => {
        await myAccount.openAddresses();
        await myAccount.clickAddNewAddress();
        await myAccount.fillAddress({ email: "" });
        await myAccount.clickSaveAddress();
        await expect(myAccount.page.locator('[data-valmsg-for="Address.Email"]')).toContainText("Email is required.");
    });

    test("MyAccount-021 - Input invalid email", async () => {
        await myAccount.openAddresses();
        await myAccount.clickAddNewAddress();
        await myAccount.fillAddress({ email: "testuserintern01" });
        await myAccount.clickSaveAddress();
        await expect(myAccount.page.locator('[data-valmsg-for="Address.Email"]')).toContainText("Please enter a valid email address.");
    });

    test("MyAccount-022 - Input email without @ symbol", async () => {
        await myAccount.openAddresses();
        await myAccount.clickAddNewAddress();
        await myAccount.fillAddress({ email: "testuserintern01gmail.com" });
        await myAccount.clickSaveAddress();
        await expect(myAccount.page.locator('[data-valmsg-for="Address.Email"]')).toContainText("Please enter a valid email address.");
    });

    test("MyAccount-023 - Input email without domain", async () => {
        await myAccount.openAddresses();
        await myAccount.clickAddNewAddress();
        await myAccount.fillAddress({ email: "testuserintern01@gmail" });
        await myAccount.clickSaveAddress();
        await expect(myAccount.page.locator('[data-valmsg-for="Address.Email"]')).toContainText("Wrong email");
    });

    test("MyAccount-024 - Input email  containing unsupported special characters.", async () => {
        await myAccount.openAddresses();
        await myAccount.clickAddNewAddress();
        await myAccount.fillAddress({ email: "testuserintern01#$%@gmail.com" });
        await myAccount.clickSaveAddress();
        await expect(myAccount.page.locator('[data-valmsg-for="Address.Email"]')).toContainText("Please enter a valid email address.");
    });

    test("MyAccount-025 - Address country is empty", async () => {
        await myAccount.openAddresses();
        await myAccount.clickAddNewAddress();
        await myAccount.fillAddress({
            firstName: "Tester",
            lastName: "Intern",
            email: "testuserintern01@gmail.com",
            country: "",
            city: "Đà Nẵng",
            address1: "Mỹ An",
            zip: "55000",
            phone: "123456789"
        });
        await myAccount.clickSaveAddress();
        await expect(myAccount.page.locator('[data-valmsg-for="Address.CountryId"]')).toContainText("Country is required.");
    });

    test("MyAccount-026 - City is empty", async () => {
        await myAccount.openAddresses();
        await myAccount.clickAddNewAddress();
        await myAccount.fillAddress({
            firstName: "Tester",
            lastName: "Intern",
            email: "testuserintern01@gmail.com",
            country: "Vietnam",
            stateProvince: "Đà Nẵng",
            city: "",
            address1: "Mỹ An",
            zip: "55000",
            phone: "123456789"
        });
        await myAccount.clickSaveAddress();
        await expect(myAccount.page.locator('[data-valmsg-for="Address.City"]')).toContainText("City is required");
    });

    test("MyAccount-027 - Input only spaces on City", async () => {
        await myAccount.openAddresses();
        await myAccount.clickAddNewAddress();
        await myAccount.fillAddress({
            firstName: "Tester",
            lastName: "Intern",
            email: "testuserintern01@gmail.com",
            country: "Vietnam",
            stateProvince: "Đà Nẵng",
            city: "  ",
            address1: "Mỹ An",
            zip: "55000",
            phone: "123456789"
        });
        await myAccount.clickSaveAddress();
        await expect(myAccount.page.locator('[data-valmsg-for="Address.City"]')).toContainText("City is required");
    });

    test("MyAccount-028 - Address 1 is empty", async () => {
        await myAccount.openAddresses();
        await myAccount.clickAddNewAddress();
        await myAccount.fillAddress({ address1: "" });
        await myAccount.clickSaveAddress();
        await expect(myAccount.page.locator('[data-valmsg-for="Address.Address1"]')).toContainText("Street address is required");
    });

    test("MyAccount-029 - Input only spaces on Address 1", async () => {
        await myAccount.openAddresses();
        await myAccount.clickAddNewAddress();
        await myAccount.fillAddress({
            firstName: "Tester",
            lastName: "Intern",
            email: "testuserintern01@gmail.com",
            country: "Vietnam",
            stateProvince: "Đà Nẵng",
            city: "Đà Nẵng",
            address1: "     ",
            zip: "55000",
            phone: "123456789"
        });
        await myAccount.clickSaveAddress();
        await expect(myAccount.page.locator('[data-valmsg-for="Address.Address1"]')).toContainText("Street address is required");
    });

    test("MyAccount-030 - Zip / postal code is empty", async () => {
        await myAccount.openAddresses();
        await myAccount.clickAddNewAddress();
        await myAccount.fillAddress({ zip: "" });
        await myAccount.clickSaveAddress();
        await expect(myAccount.page.locator('[data-valmsg-for="Address.ZipPostalCode"]')).toContainText("Zip / postal code is required");
    });

    test("MyAccount-031 - Input only spaces on Zip / postal code", async () => {
        await myAccount.openAddresses();
        await myAccount.clickAddNewAddress();
        await myAccount.fillAddress({
            firstName: "Tester",
            lastName: "Intern",
            email: "testuserintern01@gmail.com",
            country: "Vietnam",
            stateProvince: "Đà Nẵng",
            city: "Đà Nẵng",
            address1: "Mỹ An",
            zip: "  ",
            phone: "123456789"
        });
        await myAccount.clickSaveAddress();
        await expect(myAccount.page.locator('[data-valmsg-for="Address.ZipPostalCode"]')).toContainText("Zip / postal code is required");
    });

    test("MyAccount-032 - Input alphabetic characters in Zip code", async () => {
        await myAccount.openAddresses();
        await myAccount.clickAddNewAddress();
        await myAccount.fillAddress({ zip: "abcd" });
        await myAccount.clickSaveAddress();
        await expect(myAccount.page.locator('[data-valmsg-for="Address.ZipPostalCode"]')).toContainText("Zip code must be numeric");
    });

    test("MyAccount-033 - Input special characters in Zip code", async () => {
        await myAccount.openAddresses();
        await myAccount.clickAddNewAddress();
        await myAccount.fillAddress({ zip: "@#$%" });
        await myAccount.clickSaveAddress();
        await expect(myAccount.page.locator('[data-valmsg-for="Address.ZipPostalCode"]')).toContainText("Zip code must be numeric");
    });

    test("MyAccount-034 - Phone number is empty", async () => {
        await myAccount.openAddresses();
        await myAccount.clickAddNewAddress();
        await myAccount.fillAddress({ phone: "" });
        await myAccount.clickSaveAddress();
        await expect(myAccount.page.locator('[data-valmsg-for="Address.PhoneNumber"]')).toContainText("Phone is required");
    });

    test("MyAccount-035 - Input only spaces on Phone number", async () => {
        await myAccount.openAddresses();
        await myAccount.clickAddNewAddress();
        await myAccount.fillAddress({
            firstName: "Tester",
            lastName: "Intern",
            email: "testuserintern01@gmail.com",
            country: "Vietnam",
            stateProvince: "Đà Nẵng",
            city: "Đà Nẵng",
            address1: "Mỹ An",
            zip: "55000",
            phone: "   "
        });
        await myAccount.clickSaveAddress();
        await expect(myAccount.page.locator('[data-valmsg-for="Address.PhoneNumber"]')).toContainText("Phone is required");
    });

    test("MyAccount-036 - Input alphabetic characters in Phone number", async () => {
        await myAccount.openAddresses();
        await myAccount.clickAddNewAddress();
        await myAccount.fillAddress({ phone: "abcdef" });
        await myAccount.clickSaveAddress();
        await expect(myAccount.page.locator('[data-valmsg-for="Address.PhoneNumber"]')).toContainText("Phone number must be numeric");
    });

    test("MyAccount-037 - Input special characters in Phone numberr", async () => {
        await myAccount.openAddresses();
        await myAccount.clickAddNewAddress();
        await myAccount.fillAddress({ phone: "@#$%" });
        await myAccount.clickSaveAddress();
        await expect(myAccount.page.locator('[data-valmsg-for="Address.PhoneNumber"]')).toContainText("Phone number must be numeric");
    });

    test("MyAccount-038 - Leave State / province empty", async () => {
        await myAccount.openAddresses();
        await myAccount.clickAddNewAddress();
        await myAccount.fillAddress({
            firstName: "Tester",
            lastName: "Intern",
            email: "testuserintern01@gmail.com",
            country: "Vietnam",
            stateProvince: "",
            city: "Đà Nẵng",
            address1: "Mỹ An",
            zip: "55000",
            phone: "12456789"
        });
        await myAccount.clickSaveAddress();
        await expect(myAccount.page.locator('[data-valmsg-for="Address.StateProvinceId"]')).toContainText("State / province is required.");
    });
});