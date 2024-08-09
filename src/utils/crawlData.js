const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const getPicture = async (url) => {

	const browser = await puppeteer.launch();
	const page = await browser.newPage();
    await page.goto(url);
	// await page.goto('https://tuongxinh.com.vn/san-pham/tranh-trang-guong-canh-hong-nghe-thuat-tg3338/', { waitUntil: 'networkidle2' });
	// await page.goto('https://tuongxinh.com.vn/san-pham/tranh-led-dong-ho-long-vu-nghe-thuat-ld317/', { waitUntil: 'networkidle2' });
	// await page.goto('https://tuongxinh.com.vn/san-pham/tranh-la-cay-xanh-nghe-thuat-trang-tri-phong-khach-tg3305/', { waitUntil: 'networkidle2' });

	console.log("Capturing")

	const html = await page.evaluate(() => document.querySelector('*').outerHTML);
	const $ = cheerio.load(html);

	let pictureData = {
		name: "",
		price: "",
		description: "",
		image: "",
		images: [],
		specification: "",
		size: []
	}

	let str;
	let tempArray = [];

	// get name
	pictureData.name = $($('.product-title.product_title.entry-title')).text().trim();

	// get price
	str = $($('div.product-container > div.product-main > div > div.product-info.summary.col-fit.col.entry-summary.product-summary > form > div > div.woocommerce-variation-add-to-cart.variations_button.woocommerce-variation-add-to-cart-enabled > div > div > div.wdp_table_outter > table')).attr('data-var-price');
	tempArray = str.substring(1, str.length-1).split(',');
	pictureData.price = tempArray;

	// get specification
	str = "";
	const count = $('#accordion-summary > div > p').length;
	$('#accordion-summary > div > p').each((i, element) => {
		let text = $(element).text();
		if (i == 2) str += text;
		else if (i > 2 && i <= count -3) {
			str += "\n" + text;
		}
	})

	pictureData.specification = str;

	// get description
	str = $($('#accordion-summary > div > p:nth-last-child(2)')).text();
	pictureData.description = str.substring(2, str.length);

	// get image
	pictureData.image = $($('.woocommerce-product-gallery__image')).attr('data-thumb');

	// get images
	tempArray = [];
	$('.woocommerce-product-gallery__image').each((i, element) => {
		let image = $(element).attr('data-thumb');
		tempArray.push(image);
	})
	pictureData.images = tempArray;

	// get size
	tempArray = [];
	$('#pa_chon-kich-thuoc > option').each(async (i, element) => {
		let size = $(element).text()
		if (size != "Chọn một tùy chọn") {
			tempArray.push(size);
		}
	})

	pictureData.size = tempArray.filter(
		(value, index, array) => array.indexOf(value) === index
	);

    return pictureData;
}

module.exports = {
	getPicture,
}