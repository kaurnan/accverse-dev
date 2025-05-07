// import { type ClassValue, clsx } from "clsx"
// import { twMerge } from "tailwind-merge"
 
// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }

// export function formatDate(input: string | number): string {
//   const date = new Date(input)
//   return date.toLocaleDateString("en-US", {
//     month: "long",
//     day: "numeric",
//     year: "numeric",
//   })
// }

// export function formatPrice(
//   price: number | string,
//   options: {
//     currency?: "USD" | "EUR" | "GBP" | "BDT"
//     notation?: Intl.NumberFormatOptions["notation"]
//   } = {}
// ) {
//   const { currency = "USD", notation = "compact" } = options

//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency,
//     notation,
//   }).format(Number(price))
// }

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string | number): string {
  const dateObj = date instanceof Date ? date : new Date(date)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(dateObj)
}


export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2
  }).format(amount)
}

export const scrollToElement = (element: HTMLElement) => {
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  });
};

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.substring(0, maxLength)}...`
}

export const validateCaptchaToken = async (token: string, secretKey: string): Promise<boolean> => {
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: secretKey,
        response: token,
      }),
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('Error validating CAPTCHA token:', error);
    return false;
  }
};