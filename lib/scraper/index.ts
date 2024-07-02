import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractDescription, extractPrice } from "../util";

export async function scrapeAmazonProduct(url: string) {
    if (!url) return;

    const headers = {
        "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
    };

    const optionsDetail = {
        method: "GET",
        url: url,
        headers: headers,
    };

    try {
        const response = await axios(optionsDetail);
        const $ = cheerio.load(response.data);

        const title = $("#productTitle").text().trim();
        const currentPrice = $(
            "span.a-price.a-text-price.a-size-medium.apexPriceToPay span:nth-child(2)"
        )
            .text()
            .trim();
        const originalPrice = extractPrice(
            $("#priceblock_ourprice"),
            $(".a-price.a-text-price span.a-offscreen"),
            $("#listPrice"),
            $("#priceblock_dealprice"),
            $(".a-size-base.a-color-price")
        );
        const images =
            $("#imgBlkFront").attr("data-a-dynamic-image") ||
            $("#landingImage").attr("data-a-dynamic-image") ||
            "{}";
        const imageUrls = Object.keys(JSON.parse(images));
        const currency = extractCurrency($(".a-price-symbol"));
        const discountRate = $(".savingsPercentage")
            .text()
            .replace(/[-%]/g, "");
        const outOfStock =
            $("#availability span").text().trim().toLocaleLowerCase() ===
            "currently unavailable";
        const description = extractDescription($);

        const data = {
            url,
            title: title,
            currency: currency || "$",
            currentPrice: currentPrice || "NaN",
            originalPrice: Number(originalPrice),
            discountRate: Number(discountRate),
            priceHistory: [],
            image: imageUrls[0] || "",
            category: "category",
            reviewsCount: 100, //TODO
            stars: 4.5, //TODO
            description: description,
            isOutOfStock: outOfStock,
        };
        console.log(data);
    } catch (error: any) {
        throw new Error(`Failed to scrape product: ${error.message}`);
    }
}
