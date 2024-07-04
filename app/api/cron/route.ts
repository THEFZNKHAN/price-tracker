import { NextResponse } from "next/server";
import Product from "@/lib/models/product.model";
import {
    getLowestPrice,
    getHighestPrice,
    getAveragePrice,
    getEmailNotifyType,
} from "@/lib/utils";
import { connectToDB } from "@/lib/mongoose";
import { scrapeAmazonProduct } from "@/lib/scraper";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";

export const maxDuration = 300;
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
    try {
        connectToDB();

        const products = await Product.find({});

        if (!products) throw new Error("No product fetched");

        // SCRAPE LATEST PRODUCT DETAILS & UPDATE DB
        const updatedProducts = await Promise.all(
            products.map(async (currentProduct) => {
                const scrapedProduct = await scrapeAmazonProduct(
                    currentProduct.url
                );

                if (!scrapedProduct) return;

                const updatedPriceHistory = [
                    ...currentProduct.priceHistory,
                    {
                        price: scrapedProduct.currentPrice,
                    },
                ];

                const product = {
                    ...scrapedProduct,
                    priceHistory: updatedPriceHistory,
                    lowestPrice: getLowestPrice(updatedPriceHistory),
                    highestPrice: getHighestPrice(updatedPriceHistory),
                    averagePrice: getAveragePrice(updatedPriceHistory),
                };

                const updatedProduct = await Product.findOneAndUpdate(
                    {
                        url: product.url,
                    },
                    product
                );

                // CHECK EACH PRODUCT'S STATUS & SEND EMAIL ACCORDINGLY
                const emailNotifType = getEmailNotifyType(
                    //@ts-ignore
                    scrapedProduct,
                    currentProduct
                );

                if (emailNotifType && updatedProduct.users.length > 0) {
                    const productInfo = {
                        title: updatedProduct.title,
                        url: updatedProduct.url,
                    };

                    const emailContent = await generateEmailBody(
                        productInfo,
                        emailNotifType
                    );

                    const userEmails = updatedProduct.users.map(
                        (user: any) => user.email
                    );

                    await sendEmail(emailContent, userEmails);
                }

                return updatedProduct;
            })
        );

        return NextResponse.json({
            message: "Ok",
            data: updatedProducts,
        });
    } catch (error: any) {
        throw new Error(`Failed to get all products: ${error.message}`);
    }
}
