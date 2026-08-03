import { test, expect, type Page } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { ProductPage } from '../../pages/ProductPage';
import { ShoppingCartPage } from '../../pages/ShoppingCart';
import { WishListPage } from '../../pages/WishListPage';
test.describe("Shopping Cart Tests", () => {

test.beforeEach(async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com');
});
 
// Navigate Home > Computers > Notebooks > Asus Laptop (id 5)
async function asusLaptop_5(page: Page) {
    const homePage = new HomePage(page);
 
    //await homePage.gotoHome();
    await homePage.clickComputersMenu();
    await homePage.clickSubCategory('Notebooks');
    await homePage.openProductByExactName('Asus Laptop');
}
 
// async function womenTShirt_30(page: Page) {
//     const homePage = new HomePage(page);
//     await homePage.gotoHome();
//     await homePage.clickApparelMenu();
//     await homePage.clickSubCategory('Clothing');
//     await homePage.openProductByExactName('Oversized Women T-Shirt');
// }
 
// QUANTITY
test('AddProduct-001 - Add product to cart with quantity = 1', async ({ page }) => {
    
    const productPage = new ProductPage(page);
    await asusLaptop_5(page);
 
    await productPage.addProductToCart(5, '1');
 
    // Expected result
    await expect(productPage.successNotification).toContainText('The product has been added to your shopping cart');
    await page.waitForTimeout(2000);
});
 
test('AddProduct-002 - Add product to cart with quantity = 10000', async ({ page }) => {
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
 
    await homePage.clickComputersMenu();
    await homePage.clickSubCategory('Notebooks');
    await homePage.openProductByPartialName('HP Envy 15.6-Inch Sleekbook');
 
    await productPage.addProductToCart(8, '10000');
 
    // Expected result
    await expect(productPage.successNotification).toContainText('The product has been added to your shopping cart');
    await page.waitForTimeout(2000);
});
 
test('AddProduct-003 - Add product to cart with  quantity is empty', async ({ page }) => {
    const productPage = new ProductPage(page);
    await asusLaptop_5(page);
 
    await productPage.addProductToCart(5, '');
 
    // Expected result
    await expect(productPage.contentMessage).toContainText('Quantity should be positive');
    await page.waitForTimeout(2000);
});
 
test('AddProduct-004 - Add product to cart with quantity less than 1', async ({ page }) => {
    const productPage = new ProductPage(page);
    await asusLaptop_5(page);
 
    await productPage.addProductToCart(5, '-1');
 
    // Expected result
    await expect(productPage.contentMessage).toContainText('Quantity should be positive');
    await page.waitForTimeout(2000);
});
 
test('AddProduct-005 - Add product to cart with quantity of 0', async ({ page }) => {
    const productPage = new ProductPage(page);
    await asusLaptop_5(page);
 
    await productPage.addProductToCart(5, '0');
 
    // Expected result
    await expect(productPage.contentMessage).toContainText('Quantity should be positive');
    await page.waitForTimeout(2000);
});
 
// test('AddProduct-006 - Add product to cart with quantity is decimal numbers', async ({ page }) => {
//     const productPage = new ProductPage(page);
//     await asusLaptop_5(page);
 
//     await productPage.addProductToCart(5, '9.5');
 
//     // Expected result
//     await expect(productPage.contentMessage).toContainText('Quantity should be positive');
//     await page.waitForTimeout(2000);
// });
 
test('AddProduct-007 - Add product to cart with quantity greater than 10000', async ({ page }) => {
    const productPage = new ProductPage(page);
    await asusLaptop_5(page);
 
    await productPage.addProductToCart(5, '10001');
 
    // Expected result
    await expect(productPage.contentMessage).toContainText('The maximum quantity allowed for purchase is 10000.');
    await page.waitForTimeout(2000);
});
 
test('AddProduct-008 - Add product to cart with quantity is not number', async ({ page }) => {
    const productPage = new ProductPage(page);
    await asusLaptop_5(page);
 
    await productPage.addProductToCart(5, 'abc');
 
    // Expected result
    await expect(productPage.contentMessage).toContainText('Quantity should be positive');
    await page.waitForTimeout(2000);
});
 
// PRODUCT WITH VARIANTS (SIZE, COLOR, TYPE)
// test('AddProduct-009 - Product with variants(size, color, type) successfully added to cart.', async ({ page }) => {
//     const homePage = new HomePage(page);
//     const productPage = new ProductPage(page);
 
//     await homePage.clickApparelMenu();
//     await homePage.clickSubCategory('Shoes');
//     await homePage.openProductByExactName('Nike Floral Roshe Customized Running Shoes');
 
//     // Select size
//     await productPage.selectAttribute(6, '8');
//     // Select Color
//     await productPage.selectAttribute(7, 'White/Blue');
//     // Select Print = Natural
//     await productPage.checkAttributeSquare(8, 19);
 
//     await productPage.addProductToCart(26, '1');
 
//     // Expected result
//     await expect(productPage.successNotification).toContainText('The product has been added to your shopping cart');
//     await page.waitForTimeout(2000);
// });
 
// test('AddProduct-010 - No Size selected', async ({ page }) => {
//     const homePage = new HomePage(page);
//     const productPage = new ProductPage(page);
 
//     await homePage.clickApparelMenu();
//     await homePage.clickSubCategory('Shoes');
//     await homePage.openProductByExactName('Nike Floral Roshe Customized Running Shoes');
 
//     // Select Color
//     await productPage.selectAttribute(7, 'White/Blue');
//     // Select Print = Natural
//     await productPage.checkAttributeSquare(8, 19);
 
//     await productPage.addProductToCart(26, '1');
 
//     // Expected result
//     await expect(productPage.contentMessage).toContainText('Please select Size');
//     await page.waitForTimeout(2000);
// });
 
// test('AddProduct-011 - No Color selected', async ({ page }) => {
//     const homePage = new HomePage(page);
//     const productPage = new ProductPage(page);
 
//     await homePage.clickApparelMenu();
//     await homePage.clickSubCategory('Shoes');
//     await homePage.openProductByExactName('Nike Floral Roshe Customized Running Shoes');
 
//     // Select size
//     await productPage.selectAttribute(6, '8');
//     // Select Print = Natural
//     await productPage.checkAttributeSquare(8, 19);
 
//     await productPage.addProductToCart(26, '1');
 
//     // Expected result
//     await expect(productPage.contentMessage).toContainText('Please select Color');
//     await page.waitForTimeout(2000);
// });
 
// test('AddProduct-012 - No Print selected', async ({ page }) => {
//     const homePage = new HomePage(page);
//     const productPage = new ProductPage(page);

//     await homePage.clickApparelMenu();
//     await homePage.clickSubCategory('Shoes');
//     await homePage.openProductByExactName('Nike Floral Roshe Customized Running Shoes');
 
//     // Select size
//     await productPage.selectAttribute(6, '8');
//     // Select Color
//     await productPage.selectAttribute(7, 'White/Blue');
 
//     await productPage.addProductToCart(26, '1');
 
//     // Expected result
//     await expect(productPage.contentMessage).toContainText('Please select Print');
//     await page.waitForTimeout(2000);
// });
 
// // PRODUCT WITH VARIANTS (PROCESSOR, RAM, HDD, OS, SOFTWARE)
// test('AddProduct-013 - Product with variants(Processor, RAM, HDD, OS, Software) successfully added to cart.', async ({ page }) => {
//     const homePage = new HomePage(page);
//     const productPage = new ProductPage(page);
 
//     await homePage.clickComputersMenu();
//     await homePage.clickSubCategory('Desktops');
//     await homePage.openProductByExactName('Build your own computer');
 
//     // Select processor
//     await productPage.selectAttribute(1, '2.2 GHz Intel Pentium Dual-Core E2200');
//     // Select RAM
//     await productPage.selectAttribute(2, '2 GB');
//     // Select HDD
//     await productPage.clickAttributeLabel(3, 6);
//     // Select OS
//     await productPage.checkAttributeLabel(4, 9);
 
//     await productPage.addProductToCart(1, '1');
 
//     // Expected result
//     await expect(productPage.successNotification).toContainText('The product has been added to your shopping cart');
//     await page.waitForTimeout(2000);
// });
 
// test('AddProduct-014 - No Processor selected', async ({ page }) => {
//     const homePage = new HomePage(page);
//     const productPage = new ProductPage(page);
 
//     await homePage.clickComputersMenu();
//     await homePage.clickSubCategory('Desktops');
//     await homePage.openProductByExactName('Build your own computer');
 
//     // Select processor = "Please select"
//     await productPage.selectAttribute(1, 'Please select');
//     // Select RAM
//     await productPage.selectAttribute(2, '2 GB');
//     // Select HDD
//     await productPage.clickAttributeLabel(3, 6);
//     // Select OS
//     await productPage.checkAttributeLabel(4, 9);
 
//     await productPage.addProductToCart(1, '1');
 
//     // Expected result
//     await expect(productPage.contentMessage).toContainText('Please select Processor');
//     await page.waitForTimeout(2000);
// });
 
// test('AddProduct-015 - No RAM selected', async ({ page }) => {
//     const homePage = new HomePage(page);
//     const productPage = new ProductPage(page);
 
//     await homePage.clickComputersMenu();
//     await homePage.clickSubCategory('Desktops');
//     await homePage.openProductByExactName('Build your own computer');
 
//     // Select processor
//     await productPage.selectAttribute(1, '2.2 GHz Intel Pentium Dual-Core E2200');
//     // Select HDD
//     await productPage.clickAttributeLabel(3, 6);
//     // Select OS
//     await productPage.checkAttributeLabel(4, 9);
 
//     await productPage.addProductToCart(1, '1');
 
//     // Expected result
//     await expect(productPage.contentMessage).toContainText('Please select RAM');
//     await page.waitForTimeout(2000);
// });
 
// test('AddProduct-016 - No HDD selected', async ({ page }) => {
//     const homePage = new HomePage(page);
//     const productPage = new ProductPage(page);
 
//     await homePage.gotoHome();
//     await homePage.clickComputersMenu();
//     await homePage.clickSubCategory('Desktops');
//     await homePage.openProductByExactName('Build your own computer');
 
//     // Select processor
//     await productPage.selectAttribute(1, '2.2 GHz Intel Pentium Dual-Core E2200');
//     // Select RAM
//     await productPage.selectAttribute(2, '2 GB');
//     // Select OS
//     await productPage.checkAttributeLabel(4, 9);
 
//     await productPage.addProductToCart(1, '1');
 
//     // Expected result
//     await expect(productPage.contentMessage).toContainText('Please select HDD');
//     await page.waitForTimeout(2000);
// });
 
// // PRODUCT WITH VARIANTS (ENTER YOUR TEXT)
// test('AddProduct-017 - Product with variants(Enter your text) successfully added to cart.', async ({ page }) => {
//     const homePage = new HomePage(page);
//     const productPage = new ProductPage(page);
 
//     await homePage.clickApparelMenu();
//     await homePage.clickSubCategory('Clothing');
//     await homePage.openProductByExactName('Custom T-Shirt');
 
//     await productPage.enterCustomText(12, 'This is my custom text');
//     await productPage.addProductToCart(31, '1');
 
//     // Expected result
//     await expect(productPage.successNotification).toContainText('The product has been added to your shopping cart');
//     await page.waitForTimeout(2000);
// });
 
// test('AddProduct-018 - Enter your text is empty', async ({ page }) => {
//     const homePage = new HomePage(page);
//     const productPage = new ProductPage(page);
 
//     await homePage.clickApparelMenu();
//     await homePage.clickSubCategory('Clothing');
//     await homePage.openProductByExactName('Custom T-Shirt');
 
//     await productPage.enterCustomText(12, '');
//     await productPage.addProductToCart(31, '1');
 
//     // Expected result
//     await expect(productPage.contentMessage).toContainText('Enter your text:');
//     await page.waitForTimeout(2000);
// });
 
// // Helper: format a Date as MM/dd/yyyy
// function formatDate(date: Date) {
//     return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
// }
 
// // Helper: format a Date as dd/MM/yyyy (wrong format for this site)
// function wrongFormatDate(date: Date) {
//     return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
// }
 
// // RENTAL
// test('AddProduct-019 - Rental product successfully added to cart.', async ({ page }) => {
//     const homePage = new HomePage(page);
//     const productPage = new ProductPage(page);
 
//     await homePage.clickTopMenuLink('Jewelry');
//     await homePage.openProductByExactName('Elegant Gemstone Necklace (rental)');
 
//     const today = new Date();
//     const startDate = new Date(today);
//     startDate.setDate(startDate.getDate() + 3);
//     const endDate = new Date(startDate);
//     endDate.setDate(endDate.getDate() + 5);
 
//     await productPage.fillRentalStartDate(39, formatDate(startDate));
//     await productPage.fillRentalEndDate(39, formatDate(endDate));
 
//     await productPage.addProductToCart(39, '1');
 
//     // Expected result
//     await expect(productPage.successNotification).toContainText('The product has been added to your shopping cart');
// });
 
// test('AddProduct-020 - Rental product added to cart with start date is empty', async ({ page }) => {
//     const homePage = new HomePage(page);
//     const productPage = new ProductPage(page);
 
//     await homePage.gotoHome();
//     await homePage.clickTopMenuLink('Jewelry');
//     await homePage.openProductByExactName('Elegant Gemstone Necklace (rental)');
 
//     const today = new Date();
//     const endDate = new Date(today);
//     endDate.setDate(endDate.getDate() + 5);
 
//     await productPage.fillRentalEndDate(39, formatDate(endDate));
//     await productPage.addProductToCart(39, '1');
 
//     // Expected result
//     await expect(productPage.contentMessage).toContainText('Enter rental start date');
//     await page.waitForTimeout(2000);
// });
 
// // test('AddProduct-021 - Start date is not in the mm/dd/yyyy format', async ({ page }) => {
// //     const homePage = new HomePage(page);
// //     const productPage = new ProductPage(page);
 
// //     await homePage.gotoHome();
// //     await homePage.clickTopMenuLink('Jewelry');
// //     await homePage.openProductByExactName('Elegant Gemstone Necklace (rental)');
 
// //     const today = new Date();
// //     const startDate = new Date(today);
// //     startDate.setDate(startDate.getDate() + 3);
// //     const endDate = new Date(startDate);
// //     endDate.setDate(endDate.getDate() + 5);
 
// //     // Start date: WRONG format
// //     await productPage.fillRentalStartDate(39, wrongFormatDate(startDate));
// //     await page.waitForTimeout(5000);
// //     // End date: CORRECT format
// //     await productPage.fillRentalEndDate(39, formatDate(endDate));
 
// //     await productPage.addProductToCart(39, '1');
 
// //     // Expected result
// //     await expect(productPage.contentMessage).toContainText('Enter rental start date');
// //     await page.waitForTimeout(2000);
// // });
 
// test('AddProduct-022 - Rental product added to cart with start date is earlier than current date', async ({ page }) => {
//     const homePage = new HomePage(page);
//     const productPage = new ProductPage(page);
 
//     await homePage.gotoHome();
//     await homePage.clickTopMenuLink('Jewelry');
//     await homePage.openProductByExactName('Elegant Gemstone Necklace (rental)');
 
//     const today = new Date();
//     const startDate = new Date(today);
//     startDate.setDate(startDate.getDate() - 3);
//     const endDate = new Date(startDate);
//     endDate.setDate(endDate.getDate() + 5);
 
//     await productPage.fillRentalStartDate(39, formatDate(startDate));
//     await productPage.fillRentalEndDate(39, formatDate(endDate));
 
//     await productPage.addProductToCart(39, '1');
 
//     // Expected result
//     await expect(productPage.contentMessage).toContainText('Rental start date should be the future date');
//     await page.waitForTimeout(2000);
// });
 
// test('AddProduct-023 - Rental product added to cart with end date is empty', async ({ page }) => {
//     const homePage = new HomePage(page);
//     const productPage = new ProductPage(page);
 
//     await homePage.gotoHome();
//     await homePage.clickTopMenuLink('Jewelry');
//     await homePage.openProductByExactName('Elegant Gemstone Necklace (rental)');
 
//     const today = new Date();
//     const startDate = new Date(today);
//     startDate.setDate(startDate.getDate() + 3);
 
//     await productPage.fillRentalStartDate(39, formatDate(startDate));
//     await productPage.addProductToCart(39, '1');
 
//     // Expected result
//     await expect(productPage.contentMessage).toContainText('Enter rental end date');
//     await page.waitForTimeout(2000);
// });
 
// // test('AddProduct-024 - End date is not in the mm/dd/yyyy format', async ({ page }) => {
// //     const homePage = new HomePage(page);
// //     const productPage = new ProductPage(page);
 
// //     await homePage.gotoHome();
// //     await homePage.clickTopMenuLink('Jewelry');
// //     await homePage.openProductByExactName('Elegant Gemstone Necklace (rental)');
 
// //     const today = new Date();
// //     const startDate = new Date(today);
// //     startDate.setDate(startDate.getDate() + 3);
// //     const endDate = new Date(startDate);
// //     endDate.setDate(endDate.getDate() + 1);
 
// //     // Start date: CORRECT format
// //     await productPage.fillRentalStartDate(39, formatDate(startDate));
// //     await page.waitForTimeout(5000);
// //     // End date: WRONG format
// //     await productPage.fillRentalEndDate(39, wrongFormatDate(endDate));
 
// //     await productPage.addProductToCart(39, '1');
 
// //     // Expected result
// //     await expect(productPage.contentMessage).toContainText('Enter rental end date');
// //     await page.waitForTimeout(2000);
// // });
 
// test('AddProduct-025 - Rental product added to cart with end date is earlier than Start date', async ({ page }) => {
//     const homePage = new HomePage(page);
//     const productPage = new ProductPage(page);
 
//     await homePage.gotoHome();
//     await homePage.clickTopMenuLink('Jewelry');
//     await homePage.openProductByExactName('Elegant Gemstone Necklace (rental)');
 
//     const today = new Date();
//     const startDate = new Date(today);
//     startDate.setDate(startDate.getDate() + 3);
//     const endDate = new Date(today);
//     endDate.setDate(endDate.getDate() + 2);
 
//     await productPage.fillRentalStartDate(39, formatDate(startDate));
//     await productPage.fillRentalEndDate(39, formatDate(endDate));
 
//     await productPage.addProductToCart(39, '1');
 
//     // Expected result
//     await expect(productPage.contentMessage).toContainText('Rental start date should be less than end date');
// });
 
// // GIFT CARD
// test('AddProduct-026 - Gift card successfully added to cart', async ({ page }) => {
//     const homePage = new HomePage(page);
//     const productPage = new ProductPage(page);
 
//     await homePage.gotoHome();
//     await homePage.clickTopMenuLink('Gift Cards');
//     await homePage.openProductByPartialName('$25 Virtual Gift Card');
 
//     await productPage.fillGiftCardInfo(42, 'Nghi', 'phuongnghi99@gmail.com', 'dung', 'dunghoang@gmail.com');
//     await productPage.addProductToCart(42, '1');
 
//     // Expected result
//     await expect(productPage.successNotification).toContainText('The product has been added to your shopping cart');
//     await page.waitForTimeout(2000);
// });
 
// test('AddProduct-027 - Gift card unsuccessful added to cart by Recipients Name is empty', async ({ page }) => {
//     const homePage = new HomePage(page);
//     const productPage = new ProductPage(page);
 
//     await homePage.gotoHome();
//     await homePage.clickTopMenuLink('Gift Cards');
//     await homePage.openProductByPartialName('$25 Virtual Gift Card');
 
//     await productPage.fillGiftCardInfo(42, '', 'phuongnghi99@gmail.com', 'dung', 'dunghoang@gmail.com');
//     await productPage.addProductToCart(42, '1');
 
//     // Expected result
//     await expect(productPage.contentMessage).toContainText('Enter valid recipient name');
//     await page.waitForTimeout(2000);
// });
 
// test('AddProduct-028 - Gift card unsuccessful added to cart by Recipients Name contains special characters', async ({ page }) => {
//     const homePage = new HomePage(page);
//     const productPage = new ProductPage(page);
 
//     await homePage.gotoHome();
//     await homePage.clickTopMenuLink('Gift Cards');
//     await homePage.openProductByPartialName('$25 Virtual Gift Card');
 
//     await productPage.fillGiftCardInfo(42, 'nghi@#$%', 'phuongnghi99@gmail.com', 'dung', 'dunghoang@gmail.com');
//     await productPage.addProductToCart(42, '1');
 
//     // Expected result
//     await expect(productPage.contentMessage).toContainText('Enter valid recipient name');
//     await page.waitForTimeout(2000);
// });
 
// test('AddProduct-029 - Gift card unsuccessful added to cart by Recipients Name contains numbers', async ({ page }) => {
//     const homePage = new HomePage(page);
//     const productPage = new ProductPage(page);
 
//     await homePage.gotoHome();
//     await homePage.clickTopMenuLink('Gift Cards');
//     await homePage.openProductByPartialName('$25 Virtual Gift Card');
 
//     await productPage.fillGiftCardInfo(42, 'nghi12345', 'phuongnghi99@gmail.com', 'dung', 'dunghoang@gmail.com');
//     await productPage.addProductToCart(42, '1');
 
//     // Expected result
//     await expect(productPage.contentMessage).toContainText('Enter valid recipient name');
//     await page.waitForTimeout(2000);
// });
 
// test('AddProduct-030 - Gift card unsuccessful added to cart by Recipients Email is empty', async ({ page }) => {
//     const homePage = new HomePage(page);
//     const productPage = new ProductPage(page);
 
//     await homePage.gotoHome();
//     await homePage.clickTopMenuLink('Gift Cards');
//     await homePage.openProductByPartialName('$25 Virtual Gift Card');
 
//     await productPage.fillGiftCardInfo(42, 'nghi', '', 'dung', 'dunghoang@gmail.com');
//     await productPage.addProductToCart(42, '1');
 
//     // Expected result
//     await expect(productPage.contentMessage).toContainText('Enter valid recipient email');
//     await page.waitForTimeout(2000);
// });
 
// test('AddProduct-031 - Gift card unsuccessful added to cart by Recipients Email is not in corect format @', async ({ page }) => {
//     const homePage = new HomePage(page);
//     const productPage = new ProductPage(page);
 
//     await homePage.gotoHome();
//     await homePage.clickTopMenuLink('Gift Cards');
//     await homePage.openProductByPartialName('$25 Virtual Gift Card');
 
//     await productPage.fillGiftCardInfo(42, 'nghi', 'phuongnghigmail.com', 'dung', 'dunghoang@gmail.com');
//     await productPage.addProductToCart(42, '1');
 
//     // Expected result
//     await expect(productPage.contentMessage).toContainText('Enter valid recipient email');
//     await page.waitForTimeout(2000);
// });
 
// test('AddProduct-032 - Gift card unsuccessful added to cart by Recipients Email is not in corect format ".com"', async ({ page }) => {
//     const homePage = new HomePage(page);
//     const productPage = new ProductPage(page);
 
//     await homePage.gotoHome();
//     await homePage.clickTopMenuLink('Gift Cards');
//     await homePage.openProductByPartialName('$25 Virtual Gift Card');
 
//     await productPage.fillGiftCardInfo(42, 'nghi', 'phuongnghi@gmail', 'dung', 'dunghoang@gmail.com');
//     await productPage.addProductToCart(42, '1');
 
//     // Expected result
//     await expect(productPage.contentMessage).toContainText('Enter valid recipient email');
//     await page.waitForTimeout(2000);
// });
 
// test('AddProduct-033 - Gift card unsuccessful added to cart by Recipients Email contains spaces', async ({ page }) => {
//     const homePage = new HomePage(page);
//     const productPage = new ProductPage(page);
 
//     await homePage.gotoHome();
//     await homePage.clickTopMenuLink('Gift Cards');
//     await homePage.openProductByPartialName('$25 Virtual Gift Card');
 
//     await productPage.fillGiftCardInfo(42, 'nghi', 'phuongnghi @gmail.com', 'dung', 'dunghoang@gmail.com');
//     await productPage.addProductToCart(42, '1');
 
//     // Expected result
//     await expect(productPage.contentMessage).toContainText('Enter valid recipient email');
//     await page.waitForTimeout(2000);
// });
 
// test('AddProduct-034 - Gift card unsuccessful added to cart by Recipients Email contains invalid characters', async ({ page }) => {
//     const homePage = new HomePage(page);
//     const productPage = new ProductPage(page);
 
//     await homePage.gotoHome();
//     await homePage.clickTopMenuLink('Gift Cards');
//     await homePage.openProductByPartialName('$25 Virtual Gift Card');
 
//     await productPage.fillGiftCardInfo(42, 'nghi', '^&%phuongnghi@gmail.com', 'dung', 'dunghoang@gmail.com');
//     await productPage.addProductToCart(42, '1');
 
//     // Expected result
//     await expect(productPage.contentMessage).toContainText('Enter valid recipient email');
//     await page.waitForTimeout(2000);
// });
 
// test('AddProduct-035 - Gift card unsuccessful added to cart by Your Name is empty', async ({ page }) => {
//     const homePage = new HomePage(page);
//     const productPage = new ProductPage(page);
 
//     await homePage.gotoHome();
//     await homePage.clickTopMenuLink('Gift Cards');
//     await homePage.openProductByPartialName('$25 Virtual Gift Card');
 
//     await productPage.fillGiftCardInfo(42, 'nghi', 'phuongnghi@gmail.com', '', 'dunghoang@gmail.com');
//     await productPage.addProductToCart(42, '1');
 
//     // Expected result
//     await expect(productPage.contentMessage).toContainText('Enter valid sender name');
//     await page.waitForTimeout(2000);
// });
 
// test('AddProduct-036 - Gift card unsuccessful added to cart by Your Name contains special characters', async ({ page }) => {
//     const homePage = new HomePage(page);
//     const productPage = new ProductPage(page);
 
//     await homePage.gotoHome();
//     await homePage.clickTopMenuLink('Gift Cards');
//     await homePage.openProductByPartialName('$25 Virtual Gift Card');
 
//     await productPage.fillGiftCardInfo(42, 'nghi', 'phuongnghi@gmail.com', 'dung#$^', 'dunghoang@gmail.com');
//     await productPage.addProductToCart(42, '1');
 
//     // Expected result
//     await expect(productPage.contentMessage).toContainText('Enter valid sender name');
//     await page.waitForTimeout(2000);
// });
 
// test('AddProduct-037 - Gift card unsuccessful added to cart by Your Name contains numbers', async ({ page }) => {
//     const homePage = new HomePage(page);
//     const productPage = new ProductPage(page);
 
//     await homePage.gotoHome();
//     await homePage.clickTopMenuLink('Gift Cards');
//     await homePage.openProductByPartialName('$25 Virtual Gift Card');
 
//     await productPage.fillGiftCardInfo(42, 'nghi', 'phuongnghi@gmail.com', 'dung123', 'dunghoang@gmail.com');
//     await productPage.addProductToCart(42, '1');
 
//     // Expected result
//     await expect(productPage.contentMessage).toContainText('Enter valid sender name');
//     await page.waitForTimeout(2000);
// });
 
// test('AddProduct-038 - Gift card unsuccessful added to cart by Your Email is empty', async ({ page }) => {
//     const homePage = new HomePage(page);
//     const productPage = new ProductPage(page);
 
//     await homePage.gotoHome();
//     await homePage.clickTopMenuLink('Gift Cards');
//     await homePage.openProductByPartialName('$25 Virtual Gift Card');
 
//     await productPage.fillGiftCardInfo(42, 'nghi', 'phuongnghi@gmail.com', 'dung', '');
//     await productPage.addProductToCart(42, '1');
 
//     // Expected result
//     await expect(productPage.contentMessage).toContainText('Enter valid sender email');
//     await page.waitForTimeout(2000);
// });
 
// test('AddProduct-039 - Gift card unsuccessful added to cart by Your Email is not in corect format @', async ({ page }) => {
//     const homePage = new HomePage(page);
//     const productPage = new ProductPage(page);
 
//     await homePage.gotoHome();
//     await homePage.clickTopMenuLink('Gift Cards');
//     await homePage.openProductByPartialName('$25 Virtual Gift Card');
 
//     await productPage.fillGiftCardInfo(42, 'nghi', 'phuongnghi@gmail.com', 'dung', 'dunghoanggmail.com');
//     await productPage.addProductToCart(42, '1');
 
//     // Expected result
//     await expect(productPage.contentMessage).toContainText('Enter valid sender email');
//     await page.waitForTimeout(2000);
// });
 
// test('AddProduct-040 - Gift card unsuccessful added to cart by Your Email is not in corect format ".com"', async ({ page }) => {
//     const homePage = new HomePage(page);
//     const productPage = new ProductPage(page);
 
//     await homePage.gotoHome();
//     await homePage.clickTopMenuLink('Gift Cards');
//     await homePage.openProductByPartialName('$25 Virtual Gift Card');
 
//     await productPage.fillGiftCardInfo(42, 'nghi', 'phuongnghi@gmail.com', 'dung', 'dunghoang@gmail');
//     await productPage.addProductToCart(42, '1');
 
//     // Expected result
//     await expect(productPage.contentMessage).toContainText('Enter valid sender email');
//     await page.waitForTimeout(2000);
// });
 
// test('AddProduct-041 - Gift card unsuccessful added to cart by Your Email contains spaces', async ({ page }) => {
//     const homePage = new HomePage(page);
//     const productPage = new ProductPage(page);
 
//     await homePage.gotoHome();
//     await homePage.clickTopMenuLink('Gift Cards');
//     await homePage.openProductByPartialName('$25 Virtual Gift Card');
 
//     await productPage.fillGiftCardInfo(42, 'nghi', 'phuongnghi@gmail.com', 'dung', 'dung hoang@gmail.com');
//     await productPage.addProductToCart(42, '1');
 
//     // Expected result
//     await expect(productPage.contentMessage).toContainText('Enter valid sender email');
//     await page.waitForTimeout(2000);
// });
 
// test('AddProduct-042 - Gift card unsuccessful added to cart by Your Email contains invalid characters', async ({ page }) => {
//     const homePage = new HomePage(page);
//     const productPage = new ProductPage(page);
 
//     await homePage.gotoHome();
//     await homePage.clickTopMenuLink('Gift Cards');
//     await homePage.openProductByPartialName('$25 Virtual Gift Card');
 
//     await productPage.fillGiftCardInfo(42, 'nghi', 'phuongnghi@gmail.com', 'dung', '#$%dunghoang@gmail.com');
//     await productPage.addProductToCart(42, '1');
 
//     // Expected result
//     await expect(productPage.contentMessage).toContainText('Enter valid sender email');
//     await page.waitForTimeout(2000);
// });
 
// // WISHLIST
// test('AddProduct-043 - Add wishlist items to the cart successfully', async ({ page }) => {
//     const homePage = new HomePage(page);
//     const productPage = new ProductPage(page);
//     const wishListPage = new WishListPage(page);
 
//     await homePage.gotoHome();
//     await homePage.clickTopMenuLink('Books');
//     await homePage.openProductByExactName('First Prize Pies');
 
//     await productPage.addToWishlist(37);
//     await productPage.goToWishlist();
 
//     await wishListPage.checkAddToCart();
//     await page.waitForTimeout(2000);
//     await wishListPage.clickAddToCartButton();
 
//     // Expected result
//     await expect(page).toHaveURL(/cart/);
//     await expect(wishListPage.pageTitle).toHaveText('Shopping cart');
// });
 
// test('AddProduct-044 - Add wishlist items to the cart unsuccessfully', async ({ page }) => {
//     const homePage = new HomePage(page);
//     const productPage = new ProductPage(page);
//     const wishListPage = new WishListPage(page);
 
//     await homePage.gotoHome();
//     await homePage.clickTopMenuLink('Books');
//     await homePage.openProductByExactName('First Prize Pies');
 
//     await productPage.addToWishlist(37);
//     await productPage.goToWishlist();
 
//     await wishListPage.clickAddToCartButton();
 
//     // Expected result
//     await expect(wishListPage.contentMessage).toContainText('No products selected to add to cart.');
// });
 
// // UPDATE QUANTITY
// test('UpdateProduct-045 - Quantity product updated successfully', async ({ page }) => {
//     const productPage = new ProductPage(page);
//     const cartPage = new ShoppingCartPage(page);
 
//     await asusLaptop_5(page);
//     await productPage.addProductToCart(5, '1');
//     await productPage.goToCart();
 
//     await cartPage.updateQuantity('Asus Laptop', '3');
 
//     // Expected result
//     await expect(cartPage.quantityInputInRow('Asus Laptop')).toHaveValue('3');
//     await expect(cartPage.subtotalInRow('Asus Laptop')).toContainText('$4,500.00');
//     await page.waitForTimeout(1000);
// });
 
// test('UpdateProduct-046 - Quantity product updated unsuccessfully with quantity less than 1', async ({ page }) => {
//     const productPage = new ProductPage(page);
//     const cartPage = new ShoppingCartPage(page);
 
//     await asusLaptop_5(page);
//     await productPage.addProductToCart(5, '1');
//     await productPage.goToCart();
 
//     await cartPage.updateQuantity('Asus Laptop', '-4');
//     await page.waitForTimeout(1000);
 
//     // Expected result
//     await expect(cartPage.rowErrorMessage('Asus Laptop')).toContainText('This product is required in the quantity of 0');
//     await page.waitForTimeout(1000);
// });
 
// test('UpdateProduct-047 - Quantity product updated unsuccessfully with quantity greater than 0 and less than or equal to 10000', async ({ page }) => {
//     const productPage = new ProductPage(page);
//     const cartPage = new ShoppingCartPage(page);
 
//     await asusLaptop_5(page);
//     await productPage.addProductToCart(5, '1');
//     await productPage.goToCart();
 
//     await cartPage.updateQuantity('Asus Laptop', '10001');
//     await page.waitForTimeout(1000);
 
//     // Expected result
//     await expect(cartPage.rowErrorMessage('Asus Laptop')).toContainText('The maximum quantity allowed for purchase is 10000.');
//     await page.waitForTimeout(1000);
// });
 
// test('UpdateProduct-048 - Verify thay the number of products updated is 0, product is removed from  the cart', async ({ page }) => {
//     const productPage = new ProductPage(page);
//     const cartPage = new ShoppingCartPage(page);
 
//     await asusLaptop_5(page);
//     await productPage.addProductToCart(5, '1');
//     await productPage.goToCart();
 
//     await cartPage.updateQuantity('Asus Laptop', '0');
//     await page.waitForTimeout(1000);
 
//     // Expected result
//     await expect(cartPage.productLinkCount('Asus Laptop')).toHaveCount(0);
// });
 
// test('TotalProduct-049 - Verify Gift Wrapping fee calculation ', async ({ page }) => {
//     const productPage = new ProductPage(page);
//     const cartPage = new ShoppingCartPage(page);
 
//     await asusLaptop_5(page);
//     await productPage.addProductToCart(5, '1');
//     await productPage.goToCart();
 
//     await cartPage.selectGiftWrapping('Yes [+$10.00]');
 
//     // Expected result
//     await expect(cartPage.selectedCheckoutAttributes).toContainText('Gift wrapping: Yes [+$10.00]');
// });





// // // APPLY PRICE BASED ON QUANTITY (CLOTHING)
// // test('AddProduct-026 - Verify that apply the correct price based on quantity of 1', async ({ page }) => {
// //     await womenTShirt_30(page);

// //     // Enter quantity = 1
// //     await page.locator(" #product_enteredQuantity_30").fill("1");
// //     await page.locator(" #add-to-cart-button-30").click();

// //     await page.locator(".cart-label").click();

// //     // Expected result
// //      await expect(page.locator("td[class='unit-price']")).toContainText("$24.00");
// //      await page.waitForTimeout(1000);
// // });

// // test('AddProduct-027 - Verify that apply the correct price based on quantity of 2', async ({ page }) => {
// //     await womenTShirt_30(page);

// //     // Enter quantity = 1
// //     await page.locator(" #product_enteredQuantity_30").fill("2");
// //     await page.locator(" #add-to-cart-button-30").click();

// //     await page.locator(".cart-label").click();

// //     // Expected result
// //      await expect(page.locator("td[class='unit-price']")).toContainText("$24.00");
// //      await page.waitForTimeout(1000);
// // });

// // test('AddProduct-028 - Verify that apply the correct price based on quantity of 3', async ({ page }) => {
// //     await womenTShirt_30(page);

// //     // Enter quantity = 1
// //     await page.locator(" #product_enteredQuantity_30").fill("3");
// //     await page.locator(" #add-to-cart-button-30").click();

// //     await page.locator(".cart-label").click();

// //     // Expected result
// //      await expect(page.locator("td[class='unit-price']")).toContainText("$21.00");
// //      await page.waitForTimeout(1000);
// // });

// // test('AddProduct-029 - Verify that apply the correct price based on quantity of 6', async ({ page }) => {
// //     await womenTShirt_30(page);

// //     // Enter quantity = 1
// //     await page.locator(" #product_enteredQuantity_30").fill("6");
// //     await page.locator(" #add-to-cart-button-30").click();

// //     await page.locator(".cart-label").click();

// //     // Expected result
// //      await expect(page.locator("td[class='unit-price']")).toContainText("$21.00");
// //      await page.waitForTimeout(1000);
// // });

// // test('AddProduct-030 - Verify that apply the correct price based on quantity of 7', async ({ page }) => {
// //     await womenTShirt_30(page);

// //     // Enter quantity = 1
// //     await page.locator(" #product_enteredQuantity_30").fill("7");
// //     await page.locator(" #add-to-cart-button-30").click();

// //     await page.locator(".cart-label").click();

// //     // Expected result
// //      await expect(page.locator("td[class='unit-price']")).toContainText("$19.00");
// //      await page.waitForTimeout(1000);
// // });

// // test('AddProduct-031 - Verify that apply the correct price based on quantity of 9', async ({ page }) => {
// //     await womenTShirt_30(page);

// //     // Enter quantity = 1
// //     await page.locator(" #product_enteredQuantity_30").fill("9");
// //     await page.locator(" #add-to-cart-button-30").click();

// //     await page.locator(".cart-label").click();

// //     // Expected result
// //      await expect(page.locator("td[class='unit-price']")).toContainText("$19.00");
// //      await page.waitForTimeout(1000);
// // });

// // test('AddProduct-032 - Verify that apply the correct price based on quantity of 10', async ({ page }) => {
// //     await womenTShirt_30(page);

// //     // Enter quantity = 1
// //     await page.locator(" #product_enteredQuantity_30").fill("10");
// //     await page.locator(" #add-to-cart-button-30").click();

// //     await page.locator(".cart-label").click();

// //     // Expected result
// //      await expect(page.locator("td[class='unit-price']")).toContainText("$16.00");
// //      await page.waitForTimeout(1000);
// // });

// // test('AddProduct-033 - Verify that apply the correct price based on quantity of 15', async ({ page }) => {
// //     await womenTShirt_30(page);

// //     // Enter quantity = 1
// //     await page.locator(" #product_enteredQuantity_30").fill("15");
// //     await page.locator(" #add-to-cart-button-30").click();

// //     await page.locator(".cart-label").click();

// //     // Expected result
// //      await expect(page.locator("td[class='unit-price']")).toContainText("$16.00");
// //      await page.waitForTimeout(1000);
// // });

// // //DOWLOAD DIGITAL (PENDING)
// // test('AddProduct-034 - Verify that digital content download successful', async ({ page }) => {
// //     await page.goto('https://demo.nopcommerce.com/');

// //     await page.locator("div[class='header-menu'] div:nth-child(4) a:nth-child(1)").click();
// //     await page.waitForTimeout(1000);
    
// //     await page.click("//h2[@class='product-title']//a[normalize-space()='If You Wait (donation)']");
// //     await page.waitForTimeout(1000);
 
// //     await page.locator(".button-2.download-sample-button").click();
// //     // Verify file download

// // });

// // REMOVE
// // test('RemoveProduct-049 - Product successfully removed ', async ({ page }) => {
// //     await asusLaptop_5(page);
// //     // Enter quantity = 1
// //     await page.locator("#product_enteredQuantity_5").fill("1");
// //     await page.locator(" #add-to-cart-button-5").click();

// //     await page.locator(".cart-label").click();

// //       const row = page.locator("tr").filter({
// //         has: page.locator("a", { hasText: "Asus Laptop" })
// //     });

// //     await row.locator("td[class='remove-from-cart']").click();

// //      // Expected result

// //      await expect(
// //         page.locator("td.product a", { hasText: "Asus Laptop" })
// //     ).toHaveCount(0);
// // });
 });