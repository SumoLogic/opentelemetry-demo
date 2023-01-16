const puppeteer = require('puppeteer');

const utils = require('./utils')
require('console-stamp')(console);

const UI_URL_ARG = process.argv.slice(2);
const SHOP_URL = UI_URL_ARG[0] || process.env.SHOP_URL || 'http://localhost:8080'; // The Coffee Bar UI URL
const DELAY = parseInt(process.env.CLICKER_INTERVAL) || 5; // Browser sleep interval in seconds
const BROWSER = process.env.PUPPETEER_PRODUCT || 'chrome'
const DEBUG_DUMPIO_ENV = process.env.DEBUG_DUMPIO || false

const USER_AGENTS = {
    'Windows': {
        'value': '(Windows NT 10.0; Win64; x64)',
        'probScope': [0, 20],
        'browsers': {
            'Firefox': {
                'probScope': [0, 49],
                'versions': {
                    'v1': {
                        'value': 'Gecko/20100101 Firefox/96.0',
                        'probScope': [0, 49],
                    },
                    'v2': {
                        'value': 'Gecko/20100101 Firefox/89.0',
                        'probScope': [50, 100],
                    },
                },
            },
            'Chrome': {
                'probScope': [50, 100],
                'versions': {
                    'v1': {
                        'value': 'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.0 Safari/537.36',
                        'probScope': [0, 49],
                    },
                    'v2': {
                        'value': 'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36',
                        'probScope': [50, 100],
                    },
                },
            }
        },
    },
    'Linux': {
        'value': '(X11; Linux x86_64)',
        'probScope': [21, 45],
        'browsers': {
            'Firefox': {
                'probScope': [0, 49],
                'versions': {
                    'v1': {
                        'value': 'Gecko/20100101 Firefox/96.0',
                        'probScope': [0, 49],
                    },
                    'v2': {
                        'value': 'Gecko/20100101 Firefox/89.0',
                        'probScope': [50, 100],
                    },
                },
            },
            'Chrome': {
                'probScope': [50, 100],
                'versions': {
                    'v1': {
                        'value': 'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.0 Safari/537.36',
                        'probScope': [0, 49],
                    },
                    'v2': {
                        'value': 'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36',
                        'probScope': [50, 100],
                    },
                },
            }
        },
    },
    'Mac': {
        'value': '(Macintosh; Intel Mac OS X 12_2)',
        'probScope': [46, 60],
        'browsers': {
            'Firefox': {
                'probScope': [0, 11],
                'versions': {
                    'v1': {
                        'value': 'Gecko/20100101 Firefox/96.0',
                        'probScope': [0, 49],
                    },
                    'v2': {
                        'value': 'Gecko/20100101 Firefox/89.0',
                        'probScope': [50, 100],
                    },
                },
            },
            'Chrome': {
                'probScope': [12, 35],
                'versions': {
                    'v1': {
                        'value': 'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.0 Safari/537.36',
                        'probScope': [0, 49],
                    },
                    'v2': {
                        'value': 'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36',
                        'probScope': [50, 100],
                    },
                },
            },
            'Safari': {
                'probScope': [36, 100],
                'versions': {
                    'v1': {
                        'value': 'AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.2 Safari/605.1.15',
                        'probScope': [0, 49],
                    },
                    'v2': {
                        'value': 'AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Safari/605.1.15',
                        'probScope': [50, 100],
                    },
                },
            }
        },
    },
    'iOS': {
        'value': '(iPhone; CPU iPhone OS 15_3 like Mac OS X)',
        'probScope': [61, 80],
        'browsers': {
            'Firefox': {
                'probScope': [0, 6],
                'versions': {
                    'v1': {
                        'value': 'AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/96.0 Mobile/15E148 Safari/605.1.15',
                        'probScope': [0, 100],
                    },
                },
            },
            'Chrome': {
                'probScope': [7, 25],
                'versions': {
                    'v1': {
                        'value': 'AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/98.0.4758.85 Mobile/15E148 Safari/604.1',
                        'probScope': [0, 100],
                    },
                },
            },
            'Safari': {
                'probScope': [26, 100],
                'versions': {
                    'v1': {
                        'value': 'AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.2 Mobile/15E148 Safari/604.1',
                        'probScope': [0, 100],
                    },
                },
            }
        },
    },
    'Android': {
        'value': '(Android 12; Mobile; rv:68.0)',
        'probScope': [81, 100],
        'browsers': {
            'Firefox': {
                'probScope': [0, 20],
                'versions': {
                    'v1': {
                        'value': 'Gecko/68.0 Firefox/96.0',
                        'probScope': [0, 100],
                    },
                },
            },
            'Chrome': {
                'probScope': [21, 100],
                'versions': {
                    'v1': {
                        'value': 'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.87 Mobile Safari/537.36',
                        'probScope': [0, 100],
                    },
                },
            },
        },
    },
};

const GLOBAL_SELECTORS = {
    'goShoppingBtnTxt': 'Go Shopping',
    'addToCartBtn': 'button[data-cy="product-add-to-cart"]',
    'placeOrderBtn': 'button[data-cy="checkout-place-order"]',
    'continueShoppingBtnTxt': 'Continue Shopping',
    'cvvInput': 'input[name="creditCardCvv"]',
    'currencySelector': 'select[data-cy="currency-switcher"]',
    'productQuantitySelector': 'select[data-cy="product-quantity"]',
    'productCardSelector': 'div[data-cy="product-card"]'
};

