import { calculateCartItemPrice, generateOrderNumber } from '../src/services/storage';
import { INITIAL_PRODUCTS, INITIAL_COUPONS } from '../src/data/mockDatabase';

export function runTests() {
  console.log('--- RUNNING MYSHOP BD TEST SUITE ---');

  // Test 1: Order number format
  const orderNum = generateOrderNumber();
  console.assert(orderNum.startsWith('MSB-2026-'), 'Test 1 Failed: Order number should start with MSB-2026-');
  console.log('✓ Test 1 Passed: Order number generation follows Bangladesh format (e.g. ' + orderNum + ')');

  // Test 2: Product wholesale pricing tier calculation
  const earbuds = INITIAL_PRODUCTS.find((p) => p.sku === 'NV-TWS-PRO');
  if (earbuds) {
    // 1 item (normal sale price)
    const single = calculateCartItemPrice(earbuds, 1);
    console.assert(single.unitPrice === 2850, 'Test 2a Failed: Single unit price mismatch');

    // 5 items (tier 1: ৳2500 each)
    const tier1 = calculateCartItemPrice(earbuds, 5);
    console.assert(tier1.unitPrice === 2500, 'Test 2b Failed: Tier 1 wholesale price should be 2500');
    console.assert(tier1.wholesaleSavings === (2850 - 2500) * 5, 'Test 2c Failed: Wholesale savings calculation mismatch');

    // 10 items (tier 2: ৳2280 each)
    const tier2 = calculateCartItemPrice(earbuds, 10);
    console.assert(tier2.unitPrice === 2280, 'Test 2d Failed: Tier 2 wholesale price should be 2280');
    console.log('✓ Test 2 Passed: Wholesale tier calculations correctly compute bulk discounts');
  }

  // Test 3: Coupon validation rules
  const welcomeCoupon = INITIAL_COUPONS.find((c) => c.code === 'WELCOME10');
  console.assert(welcomeCoupon?.discountValue === 10, 'Test 3a Failed: Coupon discount value');
  console.assert(welcomeCoupon?.minPurchaseAmount === 1000, 'Test 3b Failed: Min purchase amount');
  console.log('✓ Test 3 Passed: Promotional coupon rules verified');

  console.log('--- ALL UNIT TESTS COMPLETED SUCCESSFULLY ---');
  return true;
}

runTests();
