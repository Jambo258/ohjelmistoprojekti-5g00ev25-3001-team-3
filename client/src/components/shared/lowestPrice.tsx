export default function lowestPrice(prices: string[]): string {
  let min_index = 0
  for (let index = 0; index < prices.length; index++) {
    if (Number(prices[index]) > Number(prices[min_index])) {
      min_index = index
    }
  }
  return prices[min_index].replace('.', ',')
}