const NAVIGATE_RETRY_SECONDS = 60;

(async () => {
    while (true) {
        let executablePath = null;
        if (BROWSER === 'firefox') {
            executablePath = process.env.FIREFOX_BIN
        } else {
            executablePath = process.env.CHROME_BIN
        }

        let dumpio_debug = null;
        if (DEBUG_DUMPIO_ENV === 'false') {
            dumpio_debug = false;
        } else {
            dumpio_debug = true;
        }

        var browser = null;
        var page = null;
        try {
            browser = await puppeteer.launch({
                executablePath: executablePath,
                headless: true,
                dumpio: dumpio_debug,
                slowMo: 250,
                devtools: false,
                args: ['--devtools-flags=disable', '--disable-software-rasterizer', '--disable-extensions', '--wait-for-browser', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage', '--disable-web-security'],
            });

            page = await browser.newPage();

            var userAgent = utils.chooseUserAgent(USER_AGENTS);
            var userAgentStr = `Mozilla/5.0 ${userAgent[0]} ${userAgent[1]}`;
            await page.setUserAgent(userAgentStr);

            async function clickAndSetFieldValue(selector, value, del) {
                await page.waitForSelector(selector, { timeout: del * 1000 });
                await page.click(selector);
                const input = await page.$(selector);
                await input.click({ clickCount: 3 })
                await page.keyboard.press('Backspace')
                await page.type(selector, String(value), { delay: utils.getRandomInt(1000, 2000) });
            }

            async function click(selector, del) {
                await page.waitForSelector(selector, { timeout: del * 1000 });
                await page.click(selector);
            }

            async function clickBtnTxt(text) {
                const [button] = await page.$x(`//button[contains(., '${text}')]`);
                if (button) {
                    await button.click(button);
                } else {
                    console.log("Couldn't click on: " + text);
                }
            }

            async function clickRandomProduct(delay) {
                await page.waitForSelector(GLOBAL_SELECTORS['productCardSelector'], { timeout: delay * 1000 })
                const products = await page.$$(GLOBAL_SELECTORS['productCardSelector']);
                if (products) {
                    const randomNumber = utils.getRandomInt(0, products.length - 1);
                    console.info(`Ordering product: ${await (await products[randomNumber].getProperty('textContent')).jsonValue()}`);
                    await products[randomNumber].click();
                }
            }

            async function selectRandomQuantity(delay) {
                await page.waitForSelector(GLOBAL_SELECTORS['productQuantitySelector'], { timeout: delay * 1000 });
                const quantity = utils.getRandomInt(1, 10);
                console.info(`Selected quantity: ${quantity}`);
                await page.select(GLOBAL_SELECTORS['productQuantitySelector'], quantity.toString());
            }

            async function selectRandomCurrency(delay) {
                const CURRENCIES = ['USD', 'EUR', 'PLN', 'GBP'];
                const currency = utils.getItemFromList(CURRENCIES);
                await page.waitForSelector(GLOBAL_SELECTORS['currencySelector'], { timeout: delay * 1000 });
                console.info(`Selected currency: ${currency}`);
                await page.select(GLOBAL_SELECTORS['currencySelector'], currency);
            }

            async function addProductToCart() {
                // Select random product from the product list
                await clickRandomProduct(DELAY);

                // Select random quantity
                await selectRandomQuantity(DELAY);

                // Click on Add to cart btn
                await click(GLOBAL_SELECTORS['addToCartBtn']);
            }

            // Navigate to OpenTelemetry Shop
            await utils.retry(() => page.goto(SHOP_URL), NAVIGATE_RETRY_SECONDS);

            // Click Go Shopping btn
            await clickBtnTxt(GLOBAL_SELECTORS['goShoppingBtnTxt']);

            const numberOfProductsToOrder = utils.getRandomInt(0, 3);
            if (numberOfProductsToOrder > 0) {
                console.info(`Number of producsts to order: ${numberOfProductsToOrder}`);
                for (let i = 1; i <= numberOfProductsToOrder; i++) {
                    await addProductToCart()

                    if (numberOfProductsToOrder > 1 && i < numberOfProductsToOrder) {
                        // Click on Continue Shopping button
                        await clickBtnTxt(GLOBAL_SELECTORS['continueShoppingBtnTxt'])
                    }
                }

                // Select Random Currency
                await selectRandomCurrency(DELAY);

                // Set CVV
                await clickAndSetFieldValue(GLOBAL_SELECTORS['cvvInput'], utils.getRandomInt(100, 999), DELAY);

                // Place order
                await click(GLOBAL_SELECTORS['placeOrderBtn']);
            } else {
                console.error(`Products to order must be bigger than 0`);
            }
        } catch (err) {
            console.error(err);
        } finally {
            await page.evaluate(() => {
                window.dispatchEvent(new Event("pagehide"));
            });
            await utils.sleep(5);
            await page.close();
            await browser.close();
        }
    }
})();
