const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const getProduct = async (url) => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(url, { timeout: 0 });
	console.log("Capturing")

	const html = await page.evaluate(() => document.querySelector('*').outerHTML);
	const $ = cheerio.load(html);

	let pictureData = {
		name: "",
		variants: [],
		thumbnailImage: "",
		viewImage: "",
		images: [],
		overview: "",
		specification: "",
		material: "",
		instruction: "",
	}

	let str;
	let tempArray = [];

	// get name
	pictureData.name = $($('.product-title.product_title.entry-title')).text().trim();

	// get price
	const dataProductVariations = $('div.product-container > div.product-main > div > div.product-info.summary.col-fit.col.entry-summary.product-summary > form').attr('data-product_variations');
	const variations = JSON.parse(dataProductVariations);
	const prices = variations.map(variation => variation.display_regular_price);

	// get size
	tempArray = [];
	$('#pa_chon-kich-thuoc > option').each(async (i, element) => {
		let size = $(element).text()
		if (size != "Chọn một tùy chọn") {
			tempArray.push(size);
		}
	})
	const sizes = tempArray.filter(
		(value, index, array) => array.indexOf(value) === index
	);

	// merge size and price into variants
	const variants = [];
	for (let i = 0; i < sizes.length; i++) {
		variants.push({
			size: sizes[i],
			price: prices[i]
		})
	}
	pictureData.variants = variants;

	// get specification
	str = "";
	const count = $('#accordion-summary > div > p').length;
	$('#accordion-summary > div > p').each((i, element) => {
		let text = $(element).text();
		if (i == 2) str += text;
		else if (i > 2 && i <= count - 3) {
			str += "\n" + text;
		}
	})

	pictureData.specification = str;

	// get overview
	str = $($('#accordion-summary > div > p:nth-last-child(2)')).text();
	pictureData.overview = str.substring(2, str.length);

	// get thumbnail image
	// pictureData.thumbnailImage = $($('div.product-gallery.large-7.col > div > div.col.large-11.pb-0 > div.woocommerce-product-gallery.woocommerce-product-gallery--with-images.woocommerce-product-gallery--columns-4.images.relative.has-hover > div.woocommerce-product-gallery__wrapper.product-gallery-slider.slider.slider-nav-small.mb-0.is-draggable.flickity-enabled > div > div > div.woocommerce-product-gallery__image.slide.first.is-selected > a')).attr('href');

	// let category = "";
	let scriptImages = [];
	await fetch(url)
		.then(res => {
			if (!res.ok) {
				throw Error(res.statusText);
			}

			return res.text();
		})
		.then(html => {
			const $ = cheerio.load(html);
			const el = [...$("script")].find(e =>
				$(e).text().includes('"primaryImageOfPage":')
			);
			const meta = JSON.parse($(el).text()); // 
			const metadata = meta["@graph"];
			// category = metadata[metadata.length - 1].category;
			// console.log("category", category);
			scriptImages = metadata[metadata.length - 1].image.map(e => e.url);
			pictureData.thumbnailImage = scriptImages[0];
			pictureData.images = scriptImages.slice(1);
		})
		.catch(err => console.error(err));

	// get view image
	// pictureData.viewImage = $($('#popupDrag-bg > img')).attr('src');
	const imgTagString = $('#popupDrag-bg > noscript').text();
	const imgTag = cheerio.load(imgTagString);
	pictureData.viewImage = imgTag('img').attr('src');

	// get images
	// tempArray = [];
	// $('.woocommerce-product-gallery__image').each((i, element) => {
	// 	let image = $(element).attr('data-thumb');
	// 	tempArray.push(image);
	// })
	// pictureData.images = tempArray;

	pictureData.overview = "<p>" + pictureData.overview + "</p>";
	pictureData.material = "<p>Gương pha lê: Được in bằng công nghệ UV trên bề mặt MiCa trong suốt và tráng gương pha lê ngoài cùng, tạo độ bóng sáng, lấp lánh cho mọi bức tranh. Mặt sau tranh được ép &nbsp;1 lớp fomex giúp tranh cứng cáp và hút ẩm tốt nhất. Đây là loại tranh sang trọng bậc nhất thị trường hiện nay.<br>Cả hai chất liệu canvas và gương pha lê đều có khả năng chống thấm nước, chống phai màu. Vì thế, tranh Aloha đảm bảo bền đẹp theo thời gian.</p>";
	pictureData.specification = "<p>Quy cách chất liệu tráng gương cao cấp:</p><ul><li>Công nghệ in Uv in trực tiếp lên mica, mực Uv Mỹ.</li><li>Bề mặt tranh được phủ thêm 1 lớp nhựa epoxy bóng siêu nét.</li><li>Mặt sau được đỡ thêm tấm fomex dày 8mm.</li><li>Đóng khung tranh composite: trắng, đen, vàng.</li></ul>";
	pictureData.instruction = "<p>Chỉ cần dùng khăn ẩm lau trên bề mặt tranh là loại bỏ được bụi bẩn bám trên tranh. Đối với tranh Decorpic, khách hàng không cần sử dụng chất tẩy rửa để làm sạch tranh.</p>";
	return pictureData;
}

const getAllProductLinks = async (url) => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(url, { timeout: 0 });
	console.log("Get all product links")

	const html = await page.evaluate(() => document.querySelector('*').outerHTML);
	const $ = cheerio.load(html);

	let links = [];
	$('div.product-small.box > div.box-image > div.image-fade_in_back > a').each(async (i, element) => {
		let link = $(element).attr('href');
		links.push(link);
	})
	console.log("links", links);
	return links.slice(15, 25);
}

module.exports = {
	getProduct,
	getAllProductLinks,
}